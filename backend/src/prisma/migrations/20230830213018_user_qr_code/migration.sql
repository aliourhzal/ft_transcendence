-- AlterTable
ALTER TABLE "User" ADD COLUMN     "AsciiSecretQr" TEXT,
ADD COLUMN     "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false;
