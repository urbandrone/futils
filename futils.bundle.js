(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var futils = require('./index');

window.futils = {
    aritize: futils.aritize,
    isNil: futils.isNil,
    isVoid: futils.isVoid,
    isNull: futils.isNull,
    isString: futils.isString,
    isAny: futils.isAny,
    isTrue: futils.isTrue,
    isNumber: futils.isNumber,
    isFunc: futils.isFunc,
    isArray: futils.isArray,
    isObject: futils.isObject,
    isInt: futils.isInt,
    isFloat: futils.isFloat,
    isBool: futils.isBool,
    isFalse: futils.isFalse,
    isDate: futils.isDate,
    isRegex: futils.isRegex,
    isNode: futils.isNode,
    isNodeList: futils.isNodeList,
    isMap: futils.isMap,
    isSet: futils.isSet,
    isWeakMap: futils.isWeakMap,
    isWeakSet: futils.isWeakSet,
    isPromise: futils.isPromise,
    isIterator: futils.isIterator,
    isIterable: futils.isIterable,
    isArrayOf: futils.isArrayOf,
    isObjectOf: futils.isObjectOf,
    identity: futils.identity,
    getter: futils.getter,
    tap: futils.tap,
    compose: futils.compose,
    pipe: futils.pipe,
    and: futils.and,
    or: futils.or,
    splat: futils.splat,
    monadic: futils.monadic,
    dyadic: futils.dyadic,
    triadic: futils.triadic,
    tetradic: futils.tetradic,
    once: futils.once,
    not: futils.not,
    flip: futils.flip,
    maybe: futils.maybe,
    curry: futils.curry,
    curryRight: futils.curryRight,
    partial: futils.partial,
    partialRight: futils.partialRight,
    given: futils.given,
    memoize: futils.memoize,
    transducers: futils.transducers,
    stateful: futils.stateful,
    counter: futils.counter,
    chosen: futils.chosen,
    lens: futils.lens,
    makeLenses: futils.makeLenses,
    view: futils.view,
    over: futils.over,
    set: futils.set,
    assoc: futils.assoc,
    field: futils.field,
    has: futils.has,
    exec: futils.exec,
    execRight: futils.execRight,
    access: futils.access,
    extend: futils.extend,
    merge: futils.merge,
    immutable: futils.immutable,
    first: futils.first,
    last: futils.last,
    map: futils.map,
    flatMap: futils.flatMap,
    flatten: futils.flatten,
    eq: futils.eq,
    gt: futils.gt,
    lt: futils.lt,
    gte: futils.gte,
    lte: futils.lte,
    locals: futils.locals
};

},{"./index":2}],2:[function(require,module,exports){
'use strict';

var aritize = require('./sources/aritize');
var combinators = require('./sources/combinators');
var decorators = require('./sources/decorators');
var comparators = require('./sources/comparators');
var enums = require('./sources/enums');
var lenses = require('./sources/lenses');
var state = require('./sources/state');
var transducers = require('./sources/transducers');
var types = require('./sources/types');

module.exports = {
    aritize: aritize.aritize,
    isNil: types.isNil,
    isVoid: types.isVoid,
    isNull: types.isNull,
    isString: types.isString,
    isAny: types.isAny,
    isTrue: types.isTrue,
    isNumber: types.isNumber,
    isFunc: types.isFunc,
    isArray: types.isArray,
    isObject: types.isObject,
    isInt: types.isInt,
    isFloat: types.isFloat,
    isBool: types.isBool,
    isFalse: types.isFalse,
    isDate: types.isDate,
    isRegex: types.isRegex,
    isNode: types.isNode,
    isNodeList: types.isNodeList,
    isMap: types.isMap,
    isSet: types.isSet,
    isWeakMap: types.isWeakMap,
    isWeakSet: types.isWeakSet,
    isPromise: types.isPromise,
    isIterator: types.isIterator,
    isIterable: types.isIterable,
    isArrayOf: types.isArrayOf,
    isObjectOf: types.isObjectOf,
    identity: combinators.identity,
    getter: combinators.getter,
    tap: combinators.tap,
    compose: combinators.compose,
    pipe: combinators.pipe,
    and: combinators.and,
    or: combinators.or,
    splat: combinators.splat,
    monadic: decorators.monadic,
    dyadic: decorators.dyadic,
    triadic: decorators.triadic,
    tetradic: decorators.tetradic,
    once: decorators.once,
    not: decorators.not,
    flip: decorators.flip,
    maybe: decorators.maybe,
    curry: decorators.curry,
    curryRight: decorators.curryRight,
    partial: decorators.partial,
    partialRight: decorators.partialRight,
    given: decorators.given,
    memoize: decorators.memoize,
    transducers: transducers,
    stateful: state.stateful,
    counter: state.counter,
    chosen: state.chosen,
    lens: lenses.lens,
    makeLenses: lenses.makeLenses,
    view: lenses.view,
    over: lenses.over,
    set: lenses.set,
    assoc: enums.assoc,
    field: enums.field,
    has: enums.has,
    exec: enums.exec,
    execRight: enums.execRight,
    access: enums.access,
    extend: enums.extend,
    merge: enums.merge,
    immutable: enums.immutable,
    first: enums.first,
    last: enums.last,
    map: enums.map,
    flatMap: enums.flatMap,
    flatten: enums.flatten,
    eq: comparators.eq,
    gt: comparators.gt,
    lt: comparators.lt,
    gte: comparators.gte,
    lte: comparators.lte,
    locals: comparators.locals
};

},{"./sources/aritize":3,"./sources/combinators":4,"./sources/comparators":5,"./sources/decorators":6,"./sources/enums":7,"./sources/lenses":8,"./sources/state":9,"./sources/transducers":10,"./sources/types":11}],3:[function(require,module,exports){
'use strict';

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * Provides the aritize function
 * @module futils/aritize
 */

/**
 * Takes a number and a function with a variadic number of arguments and returns
 *     a function which takes as much arguments as specified
 * @method 
 * @version 0.8.0
 * @param {number} n Integer value describing the arity
 * @param {function} f The function to aritize
 * @return {function} A wrapper for f with a arity of n
 *
 * @example
 * const {aritize} = require('futils');
 *
 * const sum = (x, ...xs) => xs.reduce((a, b) => a + b, x);
 * sum(1, 2, 3); // -> 6
 *
 * const addTwo = aritize(2, sum);
 * addTwo(1, 2, 3); // -> 3
 */
var aritize = function aritize(n, f) {
  var len = n,
      args = [],
      wrap = null;
  if (f.length >= len) {
    return f;
  }
  while (len > 0) {
    args.push('arg' + len--);
  }
  args = args.join(',');
  wrap = 'return (' + args + ') => fx(' + args + ')';
  return new Function('fx', wrap)(f);
};

module.exports = { aritize: aritize };

},{}],4:[function(require,module,exports){
'use strict';

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var _require = require('./types');

var isFunc = _require.isFunc;
var isArrayOf = _require.isArrayOf;

var _require2 = require('./aritize');

var aritize = _require2.aritize;
/**
 * A collection of higher order helpers for functional composition
 * @module futils/combinators
 * @requires futils/types
 * @requires futils/aritize
 */

/**
 * The identity or I combinator (idiot in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {any} x Anything
 * @return {any} Returns x
 */

var identity = function identity(x) {
    return x;
};

/**
 * The getter or K combinator (kestrel in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {anx} x Anything
 * @return {function} A getter of x
 */
var getter = function getter(x) {
    return function () {
        return x;
    };
};

/**
 * The tap or T combinator (thrush in smullians "how to mock a mockingbird")
 * @method
 * @version 0.4.0
 * @param {any} x Anything
 * @return {function} Function awaiting a function to tap with
 *
 * @example
 * const {isNumber} = require('futils');
 * 
 * const sqr = (n) => n * n;
 * 
 * const saveSqr = tap(sqr)((op) => {
 *     return (_n) => {
 *         return isNumber(_n) ? op(_n) : _n;
 *     }
 * });
 */
var tap = function tap(x) {
    return function (y) {
        return y(x);
    };
};

/**
 * Composes 2 up to N functions together into one. `compose` composes the
 *     given functions from right to left instead of from left to right. Use
 *     the `pipe` function if you want to opposite behaviour
 * @method
 * @version 0.4.0
 * @param {function} ...fs 2 up to N functions
 * @return {function} Composition of the given functions
 *
 * @example
 * const {compose} = require('futils');
 *
 * const add1 = (n) => n + 1;
 * const mult2 = (n) => n * 2;
 *
 * const mult2Add1 = compose(add1, mult2);
 *
 * add1(mult2(2)) === mult2Add1(2);
 * // -> true
 */
var compose = function compose() {
    for (var _len = arguments.length, fs = Array(_len), _key = 0; _key < _len; _key++) {
        fs[_key] = arguments[_key];
    }

    var f = fs.pop();
    if (isFunc(f) && isArrayOf(isFunc, fs)) {
        return aritize(f.length, function () {
            return fs.reduce(function (v, g) {
                return g(v);
            }, f.apply(undefined, arguments));
        });
    }
    throw 'combinators::compose awaits functions but saw ' + fs;
};

/**
 * Composes 2 up to N function together into one. `pipe` allows function
 *     composition from left to right instead of right to left. Use the `compose`
 *     function if you want the opposite behaviour
 * @method
 * @version 0.4.0
 * @param {function} ...fs 2 up to N functions
 * @return {function} Composition of the given functions
 *
 * @example
 * const {pipe} = require('futils');
 *
 * const add1 = (n) => n + 1;
 * const mult2 = (n) => n * 2;
 *
 * const mult2Add1 = pipe(mult2, add1);
 *
 * add1(mult2(2)) === mult2Add1(2);
 * // -> true
 */
var pipe = function pipe(f) {
    for (var _len2 = arguments.length, fs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        fs[_key2 - 1] = arguments[_key2];
    }

    if (isFunc(f) && isArrayOf(isFunc, fs)) {
        return aritize(f.length, function () {
            return fs.reduce(function (v, g) {
                return g(v);
            }, f.apply(undefined, arguments));
        });
    }
    throw 'combinators::pipe awaits functions but saw ' + [f].concat(fs);
};

/**
 * Composes 2 up to N predicate functions into one. The returned predicate only
 *     returns true if all the composed predicates return true
 * @method 
 * @version 0.4.0
 * @param {function} ...fs 2 up to N predicates to compose
 * @return {function} Composed predicate function
 *
 * @example
 * const {and} = require('futils');
 *
 * const isStr = (s) => typeof s === 'string';
 * const hasAt = (s) => s.includes('@');
 *
 * const smellsLikeMail = and(isStr, hasAt);
 */
var and = function and() {
    for (var _len3 = arguments.length, fs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fs[_key3] = arguments[_key3];
    }

    if (isArrayOf(isFunc, fs)) {
        return aritize(fs[0].length, function () {
            for (var _len4 = arguments.length, xs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                xs[_key4] = arguments[_key4];
            }

            return !fs.some(function (f) {
                return !f.apply(undefined, xs);
            });
        });
    }
    throw 'combinators::and awaits functions but saw ' + fs;
};

/**
 * Composes 2 up to N predicates into one. The returned predicate returns true
 *     as long as one of the given predicate functions evaluates to true
 * @method 
 * @version 0.4.0
 * @param {function} ...fs 2 up to N predicates to compose
 * @return {function} Composed predicate function
 *
 * @example
 * const {or} = require('futils');
 *
 * const isStr = (s) => typeof s === 'string';
 * const isNum = (n) => !isNaN(n);
 *
 * const strOrNum = or(isStr, isNum);
 */
var or = function or() {
    for (var _len5 = arguments.length, fs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        fs[_key5] = arguments[_key5];
    }

    if (isArrayOf(isFunc, fs)) {
        return aritize(fs[0].length, function () {
            for (var _len6 = arguments.length, xs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                xs[_key6] = arguments[_key6];
            }

            return fs.some(function (f) {
                return !!f.apply(undefined, xs);
            });
        });
    }
    throw 'combinators::or awaits functions but saw ' + fs;
};

/**
 * Takes N functions and returns a function which splats the incoming arguments
 *     onto the given function so that each function gets the same parameters.
 *     The returned function returns whatever the first splatted function
 *     returns
 * @method 
 * @version 0.4.0
 * @param {function} ...fs N functions to wrap
 * @return {function} A splatter function
 *
 * @example
 * const {splat} = require('futils');
 *
 * const sideFX1 = (...) => { ... };
 * const sideFX2 = (...) => { ... };
 *
 * const splattedFX = splat(
 *     sideFX1,
 *     sideFX2
 * );
 */
var splat = function splat() {
    for (var _len7 = arguments.length, fs = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        fs[_key7] = arguments[_key7];
    }

    if (isArrayOf(isFunc, fs)) {
        return function () {
            for (var _len8 = arguments.length, xs = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                xs[_key8] = arguments[_key8];
            }

            var r = fs[0].apply(fs, xs);
            fs.slice(1).forEach(function (f) {
                return f.apply(undefined, xs);
            });
            return r == null ? null : r;
        };
    }
    throw 'combinators::splat awaits a bunch of functions but saw ' + fs;
};

module.exports = { compose: compose, pipe: pipe, identity: identity, tap: tap, getter: getter, and: and, or: or, splat: splat };

},{"./aritize":3,"./types":11}],5:[function(require,module,exports){
'use strict';

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var _require = require('./types');

var isFunc = _require.isFunc;

var _require2 = require('./decorators');

var dyadic = _require2.dyadic;
/**
 * A set of predefined comparator functions
 * @module futils/comparators
 * @requires futils/types
 * @requires futils/decorators
 */

/**
 * Takes in two values and compares them for equality (using ===). Returns a
 *     deferred invocation as long as one of the given parameters is a function
 * @method 
 * @version 0.7.0
 * @param {*} a First item to compare
 * @param {*} b Second item to compare
 * @return {boolean|function} Boolean or deferred invocation
 *
 * @example
 * const {eq, exec} = require('futils');
 *
 * const eq1 = eq(1);
 *
 * eq1(1); // -> true
 * eq1(2); // -> false
 *
 * const isHelloWorld = eq('HELLO WORLD', exec('toUpperCase'));
 * 
 * isHelloWorld('HELLO WORLD'); // -> true
 * isHelloWorld('hello world'); // -> true
 * isHelloWorld('nay'); // -> false
 */

var eq = dyadic(function (a, b) {
  if (isFunc(a)) {
    return function (ac) {
      return eq(a(ac), b);
    };
  }
  if (isFunc(b)) {
    return function (bc) {
      return eq(a, b(bc));
    };
  }
  return a === b;
});

/**
 * Takes two numbers and tests if the second is greater than the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {gt} = require('futils');
 *
 * const gt2 = gt(2);
 *
 * gt2(3); // -> true
 * gt2(2); // -> false
 */
var gt = dyadic(function (a, b) {
  return a < b;
});

/**
 * Takes two numbers and tests if the second is greater than or equal to the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {gte} = require('futils');
 *
 * const gte2 = gte(2);
 *
 * gte2(3); // -> true
 * gte2(2); // -> true
 */
var gte = dyadic(function (a, b) {
  return a <= b;
});

/**
 * Takes two numbers and tests if the second is smaller than the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {lt} = require('futils');
 *
 * const lt2 = lt(2);
 *
 * lt2(1); // -> true
 * lt2(2); // -> false
 */
var lt = dyadic(function (a, b) {
  return a > b;
});

/**
 * Takes two numbers and tests if the second is lower than or equal to the first
 * @method 
 * @version 0.7.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {lte} = require('futils');
 *
 * const lte2 = lte(2);
 *
 * lte2(1); // -> true
 * lte2(2); // -> true
 */
var lte = dyadic(function (a, b) {
  return a >= b;
});

/**
 * Takes two characters and compares them alphabetically
 * @method 
 * @version 0.8.0
 * @param {number} a First number to compare
 * @param {number} b Second number to compare
 * @return {boolean} Either true or false
 *
 * @example
 * const {locals} = require('futils');
 *
 * ['gamma', 'alpha', 'beta'].sort(locals);
 * // -> ['alpha', 'beta', 'gamma']
 */
var locals = dyadic(function (a, b) {
  var lc = a.localeCompare(b);
  return lc < 0 ? 1 : lc > 0 ? -1 : 0;
});

module.exports = {
  eq: eq, gt: gt, gte: gte, lt: lt, lte: lte, locals: locals
};

},{"./decorators":6,"./types":11}],6:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var _require = require('./types');

