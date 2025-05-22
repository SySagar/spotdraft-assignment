import express from 'express';
import { signup, login, verifySession } from '@controllers/auth.controller';
import { authenticate } from '@middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', authenticate, verifySession);

export default router;
