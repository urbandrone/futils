/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {isNil, isFunc} from '../types';
import {aritize} from '../arity';

/**
 * Implementation of the Either monad
 * @module monads/Either
 * @requires types
 */



const MV = Symbol('MonadicValue');
const IS_RIGHT = Symbol('Either.isRight');


const evalsRight = (x) => !isNil(x) && !Error.prototype.isPrototypeOf(x);



/**
 * Implementation of the Either monad which is useful for modelling any actions
 *   that can either be an error or a success. Use the Left subclass for errors
 *   and the Right subclass for successes.
 * @class module:monads/either.Either
 * @static
 * @version 2.0.0
 */
export class Either {
    constructor(l, r) {
        if (evalsRight(r)) {
            this.value = r;
            this[IS_RIGHT] = true;
            return this;
        }
        this.value = l != null ? l : null;
        this[IS_RIGHT] = false;
    }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }

    static Left (a) {
        return new Either(a, null);
    } 

    static Right (a) {
        return new Either(null, a);
    }


    /**
     * Given a value to create from, returns a Left with the
     *     value if it has been an error, null or undefined and
     *     a Right if the value has any other value
     * @method fromNullable
     * @memberof module:monads/either.Either
     * @static
     * @param {any} a Value to wrap
     * @return {Left|Right} Either a Left or a Right
     *
     * @example
     * const {Either} = require('futils');
     * 
     * Either.fromNullable(1); // -> Right(1)
     * Either.fromNullable(null); // -> Left(null)
     */
    static fromNullable (a) {
        if (evalsRight(a)) {
            return Right.of(a);
        }
        return Left.of(a);
    }

    /**
     * Converts instances of the Identity monad into instances of the Either
     *     monad by using Either.fromNullable
     * @method fromIdentity
     * @memberOf module:monads/either.Either
     * @static
     * @param {Identity} m The Identity monad instance
     * @return {Left|Right} Instance of the Either monad
     *
     * @example
     * const {Identity, Either} = require('futils');
     *
     * const id1 = Identity.of(1);
     * const id2 = Identity.of(null);
     *
     * Either.fromIdentity(id1); // -> Right(1)
     * Either.fromIdentity(id2); // -> Left(null)
     */
    static fromIdentity (m) {
        return m.fold(Either.fromNullable);
    }

    /**
     * Creates an Either.Left or an Either.Right from a given Maybe.None or
     *     Maybe.Some
     * @method fromMaybe
     * @memberof module:monads/either.Either
     * @static
     * @param {None|Some} m The Maybe instance to transform
     * @return {Left|Right} Left or Right wrapper
     *
     * @example
     * const {Maybe, Either} = require('futils');
     *
     * let some = Maybe.of(1);
     * let none = Maybe.of(null);
     *
     * Either.fromMaybe(some); // -> Right(1)
     * Either.fromMaybe(none); // -> Left(null)
     */
    static fromMaybe (m) {
        return m.fold(Either.empty, Either.of);
    }

    /**
     * Creates an Either.Left or an Either.Right from a given IO monad
     * @method fromIO
     * @memberof module:monads/either.Either
     * @static
     * @param {IO} m IO monad instance
     * @return {Left|Right} Left or Right wrapper
     *
     * @example
     * const {Either, IO, prop} = require('futils');
     *
     * const getHref = new IO(prop('href'));
     *
     * Either.fromIO(getHref, window.location); // -> Right('...')
     * Either.fromIO(getHref, window.local); // -> Left('TypeError: ...')
     */
    static fromIO (m, ...ps) {
        return Either.try(m.run)(...ps);
    }

    /**
     * Given a function and (optional) partial arguments, returns a function if
     *     the given arguments are smaller than the functions arity, or executes
     *     the function and returns a Left on failure and a Right on success
     * @method try
     * @memberof module:monads/either.Either
     * @static
     * @param {function} f Function to execute
     * @param {*} x A default value if the function errors
     * @return {function} A function awaiting arguments to execute f
     *
     * @example
     * const {Either} = require('futils');
     *
     * const readUrl = (x) => x.href;
     *
     * Either.try(readUrl)(window.location); // -> Right(' ... ')
     * Either.try(readUrl)(null); // -> Left(TypeError)
     * 
     * // if given a default value to recover to: 
     * Either.try(readUrl, 'github.com')(null); // -> Right('github.com')
     */
    static try (f, x) {
        if (isFunc(f)) {
            return aritize(f.length, (...args) => {
                try {
                    return Right.of(f(...args));
                } catch (exc) {
                    return x !== undefined ? Right.of(x) : Left.of(exc);
                }
            });
        }
        throw 'Either::try expects argument to be function but saw ' + f;
    }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:monads/either.Either
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Right} = require('futils');
     *
     * let right = Right.of(1);
     *
     * right.toString(); // -> "Right(1)"
     */
    toString () {
        return this.isRight() ?
            `Right(${this.value})` :
            `Left(${this.value})`;
    }

    /**
     * Returns true if called on a Right and false if called on a Left
     * @method isRight
     * @memberof module:monads/either.Either
     * @return {boolean} True
     */
    isRight () { return !!this[IS_RIGHT]; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:monads/either.Either
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Either, Right} = require('futils');
     *
     * let one = Right.of(1);
     *
     * Either.is(one); // -> true
     */
    static is (x) { return Either.prototype.isPrototypeOf(x); }

    /**
     * Creates a new instance of a Right wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:monads/either.Either
     * @static
     * @param {any} a Any value
     * @return {Right} New instance of the Applicative
     *
     * @example
     * const {Right} = require('futils');
     *
     * let one = Right.of(1);
     *
     * one.value; // -> 1
     */
    static of (a) { return Right.of(a); }

    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:monads/either.Either
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Right} = require('futils');
     *
     * let one = Right.of(1);
     * let one_b = Right.of(1);
     * let two = Right.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (S) {
        return Either.is(S) && S.value === this.value;
    }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:monads/either.Either
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Right} New instance of the Functor
     *
     * @example
     * const {Right} = require('futils');
     *
     * let one = Right.of(1);
     *
     * const aInc = Right.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Right(2)
     */
    ap (F) {
        return this.fold(
            () => this,
            (r) => F.map(r)
        );
    }

    // -- Semigroup
    /**
     * Concatenates this member of a semigroup with another member of the
     *     same semigroup
     * @method concat
     * @memberof module:monads/either.Either
     * @param {Either} S Other member of the same semigroup
     * @return {Either} Both eithers concatenated
     *
     * @example
     * const {Either} = require('futils');
     *
     * const hello = Either.of('hello ');
     * const world = Either.of('world');
     *
     * hello.concat(world); // -> Right('hello world')
     */
    concat (S) {
        return this.fold(
            () => S,
            (r) => S.isRight() ?
                    Right.of(r.concat(S.value)) :
                    Right.of(r)
        );
    }

    /**
     * Returns the Unit instance of a Either
     * @method empty
     * @memberof module:monads/either.Either
     * @static
     * @return {Left} A new Left
     *
     * @example
     * const {Either} = require('futils');
     *
     * const str = Either.of('hello world');
     *
     * str.concat(Either.empty()); // -> Right('hello world')
     * Either.empty().concat(str); // -> Right('hello world')
     */
    static empty () {
        return Left.of(null);
    }
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:monads/either.Either
     * @param {function} f Function to map with
     * @return {Right} New instance of the Functor
     *
     * @example
     * const {Right} = require('futils');
     *
     * let one = Right.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> Right(2)
     */
    map (f) {
        if (isFunc(f)) {
            return this.fold(
                (l) => Left.of(l),
                (r) => Right.of(f(r))
            );
        }
    }

    /**
     * Given a function, maps it if the instance is a Left and does nothing if
     *     it is a Right
     * @method mapLeft   
     * @memberof module:monads/either.Either
     * @param {function} f Function to map
     * @return {Left|Right} A Left with updated value or a Right
     *
     * @example
     * const {Right, Left} = require('futils');
     *
     * let one = Right.of(1);
     * let nan = Left.of(NaN);
     *
     * const nanToZero = (x) => isNaN(x) ? 0 : x;
     *
     * one.mapLeft(nanToZero); // -> Right(1)
     * nan.mapLeft(nanToZero); // -> Left(0)
     */
    mapLeft (f) {
        return this.fold(
            (l) => Left.of(f(l)),
            (r) => Right.of(r)
        );
    }

    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:monads/either.Either
     * @param {function} f Function returning a monad
     * @return {Right} New instance of the calling monads type
     *
     * @example
     * const {Right} = require('futils');
     *
     * let one = Right.of(1);
     *
     * const mInc = (n) => Right.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> Right(2);
     */
    flatMap (f) {
        return this.map(f).flatten();
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten  
     * @memberof module:monads/either.Either  
     * @return {Right} New instance of the monad
     *
     * @example
     * const {Right} = require('futils');
     *
     * let one = Right.of(Right.of(1));
     *
     * one.flatten(); // -> Right(1)
     */
    flatten () {
        return this.isRight() ? this.value : this;
    }
    /**
     * Given two functions, folds the first over the instance if it reflects a
     *     Left and the second over the instance if it reflects a Right
     * @method fold    
     * @memberof module:monads/either.Either
     * @param {function} f Function handling the Left case
     * @param {function} g Function handling the Right case
     * @return {any} Whatever f or g return
     *
     * @example
     * const {Right, Left} = require('futils');
     *
     * let one = Right.of(1);
     * let nothing = Left.of(null);
     *
     * const fail = () => 'No int :(';
     * const success = (n) => `Given ${n}!`;
     *
     * one.fold(fail, success); // -> 'Given 2!';
     * none.fold(fail, success); // -> 'No int!';
     */
    fold (left, right) {
        if (this.isRight()) {
            return right(this.value);
        }
        return left(this.value);
    }

    /**
     * Implementation of the catamorphism. Given a object with `Left` and `Right`
     *     fields (functions) pipes the current value through the corresponding
     *     function
     * @method cata   
     * @memberof module:monads/either.Either
     * @param {object} o Object with `Left` and `Right`
     * @return {any} Result of applying the functions to the current value
     *
     * @example
     * const {Right, Left} = require('futils');
     *
     * let one = Right.of(1);
     * let nothing = Left.of(null);
     *
     * one.cata({
     *     Left: () => 'Nothing found',
     *     Right: (n) => 'Found number of ' + n
     * });
     * // -> 'Found number of 1'
     *
     * nothing.cata({
     *     Left: () => 'Nothing found',
     *     Right: (n) => 'Found number of ' + n
     * });
     * // -> 'Nothing found'
     */
    cata ({Left, Right}) {
        return this.fold(Left, Right);
    }

    /**
     * Takes a function from some value to a Functor and an
     *     Applicative and returns a instance of the Applicative
     *     either with a Left or a Right
     * @method traverse
     * @memberof module:monads/either.Either
     * @param {function} f Function from a to Applicative(a)
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} Either A(Right(x)) or A(Left(x))
     *
     * @example
     * const {Right, Identity} = require('futils');
     *
     * const one = Right.of(1);
     * 
     * one.traverse((x) => x, Identity); // -> Identity(Right(1))
     */
    traverse (f, A) {
        if (isFunc(f)) {
            return this.fold((l) => A.of(l).map(Left.of), (r) => A.of(f(r)).map(Right.of));
        }
        throw 'Either::traverse expects function but saw ' + f;
    }

    /**
     * Takes an Applicative and returns a instance of the Applicative
     *     either with a Left or a Right
     * @method sequence
     * @memberof module:monads/either.Either
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} Either A(Right(x)) or A(Left(x))
     *
     * @example
     * const {Right, Identity} = require('futils');
     *
     * const one = Right.of(Identity.of(1));
     *
     * one.sequence(Identity); // -> Identity(Right(1));
     */
    sequence (A) {
        return this.traverse((a) => a, A);
    }

    /**
     * Given two functions, maps the first over the instance if it reflects Left
     *     and the second if it reflects Right. Wraps the result into a new
     *     Bifunctor of the same type before returning
     * @method biMap    
     * @memberof module:monads/either.Either
     * @param {function} f Function to map if Left
     * @param {function} g Function to map if Right
     * @return {Right} Result in a new container
     *
     * @example
     * const {Right, Left} = require('futils');
     *
     * let one = Right.of(1);
     * let nothing = Left.of(null);
     *
     * const fail = () => 'No int :(';
     * const success = (n) => `Given ${n}!`;
     *
     * one.biMap(fail, success); // -> Right('Given 1!')
     * nothing.biMap(fail, success); // -> Left('No int :(')
     */
    biMap (left, right) {
        return this.fold(
            (l) => Left.of(left(l)),
            (r) => Right.of(right(r))
        );
    }

    /**
     * Swaps a Left into a Right and a Right into a Left (swaps the disjunction)
     * @method swap
     * @memberof module:monads/either.Either
     * @return {Left|Right} A Left or Right, depending on the instance
     *
     * @example
     * const {Right, Left} = require('futils');
     *
     * let one = Right.of(1);
     * let nan = Left.of(NaN);
     *
     * one.swap(); // -> Left(1);
     * nan.swap(); // -> Right(NaN)
     */
    swap () {
        return this.fold(
            (l) => Right.of(l),
            (r) => Left.of(r)
        );
    }

    /**
     * Allows recovering into a final value if the operation comes to a dead
     *     end
     * @method orGet
     * @memberof module:monads/either.Either
     * @param {any} x Recovery value if operating on a Left
     * @return {any} The recovery value on a Left, the value on a Right
     *
     * @example
     * const {Either} = require('futils');
     *
     * const one = Either.of(1);
     * const none = Either.empty();
     *
     * one.orGet('recover!'); // -> 1
     * none.orGet('recover!'); // -> 'recover!'
     */
    orGet (x) {
        return this.fold(() => x, (a) => a);
    }
    /**
     * Allows recovering into a new Right if the operation comes to a dead
     *     end
     * @method orElse
     * @memberof module:monads/either.Either
     * @param {any} x Recovery value if operating on a Left
     * @return {Right} Either a Right of the recovery or the value
     *
     * @example
     * const {Either} = require('futils');
     *
     * const one = Either.of(1);
     * const none = Either.empty();
     *
     * one.orElse('recover!'); // -> Right(1)
     * none.orElse('recover!'); // -> Right('recover!')
     */
    orElse (x) {
        return this.fold(
            () => evalsRight(x) ? Right.of(x) : Left.of(x),
            (r) => Right.of(r)
        );
    }
}




/**
 * The Either.Right monad class. Inherits from the Either Monad.
 * @class module:monads/either.Right
 * @augments module:monads/either.Either
 * @version 2.0.0
 */
export class Right extends Either {
    /* @constructor */
    constructor (a) { super(null, a); }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }
    toString () { return `Right(${this.value})`; }
    static of (a) { return new Right(a); }
}




/**
 * The Either.Left monad class. Inherits from the Either monad.
 * @class module:monads/either.Left
 * @augments module:monads/either.Either
 * @version 2.0.0
 */
export class Left extends Either {
    /* @constructor */
    constructor (a) { super(a, null); }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }
    toString () { return `Left(${this.value})`; }
    static of (a) { return new Left(a); }
}