var isFunc = _require.isFunc;
var isVoid = _require.isVoid;

var _require2 = require('./aritize');

var aritize = _require2.aritize;
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
 * @version 0.4.0
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

var monadic = function monadic(f) {
    if (isFunc(f)) {
        return function () {
            var x = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];

            if (x === void 0) {
                return monadic(f);
            }
            return f(x);
        };
    }
    throw 'decorators::monadic awaits a function but saw ' + f;
};

/**
 * Takes a function with a arity of N and returns a variant with arity of 2
 * @method
 * @version 0.4.0
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
var dyadic = function dyadic(f) {
    if (isFunc(f)) {
        return function () {
            var x = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];
            var y = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];

            if (x === void 0) {
                return dyadic(f);
            }
            if (y === void 0) {
                return monadic(function (_y) {
                    return f(x, _y);
                });
            }
            return f(x, y);
        };
    }
    throw 'decorators::dyadic awaits a function but saw ' + f;
};

/**
 * Takes a function with a arity of N and returns a variant with arity of 3
 * @method
 * @version 0.4.0
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
var triadic = function triadic(f) {
    if (isFunc(f)) {
        return function () {
            var x = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];
            var y = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
            var z = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];

            if (x === void 0) {
                return triadic(f);
            }
            if (y === void 0) {
                return dyadic(function (_y, _z) {
                    return f(x, _y, _z);
                });
            }
            if (z === void 0) {
                return monadic(function (_z) {
                    return f(x, y, _z);
                });
            }
            return f(x, y, z);
        };
    }
    throw 'decorators::triadic awaits a function but saw ' + f;
};

/**
 * Takes a function with a arity of N and returns a variant with arity of 4
 * @method
 * @version 0.4.0
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
var tetradic = function tetradic(f) {
    if (isFunc(f)) {
        return function () {
            var w = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];
            var x = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
            var y = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];
            var z = arguments.length <= 3 || arguments[3] === undefined ? void 0 : arguments[3];

            if (w === void 0) {
                return tetradic(f);
            }
            if (x === void 0) {
                return triadic(function (_x, _y, _z) {
                    return f(w, _x, _y, _z);
                });
            }
            if (y === void 0) {
                return dyadic(function (_y, _z) {
                    return f(w, x, _y, _z);
                });
            }
            if (z === void 0) {
                return monadic(function (_z) {
                    return f(w, x, y, _z);
                });
            }
            return f(w, x, y, z);
        };
    }
    throw 'decorators::tetradic awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant of it which will only executed once
 * @method
 * @version 0.5.0
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
var once = function once(f) {
    var called = 0;
    if (isFunc(f)) {
        return aritize(f.length, function () {
            if (called === 0) {
                called = 1;
                return f.apply(undefined, arguments);
            }
            return null;
        });
    }
    throw 'decorators::once awaits a function but saw ' + f;
};

/**
 * Takes a predicate function and returns the invariant of it
 * @method
 * @version 0.4.0
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
var not = function not(f) {
    if (isFunc(f)) {
        return aritize(f.length, function () {
            return !f.apply(undefined, arguments);
        });
    }
    throw 'decorators::not awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant which calls the original function with
 * the arguments reversed
 * @method
 * @version 0.4.0
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
var flip = function flip(f) {
    if (isFunc(f)) {
        return aritize(f.length, function () {
            for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
                xs[_key] = arguments[_key];
            }

            return f.apply(undefined, _toConsumableArray(xs.reverse()));
        });
    }
    throw 'decorators::flip awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant, which only executes if the given
 *     argument is not `null` or `undefined`
 * @method
 * @version 0.4.0
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
var maybe = function maybe(f) {
    if (isFunc(f)) {
        return function () {
            var x = arguments.length <= 0 || arguments[0] === undefined ? void 0 : arguments[0];

            return x == null || x === void 0 ? null : f(x);
        };
    }
    throw 'decorators::maybe awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant of it, which consecutevly consumes
 *     more arguments until enough parameters are given to execute the given
 *     function
 * @method
 * @version 0.4.0
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
var curry = function curry(f) {
    if (isFunc(f)) {
        if (f.length < 2) {
            return f;
        }
        return function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            if (f.length <= args.length) {
                return f.apply(undefined, args);
            }
            return function () {
                for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    rest[_key3] = arguments[_key3];
                }

                return curry(f).apply(undefined, args.concat(rest));
            };
        };
    }
    throw 'decorators::curry awaits a function but saw ' + f;
};

/**
 * Takes a function and returns a variant of it, which consecutevly consumes
 *     more arguments until enough parameters are given to execute the given
 *     function. On execution, reverses the arguments given
 * @method
 * @version 0.4.0
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
var curryRight = function curryRight(f) {
    if (isFunc(f)) {
        if (f.length < 2) {
            return f;
        }
        return function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            if (f.length <= args.length) {
                return f.apply(undefined, _toConsumableArray(args.reverse()));
            }
            return function () {
                for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    rest[_key5] = arguments[_key5];
                }

                return curry(f).apply(undefined, args.concat(rest));
            };
        };
    }
    throw 'decorators::curryRight awaits a function but saw ' + f;
};

/**
 * Takes a function and optional parameters to prefill the function with. One
 *     can use `undefined` to skip parameters while presetting, which will be
 *     seen as a placeholder. Accumulates the later given parameters to the left
 *     of the arguments list
 * @method
 * @version 0.4.0
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
var partial = function partial(f) {
    for (var _len6 = arguments.length, pargs = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        pargs[_key6 - 1] = arguments[_key6];
    }

    var _ps = pargs;
    if (isFunc(f)) {
        while (_ps.length < f.length) {
            _ps.push(void 0);
        }
        return function () {
            for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                args[_key7] = arguments[_key7];
            }

            var _as = _ps.map(function (a) {
                return isVoid(a) ? args.shift() : a;
            });
            if (_as.lastIndexOf(void 0) < 0) {
                return f.apply(undefined, _toConsumableArray(_as));
            }
            return partial.apply(undefined, [f].concat(_toConsumableArray(_as)));
        };
    }
    throw 'decorators::partial awaits a function but saw ' + f;
};

/**
 * Takes a function and optional parameters to prefill the function with. One
 *     can use `undefined` to skip parameters while presetting, which will be
 *     seen as a placeholder. Accumulates the later given parameters to the right
 *     of the arguments list
 * @method
 * @version 0.4.0
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
var partialRight = function partialRight(f) {
    for (var _len8 = arguments.length, pargs = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
        pargs[_key8 - 1] = arguments[_key8];
    }

    var _ps = pargs;
    if (isFunc(f)) {
        while (_ps.length < f.length) {
            _ps.push(void 0);
        }
        return function () {
            for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                args[_key9] = arguments[_key9];
            }

            var _as = _ps.map(function (a) {
                return isVoid(a) ? args.shift() : a;
            });
            if (_as.lastIndexOf(void 0) < 0) {
                return f.apply(undefined, _toConsumableArray(_as.reverse()));
            }
            return partial.apply(undefined, [f].concat(_toConsumableArray(_as)));
        };
    }
    throw 'decorators::partialRight awaits a function but saw ' + f;
};

/**
 * Takes a predicate function and a continuation function and returns a function
 *     which only executes the continuation if the predicate succeeds. Given a
 *     optional failure function, the `given` function allows to model `if` and
 *     `if-else` expressions
 * @method
 * @version 0.5.0
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
var given = function given(p) {
    var t = arguments.length <= 1 || arguments[1] === undefined ? void 0 : arguments[1];
    var f = arguments.length <= 2 || arguments[2] === undefined ? void 0 : arguments[2];

    if (t === void 0) {
        return function (_t, _f) {
            return given(p, _t, _f);
        };
    }

    if (isFunc(p) && isFunc(t)) {
        if (isFunc(f)) {
            return aritize(t.length, function () {
                return !!p.apply(undefined, arguments) ? t.apply(undefined, arguments) : f.apply(undefined, arguments);
            });
        }
        return aritize(t.length, function () {
            return !!p.apply(undefined, arguments) ? t.apply(undefined, arguments) : null;
        });
    }
    throw 'decorators::given awaits (fn, fn fn?), but saw ' + [p, t, f];
};

/**
 * Takes a function and returns a variant of it, which only executes the given
 *     function once for the given arguments. If the returned function is
 *     called with some arguments it already received, the computation is skipped
 *     and the previously calculated result is returned
 * @method
 * @version 0.4.0
 * @param {function} f The function to memoize
 * @return {function} A memoized function
 *
 * @example
 * const {memoize} = require('futils');
 *
 * const complexCalculation = memoize(( ... ) => { ... });
 */
