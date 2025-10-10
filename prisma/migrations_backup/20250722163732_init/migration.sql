-- CreateTable
CREATE TABLE "GM" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "dId" TEXT NOT NULL DEFAULT '',
    "chain" "Chain" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Deploy" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "dId" TEXT NOT NULL DEFAULT '',
    "chain" "Chain" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "GM_id_key" ON "GM"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Deploy_id_key" ON "Deploy"("id");
