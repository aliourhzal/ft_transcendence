-- AlterTable
ALTER TABLE "JoinedTable" ADD COLUMN     "banExpiresAt" TIMESTAMP(3),
ADD COLUMN     "isBanned" "UserBnned" NOT NULL DEFAULT 'UNBANNED';
