const {
    id,
    Additive,
    Char,
    Multiple,
    Any,
    All,
    Min,
    Max,
    Fn,
    Dict
} = require('../futils');

describe('futils/monoids module', function () {

    // -- MONOIDS ///////////////////////////////
    
    describe('Char monoid', () => {
        let a = Char.of('a');

        it('should implement a way to fold .fold', () => {
            expect(a.fold(id)).toBe('a');
        })

        it('should be pointed M::of', () => {
            expect(a.fold(id)).toBe('a');
        });

        it('should be a semigroup .concat', () => {
            expect(a.concat(a).fold(id)).toBe('aa');
        });

        it('should define a unit M::empty', () => {
            expect(Char.empty().fold(id)).toBe('');
            expect(a.concat(Char.empty()).fold(id)).toBe('a');
            expect(Char.empty().concat(a).fold(id)).toBe('a');
        });
    });
    
    describe('Additive monoid', () => {
        let one = Additive.of(1);

        it('should be pointed M::of', () => {
            expect(one.fold(id)).toBe(1);
        });

        it('should be a semigroup .concat', () => {
            expect(one.concat(one).fold(id)).toBe(2);
        });

        it('should define a unit M::empty', () => {
            expect(Additive.empty().fold(id)).toBe(0);
            expect(one.concat(Additive.empty()).fold(id)).toBe(1);
            expect(Additive.empty().concat(one).fold(id)).toBe(1);
        });

        it('should implement a way to fold .fold', () => {
            expect(one.fold(id)).toBe(1);
        })
    });
    
    describe('Multiple monoid', () => {
        let two = Multiple.of(2);

        it('should be pointed M::of', () => {
            expect(two.fold(id)).toBe(2);
        });

        it('should be a semigroup .concat', () => {
            expect(two.concat(two).fold(id)).toBe(4);
        });

        it('should define a unit M::empty', () => {
            expect(Multiple.empty().fold(id)).toBe(1);
            expect(two.concat(Multiple.empty()).fold(id)).toBe(2);
            expect(Multiple.empty().concat(two).fold(id)).toBe(2);
        });

        it('should implement a way to fold .fold', () => {
            expect(two.fold(id)).toBe(2);
        })
    });
    
    describe('Max monoid', () => {
        let one = Max.of(1);

        it('should be pointed M::of', () => {
            expect(one.fold(id)).toBe(1);
        });

        it('should be a semigroup .concat', () => {
            expect(one.concat(Max.of(2)).fold(id)).toBe(2);
        });

        it('should define a unit M::empty', () => {
            expect(Max.empty().fold(id)).toBe(-Infinity);
            expect(one.concat(Max.empty()).fold(id)).toBe(1);
            expect(Max.empty().concat(one).fold(id)).toBe(1);
        });

        it('should implement a way to fold .fold', () => {
            expect(one.fold(id)).toBe(1);
        })
    });
    
    describe('Min monoid', () => {
        let one = Min.of(1);

        it('should be pointed M::of', () => {
            expect(one.fold(id)).toBe(1);
        });

        it('should be a semigroup .concat', () => {
            expect(one.concat(Min.of(0)).fold(id)).toBe(0);
        });

        it('should define a unit M::empty', () => {
            expect(Min.empty().fold(id)).toBe(Infinity);
            expect(one.concat(Min.empty()).fold(id)).toBe(1);
            expect(Min.empty().concat(one).fold(id)).toBe(1);
        });

        it('should implement a way to fold .fold', () => {
            expect(one.fold(id)).toBe(1);
        })
    });
    
    describe('Any monoid', () => {
        let truth = Any.of(true);

        it('should be pointed M::of', () => {
            expect(truth.fold(id)).toBe(true);
        });

        it('should be a semigroup .concat', () => {
            expect(truth.concat(Any.of(false)).fold(id)).toBe(true);
        });

        it('should define a unit M::empty', () => {
            expect(Any.empty().fold(id)).toBe(false);
            expect(truth.concat(Any.empty()).fold(id)).toBe(true);
            expect(Any.empty().concat(truth).fold(id)).toBe(true);
        });

        it('should implement a way to fold .fold', () => {
            expect(truth.fold(id)).toBe(true);
        })
    });
    
    describe('All monoid', () => {
        let truth = All.of(true);

        it('should be pointed M::of', () => {
            expect(truth.fold(id)).toBe(true);
        });

        it('should be a semigroup .concat', () => {
            expect(truth.concat(All.of(false)).fold(id)).toBe(false);
        });

        it('should define a unit M::empty', () => {
            expect(All.empty().fold(id)).toBe(true);
            expect(truth.concat(All.empty()).fold(id)).toBe(true);
            expect(All.empty().concat(truth).fold(id)).toBe(true);
        });

        it('should implement a way to fold .fold', () => {
            expect(truth.fold(id)).toBe(true);
        })
    });
    
    describe('Fn monoid', () => {
        let one = Fn.of(1);

        it('should be pointed M::of', () => {
            expect(one.fold(id)).toBe(1);
        });

        it('should be a semigroup .concat', () => {
            expect(one.concat(new Fn((a) => a + 1)).fold(id)).toBe(2);
        });

        it('should define a unit M::empty', () => {
            expect(one.concat(Fn.empty()).fold(id)).toBe(1);
            expect(Fn.empty().concat(one).fold(id)).toBe(1);
        });

        it('should implement a way to fold .fold', () => {
            expect(one.fold(id)).toBe(1);
        })
    });
    
    describe('Dict monoid', () => {
        let base = Dict.of({x: 1});

        it('should be pointed M::of', () => {
            expect(base.fold(id)).toEqual({x: 1});
        });

        it('should be a semigroup .concat', () => {
            expect(base.concat(Dict.of({y: 2})).fold(id)).toEqual({x: 1, y: 2});
        });

        it('should define a unit M::empty', () => {
            expect(Dict.empty().fold(id)).toEqual({});
            expect(base.concat(Dict.empty()).fold(id)).toEqual({x: 1});
            expect(Dict.empty().concat(base).fold(id)).toEqual({x: 1});
        });

        it('should implement a way to fold .fold', () => {
            expect(base.fold(id)).toEqual({x: 1});
        })
    });
});

    