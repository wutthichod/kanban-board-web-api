import express from 'express'
import { createColumn, updateColumn, deleteColumn } from '../controllers/column';


const router = express.Router();

router
    .route('/')
    .create(createColumn)

router
    .route('/:id')
    .put(updateColumn)
    .delete(deleteColumn)