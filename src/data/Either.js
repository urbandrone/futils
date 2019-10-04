// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { typeOf } from '../core/typeof';
import { Type, UnionType } from '../adt';
import { Show } from '../generics/Show';
import { Eq } from '../generics/Eq';
import { Ord } from '../generics/Ord';

/*
 * @module data
 */

/**
 * The Either union type and its subtypes Right and Left.
 * Usually they are used whenever an operation might result in an error. Typically
 * the error value is placed in a Left while the result is placed in a Right
 * (because canonically "right" means "correct")
 * @class module:data.Either
 * @extends module:generics.Show
 * @extends module:generics.Eq
 * @extends module:generics.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Either} = require('futils').data;
 * const {Left, Right} = Either;
 *
 * Either.Right(1); // -> Right(1)
 * Right(1);    // -> Right(1)
 *
 * Either.Left(0);  // -> Left(0)
 * Left(0);     // -> Left(0)
 *
 * Either.Right(1).value; // -> 1
 * Either.Left(0).value;  // -> 0
 */
export const Either = UnionType('Either', {
  Right: ['value'],
  Left: ['value']
}).deriving(Show, Eq, Ord);

const { Right, Left } = Either;

/**
 * Lifts a value into a Either.Right
 * @method of
 * @static
 * @memberof module:data.Either
 * @param {any} a The value to lift
 * @return {Right} The value wrapped in a Either.Right
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * Either.of(1); // -> Right(1)
 */
Either.of = Right;

/**
 * Monoid implementation for Either. Returns a Either.Left with a value of null
 * @method empty
 * @static
 * @memberof module:data.Either
 * @return {Left} A Either.Left
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * Either.empty(); // -> Left(null)
 */
Either.empty = () => Left(null);

/**
 * Plus implementation for Either. Returns a Either.Left with a value of null
 * @method zero
 * @static
 * @since 3.2.0
 * @memberof module:data.Either
 * @return {Left} A Either.Left
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * Either.zero(); // -> Left(null)
 */
Either.zero = () => Left(null);

/**
 * Lifts a value into a Either. Similiar to Either.of, but if the value is either
 * null, undefined or some error it returns a Either.Left
 * @method from
 * @static
 * @memberof module:data.Either
 * @param {any} a The value to lift
 * @return {Left|Right} Either.Right for all values which are not null, undefined or some error
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * Either.from(1);           // -> Right(1)
 * Either.from(null);        // -> Left(null)
 * Either.from(new Error('failed')); // -> Left(Error)
 */
Either.from = a =>
  a == null
    ? Left(null)
    : a instanceof Error || Error.prototype.isPrototypeOf(a)
    ? Left(a.message)
    : Right(a);

/**
 * A natural transformation from a Maybe.Some or Maybe.None into a Either
 * @method fromMaybe
 * @static
 * @memberof module:data.Either
 * @param {Some|None} a The Maybe to transform
 * @return {Left|Right} Either.Right if given a Maybe.Some, Either.Left otherwise
 *
 * @example
 * const {Either, Maybe} = require('futils').data;
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * Either.fromMaybe(some); // -> Right(1)
 * Either.fromMaybe(none); // -> Left(null)
 */
Either.fromMaybe = a => (a.isSome() ? Right(a.value) : Left(null));

/**
 * A natural transformation from an Id into a Either
 * @method fromId
 * @static
 * @memberof data/Either.Either
 * @param {Id} a The Id to transform
 * @return {Right|Left} Either.Right if the Id holds a value different from null, undefined and error
 *
 * @example
 * const {Either, Id} = require('futils/identity');
 *
 * const some = Id('a value');
 * const none = Id(null);
 *
 * Either.fromId(some); // -> Right('a value')
 * Either.fromId(none); // -> Left(null)
 */
Either.fromId = a => Either.from(a.value);

