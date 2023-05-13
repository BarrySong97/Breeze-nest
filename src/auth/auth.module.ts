import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './jwt.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SecurityConfig } from 'src/common/configs/config.interface';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthController, JwtStrategy, JwtGuard],
  controllers: [AuthController],
  exports: [JwtGuard],
})
export class AuthModule {}
