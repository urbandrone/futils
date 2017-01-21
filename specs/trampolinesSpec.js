const {trampoline, suspend} = require('../futils');
describe('futils/trampolines module', function () {
    it('testing suspend :: Function -> Suspended', function () {
        const f = suspend((a) => a + 1, 1);
        expect(f.run()).toBe(2);
    });

    it('testing trampoline :: Function -> a -> a', function () {
        const reduce = trampoline((f, seed, xs) => {
            if (xs.length < 1) { return seed; }
            return suspend(reduce, f, f(seed, xs[0]), xs.slice(1));
        });

        const add = (a, b) => a + b;
        expect(reduce(add, 0, [1, 2, 3])).toBe(6);
    });

});

    