import { InterestRule } from "../../src/domain/InterestRule";
import { InterestRuleRepository } from "../../src/infrastructure/InterestRuleRepository";
import { RangeInterestRules } from "../../src/utils/domainUtils";

describe("InterestRuleRepository", () => {
  let interestRuleRepo: InterestRuleRepository;
  beforeEach(() => {
    interestRuleRepo = new InterestRuleRepository();
  });

  it("add interest rule if no rule on same date", () => {
    expect(interestRuleRepo.interestRules.length).toBe(0);
    const interestRule = new InterestRule("Rule001", new Date(), 2);
    interestRuleRepo.add(interestRule);
    expect(interestRuleRepo.interestRules[0]).toBe(interestRule);
  });

  it("update interest rule if rule exists on same date", () => {
    expect(interestRuleRepo.interestRules.length).toBe(0);
    const interestRule1 = new InterestRule("Rule001", new Date(), 2);
    interestRuleRepo.add(interestRule1);

    const interestRule2 = new InterestRule("Rule002", new Date(), 3);
    interestRuleRepo.add(interestRule2);

    expect(interestRuleRepo.interestRules.length).toBe(1);
    expect(interestRuleRepo.interestRules[0].id).toEqual(interestRule2.id);
    expect(interestRuleRepo.interestRules[0].rate).toEqual(interestRule2.rate);
  });

  it("returns ranges applicable interest rules - if first rule in range is same as start date, lastNearestRuleBeforeRange is not required.", () => {
    const interestRule1 = new InterestRule("Rule001", new Date(2023, 2, 1), 2);
    interestRuleRepo.add(interestRule1);

    const interestRule3 = new InterestRule("Rule002", new Date(2023, 5, 1), 3);
    interestRuleRepo.add(interestRule3);

    const interestRule2 = new InterestRule("Rule001", new Date(2023, 3, 10), 4);
    interestRuleRepo.add(interestRule2);

    const expected: RangeInterestRules = {
      interestRules: [interestRule3],
      lastNearestRuleBeforeRange: null,
    };

    const actual = interestRuleRepo.getInterestRateRulesByDateRange(
      new Date(2023, 5, 1),
      new Date(2023, 5, 30)
    );

    expect(actual).toEqual(expected);
  });

  it("returns ranges applicable interest rules - if first rule in range is different from start date, lastNearestRuleBeforeRange should return value if there is any.", () => {
    const interestRule1 = new InterestRule("Rule001", new Date(2023, 2, 1), 2);
    interestRuleRepo.add(interestRule1);
    const interestRule3 = new InterestRule("Rule002", new Date(2023, 5, 2), 3);
    interestRuleRepo.add(interestRule3);
    const interestRule2 = new InterestRule("Rule001", new Date(2023, 3, 10), 4);
    interestRuleRepo.add(interestRule2);

    const expectedWithLastNearest: RangeInterestRules = {
      interestRules: [interestRule3],
      lastNearestRuleBeforeRange: interestRule2,
    };

    const actualWithLastNearest =
      interestRuleRepo.getInterestRateRulesByDateRange(
        new Date(2023, 5, 1),
        new Date(2023, 5, 30)
      );

    const expectedWithoutLastNearest: RangeInterestRules = {
      interestRules: [interestRule1],
      lastNearestRuleBeforeRange: null,
    };

    const actualWithoutLastNearest =
      interestRuleRepo.getInterestRateRulesByDateRange(
        new Date(2023, 1, 1),
        new Date(2023, 2, 1)
      );

    expect(actualWithLastNearest).toEqual(expectedWithLastNearest);
    expect(actualWithoutLastNearest).toEqual(expectedWithoutLastNearest);
  });

  it("returns empty ranges applicable interest rules - if no interest rules defined.", () => {
    const expected: RangeInterestRules = {
      interestRules: [],
      lastNearestRuleBeforeRange: null,
    };

    const actual = interestRuleRepo.getInterestRateRulesByDateRange(
      new Date(2023, 5, 1),
      new Date(2023, 5, 30)
    );

    expect(actual).toEqual(expected);
  });
});
