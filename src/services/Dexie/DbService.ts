import Dexie, { IndexableType } from "dexie";
import { ETransactionType, ITransactionProps } from "../ITransactionProps";
import { DateTime } from "luxon";

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

class TransactionRepository {
  private db: Dexie;

  constructor() {
    this.db = new Dexie("TransactionDatabase");
    this.db.version(1).stores({
      transactions:
        "++id,date,remarks,amount,balance,mode,recipient,category,type",
    });
  }

  // Method to insert multiple transactions
  bulkInsert(transactions: ITransactionProps[]): Promise<unknown> {
    return this.db.table("transactions").bulkPut(transactions);
  }

  // Method to fetch transactions by date range
  fetchTransactions(
    startDate: string,
    endDate: string
  ): Promise<ITransactionProps[]> {
    return this.db
      .table("transactions")
      .where("date")
      .between(startDate, endDate)
      .toArray();
  }

  // Method to search transactions by remarks
  searchRemarks(searchRemark: string): Promise<ITransactionProps[]> {
    return this.db
      .table("transactions")
      .where("remarks")
      .startsWithIgnoreCase(searchRemark)
      .toArray();
  }

  // Method to toggle transactions between income and expense
  toggleTransactions(
    filterType: "income" | "expense" | "all"
  ): Promise<ITransactionProps[]> {
    return filterType === "income"
      ? this.db.table("transactions").where("amount").above(0).toArray()
      : this.db.table("transactions").where("amount").below(0).toArray();
  }

  // Inside the TransactionRepository class

  readTransactions(filters: ITransactionFilter): Promise<ITransactionProps[]> {
    let query: Dexie.Collection<any, IndexableType> = this.db
      .table("transactions")
      .toCollection();

    if (filters.startDate && filters.endDate) {
      query = query.and(
        (transaction) =>
          transaction.date >=
            DateTime.fromFormat(filters.startDate, "dd/MM/yyyy").toJSDate() &&
          transaction.date <=
            DateTime.fromFormat(filters.endDate, "dd/MM/yyyy").toJSDate()
      );
    }

    if (filters.type && filters.type !== "all") {
      query = query.and((transaction) =>
        filters.type === "income"
          ? transaction.type === ETransactionType.CREDIT
          : transaction.type === ETransactionType.DEBIT
      );
    }

    if (filters.category) {
      query = query.and(
        (transaction) => transaction.category === filters.category
      );
    }

    if (filters.recipient) {
      query = query.and(
        (transaction) => transaction.recipient === filters.recipient
      );
    }

    if (filters.amountMin !== undefined) {
      query = query.and(
        (transaction) => transaction.amount >= filters.amountMin
      );
    }

    if (filters.amountMax !== undefined) {
      query = query.and(
        (transaction) => transaction.amount <= filters.amountMax
      );
    }

    // Convert to a Collection by calling toArray(), then apply custom filter
    return query
      .toArray()
      .then((transactions) =>
        filters.remarks
          ? transactions.filter((transaction) =>
              transaction.remarks
                .toLowerCase()
                .includes(filters.remarks.toLowerCase())
            )
          : transactions
      );
  }
}

export default TransactionRepository;
