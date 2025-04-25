import express from 'express';
import { createTask, editTask, deleteTask } from '../controllers/task.js';

const router = express.Router();

router
    .route('/')
    .post(createTask);

router
    .route('/:id')
    .put(editTask)
    .delete(deleteTask);

export default router;