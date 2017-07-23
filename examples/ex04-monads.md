# Monads!
Welcome to a tutorial of scary words! After this example, you will be able to use `Functor`s and `Applicative`s as well as the scary M word: `Monad`s. Better than that, we will see some practical examples of how these things can be used to build programs which are more robust, more terse and more self-explaining than usual code.

## First things first
Before we start using the monadic classes shipping with `futils`, here is a quick recap on monads:

A monad is just a container which implements either a `chain, flatMap` or `bind` operation which allows to chain it with functions which return values of the same monadic type. It must also implement the functor interface. We are going to use the native `Array` as a base and extend it further because it is a monoid and it is half of a monad already.

Here is some code to digest:
```javascript
class MyArray extends Array {
    constructor (...args) {
        super();
        args.forEach((a, i) => this[i] = a);
    }
    flatten () {
        return this.reduce((a, v) => a.concat(v), []);
    }
    flatMap (f) {
        return this.map(f).flatten();
    }
    fold (f, a) {
        return this.reduce(f, a);
    }
}
```

And in case you want to know what you can do with it:
```javascript
const list = new MyArray(1, 2, 3, 4);

const monadicOperation = (n, i) => new MyArray(n, i);

list.map(monadicOperation); // -> MyArray([[1, 0], [2, 1], [3, 2], [4, 3]])
list.flatMap(monadicOperation); // -> MyArray([1, 0, 2, 1, 3, 2, 4, 3])
```

We could have done the same with:

```javascript
const list = [1, 2, 3, 4];

const monadicOperation = (n, i) => [n, i];

list.map(monadicOperation); // -> [[1, 0], [2, 1], [3, 2], [4, 3]]

list.map(monadicOperation).
    reduce((a, b) => a.concat(b), []); // -> [1, 0, 2, 1, 3, 2, 4, 3]
```

Before we see `Monad`, there are two other type classes we must see first.

### Functor

![Functor map](./assets/04-monads-functors.png?raw=true "map")

The most simple explanation states that a `Functor` is just a container or box for a value which implements a `map` method. The `map` method must satisfy some laws:
```
forall Functor F
F{a} .map id == id;
F{a} .map f .map g == F{a} .map f >> g
```

### Applicative

![Applicative ap](./assets/04-monads-applicative.png?raw=true "ap")

Building upon a `Functor`, an `Applicative` is a container for curried (when using multiple arguments) functions, which knows how to apply the function to the value in another container.

![Applicative of](./assets/04-monads-of.png?raw=true "of")

