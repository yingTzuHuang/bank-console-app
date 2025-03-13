import { ConsoleIO } from "../../src/presentation/ConsoleIO";
import * as readline from "node:readline";

const mockReadline = {
  write: jest.fn(),
  question: jest.fn(),
  close: jest.fn(),
};

describe("ConsoleIO", () => {
  let consoleIO: ConsoleIO;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleIO = new ConsoleIO(mockReadline as unknown as readline.Interface);
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should display message", () => {
    const testMessage = "App started!";
    consoleIO.display(testMessage);
    expect(mockReadline.write).toHaveBeenCalledWith(testMessage + "\n");
  });

  it("should prompt for input", async () => {
    const mockAnswer = "test";
    mockReadline.question.mockImplementation(
      (_, callback: (answer: string) => void) => {
        callback(mockAnswer);
      }
    );
    const result = await consoleIO.promptInput();
    expect(result).toBe(mockAnswer);
  });

  it("should close readline", () => {
    consoleIO.close();
    expect(mockReadline.close).toHaveBeenCalled();
  });

  it("should show error message with ERROR: as prefix message to indicate error", () => {
    const mockErrorMesssage = "Error message";
    consoleIO.error(mockErrorMesssage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `ERROR: ${mockErrorMesssage}\n`
    );
  });
});
