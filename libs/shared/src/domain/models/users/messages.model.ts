export interface Messages {
  Id: number;
  IdMessage: number;
  IdGroup: number;
  IdUser: number;
  DateInsert: Date;
  DateModify: Date;
  Message: string;
  File: string;
  Open: boolean;
  Closed: boolean | null;
}
