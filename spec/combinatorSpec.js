const _ = require('../index');
describe('futils/combinators module', function () {
    it('testing identity :: a -> a', function () {
        expect(_.identity(1)).toBe(1);
    });

    it('testing getter :: a -> _ -> a', function () {
        var a = _.getter('a');
        expect(a('b')).toBe('a');
    });

    it('testing tap :: f -> g -> g(f)', function () {
        var a = _.tap(function outer (x) { return outer.inner(x); })((outer) => {
            outer.inner = (n) => n + 1;
            return outer;
        });

        expect(a(1)).toBe(2);
    });

    it('testing compose :: fs -> f', function () {
        var a = (s) => s.toUpperCase();
        var b = (s) => s.replace('-', ' ');
        var c = _.compose(a, b);

        expect(c('hello-world')).toBe('HELLO WORLD');
    });

    it('testing pipe :: fs -> f', function () {
        var a = (s) => s.toUpperCase();
        var b = (s) => s.replace('-', ' ');
        var c = _.pipe(a, b);

        expect(c('hello-world')).toBe('HELLO WORLD');
    });

    it('testing and :: fs -> f', function () {
        var a = (s) => s.length > 2;
        var b = _.and(_.isString, a);

        expect(b('test')).toBe(true);
        expect(b('t')).toBe(false);
        expect(b(null)).toBe(false);
    });

    it('testing or :: fs -> f', function () {
        var a = (s) => !!s && s.length > 2;
        var b = _.or(_.isString, a);

        expect(b('test')).toBe(true);
        expect(b('t')).toBe(true);
        expect(b([1, 2, 3])).toBe(true);
        expect(b(null)).toBe(false);
    });

    it('testing splat :: fs -> f', function () {
        var _s = '';
        var a = (s) => s.toUpperCase();
        var b = (s) => _s = s + ' b';
        var c = _.splat(a, b)

        expect(c('a')).toBe('A');
        expect(_s).toBe('a b');
    });
});   