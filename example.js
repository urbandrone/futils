const {Maybe, liftA2, curry} = require('futils');

/**
 * Try replacing either the "greeting" or "receiver"
 * constant with "Maybe.of(null)"
 */



// greet :: String -> String -> String
const greet = curry((how, who) => `${how} ${who}!`);

// greeting :: Maybe String
const greeting = Maybe.of('Hello');

// receiver :: Maybe String
const receiver = Maybe.of('world');



liftA2(greet, greeting, receiver).
	cata({
		None: () => 'What should be done?',
		Some: (greeting) => greeting
	});