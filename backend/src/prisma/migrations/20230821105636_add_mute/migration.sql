/*
  Warnings:

  - You are about to drop the column `isBanned` on the `JoinedTable` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserMUTE" ADD VALUE 'UNMUTED';

-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "isBanned",
ADD COLUMN     "isMuted" "UserMUTE" NOT NULL DEFAULT 'UNMUTED';
