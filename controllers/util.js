export async function checkBoardOwnership(boardId, userId) {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
    });
  
    if (!board) {
        throw new Error("Board not found");
    }
  
    if (board.ownerId !== userId) {
        throw new Error("Access denied");
    }
  
    return board;
}