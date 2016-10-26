const {monads, decorators} = require('../futils');
const log = require('brolog');

describe('futils/monads module', function () {
    const {curry} = decorators;
    const {
        liftA2,
        liftA3,
        Identity,
        Maybe,
        None,
        Some,
        Either,
        Left,
        Right,
        IO,
        State,
        Task
    } = monads;

    it('testing Identity monad', () => {
        let m = Identity.of(1);

        let f = (n) => n + 1;
        let mf = (n) => Identity.of(1).map((one) => one + n);

        expect(m.toString()).toBe('Identity(1)');
        expect(m.mvalue).toBe(1);
        expect(m.map(f).mvalue).toBe(2);
        expect(m.flatMap(mf).mvalue).toBe(2);
        expect(Identity.of(f).ap(m).mvalue).toBe(2);
        expect(m.equals(Identity.of(1))).toBe(true);
    });

    it('testing State monad', () => {
        let m = State.of(1);

        let f = (n) => n + 1;
        let mf = (n) => State.of(1).map((one) => one + n);

        expect(m.toString()).toBe('State(1, null)');
        expect(m.mvalue).toBe(1);
        expect(m.map(f).mvalue).toBe(2);
        expect(m.map(f).mbefore).toBe(1);
        expect(m.flatMap(mf).mvalue).toBe(2);
        expect(m.flatMap(mf).mbefore).toBe(1);
        expect(State.of(f).ap(m).mvalue).toBe(2);
        expect(State.of(f).ap(m).mbefore).toBe(1);
        expect(m.equals(State.of(1))).toBe(true);
    });

    it('testing Maybe monad', () => {
        let some = Some.of(1),
            none = None.of();

        let f = (n) => n + 1;
        let mf = (n) => Some.of(1).map((one) => one + n);

        expect(some.toString()).toBe('Some(1)');
        expect(none.toString()).toBe('None');
        expect(some.mvalue).toBe(1);
        expect(none.mvalue).toBe(null);
        expect(some.isSome()).toBe(true);
        expect(none.isSome()).toBe(false);
        expect(some.map(f).mvalue).toBe(2);
        expect(none.map(f).mvalue).toBe(null);
        expect(some.flatMap(mf).mvalue).toBe(2);
        expect(none.flatMap(mf).mvalue).toBe(null);
        expect(some.orElse(2)).toBe(1);
        expect(none.orElse(2)).toBe(2);
        expect(some.orSome(2).mvalue).toBe(1);
        expect(none.orSome(2).mvalue).toBe(2);
        expect(Some.of(f).ap(some).mvalue).toBe(2);
        expect(Some.of(f).ap(none).mvalue).toBe(null);
        expect(some.equals(Some.of(1))).toBe(true);
        expect(none.equals(None.of())).toBe(true);
        expect(some.equals(none)).toBe(false);


        let rej = () => 'Rejected';
        let id = (a) => a;

        expect(some.fold(rej, id)).toBe(1);
        expect(none.fold(rej, id)).toBe('Rejected');
        expect(some.biMap(rej, id).mvalue).toBe(1);
        expect(none.biMap(rej, id).mvalue).toBe('Rejected');
        expect(some.cata({ None: rej, Some: id })).toBe(1);
        expect(none.cata({ None: rej, Some: id })).toBe('Rejected')

        expect(Maybe.fromEither(Right.of(1)).mvalue).toBe(1);
        expect(Maybe.fromEither(Left.of('failure')).mvalue).toBe(null);
    });

    it('testing Either monad', () => {
        let right = Right.of(1),
            left = Left.of('failure');

        let f = (n) => n + 1;
        let mf = (n) => Right.of(1).map((one) => one + n);

        expect(right.toString()).toBe('Right(1)');
        expect(left.toString()).toBe('Left(failure)');
        expect(right.mvalue).toBe(1);
        expect(left.mvalue).toBe('failure');
        expect(right.isRight()).toBe(true);
        expect(left.isRight()).toBe(false);
        expect(right.map(f).mvalue).toBe(2);
        expect(left.map(f).mvalue).toBe('failure');
        expect(right.flatMap(mf).mvalue).toBe(2);
        expect(left.flatMap(mf).mvalue).toBe('failure');
        expect(right.orElse(2)).toBe(1);
        expect(left.orElse(2)).toBe(2);
        expect(right.orRight(2).mvalue).toBe(1);
        expect(left.orRight(2).mvalue).toBe(2);
        expect(Some.of(f).ap(right).mvalue).toBe(2);
        expect(Some.of(f).ap(left).mvalue).toBe('failure');
        expect(right.equals(Right.of(1))).toBe(true);
        expect(left.equals(Left.of('failure'))).toBe(true);
        expect(right.equals(left)).toBe(false);
        expect(right.swap().isRight()).toBe(false);
        expect(left.swap().isRight()).toBe(true);

        let msg = 'Rejected';
        let rej = () => msg;
        let id = (a) => a;

        expect(right.fold(rej, id)).toBe(1);
        expect(left.fold(rej, id)).toBe('Rejected');
        expect(right.cata({ Left: rej, Right: id })).toBe(1);
        expect(left.cata({ Left: rej, Right: id })).toBe('Rejected');
        expect(right.biMap(rej, id).mvalue).toBe(1);
        expect(left.biMap(rej, id).mvalue).toBe('Rejected');

        expect(Either.fromNullable(msg, 1).mvalue).toBe(1);
        expect(Either.fromNullable(msg, null).mvalue).toBe(msg);
        expect(Either.fromMaybe(msg, Some.of(1)).mvalue).toBe(1);
        expect(Either.fromMaybe(msg, None.of()).mvalue).toBe(msg);
        expect(Either.fromIO(msg, IO.of(() => 1)).mvalue).toBe(1);
        expect(Either.fromIO(msg, IO.of(() => new Error())).mvalue).toBe(msg);

        let h = () => { return new Error('Either::try -> Left'); };
        expect(Either.try(f, 1).mvalue).toBe(2);
        expect(Either.try(h, 1).mvalue).toBe('Either::try -> Left');
    });

    it('testing IO monad', () => {
        let obj = {location: {href: 'test'}, postfix: '!'};
        let m = IO.of(() => obj.location.href);

        let g = (s) => s + obj.postfix;
        let mf = (s) => IO.of(() => obj.postfix).map((p) => s + p);

        expect(m.performIO()).toBe('test');
        expect(m.map(g).performIO()).toBe('test!');
        expect(m.flatMap(mf).performIO()).toBe('test!');
        expect(Some.of(g).ap(m).performIO()).toBe('test!');
    });

    // it('testing Task monad', () => {
    //     let m = Task.resolve(1);

    //     let f = (n) => n + 1;
    //     let mf = (n) => Task.resolve(1).map((v) => v + n);
    // });



    // ======= utitlity functions

    it('testing liftA2 :: f, ...M[a] -> M[a]', () => {
        let some1 = Some.of(1);
        let some4 = Some.of(4);

        let add = curry((a, c) => a + c);

        expect(liftA2(add, some1, some4).mvalue).toBe(5);
    });

    it('testing liftA3 :: f, ...M[a] -> M[a]', () => {
        let some1 = Some.of(1);
        let some4 = Some.of(4);

        let addMany = curry((a, b, c) => a + b + c);

        expect(liftA3(addMany, some1, Some.of(5), some4).mvalue).toBe(10)
    });
});

    