var memoize = function memoize(f) {
    var cached = {};
    if (isFunc(f)) {
        return aritize(f.length, function () {
            for (var _len10 = arguments.length, xs = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                xs[_key10] = arguments[_key10];
            }

            var k = JSON.stringify(xs);
            if (!cached.hasOwnProperty(k)) {
                cached[k] = f.apply(undefined, xs);
            }
            return cached[k];
        });
    }
    throw 'decorators::memoize awaits a function but saw ' + f;
};

module.exports = {
    monadic: monadic, dyadic: dyadic, triadic: triadic, not: not, flip: flip, maybe: maybe, curry: curry, curryRight: curryRight, partial: partial,
    partialRight: partialRight, given: given, memoize: memoize, once: once, tetradic: tetradic
};

},{"./aritize":3,"./types":11}],7:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var _require = require('./types');

var isAny = _require.isAny;
var isString = _require.isString;
var isNumber = _require.isNumber;
var isFunc = _require.isFunc;
var isArray = _require.isArray;
var isObject = _require.isObject;

var _require2 = require('./decorators');

var dyadic = _require2.dyadic;
var triadic = _require2.triadic;

/**
 * A collection of enumerable utility functions. Contains abstractions which
 *     work on arrays, objects and monads
 * @module futils/enums
 * @requires futils/types
 * @requires futils/decorators
 */

