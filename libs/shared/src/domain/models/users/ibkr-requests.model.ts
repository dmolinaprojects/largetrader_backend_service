export interface IbkrRequests {
  Id: bigint;
  IdUser: number;
  Command: string;
  Body: string | null;
  Sent: Date | null;
  SentToBridge: boolean;
  Executed: boolean;
}