/**
 * A natural transformation from a List into a Either. Please note that this
 * transformation looses data, because only the first element of the list is
 * taken. If the first element is null, undefined or some error, a Either.Left
 * is returned
 * @method fromList
 * @static
 * @memberof module:data.Either
 * @param {List} a The List to transform
 * @return {Left|Right} Either.Right if the first element is not null, undefined or some error
 *
 * @example
 * const {Either, List} = require('futils').data;
 *
 * const ls = List.of(2).cons(1);
 * const ks = List.Nil();
 *
 * Either.fromList(ls); // -> Right(1)
 * Either.fromList(ks); // -> Left(null)
 */
Either.fromList = a =>
  a.caseOf({
    Nil: () => Either.from(null),
    Cons: h => Either.from(h)
  });

/**
 * A natural transformation from a State, a IO or a function into a Either. Returns
 * a function that awaits a argument to run the computation and which returns a
 * Either.Right if the computation succeeds or a Either.Left if it fails
 * @method try
 * @static
 * @memberof module:data.Either
 * @param {IO|State|Function} a The computation
 * @return {Function} A function which takes arguments to run the computation
 *
 * @example
 * const {Either, IO} = require('futils').data;
 *
 * const ioEnv = IO((key) => process[key]);
 * const even = (n) => n % 2 === 0 ? n : null;
 *
 * Either.try(ioEnv)('arch'); // -> Right(<architecture>)
 * Either.try(even)(2);     // -> Right(2)
 * Either.try(ioEnv)('foo');  // -> Left(null)
 * Either.try(even)(1);     // -> Left(null)
 * Either.try(null)();    // -> Left(Error)
 */
Either.try = a => (...v) => {
  try {
    return Either.from(a.run ? a.run(...v) : a(...v));
  } catch (exc) {
    return Left(exc);
  }
};

/**
 * Test if the instance is a Either.Right or a Either.Left
 * @method isRight
 * @memberof module:data.Either
 * @instance
 * @return {Boolean} True for Either.Right
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right(1);
 * const l = Either.Left(null);
 *
 * r.isRight(); // -> true
 * l.isRight(); // -> false
 */
Either.fn.isRight = function() {
  return this.caseOf({
    Left: () => false,
    Right: () => true
  });
};

/**
 * Concatenates a Either.Right with another. Concatenation with Either.Left will
 * result in Either.Left. Please note, that the inner values have to be part of a
 * Semigroup as well for concatenation to succeed
 * @method concat
 * @memberof module:data.Either
 * @instance
 * @param {Right|Left} a The Either instance to concatenate with
 * @return {Right|Left} A new Either
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right('r');
 * const l = Either.Left('l');
 *
 * r.concat(Either.Right('b')); // -> Right('rb')
 * r.concat(Either.Left('b'));  // -> Left('b')
 * l.concat(Either.Right('b')); // -> Left('l')
 * l.concat(Either.Left('b'));  // -> Left('l')
 */
