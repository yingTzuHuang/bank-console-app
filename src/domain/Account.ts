import { InsufficientBalanceError } from "../errors/InsufficientBalanceError";
import { InterestRule } from "./InterestRule";
import { Transaction } from "./Transaction";

export class Account {
  private _transactions: Transaction[];
  constructor(private _id: string, private _balance: number) {
    this._transactions = [];
  }

  withdraw(date: Date, amount: number) {
    if (!this.canWithdraw(amount)) {
      throw new InsufficientBalanceError("Insufficient Balance!");
    }
    this._balance -= amount;
    this._transactions.push(new Transaction(date, "W", amount));
  }

  deposit(date: Date, amount: number) {
    this._balance += amount;
    this._transactions.push(new Transaction(date, "D", amount));
  }

  canWithdraw(amount: number) {
    return this._balance >= amount;
  }

  get id() {
    return this._id;
  }

  get transactions() {
    return this._transactions;
  }
}
