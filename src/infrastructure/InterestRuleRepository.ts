import { InterestRule } from "../domain/InterestRule";

export class InterestRuleRepository {
  private interestRules: InterestRule[];
  constructor() {
    this.interestRules = [];
  }
  add(interestRule: InterestRule) {
    this.interestRules.push(interestRule);
  }
  getInterestRateByDate(date: Date) {
    // TODO: Implement this method
    throw new Error("Method not implemented.");
  }
}
