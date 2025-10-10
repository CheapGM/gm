/*
  Warnings:

  - You are about to drop the column `primaryDomain` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "primaryDomain";
