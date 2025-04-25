import express from 'express'
import { createColumn, updateColumn, deleteColumn } from '../controllers/column.js';


const router = express.Router();

router
    .route('/')
    .post(createColumn)

router
    .route('/:id')
    .put(updateColumn)
    .delete(deleteColumn)

export default router;