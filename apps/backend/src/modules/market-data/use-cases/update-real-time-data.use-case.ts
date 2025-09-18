import { Injectable, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RealTimeDataRepository } from '@app/shared/domain/repositories/stocks/real-time-data.repository';
import { RealTimeData } from '@app/shared/domain/models/stocks/real-time-data.model';

export interface UpdateRealTimeDataRequest {
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  askPrice: number;
  askSize: number;
  bidPrice: number;
  bidSize: number;
}

export interface BulkUpdateRealTimeDataRequest {
  data: UpdateRealTimeDataRequest[];
}

@Injectable()
export class UpdateRealTimeDataUseCase {
  constructor(
    @InjectPinoLogger(UpdateRealTimeDataUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('RealTimeDataRepository')
    private readonly realTimeDataRepository: RealTimeDataRepository,
  ) {}

  /**
   * Crea un nuevo registro de datos en tiempo real para un ticker específico
   */
  async execute(request: UpdateRealTimeDataRequest): Promise<RealTimeData> {
    try {
      this.logger.info(
        `[UpdateRealTimeDataUseCase.execute] Creating real-time data for ticker: ${request.ticker}`,
      );

      const createData: Omit<RealTimeData, 'id'> = {
        Ticker: request.ticker,
        Open: request.open,
        High: request.high,
        Low: request.low,
        Close: request.close,
        AskPrice: request.askPrice,
        AskSize: request.askSize,
        BidPrice: request.bidPrice,
        BidSize: request.bidSize,
      };

      const realTimeData = await this.realTimeDataRepository.createOne({
        data: createData as RealTimeData
      });

      this.logger.info(
        `[UpdateRealTimeDataUseCase.execute] ✅ Successfully created real-time data for ticker: ${request.ticker}`,
      );

      return realTimeData;
    } catch (error) {
      this.logger.error(
        `[UpdateRealTimeDataUseCase.execute] Error creating real-time data for ticker ${request.ticker}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Actualiza múltiples registros de datos en tiempo real de forma masiva
   */
  async executeBulk(request: BulkUpdateRealTimeDataRequest): Promise<void> {
    try {
      this.logger.info(
        `[UpdateRealTimeDataUseCase.executeBulk] Bulk updating real-time data for ${request.data.length} tickers`,
      );

      const dataToUpsert = request.data.map(item => ({
        Ticker: item.ticker,
        Open: item.open,
        High: item.high,
        Low: item.low,
        Close: item.close,
        AskPrice: item.askPrice,
        AskSize: item.askSize,
        BidPrice: item.bidPrice,
        BidSize: item.bidSize,
      }));

      await this.realTimeDataRepository.bulkInsert(dataToUpsert);

      this.logger.info(
        `[UpdateRealTimeDataUseCase.executeBulk] ✅ Successfully bulk updated real-time data for ${request.data.length} tickers`,
      );

    } catch (error) {
      this.logger.error(
        `[UpdateRealTimeDataUseCase.executeBulk] Error bulk updating real-time data: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtiene los datos en tiempo real más recientes de un ticker específico
   */
  async getByTicker(ticker: string): Promise<RealTimeData | null> {
    try {
      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getByTicker] Getting latest real-time data for ticker: ${ticker}`,
      );

      const realTimeData = await this.realTimeDataRepository.findLatestByTicker(ticker);

      if (realTimeData) {
        this.logger.debug(
          `[UpdateRealTimeDataUseCase.getByTicker] Found real-time data for ticker: ${ticker}`,
        );
      } else {
        this.logger.debug(
          `[UpdateRealTimeDataUseCase.getByTicker] No real-time data found for ticker: ${ticker}`,
        );
      }

      return realTimeData;
    } catch (error) {
      this.logger.error(
        `[UpdateRealTimeDataUseCase.getByTicker] Error getting real-time data for ticker ${ticker}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtiene todos los registros de un ticker específico
   */
  async getAllByTicker(ticker: string): Promise<RealTimeData[]> {
    try {
      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getAllByTicker] Getting all real-time data for ticker: ${ticker}`,
      );

      const realTimeData = await this.realTimeDataRepository.findByTicker(ticker);

      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getAllByTicker] Found ${realTimeData.length} records for ticker: ${ticker}`,
      );

      return realTimeData;
    } catch (error) {
      this.logger.error(
        `[UpdateRealTimeDataUseCase.getAllByTicker] Error getting all real-time data for ticker ${ticker}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtiene los datos en tiempo real de múltiples tickers
   */
  async getByTickers(tickers: string[]): Promise<RealTimeData[]> {
    try {
      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getByTickers] Getting real-time data for ${tickers.length} tickers`,
      );

      const realTimeData = await this.realTimeDataRepository.findByTickers(tickers);

      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getByTickers] Found real-time data for ${realTimeData.length}/${tickers.length} tickers`,
      );

      return realTimeData;
    } catch (error) {
      this.logger.error(
        `[UpdateRealTimeDataUseCase.getByTickers] Error getting real-time data for multiple tickers: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtiene los últimos datos en tiempo real (útil para dashboard)
   */
  async getLatestData(limit: number = 100): Promise<RealTimeData[]> {
    try {
      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getLatestData] Getting latest ${limit} real-time data records`,
      );

      const latestData = await this.realTimeDataRepository.findLatestData(limit);

      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getLatestData] Retrieved ${latestData.length} latest real-time data records`,
      );

      return latestData;
    } catch (error) {
      this.logger.error(
        `[UpdateRealTimeDataUseCase.getLatestData] Error getting latest real-time data: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtiene tickers con spread bid-ask significativo
   */
  async getTickersWithSignificantSpread(minSpread: number = 0.01): Promise<RealTimeData[]> {
    try {
      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getTickersWithSignificantSpread] Getting tickers with min spread: ${minSpread}`,
      );

      const tickersWithSpread = await this.realTimeDataRepository.findTickersWithBidAskSpread(minSpread);

      this.logger.debug(
        `[UpdateRealTimeDataUseCase.getTickersWithSignificantSpread] Found ${tickersWithSpread.length} tickers with significant spread`,
      );

      return tickersWithSpread;
    } catch (error) {
      this.logger.error(
        `[UpdateRealTimeDataUseCase.getTickersWithSignificantSpread] Error getting tickers with significant spread: ${error.message}`,
      );
      throw error;
    }
  }
}
