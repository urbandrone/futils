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
 * The liftA function. Use liftA to lift a curried function to 2 or
 * more Apply implementing data structures
 * @method liftA
 * @memberof module:operation
 * @param {Function} f The function to lift
 * @param {...Apply} a Applys to apply the function to
 * @return {Apply} A new instance of the Apply
 *
 * @example
 * const {Id} = require('futils').data;
 * const {liftA} = require('futils').operation;
 *
 * const add = (a) => (b) => (c) => a + b + c;
 * 
 * liftA(add, Id.of(1), Id.of(2), Id.of(3)); // -> Id(6)
 * liftA(add);                               // -> (Apply -> Apply -> Apply -> Apply)
 */
export const liftA = (f, a, ...as) => {
    return a == null ? (b, ...bs) => liftA(f, b, ...bs) :
            as.length < 1 ? (...bs) => liftA(f, a, ...bs) :
            as.reduce((x, y) => x.ap(y), a.map(f));
}