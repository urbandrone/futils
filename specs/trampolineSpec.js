const {recur, again} = require('../dist/futils').trampoline;


describe('Trampoline', () => {
    it('should be able to create recursive functions', () => {
        let f = recur((a, b) => a <= 1 ? b : again(f, a - 1, a * b));
        expect(f(6, 1)).toBe(720);
    });
});