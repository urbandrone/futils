// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import {typeOf} from '../core/typeof';
import {zipWith} from './zipWith';



/*
 * @module operation
 */



/**
 * The zip function combines the contents of two arrays into pairs of a single
 * array.
 * @method zip
 * @since 3.1.2
 * @memberof module:operation
 * @param {Array} a The first array of values
 * @param {Array} b The second array of values
 * @return {Array} A new array of combined values from a and b
 *
 * @example
 * const {zip} = require('futils').operation;
 * 
 * zip([1, 2], [3, 4, 5]); // -> [[1, 3], [2, 4]]
 * zip([1, 2]);                 // -> (Array a -> Array [Number, a]
 */
export const zip = zipWith((a, b) => [a, b]);