const {combinators, decorators, operators} = require('futils');
const {given, not} = decorators;
const {pipe, identity} = combinators;
const {map, call} = operators;


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

const prog = pipe(call('split', ' '), map(format1), call('join', ' '));

let result = prog(greeting);
log(result);
// Should log "Hello futils User!"