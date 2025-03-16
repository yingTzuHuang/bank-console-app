import DefineInterestRuleCommand from "../../src/application/commands/DefineInterestRuleCommand";
import { InterestRule } from "../../src/domain/InterestRule";
import { InterestRuleRepository } from "../../src/infrastructure/InterestRuleRepository";
import { ConsoleIO } from "../../src/presentation/ConsoleIO";

describe("InputTransactionsCommand", () => {
  let defineRuleCommand: DefineInterestRuleCommand;
  let mockConsoleIO: ConsoleIO;
  let mockInterestRuleRepository: InterestRuleRepository;
  let mockInterestRules: InterestRule[];
  beforeEach(() => {
    mockInterestRules = [];
    mockConsoleIO = {
      display: jest.fn(),
      promptInput: jest.fn(),
    } as unknown as ConsoleIO;
    mockInterestRuleRepository = {
      add: (rule: InterestRule) => {
        mockInterestRules.push(rule);
      },
      interestRules: mockInterestRules,
    } as unknown as InterestRuleRepository;

    defineRuleCommand = new DefineInterestRuleCommand(
      mockConsoleIO,
      mockInterestRuleRepository
    );
  });

  it("prompts user to input an option from menu", async () => {
    await defineRuleCommand.promptInput();
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Please enter interest rules details")
    );
    expect(mockConsoleIO.promptInput).toHaveBeenCalledTimes(1);
  });

  it("return if user input blank", () => {
    defineRuleCommand.handleInput(" ");
    expect(mockInterestRules.length).toBe(0);
  });

  it("return if user input is empty", () => {
    defineRuleCommand.handleInput("");
    expect(mockInterestRules.length).toBe(0);
  });

  it("validate input format - throws error if input format is invalid", () => {
    expect(() => defineRuleCommand.handleInput("test")).toThrow(
      "Invalid input format! Please enter interest rules details in <Date> <RuleId> <Rate in %> format."
    );
  });

  it("validate rate - throws error if rate is out of range", () => {
    expect(() => defineRuleCommand.handleInput("20250303 Rule001 100")).toThrow(
      "Invalid rate! Interest rate should be greater than 0 and less than 100"
    );
  });

  it("show all interest rules", () => {
    defineRuleCommand.handleInput("20250303 Rule001 1");

    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("| Date | Rule Id | Rate(%) |")
    );
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("| 20250303 | Rule001 | 1.00 |")
    );
  });
});
