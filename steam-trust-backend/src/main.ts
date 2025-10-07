import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Настройка CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Глобальный префикс для API
  app.setGlobalPrefix('api', {
    exclude: ['/health', '/'],
  });

  // Глобальный фильтр ошибок
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(cookieParser());

  const port = configService.get('PORT') || 3021;
  await app.listen(port, () =>
    console.debug(
      `\x1b[36m*** Steam Trust Backend started on port: ${port} ***\x1b[0m`,
    ),
  );
}

void bootstrap();
