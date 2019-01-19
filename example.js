const { adt: {Type},
        monoid: {Fn},
        lambda: {curry, pipe},
        operation: {map, prop, foldMap} } = require('futils');



/********** DATA TYPES **********/

// data Matrix = Matrix (Array String)
const Matrix = Type('Matrix', ['value']);

Matrix.fn.map = function (f) {
    return Matrix(this.value.map(f));
}

Matrix.fn.reduce = function (f, a) {
    return this.value.reduce(f, a);
}


// data Char = Char String
const Char = Type('Char', ['value']);

Char.fn.map = function (f) {
    return Char(String.fromCharCode(f(this.value.charCodeAt(0))));
}



/********** PARSER **********/

// Parser :: Object (String : String -> Fn (Number -> Number))
const Parser = {
    '=': val => Fn(() => Number(val.replace('=', ''))),
    '+': val => Fn(n => n + Number(val.replace('+', ''))),
    '-': val => Fn(n => n - Number(val.replace('-', ''))),
    '*': val => Fn(n => n * Number(val.replace('*', ''))),
    '/': val => Fn(n => n / Number(val.replace('/', '')))
}



/********** FUNCTIONS **********/

// split :: String|Regex -> String -> Array String
const split = curry((mark, str) => str.split(mark));

// join :: String -> Array String -> String
const join = curry((mark, xs) => xs.join(mark));


// toChars :: String -> Array (Array (Array String))
const toChars = pipe(
    split(/\r|\n|\r\n/g),
    map(split(/\s+/g)),
    map(map(split(''))));

// fromChars :: Array (Array (Array String)) -> String
const fromChars = pipe(
    map(map(join(''))),
    map(join(' ')),
    join('\n'));



// interpret :: (Matrix, Parser) -> (Number -> Number)
const interpret = (m, p) => foldMap(x => p[x[0]](x), m).value;

// transform :: (Matrix, Parser) -> (String -> String)
const transform = (m, p) => pipe(Char, map(interpret(m, p)), prop('value'));

// convert :: Matrix -> Parser -> (String -> String)
const convert = curry((m, p) => pipe(toChars, map(map(map(transform(m, p)))), fromChars));



/* ========= TEST ========= */
const encoderMatrix = Matrix(['*2', '+2', '/2']);
const decoderMatrix = Matrix(['*2', '-2', '/2']);

const encoder = convert(encoderMatrix, Parser);
const decoder = convert(decoderMatrix, Parser);

console.log(`Encoded 'Hello world': ${encoder('Hello world')}`);
console.log(`Homomorphism? ${encoder(decoder('Hello world')) === 'Hello world'}`);