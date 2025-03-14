import { InterestRule } from "../domain/InterestRule";
import { areSameDate } from "../utils/dateUtils";

export class InterestRuleRepository {
  private _interestRules: InterestRule[];
  constructor() {
    this._interestRules = [];
  }
  add(interestRule: InterestRule) {
    const existingRule = this._interestRules.find((rule) =>
      areSameDate(rule.date, interestRule.date)
    );
    if (existingRule) {
      existingRule.id = interestRule.id;
      existingRule.rate = interestRule.rate;
    } else {
      this._interestRules.push(interestRule);
    }
  }

  get interestRules() {
    return this._interestRules;
  }

  // getInterestRateByDate(date: Date) {
  //   // TODO: Implement this method
  //   throw new Error("Method not implemented.");
  // }
}
