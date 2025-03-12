import InputTransactionCommand from "../../src/application/commands/InputTransactionCommand";
import { AccountRepository } from "../../src/infrastructure/AccountRespository";
import { TransactionRepository } from "../../src/infrastructure/TransactionRepository";
import { ConsoleIO } from "../../src/presentation/ConsoleIO";
// promptInput
// return to menu if empty
// validateInput
//  - validateInputFormat
//  - validateDateFormat
//  - validateType
//  - validateAmount
// accountRepository.getAccount
// if account not found, create new account
// account.addTransaction
// - if date is futrue date -> error
// - if insufficient balance -> error
// new account is created
// transaction is added to repository
// showAccountTransactions (excluding interest transactions)

describe("InputTransactionsCommand", () => {
  let inputTransactionsCommand: InputTransactionCommand;
  let mockConsoleIO: ConsoleIO;
  let mockTransactionRepository: TransactionRepository;
  let mockAccountRepository: AccountRepository;
  beforeEach(() => {
    mockConsoleIO = {
      display: jest.fn(),
      promptInput: jest.fn(),
    } as unknown as ConsoleIO;
    mockTransactionRepository = {
      add: jest.fn(),
    } as unknown as TransactionRepository;
    mockAccountRepository = {
      add: jest.fn(),
      getById: jest.fn(),
    } as unknown as AccountRepository;
    inputTransactionsCommand = new InputTransactionCommand(
      mockConsoleIO,
      mockTransactionRepository,
      mockAccountRepository
    );
  });

  it("prompts user to input an option from menu", () => {
    inputTransactionsCommand.execute();
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Please enter transaction details")
    );
    expect(mockConsoleIO.promptInput).toHaveBeenCalledTimes(1);
  });

  it("return if user input blank", () => {
    inputTransactionsCommand.handleInput(" ");
    expect(mockAccountRepository.getById).not.toHaveBeenCalled();
  });

  it("return if user input is empty", () => {
    inputTransactionsCommand.handleInput("");
    expect(mockAccountRepository.getById).not.toHaveBeenCalled();
  });
});
