import { Account } from "../../domain/Account";
import { InvalidInputError } from "../../errors/InvalidInputError";
import { AccountRepository } from "../../infrastructure/AccountRespository";
import { TransactionRepository } from "../../infrastructure/TransactionRepository";
import { ConsoleIO } from "../../presentation/ConsoleIO";
import {
  convertDateToYYYYMMdd,
  convertYYYYMMddToDate,
  validateDate,
} from "../../utils/dateUtils";
import { Command } from "./Command";

export default class InputTransactionCommand extends Command {
  protected readonly promptMessage: string = `Please enter transaction details in <Date> <Account> <Type> <Amount> format 
  (or enter blank to go back to main menu):`;
  constructor(
    consoleIO: ConsoleIO,
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository
  ) {
    super(consoleIO);
  }

  handleInput(input: string) {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }

    const transactionDetails = trimmedInput.split(" ");
    if (transactionDetails.length !== 4) {
      throw new InvalidInputError("Invalid input format!");
    }

    const [dateString, accountId, type, amountString] = transactionDetails;
    const date = convertYYYYMMddToDate(dateString);
    const trimmedUpperType = type.trim().toUpperCase();
    const amount = this.convertAmountStringToNumber(amountString);

    validateDate(date);
    this.validateType(trimmedUpperType);
    this.validateAmount(amount);

    const account =
      this.accountRepository.getById(accountId) ?? new Account(accountId, 0);

    if (trimmedUpperType === "W") {
      account.withdraw(date!, Number(amount));
    } else {
      account.deposit(date!, Number(amount));
    }

    this.showAccountTransactions(account);
  }

  private validateType(trimmedType: string) {
    if (trimmedType !== "W" && trimmedType !== "D") {
      throw new InvalidInputError(
        "Invalid transaction type! Please use D for deposite and W for withdraw."
      );
    }
  }

  private convertAmountStringToNumber(amountString: string) {
    const trimmedAmount = amountString.trim();
    const amount = Number(trimmedAmount);
    if (isNaN(amount)) {
      throw new InvalidInputError("Invalid amount! Amount must be a number.");
    }
    return amount;
  }

  private validateAmount(amountNumber: number) {
    if (amountNumber <= 0) {
      throw new InvalidInputError(
        "Invalid amount! Amount must be greater than 0."
      );
    }
    if (amountNumber % 0.01 !== 0) {
      throw new InvalidInputError(
        "Invalid amount! Amount must be up to 2 decimal places."
      );
    }
  }

  showAccountTransactions(account: Account) {
    this.consoleIO.display(`Account:${account.id}`);
    this.consoleIO.display("| Date | Txn Id | Type | Amount |");
    for (const t of account.transactions) {
      const formattedDate = convertDateToYYYYMMdd(t.date);
      const formattedAmount = t.amount.toFixed(2);
      this.consoleIO.display(
        `| ${formattedDate} | ${t.id} | ${t.type} | ${formattedAmount} |`
      );
    }
  }
}
