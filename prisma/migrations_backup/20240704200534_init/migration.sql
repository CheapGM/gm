-- DropIndex
DROP INDEX "User_walletAddress_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refer" TEXT;

-- CreateTable
CREATE TABLE "Referral" (
    "id" SERIAL NOT NULL,
    "chain" "Chain" NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "numberOfReferrals" INTEGER NOT NULL,
    "totalEarnings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);
