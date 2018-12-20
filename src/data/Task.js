/*
The MIT License (MIT)
Copyright (c) 2018 David Hofmann <the.urban.drone@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {typeOf} from '../core/typeof';
import {Type} from '../adt';
import {Show} from '../generics/Show';
import {Eq} from '../generics/Eq';



/* Utilities */
const delay = (f) => typeof setImmediate !== 'undefined' ? setImmediate(f) :
              typeof process !== 'undefined' ? process.nextTick(f) :
              setTimeout(f, 0);

const voids = () => void 0;




/*
 * @module data
 */







/**
 * The Task data structure. Use Task to encapsulate asynchronous
 * logic to avoid having to deal with callback hell. In contrast to a Promise, a
 * Task is evaluated lazy
 * @class module:data.Task
 * @extends module:generics.Show
 * @extends module:generics.Eq
 * @version 3.0.0
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const one = Task((rej, res) => res(1));
 *
 * one.run(
 *     (err) => { console.error(err); },
 *     (num) => { console.log(num); }
 * )
 */
export const Task = Type('Task', ['run']).
    deriving(Show, Eq);

Task.fn.cleanUp = voids;





/**
 * Lifts a value into a Task. The resulting Task always resolves with the given
 * value
 * @method of
 * @static
 * @memberof module:data.Task
 * @param {any} a The value to lift
 * @return {Task} The value wrapped in a Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * Task.of(1); // -> Task(_, 1)
 */
Task.of = (a) => Task((_, ok) => { ok(a); });
/**
 * Monoid implementation for Task. Returns a Task which neither resolves nor rejects
 * @method empty
 * @static
 * @memberof module:data.Task
 * @return {Task} A Task that is pending forever
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * Task.empty(); // -> Task(?, ?)
 */
Task.empty = () => Task(voids);
/**
 * Lifts a value into a Task. The resulting Task always resolves with the given
 * value
 * @method resolve
 * @static
 * @memberof module:data.Task
 * @param {any} a The value to lift
 * @return {Task} The value wrapped in a Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * Task.resolve(1); // -> Task(_, 1)
 */
Task.resolve = Task.of;
/**
 * Lifts a value into a Task. The resulting Task always fails with the given
 * value
 * @method reject
 * @static
 * @memberof module:data.Task
 * @param {any} a The value to lift
 * @return {Task} The value wrapped in a Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * Task.reject(1); // -> Task(1, _)
 */
Task.reject = (a) => Task(fail => { fail(a); });
/**
 * Creates a Task which resolves a function after the given amount of milliseconds
 * @method timeout
 * @static
 * @memberof module:data.Task
 * @param {Number} ms Delay in milliseconds
 * @param {Function} f The function to call after the timeout
 * @return {Task} A Task that resolves with the result of the function
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const delayed = () => 1;
 *
 * Task.timeout(400, delayed); // -> Task(_, 1) 
 */
Task.timeout = (ms, f) => Task((_, ok) => {
    setTimeout(() => ok(f()), ms);
});
/**
 * Converts a Promise returning function into a Task returning form
 * @method fromPromiseFunction
 * @static
 * @memberof module:data.task
 * @param {Function} f A function which returns a Promise
 * @return {Function} A function which returns a Task
 *
 * @example
 * const {Task} = require('futils').data;
 * const fs = require('fs').promises;
 *
 * const readFile = Task.fromPromiseFunction(fs.readFile.bind(fs));
 *
 * readFile('example.txt', 'utf8'); // -> Task(Error, String)
 */
Task.fromPromiseFunction = f => (...a) => Task((fail, ok) => {
    f(...a).then(ok).catch(fail);
});
/**
 * Converts a Node style continuation passing function into a Task returning form
 * @method fromNodeFunction
 * @static
 * @memberof module:data.task
 * @param {Function} f A function in the Node CPS form
 * @return {Function} A function which returns a Task
 *
 * @example
 * const {Task} = require('futils').data;
 * const fs = require('fs');
 *
 * const readFile = Task.fromNodeFunction(fs.readFile.bind(fs));
 *
 * readFile('example.txt', 'utf8'); // -> Task(Error, String)
 */
