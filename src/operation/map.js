// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { compatMap as flCompat } from '../core/fl-compat';

/*
 * @module operation
 */

/**
 * The map function. Map takes a function and maps it over the value(s)
 * of a data structure. It returns a new structure of the same type.
 * This is the natural behaviour of Promises when using the .then function,
 * except that if you return a Promise with the value inside it,
 * the returned Promise has only a single level (it naturally flattens).
 * @method map
 * @memberof module:operation
 * @param {Function} f The function to map with
 * @param {Functor|Promise} a A Functor interface implementing type or a Promise
 * @return {Functor|Promise} A new instance of the Functor or Promise
 *
 * @example
 * const {map} = require('futils').operation;
 *
 * map((a) => a.toUpperCase(), ['a', 'b']); // -> ['A', 'B']
 * map((a) => a.toUpperCase());       // -> (Functor -> Functor)
 */
export const map = (f, a) =>
  f === void 0
    ? map
    : a === void 0
    ? b => map(f, b)
    : a === null
    ? a
    : typeOf(a.then) === 'Function'
    ? a.then(f, x => x)
    : flCompat(a, a.map, f);
