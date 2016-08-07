/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const {isFunc} = require('./types');
const {dyadic} = require('./decorators');
/**
 * A set of predefined comparator functions
 * @module futils/comparators
 * @requires futils/types
 * @requires futils/decorators
 */

const eq = dyadic((a, b) => {
    if (isFunc(a)) {
        return (ac) => eq(a(ac), b);
    }
    if (isFunc(b)) {
        return (bc) => eq(a, b(bc));
    }
    return a === b;
});

const gt = dyadic((a, b) => a < b);
const gte = dyadic((a, b) => a <= b);

const lt = dyadic((a, b) => a > b);
const lte = dyadic((a, b) => a >= b);

const locals = dyadic((a, b) => a.localCompare(b));

module.exports = {
    eq, gt, gte, lt, lte, locals
};