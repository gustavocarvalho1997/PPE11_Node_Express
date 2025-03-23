import { prisma } from '../utils/prisma';

export const addHashTag = async (hashTag: string) => {
    const hs = await prisma.trend.findFirst({
        where: {
            hashtag: hashTag,
        },
    });
    if (hs) {
        await prisma.trend.update({
            where: { id: hs.id },
            data: {
                counter: hs.counter + 1,
                updatedAt: new Date(),
            },
        });
    } else {
        await prisma.trend.create({
            data: {
                hashtag: hashTag,
            },
        });
    }
};

export const getTrending = async () => {
    const trends = await prisma.trend.findMany({
        select: {
            hashtag: true,
            counter: true,
        },
        orderBy: {
            counter: 'desc',
        },
        take: 4,
    });
    return trends;
};
