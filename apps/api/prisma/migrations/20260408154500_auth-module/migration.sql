-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'WON', 'LOST');

-- AlterTable
ALTER TABLE "Opportunity"
ADD COLUMN "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN';

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_organizationId_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Opportunity_status_idx" ON "Opportunity"("status");
