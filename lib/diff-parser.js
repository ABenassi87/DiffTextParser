(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("DiffParser", [], factory);
	else if(typeof exports === 'object')
		exports["DiffParser"] = factory();
	else
		root["DiffParser"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ diff_parser_DiffParser; });

// CONCATENATED MODULE: ./src/model.ts
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0; // Define some regex patterns for matching boundaries.

var nonAlphaNumericRegex = /[^a-zA-Z0-9]/;
var whitespaceRegex = /\s/;
var linebreakRegex = /[\r\n]/;
var blankLineEndRegex = /\n\r?\n$/;
var blankLineStartRegex = /^\r?\n\r?\n/;
var PatchObj = function PatchObj() {
  _classCallCheck(this, PatchObj);

  _defineProperty(this, "diffs", void 0);

  _defineProperty(this, "start1", void 0);

  _defineProperty(this, "start2", void 0);

  _defineProperty(this, "length1", void 0);

  _defineProperty(this, "length2", void 0);
};
// CONCATENATED MODULE: ./src/utils.ts
/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */

function utils_commonPrefix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  } // Binary search.
  // Performance analysis: https://neil.fraser.name/news/2007/10/09/


  var pointerMin = 0;
  var pointerMax = Math.min(text1.length, text2.length);
  var pointerMid = pointerMax;
  var pointerStart = 0;

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

