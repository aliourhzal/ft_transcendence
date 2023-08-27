/*
  Warnings:

  - You are about to drop the `ConnectedUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConnectedUsers" DROP CONSTRAINT "ConnectedUsers_userId_fkey";

-- DropTable
DROP TABLE "ConnectedUsers";
