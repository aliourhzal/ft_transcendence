/*
  Warnings:

  - The `userStatus` column on the `JoinedTable` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roomStauts` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "userStatus",
ADD COLUMN     "userStatus" "UserStatus" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomStauts",
ADD COLUMN     "roomStauts" "RoomStatus" NOT NULL DEFAULT 'PUBLIC';

-- DropEnum
DROP TYPE "Role";
