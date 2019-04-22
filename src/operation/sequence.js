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
 * The sequence function
 * @method sequence
 * @memberof module:operation
 * @param {Applicative} A Applicative type constructor to sequence into
 * @param {Traversable|Array} a A type that implements the Traversable interface
 * @return {Applicative} A new Applicative
 *
 * @example
 * const {Id} = require('futils').data;
 * const {sequence} = require('futils').operation;
 *
 * const ids = [Id.of(1), Id.of(2), Id.of(3)];
 * 
 * sequence(Id, ids); // -> Id([1, 2, 3])
 * sequence(Id);      // -> (Traversable -> Applicative)
 */
export const sequence = (A, a) => A === void 0 ? sequence :
                                  a === void 0 ? (b) => sequence(A, b) :
                                  a === null ? null :
                                  a.sequence ? a.sequence(A) :
                                  a.reduce((x, y) => x.concat(y), A.of([]));
