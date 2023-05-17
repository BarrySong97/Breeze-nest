/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Habit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `habitId` to the `HabitDates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HabitDates" ADD COLUMN     "habitId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Habit_name_key" ON "Habit"("name");

-- AddForeignKey
ALTER TABLE "HabitDates" ADD CONSTRAINT "HabitDates_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
