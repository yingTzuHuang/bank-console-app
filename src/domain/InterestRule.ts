export class InterestRule {
  constructor(
    private _id: string,
    private _date: Date,
    private _rate: number
  ) {}

  get date() {
    return this._date;
  }

  get rate() {
    return this._rate;
  }

  set rate(newRate: number) {
    this._rate = newRate;
  }

  get id() {
    return this._id;
  }

  set id(newId: string) {
    this._id = newId;
  }
}
