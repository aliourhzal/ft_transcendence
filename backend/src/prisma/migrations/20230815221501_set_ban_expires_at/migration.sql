/*
  Warnings:

  - You are about to drop the column `banDuration` on the `JoinedTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "banDuration",
ADD COLUMN     "banExpiresAt" TIMESTAMP(3);
