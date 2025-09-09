import { Injectable } from '@nestjs/common';

@Injectable()
export class GetServerTimeUseCase {
  async execute(): Promise<number> {
    return Math.floor(Date.now() / 1000);
  }
}
