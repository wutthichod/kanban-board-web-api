import express from 'express';
import { invite } from '../controllers/user.js';

const router = express.Router();

router.route('/').post(invite);

export default router;