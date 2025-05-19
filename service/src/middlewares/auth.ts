import { Request, Response, NextFunction } from 'express';
import { tokenVerify } from '@utils/tokenVerify'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = tokenVerify(token)
        req.user = decoded;
        next();
    } catch {
        res.status(403).json({ error: 'Invalid token' });
    }
};