/**
 * Checks if a given object has a field of a certain key by name which is not
 *     inherited
 * @method 
 * @version 0.2.0
 * @param {string} key Name of the field
 * @param {object} x The object to test
 * @return {boolean} True if the field is present
 *
 * @example
 * const {has} = require('futils');
 *
 * let testee = {foo: 'bar'};
 *
 * has('foo', testee); // -> true
 * has('toString', testee); // -> false
 */

var has = dyadic(function (key, x) {
    return {}.hasOwnProperty.call(x, key);
});

/**
 * Accesses a given object by a chain of keys
 * @method
 * @version 0.2.0
 * @param {string} key Single key or a chain of keys separated by `.`
 * @param {object|array|string|Monad} x Data structure to access
 * @return {any|null} Either the value of the key or null
 *
 * @example
 * const {field} = require('futils');
 *
 * const getName = field('name');
 * getName({name: 'John Doe'}); // -> 'John Doe'
 *
 * const firstName = field('name.first');
 * firstName({name: {first: 'John', last: 'Doe'}}); // -> 'John'
 */
var field = dyadic(function (key, x) {
    var ks = isString(key) && /\./.test(key) ? key.split('.') : [key];
    return ks.reduce(function (a, b) {
        return isAny(a) && isAny(a[b]) ? a[b] : null;
    }, x);
});

/**
 * Looks like the opposite of the `field` function but does the same
 * @method
 * @version 0.2.0
 * @param {object|array|string|Monad} x Data structure to access
 * @param {string} key Single key or chain of keys separated by `.`
 * @return {any|null} Either the value of the key or null
 *
 * @example
 * const {access} = require('futils');
 *
 * var keys = {8: 'Backspace', 9: 'Tab', 13: 'Enter', ... };
 * const keyMeans = access(keys);
 *
 * // imagine a series of keystrokes:
 * [8, 13, ... 13].map(keyMeans); // -> ['Backspace', 'Enter', ... 'Enter']
 */
var access = dyadic(function (x, k) {
    return !!x ? field(k, x) : null;
});

/**
 * Assigns a value and a key to a given data structure, returns a clone of the
 *     given structure
 * @method 
 * @version 0.3.0
 * @param {string|number} k The key to assign to
 * @param {*} v The value to assing
 * @param {array|object} x The data structure to transform
 * @return {array|object|*} New array or object or the given thing
 *
 * @example
 * const {assoc} = require('futils');
 *
 * let p = { name: 'John Doe', accounts: [{name: 'jdoe'}] };
 *
 * const setAccountCount = assoc('accountCount');
 * setAccountCount(p.accounts.length, p);
 * // -> {name: 'John Doe', ..., accountCount: 1}
 *
 * console.log(p); // -> {name: 'John Doe', accounts: [...]};
 */
var assoc = triadic(function (k, v, x) {
    var key = k,
        receiver = x;
    if (isArray(x)) {
        receiver = [].concat(_toConsumableArray(x));
        key = parseInt(key, 10);
        if (isNumber(key) && key < x.length && key >= 0) {
            receiver[key] = v;
        }
    } else if (isObject(x)) {
        receiver = Object.assign({}, x);
        if (isString(key)) {
            receiver[key] = v;
        }
    }
    return receiver;
});

/**
 * Allows to predefine a method invocation
 * @method
 * @version 0.2.0
 * @param {string|function} method Name of a method or a function
 * @param {any} [partials] Presetted arguments
 * @return {function} Function awaiting a instance
 *
 * @example
 * const {exec} = require('futils');
 *
 * const upper = exec('toUpperCase');
 * upper('hello world'); // -> 'HELLO WORLD'
 *
 * const firstHalf = exec('slice', 0, 5);
 * firstHalf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
 */
var exec = function exec(method) {
    for (var _len = arguments.length, partials = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        partials[_key - 1] = arguments[_key];
    }

    return function (provider) {
        for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            rest[_key2 - 1] = arguments[_key2];
        }

        var res = isFunc(provider[method]) ? provider[method].apply(provider, partials.concat(rest)) : isFunc(method) ? method.call.apply(method, [provider].concat(partials, rest)) : null;
        if (res == null) {
            return provider;
        }
        return res;
    };
};

/**
 * Allows to predefine a method invocation
 * @method
 * @version 0.2.0
 * @param {string|function} method Name of a method or a function
 * @param {any} [partials] Presetted arguments
 * @return {function} Function awaiting a instance
 *
 * @example
 * const {execRight} = require('futils');
 *
 * const upper = execRight('toUpperCase');
 * upper('hello world'); // -> 'HELLO WORLD'
 *
 * const firstHalf = execRight('slice', 5, 0);
 * firstHalf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // -> [1, 2, 3, 4, 5]
 */
var execRight = function execRight(method) {
    for (var _len3 = arguments.length, partials = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        partials[_key3 - 1] = arguments[_key3];
    }

    return function (provider) {
        for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            rest[_key4 - 1] = arguments[_key4];
        }

        var res = isFunc(provider[method]) ? provider[method].apply(provider, _toConsumableArray([].concat(partials, rest).reverse())) : isFunc(method) ? method.call.apply(method, [provider].concat(_toConsumableArray([].concat(partials, rest).reverse()))) : null;
        if (res == null) {
            return provider;
        }
        return res;
    };
};

/**
 * Given a base object and some extension objects, extends the base object with
 *     the rest of the extension objects. The extensions are included from left
 *     to right, so that the last extension overrides the first. Note: This
 *     performs a side effect by modifying the base object! If you instead need
 *     a pure version, use the `merge` function
 * @method
 * @version 0.3.0
 * @param {object} x Base object
 * @param {object} ...xs 1 up to N extensions
 * @return {object} The extended base object
 *
 * @example
 * const {extend} = require('futils');
 *
 * var customer = {name: 'John Doe', id: 00000001},
 *     basket = {items: [ ... number of items ... ]};
 *
 * var customerWithBasket = extend(customer, basket);
 *
 * customerWithBasket; // -> {name: '...', id: ..., items: [ ... ]}
 *
 * customer === customerWithBasket; // -> true
 */
var extend = function extend(x) {
    for (var _len5 = arguments.length, xs = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        xs[_key5 - 1] = arguments[_key5];
    }

    return Object.assign.apply(Object, [x].concat(xs));
};

/**
 * Given a base object and some extension objects, creates a copy of the base
 *     object and extends that copy with the rest of the extension objects. The
 *     extensions are included from left to right, so that the last
 *     extension overrides the first. Note: This creates a new object, based on
 *     the first given parameter. If you instead want to perform a side effect
 *     use the `extend` function
 * @method
 * @version 0.3.0
 * @param {object} x Base object
 * @param {object} ...xs 1 up to N extensions
 * @return {object} The extended copy of the base object
 *
 * @example
 * const {merge} = require('futils');
 *
 * var customer = {name: 'John Doe', id: 00000001},
 *     basket = {items: [ ... number of items ... ]};
 *
 * var customerWithBasket = merge(customer, basket);
 * 
 * customerWithBasket; // -> {name: '...', id: ..., items: [ ... ]}
 *
 * customer === customerWithBasket; // -> false
 */
var merge = function merge() {
    for (var _len6 = arguments.length, xs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        xs[_key6] = arguments[_key6];
    }

    return Object.assign.apply(Object, [{}].concat(xs));
};

