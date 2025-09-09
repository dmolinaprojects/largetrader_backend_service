import { Injectable } from '@nestjs/common';
import { GetSymbolInfoUseCase } from '../use-cases/get-symbol-info.use-case';
import { SymbolInfoResponse } from '@app/shared';

@Injectable()
export class GetSymbolInfoHandlerUseCase {
  constructor(private readonly getSymbolInfoUseCase: GetSymbolInfoUseCase) {}

  async handle(symbol: string): Promise<SymbolInfoResponse | null> {
    return this.getSymbolInfoUseCase.execute(symbol);
  }
}
