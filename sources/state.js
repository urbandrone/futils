/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const {dyadic} = require('./decorators');
const {isVoid} = require('./types');
/*
 * @module futils/state
 * @requires futils/decorators
 * @requires futils/types
 */



/**
 * Given a transform function and a seed value returns a function which
 *     update the seed with the result of the transformation function
 *     applied to the seed and the a new state
 * @method 
 * @param {function} f Transformation function
 * @param {*} init The seed value
 * @return {function} State transformer getter/setter
 *
 * @example
 * const {stateful} = require('futils')
 *
 * const add = (a, b) => a + b;
 * const counter = stateful(add, 0);
 *
 * counter(); // -> 0
 * counter(+1); // -> 1
 * counter(+2); // -> 3
 * counter(-1); // -> 2
 */
const stateful = dyadic((f, init) => {
    let now = init;
    return (next) => {
        if (!isVoid(next)) {
            now = f(now, next);
        }
        return now;
    }
});

/**
 * Given a number as seed value, returns a stateful counter function
 * @method
 * @param {number} init The seed value
 * @return {function} Count transformer getter/setter
 *
 * @example
 * const {counter} = require('futils')
 *
 * const count = counter(0);
 *
 * count(); // -> 0
 * count(+1); // -> 1
 * count(+2); // -> 3
 * count(-1); // -> 2
 */
const counter = (seed) => stateful((a, b) => a + b, seed);

const chosen = (seed) => stateful((a, b) => a === b ? a : b, seed);


module.exports = { stateful, counter, chosen }