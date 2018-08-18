/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Provides the filter function. Filter takes a function which returns a Boolean
 * and a Filterable collection and keeps only the items for which the function
 * returns true
 * @module operation/filter
 */



/**
 * The filter function
 * @method filter
 * @memberof module:operation/filter
 * @param {Function} f The function to filter with
 * @param {Filterable} a A Filterable interface implementing type
 * @return {Filterable} A new instance of the Filterable
 *
 * @example
 * const {filter} = require('futils/operation');
 *
 * const even = (n) => n % 2 === 0;
 * 
 * filter(even, [1, 2, 3]); // -> [2]
 * filter(even);            // -> (Filterable -> Filterable)
 */
export const filter = (f, a) => {
    return a == null ? (b) => filter(f, b) : a.filter(f);
}