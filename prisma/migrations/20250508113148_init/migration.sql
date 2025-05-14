-- CreateTable
CREATE TABLE "DeliveryFees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "estimatedTime" TEXT,
    "baseFee" INTEGER NOT NULL,
    "extraFeePerKm" INTEGER NOT NULL DEFAULT 0,
    "maxDistance" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryFees_code_key" ON "DeliveryFees"("code");
