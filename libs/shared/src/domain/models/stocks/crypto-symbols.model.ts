export interface CryptoSymbols {
  Id: number;
  Symbol: string;
  Name: string;
  Type: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  MarketCap: number | null;
  IsActive: boolean;
  LastUpdate: Date | null;
}
