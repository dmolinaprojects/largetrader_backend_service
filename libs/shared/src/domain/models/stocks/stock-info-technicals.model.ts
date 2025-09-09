export interface StockInfoTechnicals {
  Id: number;
  IdStock: number;
  MarketCapitalizationK: number;
  EbitdaK: number;
  PeRatio: number;
  PegRatio: number;
  WallStreetTargetPrice: number;
  BookValue: number;
  DividendShare: number;
  DividendYield: number;
  EarningsShare: number;
  ProfitMargin: number;
  RevenuePerShareTtm: number;
  QuarterlyRevenueGrowthYoy: number;
  GrossProfitTtm: number;
  DilutedEpsTtm: number;
  QuarterlyEarningsGrowthYoy: number;
  ForwardPe: number;
  WeekHigh: number; // 52WeekHigh
  WeekLow: number; // 52WeekLow
  DayMA: number; // 50DayMA
  DayMA200: number; // 200DayMA
  SharesShort: number;
  SharesShortPriorMonth: number;
  ShortRatio: number;
  ShortPercent: number;
}
