-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Chain" ADD VALUE 'SWELL';
ALTER TYPE "Chain" ADD VALUE 'AURORA';
ALTER TYPE "Chain" ADD VALUE 'MITOSIS';
ALTER TYPE "Chain" ADD VALUE 'FLUENT';
ALTER TYPE "Chain" ADD VALUE 'CITREA';
ALTER TYPE "Chain" ADD VALUE 'VICTION';
