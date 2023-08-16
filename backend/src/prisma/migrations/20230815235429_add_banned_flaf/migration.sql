/*
  Warnings:

  - The `isBanned` column on the `JoinedTable` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserBnned" AS ENUM ('LIMMITED_TIME', 'UNLIMMITED_TIME');

-- CreateEnum
CREATE TYPE "UserMUTE" AS ENUM ('MUTED_TIME', 'UNMUTED_TIME');

-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "isBanned",
ADD COLUMN     "isBanned" "UserBnned" NOT NULL DEFAULT 'UNLIMMITED_TIME';
