export class Transaction {
  constructor(
    private date: Date,
    private type: string,
    private id: string,
    private amount: number
  ) {}
}
