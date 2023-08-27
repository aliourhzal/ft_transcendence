/*
  Warnings:

  - The values [LIMMITED_TIME,UNLIMMITED_TIME] on the enum `UserBnned` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserBnned_new" AS ENUM ('BANNEDFORLIMMITED_TIME', 'BANNEDUNLIMMITED_TIME', 'UNBANNED');
ALTER TABLE "JoinedTable" ALTER COLUMN "isBanned" DROP DEFAULT;
ALTER TABLE "JoinedTable" ALTER COLUMN "isBanned" TYPE "UserBnned_new" USING ("isBanned"::text::"UserBnned_new");
ALTER TYPE "UserBnned" RENAME TO "UserBnned_old";
ALTER TYPE "UserBnned_new" RENAME TO "UserBnned";
DROP TYPE "UserBnned_old";
ALTER TABLE "JoinedTable" ALTER COLUMN "isBanned" SET DEFAULT 'UNBANNED';
COMMIT;

-- AlterTable
ALTER TABLE "JoinedTable" ALTER COLUMN "isBanned" SET DEFAULT 'UNBANNED';
