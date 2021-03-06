// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { curry } from '../lambda/curry';
import { map } from '../operation/map';
import { Val } from './_Val';

/*
 * @module optic
 */

/**
 * The mapped function, which is a special lens for arrays.
 * @method mapped
 * @memberof module:optic
 * @version 3.0.0
 * @param {Function} f Data transformation function
 * @param {Array} a The nested data structure
 * @return {LensVal} A LensVal
 *
 * @example
 * const {mapped, over} = require('futils').optic;
 *
 * const even = (n) => n % 2 === 0;
 *
 * over(mapped, even, [1, 2, 3]); // -> [false, true, false]
 */
export const mapped = curry((f, a) => Val(map(x => f(x).value, a)));
