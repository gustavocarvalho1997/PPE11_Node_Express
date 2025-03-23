import type { Response } from 'express';
import { updateUserSchema } from '../schemas/update-user';
import { userTweetsSchema } from '../schemas/user-tweets';
import { findTweetsByUser } from '../services/tweet';
import {
    checkIfFollows,
    findUserBySlug,
    follow,
    getUserFollowersCount,
    getUserFollowingCount,
    getUserTweetCount,
    saveUploadAvatar,
    saveUploadCover,
    unfollow,
    updateUserInfo,
} from '../services/user';
import type { ExtendedRequest } from '../types/extended-request';
import { checkIfFileExists, removeFileFromFolder } from '../utils/multer';
import { prisma } from '../utils/prisma';

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
    if (!follows) {
        await follow(me, slug);
        response.status(200).json({ message: 'User followed' });
    } else {
        await unfollow(me, slug);
        response.status(200).json({ message: 'User unfollowed' });
    }
};

export const updateUser = async (
    request: ExtendedRequest,
    response: Response
) => {
    const safeData = updateUserSchema.safeParse(request.body);
    if (!safeData.success) {
        response
            .status(400)
            .json({ error: safeData.error.flatten().fieldErrors });
        return;
    }
    await updateUserInfo(request.userSlug as string, safeData.data);

    response.status(200).json({ message: 'User updated' });
};

export const getUserFollowing = async (slug: string) => {
    const following = [];
    const reqFollow = await prisma.follow.findMany({
        select: { user2Slug: true },
        where: { user1Slug: slug },
    });

    for (const user of reqFollow) {
        following.push(user.user2Slug);
    }

    return following;
};

export const uploadAvatar = async (
    request: ExtendedRequest,
    response: Response
) => {
    const file = request.file?.filename;
    if (!file) {
        response.status(400).json({ message: 'File not found' });
        return;
    }

    const user = await findUserBySlug(request.userSlug as string);
    const hasFile = await checkIfFileExists(user?.avatar as string);
    if (hasFile) {
        await removeFileFromFolder(hasFile);
    }

    await saveUploadAvatar(user?.slug as string, file);
    response.status(200).json({ message: 'Avatar uploaded' });
};

export const uploadCover = async (
    request: ExtendedRequest,
    response: Response
) => {
    const file = request.file?.filename;
    if (!file) {
        response.status(400).json({ message: 'File not found' });
        return;
    }

    const user = await findUserBySlug(request.userSlug as string);
    const hasFile = await checkIfFileExists(user?.cover as string);
    if (hasFile) {
        await removeFileFromFolder(hasFile);
    }

    await saveUploadCover(user?.slug as string, file);
    response.status(200).json({ message: 'Cover uploaded' });
};
