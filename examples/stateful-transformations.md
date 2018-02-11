# Stateful transformations
In this tutorial we are going to use another monad from the set of monads the `futils` package gives you: The `State` monad. You'll learn how you can use it to a great effect when computing stateful transformations.

## A problem with simple transformations
Most of the time when using functional programming techniques our programs are written with pure transformations of input values and don't change any global variable or state. Usually we enjoy this because it frees us from having to think about which variable has which value at any point in time.

But in computer programs, there _are some problems which are stateful_ and which need to change some state over time. With pure functions, they are in fact sometimes hard to model and implement without resorting to the usual imperative programming techniques, which is the reason why `futils` tries to lend a helping hand here.

For illustrative purposes, let's create a function `random` which takes a single integer as a base value and returns us a random number and a new base value:
```javascript
const random = (baseInt) => [Math.random() * baseInt, baseInt + 1];
```

Why do we need to return two things? Well, the reason here is that `Math.random()` _may produce the same value when called twice_, so we will use the incremented base value in the next call to ensure the random number changes.

Let's consider we need three random numbers, stored in an array. Looks easy, right? We already have a function which gives us a random value and the only thing left to do is call it three times and put the random numbers into a list! Here's how we could do it:
```javascript
const random = (baseInt) => [Math.random() * baseInt, baseInt + 1];

const threeRandoms = (init) => {
    let [r1, base2] = random(init);  // first random
    let [r2, base3] = random(base2); // second random
    let [r3, base4] = random(base3); // third random
    return [r1, r2, r3];             // return a list of numbers
}

threeRandoms(1); // -> [3.103647, 5.839872, 6.286491]
```

Yeah fine, this seems to work and we are in fact functionally pure! The whole thing is based solely on it's input and returns the same result each time (a list of three numbers, although the numbers may vary). But doesn't it look a bit tedious and somehow very imperative with all that intermediate base values? On top, if we do not pay explicit attention to pass the correct next base value into a call to `random`, we might end up creating the same number twice.

## A more elegant solution
Here's where the `State` monad comes in handy: The purpose of `State` is to hide all that threading of a base value (and the next base values) from us, so we can focus more on the creation of a list of random numbers.

Usually code says more than a thousand words, so here is another example which uses `State` to accomplish the same thing:
```javascript
const {State} = require('futils');

const random = new State((baseInt) => [Math.random() * baseInt, baseInt + 1]);

const threeRandoms = random.flatMap((r1) => {
    return random.flatMap((r2) => {
        return random.map((r3) => [r1, r2, r3]);
    });
});

threeRandoms.run(1); // -> [8.394629, 4.772918, 0.372632]
```

As you can see, we _don't_ have to manually pass the new base value to the next call to `random`, because the monad itself does it under the hood. This  means we have eliminated one more place where errors can be introduced!

## Internals of the State monad
OK, after you have seen how we can _use_ the `State` monad, I guess you want to know how it _works_. In case you don't care and you just want to see more examples of how to use it, feel free to skip this section and go straight to the next one.

### Abstracts
The State monad is some wrapper for functions with this signature, where `s` is the current state and `a` is the result of _a stateful computation_:
```javascript
const fn = (s) => [a, s];
```

In pseudo code, we can describe them like this:
```
s -> [a, s]
```

But where does the `a` come from? Do not worry, you'll see soon. For now, let's focus on the main parts.

If the monad is a wrapper for functions with the above signature, we can just wrap such functions with it, just like we have done in the `random` example above. The thing then becomes this:
```javascript
const {State} = require('futils');

const fn = new State((s) => [a, s]);
```

Now to the `a` part: We cannot pull it from anywhere inside the function and because we want to use functional programming there's only a very little chance it could be some kind of global variable. What choices do we have left? Right, we can _wrap everything with another function_, so the whole thing then becomes:
```javascript
const {State} = require('futils');

const fn = (a) => new State((s) => [a, s]);
```

Let's formalize it: `fn` is a function, which takes some `a` and returns a State monad which does not contain any concrete value but instead holds a _computation_ from some `state` to a pair of `a` and `state`. So `State` is just a wrapper for a function!

