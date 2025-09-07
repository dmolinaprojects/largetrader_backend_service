export interface MarketEconomicEvents {
  Id: number;
  Date: Date;
  Time: string;
  Currency: string;
  Impact: string;
  Event: string;
  Actual: string | null;
  Forecast: string | null;
  Previous: string | null;
  Country: string;
  Description: string | null;
}
