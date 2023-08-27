/*
  Warnings:

  - You are about to drop the column `socketId` on the `JoinedTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "socketId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
