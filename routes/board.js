import express from 'express'
import { getBoard, getBoards, createBoard, renameBoard, deleteBoard } from '../controllers/board';

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getBoards)
    .post(createBoard);

router
    .route('/:id')
    .get(getBoards)
    .put(renameBoard)
    .delete(deleteBoard);