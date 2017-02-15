/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import type from '../types';
import combine from '../combinators';

/**
 * Implementation of the Either monad
 * @module futils/monads/either
 * @requires futils/types
 */



const MV = Symbol('MonadicValue');




/**
 * The Either.Right monad class
 * @class module:futils/monads/either.Right
 * @version 2.0.0
 */
export class Right {
    constructor (a) {
        this.value = a;
    }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/either.Right
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Right} = require('futils');
     *
     * let right = Right.of(1);
     *
     * right.toString(); // -> "Right(1)"
     */
    toString () { return `Right(${this.value})`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/either.Right
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Right} = require('futils');
     *
     * let one = Right.of(1);
     *
     * Right.is(one); // -> true
     */
    static is (a) { return Right.prototype.isPrototypeOf(a); }

    /**
     * Returns true if called on a Right and false if called on a Left
     * @method isRight
     * @memberof module:futils/monads/either.Right
     * @return {boolean} True
     */
    isRight () { return true; }

    // -- Setoid
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:futils/monads/either.Right
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
    equals (b) {
        return Right.prototype.isPrototypeOf(b) &&
               b.value === this.value;
    }

    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor
     * @method map
     * @memberof module:futils/monads/either.Right
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
        if (type.isFunc(f)) {
            return Right.of(f(this.value));
        }
        throw 'Right::map expects argument to be function but saw ' + f;
    }

    // -- Applicative
    /**
     * Creates a new instance of a Right wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:futils/monads/either.Right
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
    static of (a) { return new Right(a); }
    of (a) { return Right.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor
     * @method ap
     * @memberof module:futils/monads/either.Right
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
    ap (m) {
        if (type.isFunc(m.map)) {
            return m.map(this.value);
        }
        throw 'Right::ap expects argument to be Functor but saw ' + m;
    }

    // -- Monad
    /**
     * Chains function calls which return monads into a single monad
     * @method flatMap
     * @memberof module:futils/monads/either.Right
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
        if (type.isFunc(f)) {
            return this.map(f).value;
        }
        throw 'Right::flatMap expects argument to be function but saw ' + f;
    }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value
     * @method flatten  
     * @memberof module:futils/monads/either.Right  
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
        return this.value;
    }

    // -- Recovering
    orGet () { return this.value; }
    orElse () { return this; }

    // -- Foldable
    // reduce
    
    // -- ?
    /**
     * Given two functions, folds the first over the instance if it reflects a
     *     Left and the second over the instance if it reflects a Right
     * @method fold    
     * @memberof module:futils/monads/either.Right
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
    fold (_, g) {
        if (type.isFunc(g)) {
            return g(this.value);
        }
        throw 'Right::fold expects argument 2 to be function but saw ' + g;
    }
    
    /**
     * Implementation of the catamorphism. Given a object with `Left` and `Right`
     *     fields (functions) pipes the current value through the corresponding
     *     function
     * @method cata   
     * @memberof module:futils/monads/either.Right
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
    cata (o) {
        if (type.isFunc(o.Right)) {
            return o.Right(this.value);
        }
        throw 'Right::cata expected Object of {Right: fn}, but saw ' + o; 
    }

    /**
     * Takes a function from some value to a Functor and an
     *     Applicative and returns a instance of the Applicative
     *     either with a Left or a Right
     * @method traverse
     * @memberof module:futils/monads/either.Right
     * @param {function} f Function from a to Applicative(a)
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} Either A(Right(x)) or A(Left(x))
     *
     * @example
     * const {Right, Identity} = require('futils');
     *
     * const one = Right.of(Identity.of(1));
     * 
     * one.traverse(Identity.of, Identity);
     * // -> Identity(Right(1))
     */
    traverse (f, A) {
        if (type.isFunc(f) && type.isApplicative(A)) {
            return this.fold(null, (x) => f(x).map(A.of))
        }
        throw 'Right::traverse expects function & Applicative but saw ' + [f, A];
    }

    /**
     * Takes an Applicative and returns a instance of the Applicative
     *     either with a Left or a Right
     * @method sequence
     * @memberof module:futils/monads/either.Right
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
        return this.traverse(combine.id, A);
    }

    // -- Bifunctor
    /**
     * Given two functions, maps the first over the instance if it reflects Left
     *     and the second if it reflects Right. Wraps the result into a new
     *     Bifunctor of the same type before returning
     * @method biMap    
     * @memberof module:futils/monads/either.Right
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
    biMap (_, g) {
        if (type.isFunc(g)) {
            return Right.of(g(this.value));
        }
        throw 'Right::biMap expects argument 2 to be function but saw ' + g;
    }

    /**
     * Swaps a Left into a Right and a Right into a Left (swaps the disjunction)
     * @method swap
     * @memberof module:futils/monads/either.Right
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
        return Left.of(this.value);
    }

    /**
     * Given a function, maps it if the instance is a Left and does nothing if
     *     it is a Right
     * @method mapLeft   
     * @memberof module:futils/monads/either.Right
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
    mapLeft () { return this; }
    // -- Semigroup
    // -- Traversable
}




/**
 * The Either.Left monad class
 * @class module:futils/monads/either.Left
 * @version 2.0.0
 */
