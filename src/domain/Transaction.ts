export class Transaction {
  private _id: string;
  constructor(
    private _date: Date,
    private _type: "D" | "W" | "I",
    private _amount: number
  ) {
    // Initialize with empty string, set when it's added to storage (to prevent generating id for invalid inputs)
    this._id = "";
  }

  set id(id: string) {
    this._id = id;
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
}
