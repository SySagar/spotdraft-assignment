import { Request, Response } from 'express';
import { prisma } from '@config/prismaClient';
import { logger } from '@config/logger';

export const addCommentToPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const pdfId = req.params.id;
        const { content } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!content || content.trim() === '') {
            res.status(400).json({ error: 'Content is required' });
            return;
        }

        const pdf = await prisma.pdf.findUnique({ where: { id: pdfId } });
        if (!pdf) {
            res.status(404).json({ error: 'PDF not found' });
            return;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                pdfId,
                authorId: userId
            }
        });

        res.status(201).json({ message: 'Comment added', comment });
    } catch (err) {
        logger.error('Failed to add comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