export class Left {
    constructor (a) {
        this.value = a;
    }
    set value (a) { this[MV] = a; }
    get value () { return this[MV]; }

    /**
     * Returns a string representation of the instance
     * @method toString
     * @memberof module:futils/monads/either.Left
     * @return {string} String representation of the calling instance
     *
     * @example
     * const {Left} = require('futils');
     *
     * let left = Left.of(1);
     *
     * left.toString(); // -> "Left(1)"
     */
    toString () { return `Left(${this.value})`; }

    /**
     * Returns true if given a instance of the class
     * @method is
     * @memberof module:futils/monads/either.Left
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if instance of the class
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * Left.is(one); // -> true
     */
    static is (a) { return Left.prototype.isPrototypeOf(a); }

    /**
     * Returns true if called on a Right and false if called on a Left
     * @method isRight    
     * @memberof module:futils/monads/either.Left
     * @return {boolean} False
     */
    isRight () { return false; }

    // -- Setoid
    /**
     * Given another Setoid, checks if they are equal
     * @method equals
     * @memberof module:futils/monads/either.Left
     * @param {Setoid} b Setoid to compare against
     * @return {boolean} True if both are equal
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     * let one_b = Left.of(1);
     * let two = Left.of(2);
     *
     * one.equals(one_b); // -> true
     * one.equals(two); // -> false
     */
    equals (b) {
        return Left.prototype.isPrototypeOf(b) &&
               b.value === this.value;
    }
    // -- Functor
    /**
     * Maps a function `f` over the value inside the Functor. Does nothing if
     *     called on a Left.
     * @method map
     * @memberof module:futils/monads/either.Left
     * @param {function} f Function to map with
     * @return {Left} New instance of the Functor
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * const inc = (a) => a + 1;
     *
     * one.map(inc); // -> Left(1)
     */
    map () { return this; }
    // -- Applicative
    /**
     * Creates a new instance of a Left wrapping the given value `a`. Use
     *     `.of` instead of the constructor together with `new`
     * @method of
     * @memberof module:futils/monads/either.Left
     * @static
     * @param {any} a Any value
     * @return {Left} New instance of the Applicative
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * one.value; // -> 1
     */
    static of (a) { return new Left(a); }
    of (a) { return Left.of(a); }

    /**
     * Applies a wrapped function to a given Functor and returns a new instance
     *     of the Functor. Does nothing if called on a Left
     * @method ap
     * @memberof module:futils/monads/either.Left
     * @param {Functor} m Functor to apply the Applicative to
     * @return {Left} New instance of the Functor
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * const aInc = Left.of((a) => a + 1);
     *
     * aInc.ap(one); // -> Left(1)
     */
    ap (m) { return m; }
    // -- Monad
    /**
     * Chains function calls which return monads into a single monad. Does nothing
     *     if called on a Left
     * @method flatMap
     * @memberof module:futils/monads/either.Left
     * @param {function} f Function returning a monad
     * @return {Left} New instance of the calling monads type
     *
     * @example
     * const {Right, Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * const mInc = (n) => Right.of(1).map((m) => n + m);
     *
     * one.flatMap(mInc); // -> Left(1);
     */
    flatMap () { return this; }

