import { AccountRepository } from "../../infrastructure/AccountRespository";
import { TransactionRepository } from "../../infrastructure/TransactionRepository";
import { ConsoleIO } from "../../presentation/ConsoleIO";
import { Command } from "./Command";

export class InputTransactionCommand implements Command {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private consoleIO: ConsoleIO
  ) {}

  execute() {
    throw new Error("Not implemented");
  }
}
