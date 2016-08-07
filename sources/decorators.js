/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const {isFunc} = require('./types');
const aritize = require('./aritize');
/**
 * A collection of function decorator functions. Please note that these are not
 *     compatible with the proposed ES7 method decorators
 * @module futils/decorators
 * @requires futils/types
 * @requires futils/aritize
 */


/**
 * Takes a function with a arity of N and returns a variant with arity of 1
 * @method
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {monadic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
 *
 * monadic(all)(1, 2, 3, 4); // -> [1]
 */
const monadic = (f) => {
    if (isFunc(f)) {
        return (x = void 0) => {
            if (x === void 0) {
                return monadic(f);
            }
            return f(x);
        }
    }
    throw 'decorators::monadic awaits a function but saw ' + f;
}

/**
 * Takes a function with a arity of N and returns a variant with arity of 2
 * @method
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {dyadic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
 *
 * const just2 = dyadic(all);
 * just2(1, 2, 3, 4); // -> [1, 2]
 */
const dyadic = (f) => {
    if (isFunc(f)) {
        return (x = void 0, y = void 0) => {
            if (x === void 0) {
                return dyadic(f);
            }
            if (y === void 0) {
                return monadic((_y) => f(x, _y));
            }
            return f(x, y);
        }
    }
    throw 'decorators::dyadic awaits a function but saw ' + f;
}

/**
 * Takes a function with a arity of N and returns a variant with arity of 3
 * @method
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {triadic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4); // -> [1, 2, 3, 4]
 *
 * const just3 = triadic(all);
 * just3(1, 2, 3, 4); // -> [1, 2, 3]
 */
const triadic = (f) => {
    if (isFunc(f)) {
        return (x = void 0, y = void 0, z = void 0) => {
            if (x === void 0) {
                return triadic(f);
            }
            if (y === void 0) {
                return dyadic((_y, _z) => f(x, _y, _z));
            }
            if (z === void 0) {
                return monadic((_z) => f(x, y, _z));
            }
            return f(x, y, z);
        }
    }
    throw 'decorators::triadic awaits a function but saw ' + f;
}

/**
 * Takes a function with a arity of N and returns a variant with arity of 4
 * @method
 * @param {function} f Function to wrap
 * @return {function} Wrapped function
 *
 * @example
 * const {tetradic} = require('futils');
 * 
 * var all = (...xs) => xs;
 *
 * all(1, 2, 3, 4, 5); // -> [1, 2, 3, 4, 5]
 *
 * const just4 = tetradic(all);
 * just4(1, 2, 3, 4, 5); // -> [1, 2, 3, 4]
 */
const tetradic = (f) => {
    if (isFunc(f)) {
        return (x = void 0, y = void 0, z = void 0) => {
            if (x === void 0) {
                return triadic(f);
            }
            if (y === void 0) {
                return dyadic((_y, _z) => f(x, _y, _z));
            }
            if (z === void 0) {
                return monadic((_z) => f(x, y, _z));
            }
            return f(x, y, z);
        }
    }
    throw 'decorators::tetradic awaits a function but saw ' + f;
}

/**
 * Takes a function and returns a variant of it which will only executed once
 * @method
 * @param {function} f The function to wrap
 * @return {function} A wrapped function
 *
 * @example
 * const {once} = require('futils');
 *
 * var N = 0;
 * const inc = () => N += 1;
 *
 * const incOnce = once(inc);
 *
 * inc();
 * inc();
 * inc();
 * N; // -> 3
 *
 * incOnce();
 * incOnce();
 * incOnce();
 * N; // -> 4
 */
const once = (f) => {
    var called = 0;
    if (isFunc(f)) {
        return aritize(f.length, (...xs) => {
            if (called === 0) {
                called = 1;
                return f(...xs);
            }
            return null;
        });
    }
    throw 'decorators::once awaits a function but saw ' + f;
}

/**
 * Takes a predicate function and returns the invariant of it
 * @method
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {not} = require('futils');
 *
 * const lower1 = (n) => n < 1;
 * const greater1 = not(lower1);
 *
 * lower1(0); // -> true
 * greater1(2); // -> true
 */
const not = (f) => {
    if (isFunc(f)) {
        return aritize(f.length, (...xs) => !f(...xs));
    }
    throw 'decorators::not awaits a function but saw ' + f;
}

