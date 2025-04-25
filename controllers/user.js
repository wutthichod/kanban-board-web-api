import prisma from "../prismaClient.js";

export async function invite(req, res, next) {
    const userId = req.user.id; 
    const { boardId, invite } = req.body;

    try {

        const board = await prisma.board.findUnique({
            where: { id: boardId },
        });
        if (!board) throw new Error("Board not found");

        const isOwner = board.ownerId === userId;
        if (!isOwner) throw new Error("You do not have permission to invite users to this board");

        const invitedUser = await prisma.user.findUnique({
            where: { id: invite },
        });
        if (!invitedUser) throw new Error("User not found");

        const existingCollaborator = await prisma.board.update({
            where: { id: boardId },
            data: {
                collaborator: {
                    connect: { id: invite }, 
                },
            }
        });

        return res.status(200).json({
            success: true,
            message: `User with ID ${invite} added as a collaborator to the board.`,
        });

    } catch (error) {
        const status = error.message === "Board not found" || error.message === "User not found" ? 404 :
                       error.message === "You do not have permission to invite users to this board" ? 403 : 500;
        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }
}
