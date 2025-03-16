import { Account } from "../../src/domain/Account";
import { Transaction } from "../../src/domain/Transaction";
import { getEndOfDayTransactions } from "../../src/utils/domainUtils";

describe("domainUtils", () => {
  it("get only the last transaction of the day from transactions", () => {
    const transaction1 = new Transaction(
      new Account("ACC001"),
      new Date(2023, 5, 2),
      "D",
      150,
      200
    );
    transaction1.id = "20230602-02";
    const transaction2 = new Transaction(
      new Account("ACC001"),
      new Date(2023, 5, 2),
      "D",
      150,
      200
    );
    transaction2.id = "20230602-01";
    const transactions = [transaction1, transaction2];
    const actual = getEndOfDayTransactions(transactions);
    expect(actual).toEqual([transaction1]);
  });
});
