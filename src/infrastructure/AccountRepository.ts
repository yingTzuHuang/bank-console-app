import { Account } from "../domain/Account";

export class AccountRepository {
  private _accounts: Account[];
  constructor() {
    this._accounts = [];
  }
  add(account: Account) {
    this._accounts.push(account);
  }
  getById(id: string) {
    return this._accounts.find((acc) => acc.id === id);
  }

  get accounts() {
    return this._accounts;
  }
}
