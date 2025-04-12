-- CreateTable
CREATE TABLE "OrderOnline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT,
    "accountId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "paymentMethod" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrderOnline_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderOnlineItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderOnlineId" INTEGER NOT NULL,
    "dishSnapshotId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "OrderOnlineItem_orderOnlineId_fkey" FOREIGN KEY ("orderOnlineId") REFERENCES "OrderOnline" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderOnlineItem_dishSnapshotId_fkey" FOREIGN KEY ("dishSnapshotId") REFERENCES "DishSnapshot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
