-- CreateTable
CREATE TABLE "HIP" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "mainImgUrl" TEXT DEFAULT '',
    "name" TEXT,
    "bio" TEXT DEFAULT '',
    "position" TEXT DEFAULT '',
    "totalEarnings" DOUBLE PRECISION NOT NULL,
    "totalPoints" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HIP_id_key" ON "HIP"("id");

-- CreateIndex
CREATE UNIQUE INDEX "HIP_walletAddress_key" ON "HIP"("walletAddress");
