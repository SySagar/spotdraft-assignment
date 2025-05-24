import { Request, Response } from 'express';
import { prisma } from '@config/prismaClient';
import crypto from 'crypto';
import { generatePresignedUrl } from '@utils/s3.services';

//single useer invite
export const sharePdf = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const pdfId = req.params.id;
        const email = req.body.email;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const pdf = await prisma.pdf.findUnique({
            where: { id: pdfId },
            include: { invitedUsers: true }
        });

        if (!pdf) {
            res.status(404).json({ error: 'PDF not found' });
            return;
        }

        if (pdf.ownerId !== userId) {
            res.status(403).json({ error: 'Only the owner can generate a public link' });
            return;
        }

        const existing = await prisma.sharedLink.findFirst({
            where: { pdfId }
        });

        if (existing) {
            const shareUrl = `${process.env.BASE_URL ?? 'http://localhost:5173'}/share/${existing.token}`;
            res.status(200).json({
                message: 'PDF already shared',
                shareUrl,
                token: existing.token
            });
            return;
        }

        const token = crypto.randomBytes(16).toString('hex');

        const sharedLink = await prisma.sharedLink.create({
            data: {
                pdfId,
                token,
                email
            }
        });

        const shareUrl = `${process.env.BASE_URL ?? 'http://localhost:5173'}/share/${token}`;

        const invitedUser = await prisma.user.findUnique({
            where: { email }
        });

        if (invitedUser) {
            const alreadyInvited = pdf.invitedUsers.some(user => user.id === invitedUser.id);
            if (!alreadyInvited) {
                await prisma.pdf.update({
                    where: { id: pdfId },
                    data: {
                        invitedUsers: {
                            connect: { id: invitedUser.id }
                        }
                    }
                });
            }
        }

        res.status(201).json({
            message: 'User invited to this PDF',
            shareUrl,
            token
        });
    } catch (err) {
        console.error('Public share error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//ggroup invite
// export const inviteUserToPdf = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = req.user?.userId;
//         const pdfId = req.params.id;
//         const { email } = req.body;

//         if (!userId) {
//             res.status(401).json({ error: 'Unauthorized' });
//             return;
//         }

//         if (!email) {
//             res.status(400).json({ error: 'Email is required' });
//             return;
//         }

//         const pdf = await prisma.pdf.findUnique({ where: { id: pdfId } });
//         if (!pdf) {
//             res.status(404).json({ error: 'PDF not found' });
//             return;
//         }

//         if (pdf.ownerId !== userId) {
//             res.status(403).json({ error: 'Only the owner can invite users' });
//             return;
//         }

//         const invitedUser = await prisma.user.findUnique({ where: { email } });
//         if (!invitedUser) {
//             res.status(404).json({ error: 'User with this email is not registered' });
//             return;
//         }

//         const existingInvite = await prisma.pdfGroupAccessInvite.findFirst({
//             where: {
//                 pdfId,
//                 invitedId: invitedUser.id
//             }
//         });

//         if (existingInvite) {
//             res.status(409).json({ error: 'User is already invited to this PDF' });
//             return;
//         }

//         const invite = await prisma.pdfGroupAccessInvite.create({
//             data: {
//                 pdfId,
//                 invitedId: invitedUser.id
//             }
//         });

//         res.status(201).json({
//             message: 'User invited successfully',
//             invitedUser: {
//                 id: invitedUser.id,
//                 name: invitedUser.name,
//                 email: invitedUser.email
//             },
//             inviteId: invite.id
//         });
//     } catch (err) {
//         console.error('Invite error:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

export const getSharedPdfByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.params.token;
        const userId = (req as any).query?.userId;


        const sharedLink = await prisma.sharedLink.findUnique({
            where: { token },
            include: {
                pdf: {
                    include: {
                        invitedUsers: true
                    }
                }
            }
        });


        if (!sharedLink) {
            res.status(404).json({ error: 'Invalid or expired share link' });
            return;
        }

        const pdf = sharedLink.pdf;

        const comments = await prisma.comment.findMany({
            where: { pdfId: pdf.id },
            orderBy: { createdAt: 'asc' },
            include: {
                author: {
                    select: { id: true, name: true }
                }
            }
        });
        const allowCommenting = userId && (pdf.ownerId === userId || pdf.invitedUsers.some(invite => invite.id === userId));
        console.log('userid', userId, pdf.ownerId, allowCommenting)
        const url = await generatePresignedUrl(pdf.fileUrl);

        res.status(200).json({
            id: pdf.id,
            title: pdf.title,
            fileUrl: url,
            createdAt: pdf.createdAt,
            shared: true,
            allowCommenting: allowCommenting ?? false,
            comments: comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                author: comment.author ? {
                    id: comment.author.id,
                    name: comment.author.name
                } : null
            }))
        });
    } catch (err) {
        console.error('Shared token fetch error:', err);
        res.status(500).json({ error: 'Failed to access shared PDF' });
    }
};


// export const getPdfById = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = req.user?.userId;
//         const pdfId = req.params.id;

//         const pdf = await prisma.pdf.findUnique({
//             where: { id: pdfId },
//             include: {
//                 comments: {
//                     orderBy: { createdAt: 'asc' },
//                     include: {
//                         author: {
//                             select: { id: true, name: true }
//                         }
//                     }
//                 }
//             }
//         });

//         if (!pdf) {
//             res.status(404).json({ error: 'PDF not found' });
//             return;
//         }

//         const isOwner = pdf.ownerId === userId;

//         const isInvited = await prisma.pdfGroupAccessInvite.findFirst({
//             where: {
//                 pdfId,
//                 invitedId: userId
//             }
//         });

//         if (!isOwner && !isInvited) {
//             res.status(403).json({ error: 'Access denied' });
//             return;
//         }

//         res.status(200).json({
//             id: pdf.id,
//             title: pdf.title,
//             fileUrl: pdf.fileUrl,
//             createdAt: pdf.createdAt,
//             comments: pdf.comments.map((c) => ({
//                 id: c.id,
//                 content: c.content,
//                 createdAt: c.createdAt,
//                 author: c.author ? { id: c.author.id, name: c.author.name } : null
//             }))
//         });
//     } catch (err) {
//         console.error('Group access error:', err);
//         res.status(500).json({ error: 'Server error while fetching PDF' });
//     }
// };
