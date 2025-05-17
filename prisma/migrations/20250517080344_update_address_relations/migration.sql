/*
  Warnings:

  - You are about to drop the `_AccountAddresses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `DeliveryAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardName` to the `DeliveryAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_AccountAddresses_B_index";

-- DropIndex
DROP INDEX "_AccountAddresses_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AccountAddresses";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeliveryAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_DeliveryAddress" ("addressDetail", "addressNotes", "createdAt", "district", "districtName", "id", "province", "provinceName", "recipientName", "recipientPhone", "updatedAt", "ward") SELECT "addressDetail", "addressNotes", "createdAt", "district", "districtName", "id", "province", "provinceName", "recipientName", "recipientPhone", "updatedAt", "ward" FROM "DeliveryAddress";
DROP TABLE "DeliveryAddress";
ALTER TABLE "new_DeliveryAddress" RENAME TO "DeliveryAddress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
