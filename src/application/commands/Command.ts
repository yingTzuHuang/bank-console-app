import { ConsoleIO } from "../../presentation/ConsoleIO";

export abstract class Command {
  protected abstract readonly promptMessage: string;

  constructor(protected consoleIO: ConsoleIO) {}

  abstract handleInput(input: string): void;

  execute() {
    this.consoleIO.display(this.promptMessage);
    this.consoleIO.promptInput((userInput) => this.handleInput(userInput));
  }
}
