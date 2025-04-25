import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import auth from './routes/auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', auth);

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port: ${process.env.PORT}`)
});