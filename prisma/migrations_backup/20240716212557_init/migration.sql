/*
  Warnings:

  - The values [X1,OPBNB,FIVE] on the enum `Chain` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Chain_new" AS ENUM ('ZETA', 'BERA', 'BASE', 'POLY', 'MINT', 'HONEY', 'XTERIO', 'CZ', 'XLAYER', 'NFT', 'TABI', 'TAIKO', 'FIRE', 'SCROLL', 'CANDY', 'ARTHERA', 'MORPH', 'NEOX', 'BLAST', 'BOBA', 'XRP', 'GOLD', 'ZKLINK');
ALTER TABLE "Domain" ALTER COLUMN "chain" TYPE "Chain_new" USING ("chain"::text::"Chain_new");
ALTER TABLE "Referral" ALTER COLUMN "chain" TYPE "Chain_new" USING ("chain"::text::"Chain_new");
ALTER TYPE "Chain" RENAME TO "Chain_old";
ALTER TYPE "Chain_new" RENAME TO "Chain";
DROP TYPE "Chain_old";
COMMIT;
