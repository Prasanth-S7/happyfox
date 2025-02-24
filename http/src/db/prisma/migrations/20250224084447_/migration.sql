-- CreateEnum
CREATE TYPE "ForumRole" AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "Forum" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ForumMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "forumId" INTEGER NOT NULL,
    "role" "ForumRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumMember_userId_forumId_key" ON "ForumMember"("userId", "forumId");

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
