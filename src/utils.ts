/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
import {
  blankLineEndRegex,
  blankLineStartRegex,
  linebreakRegex,
  nonAlphaNumericRegex,
  whitespaceRegex,
} from './model';

export function commonPrefix(text1, text2): number {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: https://neil.fraser.name/news/2007/10/09/
  let pointerMin = 0;
  let pointerMax = Math.min(text1.length, text2.length);
  let pointerMid = pointerMax;
  let pointerStart = 0;
  while (pointerMin < pointerMid) {
    if (text1.substring(pointerStart, pointerMid) == text2.substring(pointerStart, pointerMid)) {
      pointerMin = pointerMid;
      pointerStart = pointerMin;
    } else {
      pointerMax = pointerMid;
    }
    pointerMid = Math.floor((pointerMax - pointerMin) / 2 + pointerMin);
  }
  return pointerMid;
}

/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
export function commonSuffix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: https://neil.fraser.name/news/2007/10/09/
  let pointerMin = 0;
  let pointerMax = Math.min(text1.length, text2.length);
  let pointerMid = pointerMax;
  let pointerEnd = 0;
  while (pointerMin < pointerMid) {
    if (
      text1.substring(text1.length - pointerMid, text1.length - pointerEnd) ==
      text2.substring(text2.length - pointerMid, text2.length - pointerEnd)
    ) {
      pointerMin = pointerMid;
      pointerEnd = pointerMin;
    } else {
      pointerMax = pointerMid;
    }
    pointerMid = Math.floor((pointerMax - pointerMin) / 2 + pointerMin);
  }
  return pointerMid;
}

/**
 * Does a substring of shortText exist within longText such that the substring
 * is at least half the length of longText?
 * Closure, but does not reference any external variables.
 * @param {string} longText Longer string.
 * @param {string} shortText Shorter string.
 * @param {number} i Start index of quarter length substring within longText.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     longText, the suffix of longText, the prefix of shortText, the suffix
 *     of shortText and the common middle.  Or null if there was no match.
 */
export function halfMatchI(longText: string, shortText: string, i: number): string[] {
  // Start with a 1/4 length substring at position i as a seed.
  const seed = longText.substring(i, i + Math.floor(longText.length / 4));
  let j = -1;
  let bestCommon = '';
  let bestLongTextA, bestLongTextB, bestShortTextA, bestShortTextB;
  while ((j = shortText.indexOf(seed, j + 1)) != -1) {
    const prefixLength = commonPrefix(longText.substring(i), shortText.substring(j));
    const suffixLength = commonSuffix(longText.substring(0, i), shortText.substring(0, j));
    if (bestCommon.length < suffixLength + prefixLength) {
      bestCommon = shortText.substring(j - suffixLength, j) + shortText.substring(j, j + prefixLength);
      bestLongTextA = longText.substring(0, i - suffixLength);
      bestLongTextB = longText.substring(i + prefixLength);
      bestShortTextA = shortText.substring(0, j - suffixLength);
      bestShortTextB = shortText.substring(j + prefixLength);
    }
  }
  if (bestCommon.length * 2 >= longText.length) {
    return [bestLongTextA, bestLongTextB, bestShortTextA, bestShortTextB, bestCommon];
  } else {
    return null;
  }
}

/**
 * Split a text into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * Modifies linearray and linehash through being a closure.
 * @param {string} text String to encode.
 * @param {!Array<string>} lineArray
 * @param {any} lineHash
 * @param maxLines
 * @return {string} Encoded string.
 */
export function linesToCharsMunge(text: string, lineArray: string[], lineHash: any, maxLines: number): string {
  let chars = '';
  // Walk the text, pulling out a substring for each line.
  // text.split('\n') would would temporarily double our memory footprint.
  // Modifying text would create many large strings to garbage collect.
  let lineStart = 0;
  let lineEnd = -1;
  // Keeping our own length variable is faster than looking it up.
  let lineArrayLength = lineArray.length;
  while (lineEnd < text.length - 1) {
    lineEnd = text.indexOf('\n', lineStart);
    if (lineEnd == -1) {
      lineEnd = text.length - 1;
    }
    let line = text.substring(lineStart, lineEnd + 1);

    if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== undefined) {
      chars += String.fromCharCode(lineHash[line]);
    } else {
      if (lineArrayLength == maxLines) {
        // Bail out at 65535 because
        // String.fromCharCode(65536) == String.fromCharCode(0)
        line = text.substring(lineStart);
        lineEnd = text.length;
      }
      chars += String.fromCharCode(lineArrayLength);
      lineHash[line] = lineArrayLength;
      lineArray[lineArrayLength++] = line;
    }
    lineStart = lineEnd + 1;
  }
  return chars;
}

/**
 * Given two strings, compute a score representing whether the internal
 * boundary falls on logical boundaries.
 * Scores range from 6 (best) to 0 (worst).
 * Closure, but does not reference any external variables.
 * @param {string} one First string.
 * @param {string} two Second string.
 * @return {number} The score.
 */
export function cleanupSemanticScore(one: string, two: string): number {
  if (!one || !two) {
    // Edges are the best.
    return 6;
  }

  // Each port of this function behaves slightly differently due to
  // subtle differences in each language's definition of things like
  // 'whitespace'.  Since this function's purpose is largely cosmetic,
  // the choice has been made to use each language's native features
  // rather than force total conformity.
  const char1 = one.charAt(one.length - 1);
  const char2 = two.charAt(0);
  const nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex);
  const nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex);
  const whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex);
  const whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex);
  const lineBreak1 = whitespace1 && char1.match(linebreakRegex);
  const lineBreak2 = whitespace2 && char2.match(linebreakRegex);
  const blankLine1 = lineBreak1 && one.match(blankLineEndRegex);
  const blankLine2 = lineBreak2 && two.match(blankLineStartRegex);

  if (blankLine1 || blankLine2) {
    // Five points for blank lines.
    return 5;
  } else if (lineBreak1 || lineBreak2) {
    // Four points for line breaks.
    return 4;
  } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
    // Three points for end of sentences.
    return 3;
  } else if (whitespace1 || whitespace2) {
    // Two points for whitespace.
    return 2;
  } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
    // One point for non-alphanumeric.
    return 1;
  }
  return 0;
}

/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
export function commonOverlap(text1: string, text2: string): number {
  // Cache the text lengths to prevent multiple calls.
  const text1_length = text1.length;
  const text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  const text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: https://neil.fraser.name/news/2010/11/04/
  let best = 0;
  let length = 1;
  while (true) {
    const pattern = text1.substring(text_length - length);
    const found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
}
