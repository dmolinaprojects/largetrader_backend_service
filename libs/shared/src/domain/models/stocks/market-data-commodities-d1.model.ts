export interface MarketDataCommoditiesD1 {
  id: number;
  symbol: string;
  quotedate: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedclose: number;
}
