import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { ExecuteService } from './execute/execute.service'; // Đảm bảo đường dẫn đúng

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const executeService = app.get(ExecuteService);
  executeService.onInitialProject();
  app.use(compression());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());



  await app.listen(3001);
}
bootstrap();