/**
 * Takes a object and prevents its pairs from being changed or removed, as well
 *     as freezing their enumerability, writability and configurability.
 * @method
 * @version 0.3.0
 * @param {object} x Object to make immutable
 * @return {object} Immutable object
 *
 * @example
 * const {immutable} = require('futils');
 *
 * var money = immutable({dollar: 5, cents: 50});
 *
 * money.dollar; // -> 5
 *
 * money.dollar += 5; // ;-)
 *
 * money.dollar; // -> 5
 */
var immutable = function immutable(x) {
    return Object.freeze(merge(x));
};

/**
 * Given a iterable collection, returns the first item
 * @method
 * @version 0.2.0
 * @param {array|nodelist|array-like} xs The collection
 * @return {any} Whatever the first item is
 *
 * @example
 * const {first} = require('futils');
 *
 * first([1, 2, 3]); // -> 1
 *
 * first(document.querySelectorAll('a')); // -> <a>...</a>
 */
var first = function first(xs) {
    return xs[0];
};

/**
 * Given a iterable collection, returns the last item
 * @method
 * @version 0.2.0
 * @param {array|nodelist|array-like} xs The collection
 * @return {any} Whatever the last item is
 *
 * @example
 * const {last} = require('futils');
 *
 * last([1, 2, 3]); // -> 3
 *
 * last(document.querySelectorAll('a')); // -> <a>...</a>
 */
var last = function last(xs) {
    return xs[xs.length - 1];
};

/**
 * Generic mapper method, works on anything that implements a `map` method as
 *     well as on arrays and objects
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function to map
 * @param {object|array|Monad} m The mappable
 * @return {object|array|Monad} New instance of the mappable
 *
 * @example
 * const {map} = require('futils');
 *
 * const addOne = (n) => n + 1;
 * map(addOne, [1, 2, 3]); // -> [2, 3, 4]
 *
 * // auto curried:
 * const mapAdd1 = map(addOne);
 */
var map = dyadic(function (f, m) {
    var ks, r;
    if (isFunc(f)) {
        if (isFunc(m.map)) {
            return m.map(f);
        }
        if (isObject(m)) {
            ks = Object.keys(m);
            r = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = ks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    r[k] = f(m[k], k, m);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return r;
        }
        return m;
    }
    throw 'enums::map awaits a function as first argument but saw ' + f;
});

/* -- internal util */
function flattenTCO(xs, ys) {
    if (xs.length <= 0) {
        return ys;
    }
    return function () {
        if (isArray(xs[0])) {
            return flattenTCO([].concat(_toConsumableArray(xs[0]), _toConsumableArray(xs.slice(1))), ys);
        }
        return flattenTCO(xs.slice(1), [].concat(_toConsumableArray(ys), [xs[0]]));
    };
}

/**
 * Generic flatten method, works on anything that implements a `flatten` method
 *     as well as on arrays
 * @method
 * @version 0.2.0
 * @param {object|array|Monad} m The thing to flatten
 * @return {object|array|Monad} New instance or given if object
 *
 * @example
 * const {flatten} = require('futils');
 *
 * flatten([[1, 2], 3, [[4, 5]]]); // -> [1, 2, 3, 4, 5]
 */
var flatten = function flatten(m) {
    var xs;
    if (isArray(m)) {
        xs = flattenTCO(m, []);
        while (xs instanceof Function) {
            xs = xs();
        }
        return xs;
    }
    return m;
};

/**
 * Generic flatMap method, works on anything which implements a `map` and a
 *     `flatten` method as well as on arrays and on objects. Please note that
 *     objects will not be flattened
 * @method
 * @version 0.2.0
 * @param {function} f Transformation function
 * @param {object|array|Monad} m The mappable
 * @return {object|array|Monad} New instance of given mappable
 *
 * @example
 * const {flatMap} = require('futils');
 *
 * const split = (s) => s.split('');
 * flatMap(split, ['Hello world']); // -> ['H', 'e', 'l', 'l', 'o', ...]
 */
var flatMap = dyadic(function (f, m) {
    if (isFunc(f)) {
        return flatten(map(f, m));
    }
    throw 'enums::flatMap awaits a function as first argument but saw ' + f;
});

module.exports = {
    field: field, has: has, exec: exec, execRight: execRight, access: access, extend: extend, merge: merge, immutable: immutable, first: first,
    last: last, map: map, flatten: flatten, flatMap: flatMap, assoc: assoc
};

},{"./decorators":6,"./types":11}],8:[function(require,module,exports){
'use strict';

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var _require = require('./combinators');

var pipe = _require.pipe;
var compose = _require.compose;
var getter = _require.getter;

var _require2 = require('./decorators');

var dyadic = _require2.dyadic;
var triadic = _require2.triadic;
var curry = _require2.curry;

var _require3 = require('./enums');

var field = _require3.field;
var assoc = _require3.assoc;
var map = _require3.map;

/**
 * A collection of lens creators and operation functions for composable lenses
 * @module futils/lenses
 * @requires futils/combinators
 * @requires futils/decorators
 * @requires futils/enums
 */

var Const = function Const(x) {
  return { value: x, map: function map() {
      return this;
    }
  };
};
var Identity = function Identity(x) {
  return { value: x, map: function map(f) {
      return Identity(f(x));
    }
  };
};

/**
 * Allows to create new types of lenses which work on different data structures
 *     than objects and arrays. Please note that the setter function has to
 *     take care to clone the given structure appropriate before manipulating it
 * @method 
 * @version 0.6.0
 * @param {function} getter A function defining how to get a value from the structure
 * @param {function} setter A function defining how to clone the structure and set a value
 * @return {function} A lens for the given data type
 *
 * @example
 * const {lens, over} = require('futils');
 *
 * let MapLens = lens((k, xs) => xs.get(k), (k, v, xs) => xs.set(k, v));
 * let m = new Map([['users', ['john doe']]]); 
 *
 * over(MapLens('users'), (s) => s.toUpperCase(), m); // -> ['JOHN DOE']
 */
var lens = curry(function (gets, sets, k, f, xs) {
  return map(function (replacement) {
    return sets(k, replacement, xs);
  }, f(gets(k, xs)));
});

// The bare bones, creates a lens which works on arrays and objects
var baseLens = lens(field, assoc);

/**
 * Given a lens and a data structure, returns the current value foci on the data
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {array|object} data The data structure
 * @return {*} Whatever the current value is
 *
 * @example
 * const {makeLenses, view} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * view(L.name, data); // -> 'John Doe'
 */
var view = dyadic(function (l, data) {
  return l(Const)(data).value;
});

/**
 * Given a lens, a function and a data structure, applies the function to the
 *     foci of the lens on the data structure and returns a copy of the given
 *     structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {function} f A data transforming function
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {makeLenses, over} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * over(L.name, (s) => s.toUpperCase(), data);
 * // -> {name: 'JOHN DOE', age: 30}
 */
var over = triadic(function (l, f, data) {
  return l(function (y) {
    return Identity(f(y));
  })(data).value;
});

/**
 * Given a lens, a value and a data structure, sets the value of the foci of the
 *     lens to the given value on the data structure and returns a copy of the
 *     given structure
 * @method 
 * @version 0.6.0
 * @param {function} l A lens created by makeLenses
 * @param {*} v The value to set
 * @param {array|object} data The data structure
 * @return {array|object} Modified clone of the given structure
 *
 * @example
 * const {makeLenses, set} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30};
 * let L = makeLenses('name', 'age');
 *
 * set(L.name, 'Adam Smith', data);
 * // -> {name: 'Adam Smith', age: 30}
 */
var set = triadic(function (l, v, data) {
  return over(l, getter(v), data);
});

/**
 * Takes a variadic number of string parameters and returns a collection of
 *     lenses where each lens points to one of the given parameters. A additional
 *     "num" lensmaker is returned too to allow peeking into array items
 * @method 
 * @version 0.6.0
 * @param {string} fields* String representing the fields on a object
 * @return {object} Collection of lenses
 *
 * @example
 * const {compose, makeLenses} = require('futils');
 *
 * let data = {name: 'John Doe', age: 30, friends: [{name: 'Adam Smith'}]};
 * let L = makeLenses('name', 'age', 'friends');
 *
 * L.name(data); // -> 'John Doe'
 * L.age(data); // -> 30
 *
 * const firstFriendsName = compose(L.friends, L.num(0), L.name);
 * firstFriendsName(data); // -> 'Adam Smith'
 */
var makeLenses = function makeLenses() {
  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
    fields[_key] = arguments[_key];
  }

  return fields.reduce(function (acc, field) {
    if (acc[field] === void 0) {
      acc[field] = baseLens(field);
    }
    return acc;
  }, { num: baseLens });
};

module.exports = { lens: lens, makeLenses: makeLenses, view: view, over: over, set: set };

},{"./combinators":4,"./decorators":6,"./enums":7}],9:[function(require,module,exports){
'use strict';

/*
The MIT License (MIT)
Copyright (c) 2015/2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var _require = require('./decorators');

var dyadic = _require.dyadic;

var _require2 = require('./types');

var isVoid = _require2.isVoid;
/**
 * A collection of functional state utilities
 * @module futils/state
 * @requires futils/decorators
 * @requires futils/types
 */

/**
 * Given a transform function and a seed value returns a function which
 *     update the seed with the result of the transformation function
 *     applied to the seed and the a new state
 * @method 
 * @version 0.8.0
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

var stateful = dyadic(function (f, init) {
  var now = init;
  return function (next) {
    if (!isVoid(next)) {
      now = f(now, next);
    }
    return now;
  };
});

/**
 * Given a number as seed value, returns a stateful counter function
 * @method
 * @version 0.8.0
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
var counter = function counter(seed) {
  return stateful(function (a, b) {
    return a + b;
  }, seed);
};

/**
 * Given a initial seed value, returns a state transformation which alwyas updates
 *     the current state with a new state if both are not equal
 * @method 
 * @version 0.8.0
 * @param {*} seed Initial state
 * @return {function} The transformation
 *
 * @example
 * const {chosen} = require('futils');
 *
 * const char = chosen('A');
 * active(); // -> 'A'
 * 
 * active('B');
 * active(); // -> 'B'
 */
var chosen = function chosen(seed) {
  return stateful(function (a, b) {
    return a === b ? a : b;
  }, seed);
};

module.exports = { stateful: stateful, counter: counter, chosen: chosen };

},{"./decorators":6,"./types":11}],10:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var _require = require('./types');

