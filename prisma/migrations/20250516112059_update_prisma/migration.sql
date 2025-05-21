/*
  Warnings:

  - You are about to drop the column `adressNotes` on the `DeliveryAddress` table. All the data in the column will be lost.
  - Added the required column `recipientName` to the `DeliveryAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientPhone` to the `DeliveryAddress` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_AccountAddresses" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AccountAddresses_A_fkey" FOREIGN KEY ("A") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AccountAddresses_B_fkey" FOREIGN KEY ("B") REFERENCES "DeliveryAddress" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "defaultAddressId" TEXT,
    CONSTRAINT "Account_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "Account_defaultAddressId_fkey" FOREIGN KEY ("defaultAddressId") REFERENCES "DeliveryAddress" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);
INSERT INTO "new_Account" ("avatar", "createdAt", "email", "id", "name", "ownerId", "password", "phone", "role", "updatedAt") SELECT "avatar", "createdAt", "email", "id", "name", "ownerId", "password", "phone", "role", "updatedAt" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");
CREATE TABLE "new_DeliveryAddress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "provinceName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "addressDetail" TEXT NOT NULL,
    "addressNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DeliveryAddress" ("addressDetail", "createdAt", "district", "districtName", "id", "province", "provinceName", "updatedAt", "ward") SELECT "addressDetail", "createdAt", "district", "districtName", "id", "province", "provinceName", "updatedAt", "ward" FROM "DeliveryAddress";
DROP TABLE "DeliveryAddress";
ALTER TABLE "new_DeliveryAddress" RENAME TO "DeliveryAddress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_AccountAddresses_AB_unique" ON "_AccountAddresses"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountAddresses_B_index" ON "_AccountAddresses"("B");
