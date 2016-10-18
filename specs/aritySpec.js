const _ = require('../futils').arity;
describe('futils/arity module', function () {
    it('testing aritize :: n -> f -> f', function () {
        const any = (...args) => [...args];
        const f = _.aritize(2, any);

        expect(f.length).toBe(2);
        expect(f(1, 2, 3)).toEqual([1, 2]);
        expect(any(1, 2, 3)).toEqual([1, 2, 3]);
    });

    it('testing monadic :: f -> f', function () {
        var a = (...xs) => [...xs];

        expect(_.monadic(a)(1, 2, 3, 4, 5)).toEqual([1]);
    });

    it('testing dyadic :: f -> f', function () {
        var a = (...xs) => [...xs];

        expect(_.dyadic(a)(1, 2, 3, 4, 5)).toEqual([1, 2]);
    });

    it('testing triadic :: f -> f', function () {
        var a = (...xs) => [...xs];

        expect(_.triadic(a)(1, 2, 3, 4, 5)).toEqual([1, 2, 3]);
    });

    it('testing tetradic :: f -> f', function () {
        var a = (...xs) => [...xs];

        expect(_.tetradic(a)(1, 2, 3, 4, 5)).toEqual([1, 2, 3, 4]);
    });

});

    