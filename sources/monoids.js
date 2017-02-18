/*
The MIT License (MIT)
Copyright (c) 2016/2017 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



/**
 * Implementation of different monoids
 * @module futils/monoids
 */

const VAL = Symbol('MonoidalValue');
const id = (a) => a || null;


/**
 * Creates new instances of the Unit monoid. In vanilla JavaScript, the only
 *     members of the Unit category are null and undefined.
 * @class module:futils/monoids.Unit
 * @member Unit
 * @version 2.4.0
 *
 * @example
 * const {Unit, id} = require('futils');
 *
 * let one = Unit.of(1) or new Unit(1)
 * one.fold(id); // -> null
 * one.concat(one).fold(id); // -> null
 * Unit.empty().concat(one).fold(id); // -> null
 * one.concat(Unit.empty()).fold(id); // -> null
 */
export class Unit {
    constructor() { this[VAL] = null; }
    static empty() { return new Unit(); }
    static of() { return new Unit(); }
    concat(monoid) { return monoid; }
    fold(f) { return f(); }
}

/**
 * Creates new instances of the Additive monoid. In vanilla JavaScript, values
 *     which are members of the Additive category are numbers and strings.
 * @class module:futils/monoids.Additive
 * @member Additive
 * @version 2.2.0
 *
 * @example
 * const {Additive, id} = require('futils');
 *
 * let one = Additive.of(1) or new Additive(1)
 * one.fold(id); // -> 1
 * one.concat(one).fold(id); // -> 2
 * Additive.empty().concat(one).fold(id); // -> 1
 * one.concat(Additive.empty()).fold(id); // -> 1
 */
export class Additive {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new Additive(0); }
    static of(a) { return new Additive(a); }
    concat(monoid) { return new Additive(this[VAL] + monoid[VAL]); }
    fold(f) { return f(this[VAL]); }
}

/**
 * Creates new instances of the Multiple monoid. In vanilla JavaScript, values
 *     which are members of the Multiple category are numbers.
 * @class module:futils/monoids.Multiple
 * @member Multiple
 * @version 2.2.0
 *
 * @example
 * const {Multiple, id} = require('futils');
 *
 * let two = Multiple.of(2) or new Multiple(2)
 * two.fold(id); // -> 2
 * two.concat(two).fold(id); // -> 4
 * Multiple.empty().concat(two).fold(id); // -> 2
 * two.concat(Multiple.empty()).fold(id); // -> 2
 */
export class Multiple {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new Multiple(1); }
    static of(a) { return new Multiple(a); }
    concat(monoid) { return new Multiple(this[VAL] * monoid[VAL]); }
    fold(f) { return f(this[VAL]); }
}

/**
 * Creates new instances of the All monoid. In vanilla JavaScript, values
 *     which are members of the All category are booleans.
 * @class module:futils/monoids.All
 * @member All
 * @version 2.2.0
 *
 * @example
 * const {All, id} = require('futils');
 *
 * let truth = All.of(true) or new All(true)
 * truth.fold(id); // -> true
 * truth.concat(truth).fold(id); // -> true
 * All.empty().concat(truth).fold(id); // -> true
 * truth.concat(All.empty()).fold(id); // -> true
 */
export class All {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new All(true); }
    static of(a) { return new All(a); }
    concat(monoid) { return new All(this[VAL] && monoid[VAL]); }
    fold(f) { return f(this[VAL]); }
}

/**
 * Creates new instances of the Any monoid. In vanilla JavaScript, values
 *     which are members of the Any category are booleans.
 * @class module:futils/monoids.Any
 * @member Any
 * @version 2.2.0
 *
 * @example
 * const {Any, id} = require('futils');
 *
 * let truth = Any.of(true) or new Any(true)
 * truth.fold(id); // -> true
 * truth.concat(truth).fold(id); // -> true
 * Any.empty().concat(truth).fold(id); // -> true
 * truth.concat(Any.empty()).fold(id); // -> true
 */
export class Any {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new Any(false); }
    static of(a) { return new Any(a); }
    concat(monoid) { return new Any(this[VAL] || monoid[VAL]); }
    fold(f) { return f(this[VAL]); }
}

/**
 * Creates new instances of the Fn monoid. In vanilla JavaScript, values
 *     which are members of the Fn category are functions.
 * @class module:futils/monoids.Fn
 * @member Fn
 * @version 2.2.0
 *
 * @example
 * const {Fn, id} = require('futils');
 *
 * let mf = Fn.of(2) or new Fn(() => 2)
 * mf.fold(id); // -> 2
 * mf.concat(Fn.of((n) => n * n)).fold(id); // -> 4
 * Fn.empty().concat(mf).fold(id); // -> 2
 * mf.concat(Fn.empty()).fold(id); // -> 2
 */
export class Fn {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new Fn(id); }
    static of(a) { return new Fn(() => a); }
    concat(monoid) { return new Fn((a) => monoid[VAL](this[VAL](a))); }
    fold(f, a) { return f(this[VAL](a)); }
}

/**
 * Creates new instances of the Min monoid. In vanilla JavaScript, values
 *     which are members of the Min category are numbers.
 * @class module:futils/monoids.Min
 * @member Min
 * @version 2.2.0
 *
 * @example
 * const {Min, id} = require('futils');
 *
 * let two = Min.of(2) or new Min(2)
 * two.fold(id); // -> 2
 * two.concat(Min.of(1)).fold(id); // -> 1
 * Min.empty().concat(two).fold(id); // -> 2
 * two.concat(Min.empty()).fold(id); // -> 2
 */
export class Min {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new Min(Infinity); }
    static of(a) { return new Min(a); }
    concat(monoid) { return new Min(Math.min(this[VAL], monoid[VAL])); }
    fold(f) { return f(this[VAL]); }
}

/**
 * Creates new instances of the Max monoid. In vanilla JavaScript, values
 *     which are members of the Max category are numbers. 
 * @class module:futils/monoids.Max
 * @member Max
 * @version 2.2.0
 *
 * @example
 * const {Max, id} = require('futils');
 *
 * let one = Max.of(1) or new Max(1)
 * one.fold(id); // -> 1
 * one.concat(Max.of(2)).fold(id); // -> 2
 * Max.empty().concat(one).fold(id); // -> 1
 * one.concat(Max.empty()).fold(id); // -> 1
 */
export class Max {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new Max(-Infinity); }
    static of(a) { return new Max(a); }
    concat(monoid) { return new Max(Math.max(this[VAL], monoid[VAL])); }
    fold(f) { return f(this[VAL]); }
}

/**
 * Creates new instances of the Dict monoid. In vanilla JavaScript, values
 *     which are members of the Dict category are objects and prototypes.
 * @class module:futils/monoids.Dict
 * @member Dict
 * @version 2.2.0
 *
 * @example
 * const {Dict, id} = require('futils');
 *
 * let one = Dict.of({price: 1}) or new Dict({price: 1})
 * one.fold(id); // -> {price: 1}
 * one.concat(Dict.of({count: 10})).fold(id); // -> {price: 1, count: 10}
 * Dict.empty().concat(one).fold(id); // -> {price: 1}
 * one.concat(Dict.empty()).fold(id); // -> {price: 1}
 */
export class Dict {
    constructor(a) {
        this[VAL] = a;
    }
    static empty() { return new Dict({}); }
    static of(a) { return new Dict(a); }
    concat(monoid) { return new Dict(Object.assign({}, this[VAL], monoid[VAL])); }
    fold(f) { return f(this[VAL]); }
}