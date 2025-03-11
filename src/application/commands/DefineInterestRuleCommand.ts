import { ConsoleIO } from "../../presentation/ConsoleIO";
import { InterestRuleRepository } from "../../infrastructure/InterestRuleRepository";
import { Command } from "./Command";

export class DefineInterestRuleCommand implements Command {
  constructor(
    private interestRuleRepository: InterestRuleRepository,
    private consoleIO: ConsoleIO
  ) {}

  execute() {
    throw new Error("Not implemented");
  }
}
