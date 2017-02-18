/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Provides functional trampolines
 * @module futils/trampolines
 */
import {aritize} from './arity';
import {isObject, isFunc} from './types';


const SUSPENDED = Symbol('SuspendedInvocation');

/**
 * Suspends the invocation of a function. Usually this is used in conjunction
 *     with trampolines
 * @method 
 * @version 2.2.0
 * @param {function} f The function to suspend
 * @param {any} [args*] Optional args to partially apply on the next invocation
 * @return {Suspended} A suspended invocation
 */
export const suspend = (f, ...args) => ({
    [SUSPENDED]: true,
    run: () => f(...args)
});

const isSuspended = (a) => isObject(a) &&
                           isFunc(a.run) &&
                           a[SUSPENDED];

/**
 * Wraps a tail recursive function into a tramponline which executes it savely
 *     as soon as it is called without growing the stack. Any arguments passed
 *     to the trampoline are used to create the seed value from the passed in
 *     function
 * @method 
 * @version 2.2.0
 * @param {function} f) The function to wrap in a trampoline
 * @return {function} A trampolined function
 *
 * @example
 * const {trampoline} = require('futils');
 *
 * const factorial = trampoline((n, m = 1) => {
 *     // note that we have the base case first which terminates the
 *     //   computation and if it does not hit, we return a suspended
 *     //   invocation with 'suspend(...)'
 *     return n <= 1 ? m : suspend(factorial, n - 1, n * m);
 * });
 *
 * // let the magic happen (oh, and you need BigInt support of course...)
 * console.log(factorial(25000));
 */
export const trampoline = (f) => {
    if (isFunc(f)) {
        return aritize(f.length, (...xs) => {
            let result = f(...xs);
            while (isSuspended(result)) {
                result = result.run();
            }
            return result;
        });
    }
    throw 'trampoline :: expected argument to be function but saw ' + f;
};