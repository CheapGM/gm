-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Chain" ADD VALUE 'LISK';
ALTER TYPE "Chain" ADD VALUE 'WORLDCHAIN';
ALTER TYPE "Chain" ADD VALUE 'SUPERPOSITION';
ALTER TYPE "Chain" ADD VALUE 'SUPERSEED';
ALTER TYPE "Chain" ADD VALUE 'GRAVITY';
ALTER TYPE "Chain" ADD VALUE 'METIS';
