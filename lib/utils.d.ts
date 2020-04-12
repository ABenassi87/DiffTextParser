export declare function commonPrefix(text1: any, text2: any): number;
/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
export declare function commonSuffix(text1: any, text2: any): number;
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
export declare function halfMatchI(longText: string, shortText: string, i: number): string[];
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
export declare function linesToCharsMunge(text: string, lineArray: string[], lineHash: any, maxLines: number): string;
/**
 * Given two strings, compute a score representing whether the internal
 * boundary falls on logical boundaries.
 * Scores range from 6 (best) to 0 (worst).
 * Closure, but does not reference any external variables.
 * @param {string} one First string.
 * @param {string} two Second string.
 * @return {number} The score.
 */
export declare function cleanupSemanticScore(one: string, two: string): number;
/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
export declare function commonOverlap(text1: string, text2: string): number;
