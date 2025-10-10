-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Chain" ADD VALUE 'MEZO';
ALTER TYPE "Chain" ADD VALUE 'BOTANIX';
ALTER TYPE "Chain" ADD VALUE 'ZKSYNC';
ALTER TYPE "Chain" ADD VALUE 'SHAPE';
ALTER TYPE "Chain" ADD VALUE 'REDSTONE';
ALTER TYPE "Chain" ADD VALUE 'POLYGONZK';
ALTER TYPE "Chain" ADD VALUE 'PERENNIAL';
ALTER TYPE "Chain" ADD VALUE 'ONCHAINPOINTS';
ALTER TYPE "Chain" ADD VALUE 'RONIN';
