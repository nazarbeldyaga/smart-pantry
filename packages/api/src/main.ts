import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.use(morgan('dev'));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  app.enableCors();
  await app.listen(port);
  console.log(`API server running on port ${port}`);
}
bootstrap();
