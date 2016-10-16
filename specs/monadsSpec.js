const _ = require('../futils');
describe('futils/monads module', function () {
    const M = _.monads;

    it('testing Identity monad', () => {
        let m = M.Identity.of(1);
        let mm = M.Identity.of(M.Identity.of(1));

    let f = (n) => n + 1;
        let mf = (n) => M.Identity.of(1).map((one) => one + n);

        expect(m.toString()).toBe('Identity(1)');
        expect(m.result()).toBe(1);
        expect(m.map(f).result()).toBe(2);
        expect(mm.flatten().result()).toBe(1);
        expect(m.flatMap(mf).result()).toBe(2);
    });

    it('testing Maybe monad', () => {
        let some = M.Maybe.of(1),
            none = M.Maybe.of(null);

        let f = (n) => n + 1;
        let mf = (n) => M.Maybe.of(1).map((one) => one + n);

        expect(some.toString()).toBe('Maybe.Some(1)');
        expect(none.toString()).toBe('Maybe.None(null)');
        expect(some.result()).toBe(1);
        expect(none.result()).toBe(null);
        expect(some.isSome()).toBe(true);
        expect(none.isSome()).toBe(false);
        expect(some.map(f).result()).toBe(2);
        expect(none.map(f).result()).toBe(null);
        expect(some.flatMap(mf).result()).toBe(2);
        expect(none.flatMap(mf).result()).toBe(null);
        expect(some.orElse(2).result()).toBe(1);
        expect(none.orElse(2).result()).toBe(2);

        let rej = () => 'Rejected a null value';
        let id = (a) => a;

        expect(some.biMap(rej, id).result()).toBe(1);
        expect(none.biMap(rej, id).result()).toBe('Rejected a null value');

        expect(M.Maybe.fromEither(
            M.Either.ofRight(1)
        ).map(f).result()).toBe(2);
        expect(M.Maybe.fromEither(
            M.Either.ofLeft('failure')
        ).map(f).result()).toBe(null);
    });

    it('testing Either monad', () => {
        let right = M.Either.ofRight(1),
            left = M.Either.ofLeft('failure');

        let f = (n) => n + 1;
        let mf = (n) => M.Either.ofRight(1).map((one) => one + n);

        expect(right.toString()).toBe('Either.Right(1)');
        expect(left.toString()).toBe('Either.Left(failure)');
        expect(right.result()).toBe(1);
        expect(left.result()).toBe('failure');
        expect(right.isRight()).toBe(true);
        expect(left.isRight()).toBe(false);
        expect(right.map(f).result()).toBe(2);
        expect(left.map(f).result()).toBe('failure');
        expect(right.flatMap(mf).result()).toBe(2);
        expect(left.flatMap(mf).result()).toBe('failure');
        expect(right.orElse('fallback').result()).toBe(1);
        expect(left.orElse('fallback').result()).toBe('fallback');

        let rej = () => 2;
        let id = (a) => a;

        expect(right.biMap(rej, id).result()).toBe(1);
        expect(left.biMap(rej, id).result()).toBe(2);

        expect(M.Either.fromMaybe(
            'failure', M.Maybe.ofSome(1)
        ).map(f).result()).toBe(2);
        expect(M.Either.fromMaybe(
            'failure', M.Maybe.ofNone()
        ).map(f).result()).toBe('failure');

        expect(M.Either.try(f)(1).result()).toBe(2);
    });

    it('testing IO monad', () => {
        let obj = {location: {href: 'testrunner'}};
        let m = M.IO.of(() => obj.location.href);

        let g = (s) => s + '!';
        let mf = (s) => M.IO.of(() => '!').map((p) => s + p);

        expect(m.result()).toBe('testrunner');
        expect(m.map(g).result()).toBe('testrunner!');
        expect(m.flatMap(mf).result()).toBe('testrunner!');
    });

});

    