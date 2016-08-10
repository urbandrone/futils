const _ = require('../futils');
describe('futils/comparators module', function () {
    it('testing eq :: a -> a -> b', function () {
        var a = _.eq('a', 'a');
        var b = _.eq('a');
        var c = _.eq('a', (s) => s.toLowerCase());

        expect(a).toBe(true);
        expect(b('a')).toBe(true);
        expect(b('b')).toBe(false);
        expect(c('A')).toBe(true);
        expect(c('B')).toBe(false);
    });

    it('testing gt :: n -> n -> b', function () {
        var a = _.gt(1, 2);
        var b = _.gt(1);

        expect(a).toBe(true);
        expect(b(2)).toBe(true);
        expect(b(0)).toBe(false);
    });

    it('testing gte :: n -> n -> b', function () {
        var a = _.gte(1, 2);
        var b = _.gte(1);

        expect(a).toBe(true);
        expect(b(1)).toBe(true);
        expect(b(0)).toBe(false);
    });

    it('testing lt :: n -> n -> b', function () {
        var a = _.lt(1, 0);
        var b = _.lt(1);

        expect(a).toBe(true);
        expect(b(1)).toBe(false);
        expect(b(0)).toBe(true);
    });

    it('testing lte :: n -> n -> b', function () {
        var a = _.lte(1, 0);
        var b = _.lte(1);

        expect(a).toBe(true);
        expect(b(2)).toBe(false);
        expect(b(1)).toBe(true);
    });

    it('testing locals :: s -> s -> b', function () {
        expect(_.locals('a', 'a')).toBe(0);
        expect(_.locals('a', 'b')).toBe(1);
        expect(_.locals('b', 'a')).toBe(-1);
    });
});

    