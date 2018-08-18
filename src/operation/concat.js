/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the concat function
 * @module operation/concat
 */



/**
 * The concat function
 * @method concat
 * @memberof module:operation/concat
 * @param {Semigroup} a The Semigroup to concat
 * @param {Semigroup} b The Semigroup to concattenate with
 * @return {Semigroup} Both Semigroup instances combined
 *
 * @example
 * const {concat} = require('futils/operation');
 *
 * const nums = [1, 2, 3];
 * 
 * concat([4, 5, 6], nums); // -> [1, 2, 3, 4, 5, 6]
 * concat([4, 5, 6]);       // -> (Semigroup -> Semigroup)
 */
export const concat = (a, b) => b == null ? (c) => concat(a, c) : b.concat(a);