If you've read the example about [monads](./monads.md), you have already seen the IO monad and you should see some similarities between `State` and `IO`, because both just wrap functions. And, like the IO monad, when using the State monad we build up a computation which _does not run immediately_ but waits with the execution until we tell it to do so, which is exactly the reason why we had to call `.run` with the initial state in the `random` example code above.

For now the computation we have wrapped does not _do_ anything, it merely takes a value and a state and returns a pair of both. When we actually make a concrete use of the monad in some real examples this is very likely to change, but it is sufficient to explain the core of `State`.

### flatMap
To continue, we take a look at how `.flatMap` works with the State monad. As usual, we use `flatMap` whenever we need to continue a computation which returns another monad of the same type just like we did with `Maybe` and `IO`.

For the next example we create an `entry` function which accepts a string and returns a new state monad. Plus, we define a `mod` function we can use to `flatMap` over the result of `entry` and which takes the first character off of the incoming state and puts it to the end of the string. If that sounds complicated, here is some code:
```javascript
const {State} = require('futils');

const entry = (a) => new State((s) => [a, s]);

const mod = (a) => new State((s) => [a + s[0], s.slice(1)]);

const prog = entry('').
    flatMap(mod).
    flatMap(mod).
    flatMap((ab) => entry('').flatMap(mod).flatMap((c) => entry(c + ab)));

prog.run('abc'); // -> 'cab'
```

Now we can see that the function passed to `.flatMap` takes _the current result value_ and returns a new State monad that contains _the next step of the computation_! I will repeat it, because it is crucial in understanding the internals of the monad: The function passed takes the _result_ and returns _a computation step_.

If you take a closer look, there are already some parts which repeat, so we can factor them out:
```javascript
const {State} = require('futils');

const entry = (a) => new State((s) => [a, s]);

const mod = (a) => new State((s) => [a + s[0], s.slice(1)]);

const shiftAnd = (f) => entry('').flatMap(mod).flatMap(f);

const prog = shiftAnd(mod).flatMap((ab) => shiftAnd((c) => entry(c + ab)));

prog.run('abc'); // -> 'cab'
```

### of
Take a look at the `entry` function: It takes a value and returns an instance of `State` with the given value as result value. It turns out this is exactly what the `.of` method of the State monad is designed to do. We also say `.of` is designed to take a value and _lift_ it into a monadic context. This means we can replace the `entry` function with it and obtain the same result:
```javascript
const {State} = require('futils');

const mod = (a) => new State((s) => [a + s[0], s.slice(1)]);

const shiftAnd = (f) => State.of('').flatMap(mod).flatMap(f);

const prog = shiftAnd(mod).flatMap((y) => shiftAnd((x) => State.of(x + y)));

prog.run('abc'); // -> 'cab'
```

Hooray, less stuff to type!

### run & exec(ute)
By now you know that the State monad is a wrapper for functions which take a state value and return a result value and a state value and that we can build a sequence of transformation steps with it. In all example so far we've called `.run` with some initial state when we wanted to get the result of the computation.

There are in fact times when you _don't_ want the result but rather the new _state_. The State monad of `futils` has a `.exec` method which works just like `.run` but returns the new state value:
```javascript
const {State} = require('futils');

const mod = (a) => new State((s) => [a + s[0], s.slice(1)]);

mod('result: ').run('abc'); // -> 'result: a'
mod('state: ').exec('abc'); // -> 'state: bc'
```

One application for `.exec` is this: If you have a key:value collection you want to alter and then return, you can easily achive it! Take a look at this example:
```javascript
const {State, curry, merge} = require('futils');

const setter = curry((k, v) => new State((s) => [null, merge(s, {[k]: v})]));

const setFoo = setter('foo');
const setBar = setter('bar');

const prog = setFoo(100).flatMap(() => setBar(200));

prog.exec({}); // -> {foo: 100, bar: 200}
```

