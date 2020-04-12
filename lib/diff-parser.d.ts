import { Diff, DiffLinesChars } from './model';
/**
 * DiffParser Match and Patch
 * Copyright 2018 The diff-match-patch Authors.
 * https://github.com/google/diff-match-patch
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */
/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
export default class DiffParser {
    diffTimeout: number;
    diffEditCost: number;
    matchThreshold: number;
    matchDistance: number;
    patchDeleteThreshold: number;
    patchMargin: number;
    matchMaxBits: number;
    constructor();
    /**
     * Find the differences between two texts.  Simplifies the problem by stripping
     * any common prefix or suffix off the texts before diffing.
     * @param {string} text1 Old string to be diffed.
     * @param {string} text2 New string to be diffed.
     * @param {boolean=} checkLines Optional speedup flag. If present and false,
     *     then don't run a line-level diff first to identify the changed areas.
     *     Defaults to true, which does a faster, slightly less optimal diff.
     * @param {number=} deadLine Optional time when the diff should be complete
     *     by.  Used internally for recursive calls.  Users should set DiffTimeout
     *     instead.
     * @return {Array.<Diff>} Array of diff tuples.
     */
    diffMain(text1: string, text2: string, checkLines?: boolean, deadLine?: number): Diff[];
    /**
     * Find the differences between two texts.  Assumes that the texts do not
     * have any common prefix or suffix.
     * @param {string} text1 Old string to be diffed.
     * @param {string} text2 New string to be diffed.
     * @param {boolean} checkLines Speedup flag.  If false, then don't run a
     *     line-level diff first to identify the changed areas.
     *     If true, then run a faster, slightly less optimal diff.
     * @param {number} deadLine Time when the diff should be complete by.
     * @return {!Array.<!Diff>} Array of diff tuples.
     * @private
     */
    private compute;
    /**
     * Do the two texts share a substring which is at least half the length of the
     * longer text?
     * This speedup can produce non-minimal diffs.
     * @param {string} text1 First string.
     * @param {string} text2 Second string.
     * @return {Array.<string>} Five element Array, containing the prefix of
     *     text1, the suffix of text1, the prefix of text2, the suffix of
     *     text2 and the common middle.  Or null if there was no match.
     * @private
     */
    private halfMatch;
    /**
     * Do a quick line-level diff on both strings, then rediff the parts for
     * greater accuracy.
     * This speedup can produce non-minimal diffs.
     * @param {string} text1 Old string to be diffed.
     * @param {string} text2 New string to be diffed.
     * @param {number} deadLine Time when the diff should be complete by.
     * @return {!Array.<!Diff>} Array of diff tuples.
     * @private
     */
    private lineMode;
    /**
     * Reduce the number of edits by eliminating semantically trivial equalities.
     * @param {!Array.<!Diff>} diffs Array of diff tuples.
     */
    cleanupSemantic(diffs: Diff[]): void;
    /**
     * Reorder and merge like edit sections.  Merge equalities.
     * Any edit section can move as long as it doesn't cross an equality.
     * @param {!Array.<!Diff>} diffs Array of diff tuples.
     */
    cleanupMerge(diffs: Diff[]): void;
    /**
     * Look for single edits surrounded on both sides by equalities
     * which can be shifted sideways to align the edit to a word boundary.
     * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
     * @param {!Array.<!Diff>} diffs Array of diff tuples.
     */
    cleanupSemanticLossless(diffs: Diff[]): void;
    /**
     * Reduce the number of edits by eliminating operationally trivial equalities.
     * @param {!Array.<!Diff>} diffs Array of diff tuples.
     */
    cleanupEfficiency(diffs: Diff[]): void;
    /**
     * Find the 'middle snake' of a diff, split the problem in two
     * and return the recursively constructed diff.
     * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
     * @param {string} text1 Old string to be diffed.
     * @param {string} text2 New string to be diffed.
     * @param {number} deadLine Time at which to bail if not yet complete.
     * @return {!Array.<!Diff>} Array of diff tuples.
     * @private
     */
    bisect(text1: string, text2: string, deadLine: number): Diff[];
    /**
     * Given the location of the 'middle snake', split the diff in two parts
     * and recurse.
     * @param {string} text1 Old string to be diffed.
     * @param {string} text2 New string to be diffed.
     * @param {number} x Index of split point in text1.
     * @param {number} y Index of split point in text2.
     * @param {number} deadline Time at which to bail if not yet complete.
     * @return {!Array.<!Diff>} Array of diff tuples.
     * @private
     */
    private bisectSplit;
    /**
     * loc is a location in text1, compute and return the equivalent location in
     * text2.
     * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
     * @param {!Array.<!Diff>} diffs Array of diff tuples.
     * @param {number} loc Location within text1.
     * @return {number} Location within text2.
     */
    xIndex(diffs: Diff[], loc: number): number;
    /**
     * Convert a diff array into a pretty HTML report.
     * @param {!Diff>} diffs Array of diff tuples.
     * @return {string} HTML representation.
     */
    prettyHtml(diffs: Diff[]): string;
    /**
     * Compute and return the source text (all equalities and deletions).
     * @param {!Diff>} diffs Array of diff tuples.
     * @return {string} Source text.
     */
    text1(diffs: Diff[]): string;
    /**
     * Compute and return the destination text (all equalities and insertions).
     * @param {!Diff>} diffs Array of diff tuples.
     * @return {string} Destination text.
     */
    text2(diffs: Diff[]): string;
    /**
     * Compute the Levenshtein distance; the number of inserted, deleted or
     * substituted characters.
     * @param {!Array.<!Diff>} diffs Array of diff tuples.
     * @return {number} Number of changes.
     */
    levenshtein(diffs: Diff[]): number;
    /**
     * Crush the diff into an encoded string which describes the operations
     * required to transform text1 into text2.
     * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
     * Operations are tab-separated.  Inserted text is escaped using %xx notation.
     * @param {!Array.<!Diff>} diffs Array of diff tuples.
     * @return {string} Delta text.
     */
    toDelta(diffs: Diff[]): string;
    /**
     * Given the original text1, and an encoded string which describes the
     * operations required to transform text1 into text2, compute the full diff.
     * @param {string} text1 Source string for the diff.
     * @param {string} delta Delta text.
     * @return {!Array.<!Diff>} Array of diff tuples.
     * @throws {!Error} If invalid input.
     */
    fromDelta(text1: string, delta: string): Diff[];
    /**
     * Split two texts into an array of strings.  Reduce the texts to a string of
     * hashes where each Unicode character represents one line.
     * @param {string} text1 First string.
     * @param {string} text2 Second string.
     * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
     *     An object containing the encoded text1, the encoded text2 and
     *     the array of unique strings.
     *     The zeroth element of the array of unique strings is intentionally blank.
     * @private
     */
    linesToChars(text1: string, text2: string): DiffLinesChars;
    /**
     * Rehydrate the text in a diff from a string of line hashes to real lines of
     * text.
     * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
     * @param {!Array.<string>} lineArray Array of unique strings.
     * @private
     */
    charsToLines(diffs: Diff[], lineArray: string[]): void;
}
