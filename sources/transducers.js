/*
The MIT License (MIT)
Copyright (c) 2016 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from './types';
import decorators from './decorators';
/**
 * A collection of transducer functions, inspired by Clojure
 * @module futils/transducers
 * @requires futils/types
 * @requires futils/decorators
 */


// Let's ensure we adhere to the official transducer protocol
const STEP = '@@transducer/step';
const INIT = '@@transducer/init';
const RESULT = '@@transducer/result';


// A generic transformer/transducer, not exposed
function Transformer (f) {
    return {
        '@@transducer/step': f,
        '@@transducer/init': () => {
            throw 'transducers/init not supported on generic transformers';
        },
        '@@transducer/result': (v) => v
    };
}


Transformer.isReduced = (v) => {
    return !type.isNil(v) && v.reduced;
};
Transformer.reduce = (v) => {
    return {value: v, reduced: true}
};
Transformer.deref = (rv) => {
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
const fold = decorators.curry((tf, seed, ls) => {
    var xf = type.isFunc(tf) ? Transformer(tf) : tf,
        v = seed;

    if (type.isObject(ls)) {
        let ks = Object.keys(ls);
        for (let k of ks) {
            v = xf[STEP](v, [ls[k], k]);
            if (Transformer.isReduced(v)) {
                v = Transformer.deref(v);
                break;
            }
        }
        return xf[RESULT](v);
    }

    for (let i of ls) {
        v = xf[STEP](v, i);
        if (Transformer.isReduced(v)) {
            v = Transformer.deref(v);
            break;
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
const transduce = decorators.curry((tf, step, seed, ls) => {
    return fold(
        tf(type.isFunc(step) ? Transformer(step) : step),
        seed,
        ls
    );
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
const into = decorators.curry((seed, tf, ls) => {
    if (type.isArray(seed)) {
        return transduce(
            tf,
            (arr, v) => [...arr, v],
            seed,
            ls
        );
    }
    if (type.isObject(seed)) {
        return transduce(
            tf,
            (obj, [v, k]) => {
                let c = Object.assign({}, obj);
                c[k] = v;
                return c;
            },
            seed,
            ls
        );
    }
    if (type.isNumber(seed) || type.isString(seed)) {
        return transduce(
            tf,
            (acc, v) => acc + v,
            seed,
            ls
        );
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
const map = (f) => {
    return (xf) => {
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => xf[STEP](xs, f(v)),
            '@@transducer/result': (v) => xf[RESULT](v)
        };
    }
}

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
const filter = (f) => {
    return (xf) => {
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => !!f(v) ? xf[STEP](xs, v) : xs,
            '@@transducer/result': (v) => xf[RESULT](v)
        };
    }
}

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
const flatten = (xf) => {
    return {
        '@@transducer/init': () => xf[INIT](),
        '@@transducer/step': (xs, v) => fold({
            '@@transducer/init': () => {
                return xf[INIT]();
            },
            '@@transducer/step': (_xs, __v) => {
                var _v = xf[STEP](_xs, __v);
                return Transformer.isReduced(_v) ?
                       Transformer.deref(_v) :
                       _v;
            },
            '@@transducer/result': (_v) => {
                return _v;
            }
        }, xs, v),
        '@@transducer/result': (v) => xf[RESULT](v)
    };
}

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
const drop = (n = 1) => {
    return (xf) => {
        var i = n;
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => {
                if (i > 0) {
                    i -= 1;
                    return xs;
                }
                return xf[STEP](xs, v);
            },
            '@@transducer/result': (v) => xf[RESULT](v)
        };
    }
}

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
const dropWhile = (f) => {
    return (xf) => {
        var drop = true, stop = false;
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => {
                if (!stop && (drop = !!f(v))) {
                    return xs;
                }
                stop = true;
                return xf[STEP](xs, v);
            },
            '@@transducer/result': (v) => xf[RESULT](v)
        };
    }
}

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
const take = (n = 1) => {
    return (xf) => {
        var i = 0;
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => {
                if (i < n) {
                    i += 1;
                    return xf[STEP](xs, v);
                }
                return Transformer.reduce(xs);
            },
            '@@transducer/result': (v) => xf[RESULT](v)
        };
    }
}

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
const takeWhile = (f) => {
    return (xf) => {
        var take = true;
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => {
                take = !!f(v);
                if (take) {
                    return xf[STEP](xs, v);
                }
                return Transformer.reduce(xs);
            },
            '@@transducer/result': (v) => xf[RESULT](v)
        };
    }
}

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
const keep = (xf) => {
    return {
        '@@transducer/init': () => xf[INIT](),
        '@@transducer/step': (xs, v) => !type.isNil(v) ? xf[STEP](xs, v) : xs,
        '@@transducer/result': (v) => xf[RESULT](v)
    };
}

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
const unique = (xf) => {
    var found = Object.create(null);
    return {
        '@@transducer/init': () => xf[INIT](),
        '@@transducer/step': (xs, v) => {
            if (!found[v]) {
                found[v] = true;
                return xf[STEP](xs, v);
            }
            return xs;
        },
        '@@transducer/result': (v) => xf[RESULT](v)
    };
}

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
const partition = (n = 1) => {
    return (xf) => {
        var p = [], _xs;
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => {
                if (p.length < n) {
                    p.push(v);
                    return xs;
                }
                _xs = xf[STEP](xs, p);
                p = [v];
                return _xs;
            },
            '@@transducer/result': (v) => {
                if (p.length > 0) {
                    return xf[RESULT](xf[STEP](v, p));
                }
                return xf[RESULT](v);
            }
        };
    }
}

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
const partitionWith = (f) => {
    return (xf) => {
        var p = [], _xs, cur, last;
        return {
            '@@transducer/init': () => xf[INIT](),
            '@@transducer/step': (xs, v) => {
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
            '@@transducer/result': (v) => {
                if (p.length > 0) {
                    return xf[RESULT](xf[STEP](v, p));
                }
                return xf[RESULT](v);
            }
        };
    }
}

export default {
    fold, transduce, into, map, filter, unique, keep, partition, partitionWith,
    take, takeWhile, drop, dropWhile, flatten
};