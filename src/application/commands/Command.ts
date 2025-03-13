import { ConsoleIO } from "../../presentation/ConsoleIO";

export abstract class Command {
  protected abstract readonly promptMessage: string;

  constructor(protected consoleIO: ConsoleIO) {}

  abstract handleInput(input: string): void;

  async promptInput(): Promise<string> {
    this.consoleIO.display(this.promptMessage);
    return this.consoleIO.promptInput();
  }
}
