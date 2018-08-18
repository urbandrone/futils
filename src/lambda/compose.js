/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';


/**
 * Provides the compose function
 * @module lambda/compose
 */



/**
 * The compose function combines multiple functions from right to left
 * @method compose
 * @memberof module:lambda/compose
 * @param {Function} ...f The function to compose
 * @return {Function} The result of the composition
 *
 * @example
 * const {compose} = require('futils/lambda');
 *
 * const inc = (n) => n + 1;
 * const double = (n) => n * 2;
 *
 * const fc = compose(double, inc);
 *
 * double(inc(1)) === fc(1); // -> true
 */
export const compose = (...f) => arity(
    f[f.length - 1].length,
    f.reduceRight((a, b) => (...xs) => b(a(...xs)))
);