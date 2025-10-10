-- AlterTable
ALTER TABLE "rounds" ADD COLUMN "questName" VARCHAR(100);
ALTER TABLE "rounds" ADD COLUMN "questType" VARCHAR(50) DEFAULT 'BRONZE';

-- AlterTable
ALTER TABLE "winners" ADD COLUMN "questType" VARCHAR(50);

-- CreateIndex
CREATE INDEX "rounds_questType_idx" ON "rounds"("questType");

-- CreateIndex
CREATE INDEX "winners_questType_idx" ON "winners"("questType");

-- CreateIndex
CREATE INDEX "winners_userId_questType_idx" ON "winners"("userId", "questType");
