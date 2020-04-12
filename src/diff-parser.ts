import { Diff, DIFF_DELETE, DIFF_EQUAL, DIFF_INSERT, DiffLinesChars } from './model';
import * as utils from './utils';
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
  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  diffTimeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  diffEditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  matchThreshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  matchDistance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that MatchThreshold controls how closely the
  // end points of a delete need to match.
  patchDeleteThreshold = 0.5;
  // Chunk size for context length.
  patchMargin = 4;

  // The number of bits in an int.
  matchMaxBits = 32;

  constructor() {}

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
  public diffMain(text1: string, text2: string, checkLines?: boolean, deadLine?: number): Diff[] {
    // Set a deadline by which time the diff must be complete.
    if (typeof deadLine == 'undefined') {
      if (this.diffTimeout <= 0) {
        deadLine = Number.MAX_VALUE;
      } else {
        deadLine = new Date().getTime() + this.diffTimeout * 1000;
      }
    }
    const deadline = deadLine;

    // Check for null inputs.
    if (text1 == null || text2 == null) {
      throw new Error('Null input. (diff_main)');
    }

    // Check for equality (speedup).
    if (text1 == text2) {
      if (text1) {
        const diff: Diff = [DIFF_EQUAL, text1];
        return [diff];
      }
      return [];
    }

    if (typeof checkLines == 'undefined') {
      checkLines = true;
    }
    const checklines = checkLines;

    // Trim off common prefix (speedup).
    let commonLength = utils.commonPrefix(text1, text2);
    let commonPrefix = text1.substring(0, commonLength);
    text1 = text1.substring(commonLength);
    text2 = text2.substring(commonLength);

    // Trim off common suffix (speedup).
    commonLength = utils.commonSuffix(text1, text2);
    const commonSuffix = text1.substring(text1.length - commonLength);
    text1 = text1.substring(0, text1.length - commonLength);
    text2 = text2.substring(0, text2.length - commonLength);

    // Compute the diff on the middle block.
    const diffs: Diff[] = this.compute(text1, text2, checklines, deadline);

    // Restore the prefix and suffix.
    if (commonPrefix) {
      diffs.unshift([DIFF_EQUAL, commonPrefix]);
    }
    if (commonSuffix) {
      diffs.push([DIFF_EQUAL, commonSuffix]);
    }
    this.cleanupMerge(diffs);
    return diffs;
  }

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
  private compute(text1: string, text2: string, checkLines: boolean, deadLine: number): Diff[] {
    let diffs: Diff[] = [];

    if (!text1) {
      // Just add some text (speedup).
      return [[DIFF_INSERT, text2]];
    }

    if (!text2) {
      // Just delete some text (speedup).
      return [[DIFF_DELETE, text1]];
    }

    const longText = text1.length > text2.length ? text1 : text2;
    const shortText = text1.length > text2.length ? text2 : text1;
    let i = longText.indexOf(shortText);
    if (i != -1) {
      // Shorter text is inside the longer text (speedup).
      diffs = [
        [DIFF_INSERT, longText.substring(0, i)],
        [DIFF_EQUAL, shortText],
        [DIFF_INSERT, longText.substring(i + shortText.length)],
      ];
      // Swap insertions for deletions if diff is reversed.
      if (text1.length > text2.length) {
        diffs[0][0] = diffs[2][0] = DIFF_DELETE;
      }
      return diffs;
    }

    if (shortText.length == 1) {
      // Single character string.
      // After the previous speedup, the character can't be an equality.
      return [
        [DIFF_DELETE, text1],
        [DIFF_INSERT, text2],
      ];
    }

    // Check to see if the problem can be split in two.
    const hm = this.halfMatch(text1, text2);
    if (hm) {
      // A half-match was found, sort out the return data.
      const text1A = hm[0];
      const text1B = hm[1];
      const text2A = hm[2];
      const text2B = hm[3];
      const midCommon = hm[4];
      // Send both pairs off for separate processing.
      const diffsA = this.diffMain(text1A, text2A, checkLines, deadLine);
      const diffsB = this.diffMain(text1B, text2B, checkLines, deadLine);
      // Merge the results.
      return diffsA.concat([[DIFF_EQUAL, midCommon]], diffsB);
    }

    if (checkLines && text1.length > 100 && text2.length > 100) {
      return this.lineMode(text1, text2, deadLine);
    }

    return this.bisect(text1, text2, deadLine);
  }

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
  private halfMatch(text1: string, text2: string): string[] {
    if (this.diffTimeout <= 0) {
      // Don't risk returning a non-optimal diff if we have unlimited time.
      return null;
    }
    const longtext = text1.length > text2.length ? text1 : text2;
    const shorttext = text1.length > text2.length ? text2 : text1;
    if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
      return null; // Pointless.
    }

    // First check if the second quarter is the seed for a half-match.
    const hm1 = utils.halfMatchI(longtext, shorttext, Math.ceil(longtext.length / 4));
    // Check again based on the third quarter.
    const hm2 = utils.halfMatchI(longtext, shorttext, Math.ceil(longtext.length / 2));
    let hm;
    if (!hm1 && !hm2) {
      return null;
    } else if (!hm2) {
      hm = hm1;
    } else if (!hm1) {
      hm = hm2;
    } else {
      // Both matched.  Select the longest.
      hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
    }

    // A half-match was found, sort out the return data.
    let text1A, text1B, text2A, text2B;
    if (text1.length > text2.length) {
      text1A = hm[0];
      text1B = hm[1];
      text2A = hm[2];
      text2B = hm[3];
    } else {
      text2A = hm[0];
      text2B = hm[1];
      text1A = hm[2];
      text1B = hm[3];
    }
    const midCommon = hm[4];
    return [text1A, text1B, text2A, text2B, midCommon];
  }

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
  private lineMode(text1: string, text2: string, deadLine: number): Diff[] {
    // Scan the text on a line-by-line basis first.
    const a = this.linesToChars(text1, text2);
    text1 = a.chars1;
    text2 = a.chars2;
    const lineArray = a.lineArray;

    const diffs = this.diffMain(text1, text2, false, deadLine);

    // Convert the diff back to original text.
    this.charsToLines(diffs, lineArray);
    // Eliminate freak matches (e.g. blank lines)
    this.cleanupSemantic(diffs);

    // Rediff any replacement blocks, this time character-by-character.
    // Add a dummy entry at the end.
    diffs.push([DIFF_EQUAL, '']);
    let pointer = 0;
    let countDelete = 0;
    let countInsert = 0;
    let textDelete = '';
    let textInsert = '';
    while (pointer < diffs.length) {
      switch (diffs[pointer][0]) {
        case DIFF_INSERT:
          countInsert++;
          textInsert += diffs[pointer][1];
          break;
        case DIFF_DELETE:
          countDelete++;
          textDelete += diffs[pointer][1];
          break;
        case DIFF_EQUAL:
          // Upon reaching an equality, check for prior redundancies.
          if (countDelete >= 1 && countInsert >= 1) {
            // Delete the offending records and add the merged ones.
            diffs.splice(pointer - countDelete - countInsert, countDelete + countInsert);
            pointer = pointer - countDelete - countInsert;
            const subDiff = this.diffMain(textDelete, textInsert, false, deadLine);
            for (let j = subDiff.length - 1; j >= 0; j--) {
              diffs.splice(pointer, 0, subDiff[j]);
            }
            pointer = pointer + subDiff.length;
          }
          countInsert = 0;
          countDelete = 0;
          textDelete = '';
          textInsert = '';
          break;
      }
      pointer++;
    }
    diffs.pop(); // Remove the dummy entry at the end.

    return diffs;
  }

  /**
   * Reduce the number of edits by eliminating semantically trivial equalities.
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   */
  cleanupSemantic(diffs: Diff[]) {
    let changes = false;
    let equalities = []; // Stack of indices where equalities are found.
    let equalitiesLength = 0; // Keeping our own length var is faster in JS.
    /** @type {?string} */
    let lastEquality: string = null;
    // Always equal to diffs[equalities[equalitiesLength - 1]][1]
    let pointer = 0; // Index of current position.
    // Number of characters that changed prior to the equality.
    let lengthInsertions1 = 0;
    let lengthDeletions1 = 0;
    // Number of characters that changed after the equality.
    let lengthInsertions2 = 0;
    let lengthDeletions2 = 0;
    while (pointer < diffs.length) {
      if (diffs[pointer][0] == DIFF_EQUAL) {
        // Equality found.
        equalities[equalitiesLength++] = pointer;
        lengthInsertions1 = lengthInsertions2;
        lengthDeletions1 = lengthDeletions2;
        lengthInsertions2 = 0;
        lengthDeletions2 = 0;
        lastEquality = diffs[pointer][1];
      } else {
        // An insertion or deletion.
        if (diffs[pointer][0] == DIFF_INSERT) {
          lengthInsertions2 += diffs[pointer][1].length;
        } else {
          lengthDeletions2 += diffs[pointer][1].length;
        }
        // Eliminate an equality that is smaller or equal to the edits on both
        // sides of it.
        if (
          lastEquality &&
          lastEquality.length <= Math.max(lengthInsertions1, lengthDeletions1) &&
          lastEquality.length <= Math.max(lengthInsertions2, lengthDeletions2)
        ) {
          // Duplicate record.
          diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastEquality]);
          // Change second copy to insert.
          diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
          // Throw away the equality we just deleted.
          equalitiesLength--;
          // Throw away the previous equality (it needs to be reevaluated).
          equalitiesLength--;
          pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
          lengthInsertions1 = 0; // Reset the counters.
          lengthDeletions1 = 0;
          lengthInsertions2 = 0;
          lengthDeletions2 = 0;
          lastEquality = null;
          changes = true;
        }
      }
      pointer++;
    }

    // Normalize the diff.
    if (changes) {
      this.cleanupMerge(diffs);
    }
    this.cleanupSemanticLossless(diffs);

    // Find any overlaps between deletions and insertions.
    // e.g: <del>abcxxx</del><ins>xxxdef</ins>
    //   -> <del>abc</del>xxx<ins>def</ins>
    // e.g: <del>xxxabc</del><ins>defxxx</ins>
    //   -> <ins>def</ins>xxx<del>abc</del>
    // Only extract an overlap if it is as big as the edit ahead or behind it.
    pointer = 1;
    while (pointer < diffs.length) {
      if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
        const deletion = diffs[pointer - 1][1];
        const insertion = diffs[pointer][1];
        const overlap_length1 = utils.commonOverlap(deletion, insertion);
        const overlap_length2 = utils.commonOverlap(insertion, deletion);
        if (overlap_length1 >= overlap_length2) {
          if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
            // Overlap found.  Insert an equality and trim the surrounding edits.
            diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
            diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
            diffs[pointer + 1][1] = insertion.substring(overlap_length1);
            pointer++;
          }
        } else {
          if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
            // Reverse overlap found.
            // Insert an equality and swap and trim the surrounding edits.
            diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
            diffs[pointer - 1][0] = DIFF_INSERT;
            diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
            diffs[pointer + 1][0] = DIFF_DELETE;
            diffs[pointer + 1][1] = deletion.substring(overlap_length2);
            pointer++;
          }
        }
        pointer++;
      }
      pointer++;
    }
  }

  /**
   * Reorder and merge like edit sections.  Merge equalities.
   * Any edit section can move as long as it doesn't cross an equality.
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   */
  cleanupMerge(diffs: Diff[]) {
    // Add a dummy entry at the end.
    diffs.push([DIFF_EQUAL, '']);
    let pointer = 0;
    let countDelete = 0;
    let countInsert = 0;
    let textDelete = '';
    let textInsert = '';
    let commonLength;
    while (pointer < diffs.length) {
      switch (diffs[pointer][0]) {
        case DIFF_INSERT:
          countInsert++;
          textInsert += diffs[pointer][1];
          pointer++;
          break;
        case DIFF_DELETE:
          countDelete++;
          textDelete += diffs[pointer][1];
          pointer++;
          break;
        case DIFF_EQUAL:
          // Upon reaching an equality, check for prior redundancies.
          if (countDelete + countInsert > 1) {
            if (countDelete !== 0 && countInsert !== 0) {
              // Factor out any common prefixes.
              commonLength = utils.commonPrefix(textInsert, textDelete);
              if (commonLength !== 0) {
                if (pointer - countDelete - countInsert > 0 && diffs[pointer - countDelete - countInsert - 1][0] == DIFF_EQUAL) {
                  diffs[pointer - countDelete - countInsert - 1][1] += textInsert.substring(0, commonLength);
                } else {
                  diffs.splice(0, 0, [DIFF_EQUAL, textInsert.substring(0, commonLength)]);
                  pointer++;
                }
                textInsert = textInsert.substring(commonLength);
                textDelete = textDelete.substring(commonLength);
              }
              // Factor out any common suffixes.
              commonLength = utils.commonSuffix(textInsert, textDelete);
              if (commonLength !== 0) {
                diffs[pointer][1] = textInsert.substring(textInsert.length - commonLength) + diffs[pointer][1];
                textInsert = textInsert.substring(0, textInsert.length - commonLength);
                textDelete = textDelete.substring(0, textDelete.length - commonLength);
              }
            }
            // Delete the offending records and add the merged ones.
            pointer -= countDelete + countInsert;
            diffs.splice(pointer, countDelete + countInsert);
            if (textDelete.length) {
              diffs.splice(pointer, 0, [DIFF_DELETE, textDelete]);
              pointer++;
            }
            if (textInsert.length) {
              diffs.splice(pointer, 0, [DIFF_INSERT, textInsert]);
              pointer++;
            }
            pointer++;
          } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
            // Merge this equality with the previous one.
            diffs[pointer - 1][1] += diffs[pointer][1];
            diffs.splice(pointer, 1);
          } else {
            pointer++;
          }
          countInsert = 0;
          countDelete = 0;
          textDelete = '';
          textInsert = '';
          break;
      }
    }
    if (diffs[diffs.length - 1][1] === '') {
      diffs.pop(); // Remove the dummy entry at the end.
    }

    // Second pass: look for single edits surrounded on both sides by equalities
    // which can be shifted sideways to eliminate an equality.
    // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
    let changes = false;
    pointer = 1;
    // Intentionally ignore the first and last element (don't need checking).
    while (pointer < diffs.length - 1) {
      if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
        // This is a single edit surrounded by equalities.
        if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
          // Shift the edit over the previous equality.
          diffs[pointer][1] =
            diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
          diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
          diffs.splice(pointer - 1, 1);
          changes = true;
        } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
          // Shift the edit over the next equality.
          diffs[pointer - 1][1] += diffs[pointer + 1][1];
          diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
          diffs.splice(pointer + 1, 1);
          changes = true;
        }
      }
      pointer++;
    }
    // If shifts were made, the diff needs reordering and another shift sweep.
    if (changes) {
      this.cleanupMerge(diffs);
    }
  }

  /**
   * Look for single edits surrounded on both sides by equalities
   * which can be shifted sideways to align the edit to a word boundary.
   * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   */
  cleanupSemanticLossless(diffs: Diff[]) {
    let pointer = 1;
    // Intentionally ignore the first and last element (don't need checking).
    while (pointer < diffs.length - 1) {
      if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
        // This is a single edit surrounded by equalities.
        let equality1 = diffs[pointer - 1][1];
        let edit = diffs[pointer][1];
        let equality2 = diffs[pointer + 1][1];

        // First, shift the edit as far left as possible.
        const commonOffset = utils.commonSuffix(equality1, edit);
        if (commonOffset) {
          var commonString = edit.substring(edit.length - commonOffset);
          equality1 = equality1.substring(0, equality1.length - commonOffset);
          edit = commonString + edit.substring(0, edit.length - commonOffset);
          equality2 = commonString + equality2;
        }

        // Second, step character by character right, looking for the best fit.
        let bestEquality1 = equality1;
        let bestEdit = edit;
        let bestEquality2 = equality2;
        let bestScore = utils.cleanupSemanticScore(equality1, edit) + utils.cleanupSemanticScore(edit, equality2);
        while (edit.charAt(0) === equality2.charAt(0)) {
          equality1 += edit.charAt(0);
          edit = edit.substring(1) + equality2.charAt(0);
          equality2 = equality2.substring(1);
          const score = utils.cleanupSemanticScore(equality1, edit) + utils.cleanupSemanticScore(edit, equality2);
          // The >= encourages trailing rather than leading whitespace on edits.
          if (score >= bestScore) {
            bestScore = score;
            bestEquality1 = equality1;
            bestEdit = edit;
            bestEquality2 = equality2;
          }
        }

        if (diffs[pointer - 1][1] != bestEquality1) {
          // We have an improvement, save it back to the diff.
          if (bestEquality1) {
            diffs[pointer - 1][1] = bestEquality1;
          } else {
            diffs.splice(pointer - 1, 1);
            pointer--;
          }
          diffs[pointer][1] = bestEdit;
          if (bestEquality2) {
            diffs[pointer + 1][1] = bestEquality2;
          } else {
            diffs.splice(pointer + 1, 1);
            pointer--;
          }
        }
      }
      pointer++;
    }
  }

  /**
   * Reduce the number of edits by eliminating operationally trivial equalities.
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   */
  cleanupEfficiency(diffs: Diff[]) {
    let changes = false;
    const equalities = []; // Stack of indices where equalities are found.
    let equalitiesLength = 0; // Keeping our own length var is faster in JS.
    /** @type {?string} */
    let lastEquality: string = null;
    // Always equal to diffs[equalities[equalitiesLength - 1]][1]
    let pointer = 0; // Index of current position.
    // Is there an insertion operation before the last equality.
    let pre_ins = false;
    // Is there a deletion operation before the last equality.
    let pre_del = false;
    // Is there an insertion operation after the last equality.
    let post_ins = false;
    // Is there a deletion operation after the last equality.
    let post_del = false;
    while (pointer < diffs.length) {
      if (diffs[pointer][0] == DIFF_EQUAL) {
        // Equality found.
        if (diffs[pointer][1].length < this.diffEditCost && (post_ins || post_del)) {
          // Candidate found.
          equalities[equalitiesLength++] = pointer;
          pre_ins = post_ins;
          pre_del = post_del;
          lastEquality = diffs[pointer][1];
        } else {
          // Not a candidate, and can never become one.
          equalitiesLength = 0;
          lastEquality = null;
        }
        post_ins = post_del = false;
      } else {
        // An insertion or deletion.
        if (diffs[pointer][0] == DIFF_DELETE) {
          post_del = true;
        } else {
          post_ins = true;
        }
        /*
         * Five types to be split:
         * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
         * <ins>A</ins>X<ins>C</ins><del>D</del>
         * <ins>A</ins><del>B</del>X<ins>C</ins>
         * <ins>A</del>X<ins>C</ins><del>D</del>
         * <ins>A</ins><del>B</del>X<del>C</del>
         */
        if (
          lastEquality &&
          ((pre_ins && pre_del && post_ins && post_del) ||
            (lastEquality.length < this.diffEditCost / 2 && +pre_ins + +pre_del + +post_ins + +post_del == 3))
        ) {
          // Duplicate record.
          diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastEquality]);
          // Change second copy to insert.
          diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
          equalitiesLength--; // Throw away the equality we just deleted;
          lastEquality = null;
          if (pre_ins && pre_del) {
            // No changes made which could affect previous entry, keep going.
            post_ins = post_del = true;
            equalitiesLength = 0;
          } else {
            equalitiesLength--; // Throw away the previous equality.
            pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
            post_ins = post_del = false;
          }
          changes = true;
        }
      }
      pointer++;
    }

    if (changes) {
      this.cleanupMerge(diffs);
    }
  }

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
  bisect(text1: string, text2: string, deadLine: number): Diff[] {
    // Cache the text lengths to prevent multiple calls.
    const text1_length = text1.length;
    const text2_length = text2.length;
    const max_d = Math.ceil((text1_length + text2_length) / 2);
    const v_offset = max_d;
    const v_length = 2 * max_d;
    const v1 = new Array(v_length);
    const v2 = new Array(v_length);
    // Setting all elements to -1 is faster in Chrome & Firefox than mixing
    // integers and undefined.
    for (let x = 0; x < v_length; x++) {
      v1[x] = -1;
      v2[x] = -1;
    }
    v1[v_offset + 1] = 0;
    v2[v_offset + 1] = 0;
    const delta = text1_length - text2_length;
    // If the total number of characters is odd, then the front path will collide
    // with the reverse path.
    const front = delta % 2 != 0;
    // Offsets for start and end of k loop.
    // Prevents mapping of space beyond the grid.
    let k1start = 0;
    let k1end = 0;
    let k2start = 0;
    let k2end = 0;
    for (let d = 0; d < max_d; d++) {
      // Bail out if deadline is reached.
      if (new Date().getTime() > deadLine) {
        break;
      }

      // Walk the front path one step.
      for (let k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
        const k1_offset = v_offset + k1;
        let x1;
        if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
          x1 = v1[k1_offset + 1];
        } else {
          x1 = v1[k1_offset - 1] + 1;
        }
        let y1 = x1 - k1;
        while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
          x1++;
          y1++;
        }
        v1[k1_offset] = x1;
        if (x1 > text1_length) {
          // Ran off the right of the graph.
          k1end += 2;
        } else if (y1 > text2_length) {
          // Ran off the bottom of the graph.
          k1start += 2;
        } else if (front) {
          const k2_offset = v_offset + delta - k1;
          if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
            // Mirror x2 onto top-left coordinate system.
            let x2 = text1_length - v2[k2_offset];
            if (x1 >= x2) {
              // Overlap detected.
              return this.bisectSplit(text1, text2, x1, y1, deadLine);
            }
          }
        }
      }

      // Walk the reverse path one step.
      for (let k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
        const k2_offset = v_offset + k2;
        let x2;
        if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
          x2 = v2[k2_offset + 1];
        } else {
          x2 = v2[k2_offset - 1] + 1;
        }
        let y2 = x2 - k2;
        while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
          x2++;
          y2++;
        }
        v2[k2_offset] = x2;
        if (x2 > text1_length) {
          // Ran off the left of the graph.
          k2end += 2;
        } else if (y2 > text2_length) {
          // Ran off the top of the graph.
          k2start += 2;
        } else if (!front) {
          const k1_offset = v_offset + delta - k2;
          if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
            const x1 = v1[k1_offset];
            const y1 = v_offset + x1 - k1_offset;
            // Mirror x2 onto top-left coordinate system.
            x2 = text1_length - x2;
            if (x1 >= x2) {
              // Overlap detected.
              return this.bisectSplit(text1, text2, x1, y1, deadLine);
            }
          }
        }
      }
    }
    // Diff took too long and hit the deadline or
    // number of diffs equals number of characters, no commonality at all.
    return [
      [DIFF_DELETE, text1],
      [DIFF_INSERT, text2],
    ];
  }

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
  private bisectSplit(text1: string, text2: string, x: number, y: number, deadline: number): Diff[] {
    const text1a = text1.substring(0, x);
    const text2a = text2.substring(0, y);
    const text1b = text1.substring(x);
    const text2b = text2.substring(y);

    // Compute both diffs serially.
    const diffs = this.diffMain(text1a, text2a, false, deadline);
    const diffsb = this.diffMain(text1b, text2b, false, deadline);

    return diffs.concat(diffsb);
  }

  /**
   * loc is a location in text1, compute and return the equivalent location in
   * text2.
   * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   * @param {number} loc Location within text1.
   * @return {number} Location within text2.
   */
  xIndex(diffs: Diff[], loc: number): number {
    let chars1 = 0;
    let chars2 = 0;
    let last_chars1 = 0;
    let last_chars2 = 0;
    let x;
    for (x = 0; x < diffs.length; x++) {
      if (diffs[x][0] !== DIFF_INSERT) {
        // Equality or deletion.
        chars1 += diffs[x][1].length;
      }
      if (diffs[x][0] !== DIFF_DELETE) {
        // Equality or insertion.
        chars2 += diffs[x][1].length;
      }
      if (chars1 > loc) {
        // Overshot the location.
        break;
      }
      last_chars1 = chars1;
      last_chars2 = chars2;
    }
    // Was the location was deleted?
    if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
      return last_chars2;
    }
    // Add the remaining character length.
    return last_chars2 + (loc - last_chars1);
  }

  /**
   * Convert a diff array into a pretty HTML report.
   * @param {!Diff>} diffs Array of diff tuples.
   * @return {string} HTML representation.
   */
  prettyHtml(diffs: Diff[]): string {
    const html: string[] = [];
    const pattern_amp = /&/g;
    const pattern_lt = /</g;
    const pattern_gt = />/g;
    const pattern_para = /\n/g;
    for (let x = 0; x < diffs.length; x++) {
      const op = diffs[x][0]; // Operation (insert, delete, equal)
      const data = diffs[x][1]; // Text of change.
      const text = data
        .replace(pattern_amp, '&amp;')
        .replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;')
        .replace(pattern_para, '&para;<br>');
      switch (op) {
        case DIFF_INSERT:
          html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
          break;
        case DIFF_DELETE:
          html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
          break;
        case DIFF_EQUAL:
          html[x] = '<span>' + text + '</span>';
          break;
      }
    }
    return html.join('');
  }

  /**
   * Compute and return the source text (all equalities and deletions).
   * @param {!Diff>} diffs Array of diff tuples.
   * @return {string} Source text.
   */
  text1(diffs: Diff[]): string {
    const text: string[] = [];
    for (let x = 0; x < diffs.length; x++) {
      if (diffs[x][0] !== DIFF_INSERT) {
        text[x] = diffs[x][1];
      }
    }
    return text.join('');
  }

  /**
   * Compute and return the destination text (all equalities and insertions).
   * @param {!Diff>} diffs Array of diff tuples.
   * @return {string} Destination text.
   */
  text2(diffs: Diff[]): string {
    const text: string[] = [];
    for (let x = 0; x < diffs.length; x++) {
      if (diffs[x][0] !== DIFF_DELETE) {
        text[x] = diffs[x][1];
      }
    }
    return text.join('');
  }

  /**
   * Compute the Levenshtein distance; the number of inserted, deleted or
   * substituted characters.
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   * @return {number} Number of changes.
   */
  levenshtein(diffs: Diff[]): number {
    let levenshtein = 0;
    let insertions = 0;
    let deletions = 0;
    for (let x = 0; x < diffs.length; x++) {
      const op = diffs[x][0];
      const data = diffs[x][1];
      switch (op) {
        case DIFF_INSERT:
          insertions += data.length;
          break;
        case DIFF_DELETE:
          deletions += data.length;
          break;
        case DIFF_EQUAL:
          // A deletion and an insertion is one substitution.
          levenshtein += Math.max(insertions, deletions);
          insertions = 0;
          deletions = 0;
          break;
      }
    }
    levenshtein += Math.max(insertions, deletions);
    return levenshtein;
  }

  /**
   * Crush the diff into an encoded string which describes the operations
   * required to transform text1 into text2.
   * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
   * Operations are tab-separated.  Inserted text is escaped using %xx notation.
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   * @return {string} Delta text.
   */
  toDelta(diffs: Diff[]): string {
    const text: string[] = [];
    for (let x = 0; x < diffs.length; x++) {
      switch (diffs[x][0]) {
        case DIFF_INSERT:
          text[x] = '+' + encodeURI(diffs[x][1]);
          break;
        case DIFF_DELETE:
          text[x] = '-' + diffs[x][1].length;
          break;
        case DIFF_EQUAL:
          text[x] = '=' + diffs[x][1].length;
          break;
      }
    }
    return text.join('\t').replace(/%20/g, ' ');
  }

  /**
   * Given the original text1, and an encoded string which describes the
   * operations required to transform text1 into text2, compute the full diff.
   * @param {string} text1 Source string for the diff.
   * @param {string} delta Delta text.
   * @return {!Array.<!Diff>} Array of diff tuples.
   * @throws {!Error} If invalid input.
   */
  fromDelta(text1: string, delta: string): Diff[] {
    const diffs: Diff[] = [];
    let diffsLength = 0; // Keeping our own length var is faster in JS.
    let pointer = 0; // Cursor in text1
    const tokens: string[] = delta.split(/\t/g);
    for (let x = 0; x < tokens.length; x++) {
      // Each token begins with a one character parameter which specifies the
      // operation of this token (delete, insert, equality).
      const param: string = tokens[x].substring(1);
      switch (tokens[x].charAt(0)) {
        case '+':
          try {
            diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
          } catch (ex) {
            // Malformed URI sequence.
            throw new Error('Illegal escape in diff_fromDelta: ' + param);
          }
          break;
        case '-':
        // Fall through.
        case '=':
          const n = parseInt(param, 10);
          if (isNaN(n) || n < 0) {
            throw new Error('Invalid number in diff_fromDelta: ' + param);
          }
          const text: string = text1.substring(pointer, (pointer += n));
          if (tokens[x].charAt(0) == '=') {
            diffs[diffsLength++] = [DIFF_EQUAL, text];
          } else {
            diffs[diffsLength++] = [DIFF_DELETE, text];
          }
          break;
        default:
          // Blank tokens are ok (from a trailing \t).
          // Anything else is an error.
          if (tokens[x]) {
            throw new Error('Invalid diff operation in diff_fromDelta: ' + tokens[x]);
          }
      }
    }
    if (pointer != text1.length) {
      throw new Error('Delta length (' + pointer + ') does not equal source text length (' + text1.length + ').');
    }
    return diffs;
  }

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
  linesToChars(text1: string, text2: string): DiffLinesChars {
    let lineArray = []; // e.g. lineArray[4] == 'Hello\n'
    let lineHash = {}; // e.g. lineHash['Hello\n'] == 4

    // '\x00' is a valid character, but various debuggers don't like it.
    // So we'll insert a junk entry to avoid generating a null character.
    lineArray[0] = '';

    // Allocate 2/3rds of the space for text1, the rest for text2.
    let maxLines = 40000;
    const chars1 = utils.linesToCharsMunge(text1, lineArray, lineHash, maxLines);
    maxLines = 65535;
    const chars2 = utils.linesToCharsMunge(text2, lineArray, lineHash, maxLines);
    return { chars1: chars1, chars2: chars2, lineArray: lineArray };
  }

  /**
   * Rehydrate the text in a diff from a string of line hashes to real lines of
   * text.
   * @param {!Array.<!Diff>} diffs Array of diff tuples.
   * @param {!Array.<string>} lineArray Array of unique strings.
   * @private
   */
  charsToLines(diffs: Diff[], lineArray: string[]): void {
    for (let i = 0; i < diffs.length; i++) {
      const chars = diffs[i][1];
      let text = [];
      for (let j = 0; j < chars.length; j++) {
        text[j] = lineArray[chars.charCodeAt(j)];
      }
      diffs[i][1] = text.join('');
    }
  }
}
