import { InterestRule } from "../domain/InterestRule";
import { areSameDate } from "../utils/dateUtils";
import { RangeInterestRules } from "../utils/domainUtils";

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

  // Return the most recent one before the date range + all rules in the range
  getInterestRateRulesByDateRange(
    startDate: Date,
    endDate: Date
  ): RangeInterestRules {
    if (this._interestRules.length === 0) {
      return { interestRules: [], lastNearestRuleBeforeRange: null };
    }

    this._interestRules.sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstInMonthIndex = this._interestRules.findIndex(
      (rule) => rule.date >= startDate
    );

    // Use the most recent rule before date range unless the range's first rule starts from startDate
    const isLastMonthRuleRequired =
      !areSameDate(this._interestRules[firstInMonthIndex].date, startDate) &&
      firstInMonthIndex - 1 >= 0;

    const monthRules = this._interestRules.filter(
      (r, index) => index >= firstInMonthIndex && r.date <= endDate
    );
    return {
      interestRules: monthRules,
      lastNearestRuleBeforeRange: isLastMonthRuleRequired
        ? this._interestRules[firstInMonthIndex - 1]
        : null,
    };
  }
}
