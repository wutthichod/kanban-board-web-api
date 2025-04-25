import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.js';
import board from './routes/board.js';
import column from './routes/column.js';
import task from './routes/task.js';
import user from './routes/user.js';
import protect from './middleware/middleware.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', auth);

app.use(protect);

app.use('/board', board);
app.use('/column', column);
app.use('/task', task);
app.use('/user', user);

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port: ${process.env.PORT}`)
});