import { Command } from "../../src/application/commands/Command";
import { CommandExecuter } from "../../src/presentation/CommandExecuter";

describe("CommandExecuter", () => {
  let commandExecuter: CommandExecuter;
  let mockCommand: Command;

  beforeEach(() => {
    mockCommand = {
      execute: jest.fn(),
      promptUserInput: jest.fn(),
    } as unknown as Command;
    const mockCommandMaps = new Map<string, Command>([["TEST", mockCommand]]);
    commandExecuter = new CommandExecuter(mockCommandMaps);
  });

  it("should execute valid command", () => {
    commandExecuter.execute(" test ");
    expect(mockCommand.execute).toHaveBeenCalled();
  });

  it("should throw error when command is blank", () => {
    expect(() => commandExecuter.execute(" ")).toThrow(
      "Invalid input. Please input a valid option."
    );
  });

  it("should throw error when execute invalid command", () => {
    expect(() => commandExecuter.execute("invalid")).toThrow(
      "Invalid input. Please input a valid option."
    );
  });
});
