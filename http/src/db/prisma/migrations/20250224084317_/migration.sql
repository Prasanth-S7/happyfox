/*
  Warnings:

  - You are about to drop the column `Avatar` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `By` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `Category` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `Date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `Link` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `Poster` on the `Event` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `by` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poster` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "Avatar",
DROP COLUMN "By",
DROP COLUMN "Category",
DROP COLUMN "Date",
DROP COLUMN "Description",
DROP COLUMN "Link",
DROP COLUMN "Poster",
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "by" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "poster" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
