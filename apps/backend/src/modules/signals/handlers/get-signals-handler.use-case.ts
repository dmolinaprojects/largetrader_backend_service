import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetSignalsUseCase } from '../use-cases/get-signals.use-case';
import { SignalsResponseDto } from '../dto/signals-response.dto';

export interface GetSignalsRequest {
  page: number;
  limit: number;
  groupId?: number;
  ticker?: string;
  orderType?: string;
}

export interface GetSignalsResponse {
  signals: SignalsResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GetSignalsHandlerUseCase {
  constructor(
    @InjectPinoLogger(GetSignalsHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly getSignalsUseCase: GetSignalsUseCase,
  ) {}

  async execute(request: GetSignalsRequest): Promise<GetSignalsResponse> {
    this.logger.info(
      `[GetSignalsHandlerUseCase.execute] Processing request: ${JSON.stringify(request)}`,
    );

    const result = await this.getSignalsUseCase.execute(request);

    this.logger.info(
      `[GetSignalsHandlerUseCase.execute] Successfully processed request. Found ${result.signals.length} signals`,
    );

    return result;
  }
}
