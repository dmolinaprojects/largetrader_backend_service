export interface MarketDataResponse {
  t: number[]; // timestamps
  o: number[]; // open prices
  h: number[]; // high prices
  l: number[]; // low prices
  c: number[]; // close prices
  v: number[]; // volumes
  s: string; // status
}

export interface MarketDataQuery {
  symbol: string;
  from: Date;
  to: Date;
  resolution?: string;
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface MarketConfigResponse {
  supports_search: boolean;
  supports_group_request: boolean;
  supports_marks: boolean;
  supports_timescale_marks: boolean;
  supports_time: boolean;
  exchanges: Array<{
    value: string;
    name: string;
    desc: string;
  }>;
  symbols_types: Array<{
    name: string;
    value: string;
  }>;
  supported_resolutions: string[];
}

export interface SymbolInfoResponse {
  name: string;
  'exchange-traded'?: string;
  'exchange-listed'?: string;
  timezone: string;
  minmov: number;
  minmov2: number;
  pointvalue: number;
  data_status: string;
  has_daily: boolean;
  has_intraday: boolean;
  has_no_volume: boolean;
  description: string;
  type: string;
  pricescale: number;
  session: string;
  ticker: string;
}
