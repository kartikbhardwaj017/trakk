import * as XLSX from "xlsx";
import { ITransactionExtractor } from "./ITransactionExtractor";
import { ETransactionType, ITransactionProps } from "./ITransactionProps";

export class SBITransactionExtractService implements ITransactionExtractor {
  // Given the code structure, I'm making an assumption that the transaction details can be determined
  // based on column headers. You might need to modify this to suit your actual Excel structure.
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
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

          const headers = data[0];
          const rows = data.slice(1);

          rows.forEach((row) => {
            let obj: any = {};
            (headers as string[]).forEach((header, i) => {
              obj[header] = row[i];
            });

            const transaction: ITransactionProps = {
              date: obj["Transaction Date"],
              amount:
                obj["Withdrawal Amount (INR )"] || obj["Deposit Amount (INR )"],
              balance: obj["Balance (INR )"],
              mode: obj["Transaction Mode"], // This is an assumption, modify as required
              recipient: obj["Recipient"], // This is an assumption, modify as required
              category: obj["Category"], // This is an assumption, modify as required
              remarks: obj["Transaction Remarks"],
              type: obj["Withdrawal Amount (INR )"]
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
}
