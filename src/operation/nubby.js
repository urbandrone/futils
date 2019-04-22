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



const _uniq = f => (a, b) => a.find(x => f(b, x)) != null ? a : a.concat(b);



/**
 * The nubBy function, which removes duplicates from either a List or an
 * Array with a predicate function. The predicate function has to return true for
 * elements which should be removed
 * @method nubBy
 * @memberof module:operation
 * @param {Function} f The predicate function
 * @param {Array|Cons|Nil} a The collection to remove duplicates from
 * @return {Array|Cons|Nil} A new collection with all duplicates removed
 *
 * @example
 * const {nubBy} = require('futils').operation;
 *
 * const eq = (a, b) => a === b;
 * 
 * nubBy(eq, ['a', 'b', 'a']); // -> ['a', 'b']
 * nubBy(eq, []);              // -> []
 */
export const nubBy = (f, a) => f === void 0 ? nubBy :
                               a === void 0 ? (b) => nubBy(f, b) :
                               a === null ? a :
                               a.nubBy ? a.nubBy(f) :
                               a.reduce(_uniq(f), []);