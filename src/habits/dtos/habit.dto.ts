import { ApiProperty } from '@nestjs/swagger';
import { HabitDates } from '@prisma/client';
import { BaseModel } from 'src/common/models/base.model';

export class HabitDatesDTO extends BaseModel {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  habitId: string;
  @ApiProperty()
  id: string;
}
export class HabitDatesCheckedDTO extends BaseModel {
  @ApiProperty()
  date: Date;
  @ApiProperty()
  habitId: string;
  @ApiProperty()
  id: string;
}
export class HabitDTO extends BaseModel {
  @ApiProperty() name: string;
  @ApiProperty()
  order: number;
  @ApiProperty()
  id: string;
  @ApiProperty({
    type: HabitDatesDTO,
    isArray: true,
  })
  dates: HabitDates[];
}
