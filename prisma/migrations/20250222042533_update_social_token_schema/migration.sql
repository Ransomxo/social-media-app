/*
  Warnings:

  - You are about to drop the `SocialToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SocialToken" DROP CONSTRAINT "SocialToken_userId_fkey";

-- DropTable
DROP TABLE "SocialToken";

-- CreateTable
CREATE TABLE "social_tokens" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_tokens_user_id_idx" ON "social_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "social_tokens_user_id_platform_key" ON "social_tokens"("user_id", "platform");

-- AddForeignKey
ALTER TABLE "social_tokens" ADD CONSTRAINT "social_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
