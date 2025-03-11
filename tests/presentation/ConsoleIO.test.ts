import { ConsoleIO } from "../../src/presentation/ConsoleIO";
import * as readline from "node:readline";

const mockReadline = {
  write: jest.fn(),
  question: jest.fn(),
  close: jest.fn(),
};

describe("ConsoleIO", () => {
  let consoleIO: ConsoleIO;
  beforeEach(() => {
    jest.clearAllMocks();
    consoleIO = new ConsoleIO(mockReadline as unknown as readline.Interface);
  });

  it("should display message", () => {
    const testMessage = "App started!";
    consoleIO.display(testMessage);
    expect(mockReadline.write).toHaveBeenCalledWith(testMessage + "\n");
  });

  it("should prompt for input", () => {
    const mockCallback = jest.fn();
    consoleIO.promptInput(mockCallback);
    expect(mockReadline.question).toHaveBeenCalledWith(
      ">",
      expect.any(Function)
    );
  });

  it("should close readline", () => {
    consoleIO.close();
    expect(mockReadline.close).toHaveBeenCalled();
  });
});
