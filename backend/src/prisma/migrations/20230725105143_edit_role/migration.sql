/*
  Warnings:

  - You are about to drop the column `role` on the `JoinedTable` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JoinedTable" DROP COLUMN "role",
ADD COLUMN     "userStatus" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "role",
ADD COLUMN     "roomStauts" "Role" NOT NULL DEFAULT 'PUBLIC';
