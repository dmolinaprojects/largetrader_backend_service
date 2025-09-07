export interface StockSelections {
  Id: number;
  IdWatchList: number;
  Ticker: string;
  LastUpdate: Date | null;
  LastUpdateFundamental: Date | null;
  LastUpdateDividends: Date;
}
