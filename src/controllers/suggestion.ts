import type { Response } from 'express';
import { getUserSuggestions } from '../services/user';
import type { ExtendedRequest } from '../types/extended-request';

export const getSuggestions = async (
    request: ExtendedRequest,
    response: Response
) => {
    const suggestions = await getUserSuggestions(request.userSlug as string);
    response.status(200).json({ users: suggestions });
};
