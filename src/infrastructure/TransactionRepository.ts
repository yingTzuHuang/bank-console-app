import { Transaction } from "../domain/Transaction";

export class TransactionRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  add(transaction: Transaction) {
    this.transactions.push(transaction);
  }
}
