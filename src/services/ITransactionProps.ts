export enum EPaymentMode {
  UPI = "UPI",
  NEFT = "NEFT",
}

export enum ETransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export interface ITransactionProps {
  date: string;
  amount: number;
  balance: number;
  mode: EPaymentMode;
  recipient: string;
  category: string;
  remarks: string;
  type: ETransactionType;
}
