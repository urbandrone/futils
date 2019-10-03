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
 * The Maybe union type and its subtypes Some and None.
 * Usually they are used whenever an operation might result in a null value
 * @class module:data.Maybe
 * @extends module:generics.Show
 * @extends module:generics.Eq
 * @extends module:generics.Ord
 * @static
 * @version 3.0.0
 *
 * @example
 * const {Maybe} = require('futils').data;
 * const {Some, None} = Maybe;
 *
 * Maybe.Some(1); // -> Some(1)
 * Some(1);     // -> Some(1)
 *
 * Maybe.None();  // -> None
 * None();    // -> None
 *
 * Maybe.Some(1).value; // -> 1
 * Maybe.None().value;  // -> null
 */
export const Maybe = UnionType('Maybe', {
  Some: ['value'],
  None: []
}).deriving(Show, Eq, Ord);

const { Some, None } = Maybe;

Maybe.fn.value = null;

/**
 * Lifts a value into a Maybe.Some
 * @method of
 * @static
 * @memberof module:data.Maybe
 * @param {any} a The value to lift
 * @return {Some} The value wrapped in a Maybe.Some
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * Maybe.of(1); // -> Some(1)
 */
Maybe.of = Some;

/**
 * Monoid implementation for Maybe. Returns a Maybe.None
 * @method empty
 * @static
 * @memberof module:data.Maybe
 * @return {None} A Maybe.None
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * Maybe.empty(); // -> None
 */
Maybe.empty = None;

/**
 * Plus implementation for Maybe. Returns a Maybe.None
 * @method zero
 * @static
 * @since 3.2.0
 * @memberof module:data.Maybe
 * @return {None} A Maybe.None
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * Maybe.zero(); // -> None
 */
Maybe.zero = None;

/**
 * Lifts a value into a Maybe. Similiar to Maybe.of, but if the value is either
 * null or undefined it returns Maybe.None
 * @method from
 * @static
 * @memberof module:data.Maybe
 * @param {any} a The value to lift
 * @return {Some|None} Maybe.Some if the value is not null or undefined, Maybe.None otherwise
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * Maybe.from(1); // -> Some(1)
 * Maybe.from(null); // -> None
 */
Maybe.from = a => (a == null ? None() : Some(a));

/**
 * A natural transformation from a Either.Left or Either.Right into a Maybe
 * @method fromEither
 * @static
 * @memberof module:data.Maybe
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
Maybe.fromEither = a => (a.isRight() ? Some(a.value) : None());

/**
 * A natural transformation from an Id into a Maybe
 * @method fromId
 * @static
 * @memberof module:data.Maybe
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
Maybe.fromId = a => Maybe.from(a.value);

/**
 * A natural transformation from a List into a Maybe. Please note that this
 * transformation looses data, because only the first element of the list is
 * taken. If the first element is null or undefined, a Maybe.None is returned
 * @method fromList
 * @static
 * @memberof module:data.Maybe
 * @param {List} a The List to transform
 * @return {Some|None} Maybe.Some if the first element is not null or undefined
 *
 * @example
 * const {Maybe, List} = require('futils').data;
 *
 * const ls = List.of(2).cons(1);
 * const ks = List.Nil();
 *
 * Maybe.fromList(ls); // -> Some(1)
 * Maybe.fromList(ks); // -> None
 */
Maybe.fromList = a =>
  a.caseOf({
    Nil: Maybe.empty,
    Cons: h => Maybe.from(h)
  });

/**
 * Test if the instance is a Maybe.Some or a Maybe.None
 * @method isSome
 * @memberof module:data.Maybe
 * @instance
 * @return {Boolean} True if called on a Maybe.Some
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * some.isSome(); // -> true
 * none.isSome(); // -> false
 */
Maybe.fn.isSome = function() {
  return this.caseOf({
    None: () => false,
    Some: () => true
  });
};
/**
 * Concatenates a Maybe.Some with another. concatenation with Maybe.None will
 * result in Maybe.None. Please note, that the inner values have to be part of a
 * Semigroup as well for concatenation to succeed
 * @method concat
 * @memberof module:data.Maybe
 * @instance
 * @param {Some|None} a The Maybe instance to concatenate with
 * @return {Some|None} A new Maybe
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some('a');
 * const none = Maybe.None();
 *
 * some.concat(Maybe.Some('b')); // -> Some('ab')
 * some.concat(Maybe.None());  // -> None
 * none.concat(Maybe.Some('b')); // -> None
 * none.concat(Maybe.None());  // -> None
 */
