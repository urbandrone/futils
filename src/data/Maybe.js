/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';
import {UnionType} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';
import {Ord} from '../generics/Ord';




/**
 * Grants access to the Maybe data structure and its subtypes Some and None.
 * Usually they are used whenever an operation might result in a null value
 * @module data/Maybe
 * @requires adt
 * @requires generics/Show.Show
 * @requires generics/Eq.Eq
 * @requires generics/Ord.Ord
 */



/**
 * The Maybe union type
 * @class module:data/Maybe.Maybe
 * @extends module:generics/Show.Show
 * @extends module:generics/Eq.Eq
 * @extends module:generics/Ord.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Maybe} = require('futils/data');
 * const {Some, None} = Maybe;
 *
 * Maybe.Some(1); // -> Some(1)
 * Some(1);       // -> Some(1)
 *
 * Maybe.None();  // -> None
 * None();        // -> None
 *
 * Maybe.Some(1).value; // -> 1
 * Maybe.None().value;  // -> null
 */
export const Maybe = UnionType('Maybe', {Some: ['value'], None: []}).
    deriving(Show, Eq, Ord);

const {Some, None} = Maybe;
Maybe.prototype.value = null;


/**
 * Lifts a value into a Maybe.Some
 * @method of
 * @static
 * @memberOf module:data/Maybe.Maybe
 * @param {any} a The value to lift
 * @return {Some} The value wrapped in a Maybe.Some
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * Maybe.of(1); // -> Some(1)
 */
Maybe.of = Some;
/**
 * Monoid implementation for Maybe. Returns a Maybe.None
 * @method empty
 * @static
 * @memberOf module:data/Maybe.Maybe
 * @return {None} A Maybe.None
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * Maybe.empty(); // -> None
 */
Maybe.empty = None;
/**
 * Lifts a value into a Maybe. Similiar to Maybe.of, but if the value is either
 * null or undefined it returns Maybe.None
 * @method from
 * @static
 * @memberOf module:data/Maybe.Maybe
 * @param {any} a The value to lift
 * @return {Some|None} Maybe.Some if the value is not null or undefined, Maybe.None otherwise
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * Maybe.from(1); // -> Some(1)
 * Maybe.from(null); // -> None
 */
Maybe.from = (a) => a == null ? None() : Some(a);
/**
 * A natural transformation from a Either.Left or Either.Right into a Maybe
 * @method fromEither
 * @static
 * @memberOf module:data/Maybe.Maybe
 * @param {Left|Right} a The Either to transform
 * @return {Some|None} Maybe.Some if given an Either.Right, Maybe.None otherwise
 *
 * @example
 * const {Maybe, Either} = require('futils/either');
 *
 * const l = Either.Left('a left');
 * const r = Either.Right('a right');
 *
 * Maybe.fromEither(r); // -> Some('a right')
 * Maybe.fromEither(l); // -> None
 */
Maybe.fromEither = (a) => a.isRight() ? Some(a.value) : None();
/**
 * A natural transformation from an Id into a Maybe
 * @method fromId
 * @static
 * @memberOf module:data/Maybe.Maybe
 * @param {Id} a The Id to transform
 * @return {Some|None} Maybe.Some if the Id holds a value different from null or undefined
 *
 * @example
 * const {Maybe, Id} = require('futils/identity');
 *
 * const some = Id('a value');
 * const none = Id(null);
 *
 * Maybe.fromId(some); // -> Some('a value')
 * Maybe.fromId(none); // -> None
 */
Maybe.fromId = (a) => Maybe.from(a.value);
/**
 * A natural transformation from a List into a Maybe. Please note that this
 * transformation looses data, because only the first element of the list is
 * taken. If the first element is null or undefined, a Maybe.None is returned
 * @method fromList
 * @static
 * @memberOf module:data/Maybe.Maybe
 * @param {List} a The List to transform
 * @return {Some|None} Maybe.Some if the first element is not null or undefined
 *
 * @example
 * const {Maybe, List} = require('futils/data');
 *
 * const ls = List([1, 2, 3]);
 * const ks = List([]);
 *
 * Maybe.fromList(ls); // -> Some(1)
 * Maybe.fromList(ks); // -> None
 */
Maybe.fromList = (a) => Maybe.from(a.value[0]);



/**
 * Test if the instance is a Maybe.Some or a Maybe.None
 * @method isSome
 * @memberOf module:data/Maybe.Maybe
 * @return {Boolean} True if called on a Maybe.Some
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * some.isSome(); // -> true
 * none.isSome(); // -> false
 */
Maybe.prototype.isSome = function () {
    return this.caseOf({
        None: () => false,
        Some: () => true
    });
}
/**
 * Concattenates a Maybe.Some with another. Concattenation with Maybe.None will
 * result in Maybe.None. Please note, that the inner values have to be part of a
 * Semigroup as well for concattenation to succeed
 * @method concat
 * @memberOf module:data/Maybe.Maybe
 * @param {Some|None} a The Maybe instance to concattenate with
 * @return {Some|None} A new Maybe
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('a');
 * const none = Maybe.None();
 *
 * some.concat(Maybe.Some('b')); // -> Some('ab')
 * some.concat(Maybe.None()); // -> Some('a')
 * none.concat(Maybe.Some('b')); // -> None
 * none.concat(Maybe.None()); // -> None
 */
