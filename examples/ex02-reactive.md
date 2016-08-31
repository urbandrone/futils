# Use with reactive streams
In this example we will see how to use `futils` together with reactive streams and asynchronous data fetching. There are many implementations of reactive streams, but we are going to use [Kefir](https://rpominov.github.io/kefir/) for now.

## Before we can start
To get started, install `Kefir`, `node-fetch` and `futils` into a new directory. You can install all of them from NPM:
```
npm install futils --save-dev
npm install kefir --save-dev
npm install node-fetch --save-dev
```

Then create a new `.js` file inside that directory with the following contents:
```javascript
const fetch = require('node-fetch');
const rx = require('kefir');
const f = require('futils');
```

## Getting a list of repos
For now, we want to show a list of all repositories a specific Github user has and then print the name of each as well as the URL to the console. So let's start:
```javascript
const fetch = require('node-fetch');
const rx = require('kefir');
const f = require('futils');

let URL = 'https://api.github.com/users/octocat/repos';

const fetchRepos = (url) => rx.fromPromise(fetch(url));
```

How does this work? The `fetchRepos` function takes a URL parameter and it passes that parameter to `fetch`, which is a function which returns a promise when passed in a URL. We pass this promise directly into the `.fromPromise` method of Kefir to create a observable stream of it and return that instead of the promise.

Since `fetch` in contrast to the older `XMLHttpRequest` or Node's `http` returns a promise which contains a `Response` object which has to be converted to the result output, we can write ourself a small helper to do that.
```javascript
...

let URL = 'https://api.github.com/users/octocat/repos';

const fetchRepos = (url) => rx.fromPromise(fetch(url));

// toJson :: Response -> JSON
const toJson = f.exec('json');

fetchRepos(URL).
    map(toJson);
```

## Displaying the result
Now that we have a way to fetch data and parse it to JSON, all that's left to do is creating a way to display the results. For this we use the following:
```javascript
...

const fetchRepos = (url) => rx.fromPromise(fetch(url));

// toJson :: Response -> JSON
const toJson = f.exec('json');

// render :: array[JSON] -> array[string]
const render = f.map((repo) => `${repo.name}: ${repo.html_url}`);

// join :: array[string] -> string
const join = f.exec('join', '\n');

fetchRepos(URL).
    map(toJson).
    map(render).
    map(join).
    onValue(console.log.bind(console)).
    onError(console.error.bind(console));
```

But wait, we can do better than that. For example, let's reduce the number of times we `.map` over the result stream by simply piping the functions into one function which can be mapped in one go:
```javascript
...

fetchRepos(URL).
    map(f.pipe(toJson, render, join)).
    onValue(console.log.bind(console)).
    onError(console.error.bind(console));
```

## Done
That's it! Here is the complete example code:
```javascript
const fetch = require('node-fetch');
const rx = require('kefir');
const f = require('futils');

let URL = 'https://api.github.com/users/octocat/repos';
const fetchRepos = (url) => rx.fromPromise(fetch(url));

// toJson :: Response -> JSON
const toJson = f.exec('json');

// render :: array[JSON] -> array[string]
const render = f.map((repo) => `${repo.name}: ${repo.html_url}`);

// join :: array[string] -> string
const join = f.exec('join', '\n');

fetchRepos(URL).
    map(f.pipe(toJson, render, join)).
    onValue(console.log.bind(console)).
    onError(console.error.bind(console));
```

---
[Index](./readme.md)






