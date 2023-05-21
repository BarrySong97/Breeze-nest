import { PrismaService } from 'nestjs-prisma';
import axios from 'axios';
import { Prisma, User } from '@prisma/client';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignupInput } from './dto/signup.input';
import { Token } from './models/token.model';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { Auth } from './models/auth.model';
interface GoogleUserInfoResponse {
  id: string; // 用户的唯一ID
  email: string; // 用户的邮件地址
  verified_email: boolean; // 邮件地址是否已验证
  name: string; // 用户的全名
  given_name: string; // 用户的名
  family_name: string; // 用户的姓
  picture: string; // 用户头像的URL
  locale: string; // 用户的语言设置
}
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async createUser(payload: SignupInput): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          role: 'USER',
          habits: {
            create: [
              {
                name: 'Drink Water',
                order: 0,
              },
              {
                name: 'Read',
                order: 1,
              },
            ],
          },
        },
      });

      return user;
    } catch (e) {
      this.logger.error(`create user error`);
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`create user error`);
      }
      throw new Error(e);
    }
  }

  validateUserGoogle(googleProfileId: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { googleId: googleProfileId },
    });
  }

  async googleLogin(code: string): Promise<Auth> {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get('GOOGLE_CALLBACK_URL');

    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const accessToken = response.data.access_token;
      const profileRes = await axios.get<GoogleUserInfoResponse>(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const profile = profileRes.data;
      const user = await this.validateUserGoogle(profile.id);

      if (!user) {
        const createUser = await this.createUser({
          email: profile.email,
          firstname: profile.given_name,
          avatar: profile.picture,
          lastname: profile.family_name,
          googleId: profile.id,
        });
        const token = this.generateTokens({ userId: createUser.id });
        return { user: createUser, ...token };
      }

      const token = this.generateTokens({ userId: user.id });
      return { user: user, ...token };
    } catch (error) {
      this.logger.error(`google login error: ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }

  validateUserUserId(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.validateUserUserId(id);
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
