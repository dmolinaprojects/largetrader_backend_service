export interface StockDetails {
  Id: number;
  Symbol: string;
  Name: string;
  Exchange: string;
  Currency: string;
  Type: string;
  Country: string;
  Sector: string;
  Industry: string;
  MarketCap: number | null;
  IsActive: boolean;
  LastUpdate: Date | null;
}
