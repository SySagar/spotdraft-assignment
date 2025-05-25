import express from 'express';
import { authenticate } from '@middlewares/auth';
import { uploadPdf, searchPdf, getPdfById, getAllPdfs, getPresignedPdfUrl, deletePdf } from '@controllers/pdf.controller';
import { multerClient } from '@config/multerClient';
import { addCommentToPdf, getComments } from '@controllers/comments.controller';

const router = express.Router();

router.get('/getAllPDFs', authenticate, getAllPdfs);
router.post('/upload', authenticate, multerClient.array('pdfs', 5), uploadPdf);
router.get('/searchPdf', authenticate, searchPdf);
router.post('/deletePdf/:id', authenticate, deletePdf);
router.get('/:id', authenticate, getPdfById);
router.post('/comment/:id', authenticate, addCommentToPdf);
router.get('/comment/:id', getComments);
router.post('/presignedUrl', authenticate, getPresignedPdfUrl);

export default router;
