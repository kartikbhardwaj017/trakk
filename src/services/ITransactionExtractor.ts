import { ITransactionProps } from "./ITransactionProps";

export interface ITransactionExtractor {
  extractFromXlsvFile(file: File): Promise<ITransactionProps[]>;
}
