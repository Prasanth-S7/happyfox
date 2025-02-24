import 'dotenv/config';
export const PORT = process.env.PORT;
export const BACKEND_URL = process.env.MODE === 'production' ? 'http://13.49.74.101:3000' : 'http://localhost:3000';