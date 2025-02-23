/*
  Warnings:

  - The `platforms` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `social_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "social_tokens" DROP CONSTRAINT "social_tokens_user_id_fkey";

-- DropIndex
DROP INDEX "Post_scheduledAt_idx";

-- DropIndex
DROP INDEX "Team_ownerId_idx";

-- DropIndex
DROP INDEX "TeamMember_teamId_idx";

-- DropIndex
DROP INDEX "TeamMember_userId_idx";

-- DropIndex
DROP INDEX "TeamMember_userId_teamId_key";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "scheduledAt" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'draft',
DROP COLUMN "platforms",
ADD COLUMN     "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "plan" SET DEFAULT 'free';

-- DropTable
DROP TABLE "social_tokens";

-- DropEnum
DROP TYPE "Platform";

-- CreateTable
CREATE TABLE "ReportSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "platforms" TEXT[],
    "metrics" TEXT[],
    "emailConfig" JSONB NOT NULL,
    "lastSent" TIMESTAMP(3),
    "nextScheduled" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportSchedule_userId_idx" ON "ReportSchedule"("userId");

-- AddForeignKey
ALTER TABLE "ReportSchedule" ADD CONSTRAINT "ReportSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
