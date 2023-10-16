import Dexie, { IndexableType } from "dexie";
import {
  ETransactionType,
  ITransactionProps,
  ITransactionWithMetaDataType,
} from "../ITransactionProps";
import { DateTime } from "luxon";
import Q from "q";

export interface ITransactionFilter {
  startDate?: string;
  endDate?: string;
  remarks?: string;
  type?: "income" | "expense" | "all";
  category?: string;
  recipient?: string;
  amountMin?: number;
  amountMax?: number;
  accountNumber?: string;
}

class TransactionRepository {
  private db: Dexie;

  constructor() {
    this.db = new Dexie("TransactionDatabase");
    this.db.version(2).stores({
      transactions:
        "++id,date,remarks,amount,balance,mode,recipient,category,type,accountNumber,tags",
      accounts: "++id,accountNumber,name",
      recipients: "++id,recipientId,recipientName,category",
      tags: "++id,tag",
    });
  }

  // update the current transaction with category and tags
  // add the recipient and display name
  // store the tags in a new collection

  async addMetaDataToTransaction(
    transaction: ITransactionProps,
    category: string,
    recipientName: string,
    tags: string[]
  ) {
    const { remarks } = transaction;
    const txToUpdate = await this.db
      .table("transactions")
      .where({ remarks })
      .first();

    if (txToUpdate) {
      await this.db.table("transactions").update(txToUpdate.id, { tags: tags });
    }

    const existingRecipient = await this.db
      .table("recipients")
      .where("recipientId")
      .equals(transaction.recipient)
      .first();

    if (existingRecipient) {
      await this.db.table("recipients").update(existingRecipient.id, {
        recipientName: recipientName,
        category,
      });
    } else {
      await this.db.table("recipients").add({
        recipientId: transaction.recipient,
        recipientName: recipientName,
        category,
      });
    }

    for (let tag of tags) {
      const existingTag = await this.db
        .table("tags")
        .where("tag")
        .equals(tag)
        .first();

      if (!existingTag) {
        await this.db.table("tags").add({ tag: tag });
      }
    }
  }

  // Method to insert multiple transactions
  bulkInsert(transactions: ITransactionProps[]): Promise<unknown> {
    return this.db.table("transactions").bulkPut(transactions);
  }

  private async insertAccountNumbers(transactions: ITransactionProps[]) {
    const accountNumbersSet = new Set();
    const accountNumbersArray = transactions
      .map((transaction) => transaction.accountNumber)
      .filter((accountNumber) => {
        if (accountNumbersSet.has(accountNumber)) {
          return false;
        }
        accountNumbersSet.add(accountNumber);
        return true;
      });
    const existingAccountNumber = await this.db
      .table("accounts")
      .where("accountNumber")
      .anyOfIgnoreCase(accountNumbersArray)
      .toArray()
      .then((txs) => txs.map((tx) => tx.accountNumber));

    const existingAccountNumbersSet = new Set(existingAccountNumber);

    const newAccountNumbers = accountNumbersArray.filter(
      (accountNumber) => !existingAccountNumbersSet.has(accountNumber)
    );
    const accounts = newAccountNumbers.map((accountNumber) => {
      return {
        accountNumber: accountNumber,
        name: "",
      };
    });

    return this.db.table("accounts").bulkPut(accounts);
  }
  async insertUnique(transactions: ITransactionProps[]): Promise<unknown> {
    // Extract remarks from the incoming transactions
    const incomingRemarks = transactions
      .map((transaction) => transaction.remarks)
      .filter(Boolean);

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

    await this.insertAccountNumbers(transactions);
    // Insert the filtered transactions into the database
    return this.db.table("transactions").bulkPut(newTransactions);
  }

  async updateAccountHolderName(name: string, accountNumber: string) {
    const updateName = await this.db
      .table("accounts")
      .where("accountNumber")
      .equalsIgnoreCase(accountNumber)
      .modify({ name: name });
  }
  // Method to fetch transactions by date range
  async fetchAccounts(): Promise<{ accountNumber: string; name: string }[]> {
    const accountsArray = await this.db.table("accounts").toArray();
    return accountsArray;
  }
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
  ): Promise<ITransactionWithMetaDataType[]> {
    let query: Dexie.Collection<any, IndexableType> = this.db
      .table("transactions")
      .toCollection();

    if (filters.type && filters.type !== "all") {
      query = query.and((transaction) =>
        filters.type === "income"
          ? transaction.type === ETransactionType.CREDIT
          : transaction.type === ETransactionType.DEBIT
      );
    }
    if (filters.accountNumber) {
      query = query.and(
        (transaction) => transaction.accountNumber === filters.accountNumber
      );
    }
    if (filters.startDate && filters.endDate) {
      query = query.and((transaction) => {
        return (
          transaction.date >=
            DateTime.fromFormat(filters.startDate, "dd/MM/yyyy")
              .startOf("day")
              .toJSDate() &&
          transaction.date <=
            DateTime.fromFormat(filters.endDate, "dd/MM/yyyy")
              .startOf("day")
              .toJSDate()
        );
      });
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
    // transactions = filters.remarks
    //   ? transactions.filter((transaction) =>
    //       transaction.remarks
    //         ?.toLowerCase()
    //         .includes(filters.remarks.toLowerCase())
    //     )
    //   : transactions;

    transactions = filters.remarks
      ? transactions.filter((transaction) => {
          const result1 = transaction.remarks
            ?.toLowerCase()
            .includes(filters.remarks.toLowerCase());
          if (result1) {
            return true;
          } else {
            if (transaction.tags) {
              return transaction.tags
                .join(" ")
                .toLowerCase()
                .includes(filters.remarks.toLowerCase());
            }
          }

          return false;
        })
      : transactions;

    console.log("***", transactions);
    transactions.sort((t1, t2) => (t1.date < t2.date ? 1 : -1));
    let query2: Dexie.Collection<any, IndexableType> = this.db
      .table("recipients")
      .toCollection();
    let recipients = await query2.toArray();
    transactions = transactions.map((transaction) => {
      const recipientFilterArray = recipients.filter((recipient) => {
        return recipient.recipientId === transaction.recipient;
      });

      if (recipientFilterArray.length === 0) {
        return {
          ...transaction,
        };
      } else
        return {
          ...transaction,
          category: recipientFilterArray[0].category,
          recipientName: recipientFilterArray[0].recipientName,
        };
    });
    return transactions;
  }
  async purgeDatabase(): Promise<void> {
    await this.db.table("transactions").clear();
    await this.db.table("accounts").clear();
  }
}

export default TransactionRepository;
