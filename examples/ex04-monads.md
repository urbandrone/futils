# Monads!
Welcome to a tutorial of scary words! After this example, you will be able to use `Functor`s and `Applicative`s as well as the scary M word: `Monad`s. Better than that, we will see some practical examples of how these things can be used to build programs which are more robust, more terse and more self-explaining than usual code.

## First things first
Before we start using the monadic classes shipping with `futils`, here is a quick recap on monads. We will start from the ground up so if you already know what a monad is, you can skip these sections.

Here is some code for demonstration purposes:
```javascript
class Container {
    constructor (x) {
        this.value = x;
    }
    map (op) {
        return new Container(op(this.value));
    }
    fold (op) {
        return op(this.value);
    }
}
```

This seems not very useful by now. But look how we can use it to turn this code:
```javascript
const isHtmlDoc = (url) => {
    let parts = url.split('/');
    let docInfo = parts[parts.length - 1];
    let docNameType = docInfo.split('.');
    let docType = docNameType[docNameType.length - 1];
    return /^html/.test(docType);
}
```

Into this:
```javascript
const isHtmlDoc = (url) => new Container(url).
    map((x) => x.split('/')).
    map((x) => x[x.length - 1]).
    map((x) => x.split('.')).
    map((x) => x[x.length - 1]).
    fold((x) => /^html/.test(x));
```

Can you spot the difference? The ladder version works with the minimum state context on each step while the former one introduces some new state by every line.

And here is the second thing: The first version also encourages you the _think about how it works_ because you have to remember every single variable it creates while reading it whereas the second one encourages you the process it _step by step_. The result is that the second version can go away with _not_ naming the intermediate state or more precisely by _naming it abstract_.

Before we dive deeper into monads, we must take a look at some other containers/interfaces first.

### Functor

![Functor map](./assets/04-monads-functors.png?raw=true "map")

The most simple explanation states that a functor is just a container or box for a value which implements a `map` method that takes a function and returns a new functor.

Let's say we have an integer inside a `Container` like the one we defined above. If we `map` a function over it which incements the integer by `1`, we get a new container by with the next integer. This seems fair. But `map` is more general, because it allow the function it takes to go from any type `A` to any type `B` so we can deal with _any_ value.

```javascript
const add1 = (x) => x + 1;

new Container(3).map(add1).map(add1); // -> Container(5)
```

The `map` method must satisfy some laws:
```
map id == id;
map f . map g == map f . g
```

The first one says "If you map a function which returns what it is given, the result is the same as not doing anything".

The second one tells us "First mapping a function f over a container and then mapping a function g over the container is the same as mapping the composition of f and g".

```javascript
const {compose} = require('futils');

const identity = (x) => x; // same as futils "id" function
const add1 = (x) => x + 1;

new Container(3).map(identity); // -> Container(3)

new Container(3).map(compose(add1, add1)); // -> Container(5)
```


### Applicative

![Applicative ap](./assets/04-monads-applicative.png?raw=true "ap")

Building upon a `Functor`, an `Applicative` is a container for curried (when using multiple arguments) functions, which knows how to apply the function to the value in another container.

What does that mean? To understand this, we have to extend our implementation of `Container`:
```javascript
class Container {
    // ... skipped for readability ...
    static of (x) {
        return new Container(x);
    }
    ap (functor) {
        return functor.map(this.value);
    }
    // ... skipped for readability ...
}
```

You can put values into the box with the static `of` method on the container (this is called a `Pointed` interface) and apply (hence it's name) functions which are inside a container to values inside another container of the same type.

```javascript
const add1 = Container.of((x) => x + 1);

add1.ap(Container.of(3)); // -> Container(4)
```

What is that? OK, first things first: The `of` method _lifts_ a value into the container (or the default context - we will discuss this in more detail below). So the first line creates a `Container` which contains a _function_ instead of some integer. The question now is: How can we apply the function to a value which is in _another_ container? By using `ap`!

Here are the laws for applicatives:
```
(Applicative A)
of a ===> A(a)
of (a -> b) ap A(a) ===> A(b)
```

By using a curried function (or some function alike), we can do this more than once:

```javascript
const mult = Container.of((x) => (y) => x * y);

mult.ap(Container.of(3)).ap(Container.of(2)); // -> Container(6)
```

#### The default context
The container or box thing doesn't really fit, but it helps a lot to understand what it does. Normally we'd call all `Functor`s and `Applicative`s a *context*, because it usually has some behaviour attached to it. For example: A list has the attached behaviour to map over each value it contains, while a `Maybe` only maps if it is a `Some` and just doesn't map when it is `None`. Don't worry if you do not know what this means by now, we will see more of it soon. Let's just call all boxes a context.

### Monads

![Monadic flatMap](./assets/04-monads-monad.png?raw=true "flatMap")

A `Monad` is a context, which can sequence calls with `flatMap` and therefor allows you to chain functions which return a context, so you don't end up with nested contexts. All `Monad`s in `futils` implement `flatMap` (sometimes called `bind` or `chain` in other libraries) and `flatten` (most often called `join` or `mjoin`), which takes a nested context and flattens it one level.

Again, extending the `Container` implementation should clarify things:
```javascript
class Container {
    // ... skipped for readability ...
    flatten() {
        return new Container(this.value.value);
    }
    flatMap(op) {
        return this.map(op).flatten();
    }
}
```

You can see it in action here:
```javascript
const mult2 = (a) => Container.of(a * 2);

Container.of(3).map(mult2); // -> Container(Container(6)) - this is bad!

Container.of(3).map(mult2).flatten(); // -> Container(6)

Container.of(3).flatMap(mult2); // -> Container(6)
```

Likewise:
```
(Monad M)
M(M(a)) flatten ===> M(a)
M(a) flatMap (a -> M(b)) ===> M(b)
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

> **Tip**
> If you want to see some live code, take a look at this fiddle:
> [to jsfiddle](https://jsfiddle.net/urbandrone/efrkdbqz/). You have to open
> the browser console to see the output.

```javascript
const {IO, id, curry, field, concat} = require('futils');

// -- global utilities, suitable to be placed into their own file
const sidefx = curry((f, x) => { f(x); return x; });
const query = curry((s, n) => n.querySelector(s));
const queryAll = curry((s, n) => Array.from(n.querySelectorAll(s)));
const noEvt = sidefx((e) => e.preventDefault());
const target = field('target');


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
    reduce(concat, []));

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
    map(target).
    map(readUserInput.run);
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






