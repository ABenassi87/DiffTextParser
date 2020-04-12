export const DIFF_DELETE = -1;
export const DIFF_INSERT = 1;
export const DIFF_EQUAL = 0;

// Define some regex patterns for matching boundaries.
export const nonAlphaNumericRegex = /[^a-zA-Z0-9]/;
export const whitespaceRegex = /\s/;
export const linebreakRegex = /[\r\n]/;
export const blankLineEndRegex = /\n\r?\n$/;
export const blankLineStartRegex = /^\r?\n\r?\n/;

export type Diff = [number, string];

export class PatchObj {
  diffs: Diff[];
  start1: number | null;
  start2: number | null;
  length1: number;
  length2: number;
}

export interface DiffLinesChars {
  chars1: string;
  chars2: string;
  lineArray: string[];
}