There are two more ways to extract either the result or the state value: `.fold` and `.foldExec`. Both accept a function as well as some initial state to run the computation with and they are useful to apply either a final transformation or to chain into another operation:
```javascript
const {State, curry} = require('futils');

const mod = (a) => new State((s) => [a + s[0], s.slice(1)]);

const describe = curry((s, v) => `${s} ${v}`);

mod('').fold(describe('result:'), 'abc'); // -> 'result: a'
mod('').foldExec(describe('state:'), 'abc'); // -> 'state: bc'
```

So instead of just prepending some kind of description, we could have passed them into another monad like `Maybe`.

### get and put
So far, whenever we started writing a computation with the help of the State monad we wrote a little helper function which acted as entry point. But we don't need to do so, because `State` offers another way to pull a state out of thin air (so to speak) via a static `.get` method:
```javascript
const {State} = require('futils');

const mod = (a) => new State((s) => [a + s, a * s]);

const prog = State.get().
    flatMap(mod).
    flatMap(mod);

prog.run(3); // -> 15
prog.exec(3); // -> 45
```

It simply doesn't take anything and copies the state value onto the result value position.

The `.put` method does the exact opposite, it takes a value and defines it as the new state value and _discards_ the current value. `.put` is very useful in case you create some type of intermediate result which should become the new state for the next computation, which for example happens in a recursive algorithm like the one we are going to see in the next section.

## Recursive addition
Here is one more example of how `State` can be used: Writing recursive algorithms without using trampolines. This one is simple, it just sums up all given numbers:
```javascript
const {State, first, rest} = require('futils');

const sum = (ns) => {
    if (ns.length < 1) { return State.get(); }
    return State.get().flatMap((s) => {
        return State.put(s + first(ns)).flatMap(() => sum(rest(ns)));
    });
}

sum([1, 2, 3, 4, 5]).run(0); // -> 15
```

Let's examine how it works: When we call `sum` for the first time, the `if` statement is ignored and a fresh `State` is returned which awaits an initial state value. Because we used `.get`, the initial state will be copied internally to the state value as well as to the result value, so we end up with `State 0 0`.

We then `.flatMap` over the _result_ value and return a new `State`. As a consequence of using `.put`, the addition of the initial state and the first number of the list will be our new state value in the next step. This will give us `State null 1`. We again `.flatMap` and _ignore_ the result value (which is `null` anyway) and call `sum` with the rest of the integers which restarts the whole process, meaning the `1` we calculated will be be the _next result_ because `.get` transforms it into `State 1 1`!

As soon as there are no more integers left we run into the `if` statement (our base case which terminates the recursion) and copy the state value to the result value.

> Of course addition isn't the _only_ way to use recursive algorithms with
> the State monad! It would be _perfectly valid_ if, instead of the numbers,
> you'd use a series of something else – for example _functions_, where each
> function operates on the state and produces a new state. Think about it!

## Manipulating a stack
Another example would be modifying a stack. The rules are: You can `push` a value to the top of the stack and `pull` it off of the top. The goal is to reach the bottom of the stack, get the value as result and put the previous values back in correct order.

To make things a bit more interesting, we are going to implement our own `Stack` datatype instead of using an array:
```javascript
const {State, first, rest} = require('futils');

const Stack = (...xs) => ({
    pull() { return [first(xs), Stack(...rest(xs))]},
    push(x) { return [null, Stack(x, ...xs)]; },
    toString() { return `Stack([${xs.join(', ')}])`; }
});

const pushStack = (a) => new State((s) => s.push(a));
const pullStack = () => new State((s) => s.pull());

const prog = pullStack().flatMap((x) => {
    return pullStack().flatMap((y) => {
        return pullStack().flatMap((z) => {
            return pushStack(y).flatMap(() => {
                return pushStack(x).map(() => z);
            });
        });
    });
});

prog.run(Stack(1, 2, 3)); // -> 3
prog.exec(Stack(1, 2, 3)); // -> Stack([1, 2])
```

Hopefully this tutorial gave you a better understanding about `State` and how it can be used to build transformations in a stateful environment. Although the main concept looks a bit difficult on first sight, don't be afraid and just try it! It's a great way of working with local state without having to mention it explicitly, so you can focus more on the main idea instead of the nitty-gritty bits. Have fun!


---
[Index](./readme.md)






