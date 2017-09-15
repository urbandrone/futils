const _ = require('../futils');
describe('futils/maths module', () => {
    it('testing add :: n -> n -> n', () => {
        expect(_.add(1, 1)).toBe(2);
        expect(_.add(1)(1)).toBe(2);
    });

    it('testing subtract :: n -> n -> n', () => {
        expect(_.subtract(1, 2)).toBe(1);
        expect(_.subtract(1)(2)).toBe(1);
    });

    it('testing multiply :: n -> n -> n', () => {
        expect(_.multiply(2, 1)).toBe(2);
        expect(_.multiply(2)(1)).toBe(2);
    });

    it('testing divide :: n -> n -> n', () => {
        expect(_.divide(2, 4)).toBe(2);
        expect(_.divide(2)(4)).toBe(2);
        expect(_.divide(0)(1)).toBe(0);
        expect(_.divide(1)(0)).toBe(0);
    });

    it('testing modulo :: n -> n -> n', () => {
        expect(_.modulo(2, 3)).toBe(1);
        expect(_.modulo(2)(3)).toBe(1);
        expect(_.modulo(0)(1)).toBe(0);
        expect(_.modulo(1)(0)).toBe(0);
    });

    it('testing gcd :: n -> n -> n', () => {
        expect(_.gcd(12, 18)).toBe(6);
        expect(_.gcd(0)(18)).toBe(0);
        expect(_.gcd(18)(0)).toBe(0);
    });

    it('testing lcm :: n -> n -> n', () => {
        expect(_.lcm(12, 18)).toBe(36);
        expect(_.lcm(0)(18)).toBe(0);
        expect(_.lcm(18)(0)).toBe(0);
    });
});

    