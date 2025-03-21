import type { Request, Response } from 'express';
import type { ExtendedRequest } from '../types/extended-request';

export const ping = (request: Request, response: Response) => {
    response.json({ pong: true });
};

export const privatePing = (request: ExtendedRequest, response: Response) => {
    response.json({ pong: true, slug: request.userSlug });
};
