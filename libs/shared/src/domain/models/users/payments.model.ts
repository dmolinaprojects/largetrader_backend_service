export interface Payments {
  Id: number;
  IdOrder: number;
  DateInsert: Date;
  Price: number;
  Currency: string | null;
  PaymentStatus: string;
  StripeCustomerId: string;
  StripePaymentMethodId: string;
  StripePaimentIntentId: string;
  PaymentError: string;
}
