import { InterestRule } from "../domain/InterestRule";
import { Transaction } from "../domain/Transaction";

export type RangeInterestRules = {
  interestRules: InterestRule[];
  lastNearestRuleBeforeRange: InterestRule | null;
};

export const getEndOfDayTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  const dateTransactions = new Map<string, Transaction>();
  for (let transaction of transactions) {
    const dateString = transaction.date.toISOString();
    const existingTransaction = dateTransactions.get(dateString);
    if (existingTransaction) {
      const existingTxnSeqString = existingTransaction.id.split("-")[1];
      const existingTxnSeqNumber = Number(existingTxnSeqString);
      const txnSeqString = transaction.id.split("-")[1];
      const txnSeqNumber = Number(txnSeqString);
      if (txnSeqNumber > existingTxnSeqNumber) {
        dateTransactions.set(dateString, transaction);
      }
    } else {
      dateTransactions.set(dateString, transaction);
    }
  }
  return Array.from(dateTransactions.values());
};
