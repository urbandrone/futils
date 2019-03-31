/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from '../core/arity';
import {typeOf} from '../core/typeof';
import {IS_RECUR} from './again';



/*
 * @module trampoline
 */



/**
 * The recur function for building recursive functions with
 * trampolines. 
 * @method recur
 * @memberof module:trampoline
 * @param {Function} f The function which shall be suspended
 * @param {...any} a Arguments for next invocation
 * @return {any} The final value
 *
 * @example
 * const {recur, again} = require('futils').trampoline;
 *
 * const factorial = recur(function factLoop (n, m) {
 *     return n <= 1 ? m : again(factLoop, n - 1, n * m);
 * });
 *
 * factorial(5, 1); // -> 120
 */
export const recur = f => arity(f.length, (...a) => {
    let r = f(...a);
    while (typeOf(r) === 'Function' && r[IS_RECUR]) {
        r = r();
    }
    return r;
});