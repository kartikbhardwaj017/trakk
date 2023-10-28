import * as XLSX from "xlsx";
import { DateTime } from "luxon";

import { ITransactionExtractor } from "./ITransactionExtractor";
import {
  EPaymentMode,
  ETransactionType,
  ITransactionProps,
} from "./ITransactionProps";

type IHDFCTransaction = {
  Date: string;
  Narration: number;
  "Chq./Ref.No.": string;
  "Value Dt": string;
  "Withdrawal Amt.": number;
  "Deposit Amt.": string;
  "Closing Balance": string;
};

export class HDFCTransactionExtractService implements ITransactionExtractor {
  // Given the code structure, I'm making an assumption that the transaction details can be determined
  // based on column headers. You might need to modify this to suit your actual Excel structure.

  extractRecipient(remarks: string, mode: EPaymentMode): string {
    if (!remarks) {
      return "UNKNOWN";
    }
    let recipient = "";

    if (mode === EPaymentMode.UPI) {
      const parts = remarks.split("-");
      if (parts.length >= 6) {
        recipient = parts[1];
      }
    } else if (mode === EPaymentMode.NEFT) {
      const parts = remarks.split("-");
      if (parts.length >= 3) {
        recipient = parts[2];
      }
    } else if (mode === EPaymentMode.RTGS) {
      const parts = remarks.split("/");
      if (parts.length >= 2) {
        recipient = parts[parts.length - 1];
      }
    } else {
      recipient = "UNKNOWN";
    }

    return recipient;
  }

  identifyPaymentMode(remarks: string): EPaymentMode {
    if (!remarks) {
      return EPaymentMode.OTHER;
    }

    if (remarks.toLowerCase().includes("pos")) return EPaymentMode.SWIPE;
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
  extractNumber(str: string) {
    const match = str.match(/(\d+)/);
    return match ? match[0] : null;
  }

  cleanAndTransformTransaction(transaction: any): object {
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
          let accountNumber = "NA";

          for (let i = 0; i < 25; i++) {
            // Check the first 15 rows
            let row = data[i];
            if ((row as string[]).join(" ").includes("Account No")) {
              accountNumber = this.extractNumber(
                row[4].split(":")[1].split(" ")[0]
              );
            }
            if (
              (row as string[]).includes("Date") &&
              (row as string[]).includes("Narration") &&
              (row as string[]).includes("Chq./Ref.No.")
            ) {
              headersIndex = i + 1;
              break;
            }
          }

          console.log("accountnumber", accountNumber);
          // Get headers
          if (accountNumber === "NA") {
            alert("Account number not detected");
            return;
          }
          // hdfc has a **** seperator between data and headers
          const headers = data[headersIndex - 1];
          data = data.slice(headersIndex + 1);
          //   const rows = data.slice(1);

          console.log(data);
          data.forEach((row) => {
            let obj: any = {};
            (headers as string[]).forEach((header, i) => {
              obj[header] = row[i];
            });

            if (!obj["Date"]) {
              return;
            }
            const paymentMode = this.identifyPaymentMode(obj["Narration"]);
            const recipientInfo = this.extractRecipient(
              obj["Narration"],
              paymentMode
            );

            try {
              if (
                !DateTime.fromFormat(obj["Date"], "dd/MM/yy").startOf("day")
                  .isValid
              ) {
                return;
              }
            } catch (error) {
              return;
            }

            if (!obj["Date"]) {
              return;
            }
            const transaction: ITransactionProps = {
              date: DateTime.fromFormat(obj["Date"], "dd/MM/yy")
                .startOf("day")
                .toJSDate(),
              //   date: this.excelSerialDateToJSDate(obj["Date"]),
              amount:
                parseFloat(obj["Withdrawal Amt."]) > 0
                  ? parseFloat(obj["Withdrawal Amt."] || "0")
                  : parseFloat(obj["Deposit Amt."] || "0"),
              balance: parseFloat(obj["Closing Balance"]),
              mode: paymentMode, // This is an assumption, modify as required
              recipient: recipientInfo, // This is an assumption, modify as required
              category: "other", // This is an assumption, modify as required
              remarks: obj["Narration"],
              type:
                parseFloat(obj["Withdrawal Amt."] || "0") > 0
                  ? ETransactionType.DEBIT
                  : ETransactionType.CREDIT,
              accountNumber,
            };

            transactions.push(transaction);
          });

          console.log(transactions);
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
