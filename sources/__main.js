import arity from './arity';
import type from './types';
import trampolines from './trampolines';
import combinators from './combinators';
import decorators from './decorators';
import operators from './operators';
import lenses from './lenses';
import transducers from './transducers';
import monads from './monads';
import monoids from './monoids';
import UnionType from './uniontypes';

export const trampoline = trampolines.trampoline;
export const suspend = trampolines.suspend;

export const aritize = arity.aritize;
export const monadic = arity.monadic;
export const dyadic = arity.dyadic;
export const triadic = arity.triadic;
export const tetradic = arity.tetradic;

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
export const isArray = type.isArray;
export const isDate = type.isDate;
export const isRegex = type.isRegex;
export const isNode = type.isNode;
export const isNodeList = type.isNodeList;
export const isPromise = type.isPromise;
export const isIterator = type.isIterator;
export const isIterable = type.isIterable;
export const isArrayOf = type.isArrayOf;
export const isObjectOf = type.isObjectOf;
export const isSetoid = type.isSetoid;
export const isFunctor = type.isFunctor;
export const isApply = type.isApply;
export const isFoldable = type.isFoldable;
export const isBifunctor = type.isBifunctor;
export const isSemigroup = type.isSemigroup;
export const isMonoid = type.isMonoid;
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
export const memoize = decorators.memoize;

export const Additive = monoids.Additive;
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
export const unfold = operators.unfold;
export const concat = operators.concat;
export const range = operators.range;
export const filter = operators.filter;
export const keep = operators.keep;
export const drop = operators.drop;
export const dropWhile = operators.dropWhile;
export const take = operators.take;
export const takeWhile = operators.takeWhile;
export const partition = operators.partition;
export const partitionWith = operators.partitionWith;
export const find = operators.find;
export const findRight = operators.findRight;
export const zip = operators.zip;

export const Type = UnionType;
export const transducers = transducers;

export default {
    trampoline,
    suspend,

    aritize,
    monadic,
    dyadic,
    triadic,
    tetradic,
    
    isNil,
    isAny,
    isNull,
    isVoid,
    isString,
    isNumber,
    isInt,
    isFloat,
    isBool,
    isTrue,
    isFalse,
    isFunc,
    isObject,
    isArray,
    isDate,
    isRegex,
    isNode,
    isNodeList,
    isPromise,
    isIterator,
    isIterable,
    isArrayOf,
    isObjectOf,
    isSetoid,
    isFunctor,
    isApply,
    isFoldable,
    isBifunctor,
    isSemigroup,
    isMonoid,
    isMonad,
    isApplicative,

    id,
    getter,
    tap,
    pipe,
    compose,
    and,
    or,
    by,
    fixed,

    once,
    not,
    flip,
    curry,
    curryRight,
    partial,
    partialRight,
    given,
    memoize,

    Type,

    Additive,
    Multiple,
    Min,
    Max,
    Dict,
    Fn,
    All,
    Any,

    Identity,
    IO,
    Maybe,
    None,
    Some,
    Either,
    Left,
    Right,
    State,
    Task,
    liftA2,
    liftA3,
    liftA4,
    liftA5,

    lens,
    makeLenses,
    mappedLens,
    view,
    over,
    set,

    call,
    field,
    has,
    merge,
    immutable,
    instance,
    first,
    last,
    head,
    tail,
    initial,
    rest,
    unique,
    union,
    map,
    flatten,
    flatMap,
    assoc,
    equals,
    ap,
    intersect,
    differ,
    pairs,
    fold,
    unfold,
    concat,
    range,
    filter,
    keep,
    drop,
    dropWhile,
    take,
    takeWhile,
    partition,
    partitionWith,
    find,
    findRight,
    zip,

    transducers
};