import express from 'express'
import { getBoard, getBoards, createBoard, renameBoard, deleteBoard } from '../controllers/board.js';

const router = express.Router();

router
    .route('/')
    .get(getBoards)
    .post(createBoard);

router
    .route('/:id')
    .get(getBoard)
    .put(renameBoard)
    .delete(deleteBoard);

export default router;