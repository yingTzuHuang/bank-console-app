import { Account } from "../domain/Account";

export class AccountRepository {
  private accounts: Account[];
  constructor() {
    this.accounts = [];
  }
  add(account: Account) {
    this.accounts.push(account);
  }
  getById(id: string) {
    return this.accounts;
  }
}
