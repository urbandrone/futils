/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';
import {UnionType} from '../adt';
import {showT} from '../generics/Show';
import {compareEq} from '../generics/Eq';




/*
 * @module data
 */



/**
 * The List data type. List is implemented as a linked
 * list, where each part has a head and a tail. The end of the list is marked
 * with Nil
 * @class module:data.List
 * @extends module:generics.Show
 * @static
 * @version 3.0.0
 *
 * @example
 * const {List} = require('futils').data;
 * const {Cons, Nil} = List;
 * 
 * List.Cons(1, List.Nil());               // -> Cons(1, Nil)
 * Cons(1, Nil());                         // -> Cons(1, Nil)
 *
 * List.Cons(1, List.Cons(2, List.Nil())); // -> Cons(1, Cons(2, Nil))
 * Cons(1, Cons(2, Nil()));                // -> Cons(1, Cons(2, Nil))
 */
export const List = UnionType('List', {Cons: ['head', 'tail'], Nil: []});

const {Cons, Nil} = List;
List.fn.head = null;
List.fn.tail = Nil();



/* Utilities */
const BREAK = Symbol('BREAK');

const foldl = (f, a, ls) => {
    let r = a, s = ls;
    while (!Nil.is(s)) {
        r = f(r, s.head, s);
        s = s.tail;
    }
    return r;
}

const breakableFoldl = (f, a, ls) => {
    let r = a, s = ls;
    while (!Nil.is(s)) {
        let [cmd, _r] = f(r, s.head, s);
        r = _r;
        if (cmd === BREAK) { break; }
        s = s.tail;
    }
    return r;
}

const foldr = (f, a, ls) => {
    return foldl(f, a, foldl((x,y) => Cons(y, x), Nil(), ls));
}


/**
 * Lifts one or more values into a List
 * @method of
 * @static
 * @memberof module:data.List
 * @param {...any} a The value or values to lift
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(1); // -> Cons(1, Nil)
 */
List.of = (a) => Cons(a, Nil());
/**
 * Monoid implementation for List. Returns a List without values
 * @method empty
 * @static
 * @memberof module:data.List
 * @return {List} A List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.empty(); // -> Nil
 */
List.empty = Nil;
/**
 * Lifts a value into a List. Somewhat similiar to List.of, but only accepts a
 * single value and puts it in a array if it is not an array itself. Useful to
 * transform array-like objects on the fly
 * @method from
 * @static
 * @memberof module:data.List
 * @param {any} a The value to lift
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.from(1);    // -> Cons(1, Nil)
 * List.from([1]);  // -> Cons(1, Nil)
 * List.from(null); // -> Nil
 */
List.from = (a) => a == null ? Nil() : Array.isArray(a) ? List.fromArray(a) : Cons(a, Nil());
/**
 * A natural transformation from an array into a List
 * @method fromArray
 * @static
 * @memberof module:data.List
 * @param {Array} a The array to transform
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.fromArray([1, 2, 3]); // -> Cons(1, Cons(2, Cons(3, Nil)))
 */
List.fromArray = (a) => a.reduceRight((x, y) => Cons(y, x), Nil());
/**
 * A natural transformation from an Id to a List
 * @method fromId
 * @static
 * @memberof module:data.List
 * @param {Id} a The Id to transform
 * @return {List} A new List
 *
 * @example
 * const {List, Id} = require('futils').data;
 *
 * const id = Id('a value');
 *
 * List.fromId(id); // -> Cons('a value', Nil)
 */
List.fromId = (a) => List.from(a.value);
/**
 * A natural transformation from a Maybe.Some or Maybe.None into a List
 * @method fromMaybe
 * @static
 * @memberof module:data.List
 * @param {Some|None} a The Maybe to transform
 * @return {List} A List with the value of a Maybe.Some and an empty List for Maybe.None
 *
 * @example
 * const {List, Maybe} = require('futils').data;
 *
 * const some = Maybe.Some('a value');
 * const none = Maybe.None();
 *
 * List.fromMaybe(some); // -> Cons('a value', Nil)
 * List.fromMaybe(none); // -> Nil
 */
