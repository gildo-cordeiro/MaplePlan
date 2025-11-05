import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FinanceModule } from './modules/finances/finance.module';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    TaskModule,
    FinanceModule
  ]
})
export class AppModule {}
