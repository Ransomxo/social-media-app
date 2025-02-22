-- CreateTable
CREATE TABLE "SocialToken" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialToken_userId_idx" ON "SocialToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialToken_userId_platform_key" ON "SocialToken"("userId", "platform");

-- AddForeignKey
ALTER TABLE "SocialToken" ADD CONSTRAINT "SocialToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
