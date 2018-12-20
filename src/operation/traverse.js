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
 * The traverse function
 * @method traverse
 * @memberof module:operation
 * @param {Function} f The function to traverse with
 * @param {Applicative} A Applicative type constructor to traverse into
 * @param {Traversable|Array} a A type that implements the Traversable interface
 * @return {Applicative} A new Applicative
 *
 * @example
 * const {Id} = require('futils').data;
 * const {traverse} = require('futils').operation;
 *
 * const even = (n) => Id.of(n % 2 === 0);
 * 
 * traverse(even, Id, [1, 2, 3]); // -> Id([false, true, false])
 * traverse(even);                // -> (Applicative -> Traversable -> Applicative)
 */
export const traverse = (f, A, a) => {
    return A == null ? (T, d) => traverse(f, T, d) :
           a == null ? (c) => traverse(f, A, c) :
           a.traverse ? a.traverse(f, A) :
           a.reduce((x, y) => x.concat(f(y)), A.of([]));
}