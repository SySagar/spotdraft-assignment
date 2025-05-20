import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '@routes/auth.route';
import pdfRoutes from '@routes/pdf.route';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.use('/test', (_, res) => {
    res.json("Hello from server")
});
app.use('/auth', authRoutes);
app.use('/pdf', pdfRoutes);

export default app;
