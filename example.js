const {pipe, map, exec, given, not, identity} = require('futils');
const log = console.log.bind(console);



// example 1
// ----------
let greeting = 'hello futils user!';

// isLibName :: string -> boolean
const isLibName = (s) => /futils/ig.test(s);

// firstUpper :: string -> string
const firstUpper = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// format1 :: string -> string
const format1 = given(not(isLibName), firstUpper, identity);

const prog1 = pipe(exec('split', ' '), map(format1), exec('join', ' '));

let result1 = prog1(greeting);
log(result1);



// example 2
// ----------
let persons = [
    {name: 'J. Doe', email: 'jdoe@example.com'},
    {name: 'A. Nother', email: 'another.one@example.com'}
];

// escAtSign :: string -> string
const escAtSign = exec('replace', '@', '(at)');

// format :: object -> string
const format2 = pipe((o) => `${o.name} <${o.email}>`, escAtSign);

// runExample1 :: array[object] -> string
const prog2 = pipe(map(format2), exec('join', '\n'));


let result2 = prog2(persons);
log(result2);