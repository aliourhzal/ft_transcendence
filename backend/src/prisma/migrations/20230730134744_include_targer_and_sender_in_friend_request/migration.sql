/*
  Warnings:

  - A unique constraint covering the columns `[targetId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[senderId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senderId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FriendRequest" ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "targetId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_targetId_key" ON "FriendRequest"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_key" ON "FriendRequest"("senderId");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
