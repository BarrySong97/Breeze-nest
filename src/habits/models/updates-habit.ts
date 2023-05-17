import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHabit {
  @ApiProperty()
  id: string;
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  // @Type(() => Date) // 使用 @Type 装饰器将字段转换为 Date 类型
  @IsDate()
  @IsOptional()
  checkDate?: Date;
}
