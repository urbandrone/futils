# Currying and partial application
Sometimes it is useful to create functions which can consecutively consume their arguments, so that you can pass them around and set all parameters step-by-step instead of giving them all at once.

## curry
The curry decorator is for such a case. It consumes a function and returns a new function, which consecutively consumes parameters until it has enough arguments collected to execute the function initially given.

Let's use a little bit of example code to illustrate this. Normally if you write a function which takes more than a single argument, the only "native" way in JavaScript to execute it without getting errors (or at least the wrong result) is to call it with the same number of parameters as the number of arguments the function takes (also called a functions _arity_). 
```javascript
const add = (a, b) => a + b;

// check:
add(1, 1); // -> 2
add(1); // -> NaN
add('hello '); // -> 'hello undefined'
```

Let's see what happens, if instead we wrap the `add` function with curry:
```javascript
// calc.js
const {curry} = require('futils');

const add = curry((a, b) => a + b);

// check:
add(1, 1); // -> 2
add(1); // -> function
add('hello '); // -> function
```

This is interesting: If a function wrapped in curry receives not enough arguments, it just defers the execution and instead returns a new function which consumes more arguments. It does this, until it has enough parameters collected to execute. This allows us, to create more specialized functions by just passing in _some_ of the arguments while leaving the rest of it open:
```javascript
const add2 = add(2);
add2(3); // -> 5

const sayHello = add('hello ');
sayHello('world'); // -> 'hello world'
```

"But", you might say, "all of this could have been done by calling `Function.prototype.bind`, too". That's correct!
```javascript
const add = (a, b) => a + b;

const sayHello = add.bind(null, 'hello ');
sayHello('world'); // -> 'hello world'
sayHello.length; // -> 1
```

Let's make the above example a bit more complicated to demonstrate the difference between `curry` and `bind`. While it is in fact true that one can use partial application by using `bind`, it has some drawbacks:

1. You _have to_ specify a context, even if it is `null`
2. You can only skip _the first_ invocation but not subsequent ones without having to use `bind` again

The `curry` combinator does not have these problems:
```javascript
const add = curry((a, b) => a + b);

const sayHello = add('hello ');
sayHello()()()()('world'); // -> 'hello world'
sayHello.length; // -> 1
```

## partial
Now that you've seen how to use curry, let's take a look on how to use it's cousine `partial`. As shown above, one can use `curry` to skip the execution of a function while passing argument after argument to it. But what if you want to preset some arguments, but leave the rest untouched? Take this function for example:
```javascript
const msg = (receiver, sender, text) => {
    return `${sender} said "${text}" to ${receiver}`;
}
```

How would you preset the sender argument while skipping the receiver _and_ the text arguments? The `curry` (as well as `curryRight`) combinator cannot be used for this, because there is no way to skip the receiver and define the sender first.

The most simple answer to this would be to _change the position_ of the parameters so that the sender has to be passed in first. This certainly would be possible for single scripts or such ones that have not been used extensively in other scripts. But given the `msg` function is already in use in some other code, changing the position of the arguments would require you to change _every invocation_ of `msg` in other parts of your system. If the system is big enough, maybe you do not even know which modules of it use which other module's functions.

`futils` provides the `partial` and `partialRight` combinators for these functions, which both allow to define "holes" in function calls by passing in `undefined` instead of the value:
```javascript
const {partial} = require('futils');

const msg = (receiver, sender, text) => {
    return `${sender} said "${text}" to ${receiver}`;
}

const johnsMsg = partial(msg, undefined, 'John');

johnsMsg('Steven', 'Partial application is awesome!');
// -> 'John said "Partial application is awesome!" to Steven'
```

And even better: Giving `undefined` to a function which has some parameters already defined via `partial` defers the invocation further:
```javascript
const {partial} = require('futils');

const msg = (receiver, sender, text) => {
    return `${sender} said "${text}" to ${receiver}`;
}

const johnsMsg = partial(msg, undefined, 'John');

const johnsMsgTo = johnsMsg(undefined, 'Partial application is awesome!');

johnsMsgTo('Steven');
// -> 'John said "Partial application is awesome!" to Steven'
```

## Other basic tools
There are some other basic tools in `futils` you should know about. Apart from curry and partial, the ones used most often are:

- pipe & compose → Function domain
- map, filter & fold → Array domain
- prop, merge & call → Object domain

Here are some examples from each to wet your appetite. Each example shows a simple application from the functions in each domain.

### Function composition (pipe/compose)
We will start with `pipe`. It takes two up to N functions and pipes the result from calling the first function to the second function and so on and returns the result of calling the last function. It is **the** basic building block in functional programming and can be found everywhere.

Next to pipe is `compose`, which works exactly the same way (it clues functions together) but it does so by doing right composition of functions. 

```javascript
const {pipe, toUpper, trim} = require('futils');

// trimUpper: String → trim → toUpper → String
const trimUpper = pipe(trim, toUpper);

trimUpper('   shout! '); // -> 'SHOUT!'
```

### Array mutation
Now that you know that much about functions, let's move on to arrays and what we can do with them.

```javascript
const {pipe, curry, map, filter, fold} = require('futils');

const isSome = (a) => a != null;
const add = curry((a, b) => a + b);

// sum: Array → filter(!!) → map(+1) → fold (+) 0
const sum = pipe(filter(isSome), map(add(1)), fold(add, 0));

sum([1, 2, 3, 4, 5]); // -> 15
sum([1, null, undefined, 4, 5]); // -> 10
```

Isn't that great? We packed three operations into a single function which works on a list of numbers and/or `null` and/or `undefined` values and returns the sum of all of the numbers or zero. All in one line!

Imagine there exists a world, where for each value `A` a corresponding `B` exists, and our functions are just mappings in the form `A` → `B`. Then you'd be able to construct all programs you will ever build with this set of functions you already have. The good news is: In programming the possibility exists to create everything, even from nothing. Therefor you can build all needed mappings yourself if they do not exist. `futils` helps you with that.

### Object interaction
Sooner or later, everyone needs to interact with some object's API. Here are some helpers from `futils` to interface them:

```javascript
const {pipe, merge, prop, call} = require('futils');

// you can merge objects together, which creates a new object
merge({a: 1}, {b: 2}); // -> {a: 1, b: 2}

// or call methods and access fields
const handleEvent = pipe(
    call('preventDefault'),
    prop('target.value')
);
```

These are some of the many basic building blocks provided by the library.

## Next parts
In upcoming tutorials, you will see how to use `futils` in other, more advanced situations. You will be introduced to other concepts and aspects like lenses, transducers and monads.



---
[Index](./readme.md)






