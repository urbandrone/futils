const {pipe, id, given, not, map, call} = require('futils');
const log = console.log.bind(console);


// ----------
let greeting = 'hello futils user!';

// isLibName :: string -> boolean
const isLibName = (s) => /futils/ig.test(s);

// firstUpper :: string -> string
const firstUpper = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// format1 :: string -> string
const format = given(not(isLibName), firstUpper, id);

// prog :: string -> string
const prog = pipe(call('split', ' '), map(format), call('join', ' '));

let result = prog(greeting);
log(result);
// Should log "Hello futils User!"