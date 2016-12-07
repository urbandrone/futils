# Monads!
This is not a complete explanation of what Monads and Monoids are but rather how the `futils` package can support you in gettings things done with a nice
set of standard monads out of the box.

## First things first
Before we start to use the monadic classes shipping with `futils`, here is a quick recap on monads:

A monad is just a container which implements either a `chain, flatMap` or `bind` operation which allows to chain it with functions which return values of the same monadic type. It must also implement the functor interface, which means it must implement a `.map` method. We are going to use the native `Array` as a base and extend it further because it is a monoid and it is half of a monad already.

Here is some code to digest:
```javascript
class MyArray extends Array {
    flatten () {
        return this.reduce((a, v) => a.concat(v), []);
    }
    flatMap (f) {
        return this.map(f).flatten();
    }
    fold (f) {
        return this.reduce(f, null);
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
const {Maybe, curry, id} = require('futils');

// default values
// AVATAR_DIR :: String
let AVATAR_DIR = 'http://www.domain.tld/images/avatars/';
// AVATAR_DEFAULT :: String
let AVATAR_DEF = AVATAR_DIR + 'anonymous.jpg';
// NICKNAME :: String
let NICKNAME = 'Anonymous';

// getName :: JSON -> String
const getName = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.name)).
        fold(() => NICKNAME, id);

// getAvatar :: JSON -> String
const getAvatar = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.avatar)).
        fold(() => AVATAR_DEF), (url) => AVATAR_DIR + url);

// getRegDate :: JSON -> String
const getRegDate = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.since)).
        map((iso) => new Date(Date.parse(iso))).
        map((date) => date.toLocaleDateString()).
        fold(() => '', id);

// userInfo :: JSON -> User HTML
const userInfo = (json) => {
    return `<div class="user">
        <img class="user_avatar" src="${getAvatar(json)}" alt=""> 
        <span class="user_nickname">${getName(json)}</span>
        <span class="user_registered_since">${getRegDate(json)}</span>
    </div>`;
}


module.exports = { userInfo };
```

As you can see, everything moves along nicely in something like a chain of events. We "branch" the case after each operation and either return the actual data or a default value.

In our bootstrap code we are going to use jQuery as a XHR and DOM helper library. You certainly don't need jQuery to use `futils`, but it takes out some of the hassles.

The nice thing of our userInfo function is though, that we can even pass it a `null` value and it still works, returning the default values wrapped up in a DOM structure:

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

$body.html(userInfo(null));
```

Here is the code (boot.js):

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

$.getJSON('./userInfo.json').then(userInfo).
                             then($body.html.bind($body),
                                  () => $body.html('No information :-('));
```

This will render the user information onto the screen after it has loaded it asynchronous. Yay!

But: Have your recognized the somehow weird looking syntax? In our monadic code we used `.fold` with a function to extract the final value from the `Maybe`, but from the promise we have to use `.then` calls, where the last call to `.then` also does (from the perspective of `.fold`) line up the types the other way around: The extraction function comes first while the failure function comes last. This makes it easy to oversee to add a failure function in case the operation failed. And one last thing: The Promise returned from `$.getJSON` runs immediatly.

## First attempt
Usually when encountering these problems, one solves it by introducing state. Let's do that. Here is some example code:

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

const xhr = () => $.getJSON('./userInfo.json').then(userInfo);

const renderUser = (user) => {
    if (user) {
        return { then(f) { return f(userInfo(user)); } }
    }
    return xhr();
}

renderUser({}).then($body.html.bind($body),
                    () => $body.html('No information :-('));
```

Nice, this seems to work for now. Ahem, except for the weird syntax mix. We wrapped up everything into a function and there it is: Code which works as expected. Let's raise the difficulty.

## More difficult
Say you'd have two choices from where to get the data if it is not already existent. To solve this, we will have to introduce some code into our precious little program.

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const id = 12345;
const $body = $(document.body);

// xhr :: String, Object -> Promise
const xhr = (url, data) => $.get(url, data).then(userInfo);

// renderUser :: Object -> Promise
const renderUser = (user) => {
    if (user) {
        return { then(f) { return f(userInfo(user)); } }
    }
    return Promise.race([
        xhr('./userInfo.json', null),
        xhr2('./user/info.php', {id})
    ]);
}

renderUser(null).then($body.html.bind($body),
                      () => $body.html('No information :-('));
```

I won't show you the code necessary in case you cannot use `Promise.race` because it's insane.

## With Task
OK, that wasn't too bad. This time we are going to solve the problem with the help of a monad called `Task`. You may also have heard of it under the term of a `Future`.

The most substancial difference between a `Task` and a `Promise` is that a Task is lazy. It won't run until you call it's `.run` method with a error and a success callback. That's pretty sweet because now missing out on the error handler is quite hard.

Because of it's lazyness, the call to `Promise.race` becomes completely unnessecary because we are able to `.concat` Tasks together and retrieve another Task which selects the fastest of the concatenated Tasks. Take a look for youself:

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');
const {Task, Maybe} = require('futils');

// ID :: Number
const ID = 12345; // ID of current user

// $body :: jQuery(body)
const $body = $(document.body);

// print :: String -> jQuery(body)
const print = $body.html.bind($body);

// xhr :: String, Object -> Task(JSON)
const xhr = (url, data) => new Task((fail, done) => $.getJSON(url, data).
                                                         then(done, fail));

// renderUser :: JSON -> Task(DOMString)
const renderUser = (json) => new Task((rej, res) => json ? res(json) : void 0).
        concat(xhr('./userInfo.json')).
        concat(xhr('./userinfo.php', {ID})).
        map(userInfo);

// this line runs the computation and either prints "No info" or
//   renders the created DOM with all available userinformation
//   into the body of the document
renderUser(null).run(() => print('No info'), print);
```

That's it. Can you how all the hard stuff suddenly dissapeared? Calling for one or for many alternatives does not change the code, plus everything is in a nice chain of things to happen. You can read it top to bottom: First do this, then concat it with that, then...

The last line has changed by a small amount. Instead of calling  `.then` we call the `.run` method of the Task. Notice the change in how that sounds. Calling `.run` actually runs the Task, while the Promise might have beend finished before the function passed to `.then` has been encountered.

Also notice the rearrangement of the arguments passed to `.run`: First the failure handler is called, then the success function. This makes it a lot harder to forget the error handler.


---
[Index](./readme.md)





