import { Command } from "../../src/application/commands/Command";
import { CommandExecuter } from "../../src/presentation/CommandExecuter";

describe("CommandExecuter", () => {
  let commandExecuter: CommandExecuter;
  let mockCommand: Command;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCommand = { execute: jest.fn() } as unknown as Command;
    const mockCommandMaps = new Map<string, Command>([["TEST", mockCommand]]);
    commandExecuter = new CommandExecuter(mockCommandMaps);
  });

  it("should execute valid command", () => {
    commandExecuter.execute("test");
    expect(mockCommand.execute).toHaveBeenCalled();
  });

  it("should throw error when execute invalid command", () => {
    expect(() => commandExecuter.execute("invalid")).toThrow(
      "Please provide a valid option"
    );
  });
});
