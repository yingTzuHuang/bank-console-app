import { Transaction } from "../../domain/Transaction";

export type DisplayTransaction = Pick<Transaction, "id" | "type" | "amount"> & {
  date: string;
};
