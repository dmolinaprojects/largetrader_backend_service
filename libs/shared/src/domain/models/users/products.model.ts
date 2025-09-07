export interface Products {
  Id: number;
  Name: string;
  Description: string;
  Price: number | null;
  Currency: string | null;
  NameEn: string | null;
  DescriptionEn: string | null;
  PriceEn: number | null;
  CurrencyEn: string | null;
  NameEs: string | null;
  DescriptionEs: string | null;
  PriceEs: number | null;
  CurrencyEs: string | null;
  ExpiryDays: number;
  SubscriptionUnit: string;
  DateInsert: Date | null;
  Subscription: boolean;
  TrialPrice: number;
  TrialExpiryDays: number;
  TrialUnit: string;
  TrialVersion: boolean;
  Token: string;
}
