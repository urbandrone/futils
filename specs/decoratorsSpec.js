const _ = require('../futils');
describe('futils/decorators module', function () {
    it('testing once :: f -> f', function () {
        var a = _.once((s) => s.toUpperCase());

        expect(a('a')).toBe('A');
        expect(a('b')).toBe(null);
    });

    it('testing not :: f -> f', function () {
        var a = _.not(_.isString);

        expect(a('a')).toBe(false);
        expect(a(null)).toBe(true);
    });

    it('testing flip :: f -> f', function () {
        var a = (x, y) => x - y;
        var b = _.flip(a);

        expect(a(2, 1)).toBe(1);
        expect(b(2, 1)).toBe(-1);
    });

    it('testing curry :: f -> f', function () {
        var a = (x, y) => x + y;
        var b = _.curry(a);

        expect(a(2, 1)).toBe(3);
        expect(b(2)(1)).toBe(3);
    });

    it('testing curryRight :: f -> f', function () {
        var a = (x, y) => x + y;
        var b = _.curryRight(a);

        expect(a(2, 1)).toBe(3);
        expect(b(2)(1)).toBe(3);
    });

    it('testing partial :: f -> f', function () {
        var a = (x, y) => x + y;
        var b = _.partial(a, 2);

        expect(a(2, 1)).toBe(3);
        expect(b(1)).toBe(3);
    });

    it('testing partialRight :: f -> f', function () {
        var a = (x, y) => x + y;
        var b = _.partialRight(a, undefined, 2);

        expect(a(2, 1)).toBe(3);
        expect(b(1)).toBe(3);
    });

    it('testing given :: p, t, f -> f', function () {
        var a = _.given(_.isString, (s) => s + '!', () => 'not string!');

        expect(a('a string')).toBe('a string!');
        expect(a(null)).toBe('not string!');
    });

    it('testing memoize :: f -> f', function () {
        var n = 0;
        var a = _.memoize((m) => {
            n += 1;
            return m;
        });

        a(1);
        a(1);
        a(1);

        expect(n).toBe(1);
    });
});   