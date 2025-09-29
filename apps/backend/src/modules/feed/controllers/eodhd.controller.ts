import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiBody
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetEODHDHistoricalDataUseCase } from '../use-cases/get-eodhd-historical-data.use-case';
import { 
  GetEODHDHistoricalDataDto,
  GetEODHDMultipleHistoricalDataDto,
  GetEODHDLastPriceDto,
  EODHDResponseDto,
  EODHDMultipleResponseDto,
  EODHDLastPriceResponseDto,
  EODHDInternalFormatDto
} from '../dto/eodhd.dto';
import { EODHDService } from '../services/eodhd.service';
import { runEODHDExamples } from '../examples/eodhd-usage.example';

@ApiTags('EODHD - Datos Históricos Externos')
@Controller('feed/eodhd')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class EODHDController {
  constructor(
    private readonly getEODHDHistoricalDataUseCase: GetEODHDHistoricalDataUseCase,
    private readonly eodhdService: EODHDService,
  ) {}

  @Get('historical-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener datos históricos de N días para un símbolo',
    description: 'Obtiene datos históricos de la API de EODHD para un símbolo específico durante N días',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos históricos obtenidos exitosamente',
    type: EODHDResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos o error en la API',
  })
  @ApiQuery({ name: 'symbol', description: 'Símbolo del activo (formato: SYMBOL.EXCHANGE)', example: 'AAPL.US' })
  @ApiQuery({ name: 'days', description: 'Número de días de datos históricos', example: 30 })
  @ApiQuery({ name: 'period', description: 'Período de los datos (d=daily, w=weekly, m=monthly)', example: 'd', required: false })
  async getHistoricalData(@Query() query: GetEODHDHistoricalDataDto): Promise<EODHDResponseDto> {
    try {
      return await this.getEODHDHistoricalDataUseCase.execute(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('historical-data-multiple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener datos históricos de N días para múltiples símbolos',
    description: 'Obtiene datos históricos de la API de EODHD para múltiples símbolos durante N días',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos históricos múltiples obtenidos exitosamente',
    type: EODHDMultipleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos o error en la API',
  })
  @ApiBody({ type: GetEODHDMultipleHistoricalDataDto })
  async getMultipleHistoricalData(@Body() body: GetEODHDMultipleHistoricalDataDto): Promise<EODHDMultipleResponseDto> {
    try {
      return await this.getEODHDHistoricalDataUseCase.executeMultiple(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('last-price')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener último precio de cierre de un símbolo',
    description: 'Obtiene el último precio de cierre de un símbolo específico desde la API de EODHD',
  })
  @ApiResponse({
    status: 200,
    description: 'Último precio obtenido exitosamente',
    type: EODHDLastPriceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Símbolo inválido o error en la API',
  })
  @ApiQuery({ name: 'symbol', description: 'Símbolo del activo (formato: SYMBOL.EXCHANGE)', example: 'AAPL.US' })
  async getLastPrice(@Query() query: GetEODHDLastPriceDto): Promise<EODHDLastPriceResponseDto> {
    try {
      return await this.getEODHDHistoricalDataUseCase.executeLastPrice(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('historical-data-internal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener datos históricos en formato interno del sistema',
    description: 'Obtiene datos históricos de la API de EODHD y los convierte al formato interno del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos históricos en formato interno obtenidos exitosamente',
    type: EODHDInternalFormatDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos o error en la API',
  })
  @ApiQuery({ name: 'symbol', description: 'Símbolo del activo (formato: SYMBOL.EXCHANGE)', example: 'AAPL.US' })
  @ApiQuery({ name: 'days', description: 'Número de días de datos históricos', example: 30 })
  @ApiQuery({ name: 'period', description: 'Período de los datos (d=daily, w=weekly, m=monthly)', example: 'd', required: false })
  async getHistoricalDataInternal(@Query() query: GetEODHDHistoricalDataDto): Promise<EODHDInternalFormatDto> {
    try {
      return await this.getEODHDHistoricalDataUseCase.executeInternalFormat(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('historical-data-multiple-internal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener datos históricos múltiples en formato interno del sistema',
    description: 'Obtiene datos históricos de la API de EODHD para múltiples símbolos y los convierte al formato interno del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos históricos múltiples en formato interno obtenidos exitosamente',
    type: [EODHDInternalFormatDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos o error en la API',
  })
  @ApiBody({ type: GetEODHDMultipleHistoricalDataDto })
  async getMultipleHistoricalDataInternal(@Body() body: GetEODHDMultipleHistoricalDataDto): Promise<EODHDInternalFormatDto[]> {
    try {
      return await this.getEODHDHistoricalDataUseCase.executeMultipleInternalFormat(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar estado de la API de EODHD',
    description: 'Verifica si la API de EODHD está disponible y funcionando correctamente',
  })
  @ApiResponse({
    status: 200,
    description: 'API de EODHD está funcionando correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'API de EODHD no está disponible',
  })
  async checkHealth(): Promise<{ status: string; message: string; timestamp: string }> {
    try {
      // Usar un símbolo de prueba para verificar la conectividad
      const testSymbol = 'AAPL.US';
      await this.getEODHDHistoricalDataUseCase.executeLastPrice({ symbol: testSymbol });
      
      return {
        status: 'healthy',
        message: 'API de EODHD está funcionando correctamente',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `API de EODHD no está disponible: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('examples')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ejecutar ejemplos de uso de EODHD',
    description: 'Ejecuta una serie de ejemplos que demuestran las capacidades de la integración con EODHD',
  })
  @ApiResponse({
    status: 200,
    description: 'Ejemplos ejecutados exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error ejecutando ejemplos',
  })
  async runExamples(): Promise<{ status: string; message: string; timestamp: string }> {
    try {
      await runEODHDExamples(this.eodhdService, this.getEODHDHistoricalDataUseCase);
      
      return {
        status: 'success',
        message: 'Ejemplos ejecutados exitosamente. Revisa los logs para ver los resultados.',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error ejecutando ejemplos: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}
