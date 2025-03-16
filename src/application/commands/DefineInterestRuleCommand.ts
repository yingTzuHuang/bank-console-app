import { ConsoleIO } from "../../presentation/ConsoleIO";
import { InterestRuleRepository } from "../../infrastructure/InterestRuleRepository";
import { Command } from "./Command";
import { InvalidInputError } from "../../errors/InvalidInputError";
import {
  convertDateToYYYYMMdd,
  convertYYYYMMddToDate,
  validateDate,
} from "../../utils/dateUtils";
import { InterestRule } from "../../domain/InterestRule";

export default class DefineInterestRuleCommand extends Command {
  protected readonly promptMessage: string = `Please enter interest rules details in <Date> <RuleId> <Rate in %> format
(or enter blank to go back to main menu)`;
  constructor(
    consoleIO: ConsoleIO,
    private interestRuleRepository: InterestRuleRepository
  ) {
    super(consoleIO);
  }

  handleInput(input: string) {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      return;
    }

    const interestRuleDetails = trimmedInput.split(" ");
    if (interestRuleDetails.length !== 3) {
      throw new InvalidInputError(
        "Invalid input format! Please enter interest rules details in <Date> <RuleId> <Rate in %> format."
      );
    }

    const [dateString, ruleId, rateString] = interestRuleDetails;

    const date = convertYYYYMMddToDate(dateString);
    validateDate(date);

    const rate = this.convertRateStringToNumber(rateString);
    this.validateRate(rate);

    const newInterestRule = new InterestRule(ruleId, date, rate);
    this.interestRuleRepository.add(newInterestRule);
    this.showAllInterestRules();
  }

  private validateRate(rate: number) {
    if (rate <= 0 || rate >= 100) {
      throw new InvalidInputError(
        "Invalid rate! Interest rate should be greater than 0 and less than 100"
      );
    }
  }

  // TODO: Move conversion of input to InterestRule object part
  private convertRateStringToNumber(rateString: string) {
    const trimmedRate = rateString.trim();
    const rate = Number(trimmedRate);
    if (isNaN(rate)) {
      throw new InvalidInputError(
        "Invalid rate! Interest rate must be a number."
      );
    }
    // Assumption rate only keep up to 2 decimal places to be consistent as display
    return Number(rate.toFixed(2));
  }

  // TODO: Make printing result consistent by put at one place
  private showAllInterestRules() {
    this.consoleIO.display(`-----------------------------------`);
    this.consoleIO.display("| Date | Rule Id | Rate(%) |");
    for (const rule of this.interestRuleRepository.interestRules) {
      const formattedDate = convertDateToYYYYMMdd(rule.date);
      const formattedRate = rule.rate.toFixed(2);
      this.consoleIO.display(
        `| ${formattedDate} | ${rule.id} | ${formattedRate} |`
      );
    }
    this.consoleIO.display(`-----------------------------------`);
  }
}
