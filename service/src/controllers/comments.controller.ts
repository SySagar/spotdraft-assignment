import { Request, Response } from 'express';
import { prisma } from '@config/prismaClient';
import { logger } from '@config/logger';
import { isEmpty } from 'lodash';

export const addCommentToPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const pdfId = req.params.id;
        const { content } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!content || isEmpty(content)) {
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


export const addPublicComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.params.token;
        const { content } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Login required to comment' });
            return;
        }

        if (!content || typeof content !== 'object') {
            res.status(400).json({ error: 'Invalid comment content' });
            return;
        }

        const sharedLink = await prisma.sharedLink.findUnique({
            where: { token }
        });

        if (!sharedLink) {
            res.status(404).json({ error: 'Invalid or expired share link' });
            return;
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                pdfId: sharedLink.pdfId,
                authorId: userId
            }
        });

        res.status(201).json({ message: 'Comment posted', comment });
    } catch (err) {
        console.error('Public comment error:', err);
        res.status(500).json({ error: 'Server error while commenting' });
    }
};
