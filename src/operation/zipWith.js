// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { typeOf } from '../core/typeof';

/*
 * @module operation
 */

const _zipWith = (f, a, b) => {
  let u = typeOf(f),
    t = typeOf(a),
    s = typeOf(b);
  if (u === 'Function') {
    if (t === 'Array' && s === t) {
      return a.length > b.length
        ? b.map((x, i) => f(a[i], x))
        : a.map((x, i) => f(x, b[i]));
    }
    throw `zipWith :: Expected second and third arguments to be arrays but saw ${t} & ${s}`;
  }
  throw `zipWith :: Expected first argument to be function but saw ${u}`;
};

/**
 * The zipWith function allows to combine the contents of two arrays with the
 * help of a combiner function.
 * @method zipWith
 * @since 3.1.2
 * @memberof module:operation
 * @param {Function} f The function to map with
 * @param {Array} a The first array of values
 * @param {Array} b The second array of values
 * @return {Array} A new array of combined values from a and b
 *
 * @example
 * const {zipWith} = require('futils').operation;
 *
 * const zipper = (a, b) => a + b;
 *
 * zipWith(zipper, [1, 2], [3, 4]); // -> [4, 6]
 * zipWith(zipper);         // -> (Array a -> Array b -> Array c)
 */
export const zipWith = (f, a, b) =>
  f === void 0
    ? zipWith
    : a === void 0
    ? (c, d) => zipWith(f, c, d)
    : b === void 0
    ? c => zipWith(f, a, c)
    : _zipWith(f, a, b);
