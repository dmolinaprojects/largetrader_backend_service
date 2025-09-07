/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ZodEffects, ZodObject, ZodPipeline, ZodUnion } from 'zod';

export function envValidatorUtil(
  config: Record<string, unknown>,
  schema:
    | ZodObject<any>
    | ZodEffects<any>
    | ZodPipeline<any, any>
    | ZodUnion<any>,
) {
  return schema.parse(config);
}
