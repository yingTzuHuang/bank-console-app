// Entry point of the application
import { ConsoleUI } from "./presentation/ConsoleUI";
import { ConsoleIO } from "./presentation/ConsoleIO";
import * as readline from "node:readline";
import { CommandExecuter } from "./presentation/CommandExecuter";
import { TransactionRepository } from "./infrastructure/TransactionRepository";
import { InterestRuleRepository } from "./infrastructure/InterestRuleRepository";
import { AccountRepository } from "./infrastructure/AccountRespository";
import { Command } from "./application/commands/Command";
import { InputTransactionCommand } from "./application/commands/InputTransactionCommand";
import { DefineInterestRuleCommand } from "./application/commands/DefineInterestRuleCommand";
import { PrintStatementCommand } from "./application/commands/PrintStatementCommand";

const startApp = () => {
  // Dependency Injections
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const consoleIO = new ConsoleIO(rl);

  const transactionRepository = new TransactionRepository();
  const interestRuleRepository = new InterestRuleRepository();
  const accountRepository = new AccountRepository();

  const commandMaps = registerCommands(
    transactionRepository,
    interestRuleRepository,
    accountRepository,
    consoleIO
  );

  const commandExecuter = new CommandExecuter(commandMaps);

  const consoleUI = new ConsoleUI(consoleIO, commandExecuter);
  consoleUI.start();
};

const registerCommands = (
  transactionRepository: TransactionRepository,
  interestRuleRepository: InterestRuleRepository,
  accountRepository: AccountRepository,
  consoleIO: ConsoleIO
) =>
  new Map<string, Command>([
    [
      "T",
      new InputTransactionCommand(
        transactionRepository,
        accountRepository,
        consoleIO
      ),
    ],
    ["I", new DefineInterestRuleCommand(interestRuleRepository, consoleIO)],
    [
      "P",
      new PrintStatementCommand(
        transactionRepository,
        interestRuleRepository,
        consoleIO
      ),
    ],
  ]);

startApp();
