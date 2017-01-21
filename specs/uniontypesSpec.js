const {id, isFunc, isString, isNumber, Type} = require('../futils');
describe('futils/Type module', function () {
    const name = 'No mans land';

    const Street = Type('Street', isString);
    const Zip = Type('Zip', isNumber);
    const Address = Type('Address', {
        name: isString,
        city: isString,
        zip: isNumber,
        street: isString,
        house: isNumber
    });
    
    it('creates new types via the Type constructor', () => {
        expect(isFunc(Street)).toBe(true);
    });

    it('should provide a proper valueOf method', () => {
        expect(Zip(12345) + Zip(200)).toBe(12545);
    })

    it('should not depend on the "new" keyword', () => {
        expect(new Street(name).fold(id)).toBe(Street(name).fold(id));
    });

    it('should not allow to create falsy types', () => {
        try {
            Street(1);
        } catch (exc) {
            expect(exc).toBe('Constructor Street got invalid value 1');
        }
    });

    it('allows to check if a value of some type Type::isType', () => {
        expect(Type.isType(Zip(12345))).toBe(true);
        expect(Type.isType(Street(name))).toBe(true);
        expect(Type.isType(12345)).toBe(false);
    });

    it('implements a catamorphism Type::cata', () => {
        const address = Address({
            name: 'john doe',
            city: 'berlin',
            zip: 12345,
            street: name,
            house: 24
        });

        const match = Type.cata({
            Zip: (zip) => `hey, it's a Zip: ${zip}`,
            Address: (addr) => `here is the address!`,
            orElse: () => 'Something else was given...'
        });

        expect(match(address)).toBe('here is the address!');
        expect(match(Zip(12345))).toBe('hey, it\'s a Zip: 12345');
        expect(match(null)).toBe('Something else was given...');
    });
});

    