var isNil = _require.isNil;
var isFunc = _require.isFunc;
var isArray = _require.isArray;
var isObject = _require.isObject;
var isNumber = _require.isNumber;
var isString = _require.isString;

var _require2 = require('./decorators');

var curry = _require2.curry;
/**
 * A collection of transducer functions, inspired by Clojure
 * @module futils/transducers
 * @requires futils/types
 * @requires futils/decorators
 */

// Let's ensure we adhere to the official transducer protocol

var STEP = '@@transducer/step';
var INIT = '@@transducer/init';
var RESULT = '@@transducer/result';

// A generic transformer/transducer, not exposed
function Transformer(f) {
    return {
        '@@transducer/step': f,
        '@@transducer/init': function transducerInit() {
            throw 'transducers/init not supported on generic transformers';
        },
        '@@transducer/result': function transducerResult(v) {
            return v;
        }
    };
}

Transformer.isReduced = function (v) {
    return !isNil(v) && v.reduced;
};
Transformer.reduce = function (v) {
    return { value: v, reduced: true };
};
Transformer.deref = function (rv) {
    return rv && rv.value !== undefined ? rv.value : null;
};

/**
 * Works much like the Array::reduce function but accepts objects and all
 *     iterables which implement the @@iterator protocol
 * @method 
 * @version 0.5.0
 * @param {function|transducer} tf A transformer function or a transducer
 * @param {any} seed The seed value to transduce into
 * @param {object|iterable} xs The data to transduce over
 * @return {any} The given data transduced into the seed value
 *
 * @example
 * const {fold} = require('futils').transducers;
 *
 * const sep = (a, b) => !a ? b : a + ' - ' + b;
 * fold(sep, '', [1, 2, 3]); // -> '1 - 2 - 3'
 *
 * const pair = (a, b) => a + ': ' + b;
 * fold(
 *     (acc, [val, key]) => sep(acc, pair(key, val)),
 *     '',
 *     {a: 1, b: 2, c: 3} 
 * );
 * // -> 'a: 1 - b: 2 - c: 3'
 */
var fold = curry(function (tf, seed, ls) {
    var xf = isFunc(tf) ? Transformer(tf) : tf,
        v = seed;

    if (isObject(ls)) {
        var ks = Object.keys(ls);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = ks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var k = _step.value;

                v = xf[STEP](v, [ls[k], k]);
                if (Transformer.isReduced(v)) {
                    v = Transformer.deref(v);
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return xf[RESULT](v);
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = ls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var i = _step2.value;

            v = xf[STEP](v, i);
            if (Transformer.isReduced(v)) {
                v = Transformer.deref(v);
                break;
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return xf[RESULT](v);
});

/**
 * Takes a transducer, a step function which reduces, a initial value and a set
 *     of data to transduce over
 * @method 
 * @version 0.5.0
 * @param {transducer} tf A transducer to transduce with
 * @param {function|transducer} step A reducing function or transducer
 * @param {any} seed The seed value to transduce into
 * @param {object|iterable} xs The data to transduce over
 * @return {any} The given data transduced into the seed value
 *
 * @example
 * const {transduce, map} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const add1 = map((n) => n + 1);
 *
 * transduce(add1, sum, 0, [1, 2, 3]); // -> 9
 */
var transduce = curry(function (tf, step, seed, ls) {
    return fold(tf(isFunc(step) ? Transformer(step) : step), seed, ls);
});

/**
 * Takes a initial value, a transducer and some data and transduces the data into
 *     the seed. Please note that the step function is calculated on-the-fly, if
 *     you need more control please use the [transduce]{@link transducers#transduce}
 *     function
 * @method 
 * @version 0.5.0
 * @param {any} seed The seed value to transduce into
 * @param {transducer} tf A transducer to transduce with
 * @param {object|iterable} xs The data to transduce over
 * @return {any} The given data transduced into the seed value
 *
 * @example
 * const {into, map} = require('futils').transducers;
 *
 * const add1 = map((n) => n + 1);
 *
 * into(0, add1, [1, 2, 3]); // -> 9
 * into([], add1, [1, 2, 3]); // -> [2, 3, 4]
 * into('', add1, [1, 2, 3]); // -> '234'
 */
var into = curry(function (seed, tf, ls) {
    if (isArray(seed)) {
        return transduce(tf, function (arr, v) {
            return [].concat(_toConsumableArray(arr), [v]);
        }, seed, ls);
    }
    if (isObject(seed)) {
        return transduce(tf, function (obj, _ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var v = _ref2[0];
            var k = _ref2[1];

            var c = Object.assign({}, obj);
            c[k] = v;
            return c;
        }, seed, ls);
    }
    if (isNumber(seed) || isString(seed)) {
        return transduce(tf, function (acc, v) {
            return acc + v;
        }, seed, ls);
    }
    throw 'transducers::into got unknown inital value, use ::transduce with a special step function';
});

/**
 * Takes a function and returns a transducer which maps the function over each
 *     value in a data structure
 * @method 
 * @version 0.5.0
 * @param {function} f The function to map with
 * @return {function} A function which returns a mapping transducer
 *
 * @example
 * const {transduce, map} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const add1 = map((n) => n + 1);
 *
 * transduce(add1, sum, 0, [1, 2, 3]); // -> 9
 */
var map = function map(f) {
    return function (xf) {
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                return xf[STEP](xs, f(v));
            },
            '@@transducer/result': function transducerResult(v) {
                return xf[RESULT](v);
            }
        };
    };
};

/**
 * Takes a function and returns a transducer which filters with the given function
 *     all values in a data structure
 * @method 
 * @version 0.5.0
 * @param {function} f The function to filter with, should be a predicate function
 * @return {function} A function which returns a filtering transducer
 *
 * @example
 * const {transduce, filter} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const modBy2 = filter((n) => n % 2 === 0);
 *
 * transduce(modBy2, sum, 0, [1, 2, 3]); // -> 2
 */
var filter = function filter(f) {
    return function (xf) {
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                return !!f(v) ? xf[STEP](xs, v) : xs;
            },
            '@@transducer/result': function transducerResult(v) {
                return xf[RESULT](v);
            }
        };
    };
};

/**
 * Takes another transducer and flattens the intermediate nested data structure
 *     on level
 * @method 
 * @version 0.5.0
 * @param {transducer} xf Other transducer
 * @return {transducer} A flattening transducer
 *
 * @example
 * const {transduce, flatten} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 *
 * transduce(flatten, sum, 0, [[1], [2], [3]]); // -> 6
 */
