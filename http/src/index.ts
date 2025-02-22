import express from 'express';
import cors from 'cors';
import { PORT } from './config';

const app = express();

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})