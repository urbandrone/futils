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
 * The biMap function is useful when working with BiFunctor implementing types
 * @method biMap
 * @memberof module:operation
 * @version 3.1.0
 * @param {Function} f A failure/lhs handling function
 * @param {Function} g A success/rhs handling function
 * @param {BiFunctor} B The BiFunctor to biMap over
 * @return {BiFunctor} A new instance of the BiFunctor
 *
 * @example
 * const {biMap} = require('futils').operation;
 * const {Maybe} = require('futils').data;
 *
 * const err = () => 'No value';
 * const succ = a => `Value: ${a}`;
 *
 * biMap(err, succ, Maybe.of(1));  // -> Some('Value: 1')
 * biMap(err, succ, Maybe.None()); // -> Some('No value')
 */
export const biMap = (f, g, a) => f === void 0 ? biMap :
                                  g === void 0 ? (h, b) => biMap(f, h, b) :
                                  a === void 0 ? (b) => biMap(f, g, b) :
                                  a === null ? null :
                                  a.biMap(f, g);