var flatten = function flatten(xf) {
    return {
        '@@transducer/init': function transducerInit() {
            return xf[INIT]();
        },
        '@@transducer/step': function transducerStep(xs, v) {
            return fold({
                '@@transducer/init': function transducerInit() {
                    return xf[INIT]();
                },
                '@@transducer/step': function transducerStep(_xs, __v) {
                    var _v = xf[STEP](_xs, __v);
                    return Transformer.isReduced(_v) ? Transformer.deref(_v) : _v;
                },
                '@@transducer/result': function transducerResult(_v) {
                    return _v;
                }
            }, xs, v);
        },
        '@@transducer/result': function transducerResult(v) {
            return xf[RESULT](v);
        }
    };
};

/**
 * Takes a number and returns a transducer which drops the first N values according
 *     to the given number
 * @method 
 * @version 0.5.0
 * @param {number} [n = 1] A integer number, specifying the number of items to drop
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, drop} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const tail = drop(1);
 *
 * transduce(tail, sum, 0, [1, 2, 3]); // -> 5
 */
var drop = function drop() {
    var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    return function (xf) {
        var i = n;
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                if (i > 0) {
                    i -= 1;
                    return xs;
                }
                return xf[STEP](xs, v);
            },
            '@@transducer/result': function transducerResult(v) {
                return xf[RESULT](v);
            }
        };
    };
};

/**
 * Similiar to [drop]{@link transducers#drop}, but takes a function instead of
 *     a number and drops items until the function retuns false for the first
 *     time
 * @method 
 * @version 0.5.0
 * @param {function} f A predicate function
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, dropWhile} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const above2 = dropWhile((n) => n < 2);
 *
 * transduce(above2, sum, 0, [1, 2, 3]); // -> 5
 */
var dropWhile = function dropWhile(f) {
    return function (xf) {
        var drop = true,
            stop = false;
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                if (!stop && (drop = !!f(v))) {
                    return xs;
                }
                stop = true;
                return xf[STEP](xs, v);
            },
            '@@transducer/result': function transducerResult(v) {
                return xf[RESULT](v);
            }
        };
    };
};

/**
 * Takes a number and returns a transducer which takes N items from the beginning
 *     according to the given number
 * @method 
 * @version 0.5.0
 * @param {number} n The number of items to take
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, take} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const initial = take(2);
 *
 * transduce(initial, sum, 0, [1, 2, 3]); // -> 3
 */
var take = function take() {
    var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    return function (xf) {
        var i = 0;
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                if (i < n) {
                    i += 1;
                    return xf[STEP](xs, v);
                }
                return Transformer.reduce(xs);
            },
            '@@transducer/result': function transducerResult(v) {
                return xf[RESULT](v);
            }
        };
    };
};

/**
 * Similiar to [take]{@link transducers#take}, but takes a function instead of
 *     a number and takes items until the function retuns false for the first
 *     time
 * @method 
 * @version 0.5.0
 * @param {function} f A predicate function
 * @return {function} A function awaiting a transducer
 *
 * @example
 * const {transduce, takeWhile} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * const below3 = takeWhile((n) => n < 3);
 *
 * transduce(below3, sum, 0, [1, 2, 3]); // -> 3
 */
var takeWhile = function takeWhile(f) {
    return function (xf) {
        var take = true;
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                take = !!f(v);
                if (take) {
                    return xf[STEP](xs, v);
                }
                return Transformer.reduce(xs);
            },
            '@@transducer/result': function transducerResult(v) {
                return xf[RESULT](v);
            }
        };
    };
};

/**
 * Implements a transducers which removes all null or undefined values but keeps
 *     the rest
 * @method 
 * @version 0.5.0
 * @param {transducer} xf Other transducer
 * @return {transducer} A keeping transducer
 *
 * @example
 * const {transduce, keep} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 * 
 * transduce(keep, sum, 0, [1, null, 3]); // -> 4
 */
var keep = function keep(xf) {
    return {
        '@@transducer/init': function transducerInit() {
            return xf[INIT]();
        },
        '@@transducer/step': function transducerStep(xs, v) {
            return !isNil(v) ? xf[STEP](xs, v) : xs;
        },
        '@@transducer/result': function transducerResult(v) {
            return xf[RESULT](v);
        }
    };
};

/**
 * Implements a transducer which removes duplicated values
 * @method 
 * @version 0.5.0
 * @param {transducer} xf Other transducer
 * @return {transducer} A unique transducer
 *
 * @example
 * const {transduce, unique} = require('futils').transducers;
 *
 * const sum = (a, b) => a + b;
 *
 * transduce(unique, sum, 0, [1, 2, 1, 3, 2]); // -> 6
 */
var unique = function unique(xf) {
    var found = Object.create(null);
    return {
        '@@transducer/init': function transducerInit() {
            return xf[INIT]();
        },
        '@@transducer/step': function transducerStep(xs, v) {
            if (!found[v]) {
                found[v] = true;
                return xf[STEP](xs, v);
            }
            return xs;
        },
        '@@transducer/result': function transducerResult(v) {
            return xf[RESULT](v);
        }
    };
};

/**
 * Takes a number N and returns a transducer which partitions the input into
 *     subparts of N items
 * @method 
 * @version 0.5.0
 * @param {number} n Number of items inside each partition
 * @return {function} A function awaiting another transducer
 *
 * @example
 * const {transduce, partition} = require('futils').transducers;
 *
 * const push = (a, b) => a.push(b) && a;
 *
 * transduce(partition(2), push, [], [1, 2, 3, 4]); // -> [[1, 2], [3, 4]]
 */
var partition = function partition() {
    var n = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    return function (xf) {
        var p = [],
            _xs;
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                if (p.length < n) {
                    p.push(v);
                    return xs;
                }
                _xs = xf[STEP](xs, p);
                p = [v];
                return _xs;
            },
            '@@transducer/result': function transducerResult(v) {
                if (p.length > 0) {
                    return xf[RESULT](xf[STEP](v, p));
                }
                return xf[RESULT](v);
            }
        };
    };
};

/**
 * Similiar to [partition]{@link transducers#partition} but instead of taking a
 *     number it takes a function and partitions each time the function returns
 *     a result different to what it returned in the previous step
 * @method 
 * @version 0.5.0
 * @param {function} f The function to partition with
 * @return {function} A function awaiting another transducer
 *
 * @example
 * const {transduce, partitionWith} = require('futils').transducers;
 *
 * const push = (a, b) => a.push(b) && a;
 * const modBy3 = partitionWith((n) => n % 3 === 0);
 *
 * transduce(modBy3, push, [], [1, 2, 3, 4, 5]); // -> [[1, 2], [3], [4, 5]]
 */
var partitionWith = function partitionWith(f) {
    return function (xf) {
        var p = [],
            _xs,
            cur,
            last;
        return {
            '@@transducer/init': function transducerInit() {
                return xf[INIT]();
            },
            '@@transducer/step': function transducerStep(xs, v) {
                cur = f(v);
                if (p.length < 1) {
                    last = cur;
                    p.push(v);
                    return xs;
                }
                if (last === cur) {
                    p.push(v);
                    return xs;
                }
                last = cur;
                _xs = xf[STEP](xs, p);
                p = [v];
                return _xs;
            },
            '@@transducer/result': function transducerResult(v) {
                if (p.length > 0) {
                    return xf[RESULT](xf[STEP](v, p));
                }
                return xf[RESULT](v);
            }
        };
    };
};

