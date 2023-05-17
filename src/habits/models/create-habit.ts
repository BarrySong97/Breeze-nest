import { ApiProperty } from '@nestjs/swagger';
export class CreateHabit {
  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;
}
