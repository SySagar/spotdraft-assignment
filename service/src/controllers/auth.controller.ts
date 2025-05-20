import { prisma } from "@config/prismaClient";
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from "@config/logger";

const JWT_SECRET = process.env.JWT_SECRET ?? 'default_secret';

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { name, email, passwordHash }
        });
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        logger.warn(`Signup failed for ${email}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        res.status(400).json({ error: 'Email already exists or invalid data' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;


    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user?.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });


};