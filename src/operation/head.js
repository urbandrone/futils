/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the head function. It takes the first element from a List, Series or
 * Array and returns it. If the the first element is either null or undefined,
 * it returns null
 * @module operation/head
 */



const _fst = a => typeof a === 'string' || isNaN(a.length) ? a :
                    a[0] == null ? null : a[0];



/**
 * The head function
 * @method head
 * @memberof module:operation/head
 * @param {Array|Cons|Series} a The collection to take the head from
 * @return {any|null} Either the head or null
 *
 * @example
 * const {head} = require('futils/operation');
 *
 * head(['a', 'b']); // -> 'a'
 * head([]);         // -> null
 */
export const head = a => a == null ? null : a.head ? a.head() : _fst(a);