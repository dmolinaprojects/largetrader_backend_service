import { Injectable, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  SignalsRepository,
  SignalsGroupsRepository,
} from '@app/shared';
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
export class GetSignalsUseCase {
  constructor(
    @InjectPinoLogger(GetSignalsUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('SignalsRepository')
    private readonly signalsRepository: SignalsRepository,
    @Inject('SignalsGroupsRepository')
    private readonly signalsGroupsRepository: SignalsGroupsRepository,
  ) {}

  async execute(request: GetSignalsRequest): Promise<GetSignalsResponse> {
    this.logger.info(
      `[GetSignalsUseCase.execute] Getting signals with filters: ${JSON.stringify(request)}`,
    );

    const skip = (request.page - 1) * request.limit;

    // Construir filtros
    const whereClause: any = {};
    if (request.groupId) whereClause.IdGroup = { equals: request.groupId };
    if (request.ticker) whereClause.Ticker = { contains: request.ticker };
    if (request.orderType)
      whereClause.OrderType = { equals: request.orderType };

    // Obtener señales con paginación
    const [signals, total] = await Promise.all([
      this.signalsRepository.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        skip,
        take: request.limit,
      }),
      this.signalsRepository
        .findMany({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        })
        .then((results) => results.length),
    ]);

    // Obtener información de grupos para las señales
    const groupIds = [...new Set(signals.map((signal) => signal.IdGroup))];
    const groups = await Promise.all(
      groupIds.map((id) =>
        this.signalsGroupsRepository.findOne({ where: { Id: id } }),
      ),
    );

    const groupsMap = new Map(
      groups.filter((group) => group).map((group) => [group!.Id, group!.Name]),
    );

    // Mapear señales con información de grupos
    const signalsWithGroups: SignalsResponseDto[] = signals.map((signal) => ({
      ...signal,
      GroupName: groupsMap.get(signal.IdGroup) || 'Unknown Group',
    }));

    const totalPages = Math.ceil(total / request.limit);

    const response: GetSignalsResponse = {
      signals: signalsWithGroups,
      total,
      page: request.page,
      limit: request.limit,
      totalPages,
    };

    this.logger.info(
      `[GetSignalsUseCase.execute] Successfully retrieved ${signalsWithGroups.length} signals out of ${total} total`,
    );

    return response;
  }
}
