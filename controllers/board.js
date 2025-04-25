import prisma from "../prismaClient.js";
import { checkBoardOwnership } from "./util.js";

export async function getBoards (req, res, next) {

    const userId = req.user.id;

    try {

        const boards = await prisma.board.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { collaborator: { some: { id: userId } } }
                ]
            },
            include: {
                columns: {
                    include: {
                        tasks: true
                    }
                }
            },
        });

        if (boards.length === 0) {
            return res.status(400).json({
                success: true,
                message: "User has not created any board"
            });
        }

        return res.status(200).json({
            success: true,
            boards
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "GetBoard Error"
        });

    }
}

export async function getBoard (req, res, next) {
    
    const userId = req.user.id;
    const boardId = parseInt(req.params.id, 10);

    try {

        await checkBoardOwnership(boardId, userId);
        
        const board = await prisma.board.findUnique({
            where: { id : boardId },
            include: {
                columns: {
                    include: {
                        tasks: true
                    }
                }
            },
        });

        return res.status(200).json({
            success: true,
            board
        });
    } catch (error) {

        const status = error.message === "Access denied" ? 403 :
                       error.message === "Board not found" ? 404 : 500;

        console.log(error);
        return res.status(status).json({
            sucess: false,
            message: error.message,
        })
    }

}

export async function createBoard (req, res, next) {
    
    const userId = req.user.id;
    const { name } = req.body;

    try {

        const created = await prisma.board.create({
            data: {
                ownerId : userId,
                name
            }
        });

        return res.status(200).json({
            success: true,
            created
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Create board error"
        });
    }

}


export async function renameBoard (req, res, next) {

    const userId = req.user.id;
    const boardId = parseInt(req.params.id, 10);
    const { name } = req.body;

    try {

        await checkBoardOwnership(boardId, userId);

        const updated = await prisma.board.update({
            where: { 
                id : boardId,
            },
            data: {
                name : name,
            }
        });

        return res.status(200).json({
            success: true,
            updated
        })

    } catch (error) {

        const status = error.message === "Access denied" ? 403 :
                       error.message === "Board not found" ? 404 : 500;

        console.log(error);
        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }

}


export async function deleteBoard (req, res, next) {
    
    const userId = req.user.id;
    const boardId = parseInt(req.params.id, 10);

    try {

        await checkBoardOwnership(boardId, userId);

        const deleted = await prisma.board.delete({
            where: { id : boardId },
        });

        return res.status(200).json({
            success: true,
            deleted
        });

    } catch (error) {

        const status = error.message === "Access denied" ? 403 :
                   error.message === "Board not found" ? 404 : 500;

        console.log(error);
        return res.status(status).json({
            success: false,
            message: error.message,
        });    

    }

}