/*
  Warnings:

  - You are about to drop the column `roomStauts` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "roomStauts",
ADD COLUMN     "roomType" "RoomType" NOT NULL DEFAULT 'PUBLIC';
