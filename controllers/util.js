import prisma from '../prismaClient.js';

export async function checkBoardOwnership(boardId, userId) {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { collaborator: true },
    });

    if (!board) {
        throw new Error("Board not found");
    }

    const isOwner = board.ownerId === userId;
    const isCollaborator = board.collaborator.some(user => user.id === userId);

    if (!isOwner && !isCollaborator) {
        throw new Error("Access denied");
    }

    return board;
}
