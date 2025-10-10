-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DigitalCreator', 'BlockchainEnthusiast', 'SocialCreator', 'FinancialWizard', 'TechInnovator', 'Gamer');

-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('CZ', 'CZTEST');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "primaryDomain" TEXT DEFAULT '',
    "email" TEXT DEFAULT '',
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "chain" "Chain" NOT NULL,
    "domainName" TEXT NOT NULL,
    "mainImgUrl" TEXT DEFAULT '',
    "bannerURL" TEXT DEFAULT '',
    "location" TEXT,
    "bio" TEXT DEFAULT 'Add your bio here',
    "name" TEXT,
    "category" "Category" NOT NULL DEFAULT 'DigitalCreator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "followerIds" INTEGER[],
    "followingIds" INTEGER[],
    "website_url" TEXT NOT NULL DEFAULT 'https://app.znsconnect.io',
    "discord_url" TEXT NOT NULL DEFAULT '',
    "youtube_url" TEXT NOT NULL DEFAULT '',
    "twitter_url" TEXT NOT NULL DEFAULT '',
    "telegram_url" TEXT NOT NULL DEFAULT '',
    "instagram_url" TEXT NOT NULL DEFAULT '',
    "linkedin_url" TEXT NOT NULL DEFAULT '',
    "websiteVerified" BOOLEAN NOT NULL DEFAULT false,
    "discordVerified" BOOLEAN NOT NULL DEFAULT false,
    "youtubeVerified" BOOLEAN NOT NULL DEFAULT false,
    "twitterVerified" BOOLEAN NOT NULL DEFAULT false,
    "telegramVerified" BOOLEAN NOT NULL DEFAULT false,
    "instagramVerified" BOOLEAN NOT NULL DEFAULT false,
    "linkedinVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