Maybe.prototype.concat = function (a) {
    if (Maybe.is(a)) {
        return this.caseOf({
            None: () => this,
            Some: (v) => a.isSome() ? Some(v.concat(a.value)) : this
        });
    }
    throw `Maybe::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over the inner value and wraps the result in a new Maybe. Does
 * not map the function over a Maybe.None
 * @method map
 * @memberOf module:data/Maybe.Maybe
 * @param {Function} f The function to map
 * @return {Some|None} A new Maybe.Some or the instance for Maybe.None
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('a');
 * const none = Maybe.None();
 *
 * const upperCase = (v) => v.toUpperCase();
 *
 * some.map(upperCase); // -> Some('A')
 * none.map(upperCase); // -> None
 */
Maybe.prototype.map = function (f) {
    return this.caseOf({
        None: () => this,
        Some: (v) => Maybe.from(f(v))
    });
}
/**
 * Flattens a nested Maybe.Some one level
 * @method flat
 * @memberOf module:data/Maybe.Maybe
 * @return {Some|None} A flat Maybe.Some
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some(Maybe.Some(1));
 * const none = Maybe.None();
 *
 * some.flat(); // -> Some(1)
 * none.flat(); // -> None
 */
Maybe.prototype.flat = function () {
    return this.caseOf({
        None: () => this,
        Some: (v) => v
    });
}
/**
 * Maps a Maybe returning function over a Maybe.Some and flattens the result
 * @method flatMap
 * @memberOf module:data/Maybe.Maybe
 * @param {Function} f A Maybe returning function to map
 * @return {Some|None} A new Maybe
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some(2);
 * const none = Maybe.None();
 *
 * const even = (n) => n % 2 === 0 ? Maybe.Some(n) : Maybe.None()
 *
 * some.flatMap(even); // -> Some(2)
 * none.flatMap(even); // -> None
 */
Maybe.prototype.flatMap = function (f) {
    return this.map(f).flat();
}
/**
 * Applies a function in a Maybe.Some to a value in another Maybe.Some
 * @method ap
 * @memberOf module:data/Maybe.Maybe
 * @param {Some|None} a The Maybe that holds the value
 * @return {Some|None} Maybe which contains the result of applying the function
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * const mInc = Maybe.Some((n) => n + 1);
 *
 * mInc.ap(some); // -> Some(2)
 * mInc.ap(none); // -> None
 */
Maybe.prototype.ap = function (a) {
    return this.caseOf({
        None: () => this,
        Some: (f) => a.map(f)
    });
}
/**
 * Bifunctor interface, maps either of two functions over the value inside a Maybe
 * @method biMap
 * @memberOf module:data/Maybe.Maybe
 * @param {Function} f Function to map if the value is a Maybe.None
 * @param {Function} g Function to map if the value is a Maybe.Some
 * @return {Some|None} Maybe with the result of applying either of the functions
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('a');
 * const none = Maybe.None();
 *
 * const upperCase = (v) => v.toUpperCase();
 * const defaultChar = () => 'X';
 *
 * some.biMap(defaultChar, upperCase); // -> Some('A')
 * none.biMap(defaultChar, upperCase); // -> Some('X')
 */
Maybe.prototype.biMap = function (f, g) {
    return this.caseOf({
        None: () => Maybe.from(f(null)),
        Some: (v) => Maybe.from(g(v))
    });
}
/**
 * Works much like the Array.reduce method. If given a function and an initial
 * value, returns the initial value for a Maybe.None and calls the function with
 * the initial value and the current value of a Maybe.Some
 * @method reduce
 * @memberOf module:data/Maybe.Maybe
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} Either the seed value or whatever the reducer function returned
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some('world');
 * const none = Maybe.None();
 *
 * const reducer = (a, b) => a.concat(b);
 *
 * some.reduce(reducer, 'hello'); // -> 'helloworld'
 * none.reduce(reducer, 'hello'); // -> 'hello'
 */
Maybe.prototype.reduce = function (f, x) {
    return this.caseOf({
        None: () => x,
        Some: (v) => f(x, v)
    });
}
/**
 * Takes a function with signature (Applicable f) => a -> f a and an Applicative
 * constructor and traverses the Maybe into the Applicative
 * @method traverse
 * @memberOf module:data/Maybe.Maybe
 * @param {Function} f Function to traverse with
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Maybe wrapped in the Applicative
 *
 * @example
 * const {Maybe} = require('futils/data');
 * 
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * const fn = (n) => [n];
 *
 * some.traverse(fn, Array); // -> [Some(1)]
 * none.traverse(fn, Array); // -> [None] 
 */
Maybe.prototype.traverse = function (f, A) {
    return this.caseOf({
        None: () => A.of(this),
        Some: (v) => f(v).map(Maybe.from)
    });
}
/**
 * Sequences a Maybe into another Applicative type
 * @method sequence
 * @memberOf module:data/Maybe.Maybe
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Maybe wrapped in the Applicative
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some([1]);
 * const none = Maybe.None();
 *
 * some.sequence(Array); // -> [Some(1)]
 * none.sequence(Array); // -> [None]
 */
Maybe.prototype.sequence = function (A) {
    return this.traverse((v) => v, A);
}
/**
 * Alt implementation, allows to swap a Maybe.None
 * @method alt
 * @memberOf module:data/Maybe.Maybe
 * @param {Some|None} a The alternative Maybe
 * @return {Some|None} Choosen alternative
 *
 * @example
 * const {Maybe} = require('futils/data');
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * some.alt(Maybe.Some(2)); // -> Some(1)
 * some.alt(Maybe.None());  // -> Some(1)
 * none.alt(Maybe.Some(2)); // -> Some(2)
 * none.alt(Maybe.None());  // -> None
 */ 
Maybe.prototype.alt = function (a) {
    return this.caseOf({
        None: () => a,
        Some: () => this
    });
}