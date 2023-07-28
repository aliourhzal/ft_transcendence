/*
  Warnings:

  - You are about to drop the column `userStatus` on the `JoinedTable` table. All the data in the column will be lost.
  - The `roomStauts` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "userStatus",
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomStauts",
ADD COLUMN     "roomStauts" "RoomType" NOT NULL DEFAULT 'PUBLIC';

-- DropEnum
DROP TYPE "RoomStatus";

-- DropEnum
DROP TYPE "UserStatus";
