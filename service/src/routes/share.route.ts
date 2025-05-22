import express from 'express';
import { authenticate } from '@middlewares/auth';
import { sharePdf, inviteUserToPdf, getSharedPdfByToken, getPdfById } from '@controllers/share.controller';

const router = express.Router();

router.post('/pdf/:id/share', authenticate, sharePdf);
router.post('/pdf/:id/invite', authenticate, inviteUserToPdf);
router.get('/share/:token', getSharedPdfByToken);
router.get('/pdf/:id', getPdfById);

export default router;
