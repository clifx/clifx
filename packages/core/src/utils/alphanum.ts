const Digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;

type Digit = typeof Digits[number];

const UppercaseAlphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
] as const;

type UppercaseLetter = typeof UppercaseAlphabet[number];

const LowercaseAlphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
] as const;

type LowercaseLetter = typeof LowercaseAlphabet[number];

const alphaNumeric = new Set([
  ...Digits,
  ...LowercaseAlphabet,
  ...UppercaseAlphabet,
]);

export type AlphaNum = Digit | LowercaseLetter | UppercaseLetter;

export const isAlphaNumeric = (char: string): char is AlphaNum => {
  return alphaNumeric.has(char as AlphaNum);
};
