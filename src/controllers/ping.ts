import type { Request, Response } from 'express';

export const ping = (request: Request, response: Response) => {
    response.json({ pong: true });
};
