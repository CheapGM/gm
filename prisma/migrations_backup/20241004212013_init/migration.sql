-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Chain" ADD VALUE 'ZORA';
ALTER TYPE "Chain" ADD VALUE 'ATHENE';

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

-- CreateIndex
CREATE UNIQUE INDEX "Statistic_chainName_key" ON "Statistic"("chainName");

-- CreateIndex
CREATE UNIQUE INDEX "Statistic_chainDomain_key" ON "Statistic"("chainDomain");
