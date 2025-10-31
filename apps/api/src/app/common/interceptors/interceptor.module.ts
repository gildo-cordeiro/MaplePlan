import { Module } from "@nestjs/common";
import { ZodValidationInterceptor } from "./zod-validation.interceptor";

@Module({
  providers: [ZodValidationInterceptor],
  exports: [ZodValidationInterceptor],
})
export class InterceptorModule {}