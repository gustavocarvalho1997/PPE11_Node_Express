import type { Response } from 'express';
import { userTweetsSchema } from '../schemas/user-tweets';
import { findTweetsByUser } from '../services/tweet';
import {
    checkIfFollows,
    findUserBySlug,
    follow,
    getUserFollowersCount,
    getUserFollowingCount,
    getUserTweetCount,
    unfollow,
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

export const getUserTweets = async (
    request: ExtendedRequest,
    response: Response
) => {
    const { slug } = request.params;

    const safeData = userTweetsSchema.safeParse(request.query);
    if (!safeData.success) {
        response
            .status(400)
            .json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    const perPage = 10;
    const currentPage = safeData.data.page ?? 0;

    const tweets = await findTweetsByUser(slug, currentPage, perPage);

    response.status(200).json({ tweets, page: currentPage });
};

export const followToggle = async (
    request: ExtendedRequest,
    response: Response
) => {
    const { slug } = request.params;

    const me = request.userSlug as string;
    const hasUserToBeFollowed = await findUserBySlug(slug);
    if (!hasUserToBeFollowed) {
        response.status(404).json({ message: 'User not found' });
        return;
    }

    const follows = await checkIfFollows(me, slug);
    if(!follows){
        await follow(me, slug);
        response.status(200).json({ message: 'User followed' });
    } else {
        await unfollow(me, slug);
        response.status(200).json({ message: 'User unfollowed' });
    }
};
