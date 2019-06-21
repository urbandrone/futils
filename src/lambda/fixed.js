// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



/*
 * @module lambda
 */



/**
 * The fixed function. For a given function f, returns a function g which
 * represents the fixed point of f. Note: The returned function isn't stack safe.
 * If you need stack safety, use the functions in the [trampoline]{@link module:trampoline}
 * package
 * @method fixed
 * @memberof module:lambda
 * @param {Function} f the initial function
 * @return {Function} The fixed point of f
 *
 * @example
 * const {fixed} = require('futils').lambda;
 *
 * const factorial = fixed((fact) => (n) => n < 1 ? 1 : n * fact(n - 1));
 *
 * factorial(6); // -> 720
 */
export const fixed = f => (g => g(g))(h => f((...xs) => h(h)(...xs)));