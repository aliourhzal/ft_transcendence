/*
  Warnings:

  - You are about to drop the column `role` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JoinedTable" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "role";
