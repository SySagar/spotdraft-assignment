// singleton prisma clinet so that multiple connection to db is prevented.

import { PrismaClient } from '../../generated/prisma';

export const prisma = new PrismaClient();