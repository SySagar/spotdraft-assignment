import { Request, Response, type Express } from 'express';
import { prisma } from '@config/prismaClient';
import { logger } from '@config/logger';
import { generatePresignedUrl, uploadFileToS3 } from '@utils/s3.services';


export const uploadPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        console.log('file', files)

        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const uploadedPdfs = await Promise.all(
            files.map(async (file) => {
                const key = `pdfs/${userId}/${Date.now()}_${file.originalname}`;

                await uploadFileToS3(file, key);

                return prisma.pdf.create({
                    data: {
                        title: file.originalname,
                        fileUrl: key,
                        ownerId: userId,
                    },
                });
            })
        );

        res.status(201).json({
            message: `${uploadedPdfs.length} PDF(s) uploaded successfully`,
            uploadedPdfs
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error during upload' });
    }
};

export const searchPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const search = (req.query.search as string)?.toLowerCase();

        const pdfs = await prisma.pdf.findMany({
            where: {
                ownerId: userId,
                ...(search && {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                })
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ pdfs });
    } catch (err) {
        console.error('Failed to fetch PDFs:', err);
        res.status(500).json({ error: 'Failed to fetch PDFs' });
    }
};

export const getPdfById = async (req: Request, res: Response): Promise<void> => {
    try {
        const pdfId = req.params.id;
        const userId = req.user?.userId;

        const pdf = await prisma.pdf.findUnique({
            where: { id: pdfId },
            include: {
                comments: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        author: {
                            select: { id: true, name: true }
                        }
                    }
                }
            }
        });

        if (!pdf) {
            res.status(404).json({ error: 'PDF not found' });
            return;
        }

        if (pdf.ownerId !== userId) {
            res.status(403).json({ error: 'You are not authorized to view this PDF' });
            return;
        }

        res.json({
            id: pdf.id,
            title: pdf.title,
            fileUrl: pdf.fileUrl,
            createdAt: pdf.createdAt,
            comments: pdf.comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                author: comment.author ? { id: comment.author.id, name: comment.author.name } : null
            }))
        });
    } catch (error) {
        logger.error('Error fetching PDF by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllPdfs = async (req: Request, res: Response): Promise<void> => {
    logger.info('thunder')
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const pdfs = await prisma.pdf.findMany({
            orderBy: { createdAt: 'desc' }
        });


        res.status(200).json({ pdfs });
    } catch (error) {
        logger.error('Error fetching all PDFs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getPresignedPdfUrl = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({ error: "Missing PDF ID" });
        }

        const pdf = await prisma.pdf.findUnique({ where: { id } });
        if (!pdf) {
            res.status(404).json({ error: "PDF not found" });
            return;
        }

        const url = await generatePresignedUrl(pdf.fileUrl);
        res.status(200).json({ url });
    } catch (err) {
        console.error("Presigned URL error:", err);
        res.status(500).json({ error: "Internal error generating URL" });
    }
};
