import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserBySlug } from '../services/user';
import type { ExtendedRequest } from '../types/extended-request';

export const createJWT = (slug: string) => {
    return jwt.sign({ slug }, process.env.JWT_SECRET as string);
};

export const verifyJWT = (
    request: ExtendedRequest,
    response: Response,
    next: NextFunction
) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        response.status(401).json({ error: 'Acesso negado' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        async (error, decoded: any) => {
            if (error) {
                response.status(401).json({ error: 'Acesso negado' });
                return;
            }
            const user = await findUserBySlug(decoded.slug);
            if (!user) {
                response.status(401).json({ error: 'Acesso negado' });
                return;
            }

            request.userSlug = user.slug;
            next();
        }
    );
};
