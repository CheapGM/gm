-- CreateEnum
CREATE TYPE "Badges" AS ENUM ('Followers100Badge', 'Followers500Badge', 'Followers1000Badge', 'Followers10000Badge', 'Domain100DaysBadge', 'Domain200DaysBadge', 'Domain365DaysBadge', 'Domain500DaysBadge', 'DomainL1Badge', 'DomainL2Badge', 'DomainL3Badge', 'DomainL4Badge', 'Domain2Badge', 'Domain5Badge', 'Domain20Badge', 'Domain100Badge');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DigitalCreator', 'BlockchainEnthusiast', 'SocialCreator', 'FinancialWizard', 'TechInnovator', 'Gamer');

-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('ZETA', 'BERA', 'BASE', 'POLY', 'MINT', 'HONEY', 'XTERIO', 'CZ', 'XLAYER', 'NFT', 'TABI', 'TAIKO', 'FIRE', 'SCROLL', 'CANDY', 'ARTHERA', 'MORPH', 'NEOX', 'BLAST', 'BOBA', 'XRP', 'GOLD', 'ZKLINK', 'ZIRCUIT', 'CREATOR_CHAIN', 'PLUME', 'SONEIUM', 'SONIC', 'ZORA', 'ATHENE', 'TABI_V2', 'STORY', 'INK', 'INKMAINNET', 'FORM', 'SONICMAINNET', 'ABSTRACT', 'SONEIUMMAINNET', 'PLUMEMAINNET', 'ABSTRACTMAINNET', 'SAHARA', 'BERAMAINNET', 'UNICHAIN', 'MONAD', 'APE', 'HEMI', 'NEXUS', 'MEGAETH', 'COTI', 'XRPL', 'SOMNIA', 'KITE', 'UNIT0', 'KAIA', 'HYPE', 'XRPLMAINNET', 'ZENCHAIN', 'HELIOS', 'CONFLUX', 'CRONOS', 'OPTIMISM', 'KATANA', 'LINEA', 'RARI', 'MANTLE', 'BOB', 'CELO', 'ETH', 'ARBITRUM', 'AVALANCHE', 'GNOSIS', 'LISK', 'WORLDCHAIN', 'SUPERPOSITION', 'SUPERSEED', 'GRAVITY', 'METIS', 'ANCIENT8', 'APPCHAIN', 'DEGEN', 'MEZO', 'BOTANIX', 'ZKSYNC', 'SHAPE', 'REDSTONE', 'POLYGONZK', 'PERENNIAL', 'ONCHAINPOINTS', 'RONIN', 'SOMNIAMAINNET', 'RISE', 'XAI', 'CYBER', 'CORN', 'PROOFOFPLAY', 'CAMP', 'MODE', 'MANTAPACIFIC', 'FUNKI', 'FORMA', 'FLOW', 'LENS', 'PHAROS', 'CORE');

-- CreateTable
CREATE TABLE "Deploy" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "dId" TEXT NOT NULL DEFAULT '',
    "chain" "Chain" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL,
    "chain" "Chain" NOT NULL,
    "domainName" TEXT NOT NULL,
    "mainImgUrl" TEXT DEFAULT '',
    "bannerURL" TEXT DEFAULT '',
    "location" TEXT,
    "bio" TEXT DEFAULT '',
    "name" TEXT,
    "category" "Category" NOT NULL DEFAULT 'DigitalCreator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "website_url" TEXT DEFAULT '',
    "discord_url" TEXT DEFAULT '',
    "youtube_url" TEXT DEFAULT '',
    "twitter_url" TEXT DEFAULT '',
    "telegram_url" TEXT DEFAULT '',
    "linkedin_url" TEXT DEFAULT '',
    "websiteVerified" BOOLEAN NOT NULL DEFAULT false,
    "discordVerified" BOOLEAN NOT NULL DEFAULT false,
    "youtubeVerified" BOOLEAN NOT NULL DEFAULT false,
    "twitterVerified" BOOLEAN NOT NULL DEFAULT false,
    "telegramVerified" BOOLEAN NOT NULL DEFAULT false,
    "linkedinVerified" BOOLEAN NOT NULL DEFAULT false,
    "dId" TEXT NOT NULL DEFAULT '',
    "hasBurned" BOOLEAN NOT NULL DEFAULT false,
    "wrapcastVerified" BOOLEAN NOT NULL DEFAULT false,
    "wrapcast_url" TEXT DEFAULT '',
    "link1" TEXT DEFAULT '',
    "link2" TEXT DEFAULT '',
    "linkTitle1" TEXT DEFAULT '',
    "linkTitle2" TEXT DEFAULT '',
    "spaceVerified" BOOLEAN NOT NULL DEFAULT false,
    "applicationVerified" BOOLEAN NOT NULL DEFAULT false,
    "application_url" TEXT DEFAULT '',
    "mediumVerified" BOOLEAN NOT NULL DEFAULT false,
    "medium_url" TEXT DEFAULT '',
    "mirrorVerified" BOOLEAN NOT NULL DEFAULT false,
    "mirror_url" TEXT DEFAULT ''
);

