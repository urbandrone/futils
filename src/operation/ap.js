// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { compatAp as flCompat } from '../core/fl-compat';

/*
 * @module operation
 */

/**
 * The ap function allows to apply a function inside a Applicative to a value in
 * another Functor. Because the .then function of a Promise flattens a returned
 * Promise, ap can be used with Promise, too
 * @method ap
 * @memberof module:operation
 * @param {Applicative|Array|Promise} af The Applicative, Array or Promise to apply
 * @param {Functor|Promise} a A Functor or Promise of the same type as af
 * @return {Functor|Promise} A new instance of the Functor or Promise
 *
 * @example
 * const {Id} = require('futils').data;
 * const {ap} = require('futils').operation;
 *
 * const upper = Id.of((a) => a.toUpperCase());
 * const calc = [(a) => a + 1, (a) => a * 2];
 *
 * ap(upper, Id.of('a')); // -> Id('A')
 * ap(upper);       // -> (Functor -> Functor)
 * ap(calc, [1, 2]);    // -> [4, 6]
 */
export const ap = (af, a) =>
  af === void 0
    ? ap
    : a === void 0
    ? b => ap(af, b)
    : a === null || af === null
    ? null
    : typeof af.then === 'function'
    ? af.then(f => a.then(f, x => x), x => x)
    : flCompat(af, af.ap, a);
