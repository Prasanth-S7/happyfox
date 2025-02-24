import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import { userRouter } from './routes/user';
import { chatRouter } from './routes/chat';
import { forumRouter } from './routes/forum';

const app = express();

app.use(cors());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/forum', forumRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})