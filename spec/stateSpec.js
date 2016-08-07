const _ = require('../futils');
describe('futils/state module', function () {
    it('testing stateful :: f -> a -> f', function () {
        var a = _.stateful((n, m) => n + m, 0);

        expect(a(+1)).toBe(1);
        expect(a()).toBe(1);
        expect(a(-2)).toBe(-1);
        expect(a()).toBe(-1);
    });

    it('testing counter :: n -> f', function () {
        var a = _.counter(0);

        expect(a(+1)).toBe(1);
        expect(a()).toBe(1);
        expect(a(-2)).toBe(-1);
        expect(a()).toBe(-1);
    });

    it('testing chosen :: a -> f', function () {
        var a = _.chosen('a');

        expect(a('b')).toBe('b');
        expect(a()).toBe('b');
        expect(a('a')).toBe('a');
        expect(a()).toBe('a');
    });
});

    