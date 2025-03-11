import { InterestRuleRepository } from "../../infrastructure/InterestRuleRepository";
import { TransactionRepository } from "../../infrastructure/TransactionRepository";
import { ConsoleIO } from "../../presentation/ConsoleIO";
import { Command } from "./Command";

export class PrintStatementCommand implements Command {
  constructor(
    private transactionRepository: TransactionRepository,
    private interestRuleRepository: InterestRuleRepository,
    private consoleIO: ConsoleIO
  ) {}

  execute() {
    throw new Error("Not implemented");
  }
}
