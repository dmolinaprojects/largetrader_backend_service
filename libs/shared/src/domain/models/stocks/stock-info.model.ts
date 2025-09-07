export interface StockInfo {
  Id: number;
  Ticker: string;
  Name: string;
  Country: string;
  Exchange: string;
  Currency: string;
  Type: string;
  Isin?: string;
  FiscalYearEnd?: string;
  Sector?: string;
  Industry?: string;
  GicSector?: string;
  GicGroup?: string;
  GicIndustry?: string;
  GicSubIndustry?: string;
  HomeCategory?: string;
  IsDelisted: boolean;
  Description?: string;
  AddrStreet?: string;
  AddrCity?: string;
  AddrState?: string;
  AddrCountry?: string;
  AddrZip?: string;
  WebUrl?: string;
  LogoUrl?: string;
}
