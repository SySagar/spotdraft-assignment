import jwt from 'jsonwebtoken';

export interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
}


declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}


const JWT_SECRET = process.env.JWT_SECRET ?? 'default_secret';

export const tokenVerify = (token: string) => {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    return decoded;
}