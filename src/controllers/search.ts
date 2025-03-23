import type { Response } from 'express';
import { searchSchema } from '../schemas/search';
import { findTweetsByBody } from '../services/tweet';
import type { ExtendedRequest } from '../types/extended-request';

export const searchTweets = async (
    request: ExtendedRequest,
    response: Response
) => {
    const safeData = searchSchema.safeParse(request.query);
    if (!safeData.success) {
        response
            .status(400)
            .json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    const perPage = 10;
    const currentPage = safeData.data.page ?? 0;

    const tweets = await findTweetsByBody(
        safeData.data.q,
        currentPage,
        perPage
    );

    response.status(200).json({ tweets, page: currentPage });
};