    /**
     * Flattens down a nested monad one level and returns a new monad containing
     *     the inner value. Does nothing if called on a Left
     * @method flatten  
     * @memberof module:futils/monads/either.Left 
     * @return {Left} New instance of the monad
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(Left.of(1));
     *
     * one.flatten(); // -> Left(Left(1))
     */
    flatten () { return this; }
    // -- Recovering
    orGet (a) { return a; }
    orElse (a) { return Right.of(a); }
    // -- Foldable
    // reduce
    // -- ?
    /**
     * Given two functions, folds the first over the instance if it is a
     *     Left and the second over the instance if it is a Right
     * @method fold
     * @memberof module:futils/monads/either.Left
     * @param {function} f Function handling the Left case
     * @param {function} g Function handling the Right case
     * @return {any} Whatever f or g return
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * const fail = () => 'No int :(';
     * const success = (n) => `Given ${n}!`;
     *
     * one.fold(fail, success); // -> 'No int :(';
     */
    fold (f) {
        if (type.isFunc(f)) {
            return f(this.value);
        }
        throw 'Left::fold expects argument 1 to be function but saw ' + f;
    }
    
    /**
     * Implementation of the catamorphism. Given a object with `Left` and `Right`
     *     fields (functions) pipes the current value through the corresponding
     *     function
     * @method cata
     * @memberof module:futils/monads/either.Left
     * @param {object} o Object with `Left` and `Right`
     * @return {any} Result of applying the functions to the current value
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * one.cata({
     *     Left: () => 'Nothing found',
     *     Right: (n) => 'Found number of ' + n
     * });
     * // -> 'Nothing found'
     */
    cata (o) {
        if (type.isFunc(o.Left)) {
            return o.Left(this.value);
        }
        throw 'Left::cata expected Object of {Left: fn}, but saw ' + o; 
    }

    /**
     * Takes a function from some value to a Functor and an
     *     Applicative and returns a instance of the Applicative
     *     either with a Left or a Right
     * @method traverse
     * @memberof module:futils/monads/either.Left
     * @param {function} f Function from a to Applicative(a)
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} Either A(Right(x)) or A(Left(x))
     *
     * @example
     * const {Left, Identity} = require('futils');
     *
     * const one = Left.of(Identity.of(1));
     * 
     * one.traverse(Identity.of, Identity);
     * // -> Identity(Left(1))
     */
    traverse (f, A) {
        if (type.isFunc(f) && type.isApplicative(A)) {
            return this.fold((x) => A.of(x).map(A.of))
        }
        throw 'Left::traverse expects function & Applicative but saw ' + [f, A];
    }

    /**
     * Takes an Applicative and returns a instance of the Applicative
     *     either with a Left or a Right
     * @method sequence
     * @memberof module:futils/monads/either.Left
     * @param {Applicative} A Applicative constructor
     * @return {Applicative} Either A(Right(x)) or A(Left(x))
     *
     * @example
     * const {Left, Identity} = require('futils');
     *
     * const one = Left.of(Identity.of(1));
     *
     * one.sequence(Identity); // -> Identity(Left(1));
     */
    sequence (A) {
        return this.traverse(combine.id, A);
    }

    // -- Bifunctor
    /**
     * Given two functions, maps the first over the instance if it is a Left
     *     and the second if it is a Right. Wraps the result into a new
     *     Bifunctor of the same type before returning
     * @method biMap
     * @memberof module:futils/monads/either.Left
     * @param {function} f Function to map if None
     * @param {function} g Function to map if Some
     * @return {Left} Result in a new container
     *
     * @example
     * const {Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * const fail = () => 'No int :(';
     * const success = (n) => `Given ${n}!`;
     *
     * one.biMap(fail, success); // -> Left('No int :(')
     */
    biMap (f) {
        if (type.isFunc(f)) {
            return Left.of(f(this.value));
        }
        throw 'Left::biMap expects argument 1 to be function but saw ' + f;
    }

