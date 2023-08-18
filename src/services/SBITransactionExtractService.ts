import * as XLSX from "xlsx";
import { DateTime } from "luxon";

import { ITransactionExtractor } from "./ITransactionExtractor";
import {
  EPaymentMode,
  ETransactionType,
  ITransactionProps,
} from "./ITransactionProps";

type ISBITransaction = {
  "Transaction Date": string;
  "Deposit Amount (INR )"?: number;
  "Withdrawal Amount (INR )"?: number;
  "Transaction Remarks"?: string;
  "Balance (INR )": string;
};

export class SBITransactionExtractService implements ITransactionExtractor {
  // Given the code structure, I'm making an assumption that the transaction details can be determined
  // based on column headers. You might need to modify this to suit your actual Excel structure.

  extractRecipient(remarks: string, mode: EPaymentMode): string {
    if (!remarks) {
      return "UNKNOWN";
    }
    let recipient = "UNKNOWN";

    if (mode === EPaymentMode.UPI) {
      const parts = remarks.split("/");
      if (parts.length >= 4) {
        recipient = parts[3];
      }
    } else if (mode === EPaymentMode.NEFT) {
      const parts = remarks.split("*");
      recipient = parts[3];
    } else if (mode === EPaymentMode.RTGS) {
      const parts = remarks.split("/");
      recipient = parts[parts.length - 1];
    } else {
      recipient = "UNKNOWN";
    }

    return recipient;
  }

  identifyPaymentMode(remarks: string): EPaymentMode {
    if (!remarks) {
      return EPaymentMode.OTHER;
    }

    if (remarks.includes("UPI")) return EPaymentMode.UPI;
    if (remarks.includes("RTGS")) return EPaymentMode.RTGS;
    if (remarks.includes("NEFT")) return EPaymentMode.NEFT;
    if (remarks.includes("ATM") && remarks.includes("CASH WDL"))
      return EPaymentMode.ATM_WITHDRAWAL;
    if (remarks.includes("Int.Pd")) return EPaymentMode.INTEREST_PAYMENT;
    return EPaymentMode.OTHER;
  }

  identifyTransactionType(deposit: number, withdrawal: number): string {
    return deposit > 0 ? "CREDIT" : "DEBIT";
  }

  cleanAndTransformTransaction(transaction: ISBITransaction): object {
    const depositAmount = transaction["Deposit Amount (INR )"] || 0;
    const withdrawalAmount = transaction["Withdrawal Amount (INR )"] || 0;
    const remarks = transaction["Transaction Remarks"] || "";

    const paymentMode = this.identifyPaymentMode(remarks);
    const transactionType = this.identifyTransactionType(
      depositAmount,
      withdrawalAmount
    );
    const recipientInfo = this.extractRecipient(remarks, paymentMode);

    return {
      date: DateTime.fromFormat(transaction["Transaction Date"], "dd/MM/yyyy"),
      amount: transactionType === "CREDIT" ? depositAmount : withdrawalAmount,
      balance: transaction["Balance (INR )"],
      mode: paymentMode,
      type: transactionType,
      recipient: recipientInfo,
      remarks: remarks,
    };
  }

  async extractFromXlsvFile(file: File): Promise<ITransactionProps[]> {
    return new Promise<ITransactionProps[]>((resolve, reject) => {
      let transactions: ITransactionProps[] = [];

      const reader = new FileReader();

      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result as string;
          const workbook = XLSX.read(bstr, { type: "binary" });
          const wsname = workbook.SheetNames[0];
          const ws = workbook.Sheets[wsname];
          let data = XLSX.utils.sheet_to_json(ws, { header: 1 });

          let headersIndex = 0;
          for (let i = 0; i < 25; i++) {
            // Check the first 15 rows
            let row = data[i];
            if (
              (row as string[]).includes("Txn Date") &&
              (row as string[]).includes("Value Date") &&
              (row as string[]).includes("Description") &&
              (row as string[]).includes("Ref No./Cheque No.") &&
              (row as string[]).includes("        Debit") &&
              (row as string[]).includes("Credit") &&
              (row as string[]).includes("Balance")
            ) {
              headersIndex = i;
              break;
            }
          }
          // Get headers
          const headers = data[headersIndex];
          data = data.slice(headersIndex + 1);
          //   const rows = data.slice(1);

          data.forEach((row) => {
            let obj: any = {};
            (headers as string[]).forEach((header, i) => {
              obj[header] = row[i];
            });

            if (!obj["Txn Date"]) {
              return;
            }
            const paymentMode = this.identifyPaymentMode(obj["Description"]);
            const recipientInfo = this.extractRecipient(
              obj["Description"],
              paymentMode
            );

            const transaction: ITransactionProps = {
              date: this.excelSerialDateToJSDate(obj["Txn Date"]),
              amount: !Number.isNaN(parseFloat(obj["        Debit"]))
                ? parseFloat(obj["        Debit"])
                : parseFloat(obj["Credit"]),
              balance: parseFloat(obj["Balance"]),
              mode: paymentMode, // This is an assumption, modify as required
              recipient: recipientInfo, // This is an assumption, modify as required
              category: "other", // This is an assumption, modify as required
              remarks: obj["Description"],
              type: !Number.isNaN(parseFloat(obj["        Debit"]))
                ? ETransactionType.DEBIT
                : ETransactionType.CREDIT,
            };

            transactions.push(transaction);
          });

          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  }

  excelSerialDateToJSDate(serial: number) {
    var daysFrom1900 = serial - 1;
    var millisecondsBetween1900And1970 = (25569 - 1) * 86400000;
    var dateMilliseconds = daysFrom1900 * 86400000;
    var timeMilliseconds = (serial - Math.floor(serial)) * 86400000;
    var totalMilliseconds =
      dateMilliseconds - millisecondsBetween1900And1970 + timeMilliseconds;

    var luxonDate = DateTime.fromMillis(totalMilliseconds);
    return luxonDate.startOf("day").toJSDate();
  }
}
