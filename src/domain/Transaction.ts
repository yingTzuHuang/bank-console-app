import { Account } from "./Account";

export class Transaction {
  private _id: string;
  constructor(
    private _account: Account,
    private _date: Date,
    private _type: "D" | "W" | "I",
    private _amount: number,
    private _balance: number
  ) {
    // Initialize with empty string, set when it's added to storage (to prevent generating id for invalid inputs)
    this._id = "";
  }

  set id(newId: string) {
    this._id = newId;
  }

  get id() {
    return this._id;
  }

  get amount() {
    return this._amount;
  }

  get type() {
    return this._type;
  }

  get date() {
    return this._date;
  }

  get account() {
    return this._account;
  }

  get balance() {
    return this._balance;
  }
}
