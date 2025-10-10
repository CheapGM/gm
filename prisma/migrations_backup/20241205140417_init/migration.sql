-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "applicationVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "application_url" TEXT DEFAULT '',
ADD COLUMN     "mediumVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "medium_url" TEXT DEFAULT '',
ADD COLUMN     "mirrorVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mirror_url" TEXT DEFAULT '';
