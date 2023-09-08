export enum EPaymentMode {
  UPI = "UPI",
  NEFT = "NEFT",
  ATM_WITHDRAWAL = "ATM_WITHDRAWL",
  INTEREST_PAYMENT = "INTEREST_PAYMENT",
  RTGS = "RTGS",
  OTHER = "OTHER",
}

export enum ETransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export interface ITransactionProps {
  date: Date;
  amount: number;
  balance: number;
  mode: EPaymentMode;
  recipient: string;
  category: string;
  remarks: string;
  type: ETransactionType;
  accountNumber?: string;
}

export interface ITransactionFilter {
  startDate?: string;
  endDate?: string;
  remarks?: string;
  type?: "income" | "expense" | "all";
  category?: string;
  recipient?: string;
  amountMin?: number;
  amountMax?: number;
}
