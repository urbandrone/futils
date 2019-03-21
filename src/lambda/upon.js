/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';


/*
 * @module lambda
 */



/**
 * The upon function takes two functions and returns the result of calling the
 * first one with the second. This is much similar to a map operation.
 * @method upon
 * @since 3.1.0
 * @memberof module:lambda
 * @param {Function} f The function to operate upon
 * @param {Function} g The operating function
 * @return {any} The result of g applied to f
 *
 * @example
 * const {upon} = require('futils').lambda;
 *
 * const safe = f => n => typeof n !== 'number' || isNaN(n) ? 0 : f(n);
 * const double = n => n * 2;
 *
 * const safeDouble = upon(double, safe);
 *
 * safeDouble(2);    // -> 4
 * safeDouble(null); // -> 0
 */
export const upon = (f, g) => g == null ? h => upon(f, h) : g(f);