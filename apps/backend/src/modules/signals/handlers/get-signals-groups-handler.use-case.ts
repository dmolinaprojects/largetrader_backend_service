import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetSignalsGroupsUseCase } from '../use-cases/get-signals-groups.use-case';
import { SignalsGroupsResponseDto } from '../dto/signals-groups-response.dto';

export interface GetSignalsGroupsRequest {
  name?: string;
}

export interface GetSignalsGroupsResponse {
  groups: SignalsGroupsResponseDto[];
  total: number;
}

@Injectable()
export class GetSignalsGroupsHandlerUseCase {
  constructor(
    @InjectPinoLogger(GetSignalsGroupsHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly getSignalsGroupsUseCase: GetSignalsGroupsUseCase,
  ) {}

  async execute(
    request: GetSignalsGroupsRequest,
  ): Promise<GetSignalsGroupsResponse> {
    this.logger.info(
      `[GetSignalsGroupsHandlerUseCase.execute] Processing request: ${JSON.stringify(request)}`,
    );

    const result = await this.getSignalsGroupsUseCase.execute(request);

    this.logger.info(
      `[GetSignalsGroupsHandlerUseCase.execute] Successfully processed request. Found ${result.groups.length} groups`,
    );

    return result;
  }
}
