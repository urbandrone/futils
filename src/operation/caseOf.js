/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/*
 * @module operation
 */



/**
 * The caseOf function is useful to apply pattern matching to union types
 * @method caseOf
 * @memberof module:operation
 * @version 3.1.0
 * @param {Object} a A mapping of types to functions
 * @param {ADT} b The union type to pattern match against
 * @return {any} Returns the result of the matching function
 *
 * @example
 * const {caseOf} = require('futils').operation;
 * const {UnionType} = require('futils').adt;
 *
 * const Num = UnionType('Num', { OK: ['value'], Err: ['desc'] });
 * const {OK, Err} = Num;
 *
 * 
 * const safeFunc = f => (a, b) => caseOf({
 *   OK: x => caseOf({ OK: y => f(x + y), Err: () => b }, b),
 *   Err: () => a
 * }, a);
 *
 * const safeAdd = safeFunc((x, y) => OK(x + y));
 *
 * const safeDiv = safeFunc((x, y) => x === 0 ? Err(`ZeroDiv ${y} / ${x}`) : OK(y / x));
 *
 * 
 *
 * const nums = [1, 3, 0, 2];
 *
 * const sum = nums.map(OK).reduce(safeAdd, OK(0));
 * const err = num.map(OK).reduce(safeDiv, OK(3));
 *
 * sum; // -> OK(6)
 * err; // -> Err({ desc: 'ZeroDiv 1 / 0' })
 */
export const caseOf = (a, b) => b == null ? c => caseOf(a, c) : b.caseOf(a);