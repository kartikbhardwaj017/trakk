import { HDFCTransactionExtractService } from "./HDFCTransactionExtractService";
import { ICICITransactionExtractService } from "./ICICITransactionExtractService";
import { ITransactionExtractor } from "./ITransactionExtractor";
import { SBITransactionExtractService } from "./SBITransactionExtractService";

export class TransactionExtractionFactory {
  public static getExtractor(bankName: string): ITransactionExtractor {
    switch (bankName) {
      case "SBI":
        return new SBITransactionExtractService();
      case "ICICI":
        return new ICICITransactionExtractService();
      case "HDFC":
        return new HDFCTransactionExtractService();
      default:
        throw new Error(`Extractor not available for bank: ${bankName}`);
    }
  }
}
