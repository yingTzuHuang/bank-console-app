import { CommandExecuter } from "./CommandExecuter";
import { ConsoleIO } from "./ConsoleIO";

export class ConsoleUI {
  constructor(
    private consoleIO: ConsoleIO,
    private commandExecutor: CommandExecuter
  ) {}

  start() {
    this.showMenu("Welcome to AwesomeGIC Bank! What would you like to do?");
  }

  handleMenuSelection(input: string) {
    const trimmedInput = input.trim().toUpperCase();
    if (trimmedInput === "Q") {
      this.showQuitMessage();
      this.consoleIO.close();
      return;
    }

    try {
      this.commandExecutor.execute(trimmedInput);
      //   this.showMenu("Is there anything else you'd like to do?");
    } catch (err) {
      const error = err as Error;
      this.consoleIO.error(error?.message || "Invalid input!");
      //   this.showMenu("What would you like to do?");
    }
  }

  showMenu(menuTitle: string) {
    this.consoleIO.display(`${menuTitle}
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
