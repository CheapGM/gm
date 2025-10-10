-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Chain" ADD VALUE 'XAI';
ALTER TYPE "Chain" ADD VALUE 'CYBER';
ALTER TYPE "Chain" ADD VALUE 'CORN';
ALTER TYPE "Chain" ADD VALUE 'PROOFOFPLAY';
ALTER TYPE "Chain" ADD VALUE 'CAMP';
ALTER TYPE "Chain" ADD VALUE 'MODE';
ALTER TYPE "Chain" ADD VALUE 'MANTAPACIFIC';
ALTER TYPE "Chain" ADD VALUE 'FUNKI';
ALTER TYPE "Chain" ADD VALUE 'FORMA';
ALTER TYPE "Chain" ADD VALUE 'FLOW';
ALTER TYPE "Chain" ADD VALUE 'LENS';
