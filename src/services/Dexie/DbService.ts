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

  async insertUnique(transactions: ITransactionProps[]): Promise<unknown> {
    // Extract remarks from the incoming transactions
    const incomingRemarks = transactions
      .map((transaction) => transaction.remarks)
      .filter(Boolean);

    console.log("already present", incomingRemarks);

    // Fetch existing remarks that match the incoming ones
    const existingRemarks = await this.db
      .table("transactions")
      .where("remarks")
      .anyOfIgnoreCase(incomingRemarks)
      .toArray()
      .then((txs) => txs.map((tx) => tx.remarks));

    // Create a Set of existing remarks for quick lookup
    const existingRemarksSet = new Set(existingRemarks);

    // Filter out transactions with remarks that already exist in the DB
    const newTransactions = transactions.filter(
      (transaction) => !existingRemarksSet.has(transaction.remarks)
    );

    console.log("new", newTransactions);
    // Insert the filtered transactions into the database
    return this.db.table("transactions").bulkPut(newTransactions);
  }

  // Method to fetch transactions by date range
  async fetchTransactions(
    startDate: string,
    endDate: string
  ): Promise<ITransactionProps[]> {
    const transARray = await this.db
      .table("transactions")
      .where("date")
      .between(startDate, endDate)
      .toArray();

    transARray.sort((t1, t2) => (t1.date < t2.date ? 1 : -1));
    return transARray;
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

  async readTransactions(
    filters: ITransactionFilter
  ): Promise<ITransactionProps[]> {
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
    let transactions = await query.toArray();
    transactions = filters.remarks
      ? transactions.filter((transaction) =>
          transaction.remarks
            ?.toLowerCase()
            .includes(filters.remarks.toLowerCase())
        )
      : transactions;

    transactions.sort((t1, t2) => (t1.date < t2.date ? 1 : -1));
    console.log("serted", transactions);
    return transactions;
  }
  purgeDatabase(): Promise<void> {
    return this.db.table("transactions").clear();
  }
}

export default TransactionRepository;
