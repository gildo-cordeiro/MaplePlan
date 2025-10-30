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
    const shutdown = async () => {
      this.logger.log('Prisma beforeExit called - closing Nest application');
      try {
        await app.close();
      } catch (err) {
        this.logger.error(`Error closing Nest application: ${String(err)}`);
      }
    };

    // Prisma 5+ uses different engines; listen to process events instead of Prisma `$on('beforeExit')`
    process.once('beforeExit', shutdown);
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
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