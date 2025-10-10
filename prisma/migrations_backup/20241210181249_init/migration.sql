-- CreateTable
CREATE TABLE "DomainCategory" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "generated" INTEGER NOT NULL,
    "taken" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DomainCategory_id_key" ON "DomainCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DomainCategory_key_key" ON "DomainCategory"("key");
