const {combinators, type} = require('../futils');
describe('futils/combinators module', function () {
    it('testing identity :: a -> a', function () {
        expect(combinators.identity(1)).toBe(1);
    });

    it('testing getter :: a -> _ -> a', function () {
        var a = combinators.getter('a');
        expect(a('b')).toBe('a');
    });

    it('testing tap :: f -> g -> g(f)', function () {
        var a = combinators.tap(function outer (x) { return outer.inner(x); })((outer) => {
            outer.inner = (n) => n + 1;
            return outer;
        });

        expect(a(1)).toBe(2);
    });

    it('testing compose :: fs -> f', function () {
        var a = (s) => s.toUpperCase();
        var b = (s) => s.replace('-', ' ');
        var c = combinators.compose(a, b);

        expect(c('hello-world')).toBe('HELLO WORLD');
    });

    it('testing pipe :: fs -> f', function () {
        var a = (s) => s.toUpperCase();
        var b = (s) => s.replace('-', ' ');
        var c = combinators.pipe(a, b);

        expect(c('hello-world')).toBe('HELLO WORLD');
    });

    it('testing and :: fs -> f', function () {
        var a = (s) => s.length > 2;
        var b = combinators.and(type.isString, a);

        expect(b('test')).toBe(true);
        expect(b('t')).toBe(false);
        expect(b(null)).toBe(false);
    });

    it('testing or :: fs -> f', function () {
        var a = (s) => !!s && s.length > 2;
        var b = combinators.or(type.isString, a);

        expect(b('test')).toBe(true);
        expect(b('t')).toBe(true);
        expect(b([1, 2, 3])).toBe(true);
        expect(b(null)).toBe(false);
    });
});   