/*
  Warnings:

  - You are about to drop the column `banExpiresAt` on the `JoinedTable` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `JoinedTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "banExpiresAt",
DROP COLUMN "isBanned";
