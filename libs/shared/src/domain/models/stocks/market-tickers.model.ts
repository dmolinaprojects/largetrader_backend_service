export interface MarketTickers {
  Id: number;
  Code: string;
  baseAsset: string;
  quoteAsset: string;
  Name: string;
  Country: string;
  Exchange: string;
  Currency: string;
  Type: string;
  Isin: string;
  LastUpdateH1: Date | null;
  LastUpdateD1: Date | null;
  LastUpdateW1: Date | null;
  Enabled: boolean;
}