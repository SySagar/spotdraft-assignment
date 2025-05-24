import { Request, Response } from "express";
import { prisma } from "@config/prismaClient";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

export const getSidebarCounts = async (req: Request, res: Response) => {
    const userCount = await prisma.user.count();
    // const groupCount = await prisma.group.count();

    res.json({ userCount });
};