-- AlterTable
ALTER TABLE "HIP" ADD COLUMN     "discordVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "discord_url" TEXT DEFAULT '',
ADD COLUMN     "linkedinVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedin_url" TEXT DEFAULT '',
ADD COLUMN     "telegramVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "telegram_url" TEXT DEFAULT '',
ADD COLUMN     "twitterVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twitter_url" TEXT DEFAULT '',
ADD COLUMN     "wrapcastVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wrapcast_url" TEXT DEFAULT '';
