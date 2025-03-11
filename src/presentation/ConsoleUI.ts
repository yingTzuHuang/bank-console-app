import { CommandExecuter } from "./CommandExecuter";
import { ConsoleIO } from "./ConsoleIO";

export class ConsoleUI {
  constructor(
    private consoleIO: ConsoleIO,
    private commandExecutor: CommandExecuter
  ) {}

  start() {
    this.showMenu(true);
  }

  handleMenuSelection(input: string) {
    const trimmedInput = input.trim().toUpperCase();
    if (trimmedInput === "Q") {
      this.showQuitMessage();
      this.consoleIO.close();
      return;
    }
    this.commandExecutor.execute(trimmedInput);
    this.showMenu(false);
  }

  showMenu(isInitalMenu: boolean) {
    this.consoleIO.display(`${
      isInitalMenu
        ? "Welcome to AwesomeGIC Bank! What would you like to do"
        : "Is there anything else you'd like to do?"
    }?

    [T] Input transactions

    [I] Define interest rules

    [P] Print statement

    [Q] Quit`);
    this.consoleIO.promptInput((input) => this.handleMenuSelection(input));
  }

  showQuitMessage() {
    this.consoleIO.display(`Thank you for banking with AwesomeGIC Bank.

Have a nice day!`);
  }
}
