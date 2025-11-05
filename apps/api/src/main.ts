import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaService } from './app/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation using class-validator decorators on DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const port = process.env.PORT ? Number(process.env.PORT) : 8080;
  await app.listen(port);
}
bootstrap();