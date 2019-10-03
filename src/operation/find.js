// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*
 * @module operation
 */

const _find = (f, a) => {
  let r = a.find(f);
  return r === null || r === void 0 ? null : r;
};

/**
 * The find function. It takes a predicate function and a Filterable
 * implementing type and returns either the first element for which the predicate
 * returns true or it returns null if the no element fulfills the predicate
 * @method find
 * @memberof module:operation
 * @param {Function} f The function to find with
 * @param {Filterable} a A Filterable interface implementing type
 * @return {any|null} Either the first found value or null
 *
 * @example
 * const {find} = require('futils').operation;
 *
 * const even = (n) => n % 2 === 0;
 *
 * find(even, [1, 2, 3]); // -> 2
 * find(even);      // -> (Filterable -> any)
 */
export const find = (f, a) =>
  f === void 0
    ? find
    : a === void 0
    ? b => find(f, b)
    : Array.isArray(a)
    ? _find(f, a)
    : a.find(f);
