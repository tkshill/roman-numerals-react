import { Result, ok, err } from "./Result";

type ErrorName = "NanError" | "FloatError" | "RangeError" | "ParseError";

type IError = {
  name: ErrorName;
};

type NanError = IError & { name: "NanError" };
type FloatError = IError & { name: "FloatError" };
type RangeError = IError & { name: "RangeError" };
type ParseError = IError & { name: "ParseError" };

type Message = { message: string };

type Error =
  | (NanError & Message)
  | (FloatError & Message)
  | (RangeError & Message)
  | (ParseError & Message);

const nanError: Error = {
  name: "NanError",
  message: "Value is not a number.",
};
const floatError: Error = {
  name: "FloatError",
  message: "Value is not an integer.",
};
const rangeError: Error = {
  name: "RangeError",
  message: "Value must be between 1 and 3999",
};
const parseError: Error = {
  name: "ParseError",
  message: "Value is not a valid Roman Numeral",
};

type RomanNumeralDigit =
  | "I"
  | "II"
  | "III"
  | "IIII"
  | "IV"
  | "V"
  | "IX"
  | "X"
  | "XX"
  | "XXX"
  | "XXXX"
  | "XL"
  | "L"
  | "XC"
  | "C"
  | "CC"
  | "CCC"
  | "CCCC"
  | "CD"
  | "D"
  | "CM"
  | "M"
  | "MM"
  | "MMM";

const romanDigitToInt = (r: RomanNumeralDigit): number => {
  switch (r) {
    case "I":
      return 1;
    case "II":
      return 2;
    case "III":
      return 3;
    case "IIII":
    case "IV":
      return 4;
    case "V":
      return 5;
    case "IX":
      return 9;
    case "X":
      return 10;
    case "XX":
      return 20;
    case "XXX":
      return 30;
    case "XXXX":
    case "XL":
      return 40;
    case "L":
      return 50;
    case "XC":
      return 90;
    case "C":
      return 100;
    case "CC":
      return 200;
    case "CCC":
      return 300;
    case "CCCC":
    case "CD":
      return 400;
    case "D":
      return 500;
    case "CM":
      return 900;
    case "M":
      return 1000;
    case "MM":
      return 2000;
    case "MMM":
      return 3000;
  }
};

const stringToRomanDigits = (input: string): RomanNumeralDigit[] => {
  const result: RomanNumeralDigit[] = [];
  while (input.length > 0) {
    if (input.slice(0, 4) === "IIII") {
      result.push("IIII");
      input = input.slice(4);
    } else if (input.slice(0, 4) === "XXXX") {
      result.push("XXXX");
      input = input.slice(4);
    } else if (input.slice(0, 4) === "CCCC") {
      result.push("CCCC");
      input = input.slice(4);
    } else if (input.slice(0, 3) === "III") {
      result.push("III");
      input = input.slice(3);
    } else if (input.slice(0, 3) === "XXX") {
      result.push("XXX");
      input = input.slice(3);
    } else if (input.slice(0, 3) === "CCC") {
      result.push("CCC");
      input = input.slice(3);
    } else if (input.slice(0, 3) === "MMM") {
      result.push("MMM");
      input = input.slice(3);
    } else if (input.slice(0, 2) === "II") {
      result.push("II");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "XX") {
      result.push("XX");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "CC") {
      result.push("CC");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "MM") {
      result.push("MM");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "IV") {
      result.push("IV");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "IX") {
      result.push("IX");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "XL") {
      result.push("XL");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "XC") {
      result.push("XC");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "CD") {
      result.push("CD");
      input = input.slice(2);
    } else if (input.slice(0, 2) === "CM") {
      result.push("CM");
      input = input.slice(2);
    } else if (input.slice(0, 1) === "I") {
      result.push("I");
      input = input.slice(1);
    } else if (input.slice(0, 1) === "V") {
      result.push("V");
      input = input.slice(1);
    } else if (input.slice(0, 1) === "X") {
      result.push("X");
      input = input.slice(1);
    } else if (input.slice(0, 1) === "L") {
      result.push("L");
      input = input.slice(1);
    } else if (input.slice(0, 1) === "C") {
      result.push("C");
      input = input.slice(1);
    } else if (input.slice(0, 1) === "D") {
      result.push("D");
      input = input.slice(1);
    } else if (input.slice(0, 1) === "M") {
      result.push("M");
      input = input.slice(1);
    } else {
      throw new Error("Cannot parse string");
    }
  }
  return result;
};

// cant use replaceall apparently. incompatible with some javascript versions
const toString = (input: RomanNumeral): string =>
  Array(input.value)
    .fill("I")
    .join("")
    .replace(/IIIII/gi, "V")
    .replace(/VV/gi, "X")
    .replace(/XXXXX/gi, "L")
    .replace(/LL/gi, "C")
    .replace(/CCCCC/gi, "D")
    .replace(/DD/gi, "M")
    .replace(/IIII/gi, "IV")
    .replace(/XXXX/gi, "XL")
    .replace(/CCCC/gi, "CD")
    .replace(/VIV/gi, "IX")
    .replace(/LXL/gi, "XC")
    .replace(/DCD/gi, "CM");

const ROMANREGEX = /^M{0,3}(CM|CD|D?C{0,4})(XC|XL|L?X{0,4})(IX|IV|V?I{0,4})$/;

export default class RomanNumeral {
  private constructor(readonly value: number) {}

  asInt = () => this.value;
  asString = () => toString(this);

  static init = new RomanNumeral(1);

  static fromInt = (input: number): Result<RomanNumeral, Error[]> => {
    const nanErr = isNaN(input) ? [nanError] : [];
    const floatErr = !Number.isInteger(input) ? [floatError] : [];
    const rangeErr = input < 1 || input > 3999 ? [rangeError] : [];

    const errors = nanErr.concat(floatErr.concat(rangeErr));

    return errors.length === 0 ? ok(new RomanNumeral(input)) : err(errors);
  };

  static fromString = (input: string): Result<RomanNumeral, Error[]> => {
    if (input.match(ROMANREGEX) && input !== "") {
      const int = stringToRomanDigits(input)
        .map(romanDigitToInt)
        .reduce((a, b) => a + b);

      return ok(new RomanNumeral(int));
    } else {
      return err([parseError]);
    }
  };
}
