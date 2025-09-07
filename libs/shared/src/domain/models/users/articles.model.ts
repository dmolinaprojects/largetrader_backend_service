export interface Articles {
  Id: number;
  IdRelatedArticle: number | null;
  IdGroup: number;
  IdAuthor: number;
  DateInsert: Date;
  Title: string | null;
  Description: string | null;
  Keywords: string | null;
  Content: string | null;
  FirstH2: string;
  FirstMedia: string;
  Url: string;
  Published: boolean;
  PublicWebsite: boolean;
  Language: string;
}
