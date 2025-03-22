import type { Response } from 'express';
import { addTweetSchema } from '../schemas/add-tweet';
import { addHashTag } from '../services/trend';
import {
    createTweet,
    findAnswersFromTweet,
    findTweet,
} from '../services/tweet';
import type { ExtendedRequest } from '../types/extended-request';

export const addTweet = async (
    request: ExtendedRequest,
    response: Response
) => {
    const safeData = addTweetSchema.safeParse(request.body);
    if (!safeData.success) {
        response
            .status(400)
            .json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    if (safeData.data.answer) {
        const hasAnswerTweet = await findTweet(
            Number.parseInt(safeData.data.answer)
        );
        if (!hasAnswerTweet) {
            response.status(400).json({ error: 'Tweet not found' });
            return;
        }
    }

    const newTweet = await createTweet(
        request.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? Number.parseInt(safeData.data.answer) : 0
    );

    const hashTags = safeData.data.body.match(/#[a-zA-z0-9_]+/g);
    if (hashTags) {
        for (const hashTag of hashTags) {
            if (hashTag.length >= 2) {
                await addHashTag(hashTag);
            }
        }
    }

    response.json({ tweet: newTweet });
};

export const getTweet = async (
    request: ExtendedRequest,
    response: Response
) => {
    const { id } = request.params;

    const tweet = await findTweet(Number.parseInt(id));
    if (!tweet) {
        response.status(404).json({ error: 'Tweet not found' });
        return;
    }
    response.status(200).json({ tweet });
};

export const getAnswers = async (
    request: ExtendedRequest,
    response: Response
) => {
    const { id } = request.params;
    const answers = await findAnswersFromTweet(Number.parseInt(id));

    response.status(200).json({ answers });
};
