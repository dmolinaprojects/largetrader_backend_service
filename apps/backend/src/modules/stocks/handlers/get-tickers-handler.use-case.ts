import { Injectable, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  GetTickersUseCase,
  GetTickersRequest,
} from '../use-cases/get-tickers.use-case';

@Injectable()
export class GetTickersHandlerUseCase {
  constructor(
    @InjectPinoLogger(GetTickersHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly useCase: GetTickersUseCase,
  ) {}

  async execute(request: GetTickersRequest) {
    this.logger.info(`[GetTickersHandler] request=${JSON.stringify(request)}`);
    return this.useCase.execute(request);
  }
}
