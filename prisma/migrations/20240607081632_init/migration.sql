/*
  Warnings:

  - You are about to drop the column `bio` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `electionId` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `electionId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `Election` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `position` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_electionId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_electionId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_electionId_fkey";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "bio",
DROP COLUMN "electionId",
DROP COLUMN "name",
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "electionId",
ALTER COLUMN "voteTime" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Election";

-- DropTable
DROP TABLE "Position";

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
