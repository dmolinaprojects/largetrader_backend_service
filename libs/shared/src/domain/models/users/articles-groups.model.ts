export interface ArticlesGroups {
  Id: number;
  Name: string | null;
  NameEn: string;
  NameEs: string;
  Url: string;
  FreeUrl: string;
  UrlEn: string;
  FreeUrlEn: string;
  UrlEs: string;
  FreeUrlEs: string;
  Title: string;
  Description: string;
  Keywords: string;
  TitleEn: string;
  DescriptionEn: string;
  KeywordsEn: string;
  TitleEs: string;
  DescriptionEs: string;
  KeywordsEs: string;
  Logged: boolean | null;
  Unlogged: boolean;
  Admin: boolean;
  Product: boolean;
  Maps: boolean;
  PageRows: number;
  PageColumns: number;
  DaysToFree: number;
}
