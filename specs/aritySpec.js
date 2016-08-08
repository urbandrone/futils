const _ = require('../index');
describe('futils/aritize module', function () {
    it('testing aritize :: n -> f -> f', function () {
        const any = (...args) => [...args];
        const f = _.aritize(2, any);

        expect(f.length).toBe(2);
        expect(f(1, 2, 3)).toEqual([1, 2]);
        expect(any(1, 2, 3)).toEqual([1, 2, 3]);
    });
});

    