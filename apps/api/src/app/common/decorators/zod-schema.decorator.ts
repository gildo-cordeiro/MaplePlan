import { SetMetadata } from '@nestjs/common';
import type { ZodTypeAny } from 'zod';

export const ZOD_SCHEMA_KEY = 'zod:schema';

export const ZodSchema = (schema: ZodTypeAny) => SetMetadata(ZOD_SCHEMA_KEY, schema);
