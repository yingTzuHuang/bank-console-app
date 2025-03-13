import { Account } from "../../src/domain/Account";
import { Transaction } from "../../src/domain/Transaction";
import { TransactionRepository } from "../../src/infrastructure/TransactionRepository";

describe("TransactionRespository", () => {
  let transactionRepo: TransactionRepository;
  beforeEach(() => {
    transactionRepo = new TransactionRepository();
  });

  it("generates id when new transaction is added", () => {
    expect(transactionRepo.transactions.length).toBe(0);

    const account = new Account("Acc01", 0);
    let generateTransactionIdSpy = jest.spyOn(
      transactionRepo,
      "generateTransactionId"
    );
    const date = new Date(2025, 1, 1);

    transactionRepo.add(new Transaction(account, date, "D", 100));

    expect(generateTransactionIdSpy).toHaveBeenCalledTimes(1);
    expect(transactionRepo.transactions.length).toBe(1);
    expect(transactionRepo.transactions[0].id).toEqual("20250201-01");
  });

  it("generates id", () => {
    const date = new Date(2025, 1, 2);
    const id = transactionRepo.generateTransactionId(date);

    expect(id).toEqual("20250202-01");
  });

  it("generated id is running number based on the date", () => {
    const date1 = new Date(2025, 1, 1);
    const id1 = transactionRepo.generateTransactionId(date1);
    const date2 = new Date(2025, 1, 1);
    const id2 = transactionRepo.generateTransactionId(date2);
    const date3 = new Date(2025, 1, 2);
    const id3 = transactionRepo.generateTransactionId(date3);

    expect(id1).toEqual("20250201-01");
    expect(id2).toEqual("20250201-02");
    expect(id3).toEqual("20250202-01");
  });
});