-- CreateTable
CREATE TABLE "DomainCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "taken" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GM" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "dId" TEXT NOT NULL DEFAULT '',
    "chain" "Chain" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HIP" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "mainImgUrl" TEXT DEFAULT '',
    "name" TEXT,
    "bio" TEXT DEFAULT '',
    "position" TEXT DEFAULT '',
    "totalEarnings" DOUBLE PRECISION NOT NULL,
    "totalPoints" DOUBLE PRECISION NOT NULL,
    "discordVerified" BOOLEAN NOT NULL DEFAULT false,
    "discord_url" TEXT DEFAULT '',
    "linkedinVerified" BOOLEAN NOT NULL DEFAULT false,
    "linkedin_url" TEXT DEFAULT '',
    "telegramVerified" BOOLEAN NOT NULL DEFAULT false,
    "telegram_url" TEXT DEFAULT '',
    "twitterVerified" BOOLEAN NOT NULL DEFAULT false,
    "twitter_url" TEXT DEFAULT '',
    "wrapcastVerified" BOOLEAN NOT NULL DEFAULT false,
    "wrapcast_url" TEXT DEFAULT '',
    "domainPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nftPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "referralPoints" DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "chain" "Chain" NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "numberOfReferrals" INTEGER NOT NULL,
    "totalEarnings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "id" SERIAL NOT NULL,
    "chainId" INTEGER NOT NULL DEFAULT 0,
    "domains" INTEGER NOT NULL DEFAULT 0,
    "owner" INTEGER NOT NULL DEFAULT 0,
    "gifts" INTEGER NOT NULL DEFAULT 0,
    "chainName" TEXT NOT NULL,
    "chainDomain" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT DEFAULT '',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "badges" "Badges"[],
    "referralCode" TEXT,
    "refer" TEXT
);

-- CreateTable
CREATE TABLE "nonces" (
    "walletAddress" VARCHAR(42) NOT NULL,
    "nonce" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nonces_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateTable
CREATE TABLE "participations" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(42) NOT NULL,
    "roundId" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "grossWei" VARCHAR(78) NOT NULL,
    "netWei" VARCHAR(78) NOT NULL,
    "feeWei" VARCHAR(78) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rounds" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "questName" VARCHAR(100),
    "questType" VARCHAR(50) DEFAULT 'BRONZE',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "poolWei" VARCHAR(78) NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "isSealed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "walletAddress" VARCHAR(42) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateTable
CREATE TABLE "winners" (
    "id" SERIAL NOT NULL,
    "roundId" INTEGER NOT NULL,
    "userId" VARCHAR(42) NOT NULL,
    "prizeWei" VARCHAR(78) NOT NULL,
    "rank" SMALLINT NOT NULL,
    "questType" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "winners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deploy_id_key" ON "Deploy"("id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_id_key" ON "Domain"("id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "DomainCategory_id_key" ON "DomainCategory"("id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "DomainCategory_key_key" ON "DomainCategory"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GM_id_key" ON "GM"("id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "HIP_id_key" ON "HIP"("id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "HIP_walletAddress_key" ON "HIP"("walletAddress" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Statistic_chainDomain_key" ON "Statistic"("chainDomain" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Statistic_chainName_key" ON "Statistic"("chainName" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress" ASC);

-- CreateIndex
CREATE INDEX "nonces_expiresAt_idx" ON "nonces"("expiresAt" ASC);

-- CreateIndex
CREATE INDEX "participations_roundId_idx" ON "participations"("roundId" ASC);

-- CreateIndex
CREATE INDEX "participations_txHash_idx" ON "participations"("txHash" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "participations_txHash_key" ON "participations"("txHash" ASC);

-- CreateIndex
CREATE INDEX "participations_userId_idx" ON "participations"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "participations_userId_roundId_key" ON "participations"("userId" ASC, "roundId" ASC);

-- CreateIndex
CREATE INDEX "rounds_chainId_idx" ON "rounds"("chainId" ASC);

-- CreateIndex
CREATE INDEX "rounds_questType_idx" ON "rounds"("questType" ASC);

-- CreateIndex
CREATE INDEX "rounds_roundId_idx" ON "rounds"("roundId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "rounds_roundId_key" ON "rounds"("roundId" ASC);

-- CreateIndex
CREATE INDEX "rounds_status_idx" ON "rounds"("status" ASC);

-- CreateIndex
CREATE INDEX "winners_questType_idx" ON "winners"("questType" ASC);

-- CreateIndex
CREATE INDEX "winners_roundId_idx" ON "winners"("roundId" ASC);

-- CreateIndex
CREATE INDEX "winners_userId_idx" ON "winners"("userId" ASC);

-- CreateIndex
CREATE INDEX "winners_userId_questType_idx" ON "winners"("userId" ASC, "questType" ASC);

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nonces" ADD CONSTRAINT "nonces_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "winners" ADD CONSTRAINT "winners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

