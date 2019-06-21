// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import {typeOf} from '../core/typeof';
import {Type} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';
import {Ord} from '../generics/Ord';




/*
 * @module data
 */



/**
 * The Id data type. Id acts like a wrapper
 * for any value to provide it with a bunch of interfaces
 * @class module:data.Id
 * @extends module:generics.Show
 * @extends module:generics.Eq
 * @extends module:generics.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * Id(1); // -> Id(1)
 *
 * Id(1).value; // -> 1
 */
export const Id = Type('Id', ['value']).
    deriving(Show, Eq, Ord);



/**
 * Lifts a value into the Id
 * @method of
 * @static
 * @memberof module:data.Id
 * @param {any} a The value to lift
 * @return {Id} The value wrapped in a Id
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * Id.of(1); // -> Id(1)
 */
Id.of = Id;
/**
 * Lifts a value into a Id. Similiar to Id.of
 * @method from
 * @static
 * @memberof module:data.Id
 * @param {any} a The value to lift
 * @return {Id} The value wrapped in a Id
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * Id.from(1); // -> Id(1)
 */
Id.from = Id;
/**
 * A natural transformation from a Either.Left or Either.Right into a Id
 * @method fromEither
 * @static
 * @memberof module:data.Id
 * @param {Left|Right} a The Either to transform
 * @return {Id} A new Id
 *
 * @example
 * const {Id, Either} = require('futils').data;
 *
 * const r = Either.Right('a right');
 * const l = Either.Left('a left');
 *
 * Id.fromEither(r); // -> Id('a right')
 * Id.fromEither(l); // -> Id('a left')
 */
Id.fromEither = (a) => Id(a.value);
/**
 * A natural transformation from a Maybe.Some or Maybe.None into a Id
 * @method fromMaybe
 * @static
 * @memberof module:data.Id
 * @param {Some|None} a The Maybe to transform
 * @return {Id} A new Id
 *
 * @example
 * const {Id, Maybe} = require('futils').data;
 *
 * const some = Maybe.Some('a value');
 * const none = Maybe.None();
 *
 * Id.fromMaybe(some); // -> Id('a value');
 * Id.fromMaybe(none); // -> Id(null)
 */
Id.fromMaybe = (a) => Id(a.value);
/**
 * A natural transformation from a List into a Id. Please note that this
 * transformation looses data, because only the first element of the list is
 * taken
 * @method fromList
 * @static
 * @memberof module:data.Id
 * @param {List} a The List to transform
 * @return {Id} A new Id
 *
 * @example
 * const {Id, List} = require('futils').data;
 *
 * const ls = List.of(2).cons(1);
 *
 * Id.fromList(ls); // -> Id(1)
 */
Id.fromList = (a) => Id(a.head);



/**
 * Concatenates a Id with another. Please note, that the inner values have
 * to be part of a Semigroup as well for concattenation to succeed
 * @method concat
 * @memberof module:data.Id
 * @instance
 * @param {Id} a The Id instance to concatenate with
 * @return {Id} A new Id
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id('hello');
 *
 * id.concat(Id('world')); // -> Id('helloworld')
 */
Id.fn.concat = function (a) {
    if (Id.is(a)) {
        return Id(this.value.concat(a.value));
    }
    throw `Id::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over the inner value and wraps the result in a new Id
 * @method map
 * @memberof module:data.Id
 * @instance
 * @param {Function} f The function to map
 * @return {Id} A new Id
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id('a');
 *
 * const upperCase = (v) => v.toUpperCase();
 *
 * id.map(upperCase); // -> Id('A')
 */
Id.fn.map = function (f) {
    return Id(f(this.value));
}
/**
 * Flattens a nested Id one level
 * @method flat
 * @memberof module:data.Id
 * @instance
 * @return {Id} A flat Id
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id.of(Id.of(1));
 *
 * id.flat(); // -> Id(1)
 */
Id.fn.flat = function () {
    return this.value;
}
/**
 * Maps a Id returning function over a Id and flattens the result
 * @method flatMap
 * @memberof module:data.Id
 * @instance
 * @param {Function} f A Id returning function to map
 * @return {Id} A new Id
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id(2);
 *
 * const even = (n) => Id(n % 2 === 0);
 *
 * id.flatMap(even); // -> Id(true)
 */
Id.fn.flatMap = function (f) {
    return f(this.value);
}
/**
 * Extracts the value from a Id
 * @method extract
 * @memberof module:data.Id
 * @instance
 * @return {any} The value
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * Id.of(1).extract(); // -> 1
 */
Id.fn.extract = function () {
    return this.value;
}
/**
 * If given a function that takes a Id and returns a value, returns an Id
 * @method extend
 * @memberof module:data.Id
 * @instance
 * @param {Function} f A function taking a Id
 * @return {Id} A new Id
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * Id.of(1).extend(({value}) => value + 1); // -> Id(2)
 */
Id.fn.extend = function (f) {
    return Id.of(f(this));
}
/**
 * Applies a function in a Id to a value in another Id
 * @method ap
 * @memberof module:data.Id
 * @instance
 * @param {Id} a The Id that holds the value
 * @return {Id} Id which contains the result of applying the function
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id(1);
 *
 * const mInc = Id.of((n) => n + 1);
 *
 * mInc.ap(id); // -> Id(2)
 */
Id.fn.ap = function (a) {
    return a.map(this.value);
}
/**
 * Works much like the Array.reduce method. If given a function and an initial
 * value, calls the function with the initial value and the current value of the
 * Id and returns the result
 * @method reduce
 * @memberof module:data.Id
 * @instance
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} Whatever the reducer function returned
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id(1);
 *
 * const reducer = (a, b) => a + b;
 *
 * id.reduce(reducer, 1); // -> 2
 */
Id.fn.reduce = function (f, x) {
    return f(x, this.value);
}
/**
 * Takes a function with the signature (Applicative f) => a -> f a and an Applicative
 * constructor and traverses the Id into the Applicative
 * @method traverse
 * @memberof module:data.Id
 * @instance
 * @param {Function} f Function to traverse with
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Id wrapped in the Applicative
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id(1);
 *
 * const fn = (n) => [n]
 *
 * id.traverse(fn, Array); // -> [Id(1)]
 */
Id.fn.traverse = function (f, A) {
    return A.fn && A.fn.ap ?
           A.of(Id.of).ap(f(this.value)) :
           f(this.value).map(Id.of);
}
/**
 * Sequences a Id into another Applicative type
 * @method sequence
 * @memberof module:data.Id
 * @instance
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Id wrapped in the Applicative
 *
 * @example
 * const {Id} = require('futils').data;
 *
 * const id = Id([1]);
 *
 * id.sequence(Array); // -> [Id(1)]
 */
Id.fn.sequence = function (A) {
    return this.traverse((v) => v, A);
}