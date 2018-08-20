/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {Recur} from './_Recur';



/**
 * Provides the again function for trampolines. It should be used to wrap a
 * function and its arguments in case the invocation needs to be suspended
 * @module trampoline/again
 */



/**
 * The again function
 * @method again
 * @memberof module:trampoline/again
 * @param {Function} f The function which shall be suspended
 * @param {...any} a Arguments for next invocation
 * @return {Recur} A recursion wrapping data structure
 *
 * @example
 * const {recur, again} = require('futils/trampoline');
 *
 * const factorial = recur((n, m = 1) => {
 *     return n <= 1 ? m : again(factorial, n - 1, n * m);
 * });
 *
 * factorial(5); // -> 120
 */
export const again = (f, ...a) => Recur(f, a);