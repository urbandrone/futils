// The MIT License (MIT)
// Copyright (c) 2016 – 2019 David Hofmann <the.urban.drone@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { TYPE } from '../core/constants';

const prefix = m => `fantasy-land/${m}`;

const compatBySchema = schema => type => {
  return Object.keys(schema.fn).reduce(
    (T, m) => {
      T.prototype[prefix(m)] = function(...args) {
        return schema.fn[m](this, ...args);
      };
      return T;
    },
    Object.keys(schema.static).reduce((T, m) => {
      T[prefix(m)] = function(...args) {
        return schema.static[m](T, ...args);
      };
      return T;
    }, type)
  );
};

const compatWrap = outer => {
  return function fantasize(a, fn, ...args) {
    return outer(a, fn, ...args);
  };
};

// ====== MONOIDS ======
export const compatMonoid = compatBySchema({
  static: {
    of: (T, a) => T.of(a),
    empty: T => T.empty()
  },
  fn: {
    concat: (self, A) => self.concat(A)
  }
});

// ====== DATA STRUCTURES ======
export const compatId = compatBySchema({
  static: {
    of: (T, a) => T.of(a)
  },
  fn: {
    concat: (self, A) => self.concat(A),
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f),
    extract: self => self.extract(),
    extend: (self, f) => self.extend(f),
    reduce: (self, f, x) => self.reduce(f, x),
    traverse: (self, T, f) => self.traverse(f, T),
    sequence: (self, T) => self.sequence(T)
  }
});

export const compatMaybe = compatBySchema({
  static: {
    of: (T, a) => T.of(a),
    empty: T => T.empty(),
    zero: T => T.zero()
  },
  fn: {
    concat: (self, A) => self.concat(A),
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f),
    extract: self => self.extract(),
    extend: (self, f) => self.extend(f),
    bimap: (self, f, g) => self.biMap(f, g),
    alt: (self, A) => self.alt(A),
    reduce: (self, f, x) => self.reduce(f, x),
    traverse: (self, T, f) => self.traverse(f, T),
    sequence: (self, T) => self.sequence(T)
  }
});

export const compatEither = compatBySchema({
  static: {
    of: (T, a) => T.of(a),
    empty: T => T.empty(),
    zero: T => T.zero()
  },
  fn: {
    concat: (self, A) => self.concat(A),
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f),
    extract: self => self.extract(),
    extend: (self, f) => self.extend(f),
    bimap: (self, f, g) => self.biMap(f, g),
    alt: (self, A) => self.alt(A),
    reduce: (self, f, x) => self.reduce(f, x),
    traverse: (self, T, f) => self.traverse(f, T),
    sequence: (self, T) => self.sequence(T)
  }
});

export const compatIO = compatBySchema({
  static: {
    of: (T, a) => T.of(a),
    empty: T => T.empty()
  },
  fn: {
    concat: (self, A) => self.concat(A),
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f),
    promap: (self, f, g) => self.proMap(f, g),
    contramap: (self, f) => self.contraMap(f)
  }
});

export const compatList = compatBySchema({
  static: {
    of: (T, a) => T.of(a),
    empty: T => T.empty(),
    zero: T => T.zero()
  },
  fn: {
    concat: (self, A) => self.concat(A),
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f),
    extract: self => self.extract(),
    extend: (self, f) => self.extend(f),
    bimap: (self, f, g) => self.biMap(f, g),
    alt: (self, A) => self.alt(A),
    reduce: (self, f, x) => self.reduce(f, x),
    traverse: (self, T, f) => self.traverse(f, T),
    sequence: (self, T) => self.sequence(T),
    filter: (self, f) => self.filter(f)
  }
});

export const compatState = compatBySchema({
  static: {
    of: (T, a) => T.of(a)
  },
  fn: {
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f)
  }
});

export const compatPair = compatBySchema({
  static: {},
  fn: {
    map: (self, f) => self.map(f)
  }
});

export const compatTask = compatBySchema({
  static: {
    of: (T, a) => T.of(a),
    empty: () => T.empty()
  },
  fn: {
    concat: (self, A) => self.concat(A),
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f),
    bimap: (self, f, g) => self.biMap(f, g)
  }
});

