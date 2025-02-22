/*
  Warnings:

  - Changed the type of `platform` on the `SocialToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SocialToken" DROP COLUMN "platform",
ADD COLUMN     "platform" "Platform" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SocialToken_userId_platform_key" ON "SocialToken"("userId", "platform");
