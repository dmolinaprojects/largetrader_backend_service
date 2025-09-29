/**
 * Ejemplos de uso de la utilidad EODHD
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar la integración con EODHD
 * para obtener datos históricos de diferentes tipos de activos financieros.
 */

import { EODHDService } from '../services/eodhd.service';
import { GetEODHDHistoricalDataUseCase } from '../use-cases/get-eodhd-historical-data.use-case';

export class EODHDUsageExamples {
  constructor(
    private readonly eodhdService: EODHDService,
    private readonly getEODHDHistoricalDataUseCase: GetEODHDHistoricalDataUseCase,
  ) {}

  /**
   * Ejemplo 1: Obtener datos históricos de una acción individual
   */
  async getSingleStockData() {
    console.log('=== Ejemplo 1: Datos de una acción individual ===');
    
    try {
      // Obtener 30 días de datos de Apple
      const data = await this.eodhdService.getHistoricalData('AAPL.US', 30, 'd');
      
      console.log(`Símbolo: ${data.code}`);
      console.log(`Empresa: ${data.name}`);
      console.log(`Moneda: ${data.currency}`);
      console.log(`Datos obtenidos: ${data.data.length} registros`);
      
      // Mostrar los últimos 5 días
      const last5Days = data.data.slice(-5);
      console.log('\nÚltimos 5 días:');
      last5Days.forEach(day => {
        console.log(`${day.date}: Open=${day.open}, High=${day.high}, Low=${day.low}, Close=${day.close}, Volume=${day.volume}`);
      });
      
      return data;
    } catch (error) {
      console.error('Error obteniendo datos de Apple:', error.message);
      throw error;
    }
  }

  /**
   * Ejemplo 2: Obtener datos de múltiples acciones
   */
  async getMultipleStocksData() {
    console.log('\n=== Ejemplo 2: Datos de múltiples acciones ===');
    
    const symbols = ['AAPL.US', 'TSLA.US', 'MSFT.US', 'GOOGL.US'];
    
    try {
      const results = await this.eodhdService.getMultipleHistoricalData(symbols, 7, 'd');
      
      console.log(`Símbolos procesados: ${symbols.length}`);
      console.log(`Resultados exitosos: ${results.length}`);
      
      results.forEach(result => {
        console.log(`\n${result.code}: ${result.name}`);
        console.log(`  Datos: ${result.data.length} registros`);
        if (result.data.length > 0) {
          const lastDay = result.data[result.data.length - 1];
          console.log(`  Último precio: $${lastDay.close} (${lastDay.date})`);
        }
      });
      
      return results;
    } catch (error) {
      console.error('Error obteniendo datos múltiples:', error.message);
      throw error;
    }
  }

  /**
   * Ejemplo 3: Obtener datos de criptomonedas
   */
  async getCryptoData() {
    console.log('\n=== Ejemplo 3: Datos de criptomonedas ===');
    
    const cryptoSymbols = ['BTC-USD.CC', 'ETH-USD.CC', 'ADA-USD.CC'];
    
    try {
      const results = await this.eodhdService.getMultipleHistoricalData(cryptoSymbols, 14, 'd');
      
      console.log('Datos de criptomonedas:');
      results.forEach(result => {
        console.log(`\n${result.code}: ${result.name}`);
        if (result.data.length > 0) {
          const lastDay = result.data[result.data.length - 1];
          const firstDay = result.data[0];
          const change = ((lastDay.close - firstDay.close) / firstDay.close * 100).toFixed(2);
          console.log(`  Precio actual: $${lastDay.close}`);
          console.log(`  Cambio 14 días: ${change}%`);
        }
      });
      
      return results;
    } catch (error) {
      console.error('Error obteniendo datos de crypto:', error.message);
      throw error;
    }
  }

  /**
   * Ejemplo 4: Obtener datos de forex
   */
  async getForexData() {
    console.log('\n=== Ejemplo 4: Datos de forex ===');
    
    const forexSymbols = ['EURUSD.FOREX', 'GBPUSD.FOREX', 'USDJPY.FOREX'];
    
    try {
      const results = await this.eodhdService.getMultipleHistoricalData(forexSymbols, 7, 'd');
      
      console.log('Datos de forex:');
      results.forEach(result => {
        console.log(`\n${result.code}: ${result.name}`);
        if (result.data.length > 0) {
          const lastDay = result.data[result.data.length - 1];
          console.log(`  Último precio: ${lastDay.close}`);
          console.log(`  Rango del día: ${lastDay.low} - ${lastDay.high}`);
        }
      });
      
      return results;
    } catch (error) {
      console.error('Error obteniendo datos de forex:', error.message);
      throw error;
    }
  }

