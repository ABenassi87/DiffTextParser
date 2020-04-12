export declare const DIFF_DELETE = -1;
export declare const DIFF_INSERT = 1;
export declare const DIFF_EQUAL = 0;
export declare const nonAlphaNumericRegex: RegExp;
export declare const whitespaceRegex: RegExp;
export declare const linebreakRegex: RegExp;
export declare const blankLineEndRegex: RegExp;
export declare const blankLineStartRegex: RegExp;
export declare type Diff = [number, string];
export declare class PatchObj {
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
