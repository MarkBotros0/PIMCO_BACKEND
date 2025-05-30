import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middlewares/http-exception.filter';
import helmet from 'helmet';
import { setupSwagger } from './config/swagger';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true
  });

  // app.enableCors({
  //   origin: 'https://pmico.vercel.app',
  //   credentials: true
  // });
  app.enableCors({
    origin: true,
    credentials: true
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  setupSwagger(app);

  await app.listen(PORT || 8080);
}

bootstrap();
