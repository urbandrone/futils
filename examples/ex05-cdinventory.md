# A small application
-- Draft

## Prerequisites
...

```
$ npm i -S futils snabbdom
```


## Let's make a "Model"

```javascript
// import some useful stuff
const { Maybe, first, filter, map
        pipe, getter, curry,
        over, set, makeLenses } = require('futils');

/* -- Preparations */
// create a lens under the L namespace. this is handy if you need more lenses
// later on
const L = makeLenses('lps');



/* -- Logic */

// find :: String -> a -> [bs] -> b
const findByKey = curry((p, x) => pipe(filter((y) => y[p] === x), first));
const query = pipe(findByKey('artist'), Maybe.of);

// insert :: x -> [xs] -> [xs, x]
const insert = curry((x, xs) => [...xs, x]);


const exchangeByKey = curry((p, x) => map((y) => y[p] === x[p] ? x : y));
const replace = exchangeByKey('artist');


const sortAlphabeticByKey = curry((p, a, b) => a[p].localeCompare(b[p])); 
const byArtistName = sortAlphabeticByKey('artist');


/* -- Implementations */

// Model :: xs -> Model xs
const Model = (...xs) => {
    return {
        query,
        put({artist, title, released}) {
            const lp = {title, released};
            const newArtist = {artist, lps: [lp]};

            return query(xs).
                map(over(L.lps, insert(lp))).
                fold(() => Model(...xs, newArtist),
                     (a) => Model(...replace(a)(xs)).sort());
        },
        sort() {
            return Model(xs.sort(byArtistName));
        },
        fold(f) {
            return f(xs);
        }
    };
}


module.exports = Model;
```

## And a View

```javascript
const h = require('snabbdom/h').default;


/* -- List of Artists */

// Lp :: {name, released} -> VNode
const Lp = (lp) => {
    return h('li.lp', [
        h('span.lp_name', lp.name),
        h('span.lp_release-date', lp.released)
    ]);
}

// Artist :: {name, lps} -> VNode
const Artist = (artist) => {
    return h('li.artist', [
        h('h2.artist_name', artist.name),
        h('ul.artist_lps', artist.lps.map(Lp))
    ]);
}

// ArtistList :: [Artists] -> VNode
const ArtistList = (artists) => {
    return h('ul.artists', artists.map(Artist));
}



module.exports = ArtistList;
```

## The form
```javascript
const h = require('snabbdom/h').default;
const { reduce, filter, map,
        IO, pipe, getter, curry,
        merge, call, field } = require('futils');


/* -- List of Artists */
const EMPTY = {name: null, value: null};

const toCopiesOf = curry((seed, {name, value}) => merge(seed, {name, value}));

const ReadForm = pipe(
    call('querySelectorAll', 'input'),
    Array.from,
    filter((node) => node.type === 'text' && !!node.value.trim()),
    map(toCopiesOf(EMPTY))
);

const InputEvent = IO.of(pipe(
    call('preventDefault'),
    field('target'),
    ReadForm
));




// ArtistInput :: (ƒ [Artists] -> UserInput -> [Artists]) -> VNode
const ArtistInput = (update) => {
    return h('form.artist_input' [
    // render inputs
    
    // connect via pipe with IO InputEvent
    
    // pass result to update
    ])
}



module.exports = {render};
```

### Theory or subsection inside lesson
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat.



---
[Index](./readme.md)






