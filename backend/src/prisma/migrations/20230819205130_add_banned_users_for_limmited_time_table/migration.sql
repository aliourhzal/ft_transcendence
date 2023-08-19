-- CreateTable
CREATE TABLE "BannedUsersForLimmitedTime" (
    "userId" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'USER',
    "roomId" TEXT NOT NULL,
    "isBanned" "UserBnned" NOT NULL DEFAULT 'UNBANNED',
    "banExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BannedUsersForLimmitedTime_pkey" PRIMARY KEY ("userId","roomId")
);

-- AddForeignKey
ALTER TABLE "BannedUsersForLimmitedTime" ADD CONSTRAINT "BannedUsersForLimmitedTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannedUsersForLimmitedTime" ADD CONSTRAINT "BannedUsersForLimmitedTime_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