You can put values into the box with the static `of` method on the container (this is called a `Pointed` interface) and apply (hence it's name) functions which are inside a container to values inside another container of the same type:
```
forall Functor F => Applicative A
A .of a == F{a} // <- Gives back a Functor
A .of (a → b) == A{(a → b)} // <- Gives back an Applicative

A{(a → b)} .ap F{a} == F{a} .map (a → b)
```

The container or box thing doesn't really fit, but it helps a lot to understand what it does. Normally we'd call all `Functor`s and `Applicative`s a *context*, because it usually has some behaviour attached to it (for example: A list has the attached behaviour to map over each value it contains, while a `Maybe` only maps if it is a `Some` and just doesn't map when it is `None`).

![Generic context](./assets/04-monads-context.png?raw=true "Generic context")

We will see more of it soon. Let's just call all boxes a context.

### Monads

![Monadic flatMap](./assets/04-monads-monad.png?raw=true "flatMap")

A `Monad` is a context, which can sequence calls with `flatMap` and therefor allows you to chain functions which return a context, so you don't end up with nested contexts. All `Monad`s in `futils` implement `flatMap` (sometimes called `bind` or `chain` in other libraries) and `flatten` (most often called `join` or `mjoin`), which takes a nested context and flattens it one level.
```
forall Applicative A => Monad M
M{M{a}} .flatten () == M{a}
M{a} .flatMap (a → M{b}) == M{a} .map (a → M{b}) .flatten == M{b}
```


### Ah – yes.
Just in case that was not enough, here are some more explanations you might find useful to understand monads:

- [Learn You A Haskell](http://learnyouahaskell.com/a-fistful-of-monads)
- [If-Works](https://blog.jcoglan.com/2011/03/06/monad-syntax-for-javascript/)
- The [API Documentation](./readme.md)

## Right, I got it!
The `futils` package ships with a bunch of monadic classes, which you can use in your day-to-day programming and which all serve a certain purpose. For example, here is the `Maybe` monad:

```javascript
const {Maybe} = require('futils');

Maybe.of(1); // -> Some(1)
Maybe.of(null); // -> None;
```

`Maybe` can be used to create a form of code branching without ever writing any `if (null)` check in your code. For this reason it implements two sub types. The first is `Some`, which holds values which are not `undefined` or `null`. The other one is `None` which always holds a `null` value. Here is some example JSON (userInfo.json):

```javascript
{
    'name': 'Nickname',
    'since': '2016-11-01',
    'avatar': 'awesome-avatar.jpg'
};
```

And here is our code to render a profile (userInfo.js):

```javascript
const {Maybe, curry, id, getter} = require('futils');

// default values
// AVATAR_DIR :: String
let AVATAR_DIR = 'http://www.domain.tld/images/avatars/';
// AVATAR_DEFAULT :: String
let AVATAR_DEF = AVATAR_DIR + 'anonymous.jpg';
// NICKNAME :: String
let NICKNAME = 'Anonymous';

// nickname :: JSON -> String
const nickname = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.name)).
        cata({
            None: getter(NICKNAME),
            Some: id
        });

// avatar :: JSON -> String
const avatar = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.avatar)).
        cata({
            None: getter(AVATAR_DEF),
            Some: (url) => `${AVATAR_DIR}/${url}`
        });

// registeredSince :: JSON -> String
const registeredSince = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.since)).
        map((iso) => new Date(Date.parse(iso))).
        map((date) => date.toLocaleDateString()).
        cata({
            None: getter('Guest'),
            Some: id
        });

// userInfo :: JSON -> User HTML
const userInfo = (json) => {
    return `<div class="user">
        <img class="user_avatar" src="${avatar(json)}" alt=""> 
        <span class="user_nickname">${nickname(json)}</span>
        <span class="user_registered_since">${registeredSince(json)}</span>
    </div>`;
}


module.exports = { userInfo };
```

As you can see, everything moves along nicely in some data chains. We "branch" the chains after each operation and either return the actual data or a default value. It all reads top to bottom, no more jumping-around-the-editor and searching-that-damn-variable anymore – it's right there. Just where you were looking for it. Nice.

In our bootstrap code we are going to use jQuery as a XHR and DOM helper library. You certainly don't need jQuery to use `futils`, but it takes out some of the hassles.

The nice thing of our userInfo function is though, that we can even pass it a `null` value and it still works, returning the default values wrapped up in a DOM structure. In case you don't believe me:

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

$body.html(userInfo(null));
```

Here is the usual bootscript one comes up with (boot.js):

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

$.getJSON('./userInfo.json').
    then(userInfo).
    done($body.html.bind($body)).
    fail() => $body.html('Error occurred'));
```

This will render the user information onto the screen after it has loaded it asynchronous. Yay!


## Doing sideeffects with the IO
A good amount of theory in functional programming is based on the fact that all functions should be pure. If your programs are pure, they have the additional benefit that they might be executed in parallel. That's a nice gimmick!

Bad news: The browser is full of stateful APIs which are not pure at all. The `IO` Monad helps us facing these APIs and get purity again into our programs.

It is designed specifically to contain sideeffects and all things which are impure by default. Such as DOM operations.

```javascript
const {IO, Maybe, id, curry, field, concat} = require('futils');

// -- global utilities, suitable to be placed into their own file
const sidefx = curry((f, x) => { f(x); return x; });
const query = curry((s, n) => n.querySelector(s));
const queryAll = curry((s, n) => Array.from(n.querySelectorAll(s)));
const noEvt = sidefx((e) => e.preventDefault());


// -- form reading on submission
const FORM_FIELDS = [
    'input[name=CustomerId]',
    'input[name=OrderId]',
    '.OrderItem'
];

// type OrderItem :: { quantity :: String,
//                     articleId :: String,
//                     articleName :: String }
//
// type Order :: { CustomerId :: String,
//                 OrderId :: String,
//                 items :: [OrderItem] }

// orderItem :: DOM -> OrderItem
const orderItem = (n) => ({
    quantity: n.dateset.orderQuantity,
    articleId: n.dataset.articleId,
    articleName: n.dataset.articleName
});

// _collectFields :: [String] -> DOM -> [DOM]
const _collectFields = curry((xs, n) => xs.
    map((x) => queryAll(x, n)).
    reduce(concat, []);

// _toOrder :: [DOM] -> Order
const _toOrder = (xs) => xs.reduce((acc, x) => {
        if (x.name === 'CustomerId') { acc[x.name] = x.value; }
        else if (x.name === 'OrderId') { acc[x.name] = x.value; }
        else { acc.items.push(orderItem(x)); }
        return acc;
    }, {items: []});


// -- these are the IO definitions. 
const readUserInput = new IO(query('form#mediabasket')).
    map(_collectFields(FORM_FIELDS)).
    map(_toOrder);
    // add more functionality here (map, flatMap, etc.)

const onSubmit = new IO(noEvt).
    flatMap(readUserInput);
    // add more functionality here (map, flatMap, etc.)



// -- here is some example application
const view = curry((state, emit) => {
    return h('form#mediabasket', {on: {submit: onSubmit.run}}, [
        // ... more view stuff
    ]);
});
```


## Getting async with Tasks
Apart from all the great things `Promise` as a native will give us, the most critical thing about it is it's inability to stop once it's running. With `futils` you can wrap each `Promise` up in a `Task` (greatly inspired by the [Folktale](http://folktalejs.org/) library). Why on earth should I do that and how insane is it? Because a `Task` is lazy and `Promises` are not. Oh, and it's reasonable insane:

```javascript
const {Task} = require('futils');
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

const json = new Task((rej, res) => {
    $.getJSON('./userInfo.json').done(res).fail(rej);
});

json.map(userInfo).
    run(() => $body.html('Error occurred'),
        $body.html.bind($body));
```

Instead of calling `then` we `map` functions in the form `(a → b)` over the `Task`. This has the additional benefit of unifying the codebase, since all tasks share their interface with the other monadic types in `futils`.

You might have already noticed it, but if not please note that the `json` task does not run until we tell it to do so by calling `run`. If we map over it, the task knows you want to chain your functions on the value so it does function composition instead of mapping and returns a new `Task`. So you can map and map and map ... Regardless of what you do, `json` just sits there and waits until you say `run`. This takes an error function and a success function and runs the task. 

### Examples
Can you do common `Promise` operations with tasks? Of course:

**Common AJAX via jQuery Promise**
```javascript
const URL = 'https://example.tld'

const ajax = (url, data) => $.ajax({
    method: data ? 'POST' : 'GET',
    dataType: 'json',
    url,
    data
});

// FROM HERE, EVERYTHING LAUNCHES THE MISSILES

// send request, then map over response
ajax(`${URL}/login/user`, {pw: ... }).
    then((user) => ({id: user.uid, name: `${user.fname user.lname}`}))

// send request, then flatMap over the response
ajax(`${URL}/login/user`, {pw: ... }).
    then((user) => ({id: user.uid})). // <- concrete repetition
    then((user) => ajax(`${URL}/avatar/${user.id}`)).
    then((avatar) => ... );
```

Here is the `futils` version of it:

**Common AJAX via Task**
```javascript
const URL = 'https://example.tld'

const ajax = (url, data) => new Task((rej, res) => {
    $.ajax({
        method: data ? 'POST' : 'GET',
        dataType: 'json',
        url,
        data
    }).done(res).fail(rej);
});

// this does not launch the missiles. remember: it
// won't run until you tell it

// send request, then map over response
const logsInUser = ajax(`${URL}/login/user`, {pw: ... }).
    map((user) => ({id: user.uid, name: `${user.fname user.lname}`}))

// send request, then flatMap over the response
const getsUserAvatar = logsInUser. // <- concrete reuse
    flatMap((user) => ajax(`${URL}/avatar/${user.id}`)).
    map((avatar) => ... );

// getting things to "run"
getsUserAvatar.run((error) => ...,
                   (avatar) => ... )
```

Both work nearly identical and it's hard to grasp the difference, so I made it obvious: The `Promise` based version runs immediatly - no way to stop it once it's running.

The `Task` based version works equally, but it doesnt run. This allows us to store it as a constant value and reuse it immediatly.

In case you want to run different Tasks in parallel, the Tasks in `futils` have a static `all` and a static `race` function implemented. `all` takes a bunch of Tasks and returns a Task which resolves when all given Tasks are finished. The `race` method takes a bunch of Tasks and resolves as soon as one of the given Tasks resolves. They work exactly the same like the native `Promise.race` and `Promise.all` functions, but the created Task is evaluated lazily instead of eager.

### Promise compatibility
A `Task` can easily be converted into a `Promise` and vice versa, with the static `Task.fromPromise` and `Task.toPromise` methods. Each instance of a Task additionally has a `toPromise` method implemented, which makes converting a breeze. Please note that a `Task` which is converted into a `Promise` is evaluted immediatly, because that's the execution model of promises.

Make sure to get yourself familiar with `Functor`s, `Applicative`s and `Monad`s, we are going to use them in the next tutorial a lot.

---
[Index](./readme.md)






