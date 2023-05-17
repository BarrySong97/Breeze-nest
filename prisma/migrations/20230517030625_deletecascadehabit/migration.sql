-- DropForeignKey
ALTER TABLE "HabitDates" DROP CONSTRAINT "HabitDates_habitId_fkey";

-- AddForeignKey
ALTER TABLE "HabitDates" ADD CONSTRAINT "HabitDates_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
