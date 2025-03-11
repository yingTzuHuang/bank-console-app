export class Account {
  constructor(private id: string, private balance: number) {}
  getBalance() {
    return this.balance;
  }

  deposit(amount: number) {
    this.balance += amount;
  }
  withdraw(amount: number) {
    this.balance -= amount;
  }
}