module.exports = {
    fold: fold, transduce: transduce, into: into, map: map, filter: filter, unique: unique, keep: keep, partition: partition, partitionWith: partitionWith,
    take: take, takeWhile: takeWhile, drop: drop, dropWhile: dropWhile, flatten: flatten
};

},{"./decorators":6,"./types":11}],11:[function(require,module,exports){
'use strict';

/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * A collection of type checking utility functions to determine the type of a
 *     variable at runtime
 * @module futils/types
 */

/**
 * Returns true if given either `null` or `undefined`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True or false
 *
 * @example
 * const {isNil} = require('futils');
 *
 * isNil(null); // -> true
 * isNil(''); // -> false
 */
var isNil = function isNil(x) {
  return x == null;
};

/**
 * Returns true if given anything but `null` or `undefined`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True or false
 *
 * @example
 * const {isAny} = require('futils');
 *
 * isAny(null); // -> false
 * isAny(''); // -> true
 */
var isAny = function isAny(x) {
  return x != null;
};

/**
 * Returns true if given `undefined`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for `undefined`
 *
 * @example
 * const {isVoid} = require('futils');
 *
 * isVoid(null); // -> false
 * isVoid(undefined); // -> true
 */
var isVoid = function isVoid(x) {
  return x === undefined;
};

/**
 * Returns true if given `null`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for `null`
 *
 * @example
 * const {isNull} = require('futils');
 *
 * isNull(null); // -> true
 * isNull(undefined); // -> false
 */
var isNull = function isNull(x) {
  return x === null;
};

/**
 * Returns true if given a string
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for strings
 *
 * @example
 * const {isString} = require('futils');
 *
 * isString('Hello world'); // -> true
 * isString(null); // -> false
 */
var isString = function isString(x) {
  return typeof x === 'string';
};

/**
 * Returns true if given a number. Returns false if given `NaN` or `Infinity`
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for number values
 *
 * @example
 * const {isNumber} = require('futils');
 *
 * isNumber(1); // -> true
 * isNumber('1'); // -> false
 * isNumber(NaN); // -> false
 */
var isNumber = function isNumber(x) {
  return typeof x === 'number' && !isNaN(x) && isFinite(x);
};

/**
 * Returns true if given a integer
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for integers
 *
 * @example
 * const {isInt} = require('futils');
 *
 * isInt(1); // -> true
 * isInt(1.1); // -> false
 */
var isInt = function isInt(x) {
  return isNumber(x) && x % 1 === 0;
};

/**
 * Returns true if given a floating point number
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for floating point numbers
 *
 * @example
 * const {isFloat} = require('futils');
 *
 * isFloat(1); // -> false
 * isFloat(1.1); // -> true
 */
var isFloat = function isFloat(x) {
  return isNumber(x) && x % 1 !== 0;
};

/**
 * Returns true if given a boolean value
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for boolean values
 *
 * @example
 * const {isBool} = require('futils');
 *
 * isBool(false); // -> true
 * isBool('false'); // -> false
 */
var isBool = function isBool(x) {
  return typeof x === 'boolean';
};

/**
 * Returns true for any value which evaluates to true
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for all truthy values
 *
 * @example
 * const {isTrue} = require('futils');
 *
 * isTrue(true); // -> true
 * isTrue(null); // -> false
 */
var isTrue = function isTrue(x) {
  return !!x;
};

/**
 * Returns true for any value which evaluates to false
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for all falsy values
 *
 * @example
 * const {isFalse} = require('futils');
 *
 * isFalse(true); // -> false
 * isFalse(null); // -> true
 */
var isFalse = function isFalse(x) {
  return !x;
};

/**
 * Returns true if given functions
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for functions
 *
 * @example
 * const {isFunc} = require('futils');
 *
 * isFunc(() => null); // -> true
 * isFunc(null); // -> false
 */
var isFunc = function isFunc(x) {
  return typeof x === 'function';
};

/**
 * Returns true if given plain objects
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for object
 *
 * @example
 * const {isObject} = require('futils');
 *
 * isObject({}); // -> true
 * isObject([]); // -> false
 */
var isObject = function isObject(x) {
  return {}.toString.call(x) === '[object Object]';
};

/**
 * Returns true if given a array
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for arrays
 *
 * @example
 * const {isArray} = require('futils');
 *
 * isArray([]); // -> true
 * isArray({}); // -> false
 */
var isArray = function isArray(x) {
  return Array.isArray(x);
};

/**
 * Returns true if given a `Date` instance
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for `Date` instances
 *
 * @example
 * const {isDate} = require('futils');
 *
 * isDate(new Date()); // -> true
 * isDate('2016-05-01'); // -> false
 */
var isDate = function isDate(x) {
  return Date.prototype.isPrototypeOf(x);
};

/**
 * Returns true if given a `RegExp` instance
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for regular expressions
 *
 * @example
 * const {isRegex} = require('futils');
 *
 * isRegex(/.+/g); // -> true
 * isRegex('/.+/g'); // -> false
 */
var isRegex = function isRegex(x) {
  return RegExp.prototype.isPrototypeOf(x);
};

/**
 * Returns true if given a single DOM node
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for DOM nodes
 *
 * @example
 * const {isNode} = require('futils');
 *
 * isNode(document.body); // -> true
 * isNode(null); // -> false
 */
var isNode = function isNode(x) {
  return Node.prototype.isPrototypeOf(x);
};

/**
 * Returns true if given a Nodelist
 * @method
 * @version 0.1.0
 * @param {any} x Value to check
 * @return {boolean} True for Nodelists
 *
 * @example
 * const {isNodeList} = require('futils');
 *
 * isNodeList(document.querySelectorAll('body')); // -> true
 * isNodeList([document.body]); // -> false
 */
var isNodeList = function isNodeList(x) {
  return NodeList.prototype.isPrototypeOf(x);
};

var isMap = function isMap(x) {
  return Map.prototype.isPrototypeOf(x);
};

var isWeakMap = function isWeakMap(x) {
  return WeakMap.prototype.isPrototypeOf(x);
};

var isSet = function isSet(x) {
  return Set.prototype.isPrototypeOf(x);
};

var isWeakSet = function isWeakSet(x) {
  return WeakSet.prototype.isPrototypeOf(x);
};

/**
 * Returns true if given a promise
 * @method
 * @version 0.1.0
 * @param {any} x The value to check
 * @return {boolean} True for promises
 *
 * @example
 * const {isPromise} = require('futils');
 *
 * isPromise(new Promise( ... )); // -> true
 * isPromise({then() { ... }}); // ->true
 * isPromise({}); // -> false
 */
var isPromise = function isPromise(x) {
  return Promise.prototype.isPrototypeOf(x) || x && isFunc(x.then);
};

/**
 * Returns true if given a iterator
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for iterators
 *
 * @example
 * const {isIterator} = require('futils');
 *
 * var ns = [1, 2, 3];
 * isIterator(ns[Symbol.iterator]()); // -> true
 */
var isIterator = function isIterator(x) {
  return !isNil(x) && isFunc(x.next);
};

/**
 * Returns true for all iterables which implement `Symbol.iterator`
 * @method
 * @version 0.2.0
 * @param {any} x Value to check
 * @return {boolean} True for iterables
 *
 * @example
 * const {isIterable} = require('futils');
 *
 * isIterable([1, 2, 3]); // -> true
 * isIterable({}); // -> false
 */
var isIterable = function isIterable(x) {
  return !isNil(x) && !!(x[Symbol.iterator] || !isNaN(x.length));
};

/**
 * Awaits a type predicate and a value and returns true if the value is a array
 *     and only contains items which pass the predicate
 * @method
 * @version 0.3.0
 * @param {function} f The predicate
 * @param {any} x Value to check
 * @return {boolean} True if array of items which pass f
 *
 * @example
 * const {isString, isArrayOf} = require('futils');
 *
 * var pass = ['Hello', 'World'],
 *     fail = [1, 'World'];
 *
 * const isStrArray = isArrayOf(isString);
 *
 * isStrArray(pass); // -> true
 * isStrArray(fail); // -> false
 */
var isArrayOf = function isArrayOf(f, x) {
  if (x === void 0) {
    return function (_x) {
      return isArrayOf(f, _x);
    };
  }
  return Array.isArray(x) && x.every(f);
};

/**
 * Awaits a type predicate and a value and returns true if the value is a object
 *     and only contains values which pass the predicate
 * @method
 * @version 0.3.0
 * @param {function} f The predicate
 * @param {any} x Value to check
 * @return {boolean} True if object of values which pass f
 *
 * @example
 * const {isString, isObjectOf} = require('futils');
 *
 * var pass = {greet: 'Hello', subject: 'World'},
 *     fail = {greet: 1, subject: 'World'};
 *
 * const isStrObject = isObjectOf(isString);
 *
 * isStrObject(pass); // -> true
 * isStrObject(fail); // -> false
 */
var isObjectOf = function isObjectOf(f, x) {
  if (x === void 0) {
    return function (_x) {
      return isObjectOf(f, _x);
    };
  }

  if (isObject(x)) {
    for (var _key in x) {
      if (x.hasOwnProperty(_key) && !f(x[_key])) {
        return false;
      }
    }
    return true;
  }
  return false;
};

module.exports = {
  isNil: isNil, isAny: isAny, isNull: isNull, isVoid: isVoid, isArray: isArray, isBool: isBool, isSet: isSet, isString: isString, isWeakMap: isWeakMap,
  isWeakSet: isWeakSet, isFalse: isFalse, isTrue: isTrue, isFunc: isFunc, isFloat: isFloat, isInt: isInt, isNumber: isNumber, isNode: isNode,
  isNodeList: isNodeList, isDate: isDate, isObject: isObject, isPromise: isPromise, isIterable: isIterable, isArrayOf: isArrayOf, isObjectOf: isObjectOf,
  isMap: isMap, isRegex: isRegex, isIterator: isIterator
};

},{}]},{},[1]);
