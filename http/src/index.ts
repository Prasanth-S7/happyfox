import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { userRouter } from './routes/user';
import { chatRouter } from './routes/chat';
import { forumRouter } from './routes/forum';
import eventRouter from './routes/event/event';
import morgan from 'morgan'
import { postRouter } from './routes/post';
import cookieParser from 'cookie-parser';

const app = express();

app.use(morgan('combined'))
app.use(cors({
    origin: ["http://localhost:5173", "http://172.16.59.133:5173"], 
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/forum', forumRouter);
app.use('/api/v1/event', eventRouter);
app.use('/api/v1/post', postRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})