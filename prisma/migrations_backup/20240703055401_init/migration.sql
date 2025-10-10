/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Badges" AS ENUM ('Followers100Badge', 'Followers500Badge', 'Followers1000Badge', 'Followers10000Badge', 'Domain100DaysBadge', 'Domain200DaysBadge', 'Domain365DaysBadge', 'Domain500DaysBadge', 'DomainL1Badge', 'DomainL2Badge', 'DomainL3Badge', 'DomainL4Badge', 'Domain2Badge', 'Domain5Badge', 'Domain20Badge', 'Domain100Badge');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "badges" "Badges"[],
ADD COLUMN     "referralCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
