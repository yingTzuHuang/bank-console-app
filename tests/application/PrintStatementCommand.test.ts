import PrintStatementCommand from "../../src/application/commands/PrintStatementCommand";
import { Account } from "../../src/domain/Account";
import { Transaction } from "../../src/domain/Transaction";
import { AccountRepository } from "../../src/infrastructure/AccountRepository";
import { InterestRuleRepository } from "../../src/infrastructure/InterestRuleRepository";
import { ConsoleIO } from "../../src/presentation/ConsoleIO";

describe("PrintStatementCommand", () => {
  //   let mockCalculateInterest = jest.fn();
  let printStatementCommand: PrintStatementCommand;
  let mockConsoleIO: ConsoleIO;
  let mockInterestRuleRepository: InterestRuleRepository;
  let mockAccountRepository: AccountRepository;
  beforeEach(() => {
    mockConsoleIO = {
      display: jest.fn(),
      promptInput: jest.fn(),
    } as unknown as ConsoleIO;
    mockInterestRuleRepository = {
      getInterestRateRulesByDateRange: jest.fn(),
    } as unknown as InterestRuleRepository;
    mockAccountRepository = {
      accounts: [
        {
          id: "ACC001",
          transactions: [],
          calculateInterests: jest.fn(),
          addInterest: jest.fn(),
        },
      ],
    } as unknown as AccountRepository;
    printStatementCommand = new PrintStatementCommand(
      mockConsoleIO,
      mockAccountRepository,
      mockInterestRuleRepository
    );
  });

  it("prompts user to input account & month to generate the statement", async () => {
    await printStatementCommand.promptInput();
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining(
        "Please enter account and month to generate the statement"
      )
    );
    expect(mockConsoleIO.promptInput).toHaveBeenCalledTimes(1);
  });

  it("return if user input blank", () => {
    printStatementCommand.handleInput(" ");
    expect(
      mockInterestRuleRepository.getInterestRateRulesByDateRange
    ).not.toHaveBeenCalled();
  });

  it("return if user input is empty", () => {
    printStatementCommand.handleInput("");
    expect(
      mockInterestRuleRepository.getInterestRateRulesByDateRange
    ).not.toHaveBeenCalled();
  });

  it("validate input format - throws error if input format is invalid", () => {
    expect(() => printStatementCommand.handleInput("test")).toThrow(
      "Invalid input format! Please enter account and month in <Account> <Year><Month> format."
    );
  });

  it("If account doesn't exist, throws account error ", () => {
    expect(() => printStatementCommand.handleInput("ACC999 202501")).toThrow(
      "Account doesn't exist. Please check your input."
    );
  });

  it("If account exists, no account error is thrown", () => {
    expect(() =>
      printStatementCommand.handleInput("ACC001 202501")
    ).not.toThrow("Account doesn't exist. Please check your input.");
  });

  it("print statement if account exists - no transactions in month", () => {
    mockAccountRepository.accounts[0].transactions.push({
      date: new Date(2025, 0, 1),
      amount: 100,
      type: "D",
      balance: 100,
    } as unknown as Transaction);

    printStatementCommand.handleInput("ACC001 202502");

    expect(mockConsoleIO.display).toHaveBeenCalledWith("Account: ACC001");
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      "No transactions found for this month."
    );
  });

  it("print statement if account exists - some transactions in month", () => {
    mockAccountRepository.accounts[0].transactions.push({
      date: new Date(2025, 0, 1),
      amount: 100,
      type: "D",
      balance: 100,
    } as unknown as Transaction);
    mockAccountRepository.accounts[0].transactions.push({
      id: "20250201-01",
      date: new Date(2025, 1, 1),
      amount: 100,
      type: "D",
      balance: 200,
    } as unknown as Transaction);

    printStatementCommand.handleInput("ACC001 202502");

    expect(mockConsoleIO.display).toHaveBeenCalledWith("Account: ACC001");
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      "| Date | Txn Id | Type | Amount | Balance |"
    );
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      "| 20250201 | 20250201-01 | D | 100.00 | 200.00 |"
    );
  });

  it("print statement if account exists - print interest transactions", () => {
    mockAccountRepository.accounts[0].transactions.push({
      date: new Date(2025, 0, 1),
      amount: 100,
      type: "D",
      balance: 100,
    } as unknown as Transaction);
    mockAccountRepository.accounts[0].transactions.push({
      id: "20250201-01",
      date: new Date(2025, 1, 1),
      amount: 100,
      type: "D",
      balance: 200,
    } as unknown as Transaction);

    mockAccountRepository.accounts[0].transactions.push({
      id: "",
      date: new Date(2025, 1, 28),
      amount: 0,
      type: "I",
      balance: 200,
    } as unknown as Transaction);

    printStatementCommand.handleInput("ACC001 202502");

    expect(mockConsoleIO.display).toHaveBeenCalledWith("Account: ACC001");
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      "| Date | Txn Id | Type | Amount | Balance |"
    );
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      "| 20250228 |  | I | 0.00 | 200.00 |"
    );
  });
});
