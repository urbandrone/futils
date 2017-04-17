# Contacts list
This time we are going to build a small application which allows to manage a list of contacts. We will see how to integrate more advanced stuff like DB interaktion and asynchronous stuff. It builds mainly on the architecure we've seen in [example 5](./ex05-cdinventory.md) and shows how to split your applications into more/smaller subcomponents instead of one big. Have fun!

## Folder structure
This is the folder structure we use:

```
<root>
    |- source
    |   |- components
    |   |   |- component_a
    |   |   |   |- component.css
    |   |   |   |- actions.js
    |   |   |   |- controller.js
    |   |   |   |- view.js
    |   |   |   |- helpers.js
    |   ...
    |   |- helpers
    |   |   |- dvc.js
    |   |   |- db.js
    |   |   |- dom.js
    |   |- App.js
    |   |- boot.js
    |- tests
    |   |- unit tests
    |- docs
    |   |- documentations
    |- builds
    |   |- build stuff
    |- index.html
    |- index.js
```

## DVC Utility extended
Remembering the DVC utility module we defined in [example 05](./ex05-cdinventory.md)? It is fine as it is if you always ever want to work with code which never runs async, because all incoming actions have to produce a state immediatly when they occur and cannot handle the edge case of nothing coming in (like for example by using callback functions). As you can see, this problem is getting serious.

Is there a tool already at our hand we can use for asynchonicity? Of course there is: A `Task`! Let's define a function `async`, which takes in any input (say `a`) and returns it as a `Task Error a` (the error here is implicit, because everything concerning asynchonicity may produce errors. I'll say just `Task a` from now on). It has to handle two different cases: If `a` already is a `Task` it just gives it back. If `a` is anything else, it puts it into a `Task`.

```text
async :: a -> Task Error a
async :: Task Error a -> Task Error a
```

This sounds like a `if-else` statement, right? We can use `given` from futils here. It takes three functions: A predicate function, a function which handles the success case and a function which handles the error case and merges all of them into a single function.

We use the static `Task.is` method from the `Task` monad as predicate. The success handler is just `id` (also called the identity function). For the error handler we use `Task.of`. You can read more about the `Task` monad in [example 04](./ex04-monads.md). That's cool, because now we may return asynchronous stuff (as a `Task a`) which produces a new state and rerender the whole application when the final data arrives.

We also need some way to reduce a bunch of controller functions into a single controller function. This sounds to me like a `fold` (which is what reduce does: it folds stuff down like many things into one).

I think `foldControllers` sound better than `foldFolds` so let's use that. Here is it's signature:

```text
forall Controller :: (a -> b -> a')

foldControllers :: (State -> Action -> State) ... -> (State -> Action -> State)
```
The final code can be seen below:

```javascript
// <root>/source/helpers/dvc.js
const {Task, curry, pipe, fold, given} = require('futils');
const snabbdom = require('snabbdom');
const classes = require('snabbdom/modules/class');
const props = require('snabbdom/modules/props');
const style = require('snabbdom/modules/style');
const on = require('snabbdom/modules/eventlisteners');

const patch = snabbdom.init([classes, props, style, on]);

// async :: a → Task a
const async = given(Task.is, id, Task.of):

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
        async(cmp.controller(state, action)).
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

## The initial state
The initial state appears to be a Object `{}` with two field:

* A user field
* A contacts field

The user field itself will be a object with this shape:

```javascript
{
    id: Number,
    name: String,
    email: String
}
```

The contacts will be stored in an array `[]` and have the same shape the user has:

```javascript
[{
    id: Number,
    name: String,
    email: String
}, {
    id: Number,
    name: String,
    email: String
}]
```

## DB component
This handles the saving of data for us. We are going to use [Sequelize](http://docs.sequelizejs.com/en/v3/) for database interaction. Depending on the engine you use (MySQL, Oracle, etc.) you might need to change the arguments passed into the `Sequelize` constructor. 

```javascript
// <root>/source/helpers/db.js
const {Task, curry} = require('futils');
const Sequelize = require('sequelize');

// seq :: Conn
const seq = new Sequelize('dbname', 'username', 'userpass');

