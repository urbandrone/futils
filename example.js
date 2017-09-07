const {Maybe, liftA2, curry} = require('futils');

// greet :: String -> String -> String
const greet = curry((how, who) => `${how} ${who}!`);



/**
 * Try replacing either the "greetsWith" or "greetsWho"
 * constant with "Maybe.of(null)"
 */

// greetsWith :: Maybe String
const greetsWith = Maybe.of('Hello');

// greetsWho :: Maybe String
const greetsWho = Maybe.of('world');



liftA2(greet, greetsWith, greetsWho).
	cata({
		None: () => 'Who shall I greet?',
		Some: (greeting) => greeting
	});