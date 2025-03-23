import type { Response } from 'express';
import { feedSchema } from '../schemas/feed';
import { findTweetFeed } from '../services/tweet';
import type { ExtendedRequest } from '../types/extended-request';
import { getUserFollowing } from './user';

export const getFeed = async (request: ExtendedRequest, response: Response) => {
    const safeData = feedSchema.safeParse(request.query);
    if (!safeData.success) {
        response
            .status(400)
            .json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    const perPage = 10;
    const currentPage = safeData.data.page ?? 0;

    const following = await getUserFollowing(request.userSlug as string);
    const tweets = await findTweetFeed(following, currentPage, perPage);

    response.status(200).json({ tweets, page: currentPage });
};
