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



const matchPattern = (o, p) => {
  const t = typeOf(o);
  if (typeOf(p[t]) === 'Function') {
    return p[t](o);
  }
  if (typeOf(p._) === 'Function') {
    return p._(o);
  }
  throw `caseOf :: No pattern matched ${t} in ${Object.keys(o)}`;
}



/**
 * The caseOf function is useful to apply pattern matching to a type. This allows
 * for various uses, like functions which work differently in regards to the type
 * of the given value. Also have a look at the examples below.
 * @method caseOf
 * @memberof module:operation
 * @version 3.1.0
 * @param {Object} a A mapping of types to functions
 * @param {any} b The value to pattern match against
 * @return {any} Returns the result of the matching function
 *
 * @example Function handling different types of arguments
 * const {caseOf} = require('futils').operation;
 *
 * const reverse = caseOf({
 *   Array: a => [...a].reverse(),
 *   String: a => a.split('').reverse().join(''),
 *   _: a => a
 * });
 *
 *
 * const nums = [1, 2, 3, 4];
 * const text = 'Hello!';
 *
 * reverse(nums); // -> [4, 3, 2, 1]
 * reverse(text); // -> '!olleH'
 *
 * 
 *  
 * @example Usage with a custom union type
 * const {caseOf} = require('futils').operation;
 * const {UnionType} = require('futils').adt;
 *
 * const Num = UnionType('Num', { OK: ['value'], Err: ['desc'] });
 * const {OK, Err} = Num;
 *
 * 
 * const divBy = a => caseOf({
 *   OK: b => a === 0 ? Err('ZeroDivision: ${b}/${a}') : OK(b / a),
 *   Err: b => Err(b),
 *   _: _ => _
 * });
 *
 *
 * const nums = [2, 0, 3];
 *
 * const div18ByNums = nums.map(divBy).reduce((a, f) => f(a), 18);
 *
 * div18ByNums; // -> Err({ desc: 'ZeroDivison 9 / 0' })
 */
export const caseOf = (a, b) => a === void 0 ? caseOf :
                                b === void 0 ? (c) => caseOf(a, c) :
                                b && typeOf(b.caseOf) === 'Function' ? b.caseOf(a) :
                                matchPattern(b, a);