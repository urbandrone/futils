const _ = require('../futils');
describe('futils/monads module', function () {
    const M = _.monads;
    const {pipe} = _;
    
    const inc = (n) => n + 1;

    it('testing Identity monad', () => {
        let m = M.Identity.of(1);
        let mm = M.Identity.of(M.Identity.of(1));

        let minc = (n) => M.Identity.of(1).map((one) => one + n);

        expect(m.result()).toBe(1);
        expect(m.map(inc).result()).toBe(2);
        expect(mm.flatten().result()).toBe(1);
        expect(m.flatMap(minc).result()).toBe(2);
    });

    it('testing Maybe monad', () => {
        let m = M.Maybe.of(1),
            none = M.Maybe.of(null);

        let minc = (n) => M.Maybe.of(1).map((one) => one + n);

        expect(m.result()).toBe(1);
        expect(none.result()).toBe(null);
        expect(m.isSome()).toBe(true);
        expect(none.isSome()).toBe(false);
        expect(m.map(inc).result()).toBe(2);
        expect(none.map(inc).result()).toBe(null);
        expect(m.flatMap(minc).result()).toBe(2);
        expect(none.flatMap(minc).result()).toBe(null);
        expect(m.orElse(2).result()).toBe(1);
        expect(none.orElse(2).result()).toBe(2);
    });

    it('testing Either monad', () => {
        let m = M.Either.ofRight(1),
            left = M.Either.ofLeft('failure');

        let minc = (n) => M.Either.ofRight(1).map((one) => one + n);

        expect(m.result()).toBe(1);
        expect(left.result()).toBe('failure');
        expect(m.isRight()).toBe(true);
        expect(left.isRight()).toBe(false);
        expect(m.map(inc).result()).toBe(2);
        expect(left.map(inc).result()).toBe('failure');
        expect(m.flatMap(minc).result()).toBe(2);
        expect(left.flatMap(minc).result()).toBe('failure');
        expect(m.orElse('fallback').result()).toBe(1);
        expect(left.orElse('fallback').result()).toBe('fallback');
    });

    it('testing IO monad', () => {
        let vars = {location: {href: 'testrunner'}, postfix: '!'},
            m = M.IO.of(() => vars.location.href),
            n = M.IO.of(() => vars.postfix);

        const f = (s) => s + '!';
        const mf = (s) => n.map((p) => s + p);

        expect(m.result()).toBe('testrunner');
        expect(m.map(f).result()).toBe('testrunner!');
        expect(m.flatMap(mf).result()).toBe('testrunner!');
    });

});

    