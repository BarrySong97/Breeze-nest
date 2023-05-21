import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from 'src/auth/auth.module';
import config from 'src/common/configs/config';
import { HabitsModule } from './habits/habits.module';
import { LoggerModule } from 'nestjs-pino';
import { Options } from 'pino-http';
import * as rfs from 'rotating-file-stream';
import { DestinationStream } from 'pino';
const isDev = process.env.NODE_ENV === 'development';
export function pinoHttpOption(): Options | DestinationStream {
  if (!isDev) {
    return rfs.createStream('app.log', {
      interval: '1d',
      path: './logs',
      size: '10M',
      compress: 'gzip',
    });
  }

  return {
    level: isDev ? 'debug' : 'info',
    customLogLevel(_, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    serializers: {
      req(req) {
        req.httpVersion = req.raw.httpVersion;
        req.params = req.raw.params;
        req.query = req.raw.query;
        req.body = req.raw.body;
        return req;
      },
      err(err) {
        err.params = err.raw.params;
        err.query = err.raw.query;
        err.body = err.raw.body;
        return err;
      },
    },
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
      },
    },
  };
}
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    LoggerModule.forRoot({
      pinoHttp: pinoHttpOption(),
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    AuthModule,
    HabitsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
