/*
  Warnings:

  - The primary key for the `Domain` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_toId_fkey";

-- AlterTable
ALTER TABLE "Domain" DROP CONSTRAINT "Domain_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "Domain_id_seq";

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "fromId" SET DATA TYPE TEXT,
ALTER COLUMN "toId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Domain_id_key" ON "Domain"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
