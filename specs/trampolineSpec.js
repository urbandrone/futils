const {recur, again} = require('../dist/futils').trampoline;


describe('Trampoline', () => {
    it('should be able to create recursive functions', () => {
        let f = recur(function loop (a, b, c) {
          return a >= b ? c : again(loop, a + 1, b, c.concat(a))
        });
        expect(f(1, 10000, [])[0]).toBe(1);
    });
});