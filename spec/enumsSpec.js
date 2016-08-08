const _ = require('../index');
describe('futils/enums module', function () {
    
    it('testing field :: s -> o -> a', function () {
        expect(_.field('a', {a: 1})).toBe(1);
        expect(_.field('a.b', {a: {b: 1}})).toBe(1);
    });

    it('testing has :: s -> o -> b', function () {
        expect(_.has('a', {a: 1})).toBe(true);
        expect(_.has('b', {a: 1})).toBe(false);
    });

    it('testing assoc :: s -> a -> o -> o', function () {
        let s = {a: 1};
        expect(_.assoc('b', 2, s).b).toBe(2);
        expect(s.a).toBe(1);
    });

    it('testing access :: o -> s -> a', function () {
        let s = ['a', 'b', 'c'];
        expect(_.access(s)(1)).toBe('b');
        expect(_.access(s)(0)).toBe('a');
        expect([0, 2, 1].map(_.access(s))).toEqual(['a', 'c', 'b']);
    });

    it('testing exec :: s -> o -> a | o', function () {
        expect(_.exec('toUpperCase')('s')).toBe('S');
        expect(_.exec('split', '.')('a.b')).toEqual(['a', 'b']);
    });

    it('testing execRight :: s -> o -> a | o', function () {
        expect(_.execRight('toUpperCase')('s')).toBe('S');
        expect(_.execRight('split', '.')('a.b')).toEqual(['a', 'b']);
    });

    it('testing extend :: o -> o -> o', function () {
        let o = {a: 1, b: 2};
        expect(_.extend(o, {c: 3}).b).toBe(2);
        expect(o.c).toBe(3);
    });

    it('testing merge :: o -> o -> o', function () {
        let o = {a: 1, b: 2};
        expect(_.merge(o, {c: 3}).c).toBe(3);
        expect(o.c).toBe(void 0);
    });

    it('testing immutable :: o -> o', function () {
        let o = _.immutable({a: 1});

        o.a = 2;
        o.b = 3;

        expect(o.a).toBe(1);
        expect(o.b).toBe(void 0);
    });

    it('testing first :: xs -> x', function () {
        expect(_.first([1, 2, 3])).toBe(1);
    });

    it('testing last :: xs -> x', function () {
        expect(_.last([1, 2, 3])).toBe(3);
    });

    it('testing map :: f -> xs -> xs', function () {
        expect(_.map((n) => n + 1, [1, 2, 3])).toEqual([2, 3, 4]);
    });

    it('testing flatten :: xs -> xs', function () {
        expect(_.flatten([[1], 2, [[3], 4]])).toEqual([1, 2, 3, 4]);
    });

    it('testing flatMap :: f -> xs -> xs', function () {
        let xs = ['a.b'];
        let op = (s) => s.split('.');
        expect(_.flatMap(op, xs)).toEqual(['a', 'b']);
    });

});

    