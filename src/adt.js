/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {arity} from './core/arity';




/**
 * Allows to create tagged ADT constructors of normal types and union types
 * @module adt
 */

const TYPE = Symbol('@@type');
const VALS = Symbol('@@values');
const TYPE_TAG = Symbol('@@type_tag');



/* Utilities */
const def = (x, f, d) => Object.defineProperty(x, f, {
    enumerable: false,
    writable: false,
    configurable: false,
    value: d
});

const caseOfT = (x, o) => {
    if (typeof o[x[TYPE]] === 'function') {
        return o[x[TYPE]].apply(x, x[VALS].map((v) => x[v]));
    }
    throw `${o[TYPE_TAG]}::caseOf - No pattern matched ${x[TYPE]} in ${Object.keys(o)}`;
}

const initT = (t, f, v, p) => {
    if (f.length === v.length) {
        let o = Object.create(p);
        o.__type__ = o[TYPE] = t;
        o.__values__ = o[VALS] = f;
        return f.reduce((x, y, i) => {
            x[y] = v[i];
            return x;
        }, o);
    }
    throw `${t} awaits ${f.length} arguments but got ${v.length}`;
}

const makeCtor = (t, vs, p) => {
    switch (vs.length) {
        case 0:
            return () => initT(t, vs, [], p);
        default:
            return arity(vs.length, (...xs) => initT(t, vs, xs, p));
    }
}

const deriveT = a => (...Gs) => Gs.reduce((t, g) => g.mixInto(t), a);



/**
 * Allows to create tagged type constructors which can be used without "new"
 * @method Type
 * @version 3.0.0
 * @param {String} type Name of the type
 * @param {Array} vals Names of the values
 * @return {Type} Constructor function of the type
 *
 * @example
 * const {Type} = require('futils/adt');
 *
 * const Point = Type('Point', ['x', 'y']);
 *
 * Point.prototype.move = function (x, y) {
 *     return Point(this.x + x, this.y + y);
 * }
 *
 *
 * const p = Point(100, 200);
 * p.move(50, 100).x; // -> 150
 * Point.is(p); // -> true
 */
export const Type = (type, vals) => {
    const proto = {}
    const ctor = makeCtor(type, null, vals, proto);
    def(ctor, 'is', (x) => { return x && x[TYPE] === type; });
    def(ctor, 'deriving', deriveT(ctor));
    ctor.fn = ctor.prototype = proto;
    ctor.prototype.constructor = ctor;
    return ctor;
}



/**
 * Allows to create tagged sum type constructors which can be used without "new"
 * @method UnionType
 * @version 3.0.0
 * @param {String} type Name of the type
 * @param {Object} defs Names and values of the sum types
 * @return {UnionType} Constructor functions of the sum type
 *
 * @example
 * const {UnionType} = require('futils/adt');
 *
 * const Shape = UnionType('Shape', {
 *     Rect: ['topLeft', 'bottomRight'],
 *     Circle: ['radius', 'center']
 * });
 * 
 * const {Rect, Circle} = Shape;
 * 
 * Shape.prototype.move = function (x, y) {
 *     return this.caseOf({
 *         Rect: (tl, br) => Rect(tl.move(x, y), br.move(x, y)),
 *         Circle: (r, c) => Circle(r, c.move(x, y))
 *     });
 * }
 *
 *
 * const rect = Rect(Point(100, 200), Point(200, 300));
 * rect.move(-50, -50);
 *
 * const line = Circle(50, Point(200, 200));
 * line.move(-50, -50);
 */
export const UnionType = (type, defs) => {
    const union = {[TYPE]: type};
    union.fn = union.prototype = {
        [TYPE_TAG]: type,
        caseOf(o) { return caseOfT(this, o); },
        cata(o) { return caseOfT(this, o); },
    };
    def(union, 'is', (x) => x != null && x[TYPE_TAG] === type);
    def(union, 'deriving', deriveT(union));
    Object.keys(defs).forEach(d => {
        const ctor = makeCtor(d, defs[d], union.prototype);
        def(ctor, 'is', (x) => x != null && x[TYPE] === d);
        union[d] = ctor;
    });
    return union;
}