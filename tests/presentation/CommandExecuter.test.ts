import { Command } from "../../src/application/commands/Command";
import { CommandExecuter } from "../../src/presentation/CommandExecuter";

describe("CommandExecuter", () => {
  let commandExecuter: CommandExecuter;
  let mockCommand: Command;

  beforeEach(() => {
    mockCommand = {
      promptInput: jest.fn(),
      handleInput: jest.fn(),
    } as unknown as Command;
    const mockCommandMaps = new Map<string, Command>([["TEST", mockCommand]]);
    commandExecuter = new CommandExecuter(mockCommandMaps);
  });

  it("should execute valid command", async () => {
    await commandExecuter.execute(" test ");
    expect(mockCommand.promptInput).toHaveBeenCalled();
  });

  it("should throw error when command is blank", async () => {
    await expect(commandExecuter.execute(" ")).rejects.toThrow(
      "Invalid input. Please input a valid option."
    );
  });

  it("should throw error when execute invalid command", async () => {
    await expect(commandExecuter.execute("invalid")).rejects.toThrow(
      "Invalid input. Please input a valid option."
    );
  });
});
