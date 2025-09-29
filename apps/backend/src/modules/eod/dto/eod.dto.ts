import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetHistoricalDataDto {
  @IsString()
  symbol: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  @Type(() => Number)
  days?: number;

  @IsOptional()
  @IsEnum(['d', 'w', 'm'])
  period?: 'd' | 'w' | 'm' = 'd';

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetTickersListDto {
  @IsString()
  exchange: string;

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetExchangesListDto {
  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetFundamentalsDto {
  @IsString()
  symbol: string;

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetDailyBulkDataDto {
  @IsString()
  market: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetDelayedDataDto {
  @IsString()
  symbol: string;

  @IsOptional()
  @IsString()
  multiTickers?: string;

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetEconomicEventsDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetHolidaysDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetSplitsDto {
  @IsString()
  country: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class GetRealTimeDataDto {
  @IsArray()
  @IsString({ each: true })
  symbols: string[];

  @IsOptional()
  @IsString()
  format?: string = 'json';
}

export class EODHistoricalDataResponse {
  code: string;
  exchange_short_name: string;
  exchange_long_name: string;
  name: string;
  type: string;
  country: string;
  currency: string;
  data: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjusted_close: number;
    volume: number;
  }>;
}

export class EODTickersListResponse {
  Code: string;
  Name: string;
  Country: string;
  Exchange: string;
  Currency: string;
  Type: string;
  Isin: string;
}

export class EODExchangesListResponse {
  Name: string;
  Code: string;
  OperatingMIC: string;
  Country: string;
  Currency: string;
  CountryISO2: string;
  CountryISO3: string;
}

export class EODFundamentalsResponse {
  General: {
    Code: string;
    Type: string;
    Name: string;
    Exchange: string;
    CurrencyCode: string;
    CurrencyName: string;
    CurrencySymbol: string;
    CountryName: string;
    CountryISO: string;
    ISIN: string;
    CUSIP: string;
    CIK: string;
    EmployerIdNumber: string;
    FiscalYearEnd: string;
    IPODate: string;
    InternationalDomestic: string;
    Sector: string;
    Industry: string;
    GicSector: string;
    GicGroup: string;
    GicIndustry: string;
    GicSubIndustry: string;
    Description: string;
    Address: string;
    AddressData: any;
    Listings: any;
    WebURL: string;
    LogoURL: string;
    FullTimeEmployees: number;
    UpdatedAt: string;
  };
  Highlights: any;
  Valuation: any;
  SharesStats: any;
  Technicals: any;
  SplitsDividends: any;
  AnalystRatings: any;
  Holders: any;
  InsiderTransactions: any;
  ESGScores: any;
  OutstandingShares: any;
  Earnings: any;
  Financials: any;
}

export class EODEconomicEventResponse {
  date: string;
  country: string;
  event: string;
  currency: string;
  actual: string;
  estimate: string;
  impact: string;
  previous: string;
}

export class EODHolidayResponse {
  date: string;
  exchange: string;
  name: string;
  country: string;
  type: string;
}

export class EODSplitResponse {
  date: string;
  split: string;
}

export class EODRealTimeDataResponse {
  s: string; // symbol
  a: number; // ask
  b: number; // bid
  p: number; // price
  t: number; // timestamp
  dc: number; // daily change
  dd: number; // daily change percent
  o: number; // open
  h: number; // high
  l: number; // low
  v: number; // volume
}

export class EODDailyBulkDataResponse {
  code: string;
  exchange_short_name: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export class EODDelayedDataResponse {
  code: string;
  exchange_short_name: string;
  name: string;
  type: string;
  country: string;
  currency: string;
  isin: string;
  cusip: string;
  cik: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
  timestamp: number;
  last_trade_time: string;
  last_trade_time_unix: number;
  last_trade_time_utc: string;
  last_trade_time_utc_unix: number;
  last_trade_time_utc_offset: number;
  last_trade_time_utc_offset_seconds: number;
  last_trade_time_utc_offset_string: string;
  last_trade_time_utc_offset_string_short: string;
  last_trade_time_utc_offset_string_long: string;
}
