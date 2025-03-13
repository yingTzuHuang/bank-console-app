import { Transaction } from "../domain/Transaction";
import { convertDateToYYYYMMdd } from "../utils/dateUtils";

export class TransactionRepository {
  private transactions: Transaction[];
  private transactionDateNumberMap: Map<Date, number>;

  constructor() {
    this.transactions = [];
    this.transactionDateNumberMap = new Map<Date, number>();
  }

  add(transaction: Transaction) {
    transaction.id = this.generateTransactionId(transaction.date);
    this.transactions.push(transaction);
  }

  private generateTransactionId(date: Date) {
    date.setHours(0, 0, 0);
    const lastNumber = this.transactionDateNumberMap.get(date) ?? 0;

    const newRunningNumber = lastNumber + 1;

    // Update map to track running number
    this.transactionDateNumberMap.set(date, newRunningNumber);

    return `${convertDateToYYYYMMdd(date)}-${newRunningNumber
      .toString()
      .padStart(2, "0")}`;
  }
}
