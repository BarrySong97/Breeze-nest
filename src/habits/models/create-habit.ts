import { ApiProperty } from '@nestjs/swagger';
import { HabitDates } from '@prisma/client';
export class CreateHabit {
  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;
}
