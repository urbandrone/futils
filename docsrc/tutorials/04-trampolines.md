Use cases of recursive function with the help of the `trampoline` namespace.

#### Further readings
- [Trampolines in JavaScript](http://raganwald.com/2013/03/28/trampolines-in-javascript.html)



# Examples

### Range

A simple implementation of a `range` function.

```javascript
const { trampoline: {recur, again} } = require('futils');

// rangeRec_ :: ([Number], Number) -> [Number]
const rangeRec_ = recur(function loop (xs, n) {
  return xs[0] <= n
    ? xs
    : again(loop, [xs[0] - 1, ...xs], n);
});

// range :: Number -> Number -> [Number]
const range = start => stop => rangeRec_([stop], start);

range(0)(10); // -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```



### Unfold

The functional equivalent of a `while` loop and the opposite of a `fold`.

```javascript
const { trampoline: {recur, again} } = require('futils');

// unfoldRec_ :: ((a -> Boolean), (a -> b), a) -> b
const unfoldRec_ = recur(function loop (f, g, init) {
  return f(init)
    ? init
    : again(loop, f, g, g(init));
});

// unfold :: (a -> Boolean) -> (a -> b) -> a -> b
const unfold = predicate => fn => init => unfoldRec_(predicate, fn, init);
```



### Reverse DOM traversal

A polyfill for `Element.prototype.closest`. Traverses the DOM tree up until the
`<html>` element is hit. 

```javascript
const { trampoline: {recur, again} } = require('futils');

// closestRec_ :: (HTMLElement, String, HTMLElement) -> HTMLElement
const closestRec_ = recur(function loop (stop, selector, node) {
  return !node || node.matches(selector) || node === stop
    ? node
    : again(loop, selector, stop, node.parentNode);
});

// closest :: String -> HTMLElement -> HTMLElement
const closest = selector => node => closestRec_(
  document.documentElement,
  selector,
  node
);
```