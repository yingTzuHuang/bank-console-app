import { CommandExecuter } from "../../src/presentation/CommandExecuter";
import { ConsoleIO } from "../../src/presentation/ConsoleIO";
import { ConsoleUI } from "../../src/presentation/ConsoleUI";

const mockConsoleIO = {
  display: jest.fn(),
  promptInput: jest.fn(),
  close: jest.fn(),
};

const mockCommandExecuter = {
  execute: jest.fn(),
};

describe("index", () => {
  let processSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show initial test message", () => {
    const consoleUI = new ConsoleUI(
      mockConsoleIO as unknown as ConsoleIO,
      mockCommandExecuter as unknown as CommandExecuter
    );
    consoleUI.start();
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Welcome to AwesomeGIC Bank!")
    );
  });
});
