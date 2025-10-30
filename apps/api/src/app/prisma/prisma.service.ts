import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

async onModuleInit() {
  try {
    await this.$connect();
  } catch (e) {
    console.warn('Prisma connect failed:', e);
  }
}

    async onModuleDestroy() {
        await this.$disconnect();
    }
}