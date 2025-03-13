import { CommandExecuter } from "../../src/presentation/CommandExecuter";
import { ConsoleIO } from "../../src/presentation/ConsoleIO";
import { ConsoleUI } from "../../src/presentation/ConsoleUI";

describe("ConsoleUI", () => {
  let consoleUI: ConsoleUI;
  let mockCommandExecuter: CommandExecuter;
  let mockConsoleIO: ConsoleIO;
  beforeEach(() => {
    mockCommandExecuter = {
      execute: jest.fn(),
    } as unknown as CommandExecuter;
    mockConsoleIO = {
      display: jest.fn(),
      promptInput: jest.fn(),
      close: jest.fn(),
      error: jest.fn(),
    } as unknown as ConsoleIO;
    consoleUI = new ConsoleUI(mockConsoleIO, mockCommandExecuter);
  });

  it("should show initial welcome message", async () => {
    mockConsoleIO = {
      display: jest.fn(),
      promptInput: jest.fn().mockResolvedValueOnce("q"),
      close: jest.fn(),
      error: jest.fn(),
    } as unknown as ConsoleIO;
    consoleUI = new ConsoleUI(mockConsoleIO, mockCommandExecuter);

    await consoleUI.start();
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Welcome to AwesomeGIC Bank!")
    );
  });

  it("should show menu with given menu title", async () => {
    const testMenuTitle = "Test Menu Title";
    const mockCallback = jest.fn();
    await consoleUI.showMenu(testMenuTitle, mockCallback);
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining(testMenuTitle)
    );
    expect(mockCallback).toHaveBeenCalled();
  });

  it("should show quit message when input q", () => {
    consoleUI.handleMenuSelection("q");
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Thank you for banking with AwesomeGIC Bank")
    );
    expect(mockConsoleIO.close).toHaveBeenCalled();
  });

  it("should show error message when input invalid menu", () => {
    mockConsoleIO = {
      display: jest.fn(),
      promptInput: jest.fn().mockResolvedValueOnce("q"),
      close: jest.fn(),
      error: jest.fn(),
    } as unknown as ConsoleIO;
    mockCommandExecuter = {
      execute: jest.fn().mockImplementation(() => {
        throw new Error("mock error");
      }),
    } as unknown as CommandExecuter;
    consoleUI = new ConsoleUI(mockConsoleIO, mockCommandExecuter);

    consoleUI.handleMenuSelection("invalid");
    expect(mockConsoleIO.error).toHaveBeenCalled();
  });
});
