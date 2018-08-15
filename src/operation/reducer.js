/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the reduceRight function. Reduces the values inside a structure to a
 * single value. Starts with the last value
 * @module operation/reducer
 */



/**
 * The reduceRight function
 * @method reduceRight
 * @memberOf module:operation/reducer
 * @param {Function} f The function to reduce with
 * @param {any} a A value to reduce into
 * @param {Foldable} a A Foldable interface implementing type
 * @return {any} All values reduced into one value
 *
 * @example
 * const {reduceRight} = require('futils/operation');
 *
 * reduceRight((a, b) => a + b, '', ['a', 'b']); // -> 'ba'
 * reduceRight((a, b) => a + b);                 // -> (a -> Foldable -> a)
 */
export const reduceRight = (f, b, a) => {
    return b == null ? (c, d) => reduceRight(f, c, d) :
           a == null ? (c) => reduceRight(f, b, c) :
           a.reduceRight(f, b);
}