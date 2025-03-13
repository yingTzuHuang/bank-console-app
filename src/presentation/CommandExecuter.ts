import { Command } from "../application/commands/Command";
import { InvalidInputError } from "../errors/InvalidInputError";

export class CommandExecuter {
  constructor(private commandMaps: Map<string, Command>) {}

  async execute(command: string) {
    const trimmedCommand = command.trim().toUpperCase();
    const commandObj = this.commandMaps.get(trimmedCommand);

    if (commandObj) {
      const userInput = await commandObj.promptInput();
      commandObj.handleInput(userInput);
    } else {
      throw new InvalidInputError(
        "Invalid input. Please input a valid option."
      );
    }
  }
}
