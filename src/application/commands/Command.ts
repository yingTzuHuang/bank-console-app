import { ConsoleIO } from "../../presentation/ConsoleIO";

export abstract class Command {
  protected abstract readonly promptMessage: string;

  constructor(protected consoleIO: ConsoleIO) {}

  handleInput(input: string): void {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }
  }

  async promptInput(): Promise<string> {
    this.consoleIO.display(this.promptMessage);
    return this.consoleIO.promptInput();
  }
}
