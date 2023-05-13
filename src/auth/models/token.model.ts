import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from '../dto/user.dto';

export class Token {
  @ApiProperty({ example: 'accessToken' })
  accessToken: string;
  @ApiProperty({ example: 'refreshToken' })
  refreshToken: string;
}