// User :: Table
const User = seq.define('user', {
    id: Sequelize.INTEGER,
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

// Contacts :: Table
const Contacts = seq.define('contacts', {
    id: Sequelize.INTEGER,
    uid: Sequelize.INTEGER,
    cid: Sequelize.INTEGER
});

...
```

This defines us a connection to the database and two tables. If the tables don't exist, they are created on the fly for us. This happens later when we call a `Task` named `sync`, which will synchronize to the database. Let's define it:

```javascript
// <root>/source/helpers/db.js
...

// sync :: Task Error Conn
const sync = new Task((rej, res) => {
    seq.sync().
        then(res).
        catch(rej);
});

// create :: Table → {} → Task Error Record
const create = curry((Tbl, attrs) => new Task((rej, res) => {
    Tbl.create(attrs).
        then(res).
        catch(rej);
}));

// query :: Table → {} → Task Error [Record]
const query = curry((Tbl, qry) => new Task((rej, res) => {
    Tbl.findAll(qry).
        then(res).
        catch(rej);
}));


module.exports = {create, query, sync, User, Contacts};
```

Alongside `sync` two functions can be defined, one for creating records and one for querying records in the database. `create` takes a table and a record to insert and returns a new `Task` with a record, while `query` takes a table and some query conditions and returns a array of all records which matched the given conditions.

## A login component
This component serves as a starting point for the application. There are no needs for a security check or something because there is no sensible data stored. A login just identifies a certain user.

### Login actions
```javascript
// <root>/source/components/login/actions.js

module.exports = {
    Login: Symbol('LoginAction')
};
```

### Login controller
The controller takes a hint from [example 05](./ex05-cdinventory.md), where the controller handled new artists by searching for an existing artist by name. If no artist matched the given name, it would be treated as new artist with a single LP. Here, we simply pretend a user which has no login wants to register a new account.

```javascript
// <root>/source/components/login/controller.js
const {Task, Left, Right, curry, first, getter} = require('futils');
const {Login} = require('./actions');
const {sync, query, create, User, Contacts} = require('../../helpers/db');

// queryUser :: Query → Task Error User
const queryUser = query(User);
// queryContacts :: Query → Task Error [Contact]
const queryContacts = query(Contacts);
// createUser :: Attributes → Task Error _
const createUser = create(User);

// findUser :: {} → Task Error User
const findUser = (u) => queryUser({where: {name: u.uname, email: u.umail}}).
    map(first).
    map((x) => !x ? Left.of({name: u.uname, email: u.umail}) : Right.of(x));

// cidToA :: {cid: Number} → {a: Number}
const cidToA = (c) => ({a: c.cid});

// findUserContacts :: [ContactRecord] → [Contact]
const findUserContacts = (cs) => queryUser({where:{id:{$or:cs.map(cidToA)}}});

// processLogin :: Login → Task Error State
const processLogin = (u) => findUser(u).
    flatMap((x) => x.fold(
        (newUser) => createUser(newUser). // <- pretends a new user
                        flatMap((_) => Task.of({user: newUser, contacts: []})),
        (user) => queryContacts({where: {uid: user.id}}). // <- gets Records
                    flatMap(findUserContacts). // <- gets Users from Records
                    map((cs) => ({user: user, contacts: cs}))));

// postLoginData :: data → Task Error State
const postLoginData = (data) => sync.
    map(getter(data)).
    flatMap(processLogin)

// controller :: State → Action → State
const controller = curry((state, action) => {
    switch (action.type) {
        case Login:
            // post action.data to the server. here, we use explicitly
            //   the added freedom to return a Task of the new state.
            //   The async function now handles this edge case and
            //   lets all incoming Tasks pass. each time the Login
            //   action arrives, a blank new state is constructed from
            //   scratch.
            return postLoginData(action.data);
        default:
            return state;
    }
});

module.exports = { controller };
```

### Login view
We need some small helpers for the views which we place in the `helpers/dom.js` file below. But first, here is the code for the login `view` function:

```javascript
// <root>/source/components/login/view.js
const {curry, pipe} = require('futils');
const h = require('snabbdom/h');
const {Login} = require('./actions');
const {labeledInput, inputsToPairs} = require('../../helpers/dom');

const FORM_ATTRS = {
    props: {
        action: '#', // no action
        enctype: 'application/x-www-form-urlencoded',
        method: 'post'
    }
};

// view :: State → (Event → Action) → VNode
const view = curry((state, emit) => {
    const emitLogin = pipe(inputsToPairs, emit(Login));

    return h('form.form', FORM_ATTRS, [
        labeledInput('Name', 'uname', 'uname'),
        labeledInput('E-Mail', 'umail', 'umail'),

        h('button.button', {on: {click: emitLogin}}, 'Login!')
    ]);
});

module.exports = { view };
```

And these are the implementations of the helper functions:

```javascript
// <root>/source/helpers/dom.js
const {curry, pipe, call, field, fold, merge} = require('futils');

// stopDefault :: Event → Event
const stopDefault = call('preventDefault');

// query :: String → DOM → [DOM]
const query = curry((s, d) => Array.from(d.querySelectorAll(s)));

// readPairs :: [DOM{name: String, value: *}] → {}
const readPairs = fold((a, x) => merge(a, {[x.name]: x.value}), {});

// inputsToPairs :: Event → {}
const inputsToPairs = pipe(
    stopDefault,
    field('target.parentNode'),
    query('input[type="text"]'),
    readPairs
);

// labeledInput :: String, String, String → VNode
const labeledInput = (label, id, name) => {
    return h('div.input', [
        h('label.label', {htmlFor: id}, label),
        h('input.textinput', {type: 'text', id, name}, [])
    ]);
}


module.exports = {
    stopDefault, query, readPairs, inputsToPairs,
    labeledInput
};
```


## App component – A first look
Now that we have the login component, we can make a first guess about how the `App` component might look like. It's controller will be an aggregat of all other controllers while its view is a aggregat of all views. It does not have any actions itself, but it passes all incoming actions into the controllers of the components it hosts. If you think this sounds complicated, don't panic! We have done most of the work already with `foldControllers`. The rest is merely the view part, so we stick them into one file. This reduces the complexity of
the boot file a lot.

This is how App looks like:

```javascript
// <root>/source/App.js
const {foldControllers} = require('./../helpers/dvc');
const LoginC = require('./login/controller').controller;
const LoginV = require('./login/view').view;
// we import more controllers here


// for now, there is just one component.
// this makes it easy:
const controller = LoginC;


// however, we will use this later:
// 
// const controller = foldControllers(
//     LoginC, ...
// )


const view = (state, emit) => {
    if (!state) {
        // no state? then we give back the login!
        return LoginV(null, emit);
    }

    // rest will go here
}


module.exports = { view, controller };
```


## Bootscripts
Ok, fine. Let's move on to the boot script. This is where we launch the missiles (so to speak).

```javascript
// <root>/source/boot.js
const {render} = require('./helpers/dvc');
const App = require('./App')

window.addEventListener('DOMContentLoaded', () => {
    const $appNode = document.querySelector('#app');
    if ($appNode) { render(null, $appNode, App); } // <- run!
});
```


## Parts of the App component
The application GUI will contain two parts, one for adding contacts and one for listing them. When the user adds a contact, it will be added to the registered users automatically if it is not present.

## Listing the contacts of a user
Let's start with the simpler of the two parts and see, if we can implement a way to list all the contacts a user has. You can use the same trick shown here to implement filters too.

But first things first, we start with a definition of all the actions. For now, we are going to implement a way to sort the results in certain ways: One button allows to disable sorting, such that all contacts become sorted like they are given by the database or in alphabetical order.

```javascript
// <root>/source/components/contactlist/actions.js
module.exports = {
    SortAlpha: Symbol('SortAlphabetical'),
    SortAny: Symbol('SortAnyOrder')
}
```

Next step: The controller. Here all what's left to do is setting a flag, which indicates how the user wants the result to be sorted. The actual sorting is performed in the view because sorting as well as filtering (for example) do not depend on the data itself but are merely ways to view a piece of data. Because of that, the controller itself is trivial:

```javascript
// <root>/source/components/contactlist/controller.js
const {curry, merge} = require('futils');
const {SortAlpha, SortAny} = require('./actions');

// controller :: State → Action → State
const constroller = curry((state, action) => {
    switch (action.type) {
        case SortAny:
            return merge(state, {sorting: SortAny});
        case SortAlpha:
            return merge(state, {sorting: SortAlpha});
        default:
            return state;
    }
});

module.exports = { controller };
```

Finally there is a view for the list.

```javascript
// <root>/source/components/contactlist/view.js
const {curry, pipe} = require('futils');
const h = require('snabbdom/h');
const {SortAlpha, SortAny} = require('./actions');

// AVATAR_URL :: String
const AVATAR_URL = 'https://api.adorable.io/avatars/285/';

// viewContact :: User → VNode
const viewContact = (c) => {
    return h('div.contact', [
        h('div.contact_pic', [
            h('img.fleximg',
                {props: {src: AVATAR_URL + c.email, alt: c.name}},
                [])
        ]),
        h('div.contact_info', [
            h('h3.contact_name', c.name),
            h('p.contact_email', c.email)
        ])
    ]);
}

// sorted :: State → [VNode]
const sorted = ({sorting, contacts}) => {
    if (sorting === SortAlpha) {
        return contacts.
            slice(). // <- this is essential, sort has a side effect
            sort((a, b) => a.name.localeCompare(b.name));
    }
    return contacts;
}

// view :: State → (Event → Action) → VNode
const view = curry((state, emit) => {
    const sortAlpha = emit(SortAlpha);
    const sortAny = emit(SortAny);

    return h('div.contacts', [
        h('div.contacts_head', [
            h('button.btn',
                {props: {type: 'button'},
                 on: {click: sortAny}}, 'Any'),
            h('button.btn',
                {props: {type: 'button'},
                 on: {click: sortAlpha}}, 'A-Z!')
        ]),
        h('div.contacts_body', sorted(state).map(viewContact));
    ]);
});

module.exports = { view };
```

## Adding contacts
Finally the user needs the ability to add new contacts to his list of contacts. We are going to implement this last feature in the same way we build all the other stuff alreay.
We start with the usual stuff: Defining some actions.
```javascript
// <root>/source/components/contactform/actions.js
module.exports = {
    Save: Symbol('SaveContact')
}
```

Let's define a controller which handles the incoming actions.
```javascript
// <root>/source/components/contactform/controller.js
const {Task, curry, merge} = require('futils');
const {Save} = require('./actions');
const {query, create, User, Contacts} = require('../../helpers/db');



// isDuplicate :: Contact → State → Boolean
const isDuplicate = curry((x, {contacts}) => contacts.
    some((a) => a.email === x.email));


// storeNew :: Contact → State → Task Error [Contact]
const storeNew = curry((x, {contacts}) => create(Contacts, x).
    flatMap(() => Task.of([...contacts, x])));



// controller :: State → Action → State
const controller = curry((state, action) => {
    switch (action.type) {
        case Save:
            return isDuplicate(action.data, state) ?
                Task.of(state) :
                storeNew(merge({id: state.contacts.length}, action.data), state).
                    map((cs) => merge(state, {contacts: cs}));
        default:
            return state;
    }
});

module.exports = { controller };
```

Alright. Let's create a `<form>` with two inputs so the user can add new contacts to the list of contacts he/she already has. This view is almost identical to the view we created for the login component. I just copied and pasted it, made some small adjustments and saved it into it's own file:
```javascript
// <root>/source/components/contactform/view.js
const {curry, pipe} = require('futils');
const h = require('snabbdom/h');
const {Save} = require('./actions');
const {labeledInput, inputsToPairs} = require('../../helpers/dom');



// FORM_ATTRS :: { props :: { action :: String, enctype :: String, method :: String }}
const FORM_ATTRS = {
    props: {
        action: '#', // no action
        enctype: 'application/x-www-form-urlencoded',
        method: 'post'
    }
};


// view :: State → (Event → Action) → VNode
const view = curry((state, emit) => {
    const emitSave = pipe(inputsToPairs, emit(Save));

    return h('form.contactform', FORM_ATTRS, [
        labeledInput('Name', 'name', 'name'),
        labeledInput('E-Mail', 'email', 'email'),

        h('button.button', {on: {click: emitSave}}, 'Add contact')
    ]);
});


module.exports = { view };
```


## Final adjustments
This is the last thing we need to do to wire everything up: Import the ContactsList and ContactForm `view` and `controller` functions into the App component and use them. The code in `App.js` should look like this when you are done:

```javascript
// <root>/source/App.js
const {foldControllers} = require('./../helpers/dvc');
const loginC = require('./login/controller').controller;
const listC = require('./contactlist/controller').controller;
const formC = require('./contactform/controller').controller;
const loginV = require('./login/view').view;
const listV = require('./contactlist/view').view;
const formV = require('./contactform/view').view;

// controller :: State → Action → State
const controller = foldControllers(loginC, listC, formC);

// view :: State, (Event → Action) → VNode
const view = (state, emit) => {
    if (!state) {
        return loginV(null, emit);
    }
    return h('div.app', [
        formV(state, emit),
        listV(state, emit)
    ]);
}


module.exports = { view, controller };
```


---
[Index](./readme.md)






