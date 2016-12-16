# A small DVC application to manage Compact Discs
This time we are going to create a small Data-View-Controller application. I call this style of writing applications Data- instead of Model-View-Controller, because there is no explicit model in the code. All data always has the "current" state and permutations occur one by one via signals which send actions to the controller. The controller then modifies the state and returns a new one which will be the next state rendered. Another way to call it would be Data-View-Modify, choose the one you think is most appropriate.

## Prerequisites
To start, do the usual directory creation and `$ cd` things, then init npm and install `futils` along `snabbdom`:

```
$ npm init
[... answer questions ...]

$ npm i -S futils snabbdom
```

Let's build a small utility engine from both. This helps keeping our code base simple and makes it easier to focus on the real stuff we'd like to do: Writing components!

The utility engine provides two functions:

- render([], DOM, component) → void
- signal(type, payload) → Action

The `render` function takes a array, a DOM node and a component and renders the state into the DOM by replacing the given node with a new one.

To create the new view of the state (e. g.: The new node), `render` passes the given state into the view function of the given component along with an emitter
function which passes actions to the controller.

```javascript
// dvc-app.js
const {curry} = require('futils');
const $ = require('snabbdom');
const classes = require('snabbdom/modules/class');
const props = require('snabbdom/modules/props');
const style = require('snabbdom/modules/style');
const on = require('snabbdom/modules/eventlisteners');

const patch = $.init([classes, props, style, on]);

const render = (state, node, cmp) => {
    const vNode = cmp.view(state, (action) => {
        const next = cmp.controller(state, action);
        render(next, vNode, cmp);
    });
    patch(node, vNode);
}

const signal = curry((type, data) => ({type, data}));

module.exports = { render, signal };
```

Never mind: Even if you don't understand exactly how it works, you will see how a nice and simple architecture which scales well arises from this.

## The App component
We're ready now to create a component! A component is some object, which provides a `view` and a `controller` function which must satisfy these signatures:

#### Signatures

- view(State, Function) → Virtual Node/VNode
- controller(State, Action) → State

Like in `React`, components can be nested to create more complex components. To do this, top level components have to pass the state, the emitter function and all actions which occur into the subcomponent's view and controller functions.

### Data
Here is a preview of the data structure the application handles:

```json
[{
    "name": "Pink Floyd",
    "lps": [
        {"title": "Dark side of the moon"},
        {"title": "Another brick in the wall"},
        {"title": "The division bell"}
    ]
}]
```

It will be a collection of artists, each with a collection of LPs they produced, each with a title under which they are produced. In the end we will be able to view the artists in the list, as well as adding and removing them to and from it. Let's start!

### We need Actions
First off, we need a set of actions to perform on the data. The whole reason we have signals is to instruct the controller what to do to create a new state to render.

```javascript
const Action = {
    Add: Symbol('AddArtist'),
    Remove: Symbol('RemoveArtist'),
    Update: Symbol('UpdateArtist')
};

module.exports = Action;
```


### Let's make a Controller
A controller (or modifier) describes a function which takes in a state and some action, and returns a new state from the data send by the action and the given state.

If that sound's familiar, you might have already seen or used `redux` which uses things called a `reducer` function for the same purpose. The controller itself is a reducer function.

```javascript
const {Maybe, pipe, find, map, curry, filter, field} = require('futils');
const {Add, Remove} = require('./actions');

// these are general tools which are normally placed in their own file
const findBy = curry((x, y, xs) => find((a) => a[x] === y, xs));
const swapBy = curry((x, y, xs) => map((a) => a[x] === y[x] ? y : a, xs));
const remove = curry((x, xs) => filter((a) => a !== x, xs));

// these create new information from passed in data
const newLP = (lp) => ({title: lp});
const newArtist = ({name, lp}) => ({name, lps: [newLP(lp)]});

// these help to update the data
const swapByName = swapBy('name');
const findByName = (a) => Maybe.of(a).map(findBy('name'));

// takes in a state (array) and a action and returns a new altered state
// from both
const controller = (state, {type, data}) => {
    switch (type) {
        case Add:
            return findByName(data.name).
                ap(Maybe.of(state)).
                map((a) => merge(a, {lps: [...a.lps, newLP(data.lp)]})).
                cata({
                    None: () => [...state, newArtist(data)],
                    Some: (a) => swapByName(a, state)
                });
        case Remove:
            return findByName(data.name).
                ap(Maybe.of(state)).
                cata({
                    None: () => state,
                    Some: (a) => remove(a, state);
                });
        case Update:
            return findByName(data.oldName).
                ap(Maybe.of(state)).
                map((a) => merge(a, {name: data.name})).
                cata({
                    None: () => state,
                    Some: (a) => swapByName(a, state)
                });
        default:
            return state;
    }
}



module.exports = controller;
```

### A View
The last thing our component needs to have is a way to view the state. To communicate with the controller, the view can emit signals (Data → Action) about what to do.

Normally you would break this up into smaller functions but it's easer to grasp what happens if you can see the big picture.

```javascript
const {compose, pipe, fold, merge, call, field} = require('futils');
const h = require('snabbdom/h');
const {signal} = require('./dvc-app');
const {Add, Remove, Update} = require('./actions');


// handles clicks on the save button, returns a array of <input> elements
const inputs = pipe(
    call('preventDefault'),
    field('target.parentNode'),
    call('querySelectorAll', 'input[type="text"]')
);

// folds all <input> elements into a hashmap, creating name:value pairs
const namedValues = fold((a, x) => merge(a, {[x.name]: x.value}), {});
const artist = compose(namedValues, Array.from, inputs);

const addArtist = compose(signal(Add), artist);
const updateArtist = (a) => pipe(artist, merge({oldName: a}), signal(Update));


// takes a state to render and a emitter function and sends signals
// through the emitter to the controller
const view = (state, emit) => {
    const type = 'text';
    return h('div.app', [
        h('div.app_head', [
            h('input.textinput',
                {props: {type, name: 'name', placeholder: 'Name'}},
                []),
            h('input.textinput',
                {props: {type, name: 'lp', placeholder: 'LP'}},
                []),
            h('button.btn.submit',
                {on: {click: compose(emit, addArtist)}},
                'Save')
        ]),
        h('div.app_body', state.map((a) => {
            return h('div.artist', [
                h('div.artist_meta', [
                    h('input.textinput',
                        {on: {blur: compose(emit, updateArtist(a.name))},
                        props: {type, name: 'name', value: a.name}},
                        []),
                    h('button.btn', 
                        {on: {click: [emit, signal(Remove, a.name)]}},
                        'Delete')
                ]),
                h('div.aritst_lps', a.lps.map((lp) => {
                    return h('div.lp', lp.title);
                }))
            ])
        }))
    ]);
}

module.exports = view;
```

## Finally: A bootscript
This is the final step to do after creating a component. We pass in some data to the `render` function of our DVC utility and see what it renders:

```javascript
const {render} = require('./dvc-app');
const view = require('./view');
const controller = require('./controller');

// The initial state for demo purposes. You have to add
// a way to load in data from memory or from the network
// at startup as well as a way to persist it if you want
// such features.
const APP_STATE = [{
    'name': 'Pink Floyd',
    'lps': [
        {'title': 'Dark side of the moon'},
        {'title': 'Another brick in the wall'},
        {'title': 'The division bell'}
    ]
}];

window.onload = () => {
    const $node = document.querySelector('#app');
    render(APP_STATE, $node, {view, controller});
}
```



---
[Index](./readme.md)






