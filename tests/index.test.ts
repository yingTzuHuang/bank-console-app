import { test } from "../src/index";

describe("index", () => {
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.log but don't show the output
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy?.mockRestore();
  });

  it("should show initial test message", () => {
    test();
    expect(consoleSpy).toHaveBeenCalledWith("Inital Test!");
  });
});