Maybe.fn.concat = function(a) {
  if (Maybe.is(a)) {
    return this.caseOf({
      None: () => this,
      Some: v => (a.isSome() ? Some(v.concat(a.value)) : a)
    });
  }
  throw `Maybe::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
};
/**
 * Maps a function over the inner value and wraps the result in a new Maybe. Does
 * not map the function over a Maybe.None
 * @method map
 * @memberof module:data.Maybe
 * @instance
 * @param {Function} f The function to map
 * @return {Some|None} A new Maybe.Some or the instance for Maybe.None
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some('a');
 * const none = Maybe.None();
 *
 * const upperCase = (v) => v.toUpperCase();
 *
 * some.map(upperCase); // -> Some('A')
 * none.map(upperCase); // -> None
 */
Maybe.fn.map = function(f) {
  return this.caseOf({
    None: () => this,
    Some: v => Maybe.from(f(v))
  });
};
/**
 * Flattens a nested Maybe.Some one level
 * @method flat
 * @memberof module:data.Maybe
 * @instance
 * @return {Some|None} A flat Maybe.Some
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some(Maybe.Some(1));
 * const none = Maybe.None();
 *
 * some.flat(); // -> Some(1)
 * none.flat(); // -> None
 */
Maybe.fn.flat = function() {
  return this.caseOf({
    None: () => this,
    Some: v => v
  });
};
/**
 * Maps a Maybe returning function over a Maybe.Some and flattens the result
 * @method flatMap
 * @memberof module:data.Maybe
 * @instance
 * @param {Function} f A Maybe returning function to map
 * @return {Some|None} A new Maybe
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some(2);
 * const none = Maybe.None();
 *
 * const even = (n) => n % 2 === 0 ? Maybe.Some(n) : Maybe.None()
 *
 * some.flatMap(even); // -> Some(2)
 * none.flatMap(even); // -> None
 */
Maybe.fn.flatMap = function(f) {
  return this.caseOf({
    None: () => this,
    Some: v => f(v)
  });
};
/**
 * Extracts the value from a Maybe.Some or Maybe.None. For Maybe.None returns null
 * @method extract
 * @memberof module:data.Maybe
 * @instance
 * @deprecated This method is unsafe and will be removed
 * @return {any|null} The value
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * Maybe.Some(1).extract(); // -> 1
 * Maybe.None().extract();  // -> null
 */
Maybe.fn.extract = function() {
  return this.value;
};

/**
 * If given a function that takes a Maybe and returns a value, returns a Maybe
 * @method extend
 * @memberof module:data.Maybe
 * @instance
 * @param {Function} f A function taking a Maybe.Some or Maybe.None
 * @return {None|Some} A new Maybe
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some('a some');
 * const none = Maybe.None();
 *
 * some.extend(({value}) => /some/.test(value)); // -> Some(true)
 * none.extend(({value}) => /some/.test(value)); // -> None
 */
Maybe.fn.extend = function(f) {
  return this.caseOf({
    None: () => this,
    Some: () => Maybe.from(f(this))
  });
};

/**
 * Applies a function in a Maybe.Some to a value in another Maybe.Some
 * @method ap
 * @memberof module:data.Maybe
 * @instance
 * @param {Some|None} a The Maybe that holds the value
 * @return {Some|None} Maybe which contains the result of applying the function
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * const mInc = Maybe.Some((n) => n + 1);
 *
 * mInc.ap(some); // -> Some(2)
 * mInc.ap(none); // -> None
 */
Maybe.fn.ap = function(a) {
  return this.caseOf({
    None: () => this,
    Some: f => a.map(f)
  });
};

/**
 * Bifunctor interface, maps either of two functions over the value inside a Maybe
 * @method biMap
 * @memberof module:data.Maybe
 * @instance
 * @param {Function} f Function to map if the value is a Maybe.None
 * @param {Function} g Function to map if the value is a Maybe.Some
 * @return {Some|None} Maybe with the result of applying either of the functions
 *
 * @example
 * const {Maybe} = require('futils').data;
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
Maybe.fn.biMap = function(f, g) {
  return this.caseOf({
    None: () => Maybe.from(f(null)),
    Some: v => Maybe.from(g(v))
  });
};

/**
 * Works much like the Array.reduce method. If given a function and an initial
 * value, returns the initial value for a Maybe.None and calls the function with
 * the initial value and the current value of a Maybe.Some
 * @method reduce
 * @memberof module:data.Maybe
 * @instance
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} Either the seed value or whatever the reducer function returned
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some('world');
 * const none = Maybe.None();
 *
 * const reducer = (a, b) => a.concat(b);
 *
 * some.reduce(reducer, 'hello'); // -> 'helloworld'
 * none.reduce(reducer, 'hello'); // -> 'hello'
 */
Maybe.fn.reduce = function(f, x) {
  return this.caseOf({
    None: () => x,
    Some: v => f(x, v)
  });
};

/**
 * Takes a function with signature (Applicable f) => a -> f a and an Applicative
 * constructor and traverses the Maybe into the Applicative
 * @method traverse
 * @memberof module:data.Maybe
 * @instance
 * @param {Function} f Function to traverse with
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Maybe wrapped in the Applicative
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * const fn = (n) => [n];
 *
 * some.traverse(fn, Array); // -> [Some(1)]
 * none.traverse(fn, Array); // -> [None]
 */
Maybe.fn.traverse = function(f, A) {
  return this.caseOf({
    None: () => A.of(this),
    Some: v => f(v).map(Maybe.from)
  });
};

/**
 * Sequences a Maybe into another Applicative type
 * @method sequence
 * @memberof module:data.Maybe
 * @instance
 * @param {Applicative|Array} A A constructor with of and ap methods
 * @return {Applicative|Array} A Maybe wrapped in the Applicative
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some([1]);
 * const none = Maybe.None();
 *
 * some.sequence(Array); // -> [Some(1)]
 * none.sequence(Array); // -> [None]
 */
Maybe.fn.sequence = function(A) {
  return this.traverse(v => v, A);
};

/**
 * Alt implementation, allows to swap a Maybe.None
 * @method alt
 * @memberof module:data.Maybe
 * @instance
 * @param {Some|None} a The alternative Maybe
 * @return {Some|None} Choosen alternative
 *
 * @example
 * const {Maybe} = require('futils').data;
 *
 * const some = Maybe.Some(1);
 * const none = Maybe.None();
 *
 * some.alt(Maybe.Some(2)); // -> Some(1)
 * some.alt(Maybe.None());  // -> Some(1)
 * none.alt(Maybe.Some(2)); // -> Some(2)
 * none.alt(Maybe.None());  // -> None
 */

Maybe.fn.alt = function(a) {
  return this.caseOf({
    None: () => a,
    Some: () => this
  });
};

// Maybe Transformer
/**
 * MaybeT tranformer factory
 * @method T
 * @static
 * @memberof module:data.Maybe
 * @param {Monad} F The monad to transform
 * @return {MaybeT} A MaybeT over F
 * @see module:data.Maybe.MaybeT
 */
Maybe.T = F => {
  /**
   * MaybeT tranformer monad
   * @class module:data.Maybe.MaybeT
   * @since 3.2.0
   * @param {Monad} F The monad to transform
   * @return {MaybeT} A MaybeT transformer
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const {id, curry} = require('futils').lambda;
   * const IOM = Maybe.T(IO);
   * const queryOne = curry((s, root) => IOM.
   *    from(root.querySelector(s));
   *
   * const showConsole = val => IO(() => {
   *   console.log(val);
   * });
   *
   * queryOne('#app', document).
   *   flatMap(queryOne('.my-class')).
   *   map(n => n.textContent).
   *   caseOf({
   *     None: () => 'Element .my-class not found in #app',
   *     Some: id
   *   }).
   *   flatMap(showConsole).
   *   run();
   */

  const MaybeT = Type('MaybeT', ['stack']).deriving(Show);

  MaybeT.None = () => MaybeT(F.of(Maybe.None()));
  MaybeT.Some = a => MaybeT(F.of(Maybe.Some(a)));

  /**
   * Lifts a value into a MaybeT Some
   * @method of
   * @static
   * @since 3.2.0
   * @class module:data.Maybe.MaybeT
   * @param {any} a The value to lift
   * @return {MaybeT} The value wrapped in a MaybeT Some
   * @example
   * const {Maybe, IO} = require('futils').data;
   * Maybe.T(IO).of(1); // -> MaybeT(IO(Some(1)))
   */

  MaybeT.of = a => MaybeT(F.of(Maybe.of(a)));

  /**
   * Lifts a value into a MaybeT. Similiar to MaybeT.of,
   * but if the value is either null or undefined it
   * returns a MaybeT None
   * @method from
   * @static
   * @since 3.2.0
   * @class module:data.Maybe.MaybeT
   * @param {any} a The value to lift
   * @return {MaybeT} The value wrapped in an MaybeT None or MaybeT Some
   * @example
   * const {Maybe, IO} = require('futils').data;
   * Maybe.T(IO).from(1);  // -> MaybeT(IO(Some(1)))
   * Maybe.T(IO).from(null); // -> MaybeT(IO(None()))
   */
  MaybeT.from = a => MaybeT(F.of(Maybe.from(a)));

  /**
   * Monoid implementation for MaybeT. Returns a MaybeT
   * None with a value of null
   * @method empty
   * @static
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @return {MaybeT} A MaybeT None
   * @example
   * const {Maybe, IO} = require('futils').data;
   * Maybe.T(IO).empty(); // -> MaybeT(IO(None())
   */
  MaybeT.empty = () => MaybeT(F.of(Maybe.empty()));

  /**
   * Plus implementation for MaybeT. Returns a MaybeT None with a value of null
   * @method zero
   * @static
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @return {MaybeT} A MaybeT None
   * @example
   * const {Maybe, IO} = require('futils').data;
   * Maybe.T(IO).zero(); // -> MaybeT(IO(None())
   */
  MaybeT.zero = () => MaybeT(F.of(Maybe.zero()));

  /**
   * Concatenates a MaybeT Some with another. Concatenation with
   * MaybeT None will result in MaybeT None. Please note, that
   * the inner values have to be part of a Semigroup as well for
   * concatenation to succeed
   * @method concat
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @param {MaybeT} A The MaybeT to concat
   * @return {MaybeT} Both instances concatenated
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const IOM = Maybe.T(IO);
   * const ns = IOM.of('r');
   * const ms = IOM.of('x');
   * ns.concat(ms);       // -> MaybeT(IO(Some('rx')))
   * ns.concat(IOM.empty());  // -> MaybeT(IO(None()))
   * IOM.empty().concat(ns);  // -> MaybeT(IO(None())
   */
  MaybeT.fn.concat = function(A) {
    return MaybeT(
      this.stack.flatMap(g => {
        return A.stack.map(h => g.concat(h));
      })
    );
  };

  /**
   * Maps a function over the inner value and wraps the
   * result in a new MaybeT. Does not map the function
   * over a MaybeT None
   * @method map
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @instance
   * @param {Function} f The function to map
   * @return {MaybeT} A new MaybeT Some or the instance for MaybeT None
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const IOM = Maybe.T(IO);
   * const s = IOM.of('r');
   * const upperCase = (v) => v.toUpperCase();
   * s.map(upperCase); // -> MaybeT(IO(Some('R'))
   */
  MaybeT.fn.map = function(f) {
    return MaybeT(this.stack.map(g => g.map(f)));
  };

  /**
   * Applies a function in a MaybeT Some to a value in another MaybeT Some
   * @method ap
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @instance
   * @param {MaybeT} a The MaybeT that holds the value
   * @return {MaybeT} MaybeT which contains the result of applying the function
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const IOM = Maybe.T(IO);
   * const r = IOM.of(1);
   * const mInc = IOM.of((n) => n + 1);
   * mInc.ap(r); // -> MaybeT(IO(Some(2))
   */
  MaybeT.fn.ap = function(A) {
    return MaybeT(
      this.stack.flatMap(g => {
        return A.stack.map(h => g.ap(h));
      })
    );
  };

  /**
   * Flattens a nested MaybeT Some one level
   * @method flat
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @instance
   * @return {MaybeT} A flat MaybeT Some
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const IOM = Maybe.T(IO);
   * const r = IOM.of(IOM.of('r'));
   * r.flat(); // -> MaybeT(IO(Some('r'))
   */
  MaybeT.fn.flat = function() {
    return MaybeT(
      this.stack.flatMap(g => {
        return !g.isSome() ? F.of(g) : g.extract().f;
      })
    );
  };

  /**
   * Maps a MaybeT returning function over a MaybeT Some and flattens the result
   * @method flatMap
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @instance
   * @param {Function} f A MaybeT returning function to map
   * @return {MaybeT} A new MaybeT
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const IOM = Maybe.T(IO);
   * const r1 = IOM.of(2);
   * const even = (n) => n % 2 === 0 ? IOM.of(`even ${n}`) : IOM.None()
   * r1.flatMap(even); // -> MaybeT(IO(Some('even 2'))
   */
  MaybeT.fn.flatMap = function(f) {
    return MaybeT(
      this.stack.flatMap(g => {
        return !g.isSome() ? F.of(g) : g.map(f).extract().f;
      })
    );
  };

  /**
   * Bifunctor interface, maps either of two functions over the value inside a MaybeT
   * @method biMap
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @instance
   * @param {Function} f Function to map if the structure is a MaybeT None
   * @param {Function} g Function to map if the structure is a MaybeT Some
   * @return {MaybeT} MaybeT with the result of applying either of the functions
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const IOM = Maybe.T(IO);
   * const r = IOM.of('a');
   * const l = IOM.zero();
   * const upperCase = (v) => v.toUpperCase();
   * const defaultChar = () => 'X';
   * r.biMap(defaultChar, upperCase); // -> MaybeT(IO(Some('A')))
   * l.biMap(defaultChar, upperCase); // -> MaybeT(IO(Some('X'))
   */
  MaybeT.fn.biMap = function(f, g) {
    return MaybeT(this.stack.map(h => h.biMap(f, g)));
  };

  /**
   * Alt implementation, allows to swap a MaybeT None
   * @method alt
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @instance
   * @param {MaybeT} a The alternative MaybeT
   * @return {MaybeT} Choosen alternative
   * @example
   * const {Maybe, IO} = require('futils').data;
   * const IOM = Maybe.T(IO);
   * const r = IOM.of(1);
   * const l = IOM.zero();
   * r.alt(IOM.of(2)); // -> MaybeT(IO(Some(1)))
   * r.alt(IOM.zero());  // -> MaybeT(IO(Some(1)))
   * l.alt(IOM.of(2)); // -> MaybeT(IO(Some(2)))
   * l.alt(IOM.zero());  // -> MaybeT(IO(None())
   */
  MaybeT.fn.alt = function(A) {
    return MaybeT(
      this.stack.flatMap(g => {
        return A.stack.map(h => g.alt(h));
      })
    );
  };

  /**
   * Pattern matches against an MaybeT. The result of the match is lifted
   * into the wrapping monad before returned
   * @method caseOf
   * @since 3.2.0
   * @memberof module:data.Maybe.MaybeT
   * @instance
   * @return {MaybeT} A new MaybeT
   * @example
   * const {Maybe, IO} = require('futils').data;
   *
   * const IOM = Maybe.T(IO);
   * const r = IOM.of(1);
   * const l = IOM.zero();
   *
   * const pattern = {
   *     None: () => 'Missing a value',
   *   Some: n => `The given number is ${n}`
   * };
   *
   * r.caseOf(pattern); // -> IO('The given number is 1')
   * l.caseOf(pattern); // -> IO('Missing a value'
   */
  MaybeT.fn.caseOf = function(p) {
    return this.stack.flatMap(g => {
      return g.caseOf({
        None: _ => F.of(p.None()),
        Some: v => F.of(p.Some(v))
      });
    });
  };

  return MaybeT;
};
