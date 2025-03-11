// Entry point of the application
import { ConsoleUI } from "./presentation/ConsoleUI";
import { ConsoleIO } from "./presentation/ConsoleIO";
import * as readline from "node:readline";
import { CommandExecuter } from "./presentation/CommandExecuter";
import { TransactionRepository } from "./infrastructure/TransactionRepository";
import { InterestRuleRepository } from "./infrastructure/InterestRuleRepository";
import { AccountRepository } from "./infrastructure/AccountRespository";

const startApp = () => {
  // DI
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const consoleIO = new ConsoleIO(rl);

  const transactionRepository = new TransactionRepository();
  const interestRuleRepository = new InterestRuleRepository();
  const accountRepository = new AccountRepository();

  const commandExecuter = new CommandExecuter(
    transactionRepository,
    interestRuleRepository,
    accountRepository,
    consoleIO
  );

  const consoleUI = new ConsoleUI(consoleIO, commandExecuter);
  consoleUI.start();
};

startApp();
