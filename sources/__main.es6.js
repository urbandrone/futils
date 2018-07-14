import * as arity from './arity';
import * as type from './types';
import * as trampolines from './trampolines';
import * as combinators from './combinators';
import * as decorators from './decorators';
import * as operators from './operators';
import * as lenses from './lenses';
import * as Transducers from './transducers';
import * as monoids from './monoids';
import NewType from './newtypes';
import monads from './monads';
import * as maths from './maths';


export const trampoline = trampolines.trampoline;
export const suspend = trampolines.suspend;

export const aritize = arity.aritize;
export const monadic = arity.monadic;
export const dyadic = arity.dyadic;
export const triadic = arity.triadic;
export const tetradic = arity.tetradic;

export const add = maths.add;
export const subtract = maths.subtract;
export const multiply = maths.multiply;
export const divide = maths.divide;
export const modulo = maths.modulo;
export const gcd = maths.gcd;
export const lcm = maths.lcm;
export const sum = maths.sum;
export const product = maths.product;

export const isNil = type.isNil;
export const isAny = type.isAny;
export const isNull = type.isNull;
export const isVoid = type.isVoid;
export const isString = type.isString;
export const isNumber = type.isNumber;
export const isInt = type.isInt;
export const isFloat = type.isFloat;
export const isBool = type.isBool;
export const isTrue = type.isTrue;
export const isFalse = type.isFalse;
export const isFunc = type.isFunc;
export const isObject = type.isObject;
export const isMap = type.isMap;
export const isSet = type.isSet;
export const isWeakMap = type.isWeakMap;
export const isWeakSet = type.isWeakSet;
export const isArray = type.isArray;
export const isDate = type.isDate;
export const isRegex = type.isRegex;
export const isNode = type.isNode;
export const isNodeList = type.isNodeList;
export const isPromise = type.isPromise;
export const isIterator = type.isIterator;
export const isIterable = type.isIterable;
export const isGenerator = type.isGenerator;
export const isArrayOf = type.isArrayOf;
export const isObjectOf = type.isObjectOf;
export const isSetoid = type.isSetoid;
export const isFunctor = type.isFunctor;
export const isApply = type.isApply;
export const isPointed = type.isPointed;
export const isFoldable = type.isFoldable;
export const isBifunctor = type.isBifunctor;
export const isSemigroup = type.isSemigroup;
export const isMonad = type.isMonad;
export const isApplicative = type.isApplicative;

export const id = combinators.id;
export const getter = combinators.getter;
export const tap = combinators.tap;
export const pipe = combinators.pipe;
export const compose = combinators.compose;
export const and = combinators.and;
export const or = combinators.or;
export const by = combinators.by;
export const fixed = combinators.fixed;

export const once = decorators.once;
export const not = decorators.not;
export const flip = decorators.flip;
export const curry = decorators.curry;
export const curryRight = decorators.curryRight;
export const partial = decorators.partial;
export const partialRight = decorators.partialRight;
export const given = decorators.given;
export const ifElse = decorators.ifElse;
export const memoize = decorators.memoize;

export const Type = NewType;

export const Additive = monoids.Additive;
export const Char = monoids.Char;
export const Multiple = monoids.Multiple;
export const Min = monoids.Min;
export const Max = monoids.Max;
export const Dict = monoids.Dict;
export const Fn = monoids.Fn;
export const All = monoids.All;
export const Any = monoids.Any;

export const Identity = monads.Identity;
export const IO = monads.IO;
export const Maybe = monads.Maybe;
export const None = monads.None;
export const Some = monads.Some;
export const Either = monads.Either;
export const Left = monads.Left;
export const Right = monads.Right;
export const List = monads.List;
export const State = monads.State;
export const Task = monads.Task;
export const liftA2 = monads.liftA2;
export const liftA3 = monads.liftA3;
export const liftA4 = monads.liftA4;
export const liftA5 = monads.liftA5;

export const lens = lenses.lens;
export const makeLenses = lenses.makeLenses;
export const mappedLens = lenses.mappedLens;
export const view = lenses.view;
export const over = lenses.over;
export const set = lenses.set;

export const call = operators.call;
export const field = operators.field;
export const prop = operators.prop;
export const has = operators.has;
export const merge = operators.merge;
export const immutable = operators.immutable;
export const instance = operators.instance;
export const first = operators.first;
export const last = operators.last;
export const head = operators.head;
export const tail = operators.tail;
export const initial = operators.initial;
export const rest = operators.rest;
export const nth = operators.nth;
export const join = operators.join;
export const split = operators.split;
export const toUpper = operators.toUpper;
export const toLower = operators.toLower;
export const trim = operators.trim;
export const reverse = operators.reverse;
export const replace = operators.replace;
export const unique = operators.unique;
export const union = operators.union;
export const map = operators.map;
export const flatten = operators.flatten;
export const flatMap = operators.flatMap;
export const assoc = operators.assoc;
export const equals = operators.equals;
export const ap = operators.ap;
export const intersect = operators.intersect;
export const differ = operators.differ;
export const pairs = operators.pairs;
export const fold = operators.fold;
export const foldRight = operators.foldRight;
export const unfold = operators.unfold;
export const concat = operators.concat;
export const range = operators.range;
export const filter = operators.filter;
export const keep = operators.keep;
export const drop = operators.drop;
export const dropWhile = operators.dropWhile;
export const take = operators.take;
export const takeWhile = operators.takeWhile;
export const find = operators.find;
export const findRight = operators.findRight;
export const foldMap = operators.foldMap;
export const zip = operators.zip;
export const traverse = operators.traverse;
export const sequence = operators.sequence;

export const transducers = Transducers;