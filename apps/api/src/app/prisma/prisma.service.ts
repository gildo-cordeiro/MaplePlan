import { Injectable, OnModuleInit, OnModuleDestroy, Logger, INestApplication } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  // Called when Nest starts the module
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to the database');
    } catch (error: unknown) {
      // Log the error but do not crash the whole application in dev environments
      this.logger.error(`Prisma connect failed: ${String(error)}`);
    }
  }

  /**
   * Register a hook so that when Prisma emits `beforeExit` we gracefully shutdown Nest.
   * Call this from your main.ts after creating the Nest application instance:
   * await prismaService.enableShutdownHooks(app)
   */
  async enableShutdownHooks(app: INestApplication) {
    type PrismaAny = { $on: (event: string, callback: (...args: unknown[]) => void) => void };
    (this as unknown as PrismaAny).$on('beforeExit', async () => {
      this.logger.log('Prisma beforeExit called - closing Nest application');
      await app.close();
    });
  }

  // Called when Nest destroys the module
  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Disconnected from the database');
    } catch (error: unknown) {
      this.logger.error(`Error during Prisma disconnect: ${String(error)}`);
    }
  }
}