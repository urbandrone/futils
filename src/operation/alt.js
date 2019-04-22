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
 * The alt function allows to swap any data structure which might be invalid with
 * a fallback data structure of the same type
 * @method alt
 * @memberof module:operation
 * @since 3.1.0
 * @param {Alt} o The optional Alt
 * @param {Alt} a The Alt which might be invalid
 * @return {Alt} A new instance of the Alt
 *
 * @example
 * const {Maybe} = require('futils').data;
 * const {alt} = require('futils').operation;
 *
 * alt(Maybe.of(1), Maybe.empty()); // -> Some(1)
 */
export const alt = (o, a) => o === void 0 ? alt :
                             a === void 0 ? (b) => alt(o, b) :
                             a === null ? null :
                             a.alt(o);