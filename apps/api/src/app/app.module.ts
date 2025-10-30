import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { InterceptorModule } from './interceptors/interceptor.module';
import { AuthModule } from './modules/auth/auth.module';
import { FinanceModule } from './modules/finances/finance.module';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [PrismaModule, UserModule, InterceptorModule, AuthModule, TaskModule, FinanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
