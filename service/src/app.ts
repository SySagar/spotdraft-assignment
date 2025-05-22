import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { logger } from '@config/logger';

import authRoutes from '@routes/auth.route';
import pdfRoutes from '@routes/pdf.route';
import shareRoutes from '@routes/share.route';

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

const allowedOrigins = [
    "http://localhost:5173",
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

app.use('/test', (_, res) => {
    res.json("Hello from server")
});

//routes usage
app.use('/auth', authRoutes);
app.use('/pdf', pdfRoutes);
app.use(shareRoutes);

export default app;
