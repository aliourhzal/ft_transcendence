/*
  Warnings:

  - The values [UNMUTED_TIME] on the enum `UserMUTE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserMUTE_new" AS ENUM ('MUTED_TIME', 'MUTED_FOR_EVER', 'UNMUTED');
ALTER TABLE "JoinedTable" ALTER COLUMN "isMuted" TYPE "UserMUTE_new" USING ("isMuted"::text::"UserMUTE_new");
ALTER TYPE "UserMUTE" RENAME TO "UserMUTE_old";
ALTER TYPE "UserMUTE_new" RENAME TO "UserMUTE";
DROP TYPE "UserMUTE_old";
COMMIT;

-- AlterTable
ALTER TABLE "JoinedTable" ADD COLUMN     "isMuted" "UserMUTE" NOT NULL DEFAULT 'UNMUTED';
