import { Account } from "../../src/domain/Account";
import { InterestRule } from "../../src/domain/InterestRule";

describe("Account", () => {
  it("deposit increases balance and add transaction", () => {
    const account = new Account("Acc001");
    const date = new Date();
    account.deposit(date, 90);
    expect(account.balance).toEqual(90);
  });

  it("withdraw - cannot withdraw more than balance", () => {
    const account = new Account("Acc001");
    const date = new Date();
    expect(() => account.withdraw(date, 100)).toThrow("Insufficient Balance!");
  });

  it("withdraw - can withdraw if amount is not more than balance", () => {
    const account1 = new Account("Acc001");
    const date = new Date();
    account1.deposit(date, 100);
    expect(() => account1.withdraw(date, 90)).not.toThrow(
      "Insufficient Balance!"
    );
    expect(account1.balance).toEqual(10);

    const account2 = new Account("Acc002");
    account2.deposit(date, 100);
    expect(() => account2.withdraw(date, 100)).not.toThrow(
      "Insufficient Balance!"
    );
    expect(account2.balance).toEqual(0);
  });

  it("calculate interests - No interest if no Interest Rules at all", () => {
    const account = new Account("Acc001");
    account.deposit(new Date(2023, 3, 1), 100);
    const noRuleInterest = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      { interestRules: [], lastNearestRuleBeforeRange: null }
    );

    expect(noRuleInterest).toBe(0);
  });

  it("calculate interests - return interest based on balance if no transaction in range", () => {
    const account = new Account("Acc001");

    const noTxnNoRuleNoBalanceInterest = account.calculateInterests(
      new Date(2023, 2, 1),
      new Date(2023, 2, 30),
      {
        interestRules: [],
        lastNearestRuleBeforeRange: null,
      }
    );

    const noTxnRangeRuleNoBalanceInterest = account.calculateInterests(
      new Date(2023, 2, 1),
      new Date(2023, 2, 30),
      {
        interestRules: [new InterestRule("Rule001", new Date(2023, 2, 1), 1)],
        lastNearestRuleBeforeRange: null,
      }
    );

    const noTxnPrevRuleNoBalanceInterest = account.calculateInterests(
      new Date(2023, 2, 1),
      new Date(2023, 2, 30),
      {
        interestRules: [],
        lastNearestRuleBeforeRange: new InterestRule(
          "Rule001",
          new Date(2023, 1, 1),
          1
        ),
      }
    );

    account.deposit(new Date(2023, 3, 1), 100);

    const noTxnNoRuleSomeBalanceInterest = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      {
        interestRules: [],
        lastNearestRuleBeforeRange: null,
      }
    );

    const noTxnPrevRuleSomeBalanceInterest = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      {
        interestRules: [],
        lastNearestRuleBeforeRange: new InterestRule(
          "Rule001",
          new Date(2023, 2, 1),
          1
        ),
      }
    );

    const expectedNoTxnPrevRuleSomeBalanceInterest = Number(
      ((100 * 0.01 * 30) / 365).toFixed(2)
    );

    // Rule is same as start date
    const noTxnRangeRuleSomeBalanceInterest = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      {
        interestRules: [new InterestRule("Rule001", new Date(2023, 3, 1), 2)],
        lastNearestRuleBeforeRange: null,
      }
    );

    const expectedNoTxnRangeRuleSomeBalanceInterest = Number(
      ((100 * 0.02 * 30) / 365).toFixed(2)
    );

    // Rule is later than start date
    const noTxnRangeRuleSomeBalanceInterest2 = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      {
        interestRules: [new InterestRule("Rule001", new Date(2023, 3, 11), 2)],
        lastNearestRuleBeforeRange: null,
      }
    );

    const expectedNoTxnRangeRuleSomeBalanceInterest2 = Number(
      ((100 * 0.02 * 20) / 365).toFixed(2)
    );

    const noTxnMixRuleSomeBalanceInterest = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      {
        interestRules: [
          new InterestRule("Rule002", new Date(2023, 3, 11), 2),
          new InterestRule("Rule003", new Date(2023, 3, 21), 3),
        ],
        lastNearestRuleBeforeRange: new InterestRule(
          "Rule001",
          new Date(2023, 2, 1),
          1
        ),
      }
    );

    const expectedNoTxnMixRuleSomeBalanceInterest = Number(
      ((100 * 0.01 * 10 + 100 * 0.02 * 10 + 100 * 0.03 * 10) / 365).toFixed(2)
    );

    // Start balance === 0
    expect(noTxnNoRuleNoBalanceInterest).toBe(0);
    expect(noTxnPrevRuleNoBalanceInterest).toBe(0);
    expect(noTxnRangeRuleNoBalanceInterest).toBe(0);
    // Start balance > 0
    expect(noTxnNoRuleSomeBalanceInterest).toBe(0);
    expect(noTxnPrevRuleSomeBalanceInterest).toBe(
      expectedNoTxnPrevRuleSomeBalanceInterest
    );
    expect(noTxnRangeRuleSomeBalanceInterest).toBe(
      expectedNoTxnRangeRuleSomeBalanceInterest
    );
    expect(noTxnRangeRuleSomeBalanceInterest2).toBe(
      expectedNoTxnRangeRuleSomeBalanceInterest2
    );
    expect(noTxnMixRuleSomeBalanceInterest).toBe(
      expectedNoTxnMixRuleSomeBalanceInterest
    );
  });

  it("calculate interests - when there are transactions in date range", () => {
    const account = new Account("Acc001");
    account.deposit(new Date(2023, 2, 1), 100);
    account.deposit(new Date(2023, 3, 1), 100);

    // Transaction is same as start date; Rule is same as start date
    const txnSameAsStartDate = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      {
        interestRules: [
          new InterestRule("Rule001", new Date(2023, 3, 1), 1),
          new InterestRule("Rule002", new Date(2023, 3, 21), 2),
        ],
        lastNearestRuleBeforeRange: null,
      }
    );

    const expectedTxnSameAsStartDateInterest = Number(
      ((200 * 0.01 * 20 + 200 * 0.02 * 10) / 365).toFixed(2)
    );

    // Transaction is same as start date; Rule is different as start date
    const txnSameAsStartDate2 = account.calculateInterests(
      new Date(2023, 3, 1),
      new Date(2023, 3, 30),
      {
        interestRules: [
          new InterestRule("Rule002", new Date(2023, 3, 11), 1),
          new InterestRule("Rule003", new Date(2023, 3, 21), 2),
        ],
        lastNearestRuleBeforeRange: new InterestRule(
          "Rule001",
          new Date(2023, 2, 11),
          5
        ),
      }
    );

    const expectedTxnSameAsStartDateInterest2 = Number(
      ((200 * 0.05 * 10 + 200 * 0.01 * 10 + 200 * 0.02 * 10) / 365).toFixed(2)
    );

    // Transaction is later than the start date; Rule same as start date
    account.deposit(new Date(2023, 4, 6), 100);
    const txnLaterThanStartDate = account.calculateInterests(
      new Date(2023, 4, 1),
      new Date(2023, 4, 30),
      {
        interestRules: [
          new InterestRule("Rule001", new Date(2023, 4, 1), 1),
          new InterestRule("Rule002", new Date(2023, 4, 21), 2),
        ],
        lastNearestRuleBeforeRange: null,
      }
    );

    const expectedTxnLaterThanStartDateInterest = Number(
      ((200 * 0.01 * 5 + 300 * 0.01 * 15 + 300 * 0.02 * 10) / 365).toFixed(2)
    );

    // Transaction is later than the start date; Rule is different from start date
    const txnLaterThanStartDate2 = account.calculateInterests(
      new Date(2023, 4, 1),
      new Date(2023, 4, 30),
      {
        interestRules: [
          new InterestRule("Rule002", new Date(2023, 4, 11), 1),
          new InterestRule("Rule003", new Date(2023, 4, 21), 2),
        ],
        lastNearestRuleBeforeRange: new InterestRule(
          "Rule001",
          new Date(2023, 4, 21),
          5
        ),
      }
    );

    const expectedTxnLaterThanStartDateInterest2 = Number(
      (
        (200 * 0.05 * 5 + 300 * 0.05 * 5 + 300 * 0.01 * 10 + 300 * 0.02 * 10) /
        365
      ).toFixed(2)
    );

    expect(txnSameAsStartDate).toBe(expectedTxnSameAsStartDateInterest);
    expect(txnSameAsStartDate2).toBe(expectedTxnSameAsStartDateInterest2);
    expect(txnLaterThanStartDate).toBe(expectedTxnLaterThanStartDateInterest);
    expect(txnLaterThanStartDate2).toBe(expectedTxnLaterThanStartDateInterest2);
  });
});
