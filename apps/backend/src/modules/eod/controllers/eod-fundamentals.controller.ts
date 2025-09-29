import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetEODFundamentalsUseCase } from '../use-cases/get-eod-fundamentals.use-case';
import { GetFundamentalsDto } from '../dto/eod.dto';

@ApiTags('EOD Fundamentals')
@Controller('eod/fundamentals')
export class EODFundamentalsController {
  constructor(private readonly getEODFundamentalsUseCase: GetEODFundamentalsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene datos fundamentales de un símbolo' })
  @ApiResponse({ status: 200, description: 'Datos fundamentales obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'symbol', description: 'Símbolo del activo (ej: AAPL.US)', required: true })
  async getFundamentals(@Query(ValidationPipe) dto: GetFundamentalsDto) {
    return this.getEODFundamentalsUseCase.execute(dto);
  }
}
