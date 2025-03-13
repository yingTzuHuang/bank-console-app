import { InterestRuleRepository } from "../../infrastructure/InterestRuleRepository";
import { TransactionRepository } from "../../infrastructure/TransactionRepository";
import { ConsoleIO } from "../../presentation/ConsoleIO";
import { Command } from "./Command";

export default class PrintStatementCommand extends Command {
  protected readonly promptMessage: string = "";
  constructor(
    consoleIO: ConsoleIO,
    private transactionRepository: TransactionRepository,
    private interestRuleRepository: InterestRuleRepository
  ) {
    super(consoleIO);
  }

  handleInput(input: string) {
    throw new Error("Not implemented");
  }
}
