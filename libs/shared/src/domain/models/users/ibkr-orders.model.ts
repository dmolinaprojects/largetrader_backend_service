export interface IbkrOrders {
  Id: number;
  IdUser: number;
  IdOrder: number;
  IdRequest: number;
  Direction: string;
  OperationType: string;
  Price: number;
  Quantity: number;
  TillDate: string;
  MarketPrice: number;
  Status: string;
  OpenDate: Date;
  OpenPrice: number;
  CloseDate: Date;
  ClosePrice: number;
  Replied: boolean;
  ClosedOrDuplicated: boolean;
}
