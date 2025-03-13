import { Account } from "../../src/domain/Account";

describe("Account", () => {
  it("withdraw - cannot withdraw more than balance", () => {
    const account = new Account("Acc001", 10);
    const date = new Date();
    expect(() => account.withdraw(date, 100)).toThrow("Insufficient Balance!");
  });

  it("withdraw - can withdraw if amount is not more than balance", () => {
    const account1 = new Account("Acc001", 100);
    const date = new Date();
    expect(() => account1.withdraw(date, 90)).not.toThrow(
      "Insufficient Balance!"
    );
    expect(account1.balance).toEqual(10);

    const account2 = new Account("Acc002", 100);
    expect(() => account2.withdraw(date, 100)).not.toThrow(
      "Insufficient Balance!"
    );
    expect(account2.balance).toEqual(0);
  });

  it("deposit increases balance and add transaction", () => {
    const account = new Account("Acc001", 100);
    const date = new Date();
    account.deposit(date, 90);
    expect(account.balance).toEqual(190);
  });
});
