import { Request, Response, type Express } from 'express';
import { prisma } from '@config/prismaClient';

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
                const pdf = await prisma.pdf.create({
                    data: {
                        title: file.originalname,
                        fileUrl: `/uploads/${file.filename}`,
                        ownerId: userId
                    }
                });
                return pdf;
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
