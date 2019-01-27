/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/*
 * @module operation
 */



/**
 * The flatMap function which maps a function which returns a data
 * structure over a structure of the same type and flattens the result one level
 * @method flatMap
 * @memberof module:operation
 * @param {Function} f The function to flatMap with
 * @param {Monad|Array|Promise} a Any Array and/or Monad interface implementing type, as well as Promise
 * @return {Monad|Array|Promise} A new instance of the Array or Monad or Promise
 *
 * @example
 * const {flatMap} = require('futils').operation;
 *
 * flatMap((a) => [a.toUpperCase()], ['a', 'b']); // -> ['A', 'B']
 * flatMap((a) => [a.toUpperCase()]);             // -> (Monad -> Monad)
 */
export const flatMap = (f, a) => {
    return a == null ? (b) => flatMap(f, b) :
            typeof a.flatMap === 'function' ? a.flatMap(f) :
            typeof a.then === 'function' ? a.then(f, x => x) :
            a.reduce((x, y) => x.concat(f(y)), []);
}