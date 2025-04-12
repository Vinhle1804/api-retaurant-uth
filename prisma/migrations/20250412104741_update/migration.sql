/*
  Warnings:

  - Added the required column `note` to the `OrderOnline` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderOnline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT,
    "accountId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "paymentMethod" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrderOnline_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderOnline" ("accountId", "address", "createdAt", "id", "paymentMethod", "status", "totalPrice", "trackingNumber", "updatedAt") SELECT "accountId", "address", "createdAt", "id", "paymentMethod", "status", "totalPrice", "trackingNumber", "updatedAt" FROM "OrderOnline";
DROP TABLE "OrderOnline";
ALTER TABLE "new_OrderOnline" RENAME TO "OrderOnline";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
