# Monads are welcome!
This is not a complete explanation of what Monads and Monoids are but rather how the `futils` package can support you in gettings things done with a nice
set of standard monads out of the box.

## First things first
Before we start to use the monadic classes shipping with `futils`, here is a quick recap on monads:

A monad is just a container which implements either a `chain, flatMap` or `bind` operation which allows to chain it with functions which return values of the same monadic type.

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

`Maybe` can be used to create a form of code branching without ever writing any `if (null)` check in your code. For this reason it implements to sub types. The first is `Some`, which holds values which are not `undefined` or `null`. The other one is `None` which always holds a `null` value. Here is some example JSON (userInfo.json):

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

let AVATAR_DIR = 'http://www.domain.tld/images/avatars/';
let AVATAR_DEF = 'anonymous.jpg';
let NICKNAME = 'Anonymous';

// getName :: JSON -> String
const getName = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.name)).
        fold(() => NICKNAME,
             (nickname) => nickname);

// getAvatar :: JSON -> String
const getAvatar = (json) => Maybe.of(json).
        flatMap((o) => Maybe.of(o.avatar)).
        fold(() => AVATAR_DIR + AVATAR_DEF),
             (url) => AVATAR_DIR + url);

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

In our bootstrap code we are going to use jQuery as a XHR and DOM helper library. You certainly don't need jQuery to use `futils`, but it takes out some of the hassles. Here is the code (boot.js):

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

$.getJSON('./userInfo.json').then(userInfo).
                             then($body.html.bind($body),
                                  () => $body.html('No information :-('));
```

The nice thing here is though, that we can even pass it `null` and it works:

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');

const $body = $(document.body);

$body.html(userInfo(null));
```

This will render the user information onto the screen after it has loaded it asynchronous. Yippee! But: Have your recognized this weird looking syntax? In our monadic code we used `.fold` with a function to extract the final value from the `Maybe`, but from the promise we have to use `.then` calls, where the last call to `.then` also does line up the types the other way around (from the perspective of `.fold`): The extraction function comes first while the failure function comes last. This makes it easy to oversee to add a failure function in case the operation failed. And one last thing: The Promise returned from `$.getJSON` runs immediatly. There is no other way stopping it from running than calling `.abort` on it if the user data has already been available.

## First attempt
Usually when encountering this problem, one solves it by introducing state. Let's do that. Here is some example code:

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

Nice, this seems to work for now. Ahem, except for the weird syntax mix. Let's raise the difficulty.

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

The most substancial difference between a `Task` and a `Promise` is that a Task is absolutely lazy. It won't run until you call it's `.run` method with a error and a success callback. That's pretty sweet because now missing out on the error handler is quite hard.

As a second result because of it's lazyness, the call to `Promise.race` becomes completely unnessecary. Take a look for youself:

```javascript
const $ = require('jquery');
const {userInfo} = require('./userInfo');
const {Task, Maybe} = require('futils');

const id = 12345;
const $body = $(document.body);

const xhr = (url, data) => new Task((fail, done) => {
    $.getJSON(url, data).then(done, fail);
});

const renderUser = (json) => new Task((rej, res) => {
            if (json) { res(json); }
        })).
        concat(xhr('./userInfo.json', null)).
        concat(xhr('./userinfo.php', {id})).
        map(userInfo);

renderUser(null).run(() => $body.html('No information :-('),
                     $body.html.bind($body));
```

That's it. Can you how all the hard stuff suddenly dissapeared? Calling for one or for many alternatives does not change the code, plus everything is in a nice chain of things to happen. You can read it top to bottom as a bonus, which makes it read like a chain of events: First do this, then concat it with that, then...

The last line has changed just a small amount. Instead of calling  `.then` we call the actual `.run` method of the Task. Notice the change in how that sounds. Calling `.run` actually runs the Task, while the Promise might have beend finished before the function passed to `.then` has been encountered.

Also notice the rearrangement of the arguments passed to `.run`: First the failure handler is called, then the success function. This makes it a lot harder to forget the error handler or skip it on purpose.


---
[Index](./readme.md)