Task.fromNodeFunction = f => (...a) => Task((fail, ok) => {
    f(...a, (err, v) => { if (err) { fail(err); } else { ok(v); } });
});
/**
 * A natural transformation from an Id into a Task
 * @method  fromId
 * @static
 * @memberof module:data.Task
 * @param {Id} a The Id to transform
 * @return {Task} The Task which resolves to the value of the Id
 *
 * @example
 * const {Task, Id} = require('futils').data;
 *
 * const id = Id('a value');
 *
 * Task.fromId(id); // -> Task(_, 'a value')
 */
Task.fromId = a => Task.of(a.value);
/**
 * A natural transformation from a Maybe.Some or Maybe.None into a Task. If the
 * Maybe is a Maybe.None, the resulting Task rejects
 * @method fromMaybe
 * @static
 * @memberof module:data.Task
 * @param {Some|None} a The Maybe structure
 * @return {Task} A Task which rejects Maybe.None and resolves Maybe.Some
 *
 * @example
 * const {Task, Maybe} = require('futils').data;
 *
 * const some = Maybe.Some('a value');
 * const none = Maybe.None();
 *
 * Task.fromMaybe(some); // -> Task(_, 'a value')
 * Task.fromMaybe(none); // -> Task(null, _)
 */
Task.fromMaybe = a => Task((fail, ok) => { if (a.isSome()) { ok(a.value); } else { fail(null); } });
/**
 * A natural transformation from a Either.Right or Either.Left into a Task. If the
 * Either is a Either.Left, the resulting Task rejects
 * @method fromEither
 * @static
 * @memberof module:data.Task
 * @param {Right|Left} a The Either structure
 * @return {Task} A Task which rejects Either.Left and resolves Either.Right
 *
 * @example
 * const {Task, Either} = require('futils').data;
 *
 * const r = Either.Right('a value');
 * const l = Either.Left('fallback');
 *
 * Task.fromEither(r); // -> Task(_, 'a value')
 * Task.fromEither(l); // -> Task('fallback', _)
 */
Task.fromEither = a => Task((fail, ok) => { a.cata({Left: fail, Right: ok}); });
/**
 * A natural transformation from a List into a Task. Please note that this
 * transformation looses data, because only the first element of the list is
 * taken. If the first element is null or undefined, a rejecting Task is returned
 * @method fromList
 * @static
 * @memberof module:data.Task
 * @param {List} a The List structure
 * @return {Task} A Task of the first element
 *
 * @example
 * const {Task, List} = require('futils').data;
 *
 * const ls = List.of(2).cons(1);
 *
 * Task.fromList(ls); // -> Task(_, 1)
 */
Task.fromList = a => a.head == null ? Task.reject(a.head) : Task.of(a.head);
/**
 * A natural transformation from an IO into a Task. If the IO results in an Error,
 * the resulting Task fails with the exception
 * @method fromIO
 * @static
 * @memberof module:data.Task
 * @param {IO} a The IO structure
 * @return {Task} A Task which resolves with the result of the IO
 *
 * @example
 * const {Task, IO} = require('futils').data;
 *
 * const env = k => IO(() => process[k]);
 *
 * Task.fromIO(env('arch')); // -> Task(_, <architecture>)
 */
Task.fromIO = a => Task((fail, ok) => { try { ok(a.run()); } catch (exc) { fail(exc); }});


/**
 * A natural transformation from a Task into a Promise
 * @method toPromise
 * @memberof module:data.Task
 * @instance
 * @return {Promise} A Promise which runs the Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * Task.of(1).toPromise(); // -> Promise(1)
 */
Task.fn.toPromise = function () {
    return new Promise((ok, fail) => { this.run(fail, ok); });
}
/**
 * Concatenates a Task with another. Resolves with the Task which resolves faster
 * or rejects if either of both fail
 * @method concat
 * @memberof module:data.Task
 * @instance
 * @param {Task} a The Task to concatenate with
 * @return {Task} Result of the concattenation
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const ms300 = Task.timeout(300, () => 1);
 * const ms500 = Task.timeout(500, () => 2);
 *
 * ms500.concat(ms300); // -> Task(_, 1)
 */
