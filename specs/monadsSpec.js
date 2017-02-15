const {
    id,
    curry,
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
} = require('../futils');

describe('futils/monads module', function () {

    // ======= utitlity functions

    it('testing liftA2 :: f, ...M[a] -> M[a]', () => {
        let some1 = Some.of(1);
        let some4 = Some.of(4);

        let add = curry((a, c) => a + c);

        expect(liftA2(add, some1, some4).value).toBe(5);
    });

    it('testing liftA3 :: f, ...M[a] -> M[a]', () => {
        let some1 = Some.of(1);
        let some4 = Some.of(4);

        let addMany = curry((a, b, c) => a + b + c);

        expect(liftA3(addMany, some1, Some.of(5), some4).value).toBe(10)
    });



    // -- MONADS ///////////////////////////////
    
    describe('Identity monad', () => {
        const m = Identity.of(1);
        const f = (n) => n + 1;
        const mf = (n) => Identity.of(n + 1);

        it('is pointed M::of', () => {
            expect(m.value).toBe(1);
        });

        it('is printable .toString', () => {
            expect(m.toString()).toBe('Identity(1)');
        });

        it('is a setoid .equals', () => {
            expect(m.equals(Identity.of(1))).toBe(true);
            expect(m.equals(Identity.of(2))).toBe(false);
        });

        it('is a functor .map', () => {
            expect(m.map(f).value).toBe(2);
        });

        it('implements a way to fold .fold', () => {
            expect(m.fold(id)).toBe(1);
        });

        it('is a monad .flatMap', () => {
            expect(m.flatMap(mf).value).toBe(2);
        });

        it('is applicative .ap', () => {
            expect(Identity.of(f).ap(m).value).toBe(2);
        });

        // uncomment on build 2.4.1
        // it('can be traversed .traverse', () => {
        //     const x = Identity.of(Some.of(1));
        //     const tf = (y) => y.traverse(Some.of, Identity);
        //     expect(Some.is(tf(x))).toBe(true);
        //     expect(tf(x).map(Identity.is).fold(id, id)).toBe(true);
        // });
    });

    describe('IO monad', () => {
        const obj = {location: {href: 'test'}, postfix: '!'};
        const comb = (a) => (b) => b + a;

        const m = IO.of(obj.location.href);

        it('is pointed M::of', () => {
            expect(m.run()).toBe('test');
        });

        it('is printable .toString', () => {
            expect(m.toString()).toBe('IO');
        });

        it('is a setoid .equals', () => {
            expect(m.equals(m)).toBe(true);
            expect(m.equals(IO.of(obj.postfix))).toBe(false);
        });

        it('is a functor .map', () => {
            expect(m.map(comb('!')).run()).toBe('test!');
        });

        it('implements a way to fold .run & .fold', () => {
            expect(m.run()).toBe('test');
            expect(m.fold(id)).toBe('test');
        });

        it('is a monad .flatMap', () => {
            expect(m.flatMap((s) => IO.of(s).map(comb('!'))).run()).toBe('test!');
        });

        it('is applicative .ap', () => {
            expect(new IO(comb('!')).ap(m).run()).toBe('test!');
        });

        // uncomment on build 2.4.1
        // it('can be traversed .traverse', () => {
        //     const x = IO.of(Some.of(1));
        //     const tf = (y) => y.traverse(Some.of, Identity);
        //     expect(Some.is(tf(x))).toBe(true);
        //     expect(tf(x).map(Identity.is).fold(id, id)).toBe(true);
        // });
    });

    describe('Either monad', () => {
        const right = Right.of(1);
        const left = Left.of('failure');

        const f = (n) => n + 1;
        const mf = (n) => Right.of(n + 1);

        it('is pointed M::of', () => {
            expect(right.value).toBe(1);
            expect(left.value).toBe('failure');
        });

        it('is printable .toString', () => {
            expect(right.toString()).toBe('Right(1)');
            expect(left.toString()).toBe('Left(failure)');
        });

        it('is a setoid .equals', () => {
            expect(right.equals(right)).toBe(true);
            expect(right.equals(left)).toBe(false);
        });

        it('is a functor .map', () => {
            expect(right.map(f).value).toBe(2);
            expect(left.map(f).value).toBe('failure');
        });

        it('implements a way to fold .fold', () => {
            expect(right.fold(id, id)).toBe(1);
            expect(left.fold(id, id)).toBe('failure');
        });

        it('is a monad .flatMap', () => {
            expect(right.flatMap(mf).value).toBe(2);
            expect(left.flatMap(mf).value).toBe('failure');
        });

        it('is applicative .ap', () => {
            expect(Some.of(f).ap(right).value).toBe(2);
            expect(Some.of(f).ap(left).value).toBe('failure');
        });

        it('is reflexive .isRight', () => {
            expect(right.isRight()).toBe(true);
            expect(left.isRight()).toBe(false);
        });

        it('can create the disjunction of itself .swap', () => {
            expect(right.swap().isRight()).toBe(false);
            expect(left.swap().isRight()).toBe(true);
        });

        it('is a catamorphism .cata', () => {
            expect(right.cata({ Left: id, Right: id })).toBe(1);
            expect(left.cata({ Left: id, Right: id })).toBe('failure');
        });

        it('is a bifunctor .biMap', () => {
            expect(right.biMap(id, id).value).toBe(1);
            expect(left.biMap(id, id).value).toBe('failure');
        });

        it('can try M::try', () => {
            const h = () => { return new Error('Left'); };
            expect(Either.try(f, 1).value).toBe(2);
            expect(Either.try(h, 1).value).toBe('Left');
        });

        it('can be derived from null M::fromNullable', () => {
            expect(Either.fromNullable(1).value).toBe(1);
            expect(Either.fromNullable(null).value).toBe(null);
        });

        it('can be derived from Maybe M::fromMaybe', () => {
            expect(Either.fromMaybe(Some.of(1)).value).toBe(1);
            expect(Either.fromMaybe(None.of()).value).toBe(null);
        });

        it('can be derived from IO M::fromIO', () => {
            expect(Either.fromIO(IO.of(1)).value).toBe(1);
            expect(Either.fromIO(IO.of(new Error('err'))).value).toBe('err');
        });

        it('can return alternative values .orGet', () => {
            expect(right.orGet(2)).toBe(1);
            expect(left.orGet(2)).toBe(2);
        });

        it('can return alternative units .orElse', () => {
            expect(right.orElse(2).value).toBe(1);
            expect(left.orElse(2).value).toBe(2);
        });

        // uncomment on build 2.4.1
        // it('can be traversed .traverse', () => {
        //     const x = Either.of(Some.of(1));
        //     const tf = (y) => y.traverse(Some.of, Right);
        //     expect(Some.is(tf(x))).toBe(true);
        //     expect(tf(x).map(Right.is).fold(id, id)).toBe(true);
        // });
    });

    describe('Maybe monad', () => {
        let some = Maybe.of(1),
            none = Maybe.of(null);

        const f = (n) => n + 1;
        const mf = (n) => Maybe.of(n + 1);

        it('is pointed M::of', () => {
            expect(some.value).toBe(1);
            expect(none.value).toBe(null);
        });

        it('is printable .toString', () => {
            expect(some.toString()).toBe('Some(1)');
            expect(none.toString()).toBe('None');
        });

        it('is a setoid .equals', () => {
            expect(some.equals(some)).toBe(true);
            expect(some.equals(none)).toBe(false);
        });

        it('is a functor .map', () => {
            expect(some.map(f).value).toBe(2);
            expect(none.map(f).value).toBe(null);
        });

        it('implements a way to fold .fold', () => {
            expect(some.fold(id, id)).toBe(1);
            expect(none.fold(id, id)).toBe(null);
        });

        it('is a monad .flatMap', () => {
            expect(some.flatMap(mf).value).toBe(2);
            expect(none.flatMap(mf).value).toBe(null);
        });

        it('is applicative .ap', () => {
            expect(Some.of(f).ap(some).value).toBe(2);
            expect(Some.of(f).ap(none).value).toBe(null);
        });

        it('is reflexive .isSome', () => {
            expect(some.isSome()).toBe(true);
            expect(none.isSome()).toBe(false);
        });

        it('is a catamorphism .cata', () => {
            expect(some.cata({ None: id, Some: id })).toBe(1);
            expect(none.cata({ None: id, Some: id })).toBe(null);
        });

        it('is a bifunctor .biMap', () => {
            expect(some.biMap(id, id).value).toBe(1);
            expect(none.biMap(id, id).value).toBe(null);
        });

        it('can be derived from Either M::fromEither', () => {
            expect(Maybe.fromEither(Right.of(1)).value).toBe(1);
            expect(Maybe.fromEither(Left.of('failure')).value).toBe(null);
        });

        it('can return alternative values .orGet', () => {
            expect(some.orGet(2)).toBe(1);
            expect(none.orGet(2)).toBe(2);
        });

        it('can return alternative units .orElse', () => {
            expect(some.orElse(2).value).toBe(1);
            expect(none.orElse(2).value).toBe(2);
        });
    });

    describe('State monad', () => {
        const m = State.of(1);
        const f = (n) => n + 1;
        const mf = (n) => State.get().map((a) => n + a);

        it('is pointed M::of', () => {
            expect(m.run()).toBe(1);
        });

        it('can grab the current state M::get', () => {
            let op = State.get();
            expect(op.run(1)).toBe(1);
        });

        it('can put the current state M::put', () => {
            let op = State.get().flatMap((n) => State.put(n + 1));
            expect(op.exec(1)).toBe(2);
        });

        it('can modify the current state M::modify', () => {
            let op = State.modify(f);
            expect(op.exec(1)).toBe(2);
        })

        it('is printable .toString', () => {
            expect(m.toString()).toBe('State');
        });

        it('is a functor .map', () => {
            expect(m.map(f).run()).toBe(2);
        });

        it('implements a way to fold .run', () => {
            expect(m.run()).toBe(1);
        });

        it('is a monad .flatMap', () => {
            expect(m.flatMap(mf).run(1)).toBe(2)
        });

        it('is applicative .ap', () => {
            expect(State.of(f).ap(m).run()).toBe(2);
        });
    });

    describe('Task monad', () => {
        const m = Task.of(1);
        const f = (n) => n + 1;
        const mf = (n) => Task.of(n + 1);

        it('is pointed M::of', () => {
            let val, flag;
            const checkout = (v) => val = v;
            runs(() => {
                setTimeout(() => {
                    flag = true;
                }, 50);
            });

            waitsFor(() => {
                m.run(id, checkout);
                return true;
            }, 'executing monadic action...', 750);

            runs(() => {
                expect(val).toBe(1);
            });
        });

        it('is printable .toString', () => {
            expect(m.toString()).toBe('Task');
        });

        it('is a setoid .equals', () => {
            expect(m.equals(Task.of(1))).toBe(true);
        });

        it('is a functor .map', () => {
            let val, flag;
            const checkout = (v) => val = v;
            runs(() => {
                setTimeout(() => {
                    flag = true;
                }, 50);
            });

            waitsFor(() => {
                m.map(f).run(id, checkout);
                return true;
            }, 'executing monadic action...', 750);

            runs(() => {
                expect(val).toBe(2);
            });
        });

        it('implements a way to fold .run & .fold', () => {
            let val, flag;
            const checkout = (v) => val = v;
            runs(() => {
                setTimeout(() => {
                    flag = true;
                }, 50);
            });

            waitsFor(() => {
                m.run(id, checkout);
                return true;
            }, 'executing monadic action...', 750);

            runs(() => {
                expect(val).toBe(1);
            });
        });

        it('is a monad .flatMap', () => {
            let val, flag;
            const checkout = (v) => val = v;
            runs(() => {
                setTimeout(() => {
                    flag = true;
                }, 50);
            });

            waitsFor(() => {
                m.flatMap(mf).run(id, checkout);
                return true;
            }, 'executing monadic action...', 750);

            runs(() => {
                expect(val).toBe(2);
            });
        });

        it('is applicative .ap', () => {
            let val, flag;
            const checkout = (v) => val = v;
            runs(() => {
                m.run(id, checkout);
                setTimeout(() => {
                    flag = val === undefined;
                }, 50);
            });

            waitsFor(() => {
                Task.of(f).ap(m).run(id, checkout);
                return true;
            }, 'executing monadic action...', 750);

            runs(() => {
                expect(val).toBe(2);
            });
        });

        it('forms a monoid M::empty & .concat', () => {
            let val, flag;
            const checkout = (v) => val = v;
            runs(() => {
                setTimeout(() => {
                    flag = true;
                }, 50);
            });

            waitsFor(() => {
                m.concat(Task.empty()).run(id, checkout);
                return true;
            }, 'executing monadic action...', 750);

            runs(() => {
                expect(val).toBe(1);
            });
        });
    });
});

    