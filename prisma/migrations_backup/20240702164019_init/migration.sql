/*
  Warnings:

  - You are about to drop the column `followerIds` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `followingIds` on the `Domain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "followerIds",
DROP COLUMN "followingIds";

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
