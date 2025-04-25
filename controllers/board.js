export async function createColumn (req, res, next) {

    const userId = req.user.id;
    const { boardId, name, position } = req.body;

    try {

            await checkBoardOwnership(boardId, userId);

            const created = await prisma.column.create({
                    data: {
                            name,
                            position,
                            boardId
                    }
            });

            return res.status(201).json({
                    success: true,
                    column: created
            });

    } catch (error) {

            const status = error.message === "Access denied" ? 403 :
                           error.message === "Board not found" ? 404 : 500;

            console.log(error);
            return res.status(status).json({
                    success: false,
                    message: error.message
            });

    }

}

export async function updateColumn (req, res, next) {

    const userId = req.user.id;
    const columnId = parseInt(req.params.id, 10);
    const { name, position } = req.body;

    try {

            const column = await prisma.column.findUnique({
                    where: { id: columnId }
            });

            if (!column) {
                    throw new Error("Column not found");
            }

            await checkBoardOwnership(column.boardId, userId);

            const updated = await prisma.column.update({
                    where: { id: columnId },
                    data: { name, position }
            });

            return res.status(200).json({
                    success: true,
                    column: updated
            });

    } catch (error) {

            const status = error.message === "Access denied" ? 403 :
                           error.message === "Board not found" || error.message === "Column not found" ? 404 : 500;

            console.log(error);
            return res.status(status).json({
                    success: false,
                    message: error.message
            });

    }

}

export async function deleteColumn (req, res, next) {

    const userId = req.user.id;
    const columnId = parseInt(req.params.id, 10);

    try {

            const column = await prisma.column.findUnique({
                    where: { id: columnId }
            });

            if (!column) {
                    throw new Error("Column not found");
            }

            await checkBoardOwnership(column.boardId, userId);

            const deleted = await prisma.column.delete({
                    where: { id: columnId }
            });

            return res.status(200).json({
                    success: true,
                    column: deleted
            });

    } catch (error) {

            const status = error.message === "Access denied" ? 403 :
                           error.message === "Board not found" || error.message === "Column not found" ? 404 : 500;

            console.log(error);
            return res.status(status).json({
                    success: false,
                    message: error.message
            });

    }
}