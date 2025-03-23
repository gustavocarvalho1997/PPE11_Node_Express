import type { Response } from 'express';
import { getTrending } from '../services/trend';
import type { ExtendedRequest } from '../types/extended-request';

export const getTrends = async (
    request: ExtendedRequest,
    response: Response
) => {
    const trends = await getTrending();

    response.status(200).json({ trends });
};
