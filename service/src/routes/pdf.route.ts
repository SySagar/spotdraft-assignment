import express from 'express';
import { authenticate } from '@middlewares/auth';
import { uploadPdf } from '@controllers/pdf.controller';
import { multerUpload } from '@config/multerClient';

const router = express.Router();

router.post('/upload', authenticate, multerUpload.array('files', 5), uploadPdf);

export default router;