List.fromMaybe = (a) => a.isSome() ? List.from(a.value) : List.empty();
/**
 * A natural transformation from an Either.Left or Either.Right into a List
 * @method fromEither
 * @static
 * @memberof module:data.List
 * @param {Left|Right} a The Either to transform
 * @return {List} List with value(s) for Either.Right, empty List for Either.Left
 *
 * @example
 * const {List, Either} = require('futils').data;
 *
 * const l = Either.Left('a left');
 * const r = Either.Right('a right');
 *
 * List.fromEither(l); // -> Nil
 * List.fromEither(r); // -> Cons('a right', Nil)
 */
List.fromEither = (a) => a.isRight() ? List.from(a.value) : List.empty();



List.fn[Symbol.iterator] = function () {
    return this.caseOf({
        Nil: () => ({done: true, next() { return void 0; }}),
        Cons: () => this.toArray()[Symbol.iterator]()
    });
}
List.fn.toString = function () {
    return this.caseOf({
        Nil: () => 'Nil',
        Cons: () => this.reduceRight((ls, a) => `Cons(${showT(a)}, ${ls})`, 'Nil')
    });
}

/**
 * A natural transformation from a List into an array
 * @method toArray
 * @memberof module:data.List
 * @instance
 * @return {Array} Array of values
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(2).cons(1).toArray(); // -> [1, 2]
 */
List.fn.toArray = function () {
    return this.reduce((a, x) => a.concat(x), []);
}
/**
 * Concatenates a List with another List
 * @method concat
 * @memberof module:data.List
 * @instance
 * @param {List} a The List instance to concatenate with
 * @return {List} A List containing all values from both Lists
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(1);
 *
 * ls.concat(List.of(2)); // -> Cons(1, Cons(2, Nil))
 */
