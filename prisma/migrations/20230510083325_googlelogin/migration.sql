/*
  Warnings:

  - You are about to drop the column `firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `order` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstname",
DROP COLUMN "password",
ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "HabitDates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitDates_pkey" PRIMARY KEY ("id")
);
