/*
  Warnings:

  - You are about to drop the column `instagramVerified` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `instagram_url` on the `Domain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "instagramVerified",
DROP COLUMN "instagram_url",
ADD COLUMN     "wrapcastVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wrapcast_url" TEXT DEFAULT '';
