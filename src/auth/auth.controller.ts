import {
  Request,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user';
import { UserDTO } from './dto/user.dto';
import { JwtGuard } from './jwt.guard';
import { Auth } from './models/auth.model';

@Controller('/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/google')
  @ApiResponse({ type: Auth })
  async googleLogin(@Query('code') code: string): Promise<Auth> {
    return this.auth.googleLogin(code);
  }
  @UseGuards(JwtGuard)
  @Get('/me')
  @ApiResponse({ type: UserDTO })
  me(@CurrentUser() user: UserDTO) {
    return user;
  }
}
