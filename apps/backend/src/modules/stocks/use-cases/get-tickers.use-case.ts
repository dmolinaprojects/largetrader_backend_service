import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Ticker, TickersRepository } from '@app/shared';
import { TFindManyArgsWhere } from '@app/core';

export interface GetTickersRequest {
  q?: string;
  type?: string;
  country?: string;
  page: number;
  limit: number;
}

@Injectable()
export class GetTickersUseCase {
  constructor(
    @InjectPinoLogger(GetTickersUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('TickersRepository')
    private readonly tickersRepo: TickersRepository,
  ) {}

  async execute(req: GetTickersRequest) {
    // El repositorio aplica 'contains' para strings. Aquí sólo pasamos valores planos.
    const where: { tiker?: string; type?: string; country?: string } = {};
    if (req.q) {
      where.tiker = req.q;
    }
    if (req.type) where.type = req.type;
    if (req.country) where.country = req.country;

    const skip = (req.page - 1) * req.limit;
    const [items, total] = await Promise.all([
      this.tickersRepo.findMany({
        where: where as TFindManyArgsWhere<Ticker>,
        skip,
        take: req.limit,
      }),
      this.tickersRepo.count(where),
    ]);

    return {
      items,
      total,
      page: req.page,
      limit: req.limit,
      totalPages: Math.ceil(total / req.limit),
    };
  }
}
