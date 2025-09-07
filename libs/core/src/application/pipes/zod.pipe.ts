/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-return */
// import { Traceable } from '@amplication/opentelemetry-nestjs';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodEffects, ZodObject, ZodPipeline, ZodUnion } from 'zod';

// @Traceable()
@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(
    private readonly schema:
      | ZodObject<any>
      | ZodEffects<any>
      | ZodPipeline<any, any>
      | ZodUnion<any>,
  ) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error: any) {
      throw new BadRequestException(
        error?.issues?.at(0)?.message ?? error.message,
      );
    }
  }
}
