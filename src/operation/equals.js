/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {compareEq} from '../generics/Eq';


/**
 * Provides the equals function
 * @module operation/equals
 */



/**
 * The equals function
 * @method equals
 * @memberof module:operation/equals
 * @param {any} a The first value to check for equality
 * @param {any} b The second value to check against
 * @return {Boolean} True if both are equal
 *
 * @example
 * const {equals} = require('futils/operation');
 *
 * equals(null, null);           // -> true
 * equals(1, 1);                 // -> true
 * equals([1, 2, 3], [1, 2, 3]); // -> true
 * equals(1, 2);                 // -> false
 * equals(null, 0);              // -> false
 * equals([4, 5, 6], [1, 2, 3]); // -> false
 * equals(1);                    // -> (a -> 1 == a)
 */
export const equals = (a, b) => {
    return b == null ? (c) => equals(a, c) :
            typeof b.equals === 'function' ? b.equals(a) :
            compareEq(a, b);
};