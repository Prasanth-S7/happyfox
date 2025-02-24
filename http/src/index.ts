import express from 'express';
import cors from 'cors';
import https from 'https';  // Import HTTPS module
import fs from 'fs';
import { PORT } from './config';
import { userRouter } from './routes/user';
import { chatRouter } from './routes/chat';
import { forumRouter } from './routes/forum';
import eventRouter from './routes/event/event';
import morgan from 'morgan';
import { postRouter } from './routes/post';
import cookieParser from 'cookie-parser';
import router from './routes/router';

const app = express();

const privateKey = fs.readFileSync('../ssl/server.key', 'utf8');
const certificate = fs.readFileSync('../ssl/server.crt', 'utf8');  
const credentials = { key: privateKey, cert: certificate };

app.use(morgan('dev'));
app.use(cors({
    origin: ["http://localhost:5173", "http://172.16.59.133:5173", "https://arize.pages.dev"], 
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));
app.use('/api/v1', router);

// Create an HTTPS server
https.createServer(credentials, app).listen(PORT, () => {
    console.log(`🚀 HTTPS Server started on port ${PORT}`);
});
