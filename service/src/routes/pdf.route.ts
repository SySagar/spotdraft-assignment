import express from 'express';
import { authenticate } from '@middlewares/auth';
import { uploadPdf, searchPdf, getPdfById, getAllPdfs, getPresignedPdfUrl } from '@controllers/pdf.controller';
import { multerUpload } from '@config/multerClient';
import { addCommentToPdf } from '@controllers/comments.controller';

const router = express.Router();

router.get('/getAllPDFs', authenticate, getAllPdfs);
router.post('/upload', authenticate, multerUpload.array('files', 5), uploadPdf);
router.get('/searchPdf', authenticate, searchPdf);
router.get('/:id', authenticate, getPdfById);
router.post('/:id/comment', authenticate, addCommentToPdf);
router.post('/presignedUrl', authenticate, getPresignedPdfUrl);

export default router;