Either.fn.concat = function(a) {
  if (Either.is(a)) {
    return this.caseOf({
      Left: () => this,
      Right: v => (a.isRight() ? Right(v.concat(a.value)) : a)
    });
  }
  throw `Either::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
};

/**
 * Maps a function over the inner value and wraps the result in a new Either. Does
 * not map the function over a Either.Left
 * @method map
 * @memberof module:data.Either
 * @instance
 * @param {Function} f The function to map
 * @return {Left|Right} A new Either.Right or the instance for Either.Left
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right('r');
 * const l = Either.Left('l');
 *
 * const upperCase = (v) => v.toUpperCase();
 *
 * r.map(upperCase); // -> Right('R')
 * l.map(upperCase); // -> Left('l')
 */
Either.fn.map = function(f) {
  return this.caseOf({
    Left: () => this,
    Right: v => Either.from(f(v))
  });
};

/**
 * Flattens a nested Either.Right one level
 * @method flat
 * @memberof module:data.Either
 * @instance
 * @return {Left|Right} A flat Either.Right
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right(Either.Right('r'));
 * const l = Either.Left('l');
 *
 * r.flat(); // -> Right('r')
 * l.flat(); // -> Left('l')
 */
Either.fn.flat = function() {
  return this.caseOf({
    Left: () => this,
    Right: v => v
  });
};

/**
 * Maps a Either returning function over a Either.Right and flattens the result
 * @method flatMap
 * @memberof module:data.Either
 * @instance
 * @param {Function} f A Either returning function to map
 * @return {Left|Right} A new Either
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r1 = Either.Right(2);
 * const r2 = Either.Right(1);
 * const l = Either.Left('ignored');
 *
 * const even = (n) => n % 2 === 0 ? Either.Right(`even ${n}`) : Either.Left('not even')
 *
 * r1.flatMap(even); // -> Right('even 2')
 * r2.flatMap(even); // -> Left('not even')
 * l.flatMap(even);  // -> Left('ignored')
 */
Either.fn.flatMap = function(f) {
  return this.caseOf({
    Left: () => this,
    Right: v => f(v)
  });
};

/**
 * Extracts the value from a Either.Right or Either.Left
 * @method extract
 * @memberof module:data.Either
 * @instance
 * @return {any} The current value
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * Either.Right('a right').extract(); // -> 'a right'
 * Either.Left('a left').extract();   // -> 'a left'
 */
Either.fn.extract = function() {
  return this.value;
};

/**
 * If given a function that takes a Either and returns a value, returns a Either
 * @method extend
 * @memberof module:data.Either
 * @instance
 * @param {Function} f A function taking a Either.Right or Either.Left
 * @return {Left|Right} A new Either
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right('a right');
 * const l = Either.Left('a left');
 *
 * r.extend(({value}) => /right/.test(value)); // -> Right(true)
 * l.extend(({value}) => /right/.test(value)); // -> Left(false)
 */
Either.fn.extend = function(f) {
  return this.caseOf({
    Left: () => this,
    Right: () => Either.from(f(this))
  });
};

/**
 * Applies a function in a Either.Right to a value in another Either.Right
 * @method ap
 * @memberof module:data.Either
 * @instance
 * @param {Left|Right} a The Either that holds the value
 * @return {Left|Right} Either which contains the result of applying the function
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right(1);
 * const l = Either.Left('ignored');
 *
 * const mInc = Either.Right((n) => n + 1);
 *
 * mInc.ap(r); // -> Right(2)
 * mInc.ap(l); // -> Left('ignored')
 */
Either.fn.ap = function(a) {
  return this.caseOf({
    Left: () => this,
    Right: f => a.map(f)
  });
};

/**
 * Maps a function over the value in a Left
 * @method mapLeft
 * @memberof module:data.Either
 * @instance
 * @param {Function} f The function to map
 * @return {Left|Right} A new Either
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const l = Either.Left(null);
 *
 * const noValueErr = a => a === null || a === undefined ? 'NoValue' : a;
 *
 * l.mapLeft(noValueErr);  // -> Left('NoValue')
 */
Either.fn.mapLeft = function(f) {
  return this.caseOf({
    Left: a => Left(f(a)),
    Right: () => this
  });
};

/**
 * Bifunctor interface, maps either of two functions over the value inside a Either
 * @method biMap
 * @memberof module:data.Either
 * @instance
 * @param {Function} f Function to map if the structure is a Either.Left
 * @param {Function} g Function to map if the structure is a Either.Right
 * @return {Left|Right} Either with the result of applying either of the functions
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right('a');
 * const l = Either.Left(null);
 *
 * const upperCase = (v) => v.toUpperCase();
 * const defaultChar = () => 'X';
 *
 * r.biMap(defaultChar, upperCase); // -> Right('A')
 * l.biMap(defaultChar, upperCase); // -> Right('X')
 */
Either.fn.biMap = function(f, g) {
  return this.caseOf({
    Left: v => Either.from(f(v)),
    Right: v => Either.from(g(v))
  });
};

/**
 * Works much like the Array.reduce method. If given a function and an initial
 * value, returns the initial value for a Either.Left and calls the function with
 * the initial value and the current value of a Either.Right
 * @method reduce
 * @memberof module:data.Either
 * @instance
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} Either the seed value or whatever the reducer function returned
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right('world');
 * const l = Either.Left(null);
 *
 * const reducer = (a, b) => a.concat(b);
 *
 * r.reduce(reducer, 'hello'); // -> 'helloworld'
 * l.reduce(reducer, 'hello'); // -> 'hello'
 */
Either.fn.reduce = function(f, x) {
  return this.caseOf({
    Left: () => x,
    Right: v => f(x, v)
  });
};

/**
 * Takes a function with signature (Applicable f) => a -> f a and an Applicative
 * constructor and traverses the Either into the applicative
 * @method traverse
 * @memberof module:data.Either
 * @instance
 * @param {Function} f Function to traverse with
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Either wrapped in the applicative
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right(1);
 * const l = Either.Left(0);
 *
 * const fn = (n) => [n];
 *
 * r.traverse(fn, Array); // -> [Right(1)]
 * l.traverse(fn, Array); // -> [Left(0)]
 */
Either.fn.traverse = function(f, A) {
  return this.caseOf({
    Left: () => A.of(this),
    Right: v => f(v).map(Either.from)
  });
};

/**
 * Sequences a Either into another applicative Type
 * @method sequence
 * @memberof module:data.Either
 * @instance
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Either wrapped in the applicative
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right([1]);
 * const l = Either.Left([0]);
 *
 * r.sequence(Array); // -> [Right(1)]
 * l.sequence(Array); // -> [Left(0)]
 */
Either.fn.sequence = function(A) {
  return this.traverse(v => v, A);
};

/**
 * Swaps the disjunction of a Either, meaning a Either.Left becomes a Either.Right
 * and a Either.Right becomes a Either.Left
 * @method swap
 * @memberof module:data.Either
 * @instance
 * @return {Left|Right} A new Either
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right(1);
 * const l = Either.Left(1);
 *
 * r.swap(); // -> Left(1);
 * l.swap(); // -> Right(1)
 */
Either.fn.swap = function() {
  return this.caseOf({
    Left: Right,
    Right: Left
  });
};

/**
 * Alt implementation, allows to swap a Either.Left
 * @method alt
 * @memberof module:data.Either
 * @instance
 * @param {Left|Right} a The alternative Either
 * @return {Left|Right} Choosen alternative
 *
 * @example
 * const {Either} = require('futils').data;
 *
 * const r = Either.Right(1);
 * const l = Either.Left(1);
 *
 * r.alt(Either.Right(2)); // -> Right(1)
 * r.alt(Either.Left(0));  // -> Right(1)
 * l.alt(Either.Right(2)); // -> Right(2)
 * l.alt(Either.Left(0));  // -> Left(0)
 */
Either.fn.alt = function(a) {
  return this.caseOf({
    Left: () => a,
    Right: () => this
  });
};

// --- Either Transformer
/**
 * EitherT tranformer factory
 * @method T
 * @since 3.2.0
 * @static
 * @memberof module:data.Either
 * @param {Monad} F The monad to transform
 * @return {EitherT} A EitherT over F
 * @see module:data.Either.EitherT
 */
Either.T = F => {
  /**
   * EitherT tranformer monad
   * @class module:data.Either.EitherT
   * @since 3.2.0
   * @param {Monad} F The monad to transform
   * @return {EitherT} A EitherT transformer
   *
   * @example
   * const {Either, IO} = require('futils').data;
   * const {id, curry} = require('futils').lambda;
   *
   * const IOE = Either.T(IO);
   *
   * const queryOne = curry((s, root) => IOE.
   *   from(root.querySelector(s)).
   *   mapLeft(() => `No element matches ${s}`));
   *
   * const showConsole = val => IO(() => {
   *   if (val instanceof Error) {
   *     console.error(val);
   *   } else {
   *     console.log(val);
   *   }
   * });
   *
   * queryOne('#app', document).
   *   flatMap(queryOne('.my-class')).
   *   map(n => n.textContent).
   *   caseOf({
   *     Left: msg => new Error(msg),
   *     Right: id
   *   }).
   *   flatMap(showConsole).
   *   run();
   */
  const EitherT = Type('EitherT', ['stack']).deriving(Show);

  EitherT.Right = a => EitherT(F.of(Right(a)));
  EitherT.Left = a => EitherT(F.of(Left(a)));

  /**
   * Lifts a value into a EitherT Right
   * @method of
   * @static
   * @since 3.2.0
   * @class module:data.Either.EitherT
   * @param {any} a The value to lift
   * @return {EitherT} The value wrapped in a EitherT Right
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * Either.T(IO).of(1); // -> EitherT(IO(Right(1)))
   */
  EitherT.of = a => EitherT(F.of(Either.of(a)));

  /**
   * Lifts a value into a EitherT. Similiar to EitherT.of, but if the value is either
   * null, undefined or some error it returns a EitherT Left
   * @method from
   * @static
   * @since 3.2.0
   * @class module:data.Either.EitherT
   * @param {any} a The value to lift
   * @return {EitherT} The value wrapped in an EitherT Left or EitherT Right
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * Either.T(IO).from(1);  // -> EitherT(IO(Right(1)))
   * Either.T(IO).from(null); // -> EitherT(IO(Left(null)))
   */
  EitherT.from = a => EitherT(F.of(Either.from(a)));

  /**
   * Monoid implementation for EitherT. Returns a EitherT Left with a value of null
   * @method empty
   * @static
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @return {EitherT} A EitherT Left
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * Either.T(IO).empty(); // -> EitherT(IO(Left(null)))
   */
  EitherT.empty = () => EitherT(F.of(Either.empty()));

  /**
   * Plus implementation for EitherT. Returns a EitherT Left with a value of null
   * @method zero
   * @static
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @return {EitherT} A EitherT Left
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * Either.T(IO).zero(); // -> EitherT(IO(Left(null)))
   */
  EitherT.zero = () => EitherT(F.of(Either.zero()));

  /**
   * Concatenates a EitherT Right with another. Concatenation with EitherT Left will
   * result in EitherT Left. Please note, that the inner values have to be part of a
   * Semigroup as well for concatenation to succeed
   * @method concat
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @param {EitherT} A The EitherT to concat
   * @return {EitherT} Both instances concatenated
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const ns = IOE.of('r');
   * const ms = IOE.of('x');
   *
   * ns.concat(ms);       // -> EitherT(IO(Right('rx')))
   * ns.concat(IOE.empty());  // -> EitherT(IO(Left(null)))
   * IOE.empty().concat(ns);  // -> EitherT(IO(Left(null)))
   */
  EitherT.fn.concat = function(A) {
    return EitherT(
      this.stack.flatMap(g => {
        return A.stack.map(h => g.concat(h));
      })
    );
  };

  /**
   * Maps a function over the inner value and wraps the result in a new EitherT. Does
   * not map the function over a EitherT Left
   * @method map
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @param {Function} f The function to map
   * @return {EitherT} A new EitherT Right or the instance for EitherT Left
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r = IOE.of('r');
   *
   * const upperCase = (v) => v.toUpperCase();
   *
   * r.map(upperCase); // -> EitherT(IO(Right('R')))
   */
  EitherT.fn.map = function(f) {
    return EitherT(this.stack.map(g => g.map(f)));
  };

  /**
   * Applies a function in a EitherT Right to a value in another EitherT Right
   * @method ap
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @param {EitherT} a The EitherT that holds the value
   * @return {EitherT} EitherT which contains the result of applying the function
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r = IOE.of(1);
   *
   * const mInc = IOE.of((n) => n + 1);
   *
   * mInc.ap(r); // -> EitherT(IO(Right(2)))
   */
  EitherT.fn.ap = function(A) {
    return EitherT(
      this.stack.flatMap(g => {
        return A.stack.map(h => g.ap(h));
      })
    );
  };

  /**
   * Flattens a nested EitherT Right one level
   * @method flat
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @return {EitherT} A flat EitherT Right
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r = IOE.of(IOE.of('r'));
   *
   * r.flat(); // -> EitherT(IO(Right('r')))
   */
  EitherT.fn.flat = function() {
    return EitherT(this.stack.flatMap(g => g.value.f));
  };

  /**
   * Maps a EitherT returning function over a EitherT Right and flattens the result
   * @method flatMap
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @param {Function} f A EitherT returning function to map
   * @return {EitherT} A new EitherT
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r1 = IOE.of(2);
   *
   * const even = (n) => n % 2 === 0 ? IOE.of(`even ${n}`) : IOE.Left('not even')
   *
   * r1.flatMap(even); // -> EitherT(IO(Right('even 2')))
   */
  EitherT.fn.flatMap = function(f) {
    return EitherT(
      this.stack.flatMap(g => {
        return g.map(f).value.f;
      })
    );
  };

  /**
   * Bifunctor interface, maps either of two functions over the value inside a EitherT
   * @method biMap
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @param {Function} f Function to map if the structure is a EitherT Left
   * @param {Function} g Function to map if the structure is a EitherT Right
   * @return {EitherT} EitherT with the result of applying either of the functions
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r = IOE.of('a');
   * const l = IOE.zero();
   *
   * const upperCase = (v) => v.toUpperCase();
   * const defaultChar = () => 'X';
   *
   * r.biMap(defaultChar, upperCase); // -> EitherT(IO(Right('A')))
   * l.biMap(defaultChar, upperCase); // -> EitherT(IO(Right('X')))
   */
  EitherT.fn.biMap = function(f, g) {
    return EitherT(this.stack.map(h => h.biMap(f, g)));
  };

  /**
   * Maps a function over the value in a EitherT Left
   * @method mapLeft
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @param {Function} f The function to map
   * @return {EitherT} A new EitherT
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const l = IOE.zero();
   *
   * const noValueErr = a => a === null || a === undefined ? 'NoValue' : a;
   *
   * l.mapLeft(noValueErr);  // -> EitherT(IO(Left('NoValue')))
   */
  EitherT.fn.mapLeft = function(f) {
    return EitherT(this.stack.map(g => g.mapLeft(f)));
  };

  /**
   * Alt implementation, allows to swap a EitherT Left
   * @method alt
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @param {EitherT} a The alternative EitherT
   * @return {EitherT} Choosen alternative
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r = IOE.of(1);
   * const l = IOE.zero();
   *
   * r.alt(IOE.of(2)); // -> EitherT(IO(Right(1)))
   * r.alt(IOE.zero());  // -> EitherT(IO(Right(1)))
   * l.alt(IOE.of(2)); // -> EitherT(IO(Right(2)))
   * l.alt(IOE.zero());  // -> EitherT(IO(Left(null)))
   */
  EitherT.fn.alt = function(A) {
    return EitherT(
      this.stack.flatMap(g => {
        return A.stack.map(h => g.alt(h));
      })
    );
  };

  /**
   * Swaps the disjunction of a EitherT, meaning a EitherT Left becomes a EitherT Right
   * and a EitherT Right becomes a EitherT Left
   * @method swap
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @return {EitherT} A new EitherT
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r = IOE.of(1);
   * const l = IOE.zero();
   *
   * r.swap(); // -> EitherT(IO(Left(1)))
   * l.swap(); // -> EitherT(IO(Right(1)))
   */
  EitherT.fn.swap = function() {
    return EitherT(this.stack.map(g => g.swap()));
  };

  /**
   * Pattern matches against an EitherT. The result of the match is lifted
   * into the wrapping monad before returned
   * @method caseOf
   * @since 3.2.0
   * @memberof module:data.Either.EitherT
   * @instance
   * @return {EitherT} A new EitherT
   *
   * @example
   * const {Either, IO} = require('futils').data;
   *
   * const IOE = Either.T(IO);
   *
   * const r = IOE.of(1);
   * const l = IOE.zero();
   *
   * const pattern = {
   *   Left: () => 'Missing a value',
   *   Right: n => `The given number is ${n}`
   * };
   *
   * r.caseOf(pattern); // -> IO('The given number is 1')
   * l.caseOf(pattern); // -> IO('Missing a value')
   */
  EitherT.fn.caseOf = function(p) {
    return this.stack.flatMap(g => {
      return g.caseOf({
        Left: v => F.of(p.Left(v)),
        Right: v => F.of(p.Right(v))
      });
    });
  };

  return EitherT;
};
