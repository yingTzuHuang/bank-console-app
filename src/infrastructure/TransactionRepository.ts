import { Transaction } from "../domain/Transaction";
import { convertDateToYYYYMMdd } from "../utils/dateUtils";

export class TransactionRepository {
  private _transactions: Transaction[];
  private transactionDateNumberMap: Map<string, number>;

  constructor() {
    this._transactions = [];
    this.transactionDateNumberMap = new Map<string, number>();
  }

  add(transaction: Transaction) {
    transaction.id = this.generateTransactionId(transaction.date);
    this._transactions.push(transaction);
  }

  private getTransactionDateKey(date: Date) {
    date.setHours(0, 0, 0);
    return date.toISOString();
  }

  generateTransactionId(date: Date) {
    const dateKey = this.getTransactionDateKey(date);
    const lastNumber = this.transactionDateNumberMap.get(dateKey) ?? 0;

    const newRunningNumber = lastNumber + 1;

    // Update map to track running number
    this.transactionDateNumberMap.set(dateKey, newRunningNumber);

    return `${convertDateToYYYYMMdd(date)}-${newRunningNumber
      .toString()
      .padStart(2, "0")}`;
  }

  getTransactionsByAccountId(accountId: string) {
    return this._transactions.filter((t) => t.account.id === accountId);
  }

  get transactions() {
    return this._transactions;
  }
}
