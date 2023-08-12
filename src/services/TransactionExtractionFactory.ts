import { ITransactionExtractor } from "./ITransactionExtractor";
import { SBITransactionExtractService } from "./SBITransactionExtractService";

export class TransactionExtractionFactory {
  public static getExtractor(bankName: string): ITransactionExtractor {
    switch (bankName) {
      case "SBI":
        return new SBITransactionExtractService();
      default:
        throw new Error(`Extractor not available for bank: ${bankName}`);
    }
  }
}