    /**
     * Swaps a Left into a Right and a Right into a Left (swaps the disjunction)
     * @method swap
     * @memberof module:futils/monads/either.Left
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
        return Right.of(this.value);
    }

    /**
     * Given a function, maps it if the instance is a Left and does nothing if
     *     it is a Right
     * @method mapLeft
     * @memberof module:futils/monads/either.Left
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
        if (type.isFunc(f)) {
            return this.biMap(f);
        }
        throw 'Left::biMap expects argument 1 to be function but saw ' + f;
    }
    // -- Traversable
}

/**
 * Either monad class
 * @class module:futils/monads/either.Either
 * @static
 * @version 2.0.0
 */
export default class Either {
    /**
     * Allows to test if a value is a instance of either Left or Right
     * @method is
     * @memberof module:futils/monads/either.Either
     * @static
     * @param {any} a Value to check
     * @return {boolean} True if given a Left or Right, false otherwise
     *
     * @example
     * const {Either, Left} = require('futils');
     *
     * let one = Left.of(1);
     *
     * Either.is(one); // -> true
     * Either.is(1); // -> false
     */
    static is (a) { return Left.is(a) || Right.is(a); }

    /**
     * Creates a new Right of the given value
     * @method of
     * @memberof module:futils/monads/either.Either
     * @static
     * @param {any} a Value to wrap
     * @return {Right} A Right holding the value
     *
     * @example
     * const {Either} = require('futils');
     *
     * let one = Either.of(1);
     */
    static of (a) { return Right.of(a); }

    /**
     * Given a fallback and the value to create from, returns a Left with the
     *     fallback value if the actual value has been null or undefined and
     *     a Right if the value has any other value
     * @method fromNullable
     * @memberof module:futils/monads/either.Either
     * @static
     * @param {any} exc Fallback value
     * @param {any} a Value to wrap
     * @return {Left|Right} Either a Left with the fallback or a Right
     *
     * @example
     * const {Either} = require('futils');
     * 
     * Either.fromNullable(1); // -> Right(1)
     * Either.fromNullable(null); // -> Left(null)
     */
    static fromNullable (a) {
        if (!type.isNull(a) && !type.isVoid(a)) {
            return Right.of(a);
        }
        return Left.of(a);
    }

    /**
     * Creates a Either.Left or a Either.Right from a given Maybe.None or
     *     Maybe.Some
     * @method fromMaybe
     * @memberof module:futils/monads/either.Either
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
        return m.fold(() => Left.of(null), Right.of);
    }

    /**
     * Creates a Either.Left or a Either.Right from a given IO monad
     * @method fromIO
     * @memberof module:futils/monads/either.Either
     * @static
     * @param {IO} m IO monad instance
     * @return {Left|Right} Left or Right wrapper
     *
     * @example
     * const {Either, IO} = require('futils');
     *
     * let location = IO.of(window.location.href);
     * let fails = IO.of(window.local.href);
     *
     * Either.fromIO(location); // -> Right('...')
     * Either.fromIO(fails); // -> Left('TypeError: ...')
     */
    static fromIO (m) {
        return Either.try(m.run);
    }

    /**
     * Given a function and (optional) partial arguments, returns a function if
     *     the given arguments are smaller than the functions arity, or executes
     *     the function and returns a Left on failure and a Right on success
     * @method try
     * @memberof module:futils/monads/either.Either
     * @static
     * @param {function} f Function to execute
     * @param {any} [partials] Any number of arguments to partially apply left
     * @return {function|Left|Right} Depending on the input
     */
    static try (f, ...partials) {
        if (type.isFunc(f)) {
            if (f.length <= partials.length) {
                try {
                    let R = f(...partials);
                    return Error.prototype.isPrototypeOf(R) ?
                           Left.of(R.message) :
                           Right.of(R);
                } catch (exc) {
                    return Left.of(exc.message);
                }
            }
            return (...args) => {
                return Either.try(f, ...partials, ...args);
            }
        }
        throw 'Either::try expects argument to be function but saw ' + f;
    }
}