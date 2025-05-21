/*
  Warnings:

  - You are about to alter the column `defaultAddressId` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `DeliveryAddress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `DeliveryAddress` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `deliveryAddressId` on the `OrderOnline` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Employee',
    "ownerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "defaultAddressId" INTEGER,
    CONSTRAINT "Account_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "Account_defaultAddressId_fkey" FOREIGN KEY ("defaultAddressId") REFERENCES "DeliveryAddress" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);
INSERT INTO "new_Account" ("avatar", "createdAt", "defaultAddressId", "email", "id", "name", "ownerId", "password", "phone", "role", "updatedAt") SELECT "avatar", "createdAt", "defaultAddressId", "email", "id", "name", "ownerId", "password", "phone", "role", "updatedAt" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");
CREATE TABLE "new_DeliveryAddress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "provinceName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "wardName" TEXT NOT NULL,
    "addressDetail" TEXT NOT NULL,
    "addressNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeliveryAddress_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DeliveryAddress" ("accountId", "addressDetail", "addressNotes", "createdAt", "district", "districtName", "id", "province", "provinceName", "recipientName", "recipientPhone", "updatedAt", "ward", "wardName") SELECT "accountId", "addressDetail", "addressNotes", "createdAt", "district", "districtName", "id", "province", "provinceName", "recipientName", "recipientPhone", "updatedAt", "ward", "wardName" FROM "DeliveryAddress";
DROP TABLE "DeliveryAddress";
ALTER TABLE "new_DeliveryAddress" RENAME TO "DeliveryAddress";
CREATE TABLE "new_OrderOnline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT,
    "accountId" INTEGER NOT NULL,
    "deliveryAddressId" INTEGER NOT NULL,
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
INSERT INTO "new_OrderOnline" ("accountId", "createdAt", "deliveryAddressId", "deliveryOption", "id", "note", "paymentMethod", "status", "totalPrice", "trackingNumber", "updatedAt") SELECT "accountId", "createdAt", "deliveryAddressId", "deliveryOption", "id", "note", "paymentMethod", "status", "totalPrice", "trackingNumber", "updatedAt" FROM "OrderOnline";
DROP TABLE "OrderOnline";
ALTER TABLE "new_OrderOnline" RENAME TO "OrderOnline";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
