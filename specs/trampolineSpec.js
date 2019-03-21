const {recur, again} = require('../dist/futils').trampoline;


describe('Trampoline', () => {
    it('should be able to create recursive functions', () => {
        let f = recur((a, b, c) => a >= b ? c : again(f, a + 1, b, c.concat(a)));
        expect(f(1, 100000, [])[0]).toBe(1);
    });
});