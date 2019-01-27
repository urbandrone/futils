const O = require('../dist/futils').operation;
const {Id, List} = require('../dist/futils').data;
const {Sum} = require('../dist/futils').monoid;


const timeout = (ms, x) => new Promise((res, rej) => {
    setTimeout(() => { res(x); }, ms);
});


describe('Operation', () => {
    describe('ap', () => {
        it('should be able to apply a function in a structure', () => {
            let mf = Id.of(a => a + 1);
            expect(O.ap(mf, Id.of(1)).value).toBe(2);
            expect(O.ap(mf)(Id.of(1)).value).toBe(2);
        });

        it('should work with Promises', () => {
            let v = null;
            runs(function() {
                let mf = Promise.resolve(x => x + 1);
                O.ap(mf, Promise.resolve(1)).then(x => { v = x; })
            });

            waitsFor(() => v === 2, 'v should be 2', 500);

            runs(function() {
              expect(v).toBe(2);
            });
        })
    });

    describe('concat', () => {
        it('should be able to concatenate two structures', () => {
            expect(O.concat(Id.of('b'), Id.of('a')).value).toBe('ab');
            expect(O.concat(Id.of('b'))(Id.of('a')).value).toBe('ab');
        });

        it('should work with Promises', () => {
            let v = null;
            runs(function() {
                O.concat(timeout(100, 1), timeout(10, 3)).then(x => { v = x; });
            });

            waitsFor(() => v === 3, 'v should be 3', 500);

            runs(function() {
              expect(v).toBe(3);
            });
        })
    });

    describe('doM', () => {
        it('should be able to write do-notation like syntax', () => {
            let r = O.doM(function * () {
                let a = yield Id.of(1);
                let b = yield Id.of(a + 1);
                return Id.of(b + 1);
            });

            expect(r.value).toBe(3);
        });

        it('should work with Promises', () => {
            let v = null;
            runs(function() {
                let s = O.doM(function * () {
                    let a = yield Promise.resolve(1);
                    let b = yield Promise.resolve(a + 1);
                    return Promise.resolve(b + 1);
                });
                s.then(x => { v = x; });
            });

            waitsFor(() => v === 3, 'v should be 3', 500);

            runs(function() {
              expect(v).toBe(3);
            });
        })
    });

    describe('drop', () => {
        it('should be able to drop items from the beginning', () => {
            expect(O.drop(2, [1, 2, 3])).toEqual([3]);
            expect(O.drop(2)([1, 2, 3])).toEqual([3]);
            expect(O.drop(2, List.of(3).cons(2).cons(1)).head).toBe(3);
        });
    });

    describe('equals', () => {
        it('should be able to check for equality', () => {
            expect(O.equals(1, 1)).toBe(true);
            expect(O.equals(1)(1)).toBe(true);
            expect(O.equals(1, 2)).toBe(false);
            expect(O.equals('a', 'a')).toBe(true);
            expect(O.equals('a', 'b')).toBe(false);
            expect(O.equals(null, null)).toBe(true);
            expect(O.equals(null, void 0)).toBe(false);
            expect(O.equals([1, 2], [1, 2])).toBe(true);
            expect(O.equals([1, 2], [2, 3])).toBe(false);
            expect(O.equals(Id.of(1), Id.of(1))).toBe(true);
            expect(O.equals(Id.of(1), Id.of(2))).toBe(false);
            expect(O.equals(a => a, b => b)).toBe(false);
            expect(O.equals(new Date(2000,0,1), new Date(2000,0,1))).toBe(true);
            expect(O.equals(new Date(2000,0,1), new Date(2000,1,1))).toBe(false);
            expect(O.equals({a: 1}, {a: 1})).toBe(true);
            expect(O.equals({a: 1}, {b: 2})).toBe(false);
            expect(O.equals(new Map([[1, 2]]), new Map([[1, 2]]))).toBe(true);
            expect(O.equals(new Map([[1, 2]]), new Map([['a', 2]]))).toBe(false);
            expect(O.equals(new Set([1, 2]), new Set([1, 2]))).toBe(true);
            expect(O.equals(new Set([1, 2]), new Set([1, 0]))).toBe(false);
        });
    });

    describe('filter', () => {
        it('should be able to filter a collection', () => {
            expect(O.filter(a => a > 2, [1, 2, 0, 4, 3, 5])).toEqual([4, 3, 5]);
            expect(O.filter(a => a > 2)([1, 2, 0, 4, 3, 5])).toEqual([4, 3, 5]);
            expect(O.filter(a => a > 2, List.of(4).cons(2).cons(3).cons(1)).toArray()).toEqual([3, 4]);
        });
    });

    describe('find', () => {
        it('should be able to find an element in a collection', () => {
            expect(O.find(a => a === 2, [1, 3, 2])).toBe(2);
            expect(O.find(a => a === 2, [1, 3, 4])).toBe(null);
            expect(O.find(a => a === 2)([1, 3, 2])).toBe(2);
            expect(O.find(a => a === 2, List.of(2).cons(3).cons(1))).toBe(2);
        });
    });

    describe('flat', () => {
        it('should be able to flatten nested structures', () => {
            expect(O.flat(Id.of(Id.of(1))).value).toBe(1);
            expect(O.flat([[1, 2], [3]])).toEqual([1, 2, 3])
        });
    });

    describe('flatMap', () => {
        it('should be able to flatMap/chain', () => {
            let f = A => a => A.of(a + 1);
            expect(O.flatMap(f(Array), [1, 2, 3])).toEqual([2, 3, 4]);
            expect(O.flatMap(f(Array))([1, 2, 3])).toEqual([2, 3, 4]);
            expect(O.flatMap(f(Id), Id.of(1)).value).toBe(2);
        });

        it('should work with Promises', () => {
            let v = null;
            let f = x => Promise.resolve(x * 3);
            runs(function() {
                O.flatMap(f, Promise.resolve(1)).then(x => { v = x; });
            });

            waitsFor(() => v === 3, 'v should be 3', 500);

            runs(function() {
              expect(v).toBe(3);
            });
        });
    });

    describe('fold', () => {
        it('should be able to fold an array into a monoid', () => {
            expect(O.fold(Sum, [1, 2, 3]).value).toBe(6);
            expect(O.fold(Sum)([1, 2, 3]).value).toBe(6);
            expect(O.fold(Sum, List.of(3).cons(2).cons(1)).value).toBe(6);
        });
    });

    describe('foldMap', () => {
        it('should be able to foldMap a function over an array into a monoid', () => {
            expect(O.foldMap(a => Sum.of(a), [1, 2, 3]).value).toBe(6);
            expect(O.foldMap(a => Sum.of(a))([1, 2, 3]).value).toBe(6);
            expect(O.foldMap(a => Sum.of(Number(a)), ['1', 'a', NaN]).value).toBe(1);
            expect(O.foldMap(a => Sum.of(a), List.of(3).cons(2).cons(1)).value).toBe(6);
        });
    });

    describe('head', () => {
        it('should return the head of a List/first element of an Array or null', () => {
            expect(O.head([1, 2, 3])).toBe(1);
            expect(O.head(List.of(3).cons(2).cons(1))).toBe(1);
            expect(O.head([])).toBe(null);
            expect(O.head(null)).toBe(null);
        });
    });

    describe('liftA', () => {
        it('should apply a curried function to a set of functors', () => {
            let f = a => b => c => a + b + c;
            expect(O.liftA(f, Id.of(1), Id.of(2), Id.of(3)).value).toBe(6);
            expect(O.liftA(f)(Id.of(1), Id.of(2), Id.of(3)).value).toBe(6);
            expect(Id.is(O.liftA(f, Id.of(1), Id.of(2)))).toBe(true);
        });
    });

    describe('map', () => {
        it('should map a function over a functor', () => {
            let f = a => a + 1;
            expect(O.map(f, [1, 2, 3])).toEqual([2, 3, 4]);
            expect(O.map(f)([1, 2, 3])).toEqual([2, 3, 4]);
            expect(O.map(f, Id.of(1)).value).toBe(2);
        });

        it('should work with Promises', () => {
            let v = null;
            let f = x => x * 3;
            runs(function() {
                O.map(f, Promise.resolve(1)).then(x => { v = x; });
            });

            waitsFor(() => v === 3, 'v should be 3', 500);

            runs(function() {
              expect(v).toBe(3);
            });
        });
    });

    describe('nubBy', () => {
        it('should remove dublicates', () => {
            expect(O.nubBy(O.equals, [1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
            expect(O.nubBy(O.equals, List.of(2).cons(3).cons(1).cons(2).cons(1)).toString()).toBe('Cons(1, Cons(2, Cons(3, Nil)))');
            expect(O.nubBy(O.equals)([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
        });
    });

    describe('nub', () => {
        it('should remove dublicates', () => {
            expect(O.nub([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
            expect(O.nub(List.of(2).cons(3).cons(1).cons(2).cons(1)).toString()).toBe('Cons(1, Cons(2, Cons(3, Nil)))');
        });
    });

    describe('prop', () => {
        it('should be able to get a property from an Object', () => {
            expect(O.prop('a', {a: 1})).toBe(1);
            expect(O.prop('a')({a: 1})).toBe(1);
            expect(O.prop('b', {a: 1})).toBe(null);
        });

        it('should be able to get a property from an Array', () => {
            expect(O.prop(0, [1, 2, 3])).toBe(1);
            expect(O.prop(0)([1, 2, 3])).toBe(1);
            expect(O.prop(5, [1, 2, 3])).toBe(null);
        });

        it('should be able to get a property from a Map', () => {
            expect(O.prop('a', new Map([['a', 1]]))).toBe(1);
            expect(O.prop('a')(new Map([['a', 1]]))).toBe(1);
            expect(O.prop('b', new Map([['a', 1]]))).toBe(null);
        });
    });

    describe('reduce', () => {
        it('should reduce a structure', () => {
            let f = (a, b) => a + b;
            expect(O.reduce(f, 0, [1, 2, 3])).toBe(6);
            expect(O.reduce(f)(0)([1, 2, 3])).toBe(6);
            expect(O.reduce(f, 0)([1, 2, 3])).toBe(6);
            expect(O.reduce(f, 0, Id.of(1))).toBe(1);
        });
    });

    describe('reduceRight', () => {
        it('should reduce a structure from the end', () => {
            let f = (a, b) => a + b;
            expect(O.reduceRight(f, '', ['a', 'b', 'c'])).toBe('cba');
            expect(O.reduceRight(f)('')(['a', 'b', 'c'])).toBe('cba');
            expect(O.reduceRight(f, '')(['a', 'b', 'c'])).toBe('cba');
            expect(O.reduceRight(f, '', List.of('c').cons('b').cons('a'))).toBe('cba');
        });
    });

    describe('sequence', () => {
        it('should sequence a structure into another one', () => {
            expect(O.sequence(Id, [Id.of(1)]).value).toEqual([1]);
            expect(O.sequence(Id)([Id.of(1)]).value).toEqual([1]);
            expect(O.sequence(Array, Id.of([1]))[0].value).toBe(1);
        });
    });

    describe('tail', () => {
        it('should return the tail of a List/rest of an Array', () => {
            expect(O.tail([1, 2, 3])).toEqual([2, 3]);
            expect(O.tail(List.of(3).cons(2).cons(1)).toString()).toBe('Cons(2, Cons(3, Nil))');
        });
    });

    describe('take', () => {
        it('should take elements from the beginning of a List or Array', () => {
            expect(O.take(2, [1, 2, 3])).toEqual([1, 2]);
            expect(O.take(2, List.of(3).cons(2).cons(1)).toString()).toBe('Cons(1, Cons(2, Nil))');
        });
    });

    describe('traverse', () => {
        it('should traverse a structure with a function', () => {
            expect(O.traverse(a => Id.of(a), Id, [1, 2, 3]).toString()).toBe('Id([1, 2, 3])');
            expect(O.traverse(a => Id.of(a))(Id, [1, 2, 3]).toString()).toBe('Id([1, 2, 3])');
            expect(O.traverse(a => Id.of(a), Id)([1, 2, 3]).toString()).toBe('Id([1, 2, 3])');
            expect(O.traverse(a => [a], Array, Id.of(1)).join(',')).toBe('Id(1)');
        });
    });
});