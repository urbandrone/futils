/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import decorators from './decorators';
import Identity from './monads/identity';
import Maybe, {None, Some} from './monads/maybe';
import Either, {Left, Right} from './monads/either';
import IO from './monads/io';
import State from './monads/state';
import Task from './monads/task';

/**
 * A collection of monads and monad helper functions
 * @module futils/monads
 * @requires futils/decorators
 * @requires futils/monads/identity
 * @requires futils/monads/maybe
 * @requires futils/monads/either
 * @requires futils/monads/io
 * @requires futils/monads/state
 * @requires futils/monads/task
 */

/**
 * Grants access to the Identity monad class
 * @member Identity
 */

/**
 * Grants access to the Maybe.Some monad class
 * @member Some
 */

/**
 * Grants access to the Maybe.None monad class
 * @member None
 */

/**
 * Grants access to the Maybe monad class
 * @member Maybe
 */

/**
 * Grants access to the Either.Right monad class
 * @member Right
 */

/**
 * Grants access to the Either monad class
 * @member Either
 */

/**
 * Grants access to the IO monad class
 * @member IO
 */

/**
 * Grants access to the State monad class
 * @member State
 */

/**
 * Grants access to the Task monad class
 * @member Task
 */

/**
 * Takes a (curried!) function and two Applicatives and applies the function to
 *     both 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA2, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 *
 * const add = curry((a, b) => a + b);
 *
 * liftA2(add, m1, m2); // -> Identity(2)
 */
const liftA2 = decorators.curry((f, M1, M2) => {
    return M1.map(f).ap(M2);
});

/**
 * Takes a (curried!) function and three Applicatives and applies the function to
 *     all three 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @param {Applicative} M3 Third applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA3, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 * let m3 = Identity.of(1);
 *
 * const add = curry((a, b, c) => a + b + c);
 *
 * liftA3(add, m1, m2, m3); // -> Identity(3)
 */
const liftA3 = decorators.curry((f, M1, M2, M3) => {
    return M1.map(f).ap(M2).ap(M3);
});

/**
 * Takes a (curried!) function and four Applicatives and applies the function to
 *     all four 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @param {Applicative} M3 Third applicative
 * @param {Applicative} M4 Third applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA4, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 * let m3 = Identity.of(1);
 * let m4 = Identity.of(1);
 *
 * const add = curry((a, b, c, d) => a + b + c + d);
 *
 * liftA4(add, m1, m2, m3, m4); // -> Identity(4)
 */
const liftA4 = decorators.curry((f, M1, M2, M3, M4) => {
    return M1.map(f).ap(M2).ap(M3).ap(M4);
});

/**
 * Takes a (curried!) function and five Applicatives and applies the function to
 *     all five 
 * @method 
 * @version 2.0.0 
 * @param {function} f The function to lift
 * @param {Applicative} M1 First applicative
 * @param {Applicative} M2 Second applicative
 * @param {Applicative} M3 Third applicative
 * @param {Applicative} M4 Third applicative
 * @param {Applicative} M5 Third applicative
 * @return {Applicative} Result of the last computation as an applicative
 *
 * @example
 * const {Identity, liftA5, curry} = require('futils');
 *
 * let m1 = Identity.of(1);
 * let m2 = Identity.of(1);
 * let m3 = Identity.of(1);
 * let m4 = Identity.of(1);
 * let m5 = Identity.of(1);
 *
 * const add = curry((a, b, c, d, e) => a + b + c + d + e);
 *
 * liftA5(add, m1, m2, m3, m4, m5); // -> Identity(5)
 */
const liftA5 = decorators.curry((f, M1, M2, M3, M4, M5) => {
    return M1.map(f).ap(M2).ap(M3).ap(M4).ap(M5);
});



export default {
    Identity, IO, Maybe, None, Some, State, Either, Left, Right, Task,
    liftA2, liftA3, liftA4, liftA5
};