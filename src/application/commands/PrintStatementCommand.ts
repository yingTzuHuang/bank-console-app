import { InvalidInputError } from "../../errors/InvalidInputError";
import { InterestRuleRepository } from "../../infrastructure/InterestRuleRepository";
import { TransactionRepository } from "../../infrastructure/TransactionRepository";
import { ConsoleIO } from "../../presentation/ConsoleIO";
import { Command } from "./Command";
import {
  areSameDate,
  convertDateToYYYYMMdd,
  convertYYYYMMToLastDateOfMonth,
  getStartDateOfMonth,
  validateDate,
} from "../../utils/dateUtils";
import { AccountRepository } from "../../infrastructure/AccountRepository";
import { Account } from "../../domain/Account";

export default class PrintStatementCommand extends Command {
  protected readonly promptMessage: string = `Please enter account and month to generate the statement <Account> <Year><Month>
(or enter blank to go back to main menu):`;
  constructor(
    consoleIO: ConsoleIO,
    private accountRepository: AccountRepository,
    private interestRuleRepository: InterestRuleRepository
  ) {
    super(consoleIO);
  }

  handleInput(input: string) {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }

    // Validate input format
    const statementRequest = trimmedInput.split(" ");
    if (statementRequest.length !== 2) {
      throw new InvalidInputError(
        "Invalid input format! Please enter account and month in <Account> <Year><Month> format."
      );
    }

    const [accountId, yearMonth] = statementRequest;

    // Validate account exists
    const account = this.accountRepository.accounts.find(
      (acc) => acc.id === accountId
    );

    if (!account) {
      throw new InvalidInputError(
        "Account doesn't exist. Please check your input."
      );
    }

    const monthLastDate = convertYYYYMMToLastDateOfMonth(yearMonth);
    const monthStartDate = getStartDateOfMonth(monthLastDate);
    validateDate(monthStartDate);

    // Add interest transaction if it's not yet added for printing statement. Will not add to repository as it should not be print statement's responsibility
    if (
      monthLastDate <= new Date() &&
      !account.transactions.some(
        (t) => areSameDate(monthLastDate, t.date) && t.type === "I"
      )
    ) {
      console.log("In interest");
      const monthInterestRules =
        this.interestRuleRepository.getInterestRateRulesByDateRange(
          monthStartDate,
          monthLastDate
        );

      const interest = account.calculateInterests(
        monthStartDate,
        monthLastDate,
        monthInterestRules
      );

      account.addInterest(monthLastDate, interest);
    }

    this.showStatement(account, monthStartDate, monthLastDate);
  }

  private showStatement(
    account: Account,
    monthStartDate: Date,
    monthLastDate: Date
  ) {
    const monthTransactions = account.transactions.filter(
      (t) => t.date >= monthStartDate && t.date <= monthLastDate
    );

    this.consoleIO.display(`-----------------------------------`);
    this.consoleIO.display(`Account: ${account.id}`);
    if (monthTransactions.length > 0) {
      this.consoleIO.display("| Date | Txn Id | Type | Amount | Balance |");
      for (const t of monthTransactions) {
        const formattedDate = convertDateToYYYYMMdd(t.date);
        const formattedAmount = t.amount.toFixed(2);
        const formattedBalance = t.balance.toFixed(2);
        const line = `| ${formattedDate} | ${t.id ?? ""} | ${
          t.type
        } | ${formattedAmount} | ${formattedBalance} |`;

        this.consoleIO.display(
          `| ${formattedDate} | ${t.id ?? ""} | ${
            t.type
          } | ${formattedAmount} | ${formattedBalance} |`
        );
      }
    } else {
      this.consoleIO.display("No transactions found for this month.");
    }
    this.consoleIO.display(`-----------------------------------`);
  }
}