  /**
   * Ejemplo 5: Obtener último precio de múltiples símbolos
   */
  async getLastPrices() {
    console.log('\n=== Ejemplo 5: Últimos precios ===');
    
    const symbols = ['AAPL.US', 'TSLA.US', 'BTC-USD.CC', 'EURUSD.FOREX'];
    
    try {
      const prices = await Promise.allSettled(
        symbols.map(symbol => this.eodhdService.getLastClosePrice(symbol))
      );
      
      console.log('Últimos precios:');
      symbols.forEach((symbol, index) => {
        const result = prices[index];
        if (result.status === 'fulfilled') {
          console.log(`${symbol}: $${result.value}`);
        } else {
          console.log(`${symbol}: Error - ${result.reason.message}`);
        }
      });
      
      return prices;
    } catch (error) {
      console.error('Error obteniendo últimos precios:', error.message);
      throw error;
    }
  }

  /**
   * Ejemplo 6: Convertir datos a formato interno
   */
  async convertToInternalFormat() {
    console.log('\n=== Ejemplo 6: Conversión a formato interno ===');
    
    try {
      // Obtener datos en formato EODHD
      const eodhdData = await this.eodhdService.getHistoricalData('AAPL.US', 5, 'd');
      
      // Convertir a formato interno
      const internalData = this.eodhdService.convertToInternalFormat(eodhdData);
      
      console.log('Datos en formato interno:');
      console.log(`Símbolo: ${internalData.symbol}`);
      console.log(`Exchange: ${internalData.exchange}`);
      console.log(`Moneda: ${internalData.currency}`);
      console.log(`Registros: ${internalData.data.length}`);
      
      // Mostrar datos con timestamps
      internalData.data.forEach(item => {
        const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
        console.log(`${date}: O=${item.open}, H=${item.high}, L=${item.low}, C=${item.close}, V=${item.volume}`);
      });
      
      return internalData;
    } catch (error) {
      console.error('Error convirtiendo a formato interno:', error.message);
      throw error;
    }
  }

  /**
   * Ejemplo 7: Análisis de rendimiento de cartera
   */
  async analyzePortfolioPerformance() {
    console.log('\n=== Ejemplo 7: Análisis de rendimiento de cartera ===');
    
    const portfolio = ['AAPL.US', 'TSLA.US', 'MSFT.US', 'GOOGL.US'];
    const days = 30;
    
    try {
      const results = await this.eodhdService.getMultipleHistoricalData(portfolio, days, 'd');
      
      console.log(`Análisis de cartera (${days} días):`);
      console.log('Símbolo\t\tPrecio Inicial\tPrecio Final\tRendimiento');
      console.log('--------------------------------------------------------');
      
      results.forEach(result => {
        if (result.data.length >= 2) {
          const firstPrice = result.data[0].close;
          const lastPrice = result.data[result.data.length - 1].close;
          const performance = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2);
          
          console.log(`${result.code}\t\t$${firstPrice.toFixed(2)}\t\t$${lastPrice.toFixed(2)}\t\t${performance}%`);
        }
      });
      
      return results;
    } catch (error) {
      console.error('Error analizando cartera:', error.message);
      throw error;
    }
  }

  /**
   * Ejemplo 8: Obtener datos semanales y mensuales
   */
  async getWeeklyAndMonthlyData() {
    console.log('\n=== Ejemplo 8: Datos semanales y mensuales ===');
    
    try {
      // Datos semanales (12 semanas)
      const weeklyData = await this.eodhdService.getHistoricalData('AAPL.US', 12, 'w');
      console.log(`Datos semanales: ${weeklyData.data.length} semanas`);
      
      // Datos mensuales (12 meses)
      const monthlyData = await this.eodhdService.getHistoricalData('AAPL.US', 12, 'm');
      console.log(`Datos mensuales: ${monthlyData.data.length} meses`);
      
      // Mostrar resumen
      if (weeklyData.data.length > 0) {
        const lastWeek = weeklyData.data[weeklyData.data.length - 1];
        console.log(`Última semana: ${lastWeek.date} - Precio: $${lastWeek.close}`);
      }
      
      if (monthlyData.data.length > 0) {
        const lastMonth = monthlyData.data[monthlyData.data.length - 1];
        console.log(`Último mes: ${lastMonth.date} - Precio: $${lastMonth.close}`);
      }
      
      return { weeklyData, monthlyData };
    } catch (error) {
      console.error('Error obteniendo datos semanales/mensuales:', error.message);
      throw error;
    }
  }

  /**
   * Ejecutar todos los ejemplos
   */
  async runAllExamples() {
    console.log('🚀 Iniciando ejemplos de uso de EODHD...\n');
    
    try {
      await this.getSingleStockData();
      await this.getMultipleStocksData();
      await this.getCryptoData();
      await this.getForexData();
      await this.getLastPrices();
      await this.convertToInternalFormat();
      await this.analyzePortfolioPerformance();
      await this.getWeeklyAndMonthlyData();
      
      console.log('\n✅ Todos los ejemplos ejecutados exitosamente!');
    } catch (error) {
      console.error('\n❌ Error ejecutando ejemplos:', error.message);
    }
  }
}

/**
 * Función helper para ejecutar ejemplos desde el controlador
 */
export async function runEODHDExamples(
  eodhdService: EODHDService,
  getEODHDHistoricalDataUseCase: GetEODHDHistoricalDataUseCase
) {
  const examples = new EODHDUsageExamples(eodhdService, getEODHDHistoricalDataUseCase);
  await examples.runAllExamples();
}
