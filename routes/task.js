import express from 'express';
import { createTask, editTask, deleteTask } from '../controllers/task';

const router = express.Router();

router
    .route('/')
    .post(createTask);

router
    .route('/:id')
    .post(editTask)
    .delete(deleteTask);