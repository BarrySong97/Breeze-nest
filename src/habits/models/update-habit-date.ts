import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class UpdateHabitDate {
  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  id?: string;

  @ApiProperty()
  habitId: string;
}
