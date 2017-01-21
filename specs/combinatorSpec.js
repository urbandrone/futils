const _ = require('../futils');
describe('futils/combinators module', function () {
    it('testing id :: a -> a', function () {
        expect(_.id(1)).toBe(1);
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

    it('testing by :: f -> g -> a, a -> f(g(a), g(a))', function () {
        var a = 'hi', b = 'me';
        var f = _.by(_.equals, _.field('length'));
        expect(f(a, b)).toBe(true);
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

    it('testing fixed :: f -> f', function () {
        var f = _.fixed((g) => (n) => n < 1 ? 1 : n * g(n - 1));
        expect(f(5)).toBe(120);
        expect(f(6)).toBe(720);
    });
});   