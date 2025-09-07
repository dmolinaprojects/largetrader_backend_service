export interface IbkrOrdersLegs {
  Id: number;
  IdOrder: number;
  IdInstrument: number;
  Underline: string;
  Type: string;
  OptRight: string;
  Strike: number;
  Expiry: Date;
  Direction: string;
  Positions: number;
  Currency: string;
  Exchange: string;
  MarketPrice: number;
  OpenDate: Date;
  OpenPrice: number;
  CloseDate: Date;
  ClosePrice: number;
}
