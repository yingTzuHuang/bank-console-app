import { CommandExecuter } from "../../src/presentation/CommandExecuter";
import { ConsoleIO } from "../../src/presentation/ConsoleIO";
import { ConsoleUI } from "../../src/presentation/ConsoleUI";

const mockConsoleIO = {
  display: jest.fn(),
  promptInput: jest.fn(),
  close: jest.fn(),
  error: jest.fn(),
};

const mockCommandExecuter = {
  execute: jest.fn(),
};

describe("ConsoleUI", () => {
  let consoleUI: ConsoleUI;
  beforeEach(() => {
    jest.clearAllMocks();
    consoleUI = new ConsoleUI(
      mockConsoleIO as unknown as ConsoleIO,
      mockCommandExecuter as unknown as CommandExecuter
    );
  });

  it("should show initial welcome message", () => {
    consoleUI.start();
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Welcome to AwesomeGIC Bank!")
    );
  });

  it("should show menu with given menu title", () => {
    const testMenuTitle = "Test Menu Title";
    consoleUI.showMenu(testMenuTitle);
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining(testMenuTitle)
    );
  });

  it("should show quit message when input q", () => {
    consoleUI.handleMenuSelection("q");
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Thank you for banking with AwesomeGIC Bank")
    );
    expect(mockConsoleIO.close).toHaveBeenCalled();
  });

  it("should show error message when input invalid menu", () => {
    mockCommandExecuter.execute.mockImplementation(() => {
      throw new Error("Invalid option!");
    });
    consoleUI.handleMenuSelection("invalid");
    expect(mockConsoleIO.error).toHaveBeenCalled();
  });
});
