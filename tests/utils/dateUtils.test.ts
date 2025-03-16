import {
  areSameDate,
  convertDateToYYYYMMdd,
  convertYYYYMMddToDate,
  convertYYYYMMToLastDateOfMonth,
  getDateDiffInDays,
  getStartDateOfMonth,
  validateDate,
} from "../../src/utils/dateUtils";

describe("dateUtils", () => {
  it("validate input date format - throws error if input date format is not inYYYYMMdd format", () => {
    expect(() => convertYYYYMMddToDate("abc")).toThrow(
      "Invalid date format! Date should be YYYYMMdd format."
    );
  });

  it("validate input date format - throws error if input date format is correct but invalid date", () => {
    expect(() => convertYYYYMMddToDate("20250231")).toThrow(
      "Invalid date format! Date should be YYYYMMdd format."
    );
  });

  it("return date if input date format is valid", () => {
    const result = convertYYYYMMddToDate("20250222");
    const expectedDate = new Date(2025, 1, 22);
    expect(result).toEqual(expectedDate);
  });

  it("validate input date - throws error if input date format is future date", () => {
    const futureDate = new Date();
    futureDate.setDate(new Date().getDate() + 1);

    expect(() => validateDate(futureDate)).toThrow(
      "Invalid date! Date should not be future date."
    );
  });

  it("validate input date - convert to YYYYMMdd if it's a valid date", () => {
    const expected = "20250131";
    const actual = convertDateToYYYYMMdd(new Date(2025, 0, 31));

    expect(actual).toEqual(expected);
  });

  it("check whether two dates are on the same date", () => {
    const actual = areSameDate(new Date(), new Date());
    expect(actual).toBe(true);
  });

  it("convert YYYYMM to last date of the month", () => {
    const actual = convertYYYYMMToLastDateOfMonth("202502");
    const expected = new Date(2025, 1, 28);
    expect(actual).toEqual(expected);
  });

  it("convert YYYYMM to last date of the month - throws error if month format is not YYYYMM", () => {
    expect(() => convertYYYYMMToLastDateOfMonth("test")).toThrow(
      "Invalid month format! Month should be YYYYMM format."
    );
  });

  it("get start date of the month of the given date", () => {
    const expected = new Date(2025, 1, 1);
    const actual = getStartDateOfMonth(new Date(2025, 1, 15));
    expect(actual).toEqual(expected);
  });

  it("get difference in days for given 2 dates", () => {
    const actual = getDateDiffInDays(
      new Date(2025, 1, 12),
      new Date(2025, 1, 14)
    );

    const actualExcludeEndDate = getDateDiffInDays(
      new Date(2025, 1, 12),
      new Date(2025, 1, 14),
      false
    );
    expect(actual).toBe(3);
    expect(actualExcludeEndDate).toBe(2);
  });
});
