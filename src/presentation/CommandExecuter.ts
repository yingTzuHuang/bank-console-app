import { Command } from "../application/commands/Command";
import { DefineInterestRuleCommand } from "../application/commands/DefineInterestRuleCommand";
import { InputTransactionCommand } from "../application/commands/InputTransactionCommand";
import { PrintStatementCommand } from "../application/commands/PrintStatementCommand";
import { InvalidInputError } from "../errors/InvalidInputError";
import { AccountRepository } from "../infrastructure/AccountRespository";
import { InterestRuleRepository } from "../infrastructure/InterestRuleRepository";
import { TransactionRepository } from "../infrastructure/TransactionRepository";
import { ConsoleIO } from "./ConsoleIO";

export class CommandExecuter {
  private commandMaps: Map<string, Command>;
  constructor(
    private transactionRepository: TransactionRepository,
    private interestRuleRepository: InterestRuleRepository,
    private accountRepository: AccountRepository,
    private consoleIO: ConsoleIO
  ) {
    this.commandMaps = new Map<string, Command>([
      [
        "T",
        new InputTransactionCommand(
          this.transactionRepository,
          this.accountRepository,
          this.consoleIO
        ),
      ],
      [
        "I",
        new DefineInterestRuleCommand(
          this.interestRuleRepository,
          this.consoleIO
        ),
      ],
      [
        "P",
        new PrintStatementCommand(
          this.transactionRepository,
          this.interestRuleRepository,
          this.consoleIO
        ),
      ],
    ]);
  }

  execute(command: string) {
    const commandObj = this.commandMaps.get(command);
    if (commandObj) {
      commandObj.execute();
    } else {
      throw new InvalidInputError("Please provide a valid option");
    }
  }
}
