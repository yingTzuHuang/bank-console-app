import { CommandExecuter } from "./CommandExecuter";
import { ConsoleIO } from "./ConsoleIO";

export class ConsoleUI {
  constructor(
    private consoleIO: ConsoleIO,
    private commandExecutor: CommandExecuter
  ) {}

  async start() {
    await this.showMenu(
      "Welcome to AwesomeGIC Bank! What would you like to do?",
      this.handleMenuSelection
    );
  }

  handleMenuSelection = async (input: string) => {
    const trimmedInput = input.trim().toUpperCase();
    if (trimmedInput === "Q") {
      this.showQuitMessage();
      this.consoleIO.close();
      return;
    }

    try {
      await this.commandExecutor.execute(trimmedInput);
      await this.showMenu(
        "Is there anything else you'd like to do?",
        this.handleMenuSelection
      );
    } catch (err) {
      const error = err as Error;
      this.consoleIO.error(error?.message || "Invalid input!");
      await this.showMenu(
        "What would you like to do?",
        this.handleMenuSelection
      );
    } finally {
      this.consoleIO.close();
    }
  };

  showMenu = async (
    menuTitle: string,
    callback: (input: string) => Promise<void>
  ) => {
    this.consoleIO.display(`${menuTitle}
    [T] Input transactions
    [I] Define interest rules
    [P] Print statement
    [Q] Quit`);
    const input = await this.consoleIO.promptInput();
    await callback(input);
  };

  showQuitMessage() {
    this.consoleIO.display(`Thank you for banking with AwesomeGIC Bank.
Have a nice day!`);
  }
}
