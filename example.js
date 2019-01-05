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



// interpreterFrom :: (Matrix, Parser) -> Fn a
const interpreterFrom = (m, p) => foldMap(x => p[x[0]](x), m);

// convert :: Matrix -> Parser -> String -> String
const convert = curry((m, parser, str) => {
    const interpreter = interpreterFrom(m, parser);
    const transformer = pipe(Char, map(interpreter.value), prop('value'));
    return fromChars(toChars(str).map(map(map(transformer))));
});



/* ========= TEST ========= */
const encoderMatrix = Matrix(['*2', '+2', '/2']);
const decoderMatrix = Matrix(['*2', '-2', '/2']);

const myEncoder = convert(encoderMatrix, Parser);
const myDecoder = convert(decoderMatrix, Parser);

const encData = myEncoder('Hello world');
console.log(`Encoded: ${encData}`);
console.log(`Decoded: ${myDecoder(encData)}`);