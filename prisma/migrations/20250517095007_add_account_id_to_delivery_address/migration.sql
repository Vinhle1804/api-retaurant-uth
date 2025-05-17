/*
  Warnings:

  - You are about to drop the column `district` on the `DeliveryAddress` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `DeliveryAddress` table. All the data in the column will be lost.
  - You are about to drop the column `ward` on the `DeliveryAddress` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeliveryAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" INTEGER NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "provinceName" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "wardName" TEXT NOT NULL,
    "addressDetail" TEXT NOT NULL,
    "addressNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeliveryAddress_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DeliveryAddress" ("accountId", "addressDetail", "addressNotes", "createdAt", "districtName", "id", "provinceName", "recipientName", "recipientPhone", "updatedAt", "wardName") SELECT "accountId", "addressDetail", "addressNotes", "createdAt", "districtName", "id", "provinceName", "recipientName", "recipientPhone", "updatedAt", "wardName" FROM "DeliveryAddress";
DROP TABLE "DeliveryAddress";
ALTER TABLE "new_DeliveryAddress" RENAME TO "DeliveryAddress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
