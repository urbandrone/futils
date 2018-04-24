const {id, isFunc, isString, isNumber, Type} = require('../futils');
describe('futils/Type module', () => {
    const Zip = Type('Zip', isNumber);
    const Matrix2 = Type('Matrix2', [isNumber, isNumber]);
    const Matrix = Type('Matrix', [isNumber]);
    const Address = Type('Address', {city: isString, street: isString, zip: Zip.is});
    
    it('should create new Type constructors', () => {
        expect(isFunc(Zip)).toBe(true);
        expect(isFunc(Matrix)).toBe(true);
        expect(isFunc(Matrix2)).toBe(true);
        expect(isFunc(Address)).toBe(true);
    });

    it('should provide a proper valueOf method', () => {
        expect(Zip(12345) + Zip(200)).toBe(12545);
    });

    it('should provide a proper toString method', () => {
        const zip = Zip(12345);
        const addr = Address({city: 'Faketown', street: 'Fake Road', zip: zip});

        expect(zip.toString()).toBe('Zip(12345)');
        expect(/Zip\(/.test(addr.toString())).toBe(true)
    });

    it('should not depend on the "new" keyword', () => {
        expect(new Zip(12345).fold(id)).toBe(Zip(12345).fold(id));
        expect(new Zip(12345).fold(id)).toBe(Zip.of(12345).fold(id));
    });

    it('should not allow to create falsy types', () => {
        try {
            Zip('foo');
        } catch (exc) {
            expect(exc).toBe('Constructor Zip got invalid value "foo"');
        }
    });

    it('should have a static "is" method', () => {
        expect(Zip.is(Zip(12345))).toBe(true);
    });

    it('allows to check if a value of some type Type::isType', () => {
        expect(Type.isType(Zip(12345))).toBe(true);
        expect(Type.isType(12345)).toBe(false);
    });

    it('should allow to use arrays', () => {
        const m1 = Matrix([1, 2, 3]);
        const m2 = Matrix2([1, 2]);
        const join = (xs) => xs.join(',');

        expect(m1.fold(join)).toBe('1,2,3');
        expect(m2.fold(join)).toBe('1,2');
    });

    it('implements a catamorphism Type::cata', () => {
        const address = Address({
            city: 'Faketown',
            street: 'Fake street',
            zip: Zip(12345)
        });

        const match = Type.cata({
            Address: ({city, street, zip}) => `${street}, in ${match(zip)} ${city}`,
            Zip: (num) => num,
            Array: (xs) => xs.join(', '),
            Boolean: (bool) => bool ? 'True!' : 'False!',
            orElse: () => 'Something else was given...'
        });

        expect(match(address)).toBe('Fake street, in 12345 Faketown');
        expect(match([1, 2, 3])).toBe('1, 2, 3');
        expect(match(true)).toBe('True!');
        expect(match(null)).toBe('Something else was given...');
    });
});

    