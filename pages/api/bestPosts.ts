import { Post } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { Prisma } from '@prisma/client';

const where = (from?: string, to?: string) => {
  const conditions: Prisma.Sql[] = [];
  if (from) {
    conditions.push(Prisma.sql`post.createdAt >= ${new Date(from as string)}`);
  }
  if (to) {
    conditions.push(Prisma.sql`post.createdAt <= ${new Date(to as string)}`);
  }
  return conditions.length ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ', '(', ')')}` : Prisma.empty;
};

const take = (limit?: string) => {
  return limit ? Prisma.sql`LIMIT ${limit}` : Prisma.empty;
};

// GET /api/topPosts?from=2023-01-01&to=2023-02-28&limit=3
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { from, to, limit } = req.query as Record<string, string>;

  const resultPosts = await prisma.$queryRaw<Post[]>`
    SELECT post.*, AVG(rating.grade) AS average_grade
    FROM Post post
    LEFT JOIN Rating rating
    ON rating.postId = post.id
    ${where(from, to)}
    GROUP BY post.id, post.createdAt
    ORDER BY average_grade DESC
    ${take(limit)}
  `;

  console.log(resultPosts);
  res.json(resultPosts);
}
