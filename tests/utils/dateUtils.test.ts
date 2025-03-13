import {
  convertDateToYYYYMMdd,
  convertYYYYMMddToDate,
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

  it("validate input date - throws error if input date format is future date", () => {
    const expected = "20250131";
    const actual = convertDateToYYYYMMdd(new Date(2025, 0, 31));

    expect(actual).toEqual(expected);
  });
});
