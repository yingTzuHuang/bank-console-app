import InputTransactionCommand from "../../src/application/commands/InputTransactionCommand";
import { Account } from "../../src/domain/Account";
import { Transaction } from "../../src/domain/Transaction";
import { AccountRepository } from "../../src/infrastructure/AccountRepository";
import { TransactionRepository } from "../../src/infrastructure/TransactionRepository";
import { ConsoleIO } from "../../src/presentation/ConsoleIO";

describe("InputTransactionsCommand", () => {
  const mockAccountRepoGetById = jest.fn();
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
      getById: mockAccountRepoGetById,
    } as unknown as AccountRepository;
    inputTransactionsCommand = new InputTransactionCommand(
      mockConsoleIO,
      mockTransactionRepository,
      mockAccountRepository
    );
  });

  it("prompts user to input an option from menu", async () => {
    await inputTransactionsCommand.promptInput();
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

  it("validate input format - throws error if input format is invalid", () => {
    expect(() => inputTransactionsCommand.handleInput("test")).toThrow(
      "Invalid input format! Please enter transaction details in <Date> <Account> <Type> <Amount> format."
    );
  });

  it("validateType - throws error if input type is invalid", () => {
    expect(() =>
      inputTransactionsCommand.handleInput("20250303 123 456 789")
    ).toThrow(
      "Invalid transaction type! Please use D for deposite and W for withdraw."
    );
  });

  it("validateAmount - throws error if input amount is not a number", () => {
    expect(() =>
      inputTransactionsCommand.handleInput("20250303 ACCabc W notNumber")
    ).toThrow("Invalid amount! Amount must be a number.");
  });

  it("validateAmount - throws error if input amount is not greater than 0", () => {
    expect(() =>
      inputTransactionsCommand.handleInput("20250303 ACCabc W 0")
    ).toThrow("Invalid amount! Amount must be greater than 0.");
  });

  it("validateAmount - input amount decimals are allowed up to 2 decimal places ", () => {
    expect(() =>
      inputTransactionsCommand.handleInput("20250303 ACCabc W 0.001")
    ).toThrow("Invalid amount! Amount must be up to 2 decimal places.");
  });

  it("create new account if account id doesn't exist", () => {
    inputTransactionsCommand.handleInput("20250303 ACCabc D 1");

    expect(mockAccountRepository.add).toHaveBeenCalled();
  });

  it("uses account if account id already exists", () => {
    const mockAccount = {
      id: "Acc001",
      balance: 100,
      deposit: jest.fn(),
      transactions: [],
    };
    mockAccountRepoGetById.mockReturnValueOnce(mockAccount);
    inputTransactionsCommand.handleInput("20250303 mockAccount D 1");

    expect(mockAccountRepository.add).not.toHaveBeenCalled();
  });

  it("deposit - add new transaction", () => {
    const mockAccount = {
      id: "Acc001",
      balance: 100,
      deposit: jest.fn(),
      withdraw: jest.fn(),
      transactions: [],
    };
    mockAccountRepoGetById.mockReturnValueOnce(mockAccount);
    inputTransactionsCommand.handleInput("20250303 mockAccount D 1");

    expect(mockAccount.deposit).toHaveBeenCalledTimes(1);
    expect(mockAccount.withdraw).not.toHaveBeenCalled();
    expect(mockTransactionRepository.add).toHaveBeenCalledTimes(1);
  });

  it("withdraw - add new transaction", () => {
    const mockAccount = {
      id: "Acc001",
      balance: 100,
      deposit: jest.fn(),
      withdraw: jest.fn(),
      transactions: [],
    };
    mockAccountRepoGetById.mockReturnValueOnce(mockAccount);
    inputTransactionsCommand.handleInput("20250303 mockAccount W 1");

    expect(mockAccount.withdraw).toHaveBeenCalledTimes(1);
    expect(mockAccount.deposit).not.toHaveBeenCalled();
    expect(mockTransactionRepository.add).toHaveBeenCalledTimes(1);
  });

  it("show account's all transactions", () => {
    const mockTransactions = [
      {
        date: new Date(2025, 2, 2),
        id: "20250302-01",
        type: "D",
        amount: 20,
      },
    ];
    const mockNewTransaction = new Transaction(
      new Account("Acc001"),
      new Date(2025, 2, 3),
      "W",
      1,
      19
    );
    mockNewTransaction.id = "20250303-01";
    const mockAccount = {
      id: "Acc001",
      balance: 20,
      deposit: jest.fn(),
      transactions: mockTransactions,
      withdraw: jest.fn().mockImplementationOnce(() => {
        mockTransactions.push(mockNewTransaction);
      }),
    } as unknown as Account;

    mockAccountRepoGetById.mockReturnValueOnce(mockAccount);
    inputTransactionsCommand.handleInput("20250303 Acc001 W 1");

    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("Account: Acc001")
    );
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("| Date | Txn Id | Type | Amount |")
    );
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("| 20250302 | 20250302-01 | D | 20.00 |")
    );
    expect(mockConsoleIO.display).toHaveBeenCalledWith(
      expect.stringContaining("| 20250303 | 20250303-01 | W | 1.00 |")
    );
  });
});