/**
 * Takes a function and returns a variant which calls the original function with
 * the arguments reversed
 * @method
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {flip} = require('futils');
 *
 * const divideWith = (a, b) => a / b;
 * const divideWithR = flip(divideWith);
 *
 * divideWith(2, 4); // -> 2
 * divideWithR(2, 4); // -> 0.5
 */
const flip = (f) => {
    if (isFunc(f)) {
        return aritize(f.length, (...xs) => f(...xs.reverse()));
    }
    throw 'decorators::flip awaits a function but saw ' + f;
}

/**
 * Takes a function and returns a variant, which only executes if the given
 *     argument is not `null` or `undefined`
 * @method
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {maybe} = require('futils');
 *
 * const toUpper = (s) => s.toUpperCase();
 * const mToUpper = maybe(toUpper);
 *
 * toUpper('hello'); // -> 'HELLO'
 * toUpper(); // -> Error trown
 *
 * mToUpper('hello'); // -> 'HELLO';
 * mToUpper(); // -> null
 */
const maybe = (f) => {
    if (isFunc(f)) {
        return (x = void 0) => {
            return x == null || x === void 0 ? null : f(x);
        }
    }
    throw 'decorators::maybe awaits a function but saw ' + f;
}

const CurryLeftHand = (f, ...args) => {
    // used internally, not exposed. Recursively curries a given function until
    //   it has consumed enough parameters to execute the given function with
    //   the arguments in the given order (lefthand)
    return aritize(f.length - args.length, (...xs) => {
        var _as = args.concat(xs);        
        if (_as.length >= f.length) {
            return f(..._as);
        }
        return CurryLeftHand(f, ..._as);
    });
}

/**
 * Takes a function and returns a variant of it, which consecutevly consumes
 *     more arguments until enough parameters are given to execute the given
 *     function
 * @method
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {curry} = require('futils');
 *
 * const greet = (greeting, who) => greeting + ' ' + who + '!';
 * const cGreet = curry(greet);
 *
 * greet('Hello', 'World'); // -> 'Hello World!'
 * greet('Hello'); // -> 'Hello undefined!'
 *
 * cGreet('Hello', 'World'); // -> 'Hello World!'
 * cGreet('Hello'); // -> function
 * 
 * const greetHello = cGreet('Hello');
 * greetHello('World'); // -> 'Hello World!'
 */
const curry = (f) => {
    if (isFunc(f)) {
        if (f.length < 2) { return f; }
        return CurryLeftHand(f);
    }
    throw 'decorators::curry awaits a function but saw ' + f;
}

const CurryRightHand = (f, ...args) => {
    // internally used, works like CurryLeftHand but finally reverses the
    //     given arguments before applying them
    return aritize(f.length - args.length, (...xs) => {
        var _as = args.concat(xs);        
        if (_as.length >= f.length) {
            return f(..._as.reverse());
        }
        return CurryRightHand(f, ..._as);
    });
}

/**
 * Takes a function and returns a variant of it, which consecutevly consumes
 *     more arguments until enough parameters are given to execute the given
 *     function. On execution, reverses the arguments given
 * @method
 * @param {function} f The function to wrap
 * @return {function} The wrapped function
 *
 * @example
 * const {curryRight} = require('futils');
 *
 * const greet = (greeting, who) => greeting + ' ' + who + '!';
 * const cGreet = curryRight(greet);
 *
 * greet('Hello', 'World'); // -> 'Hello World!'
 * greet('Hello'); // -> 'Hello undefined!'
 *
 * cGreet('Hello', 'World'); // -> 'World Hello!'
 * cGreet('World'); // -> function
 * 
 * const toTheWorld = cGreet('World');
 * toTheWorld('Hello'); // -> 'Hello World!'
 */
const curryRight = (f) => {
    if (isFunc(f)) {
        if (f.length < 2) { return f; }
        return CurryRightHand(f);
    }
    throw 'decorators::curryRight awaits a function but saw ' + f;
}

const PartialLeftHand = (f, ...pargs) => {
    // used internally, recursively returns itself until all placeholders are
    //  given
    return (...rest) => {
        var args = pargs.map((a) => a === void 0 ? rest.shift() : a);
        if (args.lastIndexOf(void 0) < 0) {
            return f(...args);
        }
        return PartialLeftHand(f, ...args);
    }
}