List.fn.concat = function (a) {
    if (List.is(a)) {
        return this.caseOf({
            Nil: () => this,
            Cons: () => Nil.is(a) ? a : this.reduceRight((ls, x) => Cons(x, ls), a)
        });
    }
    throw `List::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over each value in the List
 * @method map
 * @memberof module:data.List
 * @instance
 * @param {Function} f The function to map
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(1);
 * 
 * const inc = (n) => n + 1;
 *
 * ls.map(inc); // -> Cons(2, Nil)
 */
List.fn.map = function (f) {
    return this.reduceRight((ls, x) => Cons(f(x), ls), Nil());
}
/**
 * Flattens a nested List one level
 * @method flat
 * @memberof module:data.List
 * @instance
 * @return {List} A List flattened
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(List.of(1));
 *
 * ls.flat(); // -> Cons(1, Nil)
 */
List.fn.flat = function () {
    return this.reduceRight((ls, x) => {
        return x.reduceRight((ks, y) => Cons(y, ks), ls);
    }, Nil());
}
/**
 * Maps a List returning function over each value in the List and flattens the result
 * @method flatMap
 * @memberof module:data.List
 * @instance
 * @param {Function} f A List returning function to map
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(1);
 *
 * const inc = (n) => List.of(n + 1);
 *
 * ls.flatMap(inc); // -> Cons(2, Nil)
 */
List.fn.flatMap = function (f) {
    return this.map(f).flat();
}
/**
 * Extracts the head value from a List. For Nil instances, it returns null
 * @method extract
 * @memberof module:data.List
 * @instance
 * @return {any|null} The head element
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(1).extract();   // -> 1
 * List.empty().extract(); // -> null
 */
List.fn.extract = function () {
    return this.head;
}
/**
 * If given a function that takes a List and returns a value, returns a List
 * @method extend
 * @memberof module:data.List
 * @instance
 * @param {Function} f A function taking a List
 * @return {List} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(3).cons(2).cons(1);
 *
 * ls.extend(({head, tail}) => head + tail.head || 0); // -> Cons(6, Cons(5, Cons(3, Nil)))
 */
List.fn.extend = function (f) {
    return this.caseOf({
        Nil: () => this,
        Cons: () => this.reduceRight((x, _, y) => Cons(f(y), x), Nil())
    });
}
/**
 * Applies a function in a List to the values in another List
 * @method ap
 * @memberof module:data.List
 * @instance
 * @param {List} a The List that holds the values
 * @return {List} List which contains the results of applying the function
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(1);
 *
 * const mInc = List.of((n) => n + 1);
 *
 * mInc.ap(ls); // -> Cons(2, Nil)
 */
List.fn.ap = function (a) {
    return this.caseOf({
        Nil: () => this,
        Cons: (h) => a.map(h)
    });
}
/**
 * Works like the Array.reduce method. If given a function and an initial value,
 * reduces the values in the List to a final value
 * @method reduce
 * @memberof module:data.List
 * @instance
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} All values reduced into the seed
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(1);
 *
 * const reducer = (a, b) => a + b;
 *
 * ls.reduce(reducer, 1); // -> 2
 */
List.fn.reduce = function (f, x) {
    return this.caseOf({
        Nil: () => x,
        Cons: () => foldl(f, x, this)
    });
}
/**
 * Works like the Array.reduceRight method. If given a function and an initial
 * value, reduces the values in the List to a final value
 * @method reduceRight
 * @memberof module:data.List
 * @instance
 * @param {Function} f The function to reduce with
 * @param {any} x The seed value to reduce into
 * @return {any} All values reduced into the seed
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(1);
 *
 * const reducer = (a, b) => a + b;
 *
 * ls.reduceRight(reducer, 1); // -> 2
 */
List.fn.reduceRight = function (f, x) {
    return this.caseOf({
        Nil: () => x,
        Cons: () => foldr(f, x, this)
    })
}
/**
 * Takes a function with signature (Applicable f) => a -> f a and an Applicative
 * constructor and traverses the List into the applicative
 * @method traverse
 * @memberof data/List.List
 * @param {Function} f Function to traverse with
 * @param {Applicative} A A constructor with of and ap methods
 * @return {Applicative} A List wrapped in the applicative
 *
 * @example
 * const {List, Maybe} = require('futils').data;
 * 
 * const ls = List.of(1)
 *
 * const fn = (n) => Maybe.of(n);
 *
 * ls.traverse(fn, Maybe); // -> Some(Cons(1, Nil))
 */
List.fn.traverse = function (f, A) {
    return this.caseOf({
        Nil: () => A.of(this),
        Cons: () => this.reduceRight(
            (xs, x) => xs.flatMap(a => f(x).map(b => Cons(b, a))),
            A.of(Nil())
        )
    });
}
/**
 * Sequences a List into another applicative Type
 * @method sequence
 * @memberof module:data.List
 * @instance
 * @param {Applicative} A A constructor with of and ap methods
 * @return {Applicative} A List wrapped in the applicative
 *
 * @example
 * const {List, Maybe} = require('futils').data;
 *
 * const ls = List.of(Maybe.of(1));
 *
 * ls.sequence(Maybe); // -> Some(Cons(1, Nil))
 */
List.fn.sequence = function (A) {
    return this.traverse(x => x, A);
}
/**
 * Alternative implementation, allows to swap a empty List
 * @method alt
 * @memberof data/List.List
 * @param {List} a The alternative List
 * @return {List} Choosen alternative
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const ls = List.of(1);
 * const ns = List.empty();
 *
 * ls.alt(List.of(4));    // -> Cons(1, Nil)
 * ls.alt(List.empty());  // -> Cons(1, Nil)
 * ns.alt(List.of(4));    // -> Cons(4, Nil)
 * ns.alt(List.empty());  // -> Nil
 */
List.fn.alt = function (a) {
    return this.caseOf({
        Nil: () => a,
        Cons: () => this
    });
}
/**
 * Takes a function which returns a Monoid and folds the List with it into a Monoid
 * @method foldMap
 * @memberof module:data.List
 * @instance
 * @param {Function} f The Monoid returning function
 * @return {Monoid} A Monoid of the type the function returns
 *
 * @example
 * const {List} = require('futils').data;
 * const {Sum} = require('futils').monoid;
 *
 * const fn = (n) => Sum.of(n);
 *
 * List.of(1).cons(2).foldMap(fn); // -> Sum(3)
 */
List.fn.foldMap = function (f) {
    return this.reduceRight((m, x) => m == null ? f(x) : m.concat(f(x)), null);
}
/**
 * Takes a Monoid and folds the List into it
 * @method fold
 * @memberof module:data.List
 * @instance
 * @param {Monoid} A The Monoid type constructor
 * @return {Monoid} A Monoid of the type the function returns
 *
 * @example
 * const {List} = require('futils').data;
 * const {Sum} = require('futils').monoid;
 *
 * List.of(1).cons(2).fold(Sum); // -> Sum(3)
 */
List.fn.fold = function (A) {
    return this.foldMap(A.of);
}
/**
 * Takes a function which returns a Boolean and filters the List with it. Works
 * much like the Array.filter function
 * @method filter
 * @memberof module:data.List
 * @instance
 * @param {Function} f The function to filter with
 * @return {Cons|Nil} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const even = (n) => n % 2 === 0;
 *
 * List.of(3).cons(2).cons(1).filter(even); // -> Cons(2, Nil)
 */
List.fn.filter = function (f) {
    return this.reduceRight((ls, x) => !!f(x) ? Cons(x, ls) : ls, Nil());
}
/**
 * Takes a value and puts it between each entry in the List
 * @method intersperse
 * @memberof module:data.List
 * @instance
 * @param {any} a The value to put in between
 * @return {Cons|Nil} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(2).cons(1).intersperse(0.5); // -> Cons(1, Cons(0.5, Cons(2, Nil)))
 */
List.fn.intersperse = function (a) {
    return this.reduceRight((ls, x) => Nil.is(ls) ? Cons(x, ls) : Cons(x, Cons(a, ls)), Nil());
}
/**
 * Sets the given value to the head position of a List, making the current List
 * the new tail
 * @method cons
 * @memberof module:data.List
 * @instance
 * @param {any} a The value to set
 * @return {Cons} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(2).cons(1); // -> Cons(1, Cons(2, Nil));
 */
List.fn.cons = function (a) {
    return Cons(a, this);
}
/**
 * Sets a given value to the tail position of a List
 * @method snoc
 * @memberof module:data.List
 * @instance
 * @param {any} a The value to set
 * @return {Cons} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(1).snoc(2); // -> Cons(1, Cons(2, Nil))
 */
List.fn.snoc = function (a) {
    return this.reduceRight((ls, x) => Cons(x, ls), Cons(a, Nil()));
}
/**
 * If given a number N, returns the first N items from the List
 * @method take
 * @memberof module:data.List
 * @instance
 * @param {Number} n Amount of elements to take from the beginning of the List
 * @return {Cons|Nil} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(2).cons(1).cons(0).take(2); // -> Cons(0, Cons(1, Nil))
 */
List.fn.take = function (n) {
    return this.caseOf({
        Nil: () => this,
        Cons: (h, t) => n > 0 ? Cons(h, t.take(n - 1)) : Nil()
    });
}
/**
 * If given a number N, drops the first N items from the List
 * @method drop
 * @memberof module:data.List
 * @instance
 * @param {Number} n Amount of elements to drop from the beginning of the List
 * @return {Cons|Nil} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(2).cons(1).cons(0).drop(2); // -> Cons(2, Nil)
 */
List.fn.drop = function (n) {
    return this.caseOf({
        Nil: () => this,
        Cons: (_, t) => n > 1 ? t.drop(n - 1) : t
    });
}
/**
 * Given a predicate function, returns the first element for which the
 * predicate returns true. If no element passes the predicate, null is returned
 * @method find
 * @memberof module:data.List
 * @instance
 * @param {Function} f The predicate function
 * @return {any|null} The first match or null
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const even = (n) => n % 2 === 0;
 * 
 * List.of(3).cons(2).cons(1).find(even); // -> 2
 */
List.fn.find = function (f) {
    return this.caseOf({
        Nil: () => null,
        Cons: () => breakableFoldl((x, a) => !!f(a) ? [BREAK, a] : [null, x], null, this)
    });
}
/**
 * Given a predicate function, removes all duplicates from the List for which the
 * predicate function returns true
 * @method nubBy
 * @memberof module:data.List
 * @instance
 * @param {Function} f The predicate function
 * @return {Cons|Nil} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * const eq = (a, b) => a === b;
 *
 * List.of(3).cons(2).cons(2).cons(1).nubBy(eq); // -> Cons(1, Cons(2, Cons(3, Nil)))
 */
List.fn.nubBy = function (f) {
    return this.reduce((x, a) => {
        return x.find(b => f(a, b)) != null ? x : x.snoc(a);
    }, Nil());
}
/**
 * Removes all duplicates from the List. Uses deep equality for comparison
 * @method nub
 * @memberof module:data.List
 * @instance
 * @return {Cons|Nil} A new List
 *
 * @example
 * const {List} = require('futils').data;
 *
 * List.of(3).cons(2).cons(2).cons(1).nub(); // -> Cons(1, Cons(2, Cons(3, Nil)))
 */
List.fn.nub = function () {
    return this.nubBy(compareEq);
}