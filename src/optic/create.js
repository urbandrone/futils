/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {curry} from '../lambda/curry';
import {map} from '../operation/map';

/**
 * Provides the createLens function, which creates a factory for new
 * types of lenses
 * @module optic/create
 * @requires lambda/curry
 * @requires operation/map
 */



/**
 * The createLens function
 * @method createLens
 * @memberof module:optic/create
 * @version 3.0.0
 * @param {Function} getter A function defining how to get a value from the structure
 * @param {Function} setter A function defining how to clone the structure and set a value
 * @return {Function} A factory function which can be used to create lens types
 */
export const createLens = curry((gets, sets, k, f, a) => {
    return map((b) => sets(k, b, a), f(gets(k, a)));
});