/**
 * Takes a function and optional parameters to prefill the function with. One
 *     can use `undefined` to skip parameters while presetting, which will be
 *     seen as a placeholder. Accumulates the later given parameters to the left
 *     of the arguments list
 * @method
 * @param {function} f The function to partially apply
 * @param {any} ...pargs Parameters to preset
 * @return {function} The wrapped function
 *
 * @example
 * const {partial} = require('futils');
 *
 * const add = (a, b) => a + b;
 * const pAdd = partial(add, undefined, 1);
 *
 * add(1, 2); // -> 3
 * pAdd(2); // -> 3
 */
const partial = (f, ...pargs) => {
    var _ps = pargs;
    if (isFunc(f)) {
        while (_ps.length < f.length) {
            _ps.push(void 0);
        }
        return PartialLeftHand(f, ..._ps);
    }
    throw 'decorators::partial awaits a function but saw ' + f;
}

const PartialRightHand = (f, ...pargs) => {
    // internally used, works like PartialLeftHand but finally reverses the
    //     given arguments before applying them
    return (...rest) => {
        var args = pargs.map((a) => a === void 0 ? rest.shift() : a);
        if (args.lastIndexOf(void 0) < 0) {
            return f(...args.reverse());
        }
        return PartialRightHand(f, ...args);
    }
}

/**
 * Takes a function and optional parameters to prefill the function with. One
 *     can use `undefined` to skip parameters while presetting, which will be
 *     seen as a placeholder. Accumulates the later given parameters to the right
 *     of the arguments list
 * @method
 * @param {function} f The function to partially apply
 * @param {any} ...pargs Parameters to preset
 * @return {function} The wrapped function
 *
 * @example
 * const {partialRight} = require('futils');
 *
 * const add = (a, b) => a + b;
 * const pAdd = partialRight(add, 1);
 *
 * add(1, 2); // -> 3
 * pAdd(2); // -> 3
 */
const partialRight = (f, ...pargs) => {
    var _ps = pargs;
    if (isFunc(f)) {
        while (_ps.length < f.length) {
            _ps.push(void 0);
        }
        return PartialRightHand(f, ..._ps);
    }
    throw 'decorators::partialRight awaits a function but saw ' + f;
}

/**
 * Takes a predicate function and a continuation function and returns a function
 *     which only executes the continuation if the predicate succeeds. Given a
 *     optional failure function, the `given` function allows to model `if` and
 *     `if-else` expressions
 * @method
 * @param {function} p A predicate
 * @param {function} t A continuation
 * @param {function} [f] A failure
 * @return {function} A wrapped function
 *
 * @example
 * const {given, isString} = require('futils');
 *
 * const greet = given(
 *     isString,
 *     (subject) => `Hello ${subject}`,
 *     () => 'Need a string!'
 * );
 *
 * greet('World'); // -> Hello World
 * greet(null); // -> Need a string!
 */
const given = (p, t = void 0, f = void 0) => {
    if (t === void 0) {
        return (_t, _f) => {
            return given(p, _t, _f);
        };
    }

    if (isFunc(p) && isFunc(t)) {
        if (isFunc(f)) {
            return aritize(t.length, (...xs) => {
                return !!p(...xs) ? t(...xs) : f(...xs);
            });
        }
        return aritize(t.length, (...xs) => {
            return !!p(...xs) ? t(...xs) : null;
        });
    }
    throw 'decorators::given awaits (fn, fn fn?), but saw ' + [p, t, f];        
}

/**
 * Takes a function and returns a variant of it, which only executes the given
 *     function once for the given arguments. If the returned function is
 *     called with some arguments it already received, the computation is skipped
 *     and the previously calculated result is returned
 * @method
 * @param {function} f The function to memoize
 * @return {function} A memoized function
 *
 * @example
 * const {memoize} = require('futils');
 *
 * const complexCalculation = memoize(( ... ) => { ... });
 */
const memoize = (f) => {
    var cached = {};
    if (isFunc(f)) {
        return aritize(f.length, (...xs) => {
            var k = JSON.stringify(xs);
            if (!cached.hasOwnProperty(k)) {
                cached[k] = f(...xs);
            }        
            return cached[k];
        });
    }
    throw 'decorators::memoize awaits a function but saw ' + f;
}


module.exports = {
    monadic, dyadic, triadic, not, flip, maybe, curry, curryRight, partial,
    partialRight, given, memoize, once, tetradic
};