/*
  Warnings:

  - You are about to drop the column `address` on the `OrderOnline` table. All the data in the column will be lost.
  - Added the required column `deliveryAddressId` to the `OrderOnline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryOption` to the `OrderOnline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN "phone" INTEGER;

-- CreateTable
CREATE TABLE "DeliveryAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "province" TEXT NOT NULL,
    "provinceName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "addressDetail" TEXT NOT NULL,
    "adressNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderOnline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT,
    "accountId" INTEGER NOT NULL,
    "deliveryAddressId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "paymentMethod" TEXT NOT NULL,
    "deliveryOption" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrderOnline_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderOnline_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "DeliveryAddress" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderOnline" ("accountId", "createdAt", "id", "note", "paymentMethod", "status", "totalPrice", "trackingNumber", "updatedAt") SELECT "accountId", "createdAt", "id", "note", "paymentMethod", "status", "totalPrice", "trackingNumber", "updatedAt" FROM "OrderOnline";
DROP TABLE "OrderOnline";
ALTER TABLE "new_OrderOnline" RENAME TO "OrderOnline";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
