// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { arity } from '../core/arity';
import { typeOf } from '../core/typeof';

/*
 * @module lambda
 */

const _memoized = f => {
  let t = typeOf(f);
  if (t === 'Function') {
    const cache = Object.create(null);
    return arity(f.length, (...xs) => {
      if (!cache[xs]) {
        cache[xs] = f(...xs);
      }
      return cache[xs];
    });
  }
  throw `memoize :: Expected argument to be of type function but saw ${t}`;
};

/**
 * The memoize function, memoizes the result a certain set of arguments gave
 * and returns it immediatly for the same arguments without computation.
 * Memoize can be used to wrap pure functions which do complex calculations to
 * reduce the amount of computations needed on subsequent calls
 * @method memoize
 * @memberof module:lambda
 * @param {Function} f The function to implement meoization
 * @return {Function} A memoized variant of f
 *
 * @example
 * const {memoize} = require('futils').lambda;
 *
 * const compute = (a, b) => {
 *   console.log(`${a} + ${b}`); // side effect for demo purposes
 *   return a + b;
 * }
 *
 * const memCompute = memoize(compute);
 *
 *
 * compute(1, 2);  // -> 3, logs '1 + 2'
 * compute(1, 2);  // -> 3, logs '1 + 2'
 *
 * memCompute(1, 2); // -> 3, logs '1 + 2'
 * memCompute(1, 2); // -> 3
 */
export const memoize = f => (f === void 0 ? memoize : _memoized(f));
