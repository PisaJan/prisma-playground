/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_postId_userId_key" ON "Rating"("postId", "userId");
