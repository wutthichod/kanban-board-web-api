import prisma from '../prismaClient.js'

export async function createTask (req, res, next) {

    const userId = req.user.id;
    const { title, description, dueDate, position, columnId, taskAssignee } = req.body;

    try {
        const column = await prisma.column.findUnique({ where: { id: columnId } });
        if (!column) throw new Error("Column not found");

        await checkBoardOwnership(column.boardId, userId);

        const created = await prisma.task.create({
            data: {
                title,
                description,
                dueDate,
                position,
                columnId,
                assignees: {
                    connect: taskAssignee.map(userId => ({ userId })),
                }
            }
        });

        return res.status(200).json({
            success: true,
            created
        });

    } catch (error) {
        const status = error.message === "Access denied" ? 403 :
                       error.message === "Column not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message
        });
    }

}

export async function editTask (req, res, next) {

    const userId = req.user.id;
    const taskId = req.params.id;
    const { title, position, columnId, taskAssignee } = req.body;

    try {

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });
        if (!task) throw new Error("Task not found");

        const column = await prisma.column.findUnique({
            where: { id: columnId },
        });
        if (!column) throw new Error("Column not found");

        await checkBoardOwnership(column.boardId, userId);

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (position !== undefined) updateData.position = position;
        if (columnId !== undefined) updateData.columnId = columnId;
        if (taskAssignee !== undefined) {
            updateData.assignees = {
                connect: taskAssignee.map(userId => ({ userId }))
            };
        }

        const updated = await prisma.task.update({
            where: { id: taskId },
            data: updateData
        });

        return res.status(200).json({
            success: true,
            updated: updated,
        });

    } catch (error) {
        const status = error.message === "Access denied" ? 403 :
                       error.message === "Column not found" ? 404 : 
                       error.message === "Task not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message
        });
    }

}

export async function deleteTask (req, res, next) {
    const userId = req.user.id;
    const taskId = req.params.id;

    try {

        const task = await prisma.task.findUnique({
            where: { id : taskId },
        });
        if (!task) throw new Error("Task not found");

        const column = await prisma.column.findUnique({ where: { id: task.columnId } });
        if (!column) throw new Error("Column not found");

        await checkBoardOwnership(column.boardId, userId);


        const deleted = await prisma.task.delete({
            where: { id : taskId },
        });

        return res.status(200).json({
            success: true,
            deleted,
        });

    } catch (error) {
        const status = error.message === "Access denied" ? 403 :
                       error.message === "Column not found" ? 404 : 
                       error.message === "Task not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message
        });
    }
}