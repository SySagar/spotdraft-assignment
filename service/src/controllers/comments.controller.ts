import { Request, Response } from 'express';
import { prisma } from '@config/prismaClient';
import { isEmpty } from 'lodash';

export const addCommentToPdf = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        const { content } = req.body;

        if (isEmpty(content))
            res.status(400).json({ "error": 'No content exists' })

        const comment = await prisma.comment.create({
            data: {
                pdfId: id,
                authorId: userId,
                content,
            },
            include: {
                author: { select: { name: true, email: true } },
            },
        });

        res.status(201).json({ comment });
    } catch {
        res.status(500).json({ error: "Failed to add comment" });
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

export const getComments = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (isEmpty(id))
            res.status(400).json({ error: "PDF id doesn't exists" })

        const comments = await prisma.comment.findMany({
            where: { pdfId: id },
            orderBy: { createdAt: "desc" },
            include: {
                author: { select: { name: true, email: true } },
            },
        });

        res.status(200).json({ comments });
    } catch {
        res.status(500).json({ error: "Failed to load comments" });
    }
};