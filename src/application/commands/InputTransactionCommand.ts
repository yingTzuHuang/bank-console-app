import { Account } from "../../domain/Account";
import { InvalidInputError } from "../../errors/InvalidInputError";
import { AccountRepository } from "../../infrastructure/AccountRepository";
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
      throw new InvalidInputError(
        "Invalid input format! Please enter transaction details in <Date> <Account> <Type> <Amount> format."
      );
    }

    const [dateString, accountId, type, amountString] = transactionDetails;

    const date = convertYYYYMMddToDate(dateString);
    validateDate(date);

    // trimming type may not be required as its from split space
    const trimmedUpperType = type.trim().toUpperCase();
    this.validateType(trimmedUpperType);

    const amount = this.convertAmountStringToNumber(amountString);
    this.validateAmount(amount);

    let account = this.accountRepository.getById(accountId);

    if (!account) {
      account = new Account(accountId);
      this.accountRepository.add(account);
    }

    let transaction = null;
    if (trimmedUpperType === "W") {
      transaction = account.withdraw(date!, Number(amount));
    } else {
      transaction = account.deposit(date!, Number(amount));
    }
    this.transactionRepository.add(transaction);

    this.showAccountTransactions(account);
  }

  private validateType(trimmedType: string) {
    if (trimmedType !== "W" && trimmedType !== "D") {
      throw new InvalidInputError(
        "Invalid transaction type! Please use D for deposite and W for withdraw."
      );
    }
  }

  // TODO: Move conversion of input to Transaction object part
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
    if ((amountNumber * 100) % 1 !== 0) {
      throw new InvalidInputError(
        "Invalid amount! Amount must be up to 2 decimal places."
      );
    }
  }

  private showAccountTransactions(account: Account) {
    this.consoleIO.display(`-----------------------------------`);
    this.consoleIO.display(`Account: ${account.id}`);
    this.consoleIO.display("| Date | Txn Id | Type | Amount |");
    for (const t of account.transactions) {
      const formattedDate = convertDateToYYYYMMdd(t.date);
      const formattedAmount = t.amount.toFixed(2);
      this.consoleIO.display(
        `| ${formattedDate} | ${t.id} | ${t.type} | ${formattedAmount} |`
      );
    }
    this.consoleIO.display(`-----------------------------------`);
  }
}
