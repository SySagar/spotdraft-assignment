import express from 'express';
import { authenticate } from '@middlewares/auth';
import { sharePdf, getSharedPdfByToken } from '@controllers/share.controller';

const router = express.Router();

router.post('/pdf/:id/share', authenticate, sharePdf);
router.get('/share/:token', getSharedPdfByToken);

export default router;
