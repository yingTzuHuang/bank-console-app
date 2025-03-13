import { InsufficientBalanceError } from "../errors/InsufficientBalanceError";
import { InterestRule } from "./InterestRule";
import { Transaction } from "./Transaction";

export class Account {
  private _transactions: Transaction[];
  constructor(private _id: string, private _balance: number) {
    this._transactions = [];
  }

  withdraw(date: Date, amount: number): Transaction {
    if (!this.canWithdraw(amount)) {
      throw new InsufficientBalanceError("Insufficient Balance!");
    }
    this._balance -= amount;
    const newTransaction = new Transaction(this, date, "W", amount);
    this._transactions.push(newTransaction);
    return newTransaction;
  }

  deposit(date: Date, amount: number): Transaction {
    this._balance += amount;
    const newTransaction = new Transaction(this, date, "D", amount);
    this._transactions.push(newTransaction);
    return newTransaction;
  }

  private canWithdraw(amount: number) {
    return this._balance >= amount;
  }

  get id() {
    return this._id;
  }

  get transactions() {
    return this._transactions;
  }

  get balance() {
    return this._balance;
  }
}
