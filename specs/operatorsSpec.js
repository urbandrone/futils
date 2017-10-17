const _ = require('../futils');
describe('futils/operators module', () => {
    
    it('testing prop :: s -> o -> a', () => {
        expect(_.prop('a', {a: 1})).toBe(1);
        expect(_.prop('a.b', {a: {b: 1}})).toBe(1);
        expect(_.prop('a', new Map([['a', 1]]))).toBe(1);
        expect(_.prop('a.b', new Map([['a', new Map([['b', 1]])]]))).toBe(1);
    });
    
    it('testing field :: s -> o -> a', () => {
        expect(_.field('a', {a: 1})).toBe(1);
        expect(_.field('a.b', {a: {b: 1}})).toBe(1);
        expect(_.field('a', new Map([['a', 1]]))).toBe(1);
        expect(_.field('a.b', new Map([['a', new Map([['b', 1]])]]))).toBe(1);
    });

    it('testing has :: s -> o -> b', () => {
        expect(_.has('a', {a: 1})).toBe(true);
        expect(_.has('b', {a: 1})).toBe(false);
        expect(_.has('a', new Map([['a', 1]]))).toBe(true);
        expect(_.has('b', new Map([['a', 1]]))).toBe(false);
    });

    it('testing assoc :: s -> a -> o -> o', () => {
        let s = {a: 1}; let m = new Map([['a', 1]]);
        expect(_.assoc('b', 2, s).b).toBe(2);
        expect(s.a).toBe(1);
        expect(s.b).toBe(undefined);
        expect(_.assoc('b', 2, m).get('b')).toBe(2);
        expect(m.get('a')).toBe(1);
        expect(m.get('b')).toBe(undefined);
    });

    it('testing call :: s -> o -> a | o', () => {
        expect(_.call('toUpperCase')('s')).toBe('S');
        expect(_.call('split', '.')('a.b')).toEqual(['a', 'b']);
    });

    it('testing merge :: o -> o -> o', () => {
        let o = {a: 1, b: 2};
        expect(_.merge(o, {c: 3}).c).toBe(3);
        expect(o.c).toBe(void 0);
    });

    it('testing immutable :: o -> o', () => {
        let o = _.immutable({a: 1});

        o.a = 2;
        o.b = 3;

        expect(o.a).toBe(1);
        expect(o.b).toBe(void 0);
    });

    it('testing pairs :: o -> as', () => {
        let o = _.pairs({foo: 1, bar: 0});

        expect(o).toEqual([['foo', 1], ['bar', 0]]);
    });

    it('testing concat :: [a] -> [a] -> [a, a]', () => {
        expect(_.concat([1], [2])).toEqual([1, 2]);
        expect(_.concat([1], 2)).toEqual([1, 2]);
    });

    it('testing instance :: a -> Ctor -> a', () => {
        function F () {
            return _.instance(F, this);
        }
        expect(F() instanceof F).toBe(true);
    });

    it('testing first :: xs -> x', () => {
        expect(_.first([1, 2, 3])).toBe(1);
    });

    it('testing head :: xs -> [x]', () => {
        expect(_.head([1, 2, 3])).toEqual([1]);
    });

    it('testing initial :: xs -> [xs]', () => {
        expect(_.initial([1, 2, 3])).toEqual([1, 2]);
    });

    it('testing last :: xs -> x', () => {
        expect(_.last([1, 2, 3])).toBe(3);
    });

    it('testing tail :: xs -> [x]', () => {
        expect(_.tail([1, 2, 3])).toEqual([3]);
    });

    it('testing rest :: xs -> [xs]', () => {
        expect(_.rest([1, 2, 3])).toEqual([2, 3]);
    });

    it('testing nth :: n -> x -> x', () => {
        expect(_.nth(1, 'abc')).toBe('b');
        expect(_.nth(1, ['a', 'b', 'c'])).toBe('b');
        expect(_.nth(-1, 'abc')).toBe('b');
    });

    it('testing join :: s -> xs -> s', () => {
        expect(_.join('-', ['a', 'b', 'c'])).toBe('a-b-c');
    });

    it('testing split :: s -> s -> xs', () => {
        expect(_.split('-', 'a-b-c')).toEqual(['a', 'b', 'c']);
    });

    it('testing toUpper :: s -> s', () => {
        expect(_.toUpper('abc')).toBe('ABC');
    });

    it('testing toLower :: s -> s', () => {
        expect(_.toLower('ABC')).toBe('abc');
    });

    it('testing replace :: s -> s -> s', () => {
        expect(_.replace(/\-/g, ', ', 'a-b-c')).toBe('a, b, c');
        expect(_.replace(/\-/g, () => ', ', 'a-b-c')).toBe('a, b, c');
    });

    it('testing trim :: s -> s', () => {
        expect(_.trim('    abc    ')).toBe('abc');
    });

    it('testing reverse :: x -> s', () => {
        expect(_.reverse('abc')).toBe('cba');
        expect(_.reverse(['a', 'b', 'c'])).toEqual(['c', 'b', 'a']);
    });

    it('testing unique :: xs -> xs', () => {
        expect(_.unique([1, 2, 1, 3, 3, 2, 1, 3])).toEqual([1, 2, 3]);
    });

    it('testing union :: xs -> ys -> [xs : ys]', () => {
        expect(_.union([1, 2], [3, 2])).toEqual([1, 2, 3]);
    });

    it('testing intersect :: xs -> ys -> [xs & ys]', () => {
        expect(_.intersect([1, 2], [3, 2])).toEqual([2]);
    });

    it('testing differ :: xs -> ys -> [xs | ys]', () => {
        expect(_.differ([1, 2], [3, 2])).toEqual([1, 3]);
    });

    it('testing fold :: Function -> a -> Array -> a', () => {
        const add = (a, b) => a + b;
        expect(_.fold(add, '', ['a', 'b', 'c'])).toBe('abc');
    });

    it('testing foldRight :: Function -> a -> Array -> a', () => {
        const add = (a, b) => a + b;
        expect(_.foldRight(add, '', ['a', 'b', 'c'])).toBe('cba');
    });

    it('testing foldMap :: Monoid -> as -> Monoid', () => {
        expect(_.foldMap((v) => v.toUpperCase(), ['a', 'b'])).toBe('AB');
        expect(_.foldMap(_.All.of(true), [true, true]).fold(_.id)).toBe(true);
        expect(_.foldMap(_.All, [true, false]).fold(_.id)).toBe(false);
    });

    it('testing unfold :: Function -> a -> [a]', () => {
        expect(_.unfold((n) => n < 3 ? [n, n + 1] : null, 1)).toEqual([1, 2]);
    });

    it('testing range :: Number -> Number -> [Number]', () => {
        expect(_.range(2, 5)).toEqual([2, 3, 4, 5]);
    });

    it('testing filter :: Function -> [a] -> [a]', () => {
        expect(_.filter((n) => n < 3, [1, 2, 3])).toEqual([1, 2]);
    });

    it('testing keep :: [a] -> [a]', () => {
        expect(_.keep([1, null, 3])).toEqual([1, 3]);
    });

    it('testing drop :: Number -> [a] -> [a]', () => {
        expect(_.drop(2, [1, 2, 3])).toEqual([3]);
    });

    it('testing dropWhile :: Function -> [a] -> [a]', () => {
        expect(_.dropWhile((n) => n < 3, [1, 2, 3])).toEqual([3]);
    });

    it('testing take :: Number -> [a] -> [a]', () => {
        expect(_.take(2, [1, 2, 3])).toEqual([1, 2]);
    });

    it('testing takeWhile :: Function -> [a] -> [a]', () => {
        expect(_.takeWhile((n) => n < 3, [1, 2, 3])).toEqual([1, 2]);
    });

    it('testing find :: Function -> [a] -> a', () => {
        expect(_.find((n) => n % 2 === 0, [1, 2, 3, 4])).toBe(2);
    });

    it('testing findRight :: Function -> [a] -> a', () => {
        expect(_.findRight((n) => n % 2 === 0, [1, 2, 3, 4])).toBe(4);
    });

    it('testing equals :: Setoid -> Setoid -> Bool', () => {
        let S = (a) => ({ value: a, equals(b) { return a === b.value; } });
        let a = S(1);
        let b = S(2);
        expect(_.equals(a, a)).toBe(true);
        expect(_.equals(a, b)).toBe(false);
    });

    it('testing ap :: Apply -> Functor -> Functor', () => {
        let A = (f) => ({ ap(m) { return m.map(f); } });
        let a = A((n) => n + 1);
        let b = [2];
        expect(_.ap(a, b)).toEqual([3]);
    });

    it('testing map :: f -> Functor -> Functor', () => {
        expect(_.map((n) => n + 1, [1, 2, 3])).toEqual([2, 3, 4]);
    });

    it('testing flatten :: Monad -> Monad', () => {
        expect(_.flatten([[1], 2, [[3], 4]])).toEqual([1, 2, [3], 4]);
        expect(_.flatten([[1], 2, [[3], 4]], true)).toEqual([1, 2, 3, 4]);
    });

    it('testing flatMap :: f -> Monad -> Monad', () => {
        let xs = ['a.b'];
        let op = (s) => s.split('.');
        expect(_.flatMap(op, xs)).toEqual(['a', 'b']);
    });

    it('testing zip :: as -> as -> as', () => {
        expect(_.zip([1, 2, 3], [3, 2, 1])).toEqual([[1, 3], [2, 2], [3, 1]]);
        expect(_.zip([1], [3, 2, 1])).toEqual([[1, 3]]);
        expect(_.zip([1, 2, 3], [3])).toEqual([[1, 3]]);
    });

    it('testing traverse :: f -> A -> [a] -> A [a]', () => {
        const xs = _.traverse(_.Some.of, _.Some, ['a', 'b']);

        expect(_.Some.is(xs)).toBe(true);
        expect(xs.map(_.isArray).fold(_.id, _.id)).toBe(true);
        expect(xs.fold(_.id, _.id)).toEqual(['a', 'b']);
    });

    it('testing sequence :: A -> [a] -> A [a]', () => {
        const xs = _.sequence(_.Some, [_.Some.of('a'), _.Some.of('b')]);

        expect(_.Some.is(xs)).toBe(true);
        expect(xs.map(_.isArray).fold(_.id, _.id)).toBe(true);
        expect(xs.fold(_.id, _.id)).toEqual(['a', 'b']);
    });
});

    