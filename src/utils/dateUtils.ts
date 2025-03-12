import { InvalidInputError } from "../errors/InvalidInputError";

export const convertYYYYMMddToDate = (dateString: string): Date => {
  const invalidYYYYMMddFormatMessage =
    "Invalid date format! Date should be YYYYMMdd format.";
  const regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateString)) {
    throw new InvalidInputError(invalidYYYYMMddFormatMessage);
  }

  // Extract year, month, and day from the string
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1; // Months are 0-indexed
  const day = parseInt(dateString.substring(6, 8), 10);

  // Create a Date object and verify its components
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    throw new InvalidInputError(invalidYYYYMMddFormatMessage);
  }
  return date;
};

const isFutureDate = (date: Date): boolean => {
  const currentDate = new Date();
  return date > currentDate;
};

export const validateDate = (date: Date) => {
  if (isFutureDate(date)) {
    throw new InvalidInputError("Invalid date format!");
  }
};

export const convertDateToYYYYMMdd = (date: Date): string => {
  const year = date.getFullYear();
  // getMonth returns 0-indexed month
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
};

// export const areSameDate = (date1: Date, date2: Date) =>
//   date1.getFullYear() === date2.getFullYear() &&
//   date1.getMonth() === date2.getMonth() &&
//   date1.getDate() === date2.getDate();

// export const getLastDayOfMonth = (date: Date) =>
//   new Date(
//     date.getFullYear(),
//     date.getMonth() + 1, // +1 because months are 0-indexed
//     0
//   );
