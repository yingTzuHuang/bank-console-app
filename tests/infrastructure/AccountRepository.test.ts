import { Account } from "../../src/domain/Account";
import { AccountRepository } from "../../src/infrastructure/AccountRepository";

describe("AccountRepository", () => {
  let accountRepo: AccountRepository;
  beforeEach(() => {
    accountRepo = new AccountRepository();
  });

  it("generates id when new transaction is added", () => {
    expect(accountRepo.accounts.length).toBe(0);

    const newAccount = new Account("Acc01", 0);
    accountRepo.add(newAccount);

    expect(accountRepo.accounts[0]).toBe(newAccount);
  });
});
