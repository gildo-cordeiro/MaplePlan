import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaService } from './app/prisma/prisma.service';
import { ZodValidationInterceptor } from './app/common/interceptors/zod-validation.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const zodInterceptor = app.get(ZodValidationInterceptor);
  app.useGlobalInterceptors(zodInterceptor);
  await app.listen(3333);
}
bootstrap();