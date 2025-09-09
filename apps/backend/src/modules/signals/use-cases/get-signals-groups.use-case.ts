import { Injectable, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  SignalsGroupsRepository,
  SignalsRepository,
} from '@app/shared';
import { SignalsGroupsResponseDto } from '../dto/signals-groups-response.dto';

export interface GetSignalsGroupsRequest {
  name?: string;
}

export interface GetSignalsGroupsResponse {
  groups: SignalsGroupsResponseDto[];
  total: number;
}

@Injectable()
export class GetSignalsGroupsUseCase {
  constructor(
    @InjectPinoLogger(GetSignalsGroupsUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('SignalsGroupsRepository')
    private readonly signalsGroupsRepository: SignalsGroupsRepository,
    @Inject('SignalsRepository')
    private readonly signalsRepository: SignalsRepository,
  ) {}

  async execute(
    request: GetSignalsGroupsRequest,
  ): Promise<GetSignalsGroupsResponse> {
    this.logger.info(
      `[GetSignalsGroupsUseCase.execute] Getting signals groups with filters: ${JSON.stringify(request)}`,
    );

    // Obtener grupos de señales
    const groups = await this.signalsGroupsRepository.findMany({
      where: request.name ? { Name: { contains: request.name } } : {},
    });

    // Obtener conteo de señales por grupo
    const groupsWithCounts: SignalsGroupsResponseDto[] = await Promise.all(
      groups.map(async (group) => {
        const signalsCount = await this.signalsRepository.countSignalsByGroup(
          group.Id,
        );
        return {
          ...group,
          signalsCount,
        };
      }),
    );

    const response: GetSignalsGroupsResponse = {
      groups: groupsWithCounts,
      total: groupsWithCounts.length,
    };

    this.logger.info(
      `[GetSignalsGroupsUseCase.execute] Successfully retrieved ${groupsWithCounts.length} groups`,
    );

    return response;
  }
}