export const compatFree = compatBySchema({
  static: {
    of: (T, a) => T.of(a)
  },
  fn: {
    map: (self, f) => self.map(f),
    ap: (self, A) => A.ap(self),
    chain: (self, f) => self.flatMap(f)
  }
});

// ====== OPERATIONS ======
export const compatAlt = compatWrap((t, f, a) => {
  return t && t['fantasy-land/alt']
    ? t['fantasy-land/alt'](a)
    : f.call(t, a);
});

export const compatAp = compatWrap((t, f, a) => {
  return t && t['fantasy-land/ap'] && t[TYPE] === void 0
    ? a['fantasy-land/ap'](t)
    : typeof f === 'function'
    ? f.call(t, a)
    : a.reduce((b, x) => b.concat(t.reduce((c, f) => f(c), x)), []);
});

export const compatBiMap = compatWrap((t, f, g, h) => {
  return t && t['fantasy-land/bimap']
    ? t['fantasy-land/bimap'](g, h)
    : f.call(t, g, h);
});

export const compatConcat = compatWrap((t, f, a) => {
  return t && t['fantasy-land/concat']
    ? t['fantasy-land/concat'](a)
    : f.call(t, a);
});

export const compatEquals = compatWrap((t, f, a) => {
  return t && t['fantasy-land/equals']
    ? t['fantasy-land/equals'](a)
    : f.call(t, a);
});

export const compatFilter = compatWrap((t, f, g) => {
  return t && t['fantasy-land/filter']
    ? t['fantasy-land/filter'](g)
    : f.call(t, g);
});

export const compatChain = compatWrap((t, f, g) => {
  return t && t['fantasy-land/chain']
    ? t['fantasy-land/chain'](g)
    : typeof f === 'function'
    ? f.call(t, g)
    : t.reduce((x, y) => x.concat(g(y)), []);
});

export const compatFold = compatWrap((t, f, T) => {
  return t && t['fantasy-land/reduce'] && T['fantasy-land/empty']
    ? t['fantasy-land/reduce'](
        (x, y) => x['fantasy-land/concat'](T['fantasy-land/of'](y)),
        T['fantasy-land/empty']()
      )
    : typeof f === 'function'
    ? f.call(t, T)
    : t.reduce((x, y) => x.concat(T.of(y)), T.empty());
});

export const compatFoldMap = compatWrap((t, f, g) => {
  return t && t['fantasy-land/reduce']
    ? t['fantasy-land/reduce'](
        (x, y) =>
          x === null
            ? g(y)
            : (x['fantasy-land/concat'] || x.concat).call(x, g(y)),
        null
      )
    : typeof f === 'function'
    ? f.call(t, g)
    : t.reduce((x, y) => (x === null ? g(y) : x.concat(g(y))), null);
});

export const compatMap = compatWrap((t, f, g) => {
  return t && t['fantasy-land/map']
    ? t['fantasy-land/map'](g)
    : typeof f === 'function'
    ? f.call(t, g)
    : g(t);
});

export const compatProMap = compatWrap((t, f, g, h) => {
  return t && t['fantasy-land/promap']
    ? t['fantasy-land/promap'](g, h)
    : f.call(t, g, h);
});

export const compatReduce = compatWrap((t, f, g, x) => {
  return t && t['fantasy-land/reduce']
    ? t['fantasy-land/reduce'](g, x)
    : typeof f === 'function'
    ? f.call(t, g, x)
    : g(t, x);
});

export const compatSequence = compatWrap((t, f, T) => {
  return t && t['fantasy-land/sequence']
    ? t['fantasy-land/sequence'](T)
    : typeof f === 'function'
    ? f.call(t, T)
    : t.reduce((x, y) => x.concat(y), T.of([]));
});

export const compatTraverse = compatWrap((t, f, g, T) => {
  return t && t['fantasy-land/traverse'] && t[TYPE] === void 0
    ? t['fantasy-land/traverse'](T, g)
    : typeof f === 'function'
    ? f.call(t, g, T)
    : t.reduce(
        (x, y) =>
          g(y)
            .map(a => b => b.concat(a))
            .ap(x),
        T.of([])
      );
});
