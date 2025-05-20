import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { logger } from '@config/logger';

import authRoutes from '@routes/auth.route';
import pdfRoutes from '@routes/pdf.route';

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(
    morgan('combined', {
        stream: {
            write: (message: string) => {
                logger.info(message.trim());
            }
        }
    })
);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.use('/test', (_, res) => {
    res.json("Hello from server")
});

//routes usage
app.use('/auth', authRoutes);
app.use('/pdf', pdfRoutes);

export default app;
