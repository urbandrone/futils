/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/*
 * @module lambda
 */


/**
 * The partialRight function  allows to implement partial application.
 * Use undefined as placeholder for arguments that should be skipped
 * @method partialRight
 * @memberof module:lambda
 * @param {Function} f The function to prepare for partial application
 * @param {any} ...as Partial arguments to the function
 * @return {Function} A partial variant of f
 *
 * @example
 * const {partialRight} = require('futils').lambda;
 *
 * const greet = (greeting, separator, name) => {
 *     return `${greeting}${separator}${name}`;
 * }
 *
 * const pGreet = partialRight(greet);
 *
 * greet('Hello', ', ', 'world');         // -> 'Hello, world'
 * greet('Hello', ', ');                  // -> 'Hello, undefined'
 *
 * pGreet('Hello', ', ', 'world');        // -> 'world, Hello'
 * pGreet('Hello', ', ');                 // -> (a -> '${a}, Hello')
 * pGreet(undefined, undefined, 'world'); // -> (a -> b -> 'world${b}${a}')
 */
export const partialRight = (f, ...xs) => {
    let a = xs;
    if (a.length < f.length) {
        a = a.concat(new Array(Math.max(0, f.length - a.length)).fill(void 0));
    }
    return (...ys) => {
        let bs = a.map(x => x === void 0 ? ys.shift() : x);
        return bs.lastIndexOf(void 0) >= 0 ? partialRight(f, ...bs) : f(...bs.reverse());
    }
}