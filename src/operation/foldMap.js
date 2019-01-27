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
 * The foldMap function
 * @method foldMap
 * @memberof module:operation
 * @param {Function} A function returning a Semigroup to fold into
 * @param {Foldable} a The values to fold
 * @return {Semigroup} All values folded into the Semigroup
 *
 * @example
 * const {Sum} = require('futils').monoid;
 * const {foldMap} = require('futils').operation;
 *
 * const sum = (n) => n <= 0 ? Sum.empty() : Sum.of(n);
 * 
 * foldMap(sum, [1, -2, 3, 4]); // -> Sum(8)
 * foldMap(sum);                // -> (Foldable -> Sum)
 */
export const foldMap = (f, a) => {
    return a == null ? (b) => foldMap(f, b) :
            a.foldMap ? a.foldMap(f) :
            a.reduce((x, y) => x == null ? f(y) : x.concat(f(y)), null);
}