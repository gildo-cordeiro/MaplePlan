import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ZodTypeAny, ZodError } from 'zod';
import { Observable } from 'rxjs';

@Injectable()
export class ZodValidationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const handler = context.getHandler();
    const schema = this.reflector.get<ZodTypeAny | undefined>('zod:schema', handler);
    if (!schema) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const result = (schema as ZodTypeAny).safeParse(req.body);
    if (!result.success) {
      const zodError = result.error as ZodError<unknown>;
      const issues = zodError.issues.map((i) => ({ path: i.path.map((p) => String(p)), message: i.message }));
      throw new BadRequestException({ message: 'Validation failed', issues });
    }

    req.body = result.data;
    return next.handle();
  }
}
