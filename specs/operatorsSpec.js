const {operators} = require('../futils');
describe('futils/operators module', function () {
    
    it('testing field :: s -> o -> a', function () {
        expect(operators.field('a', {a: 1})).toBe(1);
        expect(operators.field('a.b', {a: {b: 1}})).toBe(1);
    });

    it('testing has :: s -> o -> b', function () {
        expect(operators.has('a', {a: 1})).toBe(true);
        expect(operators.has('b', {a: 1})).toBe(false);
    });

    it('testing assoc :: s -> a -> o -> o', function () {
        let s = {a: 1};
        expect(operators.assoc('b', 2, s).b).toBe(2);
        expect(s.a).toBe(1);
        expect(s.b).toBe(undefined);
    });

    it('testing call :: s -> o -> a | o', function () {
        expect(operators.call('toUpperCase')('s')).toBe('S');
        expect(operators.call('split', '.')('a.b')).toEqual(['a', 'b']);
    });

    it('testing merge :: o -> o -> o', function () {
        let o = {a: 1, b: 2};
        expect(operators.merge(o, {c: 3}).c).toBe(3);
        expect(o.c).toBe(void 0);
    });

    it('testing immutable :: o -> o', function () {
        let o = operators.immutable({a: 1});

        o.a = 2;
        o.b = 3;

        expect(o.a).toBe(1);
        expect(o.b).toBe(void 0);
    });

    it('testing first :: xs -> x', function () {
        expect(operators.first([1, 2, 3])).toBe(1);
    });

    it('testing head :: xs -> [x]', function () {
        expect(operators.head([1, 2, 3])).toEqual([1]);
    });

    it('testing initial :: xs -> [xs]', function () {
        expect(operators.initial([1, 2, 3])).toEqual([1, 2]);
    });

    it('testing last :: xs -> x', function () {
        expect(operators.last([1, 2, 3])).toBe(3);
    });

    it('testing tail :: xs -> [x]', function () {
        expect(operators.tail([1, 2, 3])).toEqual([3]);
    });

    it('testing rest :: xs -> [xs]', function () {
        expect(operators.rest([1, 2, 3])).toEqual([2, 3]);
    });

    it('testing unique :: xs -> xs', function () {
        expect(operators.unique([1, 2, 1, 3, 3, 2, 1, 3])).toEqual([1, 2, 3]);
    });

    it('testing union :: xs -> ys -> [xs : ys]', function () {
        expect(operators.union([1, 2], [3, 2])).toEqual([1, 2, 3]);
    });

    it('testing intersect :: xs -> ys -> [xs & ys]', function () {
        expect(operators.intersect([1, 2], [3, 2])).toEqual([2]);
    });

    it('testing differ :: xs -> ys -> [xs | ys]', function () {
        expect(operators.differ([1, 2], [3, 2])).toEqual([1, 3]);
    });

    it('testing equals :: Setoid -> Setoid -> Bool', function () {
        let S = (a) => ({ value: a, equals(b) { return a === b.value; } });
        let a = S(1);
        let b = S(2);
        expect(operators.equals(a, a)).toBe(true);
        expect(operators.equals(a, b)).toBe(false);
    });

    it('testing ap :: Apply -> Functor -> Functor', function () {
        let A = (f) => ({ ap(m) { return m.map(f); } });
        let a = A((n) => n + 1);
        let b = [2];
        expect(operators.ap(a, b)).toEqual([3]);
    });

    it('testing map :: f -> Functor -> Functor', function () {
        expect(operators.map((n) => n + 1, [1, 2, 3])).toEqual([2, 3, 4]);
    });

    it('testing flatten :: Monad -> Monad', function () {
        expect(operators.flatten([[1], 2, [[3], 4]])).toEqual([1, 2, 3, 4]);
    });

    it('testing flatMap :: f -> Monad -> Monad', function () {
        let xs = ['a.b'];
        let op = (s) => s.split('.');
        expect(operators.flatMap(op, xs)).toEqual(['a', 'b']);
    });

});

    