import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

// GET /api/topPosts?from=2023-01-01&to=2023-02-28&limit=3
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { from, to, limit } = req.query;
  const resultPosts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: from ? new Date(from as string) : undefined,
        lte: to ? new Date(to as string) : undefined,
      },
    },
    orderBy: [
      {
        viewCount: 'desc',
      },
      {
        ratings: {
          _count: 'desc',
        },
      },
    ],
    take: limit ? Number(limit) : undefined,
  });
  console.log(resultPosts);
  res.json(resultPosts);
}
