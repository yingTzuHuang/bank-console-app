import { InsufficientBalanceError } from "../errors/InsufficientBalanceError";
import { areSameDate, getDateDiffInDays } from "../utils/dateUtils";
import {
  getEndOfDayTransactions,
  RangeInterestRules,
} from "../utils/domainUtils";
import { Transaction } from "./Transaction";

export class Account {
  private _transactions: Transaction[];
  private _balance: number;
  constructor(private _id: string) {
    this._transactions = [];
    this._balance = 0;
  }

  withdraw(date: Date, amount: number): Transaction {
    if (!this.canWithdraw(amount)) {
      throw new InsufficientBalanceError("Insufficient Balance!");
    }
    this._balance -= amount;
    const newTransaction = new Transaction(
      this,
      date,
      "W",
      amount,
      this._balance
    );
    this._transactions.push(newTransaction);
    return newTransaction;
  }

  deposit(date: Date, amount: number): Transaction {
    return this.addIncomeTransactions(date, amount, "D");
  }

  // For crediting interest at the last day of month
  addInterest(date: Date, amount: number): Transaction {
    return this.addIncomeTransactions(date, amount, "I");
  }

  private addIncomeTransactions(
    date: Date,
    amount: number,
    transactionType: "D" | "W" | "I"
  ) {
    this._balance += amount;
    const newTransaction = new Transaction(
      this,
      date,
      transactionType,
      amount,
      this._balance
    );
    this._transactions.push(newTransaction);
    return newTransaction;
  }

  private canWithdraw(amount: number) {
    return this._balance >= amount;
  }

  calculateInterests(
    startDate: Date,
    endDate: Date,
    rangeInterestRules: RangeInterestRules
  ) {
    let startBalance = 0;
    const transactions = this._transactions.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );

    // Sort transactions to ensure they are in desending order to get the txn before date range
    const descendingDateTxns = [...this._transactions].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    // Get the nearest past transaction to get startBalance
    const txnBeforeStartDate = descendingDateTxns.find(
      (t) => t.date < startDate
    );

    if (!!txnBeforeStartDate) {
      startBalance = txnBeforeStartDate.balance;
    }

    const endOfDayTransactions = getEndOfDayTransactions(transactions);

    const interestPeriods = this.convertTransactionsToInterestPeriods(
      startDate,
      endDate,
      rangeInterestRules,
      endOfDayTransactions,
      startBalance
    );

    let interestSum = 0;
    for (let period of interestPeriods) {
      interestSum += this.getPeriodInterest(period);
    }
    return Number((interestSum / 365).toFixed(2));
  }

  private convertTransactionsToInterestPeriods(
    startDate: Date,
    endDate: Date,
    rangeInterestRules: RangeInterestRules,
    transactions: Transaction[],
    startBalance: number
  ): InterestPeriod[] {
    // No interest rules defined at all, no interest
    if (!rangeInterestRules) {
      return [];
    }
    const { interestRules, lastNearestRuleBeforeRange } = rangeInterestRules;
    if (
      !lastNearestRuleBeforeRange &&
      (!interestRules || interestRules.length === 0)
    ) {
      return [];
    }

    // No transactions in range and balance before range is 0, no interest
    if ((!transactions || transactions.length === 0) && startBalance === 0) {
      return [];
    }

    const interestPeriods: InterestPeriod[] = [];
    let ruleIndex = -1;
    let transactionIndex = -1;

    // First start date of period:
    // If there's interest rule before startDate, use startDate.
    // Else, use first rule's date
    let nextInterestRate = lastNearestRuleBeforeRange
      ? lastNearestRuleBeforeRange.rate
      : 0;
    // If startDate is earlier than nearest transaction date, get EOD balance base on nearest transaction
    let nextEodBalance = startBalance;

    let nextStartDate: Date | null = startDate;

    if (interestRules.length > 0) {
      ruleIndex++;
      if (areSameDate(startDate, interestRules[0].date)) {
        nextInterestRate = interestRules[0].rate;
        ruleIndex++;
      }
    }

    if (transactions.length > 0) {
      transactionIndex++;
      if (areSameDate(startDate, transactions[0].date)) {
        nextEodBalance = transactions[0].balance;
        transactionIndex++;
      }
    }

    while (!!nextStartDate) {
      const period: InterestPeriod = {
        startDate: nextStartDate,
        endDate,
        eodBalance: nextEodBalance,
        interestRate: nextInterestRate,
      };

      // Next start date of period:
      // next rule or next transaction date, whichever is earlest
      const ruleDate =
        ruleIndex >= 0 && ruleIndex < interestRules.length
          ? interestRules[ruleIndex].date
          : null;

      const transactionDate =
        transactionIndex >= 0 && transactionIndex < transactions.length
          ? transactions[transactionIndex].date
          : null;

      if (ruleDate !== null && transactionDate !== null) {
        if (ruleDate < transactionDate) {
          nextStartDate = ruleDate;
          nextInterestRate = interestRules[ruleIndex].rate;
          ruleIndex++;
        } else if (ruleDate > transactionDate) {
          nextStartDate = transactionDate;
          nextEodBalance = transactions[transactionIndex].balance;
          transactionIndex++;
        } else {
          nextStartDate = ruleDate;
          nextInterestRate = interestRules[ruleIndex].rate;
          nextEodBalance = transactions[transactionIndex].balance;
          ruleIndex++;
          transactionIndex++;
        }
      } else if (transactionDate !== null) {
        nextStartDate = transactionDate;
        nextEodBalance = transactions[transactionIndex].balance;
        transactionIndex++;
      } else if (ruleDate !== null) {
        nextStartDate = ruleDate;
        nextInterestRate = interestRules[ruleIndex].rate;
        ruleIndex++;
      } else {
        nextStartDate = null;
      }

      // End date of period
      // If there is next start date
      // else endDate
      if (nextStartDate) {
        period.endDate = new Date(
          nextStartDate.getFullYear(),
          nextStartDate.getMonth(),
          nextStartDate.getDate() - 1
        );
      }

      interestPeriods.push(period);
    }

    return interestPeriods;
  }

  private getPeriodInterest(period: InterestPeriod) {
    const numberOfDays = getDateDiffInDays(period.startDate, period.endDate);

    const interest =
      period.eodBalance * (period.interestRate / 100) * numberOfDays;

    return interest;
  }

  get id() {
    return this._id;
  }

  get transactions() {
    return this._transactions;
  }

  get balance() {
    return this._balance;
  }
}

type InterestPeriod = {
  startDate: Date;
  endDate: Date;
  eodBalance: number;
  interestRate: number;
};
