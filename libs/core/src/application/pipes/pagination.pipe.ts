// import { Traceable } from '@amplication/opentelemetry-nestjs';
import { Injectable, PipeTransform } from '@nestjs/common';
import { TPaginationDto, TPaginationInput } from '../../domain';

// @Traceable()
@Injectable()
export class PaginationPipe implements PipeTransform {
  transform({ elementsByPage, page }: TPaginationInput): TPaginationDto {
    return { take: elementsByPage, skip: elementsByPage * (page - 1) };
  }
}
