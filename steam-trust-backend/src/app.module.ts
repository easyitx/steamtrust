import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common';
import { PaymentModule } from './payment';
import { TelegramModule } from './telegram';
import { B2bModule } from './b2b';
import { PromocodeModule } from './promocode/promocode.module';
import { LanguageMiddleware } from '@app/common/middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LanguageErrorInterceptor } from '@app/common/interceptors';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    PaymentModule,
    TelegramModule,
    B2bModule,
    PromocodeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LanguageErrorInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LanguageMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
