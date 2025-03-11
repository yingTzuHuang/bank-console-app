import { Command } from "../application/commands/Command";
import { InvalidInputError } from "../errors/InvalidInputError";

export class CommandExecuter {
  constructor(private commandMaps: Map<string, Command>) {}

  execute(command: string) {
    const trimmedCommand = command.trim().toUpperCase();
    const commandObj = this.commandMaps.get(trimmedCommand);

    if (commandObj) {
      commandObj.execute();
    } else {
      throw new InvalidInputError("Please provide a valid option");
    }
  }
}
