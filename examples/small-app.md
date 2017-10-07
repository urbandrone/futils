# A small application to manage compact discs
This time we are going to create a small application. There is no explicit model in the code. All data always has the "current" state and permutations occur one by one via signals which send actions to the controller. The controller then modifies the state and returns a new one which will be the next state rendered. Applications of this style usually are created with [redux](http://redux.js.org/) for data flow control/data management and [React](https://facebook.github.io/react/) for rendering the views(model) although the names differ.

> **Live code**
> Want to see some live code? Take a look at
> [this fiddle](https://jsfiddle.net/urbandrone/a9h5cc7n/3/)! Don't worry
> if you do not fully understand how it works, we are going to build a
>  comparable example in this tutorial.

## Prerequisites
To start, do the usual directory creation and `$ cd` things, then init npm and install `futils` along `snabbdom`:

```
$ npm init
[... answer questions ...]

$ npm i -S futils snabbdom
```

Let's build a small utility engine for both. This helps keeping our code base simple and makes it easier to focus on the things we like to do: Writing cool stuff!

The utility engine provides one function: render.

#### Signature
```text
render(State, DOM, Component) → void
```


## What's a component?
A component itself is just a normal `{}` with two functions: `view` and `controller`. This means, you can use all the functional goodies from `futils` to build the routines you need, place them into a object and send that right back into `render`. No joke.

#### Signature
```text
type Component :: {
    view :: (State → (event → Action) → VNode)
    controller :: (State → Action → State')
}
```

The `render` function takes: State (which is the "current" state), a DOM node and a component and renders the state into the DOM by replacing the given node with a new one. It does it recursivly and advances with each interaction. 

To create the new view of the state (e. g.: The new node), `render` passes the given state into the view function of the given component along with an emitter
function which passes actions to the controller. Once the controller function has collected the actual state and an action given through the emitter, it produces a new state. We'll focus on this in a second.

```javascript
// render :: State → DOM → Component → ()
const render = (state, node, cmp) => {
    // vNode is new visual representation of state produced by the view
    //   function. when designing it, we have access to a state and emit
    //   argument, where emit is a function with signature (Action → ())
    const vNode = cmp.view(state, (action) => {
        // this is the body of the emitter function.
    });
    patch(node, vNode);
}
```

As soon as the view function produces a new virtual DOM it is patched to the screen and the user views a new screen.

Now, what happens in the emitter? The emitter is the other key thing to understand because it work "asynchronous" by waiting for user interactions. If you take a look at the `Component` definition, the emitter is just the `(event -> action)` part which will be bound later to eventhandlers.

And what happens inside the body of the emitter? The current state is passed into the controller function alongside the action which occured. The component function is implemented as a reducing function (hint: a `reducer`) which constructs a new state from both. after that, it recursivly call `render` with a new state, the VNode produced by `view` and the component. And around it goes.


```javascript
// <root>/utils/render.js
const {curry} = require('futils');
const snabbdom = require('snabbdom');
const classes = require('snabbdom/modules/class');
const props = require('snabbdom/modules/props');
const style = require('snabbdom/modules/style');
const on = require('snabbdom/modules/eventlisteners');

const patch = snabbdom.init([classes, props, style, on]);

// signal :: Symbol → a → Action
const signal = curry((type, data) => ({type, data}));

// render :: State → DOM → Component → ()
const render = curry((curState, node, cmp) => {
    const vNode = cmp.view(curState, curry((type, data) => {
        const nextState = cmp.controller(curState, signal(type, data));
        render(nextState, vNode, cmp);
    }));
    patch(node, vNode);
});

module.exports = { render, signal };
```

You will see how a nice and simple architecture which scales well arises from this. It is especially suited if you want to build your UI with composable and reusable components, as it allows for fine grained control over them while also keeping them nice, clean and small.

## Async
Our utility is fine as it is if you always ever want to work with code which never runs async, because all incoming actions have to produce a state immediatly when they occur and cannot handle the edge case of nothing coming in (like for example by using callback functions). As you can see, this problem is getting serious.

Is there a tool already at our hand we can use for asynchonicity? Of course there is: A `Task`! Let's define a function `taskify`, which takes in any input (say `a`) and returns it as a `Task Error a` (the error here is implicit, because everything concerning asynchonicity may produce errors. Let's just say `Task a` from now on). It has to handle two different cases: If `a` already is a `Task` it just gives it back. If `a` is anything else, it puts it into a `Task`.

```text
taskify :: forall a. a -> Task Error a
taskify :: Task Error a -> Task Error a
```

This sounds like a `if-else` statement, right? We can use `ifElse` from futils here. It takes three functions: A predicate function, a function which handles the success case and a function which handles the error case and merges all of them into a single function.

We use the static `Task.is` method from the `Task` monad as predicate. The success handler is just `id` (also called the identity function). For the error handler we use `Task.of`. You can read more about the `Task` monad in [example 04](./ex04-monads.md). That's cool, because now we may return asynchronous stuff (as a `Task a`) which produces a new state and rerender the whole application when the final data arrives.

We also need some way to reduce a bunch of controller functions into a single controller function. This sounds to me like a `fold` (which is what reduce does: it folds stuff down from many things into one).

I think `foldControllers` sound better than `foldFolds` so let's use that. Here is it's signature:

```text
Controller :: forall a b. (a -> b -> a')

foldControllers :: (State -> Action -> State) ... -> (State -> Action -> State)
```
The final code can be seen below:

```javascript
// <root>/source/helpers/dvc.js
const {Task, curry, pipe, fold, ifElse} = require('futils');
const snabbdom = require('snabbdom');
const classes = require('snabbdom/modules/class').default;
const props = require('snabbdom/modules/props').default;
const style = require('snabbdom/modules/style').default;
const on = require('snabbdom/modules/eventlisteners').default;

const patch = snabbdom.init([classes, props, style, on]);

// taskify :: a → Task a
const taskify = ifElse(Task.is, id, Task.of):

// signalize :: (Action → State) → ActionType → a → ()
const signalize = curry((f, type, data) => f({type, data}));

// render :: State → DOM → Component → ()
const render = curry((state, node, cmp) => {
    // vNode is a new virtual representation of the state
    // as a virtual DOM node
    const vNode = cmp.view(state, signalize((action) => {
        // creates the new state produced by the controller.
        // by wrapping it in a Task, we are free to do async
        //   actions in the controller and return them which
        //   will resolve them automatically
        // fold executes the computation and fails silently or
        //   produces a new state and calls render with it
        taskify(cmp.controller(state, action)).
            fold(() => null, // <- place (Error → ()) here (logging, etc.)
                (nstate) => render(nstate, vNode, cmp));
    }));
    patch(node, vNode);
});

// foldController :: [(State → Action → State)] → (State → Action → State)
const foldControllers = (...cs) => curry((state, action) => {
    return fold((s, c) => c(s, action), state, cs);
});

module.exports = { render, foldControllers };
```

> **Counter**
> Every now and then you will find a simple "counter" example for a library
>  which demonstrates how a really simple component can be build with the
> library. Here is the futils version: [jsfiddle](https://jsfiddle.net/urbandrone/gdt2t9gn/1/)

## The App component
We're ready now to create a component! As said before, a component is an object which provides a `view` and a `controller` function with these signatures:

#### Signatures
```text
view(State, (a -> Action)) → VirtualDOM

controller(State, Action) → State
```

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

Remember the signalize function? It received a action as argument which itself has a type (the Symbol) and some data attached to it.


### Let's make a Controller
A controller (or modifier) describes a function which takes in a state and some action, and returns a new state from the data send by the action and the given state.

To separate our code a bit better, we push some functions into their own file as they could be useful somewhere else.

#### General utilities
```javascript
// file: ./helpers.js
const {find, map, curry, filter} = require('futils');

// findBy :: a → a → bs → b
const findBy = curry((x, y, xs) => find((a) => a[x] === y, xs));

// swapBy :: a → b → bs → bs
const swapBy = curry((x, y, xs) => map((a) => a[x] === y[x] ? y : a, xs));

// remove :: a → as → as
const remove = curry((x, xs) => filter((a) => a !== x, xs));

module.exports = {findBy, swapBy, remove};
```

If the signature of the controller function looks familiar, you might have already seen or used `Redux` which uses things called `reducer` functions for the same purpose. The controller itself is a reducer function. This is the logic:

```javascript
const {Maybe, curry} = require('futils');
const {Add, Remove, Update} = require('./actions');
const {findBy, swapBy, remove} = require('./helpers');

// these create new information from passed in data
 
// newLP :: String → LP
const newLP = (lp) => ({title: lp});

// newArtist :: Object → Artist
const newArtist = ({name, lp}) => ({name, lps: [newLP(lp)]});


// these help to update the state

// swapByName :: Artist → [Artist] → [Artist] 
const swapByName = swapBy('name');

// findByName :: Some (a → bs → b)
const findByName = Maybe.of(findBy('name'));

// takes in a state (array) and a action and returns a new state

// controller :: State Action → State
const controller = (state, {type, data}) => {
    switch (type) {
        case Add:
            // adding serves two purposes at once. it adds
            //   new artists with their first LP, or it updates
            //   the LPs of a already existing artist. if you
            //   understand this one, the others will look very
            //   familiar
            return findByName.ap(Maybe.of(data.name)).
                ap(Maybe.of(state)).
                // simply pretending there is a match, we extend the list
                //   of LPs of that matched artist with a new LP. this
                //   produces a new artist
                map((a) => merge(a, {lps: [...a.lps, newLP(data.lp)]})).
                cata({
                    // if None returned, we consider that there is no
                    //   artist and the given one was a new band
                    None: () => [...state, newArtist(data)],
                    // if Some returns, it is the concrete artist so
                    //   we swap it with the one currently in state
                    Some: (a) => swapByName(a, state)
                });

        case Remove:
            return findByName.ap(Maybe.of(data.name)).
                ap(Maybe.of(state)).
                cata({
                    None: () => state,
                    Some: (a) => remove(a, state);
                });

        case Update:
            return findByName.ap(Maybe.of(data.oldName)).
                ap(Maybe.of(state)).
                map((a) => merge(a, {name: data.name})).
                cata({
                    None: () => state,
                    Some: (a) => swapByName(a, state)
                });

        default:
            // this one is actually important! if no case matched, we
            //   have to ensure we return the untouched state
            return state;
    }
}



module.exports = controller;
```

### A View
The last thing our component needs to have is a way to view the state. To communicate with the controller, the view can emit signals (Data → Action) about what to do.

Normally you would break this up into smaller functions (or subcomponents) but it's easer to grasp what happens if you can see the big picture.

```javascript
const {compose, pipe, fold, merge, call, prop} = require('futils');
const h = require('snabbdom/h');
const {Add, Remove, Update} = require('./actions');


// handles clicks on the save button, returns a array of <input> elements
const inputs = pipe(
    call('preventDefault'),
    prop('target.parentNode'),
    call('querySelectorAll', 'input[type="text"]')
);

// folds all <input> elements into a hashmap, creating name:value pairs
// keyVals :: {} → [a{name: String, value: *}] → {}
const keyVals = fold((a, x) => merge(a, {[x.name]: x.value}), {});

// artist :: Event → {}
const artist = compose(keyVals, Array.from, inputs);

// xfArtist :: a → {}
const xfArtist = (a) => pipe(artist, merge({oldName: a}));


// takes a state to render and a emitter function and sends signals
// through the emitter to the controller

// view :: State, (Event → Action Intent) → vNode
const view = (state, emit) => {
    const type = 'text';
    return h('div.app', [
        // the head contains the form elements to add a artist
        h('div.app_head', [
            h('input.textinput',
                {props: {type, name: 'name', placeholder: 'Name'}},
                []),
            h('input.textinput',
                {props: {type, name: 'lp', placeholder: 'LP'}},
                []),
            h('button.btn.submit',
                {on: {click: compose(emit(Add), artist)}},
                'Save')
        ]),
        // the body is just a wrapper for the artists (pure
        //   state representation)
        h('div.app_body', state.map((a) => {
            return h('div.artist', [
                h('div.artist_meta', [
                    // meta of the artist allows to update the artist
                    h('input.textinput',
                        {on: {blur: compose(emit(Update), xfArtist(a.name))},
                        props: {type, name: 'name', value: a.name}},
                        []),
                    // a button to remove the artist
                    h('button.btn', 
                        {on: {click: [emit(Remove), a.name]}},
                        'Delete')
                ]),
                // list all the LPs attached to the artist
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
// such features. we handle that in upcoming examples
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






