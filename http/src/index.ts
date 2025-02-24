import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { userRouter } from './routes/user';
import { chatRouter } from './routes/chat';
import { forumRouter } from './routes/forum';
import eventRouter from './routes/event/event';
import morgan from 'morgan'

const app = express();

app.use(morgan('combined'))
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/forum', forumRouter);
app.use('/api/v1/event', eventRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})