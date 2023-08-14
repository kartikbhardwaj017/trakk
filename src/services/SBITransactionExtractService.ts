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

  extractRecipient(remarks: string): string {
    if (!remarks) {
      return "UNKNOWN";
    }
    const upiIdMatch = remarks.match(/\bQ\d{9}@/);
    if (upiIdMatch) return `UPI ID: ${upiIdMatch[0].slice(0, -1)}`;
    const merchantNameMatch = remarks.match(/\b[A-Z]{5,}\b/);
    if (merchantNameMatch) return `Merchant: ${merchantNameMatch[0]}`;
    return "UNKNOWN";
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
    const recipientInfo = this.extractRecipient(remarks);

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
          for (let i = 0; i < 15; i++) {
            // Check the first 15 rows
            let row = data[i];
            if (
              (row as string[]).includes("S No.") &&
              (row as string[]).includes("Value Date") &&
              (row as string[]).includes("Transaction Date") &&
              (row as string[]).includes("Cheque Number") &&
              (row as string[]).includes("Transaction Remarks") &&
              (row as string[]).includes("Withdrawal Amount (INR )") &&
              (row as string[]).includes("Deposit Amount (INR )") &&
              (row as string[]).includes("Balance (INR )")
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

            if (!obj["Transaction Date"]) {
              return;
            }
            const transaction: ITransactionProps = {
              date: DateTime.fromFormat(
                obj["Transaction Date"],
                "dd/MM/yyyy"
              ).toJSDate(),
              amount:
                parseFloat(obj["Withdrawal Amount (INR )"]) > 0
                  ? parseFloat(obj["Withdrawal Amount (INR )"])
                  : parseFloat(obj["Deposit Amount (INR )"]),
              balance: parseFloat(obj["Balance (INR )"]),
              mode: this.identifyPaymentMode(obj["Transaction Remarks"]), // This is an assumption, modify as required
              recipient: this.extractRecipient(obj["Transaction Remarks"]), // This is an assumption, modify as required
              category: "other", // This is an assumption, modify as required
              remarks: obj["Transaction Remarks"],
              type:
                parseFloat(obj["Withdrawal Amount (INR )"]) > 0
                  ? ETransactionType.DEBIT
                  : ETransactionType.CREDIT,
            };

            transactions.push(transaction);
            console.log(transaction.remarks);
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
}
