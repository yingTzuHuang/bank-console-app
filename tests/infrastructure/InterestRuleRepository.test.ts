import { InterestRule } from "../../src/domain/InterestRule";
import { InterestRuleRepository } from "../../src/infrastructure/InterestRuleRepository";

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
});
