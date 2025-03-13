import { ConsoleIO } from "../../presentation/ConsoleIO";
import { InterestRuleRepository } from "../../infrastructure/InterestRuleRepository";
import { Command } from "./Command";

export default class DefineInterestRuleCommand extends Command {
  protected readonly promptMessage: string = "";
  constructor(
    consoleIO: ConsoleIO,
    private interestRuleRepository: InterestRuleRepository
  ) {
    super(consoleIO);
  }

  handleInput(input: string) {
    throw new Error("Not implemented");
  }
}
