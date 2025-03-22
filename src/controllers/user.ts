import type { Response } from 'express';
import {
    findUserBySlug,
    getUserFollowersCount,
    getUserFollowingCount,
    getUserTweetCount,
} from '../services/user';
import type { ExtendedRequest } from '../types/extended-request';

export const getUser = async (request: ExtendedRequest, response: Response) => {
    const { slug } = request.params;

    const user = await findUserBySlug(slug);
    if (!user) {
        response.status(404).json({ message: 'User not found' });
        return;
    }
    const followingCount = await getUserFollowingCount(user.slug);
    const followersCount = await getUserFollowersCount(user.slug);
    const tweetCount = await getUserTweetCount(user.slug);

    response
        .status(200)
        .json({ user, followingCount, followersCount, tweetCount });
};
