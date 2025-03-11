import { ConsoleIO } from "../../src/presentation/ConsoleIO";
import { ConsoleUI } from "../../src/presentation/ConsoleUI";

const mockConsoleIO = {
  display: jest.fn(),
  promptInput: jest.fn(),
  close: jest.fn(),
};
describe("index", () => {
  let processSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show initial test message", () => {
    const consoleUI = new ConsoleUI(mockConsoleIO as unknown as ConsoleIO);
    consoleUI.start();
    expect(mockConsoleIO.display).toHaveBeenCalledWith("App started!");
  });
});
