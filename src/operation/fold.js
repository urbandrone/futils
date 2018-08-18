/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the fold function. Usually fold is used to combine a set of values
 * into a Monoid structure
 * @module operation/fold
 */



/**
 * The fold function
 * @method fold
 * @memberof module:operation/fold
 * @param {Monoid} A The Monoid type constructor to fold into
 * @param {Foldable} a The values to fold
 * @return {Monoid} All values folded into the Monoid
 *
 * @example
 * const {Sum} = require('futils/monoid');
 * const {fold} = require('futils/operation');
 *
 * fold(Sum, [1, 2, 3, 4]); // -> Sum(10)
 * fold(Sum);               // -> (Foldable -> Sum)
 */
export const fold = (M, a) => {
    return a == null ? (b) => fold(M, b) :
            a.fold ? a.fold(M) :
            a.reduce((x, y) => x.concat(M.of(y)), M.empty());
}