function utils_commonSuffix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  } // Binary search.
  // Performance analysis: https://neil.fraser.name/news/2007/10/09/


  var pointerMin = 0;
  var pointerMax = Math.min(text1.length, text2.length);
  var pointerMid = pointerMax;
  var pointerEnd = 0;

  while (pointerMin < pointerMid) {
    if (text1.substring(text1.length - pointerMid, text1.length - pointerEnd) == text2.substring(text2.length - pointerMid, text2.length - pointerEnd)) {
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

function halfMatchI(longText, shortText, i) {
  // Start with a 1/4 length substring at position i as a seed.
  var seed = longText.substring(i, i + Math.floor(longText.length / 4));
  var j = -1;
  var bestCommon = '';
  var bestLongTextA, bestLongTextB, bestShortTextA, bestShortTextB;

  while ((j = shortText.indexOf(seed, j + 1)) != -1) {
    var prefixLength = utils_commonPrefix(longText.substring(i), shortText.substring(j));
    var suffixLength = utils_commonSuffix(longText.substring(0, i), shortText.substring(0, j));

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

function linesToCharsMunge(text, lineArray, lineHash, maxLines) {
  var chars = ''; // Walk the text, pulling out a substring for each line.
  // text.split('\n') would would temporarily double our memory footprint.
  // Modifying text would create many large strings to garbage collect.

  var lineStart = 0;
  var lineEnd = -1; // Keeping our own length variable is faster than looking it up.

  var lineArrayLength = lineArray.length;

  while (lineEnd < text.length - 1) {
    lineEnd = text.indexOf('\n', lineStart);

    if (lineEnd == -1) {
      lineEnd = text.length - 1;
    }

    var line = text.substring(lineStart, lineEnd + 1);

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

function cleanupSemanticScore(one, two) {
  if (!one || !two) {
    // Edges are the best.
    return 6;
  } // Each port of this function behaves slightly differently due to
  // subtle differences in each language's definition of things like
  // 'whitespace'.  Since this function's purpose is largely cosmetic,
  // the choice has been made to use each language's native features
  // rather than force total conformity.


  var char1 = one.charAt(one.length - 1);
  var char2 = two.charAt(0);
  var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex);
  var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex);
  var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex);
  var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex);
  var lineBreak1 = whitespace1 && char1.match(linebreakRegex);
  var lineBreak2 = whitespace2 && char2.match(linebreakRegex);
  var blankLine1 = lineBreak1 && one.match(blankLineEndRegex);
  var blankLine2 = lineBreak2 && two.match(blankLineStartRegex);

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

function commonOverlap(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length; // Eliminate the null case.

  if (text1_length == 0 || text2_length == 0) {
    return 0;
  } // Truncate the longer string.


  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }

  var text_length = Math.min(text1_length, text2_length); // Quick check for the worst case.

  if (text1 == text2) {
    return text_length;
  } // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: https://neil.fraser.name/news/2010/11/04/


  var best = 0;
  var length = 1;

  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);

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
// CONCATENATED MODULE: ./src/diff-parser.ts
function diff_parser_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function diff_parser_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



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

var diff_parser_DiffParser = /*#__PURE__*/function () {
  // Defaults.
  // Redefine these in your program to override the defaults.
  // Number of seconds to map a diff before giving up (0 for infinity).
  // Cost of an empty edit operation in terms of edit characters.
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that MatchThreshold controls how closely the
  // end points of a delete need to match.
  // Chunk size for context length.
  // The number of bits in an int.
  function DiffParser() {
    diff_parser_classCallCheck(this, DiffParser);

    diff_parser_defineProperty(this, "diffTimeout", 1.0);

    diff_parser_defineProperty(this, "diffEditCost", 4);

    diff_parser_defineProperty(this, "matchThreshold", 0.5);

    diff_parser_defineProperty(this, "matchDistance", 1000);

    diff_parser_defineProperty(this, "patchDeleteThreshold", 0.5);

    diff_parser_defineProperty(this, "patchMargin", 4);

    diff_parser_defineProperty(this, "matchMaxBits", 32);
  }
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


  _createClass(DiffParser, [{
    key: "diffMain",
    value: function diffMain(text1, text2, checkLines, deadLine) {
      // Set a deadline by which time the diff must be complete.
      if (typeof deadLine == 'undefined') {
        if (this.diffTimeout <= 0) {
          deadLine = Number.MAX_VALUE;
        } else {
          deadLine = new Date().getTime() + this.diffTimeout * 1000;
        }
      }

      var deadline = deadLine; // Check for null inputs.

      if (text1 == null || text2 == null) {
        throw new Error('Null input. (diff_main)');
      } // Check for equality (speedup).


      if (text1 == text2) {
        if (text1) {
          var diff = [DIFF_EQUAL, text1];
          return [diff];
        }

        return [];
      }

      if (typeof checkLines == 'undefined') {
        checkLines = true;
      }

      var checklines = checkLines; // Trim off common prefix (speedup).

      var commonLength = utils_commonPrefix(text1, text2);
      var commonPrefix = text1.substring(0, commonLength);
      text1 = text1.substring(commonLength);
      text2 = text2.substring(commonLength); // Trim off common suffix (speedup).

      commonLength = utils_commonSuffix(text1, text2);
      var commonSuffix = text1.substring(text1.length - commonLength);
      text1 = text1.substring(0, text1.length - commonLength);
      text2 = text2.substring(0, text2.length - commonLength); // Compute the diff on the middle block.

      var diffs = this.compute(text1, text2, checklines, deadline); // Restore the prefix and suffix.

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

  }, {
    key: "compute",
    value: function compute(text1, text2, checkLines, deadLine) {
      var diffs = [];

      if (!text1) {
        // Just add some text (speedup).
        return [[DIFF_INSERT, text2]];
      }

      if (!text2) {
        // Just delete some text (speedup).
        return [[DIFF_DELETE, text1]];
      }

      var longText = text1.length > text2.length ? text1 : text2;
      var shortText = text1.length > text2.length ? text2 : text1;
      var i = longText.indexOf(shortText);

      if (i != -1) {
        // Shorter text is inside the longer text (speedup).
        diffs = [[DIFF_INSERT, longText.substring(0, i)], [DIFF_EQUAL, shortText], [DIFF_INSERT, longText.substring(i + shortText.length)]]; // Swap insertions for deletions if diff is reversed.

        if (text1.length > text2.length) {
          diffs[0][0] = diffs[2][0] = DIFF_DELETE;
        }

        return diffs;
      }

      if (shortText.length == 1) {
        // Single character string.
        // After the previous speedup, the character can't be an equality.
        return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
      } // Check to see if the problem can be split in two.


      var hm = this.halfMatch(text1, text2);

      if (hm) {
        // A half-match was found, sort out the return data.
        var text1A = hm[0];
        var text1B = hm[1];
        var text2A = hm[2];
        var text2B = hm[3];
        var midCommon = hm[4]; // Send both pairs off for separate processing.

        var diffsA = this.diffMain(text1A, text2A, checkLines, deadLine);
        var diffsB = this.diffMain(text1B, text2B, checkLines, deadLine); // Merge the results.

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

  }, {
    key: "halfMatch",
    value: function halfMatch(text1, text2) {
      if (this.diffTimeout <= 0) {
        // Don't risk returning a non-optimal diff if we have unlimited time.
        return null;
      }

      var longtext = text1.length > text2.length ? text1 : text2;
      var shorttext = text1.length > text2.length ? text2 : text1;

      if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
        return null; // Pointless.
      } // First check if the second quarter is the seed for a half-match.


      var hm1 = halfMatchI(longtext, shorttext, Math.ceil(longtext.length / 4)); // Check again based on the third quarter.

      var hm2 = halfMatchI(longtext, shorttext, Math.ceil(longtext.length / 2));
      var hm;

      if (!hm1 && !hm2) {
        return null;
      } else if (!hm2) {
        hm = hm1;
      } else if (!hm1) {
        hm = hm2;
      } else {
        // Both matched.  Select the longest.
        hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
      } // A half-match was found, sort out the return data.


      var text1A, text1B, text2A, text2B;

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

      var midCommon = hm[4];
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

  }, {
    key: "lineMode",
    value: function lineMode(text1, text2, deadLine) {
      // Scan the text on a line-by-line basis first.
      var a = this.linesToChars(text1, text2);
      text1 = a.chars1;
      text2 = a.chars2;
      var lineArray = a.lineArray;
      var diffs = this.diffMain(text1, text2, false, deadLine); // Convert the diff back to original text.

      this.charsToLines(diffs, lineArray); // Eliminate freak matches (e.g. blank lines)

      this.cleanupSemantic(diffs); // Rediff any replacement blocks, this time character-by-character.
      // Add a dummy entry at the end.

      diffs.push([DIFF_EQUAL, '']);
      var pointer = 0;
      var countDelete = 0;
      var countInsert = 0;
      var textDelete = '';
      var textInsert = '';

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
              var subDiff = this.diffMain(textDelete, textInsert, false, deadLine);

              for (var j = subDiff.length - 1; j >= 0; j--) {
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

  }, {
    key: "cleanupSemantic",
    value: function cleanupSemantic(diffs) {
      var changes = false;
      var equalities = []; // Stack of indices where equalities are found.

      var equalitiesLength = 0; // Keeping our own length var is faster in JS.

      /** @type {?string} */

      var lastEquality = null; // Always equal to diffs[equalities[equalitiesLength - 1]][1]

      var pointer = 0; // Index of current position.
      // Number of characters that changed prior to the equality.

      var lengthInsertions1 = 0;
      var lengthDeletions1 = 0; // Number of characters that changed after the equality.

      var lengthInsertions2 = 0;
      var lengthDeletions2 = 0;

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
          } // Eliminate an equality that is smaller or equal to the edits on both
          // sides of it.


          if (lastEquality && lastEquality.length <= Math.max(lengthInsertions1, lengthDeletions1) && lastEquality.length <= Math.max(lengthInsertions2, lengthDeletions2)) {
            // Duplicate record.
            diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastEquality]); // Change second copy to insert.

            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT; // Throw away the equality we just deleted.

            equalitiesLength--; // Throw away the previous equality (it needs to be reevaluated).

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
      } // Normalize the diff.


      if (changes) {
        this.cleanupMerge(diffs);
      }

      this.cleanupSemanticLossless(diffs); // Find any overlaps between deletions and insertions.
      // e.g: <del>abcxxx</del><ins>xxxdef</ins>
      //   -> <del>abc</del>xxx<ins>def</ins>
      // e.g: <del>xxxabc</del><ins>defxxx</ins>
      //   -> <ins>def</ins>xxx<del>abc</del>
      // Only extract an overlap if it is as big as the edit ahead or behind it.

      pointer = 1;

      while (pointer < diffs.length) {
        if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
          var deletion = diffs[pointer - 1][1];
          var insertion = diffs[pointer][1];
          var overlap_length1 = commonOverlap(deletion, insertion);
          var overlap_length2 = commonOverlap(insertion, deletion);

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

  }, {
    key: "cleanupMerge",
    value: function cleanupMerge(diffs) {
      // Add a dummy entry at the end.
      diffs.push([DIFF_EQUAL, '']);
      var pointer = 0;
      var countDelete = 0;
      var countInsert = 0;
      var textDelete = '';
      var textInsert = '';
      var commonLength;

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
                commonLength = utils_commonPrefix(textInsert, textDelete);

                if (commonLength !== 0) {
                  if (pointer - countDelete - countInsert > 0 && diffs[pointer - countDelete - countInsert - 1][0] == DIFF_EQUAL) {
                    diffs[pointer - countDelete - countInsert - 1][1] += textInsert.substring(0, commonLength);
                  } else {
                    diffs.splice(0, 0, [DIFF_EQUAL, textInsert.substring(0, commonLength)]);
                    pointer++;
                  }

                  textInsert = textInsert.substring(commonLength);
                  textDelete = textDelete.substring(commonLength);
                } // Factor out any common suffixes.


                commonLength = utils_commonSuffix(textInsert, textDelete);

                if (commonLength !== 0) {
                  diffs[pointer][1] = textInsert.substring(textInsert.length - commonLength) + diffs[pointer][1];
                  textInsert = textInsert.substring(0, textInsert.length - commonLength);
                  textDelete = textDelete.substring(0, textDelete.length - commonLength);
                }
              } // Delete the offending records and add the merged ones.


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
      } // Second pass: look for single edits surrounded on both sides by equalities
      // which can be shifted sideways to eliminate an equality.
      // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC


      var changes = false;
      pointer = 1; // Intentionally ignore the first and last element (don't need checking).

      while (pointer < diffs.length - 1) {
        if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
          // This is a single edit surrounded by equalities.
          if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
            // Shift the edit over the previous equality.
            diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
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
      } // If shifts were made, the diff needs reordering and another shift sweep.


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

  }, {
    key: "cleanupSemanticLossless",
    value: function cleanupSemanticLossless(diffs) {
      var pointer = 1; // Intentionally ignore the first and last element (don't need checking).

      while (pointer < diffs.length - 1) {
        if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
          // This is a single edit surrounded by equalities.
          var equality1 = diffs[pointer - 1][1];
          var edit = diffs[pointer][1];
          var equality2 = diffs[pointer + 1][1]; // First, shift the edit as far left as possible.

          var commonOffset = utils_commonSuffix(equality1, edit);

          if (commonOffset) {
            var commonString = edit.substring(edit.length - commonOffset);
            equality1 = equality1.substring(0, equality1.length - commonOffset);
            edit = commonString + edit.substring(0, edit.length - commonOffset);
            equality2 = commonString + equality2;
          } // Second, step character by character right, looking for the best fit.


          var bestEquality1 = equality1;
          var bestEdit = edit;
          var bestEquality2 = equality2;
          var bestScore = cleanupSemanticScore(equality1, edit) + cleanupSemanticScore(edit, equality2);

          while (edit.charAt(0) === equality2.charAt(0)) {
            equality1 += edit.charAt(0);
            edit = edit.substring(1) + equality2.charAt(0);
            equality2 = equality2.substring(1);
            var score = cleanupSemanticScore(equality1, edit) + cleanupSemanticScore(edit, equality2); // The >= encourages trailing rather than leading whitespace on edits.

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

  }, {
    key: "cleanupEfficiency",
    value: function cleanupEfficiency(diffs) {
      var changes = false;
      var equalities = []; // Stack of indices where equalities are found.

      var equalitiesLength = 0; // Keeping our own length var is faster in JS.

      /** @type {?string} */

      var lastEquality = null; // Always equal to diffs[equalities[equalitiesLength - 1]][1]

      var pointer = 0; // Index of current position.
      // Is there an insertion operation before the last equality.

      var pre_ins = false; // Is there a deletion operation before the last equality.

      var pre_del = false; // Is there an insertion operation after the last equality.

      var post_ins = false; // Is there a deletion operation after the last equality.

      var post_del = false;

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


          if (lastEquality && (pre_ins && pre_del && post_ins && post_del || lastEquality.length < this.diffEditCost / 2 && +pre_ins + +pre_del + +post_ins + +post_del == 3)) {
            // Duplicate record.
            diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastEquality]); // Change second copy to insert.

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

  }, {
    key: "bisect",
    value: function bisect(text1, text2, deadLine) {
      // Cache the text lengths to prevent multiple calls.
      var text1_length = text1.length;
      var text2_length = text2.length;
      var max_d = Math.ceil((text1_length + text2_length) / 2);
      var v_offset = max_d;
      var v_length = 2 * max_d;
      var v1 = new Array(v_length);
      var v2 = new Array(v_length); // Setting all elements to -1 is faster in Chrome & Firefox than mixing
      // integers and undefined.

      for (var x = 0; x < v_length; x++) {
        v1[x] = -1;
        v2[x] = -1;
      }

      v1[v_offset + 1] = 0;
      v2[v_offset + 1] = 0;
      var delta = text1_length - text2_length; // If the total number of characters is odd, then the front path will collide
      // with the reverse path.

      var front = delta % 2 != 0; // Offsets for start and end of k loop.
      // Prevents mapping of space beyond the grid.

      var k1start = 0;
      var k1end = 0;
      var k2start = 0;
      var k2end = 0;

      for (var d = 0; d < max_d; d++) {
        // Bail out if deadline is reached.
        if (new Date().getTime() > deadLine) {
          break;
        } // Walk the front path one step.


        for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
          var k1_offset = v_offset + k1;
          var x1 = void 0;

          if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
            x1 = v1[k1_offset + 1];
          } else {
            x1 = v1[k1_offset - 1] + 1;
          }

          var y1 = x1 - k1;

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
            var k2_offset = v_offset + delta - k1;

            if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
              // Mirror x2 onto top-left coordinate system.
              var x2 = text1_length - v2[k2_offset];

              if (x1 >= x2) {
                // Overlap detected.
                return this.bisectSplit(text1, text2, x1, y1, deadLine);
              }
            }
          }
        } // Walk the reverse path one step.


        for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
          var _k2_offset = v_offset + k2;

          var _x = void 0;

          if (k2 == -d || k2 != d && v2[_k2_offset - 1] < v2[_k2_offset + 1]) {
            _x = v2[_k2_offset + 1];
          } else {
            _x = v2[_k2_offset - 1] + 1;
          }

          var y2 = _x - k2;

          while (_x < text1_length && y2 < text2_length && text1.charAt(text1_length - _x - 1) == text2.charAt(text2_length - y2 - 1)) {
            _x++;
            y2++;
          }

          v2[_k2_offset] = _x;

          if (_x > text1_length) {
            // Ran off the left of the graph.
            k2end += 2;
          } else if (y2 > text2_length) {
            // Ran off the top of the graph.
            k2start += 2;
          } else if (!front) {
            var _k1_offset = v_offset + delta - k2;

            if (_k1_offset >= 0 && _k1_offset < v_length && v1[_k1_offset] != -1) {
              var _x2 = v1[_k1_offset];

              var _y = v_offset + _x2 - _k1_offset; // Mirror x2 onto top-left coordinate system.


              _x = text1_length - _x;

              if (_x2 >= _x) {
                // Overlap detected.
                return this.bisectSplit(text1, text2, _x2, _y, deadLine);
              }
            }
          }
        }
      } // Diff took too long and hit the deadline or
      // number of diffs equals number of characters, no commonality at all.


      return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
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

  }, {
    key: "bisectSplit",
    value: function bisectSplit(text1, text2, x, y, deadline) {
      var text1a = text1.substring(0, x);
      var text2a = text2.substring(0, y);
      var text1b = text1.substring(x);
      var text2b = text2.substring(y); // Compute both diffs serially.

      var diffs = this.diffMain(text1a, text2a, false, deadline);
      var diffsb = this.diffMain(text1b, text2b, false, deadline);
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

  }, {
    key: "xIndex",
    value: function xIndex(diffs, loc) {
      var chars1 = 0;
      var chars2 = 0;
      var last_chars1 = 0;
      var last_chars2 = 0;
      var x;

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
      } // Was the location was deleted?


      if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
        return last_chars2;
      } // Add the remaining character length.


      return last_chars2 + (loc - last_chars1);
    }
    /**
     * Convert a diff array into a pretty HTML report.
     * @param {!Diff>} diffs Array of diff tuples.
     * @return {string} HTML representation.
     */

  }, {
    key: "prettyHtml",
    value: function prettyHtml(diffs) {
      var html = [];
      var pattern_amp = /&/g;
      var pattern_lt = /</g;
      var pattern_gt = />/g;
      var pattern_para = /\n/g;

      for (var x = 0; x < diffs.length; x++) {
        var op = diffs[x][0]; // Operation (insert, delete, equal)

        var data = diffs[x][1]; // Text of change.

        var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;').replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');

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

  }, {
    key: "text1",
    value: function text1(diffs) {
      var text = [];

      for (var x = 0; x < diffs.length; x++) {
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

  }, {
    key: "text2",
    value: function text2(diffs) {
      var text = [];

      for (var x = 0; x < diffs.length; x++) {
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

  }, {
    key: "levenshtein",
    value: function levenshtein(diffs) {
      var levenshtein = 0;
      var insertions = 0;
      var deletions = 0;

      for (var x = 0; x < diffs.length; x++) {
        var op = diffs[x][0];
        var data = diffs[x][1];

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

  }, {
    key: "toDelta",
    value: function toDelta(diffs) {
      var text = [];

      for (var x = 0; x < diffs.length; x++) {
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

  }, {
    key: "fromDelta",
    value: function fromDelta(text1, delta) {
      var diffs = [];
      var diffsLength = 0; // Keeping our own length var is faster in JS.

      var pointer = 0; // Cursor in text1

      var tokens = delta.split(/\t/g);

      for (var x = 0; x < tokens.length; x++) {
        // Each token begins with a one character parameter which specifies the
        // operation of this token (delete, insert, equality).
        var param = tokens[x].substring(1);

        switch (tokens[x].charAt(0)) {
          case '+':
            try {
              diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
            } catch (ex) {
              // Malformed URI sequence.
              throw new Error('Illegal escape in diff_fromDelta: ' + param);
            }

            break;

          case '-': // Fall through.

          case '=':
            var n = parseInt(param, 10);

            if (isNaN(n) || n < 0) {
              throw new Error('Invalid number in diff_fromDelta: ' + param);
            }

            var text = text1.substring(pointer, pointer += n);

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

  }, {
    key: "linesToChars",
    value: function linesToChars(text1, text2) {
      var lineArray = []; // e.g. lineArray[4] == 'Hello\n'

      var lineHash = {}; // e.g. lineHash['Hello\n'] == 4
      // '\x00' is a valid character, but various debuggers don't like it.
      // So we'll insert a junk entry to avoid generating a null character.

      lineArray[0] = ''; // Allocate 2/3rds of the space for text1, the rest for text2.

      var maxLines = 40000;
      var chars1 = linesToCharsMunge(text1, lineArray, lineHash, maxLines);
      maxLines = 65535;
      var chars2 = linesToCharsMunge(text2, lineArray, lineHash, maxLines);
      return {
        chars1: chars1,
        chars2: chars2,
        lineArray: lineArray
      };
    }
    /**
     * Rehydrate the text in a diff from a string of line hashes to real lines of
     * text.
     * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
     * @param {!Array.<string>} lineArray Array of unique strings.
     * @private
     */

  }, {
    key: "charsToLines",
    value: function charsToLines(diffs, lineArray) {
      for (var i = 0; i < diffs.length; i++) {
        var chars = diffs[i][1];
        var text = [];

        for (var j = 0; j < chars.length; j++) {
          text[j] = lineArray[chars.charCodeAt(j)];
        }

        diffs[i][1] = text.join('');
      }
    }
  }]);

  return DiffParser;
}();



/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9EaWZmUGFyc2VyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9EaWZmUGFyc2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0RpZmZQYXJzZXIvLi9zcmMvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vRGlmZlBhcnNlci8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9EaWZmUGFyc2VyLy4vc3JjL2RpZmYtcGFyc2VyLnRzIl0sIm5hbWVzIjpbIkRJRkZfREVMRVRFIiwiRElGRl9JTlNFUlQiLCJESUZGX0VRVUFMIiwibm9uQWxwaGFOdW1lcmljUmVnZXgiLCJ3aGl0ZXNwYWNlUmVnZXgiLCJsaW5lYnJlYWtSZWdleCIsImJsYW5rTGluZUVuZFJlZ2V4IiwiYmxhbmtMaW5lU3RhcnRSZWdleCIsIlBhdGNoT2JqIiwiY29tbW9uUHJlZml4IiwidGV4dDEiLCJ0ZXh0MiIsImNoYXJBdCIsInBvaW50ZXJNaW4iLCJwb2ludGVyTWF4IiwiTWF0aCIsIm1pbiIsImxlbmd0aCIsInBvaW50ZXJNaWQiLCJwb2ludGVyU3RhcnQiLCJzdWJzdHJpbmciLCJmbG9vciIsImNvbW1vblN1ZmZpeCIsInBvaW50ZXJFbmQiLCJoYWxmTWF0Y2hJIiwibG9uZ1RleHQiLCJzaG9ydFRleHQiLCJpIiwic2VlZCIsImoiLCJiZXN0Q29tbW9uIiwiYmVzdExvbmdUZXh0QSIsImJlc3RMb25nVGV4dEIiLCJiZXN0U2hvcnRUZXh0QSIsImJlc3RTaG9ydFRleHRCIiwiaW5kZXhPZiIsInByZWZpeExlbmd0aCIsInN1ZmZpeExlbmd0aCIsImxpbmVzVG9DaGFyc011bmdlIiwidGV4dCIsImxpbmVBcnJheSIsImxpbmVIYXNoIiwibWF4TGluZXMiLCJjaGFycyIsImxpbmVTdGFydCIsImxpbmVFbmQiLCJsaW5lQXJyYXlMZW5ndGgiLCJsaW5lIiwiaGFzT3duUHJvcGVydHkiLCJ1bmRlZmluZWQiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjbGVhbnVwU2VtYW50aWNTY29yZSIsIm9uZSIsInR3byIsImNoYXIxIiwiY2hhcjIiLCJub25BbHBoYU51bWVyaWMxIiwibWF0Y2giLCJub25BbHBoYU51bWVyaWMyIiwid2hpdGVzcGFjZTEiLCJ3aGl0ZXNwYWNlMiIsImxpbmVCcmVhazEiLCJsaW5lQnJlYWsyIiwiYmxhbmtMaW5lMSIsImJsYW5rTGluZTIiLCJjb21tb25PdmVybGFwIiwidGV4dDFfbGVuZ3RoIiwidGV4dDJfbGVuZ3RoIiwidGV4dF9sZW5ndGgiLCJiZXN0IiwicGF0dGVybiIsImZvdW5kIiwiRGlmZlBhcnNlciIsImNoZWNrTGluZXMiLCJkZWFkTGluZSIsImRpZmZUaW1lb3V0IiwiTnVtYmVyIiwiTUFYX1ZBTFVFIiwiRGF0ZSIsImdldFRpbWUiLCJkZWFkbGluZSIsIkVycm9yIiwiZGlmZiIsImNoZWNrbGluZXMiLCJjb21tb25MZW5ndGgiLCJ1dGlscyIsImRpZmZzIiwiY29tcHV0ZSIsInVuc2hpZnQiLCJwdXNoIiwiY2xlYW51cE1lcmdlIiwiaG0iLCJoYWxmTWF0Y2giLCJ0ZXh0MUEiLCJ0ZXh0MUIiLCJ0ZXh0MkEiLCJ0ZXh0MkIiLCJtaWRDb21tb24iLCJkaWZmc0EiLCJkaWZmTWFpbiIsImRpZmZzQiIsImNvbmNhdCIsImxpbmVNb2RlIiwiYmlzZWN0IiwibG9uZ3RleHQiLCJzaG9ydHRleHQiLCJobTEiLCJjZWlsIiwiaG0yIiwiYSIsImxpbmVzVG9DaGFycyIsImNoYXJzMSIsImNoYXJzMiIsImNoYXJzVG9MaW5lcyIsImNsZWFudXBTZW1hbnRpYyIsInBvaW50ZXIiLCJjb3VudERlbGV0ZSIsImNvdW50SW5zZXJ0IiwidGV4dERlbGV0ZSIsInRleHRJbnNlcnQiLCJzcGxpY2UiLCJzdWJEaWZmIiwicG9wIiwiY2hhbmdlcyIsImVxdWFsaXRpZXMiLCJlcXVhbGl0aWVzTGVuZ3RoIiwibGFzdEVxdWFsaXR5IiwibGVuZ3RoSW5zZXJ0aW9uczEiLCJsZW5ndGhEZWxldGlvbnMxIiwibGVuZ3RoSW5zZXJ0aW9uczIiLCJsZW5ndGhEZWxldGlvbnMyIiwibWF4IiwiY2xlYW51cFNlbWFudGljTG9zc2xlc3MiLCJkZWxldGlvbiIsImluc2VydGlvbiIsIm92ZXJsYXBfbGVuZ3RoMSIsIm92ZXJsYXBfbGVuZ3RoMiIsImVxdWFsaXR5MSIsImVkaXQiLCJlcXVhbGl0eTIiLCJjb21tb25PZmZzZXQiLCJjb21tb25TdHJpbmciLCJiZXN0RXF1YWxpdHkxIiwiYmVzdEVkaXQiLCJiZXN0RXF1YWxpdHkyIiwiYmVzdFNjb3JlIiwic2NvcmUiLCJwcmVfaW5zIiwicHJlX2RlbCIsInBvc3RfaW5zIiwicG9zdF9kZWwiLCJkaWZmRWRpdENvc3QiLCJtYXhfZCIsInZfb2Zmc2V0Iiwidl9sZW5ndGgiLCJ2MSIsIkFycmF5IiwidjIiLCJ4IiwiZGVsdGEiLCJmcm9udCIsImsxc3RhcnQiLCJrMWVuZCIsImsyc3RhcnQiLCJrMmVuZCIsImQiLCJrMSIsImsxX29mZnNldCIsIngxIiwieTEiLCJrMl9vZmZzZXQiLCJ4MiIsImJpc2VjdFNwbGl0IiwiazIiLCJ5MiIsInkiLCJ0ZXh0MWEiLCJ0ZXh0MmEiLCJ0ZXh0MWIiLCJ0ZXh0MmIiLCJkaWZmc2IiLCJsb2MiLCJsYXN0X2NoYXJzMSIsImxhc3RfY2hhcnMyIiwiaHRtbCIsInBhdHRlcm5fYW1wIiwicGF0dGVybl9sdCIsInBhdHRlcm5fZ3QiLCJwYXR0ZXJuX3BhcmEiLCJvcCIsImRhdGEiLCJyZXBsYWNlIiwiam9pbiIsImxldmVuc2h0ZWluIiwiaW5zZXJ0aW9ucyIsImRlbGV0aW9ucyIsImVuY29kZVVSSSIsImRpZmZzTGVuZ3RoIiwidG9rZW5zIiwic3BsaXQiLCJwYXJhbSIsImRlY29kZVVSSSIsImV4IiwibiIsInBhcnNlSW50IiwiaXNOYU4iLCJjaGFyQ29kZUF0Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztRQ1ZBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNB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VUFBTixDQUFpQmxMLENBQWpCLENBQUQsQ0FBbkI7QUFDRDs7QUFDRDBELGFBQUssQ0FBQzVELENBQUQsQ0FBTCxDQUFTLENBQVQsSUFBY1ksSUFBSSxDQUFDMEosSUFBTCxDQUFVLEVBQVYsQ0FBZDtBQUNEO0FBQ0YiLCJmaWxlIjoiZGlmZi1wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRpZmZQYXJzZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGlmZlBhcnNlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEaWZmUGFyc2VyXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJleHBvcnQgY29uc3QgRElGRl9ERUxFVEUgPSAtMTtcbmV4cG9ydCBjb25zdCBESUZGX0lOU0VSVCA9IDE7XG5leHBvcnQgY29uc3QgRElGRl9FUVVBTCA9IDA7XG5cbi8vIERlZmluZSBzb21lIHJlZ2V4IHBhdHRlcm5zIGZvciBtYXRjaGluZyBib3VuZGFyaWVzLlxuZXhwb3J0IGNvbnN0IG5vbkFscGhhTnVtZXJpY1JlZ2V4ID0gL1teYS16QS1aMC05XS87XG5leHBvcnQgY29uc3Qgd2hpdGVzcGFjZVJlZ2V4ID0gL1xccy87XG5leHBvcnQgY29uc3QgbGluZWJyZWFrUmVnZXggPSAvW1xcclxcbl0vO1xuZXhwb3J0IGNvbnN0IGJsYW5rTGluZUVuZFJlZ2V4ID0gL1xcblxccj9cXG4kLztcbmV4cG9ydCBjb25zdCBibGFua0xpbmVTdGFydFJlZ2V4ID0gL15cXHI/XFxuXFxyP1xcbi87XG5cbmV4cG9ydCB0eXBlIERpZmYgPSBbbnVtYmVyLCBzdHJpbmddO1xuXG5leHBvcnQgY2xhc3MgUGF0Y2hPYmoge1xuICBkaWZmczogRGlmZltdO1xuICBzdGFydDE6IG51bWJlciB8IG51bGw7XG4gIHN0YXJ0MjogbnVtYmVyIHwgbnVsbDtcbiAgbGVuZ3RoMTogbnVtYmVyO1xuICBsZW5ndGgyOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGlmZkxpbmVzQ2hhcnMge1xuICBjaGFyczE6IHN0cmluZztcbiAgY2hhcnMyOiBzdHJpbmc7XG4gIGxpbmVBcnJheTogc3RyaW5nW107XG59XG4iLCIvKipcbiAqIERldGVybWluZSB0aGUgY29tbW9uIHByZWZpeCBvZiB0d28gc3RyaW5ncy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBGaXJzdCBzdHJpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgU2Vjb25kIHN0cmluZy5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIGNvbW1vbiB0byB0aGUgc3RhcnQgb2YgZWFjaFxuICogICAgIHN0cmluZy5cbiAqL1xuaW1wb3J0IHtcbiAgYmxhbmtMaW5lRW5kUmVnZXgsXG4gIGJsYW5rTGluZVN0YXJ0UmVnZXgsXG4gIGxpbmVicmVha1JlZ2V4LFxuICBub25BbHBoYU51bWVyaWNSZWdleCxcbiAgd2hpdGVzcGFjZVJlZ2V4LFxufSBmcm9tICcuL21vZGVsJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbW1vblByZWZpeCh0ZXh0MSwgdGV4dDIpOiBudW1iZXIge1xuICAvLyBRdWljayBjaGVjayBmb3IgY29tbW9uIG51bGwgY2FzZXMuXG4gIGlmICghdGV4dDEgfHwgIXRleHQyIHx8IHRleHQxLmNoYXJBdCgwKSAhPSB0ZXh0Mi5jaGFyQXQoMCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICAvLyBCaW5hcnkgc2VhcmNoLlxuICAvLyBQZXJmb3JtYW5jZSBhbmFseXNpczogaHR0cHM6Ly9uZWlsLmZyYXNlci5uYW1lL25ld3MvMjAwNy8xMC8wOS9cbiAgbGV0IHBvaW50ZXJNaW4gPSAwO1xuICBsZXQgcG9pbnRlck1heCA9IE1hdGgubWluKHRleHQxLmxlbmd0aCwgdGV4dDIubGVuZ3RoKTtcbiAgbGV0IHBvaW50ZXJNaWQgPSBwb2ludGVyTWF4O1xuICBsZXQgcG9pbnRlclN0YXJ0ID0gMDtcbiAgd2hpbGUgKHBvaW50ZXJNaW4gPCBwb2ludGVyTWlkKSB7XG4gICAgaWYgKHRleHQxLnN1YnN0cmluZyhwb2ludGVyU3RhcnQsIHBvaW50ZXJNaWQpID09IHRleHQyLnN1YnN0cmluZyhwb2ludGVyU3RhcnQsIHBvaW50ZXJNaWQpKSB7XG4gICAgICBwb2ludGVyTWluID0gcG9pbnRlck1pZDtcbiAgICAgIHBvaW50ZXJTdGFydCA9IHBvaW50ZXJNaW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50ZXJNYXggPSBwb2ludGVyTWlkO1xuICAgIH1cbiAgICBwb2ludGVyTWlkID0gTWF0aC5mbG9vcigocG9pbnRlck1heCAtIHBvaW50ZXJNaW4pIC8gMiArIHBvaW50ZXJNaW4pO1xuICB9XG4gIHJldHVybiBwb2ludGVyTWlkO1xufVxuXG4vKipcbiAqIERldGVybWluZSB0aGUgY29tbW9uIHN1ZmZpeCBvZiB0d28gc3RyaW5ncy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBGaXJzdCBzdHJpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgU2Vjb25kIHN0cmluZy5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGFyYWN0ZXJzIGNvbW1vbiB0byB0aGUgZW5kIG9mIGVhY2ggc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tbW9uU3VmZml4KHRleHQxLCB0ZXh0Mikge1xuICAvLyBRdWljayBjaGVjayBmb3IgY29tbW9uIG51bGwgY2FzZXMuXG4gIGlmICghdGV4dDEgfHwgIXRleHQyIHx8IHRleHQxLmNoYXJBdCh0ZXh0MS5sZW5ndGggLSAxKSAhPSB0ZXh0Mi5jaGFyQXQodGV4dDIubGVuZ3RoIC0gMSkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICAvLyBCaW5hcnkgc2VhcmNoLlxuICAvLyBQZXJmb3JtYW5jZSBhbmFseXNpczogaHR0cHM6Ly9uZWlsLmZyYXNlci5uYW1lL25ld3MvMjAwNy8xMC8wOS9cbiAgbGV0IHBvaW50ZXJNaW4gPSAwO1xuICBsZXQgcG9pbnRlck1heCA9IE1hdGgubWluKHRleHQxLmxlbmd0aCwgdGV4dDIubGVuZ3RoKTtcbiAgbGV0IHBvaW50ZXJNaWQgPSBwb2ludGVyTWF4O1xuICBsZXQgcG9pbnRlckVuZCA9IDA7XG4gIHdoaWxlIChwb2ludGVyTWluIDwgcG9pbnRlck1pZCkge1xuICAgIGlmIChcbiAgICAgIHRleHQxLnN1YnN0cmluZyh0ZXh0MS5sZW5ndGggLSBwb2ludGVyTWlkLCB0ZXh0MS5sZW5ndGggLSBwb2ludGVyRW5kKSA9PVxuICAgICAgdGV4dDIuc3Vic3RyaW5nKHRleHQyLmxlbmd0aCAtIHBvaW50ZXJNaWQsIHRleHQyLmxlbmd0aCAtIHBvaW50ZXJFbmQpXG4gICAgKSB7XG4gICAgICBwb2ludGVyTWluID0gcG9pbnRlck1pZDtcbiAgICAgIHBvaW50ZXJFbmQgPSBwb2ludGVyTWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb2ludGVyTWF4ID0gcG9pbnRlck1pZDtcbiAgICB9XG4gICAgcG9pbnRlck1pZCA9IE1hdGguZmxvb3IoKHBvaW50ZXJNYXggLSBwb2ludGVyTWluKSAvIDIgKyBwb2ludGVyTWluKTtcbiAgfVxuICByZXR1cm4gcG9pbnRlck1pZDtcbn1cblxuLyoqXG4gKiBEb2VzIGEgc3Vic3RyaW5nIG9mIHNob3J0VGV4dCBleGlzdCB3aXRoaW4gbG9uZ1RleHQgc3VjaCB0aGF0IHRoZSBzdWJzdHJpbmdcbiAqIGlzIGF0IGxlYXN0IGhhbGYgdGhlIGxlbmd0aCBvZiBsb25nVGV4dD9cbiAqIENsb3N1cmUsIGJ1dCBkb2VzIG5vdCByZWZlcmVuY2UgYW55IGV4dGVybmFsIHZhcmlhYmxlcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBsb25nVGV4dCBMb25nZXIgc3RyaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IHNob3J0VGV4dCBTaG9ydGVyIHN0cmluZy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBpIFN0YXJ0IGluZGV4IG9mIHF1YXJ0ZXIgbGVuZ3RoIHN1YnN0cmluZyB3aXRoaW4gbG9uZ1RleHQuXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gRml2ZSBlbGVtZW50IEFycmF5LCBjb250YWluaW5nIHRoZSBwcmVmaXggb2ZcbiAqICAgICBsb25nVGV4dCwgdGhlIHN1ZmZpeCBvZiBsb25nVGV4dCwgdGhlIHByZWZpeCBvZiBzaG9ydFRleHQsIHRoZSBzdWZmaXhcbiAqICAgICBvZiBzaG9ydFRleHQgYW5kIHRoZSBjb21tb24gbWlkZGxlLiAgT3IgbnVsbCBpZiB0aGVyZSB3YXMgbm8gbWF0Y2guXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYWxmTWF0Y2hJKGxvbmdUZXh0OiBzdHJpbmcsIHNob3J0VGV4dDogc3RyaW5nLCBpOiBudW1iZXIpOiBzdHJpbmdbXSB7XG4gIC8vIFN0YXJ0IHdpdGggYSAxLzQgbGVuZ3RoIHN1YnN0cmluZyBhdCBwb3NpdGlvbiBpIGFzIGEgc2VlZC5cbiAgY29uc3Qgc2VlZCA9IGxvbmdUZXh0LnN1YnN0cmluZyhpLCBpICsgTWF0aC5mbG9vcihsb25nVGV4dC5sZW5ndGggLyA0KSk7XG4gIGxldCBqID0gLTE7XG4gIGxldCBiZXN0Q29tbW9uID0gJyc7XG4gIGxldCBiZXN0TG9uZ1RleHRBLCBiZXN0TG9uZ1RleHRCLCBiZXN0U2hvcnRUZXh0QSwgYmVzdFNob3J0VGV4dEI7XG4gIHdoaWxlICgoaiA9IHNob3J0VGV4dC5pbmRleE9mKHNlZWQsIGogKyAxKSkgIT0gLTEpIHtcbiAgICBjb25zdCBwcmVmaXhMZW5ndGggPSBjb21tb25QcmVmaXgobG9uZ1RleHQuc3Vic3RyaW5nKGkpLCBzaG9ydFRleHQuc3Vic3RyaW5nKGopKTtcbiAgICBjb25zdCBzdWZmaXhMZW5ndGggPSBjb21tb25TdWZmaXgobG9uZ1RleHQuc3Vic3RyaW5nKDAsIGkpLCBzaG9ydFRleHQuc3Vic3RyaW5nKDAsIGopKTtcbiAgICBpZiAoYmVzdENvbW1vbi5sZW5ndGggPCBzdWZmaXhMZW5ndGggKyBwcmVmaXhMZW5ndGgpIHtcbiAgICAgIGJlc3RDb21tb24gPSBzaG9ydFRleHQuc3Vic3RyaW5nKGogLSBzdWZmaXhMZW5ndGgsIGopICsgc2hvcnRUZXh0LnN1YnN0cmluZyhqLCBqICsgcHJlZml4TGVuZ3RoKTtcbiAgICAgIGJlc3RMb25nVGV4dEEgPSBsb25nVGV4dC5zdWJzdHJpbmcoMCwgaSAtIHN1ZmZpeExlbmd0aCk7XG4gICAgICBiZXN0TG9uZ1RleHRCID0gbG9uZ1RleHQuc3Vic3RyaW5nKGkgKyBwcmVmaXhMZW5ndGgpO1xuICAgICAgYmVzdFNob3J0VGV4dEEgPSBzaG9ydFRleHQuc3Vic3RyaW5nKDAsIGogLSBzdWZmaXhMZW5ndGgpO1xuICAgICAgYmVzdFNob3J0VGV4dEIgPSBzaG9ydFRleHQuc3Vic3RyaW5nKGogKyBwcmVmaXhMZW5ndGgpO1xuICAgIH1cbiAgfVxuICBpZiAoYmVzdENvbW1vbi5sZW5ndGggKiAyID49IGxvbmdUZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiBbYmVzdExvbmdUZXh0QSwgYmVzdExvbmdUZXh0QiwgYmVzdFNob3J0VGV4dEEsIGJlc3RTaG9ydFRleHRCLCBiZXN0Q29tbW9uXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFNwbGl0IGEgdGV4dCBpbnRvIGFuIGFycmF5IG9mIHN0cmluZ3MuICBSZWR1Y2UgdGhlIHRleHRzIHRvIGEgc3RyaW5nIG9mXG4gKiBoYXNoZXMgd2hlcmUgZWFjaCBVbmljb2RlIGNoYXJhY3RlciByZXByZXNlbnRzIG9uZSBsaW5lLlxuICogTW9kaWZpZXMgbGluZWFycmF5IGFuZCBsaW5laGFzaCB0aHJvdWdoIGJlaW5nIGEgY2xvc3VyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFN0cmluZyB0byBlbmNvZGUuXG4gKiBAcGFyYW0geyFBcnJheTxzdHJpbmc+fSBsaW5lQXJyYXlcbiAqIEBwYXJhbSB7YW55fSBsaW5lSGFzaFxuICogQHBhcmFtIG1heExpbmVzXG4gKiBAcmV0dXJuIHtzdHJpbmd9IEVuY29kZWQgc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGluZXNUb0NoYXJzTXVuZ2UodGV4dDogc3RyaW5nLCBsaW5lQXJyYXk6IHN0cmluZ1tdLCBsaW5lSGFzaDogYW55LCBtYXhMaW5lczogbnVtYmVyKTogc3RyaW5nIHtcbiAgbGV0IGNoYXJzID0gJyc7XG4gIC8vIFdhbGsgdGhlIHRleHQsIHB1bGxpbmcgb3V0IGEgc3Vic3RyaW5nIGZvciBlYWNoIGxpbmUuXG4gIC8vIHRleHQuc3BsaXQoJ1xcbicpIHdvdWxkIHdvdWxkIHRlbXBvcmFyaWx5IGRvdWJsZSBvdXIgbWVtb3J5IGZvb3RwcmludC5cbiAgLy8gTW9kaWZ5aW5nIHRleHQgd291bGQgY3JlYXRlIG1hbnkgbGFyZ2Ugc3RyaW5ncyB0byBnYXJiYWdlIGNvbGxlY3QuXG4gIGxldCBsaW5lU3RhcnQgPSAwO1xuICBsZXQgbGluZUVuZCA9IC0xO1xuICAvLyBLZWVwaW5nIG91ciBvd24gbGVuZ3RoIHZhcmlhYmxlIGlzIGZhc3RlciB0aGFuIGxvb2tpbmcgaXQgdXAuXG4gIGxldCBsaW5lQXJyYXlMZW5ndGggPSBsaW5lQXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGluZUVuZCA8IHRleHQubGVuZ3RoIC0gMSkge1xuICAgIGxpbmVFbmQgPSB0ZXh0LmluZGV4T2YoJ1xcbicsIGxpbmVTdGFydCk7XG4gICAgaWYgKGxpbmVFbmQgPT0gLTEpIHtcbiAgICAgIGxpbmVFbmQgPSB0ZXh0Lmxlbmd0aCAtIDE7XG4gICAgfVxuICAgIGxldCBsaW5lID0gdGV4dC5zdWJzdHJpbmcobGluZVN0YXJ0LCBsaW5lRW5kICsgMSk7XG5cbiAgICBpZiAobGluZUhhc2guaGFzT3duUHJvcGVydHkgPyBsaW5lSGFzaC5oYXNPd25Qcm9wZXJ0eShsaW5lKSA6IGxpbmVIYXNoW2xpbmVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNoYXJzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUobGluZUhhc2hbbGluZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobGluZUFycmF5TGVuZ3RoID09IG1heExpbmVzKSB7XG4gICAgICAgIC8vIEJhaWwgb3V0IGF0IDY1NTM1IGJlY2F1c2VcbiAgICAgICAgLy8gU3RyaW5nLmZyb21DaGFyQ29kZSg2NTUzNikgPT0gU3RyaW5nLmZyb21DaGFyQ29kZSgwKVxuICAgICAgICBsaW5lID0gdGV4dC5zdWJzdHJpbmcobGluZVN0YXJ0KTtcbiAgICAgICAgbGluZUVuZCA9IHRleHQubGVuZ3RoO1xuICAgICAgfVxuICAgICAgY2hhcnMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShsaW5lQXJyYXlMZW5ndGgpO1xuICAgICAgbGluZUhhc2hbbGluZV0gPSBsaW5lQXJyYXlMZW5ndGg7XG4gICAgICBsaW5lQXJyYXlbbGluZUFycmF5TGVuZ3RoKytdID0gbGluZTtcbiAgICB9XG4gICAgbGluZVN0YXJ0ID0gbGluZUVuZCArIDE7XG4gIH1cbiAgcmV0dXJuIGNoYXJzO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBzdHJpbmdzLCBjb21wdXRlIGEgc2NvcmUgcmVwcmVzZW50aW5nIHdoZXRoZXIgdGhlIGludGVybmFsXG4gKiBib3VuZGFyeSBmYWxscyBvbiBsb2dpY2FsIGJvdW5kYXJpZXMuXG4gKiBTY29yZXMgcmFuZ2UgZnJvbSA2IChiZXN0KSB0byAwICh3b3JzdCkuXG4gKiBDbG9zdXJlLCBidXQgZG9lcyBub3QgcmVmZXJlbmNlIGFueSBleHRlcm5hbCB2YXJpYWJsZXMuXG4gKiBAcGFyYW0ge3N0cmluZ30gb25lIEZpcnN0IHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0d28gU2Vjb25kIHN0cmluZy5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIHNjb3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW51cFNlbWFudGljU2NvcmUob25lOiBzdHJpbmcsIHR3bzogc3RyaW5nKTogbnVtYmVyIHtcbiAgaWYgKCFvbmUgfHwgIXR3bykge1xuICAgIC8vIEVkZ2VzIGFyZSB0aGUgYmVzdC5cbiAgICByZXR1cm4gNjtcbiAgfVxuXG4gIC8vIEVhY2ggcG9ydCBvZiB0aGlzIGZ1bmN0aW9uIGJlaGF2ZXMgc2xpZ2h0bHkgZGlmZmVyZW50bHkgZHVlIHRvXG4gIC8vIHN1YnRsZSBkaWZmZXJlbmNlcyBpbiBlYWNoIGxhbmd1YWdlJ3MgZGVmaW5pdGlvbiBvZiB0aGluZ3MgbGlrZVxuICAvLyAnd2hpdGVzcGFjZScuICBTaW5jZSB0aGlzIGZ1bmN0aW9uJ3MgcHVycG9zZSBpcyBsYXJnZWx5IGNvc21ldGljLFxuICAvLyB0aGUgY2hvaWNlIGhhcyBiZWVuIG1hZGUgdG8gdXNlIGVhY2ggbGFuZ3VhZ2UncyBuYXRpdmUgZmVhdHVyZXNcbiAgLy8gcmF0aGVyIHRoYW4gZm9yY2UgdG90YWwgY29uZm9ybWl0eS5cbiAgY29uc3QgY2hhcjEgPSBvbmUuY2hhckF0KG9uZS5sZW5ndGggLSAxKTtcbiAgY29uc3QgY2hhcjIgPSB0d28uY2hhckF0KDApO1xuICBjb25zdCBub25BbHBoYU51bWVyaWMxID0gY2hhcjEubWF0Y2gobm9uQWxwaGFOdW1lcmljUmVnZXgpO1xuICBjb25zdCBub25BbHBoYU51bWVyaWMyID0gY2hhcjIubWF0Y2gobm9uQWxwaGFOdW1lcmljUmVnZXgpO1xuICBjb25zdCB3aGl0ZXNwYWNlMSA9IG5vbkFscGhhTnVtZXJpYzEgJiYgY2hhcjEubWF0Y2god2hpdGVzcGFjZVJlZ2V4KTtcbiAgY29uc3Qgd2hpdGVzcGFjZTIgPSBub25BbHBoYU51bWVyaWMyICYmIGNoYXIyLm1hdGNoKHdoaXRlc3BhY2VSZWdleCk7XG4gIGNvbnN0IGxpbmVCcmVhazEgPSB3aGl0ZXNwYWNlMSAmJiBjaGFyMS5tYXRjaChsaW5lYnJlYWtSZWdleCk7XG4gIGNvbnN0IGxpbmVCcmVhazIgPSB3aGl0ZXNwYWNlMiAmJiBjaGFyMi5tYXRjaChsaW5lYnJlYWtSZWdleCk7XG4gIGNvbnN0IGJsYW5rTGluZTEgPSBsaW5lQnJlYWsxICYmIG9uZS5tYXRjaChibGFua0xpbmVFbmRSZWdleCk7XG4gIGNvbnN0IGJsYW5rTGluZTIgPSBsaW5lQnJlYWsyICYmIHR3by5tYXRjaChibGFua0xpbmVTdGFydFJlZ2V4KTtcblxuICBpZiAoYmxhbmtMaW5lMSB8fCBibGFua0xpbmUyKSB7XG4gICAgLy8gRml2ZSBwb2ludHMgZm9yIGJsYW5rIGxpbmVzLlxuICAgIHJldHVybiA1O1xuICB9IGVsc2UgaWYgKGxpbmVCcmVhazEgfHwgbGluZUJyZWFrMikge1xuICAgIC8vIEZvdXIgcG9pbnRzIGZvciBsaW5lIGJyZWFrcy5cbiAgICByZXR1cm4gNDtcbiAgfSBlbHNlIGlmIChub25BbHBoYU51bWVyaWMxICYmICF3aGl0ZXNwYWNlMSAmJiB3aGl0ZXNwYWNlMikge1xuICAgIC8vIFRocmVlIHBvaW50cyBmb3IgZW5kIG9mIHNlbnRlbmNlcy5cbiAgICByZXR1cm4gMztcbiAgfSBlbHNlIGlmICh3aGl0ZXNwYWNlMSB8fCB3aGl0ZXNwYWNlMikge1xuICAgIC8vIFR3byBwb2ludHMgZm9yIHdoaXRlc3BhY2UuXG4gICAgcmV0dXJuIDI7XG4gIH0gZWxzZSBpZiAobm9uQWxwaGFOdW1lcmljMSB8fCBub25BbHBoYU51bWVyaWMyKSB7XG4gICAgLy8gT25lIHBvaW50IGZvciBub24tYWxwaGFudW1lcmljLlxuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiB0aGUgc3VmZml4IG9mIG9uZSBzdHJpbmcgaXMgdGhlIHByZWZpeCBvZiBhbm90aGVyLlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQxIEZpcnN0IHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBTZWNvbmQgc3RyaW5nLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgY29tbW9uIHRvIHRoZSBlbmQgb2YgdGhlIGZpcnN0XG4gKiAgICAgc3RyaW5nIGFuZCB0aGUgc3RhcnQgb2YgdGhlIHNlY29uZCBzdHJpbmcuXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tbW9uT3ZlcmxhcCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nKTogbnVtYmVyIHtcbiAgLy8gQ2FjaGUgdGhlIHRleHQgbGVuZ3RocyB0byBwcmV2ZW50IG11bHRpcGxlIGNhbGxzLlxuICBjb25zdCB0ZXh0MV9sZW5ndGggPSB0ZXh0MS5sZW5ndGg7XG4gIGNvbnN0IHRleHQyX2xlbmd0aCA9IHRleHQyLmxlbmd0aDtcbiAgLy8gRWxpbWluYXRlIHRoZSBudWxsIGNhc2UuXG4gIGlmICh0ZXh0MV9sZW5ndGggPT0gMCB8fCB0ZXh0Ml9sZW5ndGggPT0gMCkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIC8vIFRydW5jYXRlIHRoZSBsb25nZXIgc3RyaW5nLlxuICBpZiAodGV4dDFfbGVuZ3RoID4gdGV4dDJfbGVuZ3RoKSB7XG4gICAgdGV4dDEgPSB0ZXh0MS5zdWJzdHJpbmcodGV4dDFfbGVuZ3RoIC0gdGV4dDJfbGVuZ3RoKTtcbiAgfSBlbHNlIGlmICh0ZXh0MV9sZW5ndGggPCB0ZXh0Ml9sZW5ndGgpIHtcbiAgICB0ZXh0MiA9IHRleHQyLnN1YnN0cmluZygwLCB0ZXh0MV9sZW5ndGgpO1xuICB9XG4gIGNvbnN0IHRleHRfbGVuZ3RoID0gTWF0aC5taW4odGV4dDFfbGVuZ3RoLCB0ZXh0Ml9sZW5ndGgpO1xuICAvLyBRdWljayBjaGVjayBmb3IgdGhlIHdvcnN0IGNhc2UuXG4gIGlmICh0ZXh0MSA9PSB0ZXh0Mikge1xuICAgIHJldHVybiB0ZXh0X2xlbmd0aDtcbiAgfVxuXG4gIC8vIFN0YXJ0IGJ5IGxvb2tpbmcgZm9yIGEgc2luZ2xlIGNoYXJhY3RlciBtYXRjaFxuICAvLyBhbmQgaW5jcmVhc2UgbGVuZ3RoIHVudGlsIG5vIG1hdGNoIGlzIGZvdW5kLlxuICAvLyBQZXJmb3JtYW5jZSBhbmFseXNpczogaHR0cHM6Ly9uZWlsLmZyYXNlci5uYW1lL25ld3MvMjAxMC8xMS8wNC9cbiAgbGV0IGJlc3QgPSAwO1xuICBsZXQgbGVuZ3RoID0gMTtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gdGV4dDEuc3Vic3RyaW5nKHRleHRfbGVuZ3RoIC0gbGVuZ3RoKTtcbiAgICBjb25zdCBmb3VuZCA9IHRleHQyLmluZGV4T2YocGF0dGVybik7XG4gICAgaWYgKGZvdW5kID09IC0xKSB7XG4gICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG4gICAgbGVuZ3RoICs9IGZvdW5kO1xuICAgIGlmIChmb3VuZCA9PSAwIHx8IHRleHQxLnN1YnN0cmluZyh0ZXh0X2xlbmd0aCAtIGxlbmd0aCkgPT0gdGV4dDIuc3Vic3RyaW5nKDAsIGxlbmd0aCkpIHtcbiAgICAgIGJlc3QgPSBsZW5ndGg7XG4gICAgICBsZW5ndGgrKztcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IERpZmYsIERJRkZfREVMRVRFLCBESUZGX0VRVUFMLCBESUZGX0lOU0VSVCwgRGlmZkxpbmVzQ2hhcnMgfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuLyoqXG4gKiBEaWZmUGFyc2VyIE1hdGNoIGFuZCBQYXRjaFxuICogQ29weXJpZ2h0IDIwMTggVGhlIGRpZmYtbWF0Y2gtcGF0Y2ggQXV0aG9ycy5cbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9nb29nbGUvZGlmZi1tYXRjaC1wYXRjaFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENvbXB1dGVzIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdHdvIHRleHRzIHRvIGNyZWF0ZSBhIHBhdGNoLlxuICogQXBwbGllcyB0aGUgcGF0Y2ggb250byBhbm90aGVyIHRleHQsIGFsbG93aW5nIGZvciBlcnJvcnMuXG4gKiBAYXV0aG9yIGZyYXNlckBnb29nbGUuY29tIChOZWlsIEZyYXNlcilcbiAqL1xuXG4vKipcbiAqIENsYXNzIGNvbnRhaW5pbmcgdGhlIGRpZmYsIG1hdGNoIGFuZCBwYXRjaCBtZXRob2RzLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpZmZQYXJzZXIge1xuICAvLyBEZWZhdWx0cy5cbiAgLy8gUmVkZWZpbmUgdGhlc2UgaW4geW91ciBwcm9ncmFtIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0cy5cblxuICAvLyBOdW1iZXIgb2Ygc2Vjb25kcyB0byBtYXAgYSBkaWZmIGJlZm9yZSBnaXZpbmcgdXAgKDAgZm9yIGluZmluaXR5KS5cbiAgZGlmZlRpbWVvdXQgPSAxLjA7XG4gIC8vIENvc3Qgb2YgYW4gZW1wdHkgZWRpdCBvcGVyYXRpb24gaW4gdGVybXMgb2YgZWRpdCBjaGFyYWN0ZXJzLlxuICBkaWZmRWRpdENvc3QgPSA0O1xuICAvLyBBdCB3aGF0IHBvaW50IGlzIG5vIG1hdGNoIGRlY2xhcmVkICgwLjAgPSBwZXJmZWN0aW9uLCAxLjAgPSB2ZXJ5IGxvb3NlKS5cbiAgbWF0Y2hUaHJlc2hvbGQgPSAwLjU7XG4gIC8vIEhvdyBmYXIgdG8gc2VhcmNoIGZvciBhIG1hdGNoICgwID0gZXhhY3QgbG9jYXRpb24sIDEwMDArID0gYnJvYWQgbWF0Y2gpLlxuICAvLyBBIG1hdGNoIHRoaXMgbWFueSBjaGFyYWN0ZXJzIGF3YXkgZnJvbSB0aGUgZXhwZWN0ZWQgbG9jYXRpb24gd2lsbCBhZGRcbiAgLy8gMS4wIHRvIHRoZSBzY29yZSAoMC4wIGlzIGEgcGVyZmVjdCBtYXRjaCkuXG4gIG1hdGNoRGlzdGFuY2UgPSAxMDAwO1xuICAvLyBXaGVuIGRlbGV0aW5nIGEgbGFyZ2UgYmxvY2sgb2YgdGV4dCAob3ZlciB+NjQgY2hhcmFjdGVycyksIGhvdyBjbG9zZSBkb1xuICAvLyB0aGUgY29udGVudHMgaGF2ZSB0byBiZSB0byBtYXRjaCB0aGUgZXhwZWN0ZWQgY29udGVudHMuICgwLjAgPSBwZXJmZWN0aW9uLFxuICAvLyAxLjAgPSB2ZXJ5IGxvb3NlKS4gIE5vdGUgdGhhdCBNYXRjaFRocmVzaG9sZCBjb250cm9scyBob3cgY2xvc2VseSB0aGVcbiAgLy8gZW5kIHBvaW50cyBvZiBhIGRlbGV0ZSBuZWVkIHRvIG1hdGNoLlxuICBwYXRjaERlbGV0ZVRocmVzaG9sZCA9IDAuNTtcbiAgLy8gQ2h1bmsgc2l6ZSBmb3IgY29udGV4dCBsZW5ndGguXG4gIHBhdGNoTWFyZ2luID0gNDtcblxuICAvLyBUaGUgbnVtYmVyIG9mIGJpdHMgaW4gYW4gaW50LlxuICBtYXRjaE1heEJpdHMgPSAzMjtcblxuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gdHdvIHRleHRzLiAgU2ltcGxpZmllcyB0aGUgcHJvYmxlbSBieSBzdHJpcHBpbmdcbiAgICogYW55IGNvbW1vbiBwcmVmaXggb3Igc3VmZml4IG9mZiB0aGUgdGV4dHMgYmVmb3JlIGRpZmZpbmcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBPbGQgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIE5ldyBzdHJpbmcgdG8gYmUgZGlmZmVkLlxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBjaGVja0xpbmVzIE9wdGlvbmFsIHNwZWVkdXAgZmxhZy4gSWYgcHJlc2VudCBhbmQgZmFsc2UsXG4gICAqICAgICB0aGVuIGRvbid0IHJ1biBhIGxpbmUtbGV2ZWwgZGlmZiBmaXJzdCB0byBpZGVudGlmeSB0aGUgY2hhbmdlZCBhcmVhcy5cbiAgICogICAgIERlZmF1bHRzIHRvIHRydWUsIHdoaWNoIGRvZXMgYSBmYXN0ZXIsIHNsaWdodGx5IGxlc3Mgb3B0aW1hbCBkaWZmLlxuICAgKiBAcGFyYW0ge251bWJlcj19IGRlYWRMaW5lIE9wdGlvbmFsIHRpbWUgd2hlbiB0aGUgZGlmZiBzaG91bGQgYmUgY29tcGxldGVcbiAgICogICAgIGJ5LiAgVXNlZCBpbnRlcm5hbGx5IGZvciByZWN1cnNpdmUgY2FsbHMuICBVc2VycyBzaG91bGQgc2V0IERpZmZUaW1lb3V0XG4gICAqICAgICBpbnN0ZWFkLlxuICAgKiBAcmV0dXJuIHtBcnJheS48RGlmZj59IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICAgKi9cbiAgcHVibGljIGRpZmZNYWluKHRleHQxOiBzdHJpbmcsIHRleHQyOiBzdHJpbmcsIGNoZWNrTGluZXM/OiBib29sZWFuLCBkZWFkTGluZT86IG51bWJlcik6IERpZmZbXSB7XG4gICAgLy8gU2V0IGEgZGVhZGxpbmUgYnkgd2hpY2ggdGltZSB0aGUgZGlmZiBtdXN0IGJlIGNvbXBsZXRlLlxuICAgIGlmICh0eXBlb2YgZGVhZExpbmUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLmRpZmZUaW1lb3V0IDw9IDApIHtcbiAgICAgICAgZGVhZExpbmUgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVhZExpbmUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIHRoaXMuZGlmZlRpbWVvdXQgKiAxMDAwO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBkZWFkbGluZSA9IGRlYWRMaW5lO1xuXG4gICAgLy8gQ2hlY2sgZm9yIG51bGwgaW5wdXRzLlxuICAgIGlmICh0ZXh0MSA9PSBudWxsIHx8IHRleHQyID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTnVsbCBpbnB1dC4gKGRpZmZfbWFpbiknKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgZXF1YWxpdHkgKHNwZWVkdXApLlxuICAgIGlmICh0ZXh0MSA9PSB0ZXh0Mikge1xuICAgICAgaWYgKHRleHQxKSB7XG4gICAgICAgIGNvbnN0IGRpZmY6IERpZmYgPSBbRElGRl9FUVVBTCwgdGV4dDFdO1xuICAgICAgICByZXR1cm4gW2RpZmZdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2hlY2tMaW5lcyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgY2hlY2tMaW5lcyA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGNoZWNrbGluZXMgPSBjaGVja0xpbmVzO1xuXG4gICAgLy8gVHJpbSBvZmYgY29tbW9uIHByZWZpeCAoc3BlZWR1cCkuXG4gICAgbGV0IGNvbW1vbkxlbmd0aCA9IHV0aWxzLmNvbW1vblByZWZpeCh0ZXh0MSwgdGV4dDIpO1xuICAgIGxldCBjb21tb25QcmVmaXggPSB0ZXh0MS5zdWJzdHJpbmcoMCwgY29tbW9uTGVuZ3RoKTtcbiAgICB0ZXh0MSA9IHRleHQxLnN1YnN0cmluZyhjb21tb25MZW5ndGgpO1xuICAgIHRleHQyID0gdGV4dDIuc3Vic3RyaW5nKGNvbW1vbkxlbmd0aCk7XG5cbiAgICAvLyBUcmltIG9mZiBjb21tb24gc3VmZml4IChzcGVlZHVwKS5cbiAgICBjb21tb25MZW5ndGggPSB1dGlscy5jb21tb25TdWZmaXgodGV4dDEsIHRleHQyKTtcbiAgICBjb25zdCBjb21tb25TdWZmaXggPSB0ZXh0MS5zdWJzdHJpbmcodGV4dDEubGVuZ3RoIC0gY29tbW9uTGVuZ3RoKTtcbiAgICB0ZXh0MSA9IHRleHQxLnN1YnN0cmluZygwLCB0ZXh0MS5sZW5ndGggLSBjb21tb25MZW5ndGgpO1xuICAgIHRleHQyID0gdGV4dDIuc3Vic3RyaW5nKDAsIHRleHQyLmxlbmd0aCAtIGNvbW1vbkxlbmd0aCk7XG5cbiAgICAvLyBDb21wdXRlIHRoZSBkaWZmIG9uIHRoZSBtaWRkbGUgYmxvY2suXG4gICAgY29uc3QgZGlmZnM6IERpZmZbXSA9IHRoaXMuY29tcHV0ZSh0ZXh0MSwgdGV4dDIsIGNoZWNrbGluZXMsIGRlYWRsaW5lKTtcblxuICAgIC8vIFJlc3RvcmUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgIGlmIChjb21tb25QcmVmaXgpIHtcbiAgICAgIGRpZmZzLnVuc2hpZnQoW0RJRkZfRVFVQUwsIGNvbW1vblByZWZpeF0pO1xuICAgIH1cbiAgICBpZiAoY29tbW9uU3VmZml4KSB7XG4gICAgICBkaWZmcy5wdXNoKFtESUZGX0VRVUFMLCBjb21tb25TdWZmaXhdKTtcbiAgICB9XG4gICAgdGhpcy5jbGVhbnVwTWVyZ2UoZGlmZnMpO1xuICAgIHJldHVybiBkaWZmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIHR3byB0ZXh0cy4gIEFzc3VtZXMgdGhhdCB0aGUgdGV4dHMgZG8gbm90XG4gICAqIGhhdmUgYW55IGNvbW1vbiBwcmVmaXggb3Igc3VmZml4LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgT2xkIHN0cmluZyB0byBiZSBkaWZmZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBOZXcgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja0xpbmVzIFNwZWVkdXAgZmxhZy4gIElmIGZhbHNlLCB0aGVuIGRvbid0IHJ1biBhXG4gICAqICAgICBsaW5lLWxldmVsIGRpZmYgZmlyc3QgdG8gaWRlbnRpZnkgdGhlIGNoYW5nZWQgYXJlYXMuXG4gICAqICAgICBJZiB0cnVlLCB0aGVuIHJ1biBhIGZhc3Rlciwgc2xpZ2h0bHkgbGVzcyBvcHRpbWFsIGRpZmYuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWFkTGluZSBUaW1lIHdoZW4gdGhlIGRpZmYgc2hvdWxkIGJlIGNvbXBsZXRlIGJ5LlxuICAgKiBAcmV0dXJuIHshQXJyYXkuPCFEaWZmPn0gQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGNvbXB1dGUodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZywgY2hlY2tMaW5lczogYm9vbGVhbiwgZGVhZExpbmU6IG51bWJlcik6IERpZmZbXSB7XG4gICAgbGV0IGRpZmZzOiBEaWZmW10gPSBbXTtcblxuICAgIGlmICghdGV4dDEpIHtcbiAgICAgIC8vIEp1c3QgYWRkIHNvbWUgdGV4dCAoc3BlZWR1cCkuXG4gICAgICByZXR1cm4gW1tESUZGX0lOU0VSVCwgdGV4dDJdXTtcbiAgICB9XG5cbiAgICBpZiAoIXRleHQyKSB7XG4gICAgICAvLyBKdXN0IGRlbGV0ZSBzb21lIHRleHQgKHNwZWVkdXApLlxuICAgICAgcmV0dXJuIFtbRElGRl9ERUxFVEUsIHRleHQxXV07XG4gICAgfVxuXG4gICAgY29uc3QgbG9uZ1RleHQgPSB0ZXh0MS5sZW5ndGggPiB0ZXh0Mi5sZW5ndGggPyB0ZXh0MSA6IHRleHQyO1xuICAgIGNvbnN0IHNob3J0VGV4dCA9IHRleHQxLmxlbmd0aCA+IHRleHQyLmxlbmd0aCA/IHRleHQyIDogdGV4dDE7XG4gICAgbGV0IGkgPSBsb25nVGV4dC5pbmRleE9mKHNob3J0VGV4dCk7XG4gICAgaWYgKGkgIT0gLTEpIHtcbiAgICAgIC8vIFNob3J0ZXIgdGV4dCBpcyBpbnNpZGUgdGhlIGxvbmdlciB0ZXh0IChzcGVlZHVwKS5cbiAgICAgIGRpZmZzID0gW1xuICAgICAgICBbRElGRl9JTlNFUlQsIGxvbmdUZXh0LnN1YnN0cmluZygwLCBpKV0sXG4gICAgICAgIFtESUZGX0VRVUFMLCBzaG9ydFRleHRdLFxuICAgICAgICBbRElGRl9JTlNFUlQsIGxvbmdUZXh0LnN1YnN0cmluZyhpICsgc2hvcnRUZXh0Lmxlbmd0aCldLFxuICAgICAgXTtcbiAgICAgIC8vIFN3YXAgaW5zZXJ0aW9ucyBmb3IgZGVsZXRpb25zIGlmIGRpZmYgaXMgcmV2ZXJzZWQuXG4gICAgICBpZiAodGV4dDEubGVuZ3RoID4gdGV4dDIubGVuZ3RoKSB7XG4gICAgICAgIGRpZmZzWzBdWzBdID0gZGlmZnNbMl1bMF0gPSBESUZGX0RFTEVURTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkaWZmcztcbiAgICB9XG5cbiAgICBpZiAoc2hvcnRUZXh0Lmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBTaW5nbGUgY2hhcmFjdGVyIHN0cmluZy5cbiAgICAgIC8vIEFmdGVyIHRoZSBwcmV2aW91cyBzcGVlZHVwLCB0aGUgY2hhcmFjdGVyIGNhbid0IGJlIGFuIGVxdWFsaXR5LlxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgW0RJRkZfREVMRVRFLCB0ZXh0MV0sXG4gICAgICAgIFtESUZGX0lOU0VSVCwgdGV4dDJdLFxuICAgICAgXTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIHByb2JsZW0gY2FuIGJlIHNwbGl0IGluIHR3by5cbiAgICBjb25zdCBobSA9IHRoaXMuaGFsZk1hdGNoKHRleHQxLCB0ZXh0Mik7XG4gICAgaWYgKGhtKSB7XG4gICAgICAvLyBBIGhhbGYtbWF0Y2ggd2FzIGZvdW5kLCBzb3J0IG91dCB0aGUgcmV0dXJuIGRhdGEuXG4gICAgICBjb25zdCB0ZXh0MUEgPSBobVswXTtcbiAgICAgIGNvbnN0IHRleHQxQiA9IGhtWzFdO1xuICAgICAgY29uc3QgdGV4dDJBID0gaG1bMl07XG4gICAgICBjb25zdCB0ZXh0MkIgPSBobVszXTtcbiAgICAgIGNvbnN0IG1pZENvbW1vbiA9IGhtWzRdO1xuICAgICAgLy8gU2VuZCBib3RoIHBhaXJzIG9mZiBmb3Igc2VwYXJhdGUgcHJvY2Vzc2luZy5cbiAgICAgIGNvbnN0IGRpZmZzQSA9IHRoaXMuZGlmZk1haW4odGV4dDFBLCB0ZXh0MkEsIGNoZWNrTGluZXMsIGRlYWRMaW5lKTtcbiAgICAgIGNvbnN0IGRpZmZzQiA9IHRoaXMuZGlmZk1haW4odGV4dDFCLCB0ZXh0MkIsIGNoZWNrTGluZXMsIGRlYWRMaW5lKTtcbiAgICAgIC8vIE1lcmdlIHRoZSByZXN1bHRzLlxuICAgICAgcmV0dXJuIGRpZmZzQS5jb25jYXQoW1tESUZGX0VRVUFMLCBtaWRDb21tb25dXSwgZGlmZnNCKTtcbiAgICB9XG5cbiAgICBpZiAoY2hlY2tMaW5lcyAmJiB0ZXh0MS5sZW5ndGggPiAxMDAgJiYgdGV4dDIubGVuZ3RoID4gMTAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5saW5lTW9kZSh0ZXh0MSwgdGV4dDIsIGRlYWRMaW5lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5iaXNlY3QodGV4dDEsIHRleHQyLCBkZWFkTGluZSk7XG4gIH1cblxuICAvKipcbiAgICogRG8gdGhlIHR3byB0ZXh0cyBzaGFyZSBhIHN1YnN0cmluZyB3aGljaCBpcyBhdCBsZWFzdCBoYWxmIHRoZSBsZW5ndGggb2YgdGhlXG4gICAqIGxvbmdlciB0ZXh0P1xuICAgKiBUaGlzIHNwZWVkdXAgY2FuIHByb2R1Y2Ugbm9uLW1pbmltYWwgZGlmZnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBGaXJzdCBzdHJpbmcuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBTZWNvbmQgc3RyaW5nLlxuICAgKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPn0gRml2ZSBlbGVtZW50IEFycmF5LCBjb250YWluaW5nIHRoZSBwcmVmaXggb2ZcbiAgICogICAgIHRleHQxLCB0aGUgc3VmZml4IG9mIHRleHQxLCB0aGUgcHJlZml4IG9mIHRleHQyLCB0aGUgc3VmZml4IG9mXG4gICAqICAgICB0ZXh0MiBhbmQgdGhlIGNvbW1vbiBtaWRkbGUuICBPciBudWxsIGlmIHRoZXJlIHdhcyBubyBtYXRjaC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgaGFsZk1hdGNoKHRleHQxOiBzdHJpbmcsIHRleHQyOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgaWYgKHRoaXMuZGlmZlRpbWVvdXQgPD0gMCkge1xuICAgICAgLy8gRG9uJ3QgcmlzayByZXR1cm5pbmcgYSBub24tb3B0aW1hbCBkaWZmIGlmIHdlIGhhdmUgdW5saW1pdGVkIHRpbWUuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbG9uZ3RleHQgPSB0ZXh0MS5sZW5ndGggPiB0ZXh0Mi5sZW5ndGggPyB0ZXh0MSA6IHRleHQyO1xuICAgIGNvbnN0IHNob3J0dGV4dCA9IHRleHQxLmxlbmd0aCA+IHRleHQyLmxlbmd0aCA/IHRleHQyIDogdGV4dDE7XG4gICAgaWYgKGxvbmd0ZXh0Lmxlbmd0aCA8IDQgfHwgc2hvcnR0ZXh0Lmxlbmd0aCAqIDIgPCBsb25ndGV4dC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsOyAvLyBQb2ludGxlc3MuXG4gICAgfVxuXG4gICAgLy8gRmlyc3QgY2hlY2sgaWYgdGhlIHNlY29uZCBxdWFydGVyIGlzIHRoZSBzZWVkIGZvciBhIGhhbGYtbWF0Y2guXG4gICAgY29uc3QgaG0xID0gdXRpbHMuaGFsZk1hdGNoSShsb25ndGV4dCwgc2hvcnR0ZXh0LCBNYXRoLmNlaWwobG9uZ3RleHQubGVuZ3RoIC8gNCkpO1xuICAgIC8vIENoZWNrIGFnYWluIGJhc2VkIG9uIHRoZSB0aGlyZCBxdWFydGVyLlxuICAgIGNvbnN0IGhtMiA9IHV0aWxzLmhhbGZNYXRjaEkobG9uZ3RleHQsIHNob3J0dGV4dCwgTWF0aC5jZWlsKGxvbmd0ZXh0Lmxlbmd0aCAvIDIpKTtcbiAgICBsZXQgaG07XG4gICAgaWYgKCFobTEgJiYgIWhtMikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICghaG0yKSB7XG4gICAgICBobSA9IGhtMTtcbiAgICB9IGVsc2UgaWYgKCFobTEpIHtcbiAgICAgIGhtID0gaG0yO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCb3RoIG1hdGNoZWQuICBTZWxlY3QgdGhlIGxvbmdlc3QuXG4gICAgICBobSA9IGhtMVs0XS5sZW5ndGggPiBobTJbNF0ubGVuZ3RoID8gaG0xIDogaG0yO1xuICAgIH1cblxuICAgIC8vIEEgaGFsZi1tYXRjaCB3YXMgZm91bmQsIHNvcnQgb3V0IHRoZSByZXR1cm4gZGF0YS5cbiAgICBsZXQgdGV4dDFBLCB0ZXh0MUIsIHRleHQyQSwgdGV4dDJCO1xuICAgIGlmICh0ZXh0MS5sZW5ndGggPiB0ZXh0Mi5sZW5ndGgpIHtcbiAgICAgIHRleHQxQSA9IGhtWzBdO1xuICAgICAgdGV4dDFCID0gaG1bMV07XG4gICAgICB0ZXh0MkEgPSBobVsyXTtcbiAgICAgIHRleHQyQiA9IGhtWzNdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0MkEgPSBobVswXTtcbiAgICAgIHRleHQyQiA9IGhtWzFdO1xuICAgICAgdGV4dDFBID0gaG1bMl07XG4gICAgICB0ZXh0MUIgPSBobVszXTtcbiAgICB9XG4gICAgY29uc3QgbWlkQ29tbW9uID0gaG1bNF07XG4gICAgcmV0dXJuIFt0ZXh0MUEsIHRleHQxQiwgdGV4dDJBLCB0ZXh0MkIsIG1pZENvbW1vbl07XG4gIH1cblxuICAvKipcbiAgICogRG8gYSBxdWljayBsaW5lLWxldmVsIGRpZmYgb24gYm90aCBzdHJpbmdzLCB0aGVuIHJlZGlmZiB0aGUgcGFydHMgZm9yXG4gICAqIGdyZWF0ZXIgYWNjdXJhY3kuXG4gICAqIFRoaXMgc3BlZWR1cCBjYW4gcHJvZHVjZSBub24tbWluaW1hbCBkaWZmcy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQxIE9sZCBzdHJpbmcgdG8gYmUgZGlmZmVkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgTmV3IHN0cmluZyB0byBiZSBkaWZmZWQuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWFkTGluZSBUaW1lIHdoZW4gdGhlIGRpZmYgc2hvdWxkIGJlIGNvbXBsZXRlIGJ5LlxuICAgKiBAcmV0dXJuIHshQXJyYXkuPCFEaWZmPn0gQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGxpbmVNb2RlKHRleHQxOiBzdHJpbmcsIHRleHQyOiBzdHJpbmcsIGRlYWRMaW5lOiBudW1iZXIpOiBEaWZmW10ge1xuICAgIC8vIFNjYW4gdGhlIHRleHQgb24gYSBsaW5lLWJ5LWxpbmUgYmFzaXMgZmlyc3QuXG4gICAgY29uc3QgYSA9IHRoaXMubGluZXNUb0NoYXJzKHRleHQxLCB0ZXh0Mik7XG4gICAgdGV4dDEgPSBhLmNoYXJzMTtcbiAgICB0ZXh0MiA9IGEuY2hhcnMyO1xuICAgIGNvbnN0IGxpbmVBcnJheSA9IGEubGluZUFycmF5O1xuXG4gICAgY29uc3QgZGlmZnMgPSB0aGlzLmRpZmZNYWluKHRleHQxLCB0ZXh0MiwgZmFsc2UsIGRlYWRMaW5lKTtcblxuICAgIC8vIENvbnZlcnQgdGhlIGRpZmYgYmFjayB0byBvcmlnaW5hbCB0ZXh0LlxuICAgIHRoaXMuY2hhcnNUb0xpbmVzKGRpZmZzLCBsaW5lQXJyYXkpO1xuICAgIC8vIEVsaW1pbmF0ZSBmcmVhayBtYXRjaGVzIChlLmcuIGJsYW5rIGxpbmVzKVxuICAgIHRoaXMuY2xlYW51cFNlbWFudGljKGRpZmZzKTtcblxuICAgIC8vIFJlZGlmZiBhbnkgcmVwbGFjZW1lbnQgYmxvY2tzLCB0aGlzIHRpbWUgY2hhcmFjdGVyLWJ5LWNoYXJhY3Rlci5cbiAgICAvLyBBZGQgYSBkdW1teSBlbnRyeSBhdCB0aGUgZW5kLlxuICAgIGRpZmZzLnB1c2goW0RJRkZfRVFVQUwsICcnXSk7XG4gICAgbGV0IHBvaW50ZXIgPSAwO1xuICAgIGxldCBjb3VudERlbGV0ZSA9IDA7XG4gICAgbGV0IGNvdW50SW5zZXJ0ID0gMDtcbiAgICBsZXQgdGV4dERlbGV0ZSA9ICcnO1xuICAgIGxldCB0ZXh0SW5zZXJ0ID0gJyc7XG4gICAgd2hpbGUgKHBvaW50ZXIgPCBkaWZmcy5sZW5ndGgpIHtcbiAgICAgIHN3aXRjaCAoZGlmZnNbcG9pbnRlcl1bMF0pIHtcbiAgICAgICAgY2FzZSBESUZGX0lOU0VSVDpcbiAgICAgICAgICBjb3VudEluc2VydCsrO1xuICAgICAgICAgIHRleHRJbnNlcnQgKz0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRElGRl9ERUxFVEU6XG4gICAgICAgICAgY291bnREZWxldGUrKztcbiAgICAgICAgICB0ZXh0RGVsZXRlICs9IGRpZmZzW3BvaW50ZXJdWzFdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERJRkZfRVFVQUw6XG4gICAgICAgICAgLy8gVXBvbiByZWFjaGluZyBhbiBlcXVhbGl0eSwgY2hlY2sgZm9yIHByaW9yIHJlZHVuZGFuY2llcy5cbiAgICAgICAgICBpZiAoY291bnREZWxldGUgPj0gMSAmJiBjb3VudEluc2VydCA+PSAxKSB7XG4gICAgICAgICAgICAvLyBEZWxldGUgdGhlIG9mZmVuZGluZyByZWNvcmRzIGFuZCBhZGQgdGhlIG1lcmdlZCBvbmVzLlxuICAgICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIgLSBjb3VudERlbGV0ZSAtIGNvdW50SW5zZXJ0LCBjb3VudERlbGV0ZSArIGNvdW50SW5zZXJ0KTtcbiAgICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyIC0gY291bnREZWxldGUgLSBjb3VudEluc2VydDtcbiAgICAgICAgICAgIGNvbnN0IHN1YkRpZmYgPSB0aGlzLmRpZmZNYWluKHRleHREZWxldGUsIHRleHRJbnNlcnQsIGZhbHNlLCBkZWFkTGluZSk7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gc3ViRGlmZi5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciwgMCwgc3ViRGlmZltqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb2ludGVyID0gcG9pbnRlciArIHN1YkRpZmYubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudEluc2VydCA9IDA7XG4gICAgICAgICAgY291bnREZWxldGUgPSAwO1xuICAgICAgICAgIHRleHREZWxldGUgPSAnJztcbiAgICAgICAgICB0ZXh0SW5zZXJ0ID0gJyc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBwb2ludGVyKys7XG4gICAgfVxuICAgIGRpZmZzLnBvcCgpOyAvLyBSZW1vdmUgdGhlIGR1bW15IGVudHJ5IGF0IHRoZSBlbmQuXG5cbiAgICByZXR1cm4gZGlmZnM7XG4gIH1cblxuICAvKipcbiAgICogUmVkdWNlIHRoZSBudW1iZXIgb2YgZWRpdHMgYnkgZWxpbWluYXRpbmcgc2VtYW50aWNhbGx5IHRyaXZpYWwgZXF1YWxpdGllcy5cbiAgICogQHBhcmFtIHshQXJyYXkuPCFEaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqL1xuICBjbGVhbnVwU2VtYW50aWMoZGlmZnM6IERpZmZbXSkge1xuICAgIGxldCBjaGFuZ2VzID0gZmFsc2U7XG4gICAgbGV0IGVxdWFsaXRpZXMgPSBbXTsgLy8gU3RhY2sgb2YgaW5kaWNlcyB3aGVyZSBlcXVhbGl0aWVzIGFyZSBmb3VuZC5cbiAgICBsZXQgZXF1YWxpdGllc0xlbmd0aCA9IDA7IC8vIEtlZXBpbmcgb3VyIG93biBsZW5ndGggdmFyIGlzIGZhc3RlciBpbiBKUy5cbiAgICAvKiogQHR5cGUgez9zdHJpbmd9ICovXG4gICAgbGV0IGxhc3RFcXVhbGl0eTogc3RyaW5nID0gbnVsbDtcbiAgICAvLyBBbHdheXMgZXF1YWwgdG8gZGlmZnNbZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoIC0gMV1dWzFdXG4gICAgbGV0IHBvaW50ZXIgPSAwOyAvLyBJbmRleCBvZiBjdXJyZW50IHBvc2l0aW9uLlxuICAgIC8vIE51bWJlciBvZiBjaGFyYWN0ZXJzIHRoYXQgY2hhbmdlZCBwcmlvciB0byB0aGUgZXF1YWxpdHkuXG4gICAgbGV0IGxlbmd0aEluc2VydGlvbnMxID0gMDtcbiAgICBsZXQgbGVuZ3RoRGVsZXRpb25zMSA9IDA7XG4gICAgLy8gTnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBjaGFuZ2VkIGFmdGVyIHRoZSBlcXVhbGl0eS5cbiAgICBsZXQgbGVuZ3RoSW5zZXJ0aW9uczIgPSAwO1xuICAgIGxldCBsZW5ndGhEZWxldGlvbnMyID0gMDtcbiAgICB3aGlsZSAocG9pbnRlciA8IGRpZmZzLmxlbmd0aCkge1xuICAgICAgaWYgKGRpZmZzW3BvaW50ZXJdWzBdID09IERJRkZfRVFVQUwpIHtcbiAgICAgICAgLy8gRXF1YWxpdHkgZm91bmQuXG4gICAgICAgIGVxdWFsaXRpZXNbZXF1YWxpdGllc0xlbmd0aCsrXSA9IHBvaW50ZXI7XG4gICAgICAgIGxlbmd0aEluc2VydGlvbnMxID0gbGVuZ3RoSW5zZXJ0aW9uczI7XG4gICAgICAgIGxlbmd0aERlbGV0aW9uczEgPSBsZW5ndGhEZWxldGlvbnMyO1xuICAgICAgICBsZW5ndGhJbnNlcnRpb25zMiA9IDA7XG4gICAgICAgIGxlbmd0aERlbGV0aW9uczIgPSAwO1xuICAgICAgICBsYXN0RXF1YWxpdHkgPSBkaWZmc1twb2ludGVyXVsxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFuIGluc2VydGlvbiBvciBkZWxldGlvbi5cbiAgICAgICAgaWYgKGRpZmZzW3BvaW50ZXJdWzBdID09IERJRkZfSU5TRVJUKSB7XG4gICAgICAgICAgbGVuZ3RoSW5zZXJ0aW9uczIgKz0gZGlmZnNbcG9pbnRlcl1bMV0ubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxlbmd0aERlbGV0aW9uczIgKz0gZGlmZnNbcG9pbnRlcl1bMV0ubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVsaW1pbmF0ZSBhbiBlcXVhbGl0eSB0aGF0IGlzIHNtYWxsZXIgb3IgZXF1YWwgdG8gdGhlIGVkaXRzIG9uIGJvdGhcbiAgICAgICAgLy8gc2lkZXMgb2YgaXQuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0RXF1YWxpdHkgJiZcbiAgICAgICAgICBsYXN0RXF1YWxpdHkubGVuZ3RoIDw9IE1hdGgubWF4KGxlbmd0aEluc2VydGlvbnMxLCBsZW5ndGhEZWxldGlvbnMxKSAmJlxuICAgICAgICAgIGxhc3RFcXVhbGl0eS5sZW5ndGggPD0gTWF0aC5tYXgobGVuZ3RoSW5zZXJ0aW9uczIsIGxlbmd0aERlbGV0aW9uczIpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIER1cGxpY2F0ZSByZWNvcmQuXG4gICAgICAgICAgZGlmZnMuc3BsaWNlKGVxdWFsaXRpZXNbZXF1YWxpdGllc0xlbmd0aCAtIDFdLCAwLCBbRElGRl9ERUxFVEUsIGxhc3RFcXVhbGl0eV0pO1xuICAgICAgICAgIC8vIENoYW5nZSBzZWNvbmQgY29weSB0byBpbnNlcnQuXG4gICAgICAgICAgZGlmZnNbZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoIC0gMV0gKyAxXVswXSA9IERJRkZfSU5TRVJUO1xuICAgICAgICAgIC8vIFRocm93IGF3YXkgdGhlIGVxdWFsaXR5IHdlIGp1c3QgZGVsZXRlZC5cbiAgICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoLS07XG4gICAgICAgICAgLy8gVGhyb3cgYXdheSB0aGUgcHJldmlvdXMgZXF1YWxpdHkgKGl0IG5lZWRzIHRvIGJlIHJlZXZhbHVhdGVkKS5cbiAgICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoLS07XG4gICAgICAgICAgcG9pbnRlciA9IGVxdWFsaXRpZXNMZW5ndGggPiAwID8gZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoIC0gMV0gOiAtMTtcbiAgICAgICAgICBsZW5ndGhJbnNlcnRpb25zMSA9IDA7IC8vIFJlc2V0IHRoZSBjb3VudGVycy5cbiAgICAgICAgICBsZW5ndGhEZWxldGlvbnMxID0gMDtcbiAgICAgICAgICBsZW5ndGhJbnNlcnRpb25zMiA9IDA7XG4gICAgICAgICAgbGVuZ3RoRGVsZXRpb25zMiA9IDA7XG4gICAgICAgICAgbGFzdEVxdWFsaXR5ID0gbnVsbDtcbiAgICAgICAgICBjaGFuZ2VzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcG9pbnRlcisrO1xuICAgIH1cblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgZGlmZi5cbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgdGhpcy5jbGVhbnVwTWVyZ2UoZGlmZnMpO1xuICAgIH1cbiAgICB0aGlzLmNsZWFudXBTZW1hbnRpY0xvc3NsZXNzKGRpZmZzKTtcblxuICAgIC8vIEZpbmQgYW55IG92ZXJsYXBzIGJldHdlZW4gZGVsZXRpb25zIGFuZCBpbnNlcnRpb25zLlxuICAgIC8vIGUuZzogPGRlbD5hYmN4eHg8L2RlbD48aW5zPnh4eGRlZjwvaW5zPlxuICAgIC8vICAgLT4gPGRlbD5hYmM8L2RlbD54eHg8aW5zPmRlZjwvaW5zPlxuICAgIC8vIGUuZzogPGRlbD54eHhhYmM8L2RlbD48aW5zPmRlZnh4eDwvaW5zPlxuICAgIC8vICAgLT4gPGlucz5kZWY8L2lucz54eHg8ZGVsPmFiYzwvZGVsPlxuICAgIC8vIE9ubHkgZXh0cmFjdCBhbiBvdmVybGFwIGlmIGl0IGlzIGFzIGJpZyBhcyB0aGUgZWRpdCBhaGVhZCBvciBiZWhpbmQgaXQuXG4gICAgcG9pbnRlciA9IDE7XG4gICAgd2hpbGUgKHBvaW50ZXIgPCBkaWZmcy5sZW5ndGgpIHtcbiAgICAgIGlmIChkaWZmc1twb2ludGVyIC0gMV1bMF0gPT0gRElGRl9ERUxFVEUgJiYgZGlmZnNbcG9pbnRlcl1bMF0gPT0gRElGRl9JTlNFUlQpIHtcbiAgICAgICAgY29uc3QgZGVsZXRpb24gPSBkaWZmc1twb2ludGVyIC0gMV1bMV07XG4gICAgICAgIGNvbnN0IGluc2VydGlvbiA9IGRpZmZzW3BvaW50ZXJdWzFdO1xuICAgICAgICBjb25zdCBvdmVybGFwX2xlbmd0aDEgPSB1dGlscy5jb21tb25PdmVybGFwKGRlbGV0aW9uLCBpbnNlcnRpb24pO1xuICAgICAgICBjb25zdCBvdmVybGFwX2xlbmd0aDIgPSB1dGlscy5jb21tb25PdmVybGFwKGluc2VydGlvbiwgZGVsZXRpb24pO1xuICAgICAgICBpZiAob3ZlcmxhcF9sZW5ndGgxID49IG92ZXJsYXBfbGVuZ3RoMikge1xuICAgICAgICAgIGlmIChvdmVybGFwX2xlbmd0aDEgPj0gZGVsZXRpb24ubGVuZ3RoIC8gMiB8fCBvdmVybGFwX2xlbmd0aDEgPj0gaW5zZXJ0aW9uLmxlbmd0aCAvIDIpIHtcbiAgICAgICAgICAgIC8vIE92ZXJsYXAgZm91bmQuICBJbnNlcnQgYW4gZXF1YWxpdHkgYW5kIHRyaW0gdGhlIHN1cnJvdW5kaW5nIGVkaXRzLlxuICAgICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIsIDAsIFtESUZGX0VRVUFMLCBpbnNlcnRpb24uc3Vic3RyaW5nKDAsIG92ZXJsYXBfbGVuZ3RoMSldKTtcbiAgICAgICAgICAgIGRpZmZzW3BvaW50ZXIgLSAxXVsxXSA9IGRlbGV0aW9uLnN1YnN0cmluZygwLCBkZWxldGlvbi5sZW5ndGggLSBvdmVybGFwX2xlbmd0aDEpO1xuICAgICAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzFdID0gaW5zZXJ0aW9uLnN1YnN0cmluZyhvdmVybGFwX2xlbmd0aDEpO1xuICAgICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3ZlcmxhcF9sZW5ndGgyID49IGRlbGV0aW9uLmxlbmd0aCAvIDIgfHwgb3ZlcmxhcF9sZW5ndGgyID49IGluc2VydGlvbi5sZW5ndGggLyAyKSB7XG4gICAgICAgICAgICAvLyBSZXZlcnNlIG92ZXJsYXAgZm91bmQuXG4gICAgICAgICAgICAvLyBJbnNlcnQgYW4gZXF1YWxpdHkgYW5kIHN3YXAgYW5kIHRyaW0gdGhlIHN1cnJvdW5kaW5nIGVkaXRzLlxuICAgICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIsIDAsIFtESUZGX0VRVUFMLCBkZWxldGlvbi5zdWJzdHJpbmcoMCwgb3ZlcmxhcF9sZW5ndGgyKV0pO1xuICAgICAgICAgICAgZGlmZnNbcG9pbnRlciAtIDFdWzBdID0gRElGRl9JTlNFUlQ7XG4gICAgICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0gPSBpbnNlcnRpb24uc3Vic3RyaW5nKDAsIGluc2VydGlvbi5sZW5ndGggLSBvdmVybGFwX2xlbmd0aDIpO1xuICAgICAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzBdID0gRElGRl9ERUxFVEU7XG4gICAgICAgICAgICBkaWZmc1twb2ludGVyICsgMV1bMV0gPSBkZWxldGlvbi5zdWJzdHJpbmcob3ZlcmxhcF9sZW5ndGgyKTtcbiAgICAgICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRlcisrO1xuICAgICAgfVxuICAgICAgcG9pbnRlcisrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW9yZGVyIGFuZCBtZXJnZSBsaWtlIGVkaXQgc2VjdGlvbnMuICBNZXJnZSBlcXVhbGl0aWVzLlxuICAgKiBBbnkgZWRpdCBzZWN0aW9uIGNhbiBtb3ZlIGFzIGxvbmcgYXMgaXQgZG9lc24ndCBjcm9zcyBhbiBlcXVhbGl0eS5cbiAgICogQHBhcmFtIHshQXJyYXkuPCFEaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqL1xuICBjbGVhbnVwTWVyZ2UoZGlmZnM6IERpZmZbXSkge1xuICAgIC8vIEFkZCBhIGR1bW15IGVudHJ5IGF0IHRoZSBlbmQuXG4gICAgZGlmZnMucHVzaChbRElGRl9FUVVBTCwgJyddKTtcbiAgICBsZXQgcG9pbnRlciA9IDA7XG4gICAgbGV0IGNvdW50RGVsZXRlID0gMDtcbiAgICBsZXQgY291bnRJbnNlcnQgPSAwO1xuICAgIGxldCB0ZXh0RGVsZXRlID0gJyc7XG4gICAgbGV0IHRleHRJbnNlcnQgPSAnJztcbiAgICBsZXQgY29tbW9uTGVuZ3RoO1xuICAgIHdoaWxlIChwb2ludGVyIDwgZGlmZnMubGVuZ3RoKSB7XG4gICAgICBzd2l0Y2ggKGRpZmZzW3BvaW50ZXJdWzBdKSB7XG4gICAgICAgIGNhc2UgRElGRl9JTlNFUlQ6XG4gICAgICAgICAgY291bnRJbnNlcnQrKztcbiAgICAgICAgICB0ZXh0SW5zZXJ0ICs9IGRpZmZzW3BvaW50ZXJdWzFdO1xuICAgICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBESUZGX0RFTEVURTpcbiAgICAgICAgICBjb3VudERlbGV0ZSsrO1xuICAgICAgICAgIHRleHREZWxldGUgKz0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERJRkZfRVFVQUw6XG4gICAgICAgICAgLy8gVXBvbiByZWFjaGluZyBhbiBlcXVhbGl0eSwgY2hlY2sgZm9yIHByaW9yIHJlZHVuZGFuY2llcy5cbiAgICAgICAgICBpZiAoY291bnREZWxldGUgKyBjb3VudEluc2VydCA+IDEpIHtcbiAgICAgICAgICAgIGlmIChjb3VudERlbGV0ZSAhPT0gMCAmJiBjb3VudEluc2VydCAhPT0gMCkge1xuICAgICAgICAgICAgICAvLyBGYWN0b3Igb3V0IGFueSBjb21tb24gcHJlZml4ZXMuXG4gICAgICAgICAgICAgIGNvbW1vbkxlbmd0aCA9IHV0aWxzLmNvbW1vblByZWZpeCh0ZXh0SW5zZXJ0LCB0ZXh0RGVsZXRlKTtcbiAgICAgICAgICAgICAgaWYgKGNvbW1vbkxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChwb2ludGVyIC0gY291bnREZWxldGUgLSBjb3VudEluc2VydCA+IDAgJiYgZGlmZnNbcG9pbnRlciAtIGNvdW50RGVsZXRlIC0gY291bnRJbnNlcnQgLSAxXVswXSA9PSBESUZGX0VRVUFMKSB7XG4gICAgICAgICAgICAgICAgICBkaWZmc1twb2ludGVyIC0gY291bnREZWxldGUgLSBjb3VudEluc2VydCAtIDFdWzFdICs9IHRleHRJbnNlcnQuc3Vic3RyaW5nKDAsIGNvbW1vbkxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGRpZmZzLnNwbGljZSgwLCAwLCBbRElGRl9FUVVBTCwgdGV4dEluc2VydC5zdWJzdHJpbmcoMCwgY29tbW9uTGVuZ3RoKV0pO1xuICAgICAgICAgICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ZXh0SW5zZXJ0ID0gdGV4dEluc2VydC5zdWJzdHJpbmcoY29tbW9uTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0ZXh0RGVsZXRlID0gdGV4dERlbGV0ZS5zdWJzdHJpbmcoY29tbW9uTGVuZ3RoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBGYWN0b3Igb3V0IGFueSBjb21tb24gc3VmZml4ZXMuXG4gICAgICAgICAgICAgIGNvbW1vbkxlbmd0aCA9IHV0aWxzLmNvbW1vblN1ZmZpeCh0ZXh0SW5zZXJ0LCB0ZXh0RGVsZXRlKTtcbiAgICAgICAgICAgICAgaWYgKGNvbW1vbkxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGRpZmZzW3BvaW50ZXJdWzFdID0gdGV4dEluc2VydC5zdWJzdHJpbmcodGV4dEluc2VydC5sZW5ndGggLSBjb21tb25MZW5ndGgpICsgZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgICAgICAgICAgdGV4dEluc2VydCA9IHRleHRJbnNlcnQuc3Vic3RyaW5nKDAsIHRleHRJbnNlcnQubGVuZ3RoIC0gY29tbW9uTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0ZXh0RGVsZXRlID0gdGV4dERlbGV0ZS5zdWJzdHJpbmcoMCwgdGV4dERlbGV0ZS5sZW5ndGggLSBjb21tb25MZW5ndGgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEZWxldGUgdGhlIG9mZmVuZGluZyByZWNvcmRzIGFuZCBhZGQgdGhlIG1lcmdlZCBvbmVzLlxuICAgICAgICAgICAgcG9pbnRlciAtPSBjb3VudERlbGV0ZSArIGNvdW50SW5zZXJ0O1xuICAgICAgICAgICAgZGlmZnMuc3BsaWNlKHBvaW50ZXIsIGNvdW50RGVsZXRlICsgY291bnRJbnNlcnQpO1xuICAgICAgICAgICAgaWYgKHRleHREZWxldGUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyLCAwLCBbRElGRl9ERUxFVEUsIHRleHREZWxldGVdKTtcbiAgICAgICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRleHRJbnNlcnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyLCAwLCBbRElGRl9JTlNFUlQsIHRleHRJbnNlcnRdKTtcbiAgICAgICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcG9pbnRlcisrO1xuICAgICAgICAgIH0gZWxzZSBpZiAocG9pbnRlciAhPT0gMCAmJiBkaWZmc1twb2ludGVyIC0gMV1bMF0gPT0gRElGRl9FUVVBTCkge1xuICAgICAgICAgICAgLy8gTWVyZ2UgdGhpcyBlcXVhbGl0eSB3aXRoIHRoZSBwcmV2aW91cyBvbmUuXG4gICAgICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0gKz0gZGlmZnNbcG9pbnRlcl1bMV07XG4gICAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciwgMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvaW50ZXIrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgY291bnRJbnNlcnQgPSAwO1xuICAgICAgICAgIGNvdW50RGVsZXRlID0gMDtcbiAgICAgICAgICB0ZXh0RGVsZXRlID0gJyc7XG4gICAgICAgICAgdGV4dEluc2VydCA9ICcnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGlmZnNbZGlmZnMubGVuZ3RoIC0gMV1bMV0gPT09ICcnKSB7XG4gICAgICBkaWZmcy5wb3AoKTsgLy8gUmVtb3ZlIHRoZSBkdW1teSBlbnRyeSBhdCB0aGUgZW5kLlxuICAgIH1cblxuICAgIC8vIFNlY29uZCBwYXNzOiBsb29rIGZvciBzaW5nbGUgZWRpdHMgc3Vycm91bmRlZCBvbiBib3RoIHNpZGVzIGJ5IGVxdWFsaXRpZXNcbiAgICAvLyB3aGljaCBjYW4gYmUgc2hpZnRlZCBzaWRld2F5cyB0byBlbGltaW5hdGUgYW4gZXF1YWxpdHkuXG4gICAgLy8gZS5nOiBBPGlucz5CQTwvaW5zPkMgLT4gPGlucz5BQjwvaW5zPkFDXG4gICAgbGV0IGNoYW5nZXMgPSBmYWxzZTtcbiAgICBwb2ludGVyID0gMTtcbiAgICAvLyBJbnRlbnRpb25hbGx5IGlnbm9yZSB0aGUgZmlyc3QgYW5kIGxhc3QgZWxlbWVudCAoZG9uJ3QgbmVlZCBjaGVja2luZykuXG4gICAgd2hpbGUgKHBvaW50ZXIgPCBkaWZmcy5sZW5ndGggLSAxKSB7XG4gICAgICBpZiAoZGlmZnNbcG9pbnRlciAtIDFdWzBdID09IERJRkZfRVFVQUwgJiYgZGlmZnNbcG9pbnRlciArIDFdWzBdID09IERJRkZfRVFVQUwpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIHNpbmdsZSBlZGl0IHN1cnJvdW5kZWQgYnkgZXF1YWxpdGllcy5cbiAgICAgICAgaWYgKGRpZmZzW3BvaW50ZXJdWzFdLnN1YnN0cmluZyhkaWZmc1twb2ludGVyXVsxXS5sZW5ndGggLSBkaWZmc1twb2ludGVyIC0gMV1bMV0ubGVuZ3RoKSA9PSBkaWZmc1twb2ludGVyIC0gMV1bMV0pIHtcbiAgICAgICAgICAvLyBTaGlmdCB0aGUgZWRpdCBvdmVyIHRoZSBwcmV2aW91cyBlcXVhbGl0eS5cbiAgICAgICAgICBkaWZmc1twb2ludGVyXVsxXSA9XG4gICAgICAgICAgICBkaWZmc1twb2ludGVyIC0gMV1bMV0gKyBkaWZmc1twb2ludGVyXVsxXS5zdWJzdHJpbmcoMCwgZGlmZnNbcG9pbnRlcl1bMV0ubGVuZ3RoIC0gZGlmZnNbcG9pbnRlciAtIDFdWzFdLmxlbmd0aCk7XG4gICAgICAgICAgZGlmZnNbcG9pbnRlciArIDFdWzFdID0gZGlmZnNbcG9pbnRlciAtIDFdWzFdICsgZGlmZnNbcG9pbnRlciArIDFdWzFdO1xuICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyIC0gMSwgMSk7XG4gICAgICAgICAgY2hhbmdlcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlmZnNbcG9pbnRlcl1bMV0uc3Vic3RyaW5nKDAsIGRpZmZzW3BvaW50ZXIgKyAxXVsxXS5sZW5ndGgpID09IGRpZmZzW3BvaW50ZXIgKyAxXVsxXSkge1xuICAgICAgICAgIC8vIFNoaWZ0IHRoZSBlZGl0IG92ZXIgdGhlIG5leHQgZXF1YWxpdHkuXG4gICAgICAgICAgZGlmZnNbcG9pbnRlciAtIDFdWzFdICs9IGRpZmZzW3BvaW50ZXIgKyAxXVsxXTtcbiAgICAgICAgICBkaWZmc1twb2ludGVyXVsxXSA9IGRpZmZzW3BvaW50ZXJdWzFdLnN1YnN0cmluZyhkaWZmc1twb2ludGVyICsgMV1bMV0ubGVuZ3RoKSArIGRpZmZzW3BvaW50ZXIgKyAxXVsxXTtcbiAgICAgICAgICBkaWZmcy5zcGxpY2UocG9pbnRlciArIDEsIDEpO1xuICAgICAgICAgIGNoYW5nZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwb2ludGVyKys7XG4gICAgfVxuICAgIC8vIElmIHNoaWZ0cyB3ZXJlIG1hZGUsIHRoZSBkaWZmIG5lZWRzIHJlb3JkZXJpbmcgYW5kIGFub3RoZXIgc2hpZnQgc3dlZXAuXG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuY2xlYW51cE1lcmdlKGRpZmZzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9vayBmb3Igc2luZ2xlIGVkaXRzIHN1cnJvdW5kZWQgb24gYm90aCBzaWRlcyBieSBlcXVhbGl0aWVzXG4gICAqIHdoaWNoIGNhbiBiZSBzaGlmdGVkIHNpZGV3YXlzIHRvIGFsaWduIHRoZSBlZGl0IHRvIGEgd29yZCBib3VuZGFyeS5cbiAgICogZS5nOiBUaGUgYzxpbnM+YXQgYzwvaW5zPmFtZS4gLT4gVGhlIDxpbnM+Y2F0IDwvaW5zPmNhbWUuXG4gICAqIEBwYXJhbSB7IUFycmF5LjwhRGlmZj59IGRpZmZzIEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICAgKi9cbiAgY2xlYW51cFNlbWFudGljTG9zc2xlc3MoZGlmZnM6IERpZmZbXSkge1xuICAgIGxldCBwb2ludGVyID0gMTtcbiAgICAvLyBJbnRlbnRpb25hbGx5IGlnbm9yZSB0aGUgZmlyc3QgYW5kIGxhc3QgZWxlbWVudCAoZG9uJ3QgbmVlZCBjaGVja2luZykuXG4gICAgd2hpbGUgKHBvaW50ZXIgPCBkaWZmcy5sZW5ndGggLSAxKSB7XG4gICAgICBpZiAoZGlmZnNbcG9pbnRlciAtIDFdWzBdID09IERJRkZfRVFVQUwgJiYgZGlmZnNbcG9pbnRlciArIDFdWzBdID09IERJRkZfRVFVQUwpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIHNpbmdsZSBlZGl0IHN1cnJvdW5kZWQgYnkgZXF1YWxpdGllcy5cbiAgICAgICAgbGV0IGVxdWFsaXR5MSA9IGRpZmZzW3BvaW50ZXIgLSAxXVsxXTtcbiAgICAgICAgbGV0IGVkaXQgPSBkaWZmc1twb2ludGVyXVsxXTtcbiAgICAgICAgbGV0IGVxdWFsaXR5MiA9IGRpZmZzW3BvaW50ZXIgKyAxXVsxXTtcblxuICAgICAgICAvLyBGaXJzdCwgc2hpZnQgdGhlIGVkaXQgYXMgZmFyIGxlZnQgYXMgcG9zc2libGUuXG4gICAgICAgIGNvbnN0IGNvbW1vbk9mZnNldCA9IHV0aWxzLmNvbW1vblN1ZmZpeChlcXVhbGl0eTEsIGVkaXQpO1xuICAgICAgICBpZiAoY29tbW9uT2Zmc2V0KSB7XG4gICAgICAgICAgdmFyIGNvbW1vblN0cmluZyA9IGVkaXQuc3Vic3RyaW5nKGVkaXQubGVuZ3RoIC0gY29tbW9uT2Zmc2V0KTtcbiAgICAgICAgICBlcXVhbGl0eTEgPSBlcXVhbGl0eTEuc3Vic3RyaW5nKDAsIGVxdWFsaXR5MS5sZW5ndGggLSBjb21tb25PZmZzZXQpO1xuICAgICAgICAgIGVkaXQgPSBjb21tb25TdHJpbmcgKyBlZGl0LnN1YnN0cmluZygwLCBlZGl0Lmxlbmd0aCAtIGNvbW1vbk9mZnNldCk7XG4gICAgICAgICAgZXF1YWxpdHkyID0gY29tbW9uU3RyaW5nICsgZXF1YWxpdHkyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2Vjb25kLCBzdGVwIGNoYXJhY3RlciBieSBjaGFyYWN0ZXIgcmlnaHQsIGxvb2tpbmcgZm9yIHRoZSBiZXN0IGZpdC5cbiAgICAgICAgbGV0IGJlc3RFcXVhbGl0eTEgPSBlcXVhbGl0eTE7XG4gICAgICAgIGxldCBiZXN0RWRpdCA9IGVkaXQ7XG4gICAgICAgIGxldCBiZXN0RXF1YWxpdHkyID0gZXF1YWxpdHkyO1xuICAgICAgICBsZXQgYmVzdFNjb3JlID0gdXRpbHMuY2xlYW51cFNlbWFudGljU2NvcmUoZXF1YWxpdHkxLCBlZGl0KSArIHV0aWxzLmNsZWFudXBTZW1hbnRpY1Njb3JlKGVkaXQsIGVxdWFsaXR5Mik7XG4gICAgICAgIHdoaWxlIChlZGl0LmNoYXJBdCgwKSA9PT0gZXF1YWxpdHkyLmNoYXJBdCgwKSkge1xuICAgICAgICAgIGVxdWFsaXR5MSArPSBlZGl0LmNoYXJBdCgwKTtcbiAgICAgICAgICBlZGl0ID0gZWRpdC5zdWJzdHJpbmcoMSkgKyBlcXVhbGl0eTIuY2hhckF0KDApO1xuICAgICAgICAgIGVxdWFsaXR5MiA9IGVxdWFsaXR5Mi5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgY29uc3Qgc2NvcmUgPSB1dGlscy5jbGVhbnVwU2VtYW50aWNTY29yZShlcXVhbGl0eTEsIGVkaXQpICsgdXRpbHMuY2xlYW51cFNlbWFudGljU2NvcmUoZWRpdCwgZXF1YWxpdHkyKTtcbiAgICAgICAgICAvLyBUaGUgPj0gZW5jb3VyYWdlcyB0cmFpbGluZyByYXRoZXIgdGhhbiBsZWFkaW5nIHdoaXRlc3BhY2Ugb24gZWRpdHMuXG4gICAgICAgICAgaWYgKHNjb3JlID49IGJlc3RTY29yZSkge1xuICAgICAgICAgICAgYmVzdFNjb3JlID0gc2NvcmU7XG4gICAgICAgICAgICBiZXN0RXF1YWxpdHkxID0gZXF1YWxpdHkxO1xuICAgICAgICAgICAgYmVzdEVkaXQgPSBlZGl0O1xuICAgICAgICAgICAgYmVzdEVxdWFsaXR5MiA9IGVxdWFsaXR5MjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGlmZnNbcG9pbnRlciAtIDFdWzFdICE9IGJlc3RFcXVhbGl0eTEpIHtcbiAgICAgICAgICAvLyBXZSBoYXZlIGFuIGltcHJvdmVtZW50LCBzYXZlIGl0IGJhY2sgdG8gdGhlIGRpZmYuXG4gICAgICAgICAgaWYgKGJlc3RFcXVhbGl0eTEpIHtcbiAgICAgICAgICAgIGRpZmZzW3BvaW50ZXIgLSAxXVsxXSA9IGJlc3RFcXVhbGl0eTE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyIC0gMSwgMSk7XG4gICAgICAgICAgICBwb2ludGVyLS07XG4gICAgICAgICAgfVxuICAgICAgICAgIGRpZmZzW3BvaW50ZXJdWzFdID0gYmVzdEVkaXQ7XG4gICAgICAgICAgaWYgKGJlc3RFcXVhbGl0eTIpIHtcbiAgICAgICAgICAgIGRpZmZzW3BvaW50ZXIgKyAxXVsxXSA9IGJlc3RFcXVhbGl0eTI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpZmZzLnNwbGljZShwb2ludGVyICsgMSwgMSk7XG4gICAgICAgICAgICBwb2ludGVyLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwb2ludGVyKys7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZHVjZSB0aGUgbnVtYmVyIG9mIGVkaXRzIGJ5IGVsaW1pbmF0aW5nIG9wZXJhdGlvbmFsbHkgdHJpdmlhbCBlcXVhbGl0aWVzLlxuICAgKiBAcGFyYW0geyFBcnJheS48IURpZmY+fSBkaWZmcyBBcnJheSBvZiBkaWZmIHR1cGxlcy5cbiAgICovXG4gIGNsZWFudXBFZmZpY2llbmN5KGRpZmZzOiBEaWZmW10pIHtcbiAgICBsZXQgY2hhbmdlcyA9IGZhbHNlO1xuICAgIGNvbnN0IGVxdWFsaXRpZXMgPSBbXTsgLy8gU3RhY2sgb2YgaW5kaWNlcyB3aGVyZSBlcXVhbGl0aWVzIGFyZSBmb3VuZC5cbiAgICBsZXQgZXF1YWxpdGllc0xlbmd0aCA9IDA7IC8vIEtlZXBpbmcgb3VyIG93biBsZW5ndGggdmFyIGlzIGZhc3RlciBpbiBKUy5cbiAgICAvKiogQHR5cGUgez9zdHJpbmd9ICovXG4gICAgbGV0IGxhc3RFcXVhbGl0eTogc3RyaW5nID0gbnVsbDtcbiAgICAvLyBBbHdheXMgZXF1YWwgdG8gZGlmZnNbZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoIC0gMV1dWzFdXG4gICAgbGV0IHBvaW50ZXIgPSAwOyAvLyBJbmRleCBvZiBjdXJyZW50IHBvc2l0aW9uLlxuICAgIC8vIElzIHRoZXJlIGFuIGluc2VydGlvbiBvcGVyYXRpb24gYmVmb3JlIHRoZSBsYXN0IGVxdWFsaXR5LlxuICAgIGxldCBwcmVfaW5zID0gZmFsc2U7XG4gICAgLy8gSXMgdGhlcmUgYSBkZWxldGlvbiBvcGVyYXRpb24gYmVmb3JlIHRoZSBsYXN0IGVxdWFsaXR5LlxuICAgIGxldCBwcmVfZGVsID0gZmFsc2U7XG4gICAgLy8gSXMgdGhlcmUgYW4gaW5zZXJ0aW9uIG9wZXJhdGlvbiBhZnRlciB0aGUgbGFzdCBlcXVhbGl0eS5cbiAgICBsZXQgcG9zdF9pbnMgPSBmYWxzZTtcbiAgICAvLyBJcyB0aGVyZSBhIGRlbGV0aW9uIG9wZXJhdGlvbiBhZnRlciB0aGUgbGFzdCBlcXVhbGl0eS5cbiAgICBsZXQgcG9zdF9kZWwgPSBmYWxzZTtcbiAgICB3aGlsZSAocG9pbnRlciA8IGRpZmZzLmxlbmd0aCkge1xuICAgICAgaWYgKGRpZmZzW3BvaW50ZXJdWzBdID09IERJRkZfRVFVQUwpIHtcbiAgICAgICAgLy8gRXF1YWxpdHkgZm91bmQuXG4gICAgICAgIGlmIChkaWZmc1twb2ludGVyXVsxXS5sZW5ndGggPCB0aGlzLmRpZmZFZGl0Q29zdCAmJiAocG9zdF9pbnMgfHwgcG9zdF9kZWwpKSB7XG4gICAgICAgICAgLy8gQ2FuZGlkYXRlIGZvdW5kLlxuICAgICAgICAgIGVxdWFsaXRpZXNbZXF1YWxpdGllc0xlbmd0aCsrXSA9IHBvaW50ZXI7XG4gICAgICAgICAgcHJlX2lucyA9IHBvc3RfaW5zO1xuICAgICAgICAgIHByZV9kZWwgPSBwb3N0X2RlbDtcbiAgICAgICAgICBsYXN0RXF1YWxpdHkgPSBkaWZmc1twb2ludGVyXVsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOb3QgYSBjYW5kaWRhdGUsIGFuZCBjYW4gbmV2ZXIgYmVjb21lIG9uZS5cbiAgICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoID0gMDtcbiAgICAgICAgICBsYXN0RXF1YWxpdHkgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHBvc3RfaW5zID0gcG9zdF9kZWwgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFuIGluc2VydGlvbiBvciBkZWxldGlvbi5cbiAgICAgICAgaWYgKGRpZmZzW3BvaW50ZXJdWzBdID09IERJRkZfREVMRVRFKSB7XG4gICAgICAgICAgcG9zdF9kZWwgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvc3RfaW5zID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBGaXZlIHR5cGVzIHRvIGJlIHNwbGl0OlxuICAgICAgICAgKiA8aW5zPkE8L2lucz48ZGVsPkI8L2RlbD5YWTxpbnM+QzwvaW5zPjxkZWw+RDwvZGVsPlxuICAgICAgICAgKiA8aW5zPkE8L2lucz5YPGlucz5DPC9pbnM+PGRlbD5EPC9kZWw+XG4gICAgICAgICAqIDxpbnM+QTwvaW5zPjxkZWw+QjwvZGVsPlg8aW5zPkM8L2lucz5cbiAgICAgICAgICogPGlucz5BPC9kZWw+WDxpbnM+QzwvaW5zPjxkZWw+RDwvZGVsPlxuICAgICAgICAgKiA8aW5zPkE8L2lucz48ZGVsPkI8L2RlbD5YPGRlbD5DPC9kZWw+XG4gICAgICAgICAqL1xuICAgICAgICBpZiAoXG4gICAgICAgICAgbGFzdEVxdWFsaXR5ICYmXG4gICAgICAgICAgKChwcmVfaW5zICYmIHByZV9kZWwgJiYgcG9zdF9pbnMgJiYgcG9zdF9kZWwpIHx8XG4gICAgICAgICAgICAobGFzdEVxdWFsaXR5Lmxlbmd0aCA8IHRoaXMuZGlmZkVkaXRDb3N0IC8gMiAmJiArcHJlX2lucyArICtwcmVfZGVsICsgK3Bvc3RfaW5zICsgK3Bvc3RfZGVsID09IDMpKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBEdXBsaWNhdGUgcmVjb3JkLlxuICAgICAgICAgIGRpZmZzLnNwbGljZShlcXVhbGl0aWVzW2VxdWFsaXRpZXNMZW5ndGggLSAxXSwgMCwgW0RJRkZfREVMRVRFLCBsYXN0RXF1YWxpdHldKTtcbiAgICAgICAgICAvLyBDaGFuZ2Ugc2Vjb25kIGNvcHkgdG8gaW5zZXJ0LlxuICAgICAgICAgIGRpZmZzW2VxdWFsaXRpZXNbZXF1YWxpdGllc0xlbmd0aCAtIDFdICsgMV1bMF0gPSBESUZGX0lOU0VSVDtcbiAgICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoLS07IC8vIFRocm93IGF3YXkgdGhlIGVxdWFsaXR5IHdlIGp1c3QgZGVsZXRlZDtcbiAgICAgICAgICBsYXN0RXF1YWxpdHkgPSBudWxsO1xuICAgICAgICAgIGlmIChwcmVfaW5zICYmIHByZV9kZWwpIHtcbiAgICAgICAgICAgIC8vIE5vIGNoYW5nZXMgbWFkZSB3aGljaCBjb3VsZCBhZmZlY3QgcHJldmlvdXMgZW50cnksIGtlZXAgZ29pbmcuXG4gICAgICAgICAgICBwb3N0X2lucyA9IHBvc3RfZGVsID0gdHJ1ZTtcbiAgICAgICAgICAgIGVxdWFsaXRpZXNMZW5ndGggPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcXVhbGl0aWVzTGVuZ3RoLS07IC8vIFRocm93IGF3YXkgdGhlIHByZXZpb3VzIGVxdWFsaXR5LlxuICAgICAgICAgICAgcG9pbnRlciA9IGVxdWFsaXRpZXNMZW5ndGggPiAwID8gZXF1YWxpdGllc1tlcXVhbGl0aWVzTGVuZ3RoIC0gMV0gOiAtMTtcbiAgICAgICAgICAgIHBvc3RfaW5zID0gcG9zdF9kZWwgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2hhbmdlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBvaW50ZXIrKztcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgdGhpcy5jbGVhbnVwTWVyZ2UoZGlmZnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSAnbWlkZGxlIHNuYWtlJyBvZiBhIGRpZmYsIHNwbGl0IHRoZSBwcm9ibGVtIGluIHR3b1xuICAgKiBhbmQgcmV0dXJuIHRoZSByZWN1cnNpdmVseSBjb25zdHJ1Y3RlZCBkaWZmLlxuICAgKiBTZWUgTXllcnMgMTk4NiBwYXBlcjogQW4gTyhORCkgRGlmZmVyZW5jZSBBbGdvcml0aG0gYW5kIEl0cyBWYXJpYXRpb25zLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgT2xkIHN0cmluZyB0byBiZSBkaWZmZWQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MiBOZXcgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlYWRMaW5lIFRpbWUgYXQgd2hpY2ggdG8gYmFpbCBpZiBub3QgeWV0IGNvbXBsZXRlLlxuICAgKiBAcmV0dXJuIHshQXJyYXkuPCFEaWZmPn0gQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBiaXNlY3QodGV4dDE6IHN0cmluZywgdGV4dDI6IHN0cmluZywgZGVhZExpbmU6IG51bWJlcik6IERpZmZbXSB7XG4gICAgLy8gQ2FjaGUgdGhlIHRleHQgbGVuZ3RocyB0byBwcmV2ZW50IG11bHRpcGxlIGNhbGxzLlxuICAgIGNvbnN0IHRleHQxX2xlbmd0aCA9IHRleHQxLmxlbmd0aDtcbiAgICBjb25zdCB0ZXh0Ml9sZW5ndGggPSB0ZXh0Mi5sZW5ndGg7XG4gICAgY29uc3QgbWF4X2QgPSBNYXRoLmNlaWwoKHRleHQxX2xlbmd0aCArIHRleHQyX2xlbmd0aCkgLyAyKTtcbiAgICBjb25zdCB2X29mZnNldCA9IG1heF9kO1xuICAgIGNvbnN0IHZfbGVuZ3RoID0gMiAqIG1heF9kO1xuICAgIGNvbnN0IHYxID0gbmV3IEFycmF5KHZfbGVuZ3RoKTtcbiAgICBjb25zdCB2MiA9IG5ldyBBcnJheSh2X2xlbmd0aCk7XG4gICAgLy8gU2V0dGluZyBhbGwgZWxlbWVudHMgdG8gLTEgaXMgZmFzdGVyIGluIENocm9tZSAmIEZpcmVmb3ggdGhhbiBtaXhpbmdcbiAgICAvLyBpbnRlZ2VycyBhbmQgdW5kZWZpbmVkLlxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdl9sZW5ndGg7IHgrKykge1xuICAgICAgdjFbeF0gPSAtMTtcbiAgICAgIHYyW3hdID0gLTE7XG4gICAgfVxuICAgIHYxW3Zfb2Zmc2V0ICsgMV0gPSAwO1xuICAgIHYyW3Zfb2Zmc2V0ICsgMV0gPSAwO1xuICAgIGNvbnN0IGRlbHRhID0gdGV4dDFfbGVuZ3RoIC0gdGV4dDJfbGVuZ3RoO1xuICAgIC8vIElmIHRoZSB0b3RhbCBudW1iZXIgb2YgY2hhcmFjdGVycyBpcyBvZGQsIHRoZW4gdGhlIGZyb250IHBhdGggd2lsbCBjb2xsaWRlXG4gICAgLy8gd2l0aCB0aGUgcmV2ZXJzZSBwYXRoLlxuICAgIGNvbnN0IGZyb250ID0gZGVsdGEgJSAyICE9IDA7XG4gICAgLy8gT2Zmc2V0cyBmb3Igc3RhcnQgYW5kIGVuZCBvZiBrIGxvb3AuXG4gICAgLy8gUHJldmVudHMgbWFwcGluZyBvZiBzcGFjZSBiZXlvbmQgdGhlIGdyaWQuXG4gICAgbGV0IGsxc3RhcnQgPSAwO1xuICAgIGxldCBrMWVuZCA9IDA7XG4gICAgbGV0IGsyc3RhcnQgPSAwO1xuICAgIGxldCBrMmVuZCA9IDA7XG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBtYXhfZDsgZCsrKSB7XG4gICAgICAvLyBCYWlsIG91dCBpZiBkZWFkbGluZSBpcyByZWFjaGVkLlxuICAgICAgaWYgKG5ldyBEYXRlKCkuZ2V0VGltZSgpID4gZGVhZExpbmUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIC8vIFdhbGsgdGhlIGZyb250IHBhdGggb25lIHN0ZXAuXG4gICAgICBmb3IgKGxldCBrMSA9IC1kICsgazFzdGFydDsgazEgPD0gZCAtIGsxZW5kOyBrMSArPSAyKSB7XG4gICAgICAgIGNvbnN0IGsxX29mZnNldCA9IHZfb2Zmc2V0ICsgazE7XG4gICAgICAgIGxldCB4MTtcbiAgICAgICAgaWYgKGsxID09IC1kIHx8IChrMSAhPSBkICYmIHYxW2sxX29mZnNldCAtIDFdIDwgdjFbazFfb2Zmc2V0ICsgMV0pKSB7XG4gICAgICAgICAgeDEgPSB2MVtrMV9vZmZzZXQgKyAxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4MSA9IHYxW2sxX29mZnNldCAtIDFdICsgMTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeTEgPSB4MSAtIGsxO1xuICAgICAgICB3aGlsZSAoeDEgPCB0ZXh0MV9sZW5ndGggJiYgeTEgPCB0ZXh0Ml9sZW5ndGggJiYgdGV4dDEuY2hhckF0KHgxKSA9PSB0ZXh0Mi5jaGFyQXQoeTEpKSB7XG4gICAgICAgICAgeDErKztcbiAgICAgICAgICB5MSsrO1xuICAgICAgICB9XG4gICAgICAgIHYxW2sxX29mZnNldF0gPSB4MTtcbiAgICAgICAgaWYgKHgxID4gdGV4dDFfbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gUmFuIG9mZiB0aGUgcmlnaHQgb2YgdGhlIGdyYXBoLlxuICAgICAgICAgIGsxZW5kICs9IDI7XG4gICAgICAgIH0gZWxzZSBpZiAoeTEgPiB0ZXh0Ml9sZW5ndGgpIHtcbiAgICAgICAgICAvLyBSYW4gb2ZmIHRoZSBib3R0b20gb2YgdGhlIGdyYXBoLlxuICAgICAgICAgIGsxc3RhcnQgKz0gMjtcbiAgICAgICAgfSBlbHNlIGlmIChmcm9udCkge1xuICAgICAgICAgIGNvbnN0IGsyX29mZnNldCA9IHZfb2Zmc2V0ICsgZGVsdGEgLSBrMTtcbiAgICAgICAgICBpZiAoazJfb2Zmc2V0ID49IDAgJiYgazJfb2Zmc2V0IDwgdl9sZW5ndGggJiYgdjJbazJfb2Zmc2V0XSAhPSAtMSkge1xuICAgICAgICAgICAgLy8gTWlycm9yIHgyIG9udG8gdG9wLWxlZnQgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAgICAgICAgICBsZXQgeDIgPSB0ZXh0MV9sZW5ndGggLSB2MltrMl9vZmZzZXRdO1xuICAgICAgICAgICAgaWYgKHgxID49IHgyKSB7XG4gICAgICAgICAgICAgIC8vIE92ZXJsYXAgZGV0ZWN0ZWQuXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmJpc2VjdFNwbGl0KHRleHQxLCB0ZXh0MiwgeDEsIHkxLCBkZWFkTGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFdhbGsgdGhlIHJldmVyc2UgcGF0aCBvbmUgc3RlcC5cbiAgICAgIGZvciAobGV0IGsyID0gLWQgKyBrMnN0YXJ0OyBrMiA8PSBkIC0gazJlbmQ7IGsyICs9IDIpIHtcbiAgICAgICAgY29uc3QgazJfb2Zmc2V0ID0gdl9vZmZzZXQgKyBrMjtcbiAgICAgICAgbGV0IHgyO1xuICAgICAgICBpZiAoazIgPT0gLWQgfHwgKGsyICE9IGQgJiYgdjJbazJfb2Zmc2V0IC0gMV0gPCB2MltrMl9vZmZzZXQgKyAxXSkpIHtcbiAgICAgICAgICB4MiA9IHYyW2syX29mZnNldCArIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHgyID0gdjJbazJfb2Zmc2V0IC0gMV0gKyAxO1xuICAgICAgICB9XG4gICAgICAgIGxldCB5MiA9IHgyIC0gazI7XG4gICAgICAgIHdoaWxlICh4MiA8IHRleHQxX2xlbmd0aCAmJiB5MiA8IHRleHQyX2xlbmd0aCAmJiB0ZXh0MS5jaGFyQXQodGV4dDFfbGVuZ3RoIC0geDIgLSAxKSA9PSB0ZXh0Mi5jaGFyQXQodGV4dDJfbGVuZ3RoIC0geTIgLSAxKSkge1xuICAgICAgICAgIHgyKys7XG4gICAgICAgICAgeTIrKztcbiAgICAgICAgfVxuICAgICAgICB2MltrMl9vZmZzZXRdID0geDI7XG4gICAgICAgIGlmICh4MiA+IHRleHQxX2xlbmd0aCkge1xuICAgICAgICAgIC8vIFJhbiBvZmYgdGhlIGxlZnQgb2YgdGhlIGdyYXBoLlxuICAgICAgICAgIGsyZW5kICs9IDI7XG4gICAgICAgIH0gZWxzZSBpZiAoeTIgPiB0ZXh0Ml9sZW5ndGgpIHtcbiAgICAgICAgICAvLyBSYW4gb2ZmIHRoZSB0b3Agb2YgdGhlIGdyYXBoLlxuICAgICAgICAgIGsyc3RhcnQgKz0gMjtcbiAgICAgICAgfSBlbHNlIGlmICghZnJvbnQpIHtcbiAgICAgICAgICBjb25zdCBrMV9vZmZzZXQgPSB2X29mZnNldCArIGRlbHRhIC0gazI7XG4gICAgICAgICAgaWYgKGsxX29mZnNldCA+PSAwICYmIGsxX29mZnNldCA8IHZfbGVuZ3RoICYmIHYxW2sxX29mZnNldF0gIT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IHgxID0gdjFbazFfb2Zmc2V0XTtcbiAgICAgICAgICAgIGNvbnN0IHkxID0gdl9vZmZzZXQgKyB4MSAtIGsxX29mZnNldDtcbiAgICAgICAgICAgIC8vIE1pcnJvciB4MiBvbnRvIHRvcC1sZWZ0IGNvb3JkaW5hdGUgc3lzdGVtLlxuICAgICAgICAgICAgeDIgPSB0ZXh0MV9sZW5ndGggLSB4MjtcbiAgICAgICAgICAgIGlmICh4MSA+PSB4Mikge1xuICAgICAgICAgICAgICAvLyBPdmVybGFwIGRldGVjdGVkLlxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5iaXNlY3RTcGxpdCh0ZXh0MSwgdGV4dDIsIHgxLCB5MSwgZGVhZExpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBEaWZmIHRvb2sgdG9vIGxvbmcgYW5kIGhpdCB0aGUgZGVhZGxpbmUgb3JcbiAgICAvLyBudW1iZXIgb2YgZGlmZnMgZXF1YWxzIG51bWJlciBvZiBjaGFyYWN0ZXJzLCBubyBjb21tb25hbGl0eSBhdCBhbGwuXG4gICAgcmV0dXJuIFtcbiAgICAgIFtESUZGX0RFTEVURSwgdGV4dDFdLFxuICAgICAgW0RJRkZfSU5TRVJULCB0ZXh0Ml0sXG4gICAgXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiB0aGUgbG9jYXRpb24gb2YgdGhlICdtaWRkbGUgc25ha2UnLCBzcGxpdCB0aGUgZGlmZiBpbiB0d28gcGFydHNcbiAgICogYW5kIHJlY3Vyc2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0MSBPbGQgc3RyaW5nIHRvIGJlIGRpZmZlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQyIE5ldyBzdHJpbmcgdG8gYmUgZGlmZmVkLlxuICAgKiBAcGFyYW0ge251bWJlcn0geCBJbmRleCBvZiBzcGxpdCBwb2ludCBpbiB0ZXh0MS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHkgSW5kZXggb2Ygc3BsaXQgcG9pbnQgaW4gdGV4dDIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWFkbGluZSBUaW1lIGF0IHdoaWNoIHRvIGJhaWwgaWYgbm90IHlldCBjb21wbGV0ZS5cbiAgICogQHJldHVybiB7IUFycmF5LjwhRGlmZj59IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBiaXNlY3RTcGxpdCh0ZXh0MTogc3RyaW5nLCB0ZXh0Mjogc3RyaW5nLCB4OiBudW1iZXIsIHk6IG51bWJlciwgZGVhZGxpbmU6IG51bWJlcik6IERpZmZbXSB7XG4gICAgY29uc3QgdGV4dDFhID0gdGV4dDEuc3Vic3RyaW5nKDAsIHgpO1xuICAgIGNvbnN0IHRleHQyYSA9IHRleHQyLnN1YnN0cmluZygwLCB5KTtcbiAgICBjb25zdCB0ZXh0MWIgPSB0ZXh0MS5zdWJzdHJpbmcoeCk7XG4gICAgY29uc3QgdGV4dDJiID0gdGV4dDIuc3Vic3RyaW5nKHkpO1xuXG4gICAgLy8gQ29tcHV0ZSBib3RoIGRpZmZzIHNlcmlhbGx5LlxuICAgIGNvbnN0IGRpZmZzID0gdGhpcy5kaWZmTWFpbih0ZXh0MWEsIHRleHQyYSwgZmFsc2UsIGRlYWRsaW5lKTtcbiAgICBjb25zdCBkaWZmc2IgPSB0aGlzLmRpZmZNYWluKHRleHQxYiwgdGV4dDJiLCBmYWxzZSwgZGVhZGxpbmUpO1xuXG4gICAgcmV0dXJuIGRpZmZzLmNvbmNhdChkaWZmc2IpO1xuICB9XG5cbiAgLyoqXG4gICAqIGxvYyBpcyBhIGxvY2F0aW9uIGluIHRleHQxLCBjb21wdXRlIGFuZCByZXR1cm4gdGhlIGVxdWl2YWxlbnQgbG9jYXRpb24gaW5cbiAgICogdGV4dDIuXG4gICAqIGUuZy4gJ1RoZSBjYXQnIHZzICdUaGUgYmlnIGNhdCcsIDEtPjEsIDUtPjhcbiAgICogQHBhcmFtIHshQXJyYXkuPCFEaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsb2MgTG9jYXRpb24gd2l0aGluIHRleHQxLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IExvY2F0aW9uIHdpdGhpbiB0ZXh0Mi5cbiAgICovXG4gIHhJbmRleChkaWZmczogRGlmZltdLCBsb2M6IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IGNoYXJzMSA9IDA7XG4gICAgbGV0IGNoYXJzMiA9IDA7XG4gICAgbGV0IGxhc3RfY2hhcnMxID0gMDtcbiAgICBsZXQgbGFzdF9jaGFyczIgPSAwO1xuICAgIGxldCB4O1xuICAgIGZvciAoeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgICAgaWYgKGRpZmZzW3hdWzBdICE9PSBESUZGX0lOU0VSVCkge1xuICAgICAgICAvLyBFcXVhbGl0eSBvciBkZWxldGlvbi5cbiAgICAgICAgY2hhcnMxICs9IGRpZmZzW3hdWzFdLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGlmIChkaWZmc1t4XVswXSAhPT0gRElGRl9ERUxFVEUpIHtcbiAgICAgICAgLy8gRXF1YWxpdHkgb3IgaW5zZXJ0aW9uLlxuICAgICAgICBjaGFyczIgKz0gZGlmZnNbeF1bMV0ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGNoYXJzMSA+IGxvYykge1xuICAgICAgICAvLyBPdmVyc2hvdCB0aGUgbG9jYXRpb24uXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGFzdF9jaGFyczEgPSBjaGFyczE7XG4gICAgICBsYXN0X2NoYXJzMiA9IGNoYXJzMjtcbiAgICB9XG4gICAgLy8gV2FzIHRoZSBsb2NhdGlvbiB3YXMgZGVsZXRlZD9cbiAgICBpZiAoZGlmZnMubGVuZ3RoICE9IHggJiYgZGlmZnNbeF1bMF0gPT09IERJRkZfREVMRVRFKSB7XG4gICAgICByZXR1cm4gbGFzdF9jaGFyczI7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgcmVtYWluaW5nIGNoYXJhY3RlciBsZW5ndGguXG4gICAgcmV0dXJuIGxhc3RfY2hhcnMyICsgKGxvYyAtIGxhc3RfY2hhcnMxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgZGlmZiBhcnJheSBpbnRvIGEgcHJldHR5IEhUTUwgcmVwb3J0LlxuICAgKiBAcGFyYW0geyFEaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gSFRNTCByZXByZXNlbnRhdGlvbi5cbiAgICovXG4gIHByZXR0eUh0bWwoZGlmZnM6IERpZmZbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgaHRtbDogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBwYXR0ZXJuX2FtcCA9IC8mL2c7XG4gICAgY29uc3QgcGF0dGVybl9sdCA9IC88L2c7XG4gICAgY29uc3QgcGF0dGVybl9ndCA9IC8+L2c7XG4gICAgY29uc3QgcGF0dGVybl9wYXJhID0gL1xcbi9nO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgZGlmZnMubGVuZ3RoOyB4KyspIHtcbiAgICAgIGNvbnN0IG9wID0gZGlmZnNbeF1bMF07IC8vIE9wZXJhdGlvbiAoaW5zZXJ0LCBkZWxldGUsIGVxdWFsKVxuICAgICAgY29uc3QgZGF0YSA9IGRpZmZzW3hdWzFdOyAvLyBUZXh0IG9mIGNoYW5nZS5cbiAgICAgIGNvbnN0IHRleHQgPSBkYXRhXG4gICAgICAgIC5yZXBsYWNlKHBhdHRlcm5fYW1wLCAnJmFtcDsnKVxuICAgICAgICAucmVwbGFjZShwYXR0ZXJuX2x0LCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKHBhdHRlcm5fZ3QsICcmZ3Q7JylcbiAgICAgICAgLnJlcGxhY2UocGF0dGVybl9wYXJhLCAnJnBhcmE7PGJyPicpO1xuICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICBjYXNlIERJRkZfSU5TRVJUOlxuICAgICAgICAgIGh0bWxbeF0gPSAnPGlucyBzdHlsZT1cImJhY2tncm91bmQ6I2U2ZmZlNjtcIj4nICsgdGV4dCArICc8L2lucz4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERJRkZfREVMRVRFOlxuICAgICAgICAgIGh0bWxbeF0gPSAnPGRlbCBzdHlsZT1cImJhY2tncm91bmQ6I2ZmZTZlNjtcIj4nICsgdGV4dCArICc8L2RlbD4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERJRkZfRVFVQUw6XG4gICAgICAgICAgaHRtbFt4XSA9ICc8c3Bhbj4nICsgdGV4dCArICc8L3NwYW4+JztcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGh0bWwuam9pbignJyk7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZSBhbmQgcmV0dXJuIHRoZSBzb3VyY2UgdGV4dCAoYWxsIGVxdWFsaXRpZXMgYW5kIGRlbGV0aW9ucykuXG4gICAqIEBwYXJhbSB7IURpZmY+fSBkaWZmcyBBcnJheSBvZiBkaWZmIHR1cGxlcy5cbiAgICogQHJldHVybiB7c3RyaW5nfSBTb3VyY2UgdGV4dC5cbiAgICovXG4gIHRleHQxKGRpZmZzOiBEaWZmW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IHRleHQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgICAgaWYgKGRpZmZzW3hdWzBdICE9PSBESUZGX0lOU0VSVCkge1xuICAgICAgICB0ZXh0W3hdID0gZGlmZnNbeF1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0LmpvaW4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgYW5kIHJldHVybiB0aGUgZGVzdGluYXRpb24gdGV4dCAoYWxsIGVxdWFsaXRpZXMgYW5kIGluc2VydGlvbnMpLlxuICAgKiBAcGFyYW0geyFEaWZmPn0gZGlmZnMgQXJyYXkgb2YgZGlmZiB0dXBsZXMuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gRGVzdGluYXRpb24gdGV4dC5cbiAgICovXG4gIHRleHQyKGRpZmZzOiBEaWZmW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IHRleHQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgICAgaWYgKGRpZmZzW3hdWzBdICE9PSBESUZGX0RFTEVURSkge1xuICAgICAgICB0ZXh0W3hdID0gZGlmZnNbeF1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXh0LmpvaW4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGUgdGhlIExldmVuc2h0ZWluIGRpc3RhbmNlOyB0aGUgbnVtYmVyIG9mIGluc2VydGVkLCBkZWxldGVkIG9yXG4gICAqIHN1YnN0aXR1dGVkIGNoYXJhY3RlcnMuXG4gICAqIEBwYXJhbSB7IUFycmF5LjwhRGlmZj59IGRpZmZzIEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IE51bWJlciBvZiBjaGFuZ2VzLlxuICAgKi9cbiAgbGV2ZW5zaHRlaW4oZGlmZnM6IERpZmZbXSk6IG51bWJlciB7XG4gICAgbGV0IGxldmVuc2h0ZWluID0gMDtcbiAgICBsZXQgaW5zZXJ0aW9ucyA9IDA7XG4gICAgbGV0IGRlbGV0aW9ucyA9IDA7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgICAgY29uc3Qgb3AgPSBkaWZmc1t4XVswXTtcbiAgICAgIGNvbnN0IGRhdGEgPSBkaWZmc1t4XVsxXTtcbiAgICAgIHN3aXRjaCAob3ApIHtcbiAgICAgICAgY2FzZSBESUZGX0lOU0VSVDpcbiAgICAgICAgICBpbnNlcnRpb25zICs9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERJRkZfREVMRVRFOlxuICAgICAgICAgIGRlbGV0aW9ucyArPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBESUZGX0VRVUFMOlxuICAgICAgICAgIC8vIEEgZGVsZXRpb24gYW5kIGFuIGluc2VydGlvbiBpcyBvbmUgc3Vic3RpdHV0aW9uLlxuICAgICAgICAgIGxldmVuc2h0ZWluICs9IE1hdGgubWF4KGluc2VydGlvbnMsIGRlbGV0aW9ucyk7XG4gICAgICAgICAgaW5zZXJ0aW9ucyA9IDA7XG4gICAgICAgICAgZGVsZXRpb25zID0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgbGV2ZW5zaHRlaW4gKz0gTWF0aC5tYXgoaW5zZXJ0aW9ucywgZGVsZXRpb25zKTtcbiAgICByZXR1cm4gbGV2ZW5zaHRlaW47XG4gIH1cblxuICAvKipcbiAgICogQ3J1c2ggdGhlIGRpZmYgaW50byBhbiBlbmNvZGVkIHN0cmluZyB3aGljaCBkZXNjcmliZXMgdGhlIG9wZXJhdGlvbnNcbiAgICogcmVxdWlyZWQgdG8gdHJhbnNmb3JtIHRleHQxIGludG8gdGV4dDIuXG4gICAqIEUuZy4gPTNcXHQtMlxcdCtpbmcgIC0+IEtlZXAgMyBjaGFycywgZGVsZXRlIDIgY2hhcnMsIGluc2VydCAnaW5nJy5cbiAgICogT3BlcmF0aW9ucyBhcmUgdGFiLXNlcGFyYXRlZC4gIEluc2VydGVkIHRleHQgaXMgZXNjYXBlZCB1c2luZyAleHggbm90YXRpb24uXG4gICAqIEBwYXJhbSB7IUFycmF5LjwhRGlmZj59IGRpZmZzIEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IERlbHRhIHRleHQuXG4gICAqL1xuICB0b0RlbHRhKGRpZmZzOiBEaWZmW10pOiBzdHJpbmcge1xuICAgIGNvbnN0IHRleHQ6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBkaWZmcy5sZW5ndGg7IHgrKykge1xuICAgICAgc3dpdGNoIChkaWZmc1t4XVswXSkge1xuICAgICAgICBjYXNlIERJRkZfSU5TRVJUOlxuICAgICAgICAgIHRleHRbeF0gPSAnKycgKyBlbmNvZGVVUkkoZGlmZnNbeF1bMV0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIERJRkZfREVMRVRFOlxuICAgICAgICAgIHRleHRbeF0gPSAnLScgKyBkaWZmc1t4XVsxXS5sZW5ndGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRElGRl9FUVVBTDpcbiAgICAgICAgICB0ZXh0W3hdID0gJz0nICsgZGlmZnNbeF1bMV0ubGVuZ3RoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGV4dC5qb2luKCdcXHQnKS5yZXBsYWNlKC8lMjAvZywgJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiB0aGUgb3JpZ2luYWwgdGV4dDEsIGFuZCBhbiBlbmNvZGVkIHN0cmluZyB3aGljaCBkZXNjcmliZXMgdGhlXG4gICAqIG9wZXJhdGlvbnMgcmVxdWlyZWQgdG8gdHJhbnNmb3JtIHRleHQxIGludG8gdGV4dDIsIGNvbXB1dGUgdGhlIGZ1bGwgZGlmZi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQxIFNvdXJjZSBzdHJpbmcgZm9yIHRoZSBkaWZmLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVsdGEgRGVsdGEgdGV4dC5cbiAgICogQHJldHVybiB7IUFycmF5LjwhRGlmZj59IEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICAgKiBAdGhyb3dzIHshRXJyb3J9IElmIGludmFsaWQgaW5wdXQuXG4gICAqL1xuICBmcm9tRGVsdGEodGV4dDE6IHN0cmluZywgZGVsdGE6IHN0cmluZyk6IERpZmZbXSB7XG4gICAgY29uc3QgZGlmZnM6IERpZmZbXSA9IFtdO1xuICAgIGxldCBkaWZmc0xlbmd0aCA9IDA7IC8vIEtlZXBpbmcgb3VyIG93biBsZW5ndGggdmFyIGlzIGZhc3RlciBpbiBKUy5cbiAgICBsZXQgcG9pbnRlciA9IDA7IC8vIEN1cnNvciBpbiB0ZXh0MVxuICAgIGNvbnN0IHRva2Vuczogc3RyaW5nW10gPSBkZWx0YS5zcGxpdCgvXFx0L2cpO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgdG9rZW5zLmxlbmd0aDsgeCsrKSB7XG4gICAgICAvLyBFYWNoIHRva2VuIGJlZ2lucyB3aXRoIGEgb25lIGNoYXJhY3RlciBwYXJhbWV0ZXIgd2hpY2ggc3BlY2lmaWVzIHRoZVxuICAgICAgLy8gb3BlcmF0aW9uIG9mIHRoaXMgdG9rZW4gKGRlbGV0ZSwgaW5zZXJ0LCBlcXVhbGl0eSkuXG4gICAgICBjb25zdCBwYXJhbTogc3RyaW5nID0gdG9rZW5zW3hdLnN1YnN0cmluZygxKTtcbiAgICAgIHN3aXRjaCAodG9rZW5zW3hdLmNoYXJBdCgwKSkge1xuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGlmZnNbZGlmZnNMZW5ndGgrK10gPSBbRElGRl9JTlNFUlQsIGRlY29kZVVSSShwYXJhbSldO1xuICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAvLyBNYWxmb3JtZWQgVVJJIHNlcXVlbmNlLlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbGxlZ2FsIGVzY2FwZSBpbiBkaWZmX2Zyb21EZWx0YTogJyArIHBhcmFtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAvLyBGYWxsIHRocm91Z2guXG4gICAgICAgIGNhc2UgJz0nOlxuICAgICAgICAgIGNvbnN0IG4gPSBwYXJzZUludChwYXJhbSwgMTApO1xuICAgICAgICAgIGlmIChpc05hTihuKSB8fCBuIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG51bWJlciBpbiBkaWZmX2Zyb21EZWx0YTogJyArIHBhcmFtKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdGV4dDogc3RyaW5nID0gdGV4dDEuc3Vic3RyaW5nKHBvaW50ZXIsIChwb2ludGVyICs9IG4pKTtcbiAgICAgICAgICBpZiAodG9rZW5zW3hdLmNoYXJBdCgwKSA9PSAnPScpIHtcbiAgICAgICAgICAgIGRpZmZzW2RpZmZzTGVuZ3RoKytdID0gW0RJRkZfRVFVQUwsIHRleHRdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaWZmc1tkaWZmc0xlbmd0aCsrXSA9IFtESUZGX0RFTEVURSwgdGV4dF07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIEJsYW5rIHRva2VucyBhcmUgb2sgKGZyb20gYSB0cmFpbGluZyBcXHQpLlxuICAgICAgICAgIC8vIEFueXRoaW5nIGVsc2UgaXMgYW4gZXJyb3IuXG4gICAgICAgICAgaWYgKHRva2Vuc1t4XSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGRpZmYgb3BlcmF0aW9uIGluIGRpZmZfZnJvbURlbHRhOiAnICsgdG9rZW5zW3hdKTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwb2ludGVyICE9IHRleHQxLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEZWx0YSBsZW5ndGggKCcgKyBwb2ludGVyICsgJykgZG9lcyBub3QgZXF1YWwgc291cmNlIHRleHQgbGVuZ3RoICgnICsgdGV4dDEubGVuZ3RoICsgJykuJyk7XG4gICAgfVxuICAgIHJldHVybiBkaWZmcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGxpdCB0d28gdGV4dHMgaW50byBhbiBhcnJheSBvZiBzdHJpbmdzLiAgUmVkdWNlIHRoZSB0ZXh0cyB0byBhIHN0cmluZyBvZlxuICAgKiBoYXNoZXMgd2hlcmUgZWFjaCBVbmljb2RlIGNoYXJhY3RlciByZXByZXNlbnRzIG9uZSBsaW5lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dDEgRmlyc3Qgc3RyaW5nLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dDIgU2Vjb25kIHN0cmluZy5cbiAgICogQHJldHVybiB7e2NoYXJzMTogc3RyaW5nLCBjaGFyczI6IHN0cmluZywgbGluZUFycmF5OiAhQXJyYXkuPHN0cmluZz59fVxuICAgKiAgICAgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGVuY29kZWQgdGV4dDEsIHRoZSBlbmNvZGVkIHRleHQyIGFuZFxuICAgKiAgICAgdGhlIGFycmF5IG9mIHVuaXF1ZSBzdHJpbmdzLlxuICAgKiAgICAgVGhlIHplcm90aCBlbGVtZW50IG9mIHRoZSBhcnJheSBvZiB1bmlxdWUgc3RyaW5ncyBpcyBpbnRlbnRpb25hbGx5IGJsYW5rLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgbGluZXNUb0NoYXJzKHRleHQxOiBzdHJpbmcsIHRleHQyOiBzdHJpbmcpOiBEaWZmTGluZXNDaGFycyB7XG4gICAgbGV0IGxpbmVBcnJheSA9IFtdOyAvLyBlLmcuIGxpbmVBcnJheVs0XSA9PSAnSGVsbG9cXG4nXG4gICAgbGV0IGxpbmVIYXNoID0ge307IC8vIGUuZy4gbGluZUhhc2hbJ0hlbGxvXFxuJ10gPT0gNFxuXG4gICAgLy8gJ1xceDAwJyBpcyBhIHZhbGlkIGNoYXJhY3RlciwgYnV0IHZhcmlvdXMgZGVidWdnZXJzIGRvbid0IGxpa2UgaXQuXG4gICAgLy8gU28gd2UnbGwgaW5zZXJ0IGEganVuayBlbnRyeSB0byBhdm9pZCBnZW5lcmF0aW5nIGEgbnVsbCBjaGFyYWN0ZXIuXG4gICAgbGluZUFycmF5WzBdID0gJyc7XG5cbiAgICAvLyBBbGxvY2F0ZSAyLzNyZHMgb2YgdGhlIHNwYWNlIGZvciB0ZXh0MSwgdGhlIHJlc3QgZm9yIHRleHQyLlxuICAgIGxldCBtYXhMaW5lcyA9IDQwMDAwO1xuICAgIGNvbnN0IGNoYXJzMSA9IHV0aWxzLmxpbmVzVG9DaGFyc011bmdlKHRleHQxLCBsaW5lQXJyYXksIGxpbmVIYXNoLCBtYXhMaW5lcyk7XG4gICAgbWF4TGluZXMgPSA2NTUzNTtcbiAgICBjb25zdCBjaGFyczIgPSB1dGlscy5saW5lc1RvQ2hhcnNNdW5nZSh0ZXh0MiwgbGluZUFycmF5LCBsaW5lSGFzaCwgbWF4TGluZXMpO1xuICAgIHJldHVybiB7IGNoYXJzMTogY2hhcnMxLCBjaGFyczI6IGNoYXJzMiwgbGluZUFycmF5OiBsaW5lQXJyYXkgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWh5ZHJhdGUgdGhlIHRleHQgaW4gYSBkaWZmIGZyb20gYSBzdHJpbmcgb2YgbGluZSBoYXNoZXMgdG8gcmVhbCBsaW5lcyBvZlxuICAgKiB0ZXh0LlxuICAgKiBAcGFyYW0geyFBcnJheS48IWRpZmZfbWF0Y2hfcGF0Y2guRGlmZj59IGRpZmZzIEFycmF5IG9mIGRpZmYgdHVwbGVzLlxuICAgKiBAcGFyYW0geyFBcnJheS48c3RyaW5nPn0gbGluZUFycmF5IEFycmF5IG9mIHVuaXF1ZSBzdHJpbmdzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2hhcnNUb0xpbmVzKGRpZmZzOiBEaWZmW10sIGxpbmVBcnJheTogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFycyA9IGRpZmZzW2ldWzFdO1xuICAgICAgbGV0IHRleHQgPSBbXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hhcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgdGV4dFtqXSA9IGxpbmVBcnJheVtjaGFycy5jaGFyQ29kZUF0KGopXTtcbiAgICAgIH1cbiAgICAgIGRpZmZzW2ldWzFdID0gdGV4dC5qb2luKCcnKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=