Task.fn.concat = function (a) {
    if (Task.is(a)) {
        const clean = (x, y) => { this.cleanUp(x); a.cleanUp(y); };
        const task = Task((fail, ok) => {
            let done = false,
                states = [];

            const g = f => v => {
                if (!done) {
                    done = true;
                    delay(() => clean(states[0], states[1]));
                    f(v);
                }
            }

            states[0] = this.run(g(fail), g(ok));
            states[1] = a.run(g(fail), g(ok));
            return states;
        });
        task.cleanUp = clean;
        return task;
    }
    throw `Task::concat cannot append ${typeOf(a)} to ${typeOf(this)}`;
}
/**
 * Maps a function over the value and resolves with the result
 * @method map
 * @memberof module:data.Task
 * @instance
 * @param {Function} f The function to map
 * @return {Task} A new Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const one = Task.of(1);
 *
 * one.map((n) => n + 1); // -> Task(_, 2)
 */
Task.fn.map = function (f) {
    const task = Task((fail, ok) => { this.run(fail, v => ok(f(v))); });
    task.cleanUp = this.cleanUp;
    return task;
}
/**
 * Flattens a nested Task one level
 * @method flat
 * @memberof module:data.Task
 * @instance
 * @return {Task} A Task flattened
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const tasks = Task.of(Task.of(1));
 *
 * tasks.flat(); // -> Task(_, 1)
 */
Task.fn.flat = function () {
    const task = Task((fail, ok) => { this.run(fail, a => a.run(fail, ok)); });
    task.cleanUp = this.cleanUp;
    return task;
}
/**
 * Maps a Task returning function over a Task and flattens the result
 * @method flatMap
 * @static
 * @memberof module:data.Task
 * @instance
 * @param {Function} f The function to map
 * @return {Task} A new Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const task = Task.of(1);
 *
 * const inc = (n) => Task.of(n + 1);
 *
 * task.flatMap(inc); // -> Task(_, 2)
 */
Task.fn.flatMap = function (f) {
    const task = Task((fail, ok) => { this.run(fail, v => f(v).run(fail, ok)); });
    task.cleanUp = this.cleanUp;
    return task;
}
/**
 * Applies a Task with a function to another Task. Resolves when both resolve or
 * fails if either of both fails
 * @method ap
 * @memberof module:data.Task
 * @instance
 * @param {Task} a Task with a value
 * @return {Task} A new Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const task = Task.of(1);
 *
 * const apply = Task.of((n) => n + 1);
 *
 * apply.ap(task); // -> Task(_, 2)
 */
Task.fn.ap = function (a) {
    const clean = (x, y) => { this.cleanUp(x); a.cleanUp(y); };
    const task = Task((fail, ok) => {
        let aOk = false,
            aLoad = false,
            bOk = false,
            bLoad = false,
            rej = false,
            states = [];

        const gRej = v => { if (!rej) { rej = true; fail(v); } }
        const gRes = f => v => {
            if (rej) { return; }
            f(v);
            if (aLoad && bLoad) {
                delay(() => clean(states[0], states[1]));
                return ok(aOk(bOk));
            } else {
                return v;
            }
        }

        states[0] = this.run(gRej, gRes(w => { aLoad = true; aOk = w; }));
        states[1] = a.run(gRej, gRes(w => { bLoad = true; bOk = w; }));
        return states;
    });
    task.cleanUp = clean;
    return task;
}
/**
 * Swaps the disjunction of a Task, meaning if it normally resolves it fails and
 * if it normally fails it resolves
 * @method swap
 * @memberof module:data.Task
 * @instance
 * @return {Task} A new Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * const ok = Task.of(1);
 * const fail = Task.reject(1);
 *
 * ok.swap(); // -> Task(1, _)
 * fail.swap(); // -> Task(_, 1)
 */
Task.fn.swap = function () {
    const task = Task((fail, ok) => { this.run(ok, fail); });
    task.cleanUp = this.cleanUp;
    return task;
}
/**
 * Alt implementation, allows to swap a failing Task
 * @method alt
 * @memberof module:data.Task
 * @instance
 * @param {Task} a An optional Task
 * @return {Task} A new Task
 *
 * @example
 * const {Task} = require('futils').data;
 *
 * Task.reject(0).alt(Task.of(1)); // -> Task(_, 1)
 */
Task.fn.alt = function (a) {
    const task = Task((fail, ok) => { this.run(() => a.run(fail, ok), ok); });
    task.cleanUp = this.cleanUp;
    return task;
}