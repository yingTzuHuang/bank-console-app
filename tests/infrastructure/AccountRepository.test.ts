import { Account } from "../../src/domain/Account";
import { AccountRepository } from "../../src/infrastructure/AccountRepository";

describe("AccountRepository", () => {
  let accountRepo: AccountRepository;
  beforeEach(() => {
    accountRepo = new AccountRepository();
  });

  it("add new account", () => {
    expect(accountRepo.accounts.length).toBe(0);

    const newAccount = new Account("Acc01");
    accountRepo.add(newAccount);

    expect(accountRepo.accounts[0]).toBe(newAccount);
  });

  it("return account by Id", () => {
    const newAccount = new Account("Acc01");
    accountRepo.add(newAccount);

    expect(accountRepo.getById("Acc01")).toEqual(newAccount);
    expect(accountRepo.getById("Acc02")).toBeUndefined();
  });
});
