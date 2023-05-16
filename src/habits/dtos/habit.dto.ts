import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from 'src/common/models/base.model';

export class HabitDTO extends BaseModel {
  @ApiProperty()
  name: string;
  @ApiProperty()
  order: number;
  @ApiProperty()
  id: string;
}
