import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
