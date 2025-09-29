// Interfaces para EOD Historical Data API

export interface EODHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface EODTicker {
  Code: string;
  Name: string;
  Country: string;
  Exchange: string;
  Currency: string;
  Type: string;
  Isin: string;
}

export interface EODExchange {
  Name: string;
  Code: string;
  OperatingMIC: string;
  Country: string;
  Currency: string;
  CountryISO2: string;
  CountryISO3: string;
}

export interface EODFundamentals {
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

export interface EODEconomicEvent {
  date: string;
  country: string;
  event: string;
  currency: string;
  actual: string;
  estimate: string;
  impact: string;
  previous: string;
}

export interface EODHoliday {
  date: string;
  exchange: string;
  name: string;
  country: string;
  type: string;
}

export interface EODSplit {
  date: string;
  split: string;
}

export interface EODRealTimeData {
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

export interface EODDailyBulkData {
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

export interface EODDelayedData {
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
  last_trade_time_utc_offset_string_short_alt: string;
  last_trade_time_utc_offset_string_long_alt: string;
  last_trade_time_utc_offset_string_short_alt2: string;
  last_trade_time_utc_offset_string_long_alt2: string;
  last_trade_time_utc_offset_string_short_alt3: string;
  last_trade_time_utc_offset_string_long_alt3: string;
  last_trade_time_utc_offset_string_short_alt4: string;
  last_trade_time_utc_offset_string_long_alt4: string;
  last_trade_time_utc_offset_string_short_alt5: string;
  last_trade_time_utc_offset_string_long_alt5: string;
  last_trade_time_utc_offset_string_short_alt6: string;
  last_trade_time_utc_offset_string_long_alt6: string;
  last_trade_time_utc_offset_string_short_alt7: string;
  last_trade_time_utc_offset_string_long_alt7: string;
  last_trade_time_utc_offset_string_short_alt8: string;
  last_trade_time_utc_offset_string_long_alt8: string;
  last_trade_time_utc_offset_string_short_alt9: string;
  last_trade_time_utc_offset_string_long_alt9: string;
  last_trade_time_utc_offset_string_short_alt10: string;
  last_trade_time_utc_offset_string_long_alt10: string;
  last_trade_time_utc_offset_string_short_alt11: string;
  last_trade_time_utc_offset_string_long_alt11: string;
  last_trade_time_utc_offset_string_short_alt12: string;
  last_trade_time_utc_offset_string_long_alt12: string;
  last_trade_time_utc_offset_string_short_alt13: string;
  last_trade_time_utc_offset_string_long_alt13: string;
  last_trade_time_utc_offset_string_short_alt14: string;
  last_trade_time_utc_offset_string_long_alt14: string;
  last_trade_time_utc_offset_string_short_alt15: string;
  last_trade_time_utc_offset_string_long_alt15: string;
  last_trade_time_utc_offset_string_short_alt16: string;
  last_trade_time_utc_offset_string_long_alt16: string;
  last_trade_time_utc_offset_string_short_alt17: string;
  last_trade_time_utc_offset_string_long_alt17: string;
  last_trade_time_utc_offset_string_short_alt18: string;
  last_trade_time_utc_offset_string_long_alt18: string;
  last_trade_time_utc_offset_string_short_alt19: string;
  last_trade_time_utc_offset_string_long_alt19: string;
  last_trade_time_utc_offset_string_short_alt20: string;
  last_trade_time_utc_offset_string_long_alt20: string;
  last_trade_time_utc_offset_string_short_alt21: string;
  last_trade_time_utc_offset_string_long_alt21: string;
  last_trade_time_utc_offset_string_short_alt22: string;
  last_trade_time_utc_offset_string_long_alt22: string;
  last_trade_time_utc_offset_string_short_alt23: string;
  last_trade_time_utc_offset_string_long_alt23: string;
  last_trade_time_utc_offset_string_short_alt24: string;
  last_trade_time_utc_offset_string_long_alt24: string;
  last_trade_time_utc_offset_string_short_alt25: string;
  last_trade_time_utc_offset_string_long_alt25: string;
  last_trade_time_utc_offset_string_short_alt26: string;
  last_trade_time_utc_offset_string_long_alt26: string;
  last_trade_time_utc_offset_string_short_alt27: string;
  last_trade_time_utc_offset_string_long_alt27: string;
  last_trade_time_utc_offset_string_short_alt28: string;
  last_trade_time_utc_offset_string_long_alt28: string;
  last_trade_time_utc_offset_string_short_alt29: string;
  last_trade_time_utc_offset_string_long_alt29: string;
  last_trade_time_utc_offset_string_short_alt30: string;
  last_trade_time_utc_offset_string_long_alt30: string;
  last_trade_time_utc_offset_string_short_alt31: string;
  last_trade_time_utc_offset_string_long_alt31: string;
  last_trade_time_utc_offset_string_short_alt32: string;
  last_trade_time_utc_offset_string_long_alt32: string;
  last_trade_time_utc_offset_string_short_alt33: string;
  last_trade_time_utc_offset_string_long_alt33: string;
  last_trade_time_utc_offset_string_short_alt34: string;
  last_trade_time_utc_offset_string_long_alt34: string;
  last_trade_time_utc_offset_string_short_alt35: string;
  last_trade_time_utc_offset_string_long_alt35: string;
  last_trade_time_utc_offset_string_short_alt36: string;
  last_trade_time_utc_offset_string_long_alt36: string;
  last_trade_time_utc_offset_string_short_alt37: string;
  last_trade_time_utc_offset_string_long_alt37: string;
  last_trade_time_utc_offset_string_short_alt38: string;
  last_trade_time_utc_offset_string_long_alt38: string;
  last_trade_time_utc_offset_string_short_alt39: string;
  last_trade_time_utc_offset_string_long_alt39: string;
  last_trade_time_utc_offset_string_short_alt40: string;
  last_trade_time_utc_offset_string_long_alt40: string;
  last_trade_time_utc_offset_string_short_alt41: string;
  last_trade_time_utc_offset_string_long_alt41: string;
  last_trade_time_utc_offset_string_short_alt42: string;
  last_trade_time_utc_offset_string_long_alt42: string;
  last_trade_time_utc_offset_string_short_alt43: string;
  last_trade_time_utc_offset_string_long_alt43: string;
  last_trade_time_utc_offset_string_short_alt44: string;
  last_trade_time_utc_offset_string_long_alt44: string;
  last_trade_time_utc_offset_string_short_alt45: string;
  last_trade_time_utc_offset_string_long_alt45: string;
  last_trade_time_utc_offset_string_short_alt46: string;
  last_trade_time_utc_offset_string_long_alt46: string;
  last_trade_time_utc_offset_string_short_alt47: string;
  last_trade_time_utc_offset_string_long_alt47: string;
  last_trade_time_utc_offset_string_short_alt48: string;
  last_trade_time_utc_offset_string_long_alt48: string;
  last_trade_time_utc_offset_string_short_alt49: string;
  last_trade_time_utc_offset_string_long_alt49: string;
  last_trade_time_utc_offset_string_short_alt50: string;
  last_trade_time_utc_offset_string_long_alt50: string;
  last_trade_time_utc_offset_string_short_alt51: string;
  last_trade_time_utc_offset_string_long_alt51: string;
  last_trade_time_utc_offset_string_short_alt52: string;
  last_trade_time_utc_offset_string_long_alt52: string;
  last_trade_time_utc_offset_string_short_alt53: string;
  last_trade_time_utc_offset_string_long_alt53: string;
  last_trade_time_utc_offset_string_short_alt54: string;
  last_trade_time_utc_offset_string_long_alt54: string;
  last_trade_time_utc_offset_string_short_alt55: string;
  last_trade_time_utc_offset_string_long_alt55: string;
  last_trade_time_utc_offset_string_short_alt56: string;
  last_trade_time_utc_offset_string_long_alt56: string;
  last_trade_time_utc_offset_string_short_alt57: string;
  last_trade_time_utc_offset_string_long_alt57: string;
  last_trade_time_utc_offset_string_short_alt58: string;
  last_trade_time_utc_offset_string_long_alt58: string;
  last_trade_time_utc_offset_string_short_alt59: string;
  last_trade_time_utc_offset_string_long_alt59: string;
  last_trade_time_utc_offset_string_short_alt60: string;
  last_trade_time_utc_offset_string_long_alt60: string;
  last_trade_time_utc_offset_string_short_alt61: string;
  last_trade_time_utc_offset_string_long_alt61: string;
  last_trade_time_utc_offset_string_short_alt62: string;
  last_trade_time_utc_offset_string_long_alt62: string;
  last_trade_time_utc_offset_string_short_alt63: string;
  last_trade_time_utc_offset_string_long_alt63: string;
  last_trade_time_utc_offset_string_short_alt64: string;
  last_trade_time_utc_offset_string_long_alt64: string;
  last_trade_time_utc_offset_string_short_alt65: string;
  last_trade_time_utc_offset_string_long_alt65: string;
  last_trade_time_utc_offset_string_short_alt66: string;
  last_trade_time_utc_offset_string_long_alt66: string;
  last_trade_time_utc_offset_string_short_alt67: string;
  last_trade_time_utc_offset_string_long_alt67: string;
  last_trade_time_utc_offset_string_short_alt68: string;
  last_trade_time_utc_offset_string_long_alt68: string;
  last_trade_time_utc_offset_string_short_alt69: string;
  last_trade_time_utc_offset_string_long_alt69: string;
  last_trade_time_utc_offset_string_short_alt70: string;
  last_trade_time_utc_offset_string_long_alt70: string;
  last_trade_time_utc_offset_string_short_alt71: string;
  last_trade_time_utc_offset_string_long_alt71: string;
  last_trade_time_utc_offset_string_short_alt72: string;
  last_trade_time_utc_offset_string_long_alt72: string;
  last_trade_time_utc_offset_string_short_alt73: string;
  last_trade_time_utc_offset_string_long_alt73: string;
  last_trade_time_utc_offset_string_short_alt74: string;
  last_trade_time_utc_offset_string_long_alt74: string;
  last_trade_time_utc_offset_string_short_alt75: string;
  last_trade_time_utc_offset_string_long_alt75: string;
  last_trade_time_utc_offset_string_short_alt76: string;
  last_trade_time_utc_offset_string_long_alt76: string;
  last_trade_time_utc_offset_string_short_alt77: string;
  last_trade_time_utc_offset_string_long_alt77: string;
  last_trade_time_utc_offset_string_short_alt78: string;
  last_trade_time_utc_offset_string_long_alt78: string;
  last_trade_time_utc_offset_string_short_alt79: string;
  last_trade_time_utc_offset_string_long_alt79: string;
  last_trade_time_utc_offset_string_short_alt80: string;
  last_trade_time_utc_offset_string_long_alt80: string;
  last_trade_time_utc_offset_string_short_alt81: string;
  last_trade_time_utc_offset_string_long_alt81: string;
  last_trade_time_utc_offset_string_short_alt82: string;
  last_trade_time_utc_offset_string_long_alt82: string;
  last_trade_time_utc_offset_string_short_alt83: string;
  last_trade_time_utc_offset_string_long_alt83: string;
  last_trade_time_utc_offset_string_short_alt84: string;
  last_trade_time_utc_offset_string_long_alt84: string;
  last_trade_time_utc_offset_string_short_alt85: string;
  last_trade_time_utc_offset_string_long_alt85: string;
  last_trade_time_utc_offset_string_short_alt86: string;
  last_trade_time_utc_offset_string_long_alt86: string;
  last_trade_time_utc_offset_string_short_alt87: string;
  last_trade_time_utc_offset_string_long_alt87: string;
  last_trade_time_utc_offset_string_short_alt88: string;
  last_trade_time_utc_offset_string_long_alt88: string;
  last_trade_time_utc_offset_string_short_alt89: string;
  last_trade_time_utc_offset_string_long_alt89: string;
  last_trade_time_utc_offset_string_short_alt90: string;
  last_trade_time_utc_offset_string_long_alt90: string;
  last_trade_time_utc_offset_string_short_alt91: string;
  last_trade_time_utc_offset_string_long_alt91: string;
  last_trade_time_utc_offset_string_short_alt92: string;
  last_trade_time_utc_offset_string_long_alt92: string;
  last_trade_time_utc_offset_string_short_alt93: string;
  last_trade_time_utc_offset_string_long_alt93: string;
  last_trade_time_utc_offset_string_short_alt94: string;
  last_trade_time_utc_offset_string_long_alt94: string;
  last_trade_time_utc_offset_string_short_alt95: string;
  last_trade_time_utc_offset_string_long_alt95: string;
  last_trade_time_utc_offset_string_short_alt96: string;
  last_trade_time_utc_offset_string_long_alt96: string;
  last_trade_time_utc_offset_string_short_alt97: string;
  last_trade_time_utc_offset_string_long_alt97: string;
  last_trade_time_utc_offset_string_short_alt98: string;
  last_trade_time_utc_offset_string_long_alt98: string;
  last_trade_time_utc_offset_string_short_alt99: string;
  last_trade_time_utc_offset_string_long_alt99: string;
  last_trade_time_utc_offset_string_short_alt100: string;
  last_trade_time_utc_offset_string_long_alt100: string;
}
