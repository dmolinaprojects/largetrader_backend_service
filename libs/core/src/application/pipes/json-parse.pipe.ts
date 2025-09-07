// import { Traceable } from '@amplication/opentelemetry-nestjs';
import { Injectable, PipeTransform } from '@nestjs/common';

// @Traceable()
@Injectable()
export class JsonParsePipe implements PipeTransform {
  constructor(private readonly keys: string[] = []) {}

  transform(value: string | Record<string, string> | Record<string, string>[]) {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    if (Array.isArray(value)) {
      return this.parseArray(value);
    }

    return this.parseObject(value ?? {});
  }

  private parseObject(value: Record<string, string>) {
    if (!this.keys.length) {
      return Object.fromEntries(
        Object.entries(value).map(([key, value]) => [key, JSON.parse(value)]),
      );
    }

    return this.keys.reduce(
      (value, key) => ({ ...value, [key]: JSON.parse(value[key]) }),
      value,
    );
  }

  private parseArray(value: Record<string, string>[]) {
    return value.map((item) => this.parseObject(item));
  }
}
