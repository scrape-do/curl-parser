/**
 * Source: https://github.com/jimmycuadra/shellwords
 * License:
  Copyright (C) 2011-2022 by Jimmy Cuadra

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
 */
const scan = (
  string: string,
  pattern: RegExp,
  callback: (match: RegExpMatchArray) => void
) => {
  let result = "";

  while (string.length > 0) {
    const match = string.match(pattern);

    if (match && match.index != null && match[0] != null) {
      result += string.slice(0, match.index);
      result += callback(match);
      string = string.slice(match.index + match[0].length);
    } else {
      result += string;
      string = "";
    }
  }

  return result;
};

/**
 * Splits a string into an array of tokens in the same way the UNIX Bourne shell does.
 *
 * @param line A string to split.
 * @returns An array of the split tokens.
 */
export const split = (line: string = "") => {
  const words = [];
  let field = "";
  scan(
    line,
    /\s*(?:([^\s\\\'\"]+)|'((?:[^\'\\]|\\.)*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/,
    (match) => {
      const [, word, sq, dq, escape, garbage, separator] = match;

      if (garbage != null) {
        throw new Error(`Unmatched quote: ${line}`);
      }

      if (word) {
        field += word;
      } else {
        let addition;

        if (sq) {
          addition = sq;
        } else if (dq) {
          addition = dq;
        } else if (escape) {
          addition = escape;
        }

        if (addition) {
          field += addition.replace(/\\(?=.)/, "");
        }
      }

      if (separator != null) {
        words.push(field);
        field = "";
      }
    }
  );

  if (field) {
    words.push(field);
  }

  return words;
};

/**
 * Escapes a string so that it can be safely used in a Bourne shell command line.
 *
 * @param str A string to escape.
 * @returns The escaped string.
 */
export const escape = (str = "") => {
  return str
    .replace(/([^A-Za-z0-9_\-.,:/@\n])/g, "\\$1")
    .replace(/\n/g, "'\n'");
};
