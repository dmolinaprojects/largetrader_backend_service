export interface Orders {
  Id: number;
  IdUser: number;
  IdProduct: number;
  Name: string | null;
  DateInsert: Date;
  DateBuy: Date;
  DateNextPayment: Date | null;
  Price: number;
  Currency: string | null;
  PaymentStatus: string;
  Expiry: number;
  SubscriptionUnit: string;
  Subscription: boolean;
  SubscriptionPaused: boolean;
  CreditCardMD5: string;
  CreditCardNumber: string;
}
