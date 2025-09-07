export interface StockInfoEarnings {
  Id: number;
  IdStock: number;
  ReportDate: Date;
  Date: Date;
  BeforeAfterMarket: string;
  Currency: string;
  EpsActual: number;
  EpsEstimate: number;
  EpsDifference: number;
  SurpricePercent: number;
}
