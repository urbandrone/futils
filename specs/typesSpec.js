const {type, monads} = require('../futils');
describe('futils/types module', function () {

    it('testing isNil :: f -> a -> b', function () {
        var nul = type.isNil(null);
        var undef = type.isNil(void 0);
        var s = type.isNil('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isNull :: f -> a -> b', function () {
        var nul = type.isNull(null);
        var undef = type.isNull(void 0);
        var s = type.isNull('a string');

        expect(nul).toBe(true);
        expect(undef).toBe(false);
        expect(s).toBe(false);
    });

    it('testing isVoid :: f -> a -> b', function () {
        var nul = type.isVoid(null);
        var undef = type.isVoid(void 0);
        var s = type.isVoid('a string');

        expect(nul).toBe(false);
        expect(undef).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isBool :: f -> a -> b', function () {
        var b = type.isBool(false);
        var s = type.isBool('a string');

        expect(b).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isTrue :: f -> b -> b', function () {
        var b = type.isTrue(false);
        var s = type.isTrue('a string');

        expect(b).toBe(false);
        expect(s).toBe(true);
    });

    it('testing isFalse :: f -> a -> b', function () {
        var b = type.isFalse(false);
        var s = type.isFalse('a string');

        expect(b).toBe(true);
        expect(s).toBe(false);
    });

    it('testing isString :: f -> a -> b', function () {
        var s = type.isString('a string');
        var b = type.isString(true);

        expect(s).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isNumber :: f -> a -> b', function () {
        var n = type.isNumber(1);
        var b = type.isNumber(true);
        var nan = type.isNumber(NaN);
        var inf = type.isNumber(Infinity);
        var nil = type.isNumber(null);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(nan).toBe(false);
        expect(inf).toBe(false);
        expect(nil).toBe(false);
    });

    it('testing isInt :: f -> a -> b', function () {
        var n = type.isInt(1);
        var b = type.isInt(true);
        var f32 = type.isInt(1.5);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(f32).toBe(false);
    });

    it('testing isFloat :: f -> a -> b', function () {
        var n = type.isFloat(1.5);
        var b = type.isFloat(true);
        var i32 = type.isFloat(1);

        expect(n).toBe(true);
        expect(b).toBe(false);
        expect(i32).toBe(false);
    });

    it('testing isFunc :: f -> a -> b', function () {
        var f = type.isFunc(type.isString);
        var b = type.isFunc(true);

        expect(f).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isArray :: f -> a -> b', function () {
        var a = type.isArray([]);
        var b = type.isArray({});

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isObject :: f -> a -> b', function () {
        var a = type.isObject({});
        var b = type.isObject([]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isDate :: f -> a -> b', function () {
        var a = type.isDate(new Date());
        var b = type.isDate('2014-01-01');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isRegex :: f -> a -> b', function () {
        var a = type.isRegex(/.*/g);
        var b = type.isRegex(' ');

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isPromise :: f -> a -> b', function () {
        var a = type.isPromise(new Promise((r) => r(1)));
        var b = type.isPromise('string');
        var c = type.isPromise({length: 10});

        expect(a).toBe(true);
        expect(b).toBe(false);
        expect(c).toBe(false);
    });

    it('testing isIterator :: f -> a -> b', function () {
        var a = type.isIterator(null);
        var b = type.isIterator({next: true});
        var c = type.isIterator({next: function () {}});

        expect(a).toBe(false);
        expect(b).toBe(false);
        expect(c).toBe(true);
    });

    it('testing isIterable :: f -> a -> b', function () {
        var a = type.isIterable([]);
        var b = type.isIterable('string');
        var c = type.isIterable({length: 10});
        var d = type.isIterable(new Date());

        expect(a).toBe(true);
        expect(b).toBe(true);
        expect(c).toBe(true);
        expect(d).toBe(false);
    });

    it('testing isArrayOf :: f -> a -> b', function () {
        var a = type.isArrayOf(type.isString, ['a', 'b', 'c']);
        var b = type.isArrayOf(type.isString, [null, null, null]);

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isObjectOf :: f -> a -> b', function () {
        var a = type.isObjectOf(type.isString, {a: 'a', b: 'b', c: 'c'});
        var b = type.isObjectOf(type.isString, {a: 1, b: 'b', c: null});

        expect(a).toBe(true);
        expect(b).toBe(false);
    });

    it('testing isSetoid :: f -> a -> b', function () {
        class A { equals() {} };
        let a = new A();
        expect(type.isSetoid(a)).toBe(true);
    });

    it('testing isFunctor :: f -> a -> b', function () {
        class A { map() {} };
        let a = new A();
        expect(type.isFunctor(a)).toBe(true);
    });

    it('testing isApply :: f -> a -> b', function () {
        class A { ap() {} };
        let a = new A();
        expect(type.isApply(a)).toBe(true);
    });

    it('testing isFoldable :: f -> a -> b', function () {
        class A { fold() {} };
        let a = new A();
        expect(type.isFoldable(a)).toBe(true);
    });

    it('testing isApplicative :: f -> a -> b', function () {
        class A { of() {} ap() {} };
        let a = new A();
        expect(type.isApplicative(a)).toBe(true);
    });

    it('testing isMonad :: f -> a -> b', function () {
        class A { equals() {} map() {} flatten() {} flatMap() {} };
        let a = new A();
        expect(type.isMonad(a)).toBe(true);
    });
});
    