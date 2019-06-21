// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import {typeOf} from '../core/typeof';



/*
 * @module operation
 */



/**
 * The doM function, inspired by Haskell do notation. Works with all Monads as
 * well as with Promises
 * @method doM
 * @memberof module:operation
 * @param {Generator} f A generator function describing the computations
 * @return {any} The result of the computation
 *
 * @example
 * const {Id} = require('futils').data;
 * const {doM} = require('futils').operation;
 *
 * const result = doM(function * () {
 *     const a = yield Id.of(1);
 *     const b = yield Id.of(2 + a);
 *     return Id.of(b);
 * });
 *
 * result.value; // -> 3
 */
export const doM = f => {
    let t = typeOf(f);
    if (t === 'GeneratorFunction') {
        const compute = f();
        const step = v => {
            const {done, value} = compute.next(v);
            return done ? value :
                   typeof value.then === 'function' ? value.then(step, x => x) :
                   value.flatMap(step);
        }
        return step();
    }
    throw `doM :: Expected argument to be a generator function but saw ${t}`;  
}