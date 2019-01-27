/* @banner futils | www.npmjs.com/package/futils */
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.futils=t()}(this,function(){"use strict";var f=function(n,d){if("number"!=typeof n||isNaN(n)||!isFinite(n))throw"Aritiy of a function cannot be "+n;if("function"!=typeof d)throw d+" does not have an arity, only functions have";switch(Math.abs(n)){case 1:return function(n){return d(n)};case 2:return function(n,t){return d(n,t)};case 3:return function(n,t,r){return d(n,t,r)};case 4:return function(n,t,r,e){return d(n,t,r,e)};case 5:return function(n,t,r,e,u){return d(n,t,r,e,u)};case 6:return function(n,t,r,e,u,o){return d(n,t,r,e,u,o)};case 7:return function(n,t,r,e,u,o,i){return d(n,t,r,e,u,o,i)};case 8:return function(n,t,r,e,u,o,i,c){return d(n,t,r,e,u,o,i,c)};case 9:return function(n,t,r,e,u,o,i,c,f){return d(n,t,r,e,u,o,i,c,f)};case 10:return function(n,t,r,e,u,o,i,c,f,a){return d(n,t,r,e,u,o,i,c,f,a)};case 11:return function(n,t,r,e,u,o,i,c,f,a,s){return d(n,t,r,e,u,o,i,c,f,a,s)};case 12:return function(n,t,r,e,u,o,i,c,f,a,s,l){return d(n,t,r,e,u,o,i,c,f,a,s,l)};case 13:return function(n,t,r,e,u,o,i,c,f,a,s,l,h){return d(n,t,r,e,u,o,i,c,f,a,s,l,h)};case 14:return function(n,t,r,e,u,o,i,c,f,a,s,l,h,p){return d(n,t,r,e,u,o,i,c,f,a,s,l,h,p)};case 15:return function(n,t,r,e,u,o,i,c,f,a,s,l,h,p,v){return d(n,t,r,e,u,o,i,c,f,a,s,l,h,p,v)};case 16:return function(n,t,r,e,u,o,i,c,f,a,s,l,h,p,v,y){return d(n,t,r,e,u,o,i,c,f,a,s,l,h,p,v,y)};default:return d}},t=function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")},r=function(){function e(n,t){for(var r=0;r<t.length;r++){var e=t[r];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(n,e.key,e)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),o=function(n,t,r){return t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r,n},a=function(n,t){if(Array.isArray(n))return n;if(Symbol.iterator in Object(n))return function(n,t){var r=[],e=!0,u=!1,o=void 0;try{for(var i,c=n[Symbol.iterator]();!(e=(i=c.next()).done)&&(r.push(i.value),!t||r.length!==t);e=!0);}catch(n){u=!0,o=n}finally{try{!e&&c.return&&c.return()}finally{if(u)throw o}}return r}(n,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},s=function(n){if(Array.isArray(n)){for(var t=0,r=Array(n.length);t<n.length;t++)r[t]=n[t];return r}return Array.from(n)},i=Symbol("@@type"),c=Symbol("@@values"),l=Symbol("@@type_tag"),h=function(n,t,r){return Object.defineProperty(n,t,{enumerable:!1,writable:!1,configurable:!1,value:r})},p=function(t,n){if("function"==typeof n[t[i]])return n[t[i]].apply(t,t[c].map(function(n){return t[n]}));throw n[l]+"::caseOf - No pattern matched "+t[i]+" in "+Object.keys(n)},v=function(n,t,e,r){if(t.length===e.length){var u=Object.create(r);return u.__type__=u[i]=n,u.__values__=u[c]=t,t.reduce(function(n,t,r){return n[t]=e[r],n},u)}throw n+" awaits "+t.length+" arguments but got "+e.length},y=function(e,u,o){return u.length?f(u.length,function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return v(e,u,t,o)}):function(){return v(e,u,[],o)}},d=function(e){return function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return t.reduce(function(n,t){return t.derive(n)},e)}},n=function(t,n){var r={},e=y(t,n,r);return h(e,"is",function(n){return n&&n[i]===t}),h(e,"deriving",d(e)),e.fn=e.prototype=r,(e.prototype.constructor=e).prototype.constructor.of=e},e=function(t,r){var n,e,u=o({},i,t);return u.fn=u.prototype=(o(n={},l,t),o(n,"caseOf",function(n){return p(this,n)}),o(n,"cata",function(n){return p(this,n)}),n),h(u,"is",function(n){return!!n&&n[l]===t}),h(u,"deriving",d(u)),u.fn.constructor=function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return function(n,t,r){if("function"==typeof n[t[i]])return n[t[i]].apply(n,s(r));throw n[l]+" - No constructor matched "+t[i]}(u,this,t)},u.fn.constructor.of=(e=u,function(){return e.of?e.of.apply(e,arguments):e.constructor.apply(e,arguments)}),Object.keys(r).forEach(function(t){var n=y(t,r[t],u.prototype);h(n,"is",function(n){return!!n&&n[i]===t}),u[t]=n}),u},u=Object.freeze({Type:n,UnionType:e});var m=function(n){return n.length<=1?n:function u(o,i,c){return f(o.length-c.length,function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];var e=[].concat(s(c),t).filter(function(n){return void 0!==n});return e.length>=o.length?i(o,e):u(o,i,e)})}(n,function(n,t){return n.apply(void 0,s(t))},[])};var g={id:function(n){return n},constant:function(n){return function(){return n}},compose:function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return f(t[t.length-1].length,t.reduceRight(function(n,t){return function(){return t(n.apply(void 0,arguments))}}))},pipe:function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return f(t[0].length,t.reduce(function(n,t){return function(){return t(n.apply(void 0,arguments))}}))},fixed:function(t){return(n=function(n){return t(function(){return n(n).apply(void 0,arguments)})})(n);var n},curry:m,curryRight:function(n){return n.length<=1?n:function u(o,i,c){return f(o.length-c.length,function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];var e=[].concat(s(c),t).filter(function(n){return void 0!==n});return e.length>=o.length?i(o,e.reverse()):u(o,i,e)})}(n,function(n,t){return n.apply(void 0,s(t))},[])},partial:function u(o){for(var n=arguments.length,t=Array(1<n?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];var i=t;return i.length<o.length&&(i=i.concat(new Array(Math.max(0,o.length-i.length)).fill(void 0))),function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];var e=i.map(function(n){return void 0===n?t.shift():n});return 0<=e.lastIndexOf(void 0)?u.apply(void 0,[o].concat(s(e))):o.apply(void 0,s(e))}},partialRight:function u(o){for(var n=arguments.length,t=Array(1<n?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];var i=t;return i.length<o.length&&(i=i.concat(new Array(Math.max(0,o.length-i.length)).fill(void 0))),function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];var e=i.map(function(n){return void 0===n?t.shift():n});return 0<=e.lastIndexOf(void 0)?u.apply(void 0,[o].concat(s(e))):o.apply(void 0,s(e.reverse()))}},memoize:function(u){var o=Object.create(null);return f(u.length,function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];var e=JSON.stringify(t);return void 0===o[e]&&(o[e]=u.apply(void 0,t)),o[e]})},not:function(n){return f(n.length,function(){return!n.apply(void 0,arguments)})},flip:function(o){return o.length<2?o:o.length<3?function(n,t){return o(t,n)}:f(o.length,function(n,t){for(var r=arguments.length,e=Array(2<r?r-2:0),u=2;u<r;u++)e[u-2]=arguments[u];return o.apply(void 0,[t,n].concat(e))})}},b=function(n){return null===n?"Null":void 0===n?"Void":void 0!==n.__type__?n.__type__:n.constructor.name},A=function e(u,o){var n=b(u);if(n!==b(o))return!1;switch(n){case"Null":case"Void":case"Boolean":case"String":case"Number":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return u===o;case"Date":return o.valueOf()===u.valueOf();case"RegExp":return o.toString()===u.toString();case"Array":return o.length===u.length&&u.every(function(n,t){return e(n,o[t])});case"Object":return Object.keys(u).every(function(n){return e(u[n],o[n])})&&Object.keys(o).every(function(n){return e(u[n],o[n])});case"Set":case"Map":return e([].concat(s(o.entries())),[].concat(s(u.entries())));case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return u.name===o.name&&u.message===o.message;default:return"value"in u?e(u.value,o.value):u.__values__.reduce(function(n,r){return o.__values__.reduce(function(n,t){return!!n&&e(u[r],o[t])},n)},!0)}},O=function(){function n(){t(this,n)}return r(n,null,[{key:"derive",value:function(n){if(n&&n.prototype)return n.prototype.equals=function(n){return A(this,n)},n;throw"Cannot derive Eq from "+b(n)}}]),n}(),_=function t(r,n){return arguments.length<2?function(n){return t(r,n)}:null!=n&&"function"==typeof n.equals?n.equals(r):A(r,n)},R=function t(r,n){return null==n?function(n){return t(r,n)}:"function"==typeof n.then?n.then(r,function(n){return n}):n.map(r)},S=function t(r,n){return null==n?function(n){return t(r,n)}:n.nubBy?n.nubBy(r):n.reduce((e=r,function(n,t){return null!=n.find(function(n){return e(t,n)})?n:n.concat(t)}),[]);var e},N=S(_),M={equals:_,concat:function t(r,n){return null==n?function(n){return t(r,n)}:"function"==typeof n.then?Promise.race([r,n]):n.concat(r)},map:R,ap:function t(r,e){return null==e?function(n){return t(r,n)}:"function"==typeof r.then?r.then(function(n){return e.then(n,function(n){return n})},function(n){return n}):r.ap(e)},flat:function(n){return null==n?n:n.flat?n.flat():n.reduce(function(n,t){return n.concat(t)},[])},flatMap:function t(r,n){return null==n?function(n){return t(r,n)}:"function"==typeof n.flatMap?n.flatMap(r):"function"==typeof n.then?n.then(r,function(n){return n}):n.reduce(function(n,t){return n.concat(r(t))},[])},filter:function t(r,n){return null==n?function(n){return t(r,n)}:"function"==typeof n.then?n.then((e=r,function(n){return e(n)?Promise.resolve(n):Promise.reject(n)}),function(n){return n}):n.filter(r);var e},fold:function t(r,n){return null==n?function(n){return t(r,n)}:n.fold?n.fold(r):n.reduce(function(n,t){return n.concat(r.of(t))},r.empty())},foldMap:function t(r,n){return null==n?function(n){return t(r,n)}:n.foldMap?n.foldMap(r):n.reduce(function(n,t){return null==n?r(t):n.concat(r(t))},null)},reduce:function r(e,t,n){return null==t?function(n,t){return r(e,n,t)}:null==n?function(n){return r(e,t,n)}:n.reduce(e,t)},reduceRight:function r(e,t,n){return null==t?function(n,t){return r(e,n,t)}:null==n?function(n){return r(e,t,n)}:n.reduceRight(e,t)},traverse:function r(e,t,n){return null==t?function(n,t){return r(e,n,t)}:null==n?function(n){return r(e,t,n)}:n.traverse?n.traverse(e,t):n.reduce(function(n,t){return n.concat(e(t))},t.of([]))},sequence:function t(r,n){return null==n?function(n){return t(r,n)}:n.sequence?n.sequence(r):n.reduce(function(n,t){return n.concat(t)},r.of([]))},doM:function(n){var o=n();return function n(t){var r=o.next(t),e=r.done,u=r.value;return e?u:"function"==typeof u.then?u.then(n,function(n){return n}):u.flatMap(n)}()},liftA:function u(o,e){for(var n=arguments.length,t=Array(2<n?n-2:0),r=2;r<n;r++)t[r-2]=arguments[r];return null==e?function(n){for(var t=arguments.length,r=Array(1<t?t-1:0),e=1;e<t;e++)r[e-1]=arguments[e];return u.apply(void 0,[o,n].concat(r))}:t.length<1?function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return u.apply(void 0,[o,e].concat(t))}:t.reduce(function(n,t){return n.ap(t)},e.map(o))},head:function(n){return null==n?null:"Cons"===n.__type__||"Nil"===n.__type__?n.head:"string"==typeof(t=n)||isNaN(t.length)?t:null==t[0]?null:t[0];var t},tail:function(n){return null==n?[]:"Cons"===n.__type__||"Nil"===n.__type__?n.tail:"string"==typeof(t=n)||isNaN(t.length)?[t]:Array.from(t).slice(1);var t},take:function t(r,n){return null==n?function(n){return t(r,n)}:n.take?n.take(r):(e=r,"string"==typeof(u=n)||isNaN(u.length)?[u]:Array.from(u).slice(0,e));var e,u},drop:function t(r,n){return null==n?function(n){return t(r,n)}:n.drop?n.drop(r):(e=r,"string"==typeof(u=n)||isNaN(u.length)?[u]:Array.from(u).slice(e));var e,u},find:function t(r,n){return null==n?function(n){return t(r,n)}:Array.isArray(n)?(e=r,null==(u=n.find(e))?null:u):n.find(r);var e,u},nubBy:S,nub:N,prop:function t(r,n){return null==n?function(n){return t(r,n)}:"Map"===n.constructor.name?(e=r,(u=n).has(e)?u.get(e):null):n.hasOwnProperty(r)?n[r]:null;var e,u}},w=function(){function n(){t(this,n)}return r(n,null,[{key:"derive",value:function(n){if(n&&n.prototype&&n.prototype.equals)return n.prototype.lt=function(n){return function e(u,o){var n=b(u),t=b(o);if(n===t)switch(n){case"String":return u.localeCompare(o)<0;case"Number":case"Date":return u<o;case"Array":return u.length<o.length&&u.every(function(n,t){return e(n,o[t])});case"Object":return Object.keys(u).every(function(n){return e(u[n],o[n])});case"Set":case"Map":return e([].concat(s(u.entries())),[].concat(s(o.entries())));case"Null":case"Void":case"Boolean":case"RegExp":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return!1;default:return"value"in u?e(u.value,o.value):u.__values__.reduce(function(n,r){return o.__values__.reduce(function(n,t){return!!n&&e(u[r],o[t])},n)},!0)}throw"Cannot order value of type "+n+" with value of type "+t}(this,n)},n.prototype.lte=function(n){return this.lt(n)||this.equals(n)},n.prototype.gt=function(n){return!this.lte(n)},n.prototype.gte=function(n){return!this.lt(n)||this.equals(n)},n;throw"Cannot derive Ord from "+b(n)}}]),n}(),E=function u(t){if(null===t)return"Null";if(void 0===t)return"Void";if(null!=t.__type__)return t.__values__.length<1?t.__type__:t.__type__+"("+t.__values__.map(function(n){return u(t[n])}).join(", ")+")";switch(t.constructor.name){case"Boolean":case"String":case"Number":case"RegExp":case"Symbol":return t.toString();case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return t.constructor.name;case"Date":return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();case"Array":return"["+t.map(u).join(", ")+"]";case"Object":return"{"+Object.keys(t).map(function(n){return n+": "+u(t[n])}).join(", ")+"}";case"Set":return"Set("+[].concat(s(t.entries())).map(function(n){var t=a(n,2),r=t[0],e=t[1];return r+": "+u(e)}).join(", ")+")";case"Map":return"Map("+[].concat(s(t.entries())).map(function(n){var t=a(n,2),r=t[0],e=t[1];return r+": "+u(e)}).join(", ")+")";default:return""+t}},C=function(){function n(){t(this,n)}return r(n,null,[{key:"derive",value:function(n){if(n&&n.prototype)return n.prototype.toString=function(){return E(this)},n.prototype.inspect=function(){return this.toString()},Object.defineProperty(n.prototype,Symbol.toStringTag,{enumerable:!1,configurable:!1,writable:!1,value:function(){return this.toString()}}),n;throw"Cannot derive Show from "+b(n)}}]),n}(),x={Show:C,Eq:O,Ord:w},I=n("Sum",["value"]).deriving(C,O,w);I.of=function(n){return"number"!=typeof n||isNaN(n)?I(0):I(n)},I.empty=function(){return I(0)},I.fn.concat=function(n){if(I.is(n))return I(this.value+n.value);throw"Sum::concat cannot append "+b(n)+" to "+b(this)};var j=n("Product",["value"]).deriving(C,O,w);j.of=function(n){return"number"!=typeof n||isNaN(n)?j(1):j(n)},j.empty=function(){return j(1)},j.fn.concat=function(n){if(j.is(n))return j(this.value*n.value);throw"Product::concat cannot append "+b(n)+" to "+b(this)};var U=n("Min",["value"]).deriving(C,O,w);U.of=function(n){return"number"!=typeof n||isNaN(n)?U(1/0):U(n)},U.empty=function(){return U(1/0)},U.fn.concat=function(n){if(U.is(n))return this.lt(n)?this:n;throw"Min::concat cannot append "+b(n)+" to "+b(this)};var L=n("Max",["value"]).deriving(C,O,w);L.of=function(n){return"number"!=typeof n||isNaN(n)?L(-1/0):L(n)},L.empty=function(){return L(-1/0)},L.fn.concat=function(n){if(L.is(n))return this.gt(n)?this:n;throw"Max::concat cannot append "+b(n)+" to "+b(this)};var k=n("Char",["value"]).deriving(C,O,w);k.of=function(n){return k("string"==typeof n?n:"")},k.empty=function(){return k("")},k.fn.concat=function(n){if(k.is(n))return k(this.value.concat(n.value));throw"Char::concat cannot append "+b(n)+" to "+b(this)};var F=n("Fn",["value"]).deriving(C,O);F.of=function(n){return F("function"==typeof n?n:function(n){return n})},F.empty=function(){return F(function(n){return n})},F.fn.concat=function(t){var r=this;if(F.is(t))return F(function(n){return t.value(r.value(n))});throw"Fn::concat cannot append "+b(t)+" to "+b(this)},F.fn.run=function(n){return this.value(n)};var P=n("Any",["value"]).deriving(C,O,w);P.of=function(n){return P("boolean"==typeof n&&n)},P.empty=function(){return P(!1)},P.fn.concat=function(n){if(P.is(n))return this.value?this:P(!!n.value);throw"Any::concat cannot append "+b(n)+" to "+b(this)};var T=n("All",["value"]).deriving(C,O,w);T.of=function(n){return T("boolean"!=typeof n||n)},T.empty=function(){return T(!0)},T.fn.concat=function(n){if(T.is(n))return this.value?T(!!this.value&&!!n.value):this;throw"All::concat cannot append "+b(n)+" to "+b(this)};var B=n("Record",["value"]).deriving(C,O,w);B.of=function(n){return"Object"===b(n)?B(n):B({})},B.empty=function(){return B({})},B.fn.concat=function(n){if(B.is(n))return B(Object.assign({},this.value,n.value));throw"Record::concat cannot append "+b(n)+" to "+b(this)};var q={Sum:I,Product:j,Min:U,Max:L,Char:k,Fn:F,Any:P,All:T,Record:B},D=n("Id",["value"]).deriving(C,O,w);((D.of=D).from=D).fromEither=function(n){return D(n.value)},D.fromMaybe=function(n){return D(n.value)},D.fromList=function(n){return D(n.head)},D.fn.concat=function(n){if(D.is(n))return D(this.value.concat(n.value));throw"Id::concat cannot append "+b(n)+" to "+b(this)},D.fn.map=function(n){return D(n(this.value))},D.fn.flat=function(){return this.value},D.fn.flatMap=function(n){return this.map(n).flat()},D.fn.extract=function(){return this.value},D.fn.extend=function(n){return D.of(n(this))},D.fn.ap=function(n){return n.map(this.value)},D.fn.reduce=function(n,t){return n(t,this.value)},D.fn.traverse=function(n,t){return t.fn&&t.fn.ap?t.of(D.of).ap(n(this.value)):n(this.value).map(D.of)},D.fn.sequence=function(n){return this.traverse(function(n){return n},n)};var V=e("Maybe",{Some:["value"],None:[]}).deriving(C,O,w),z=V.Some,G=V.None;V.fn.value=null,V.of=z,V.empty=G,V.from=function(n){return null==n?G():z(n)},V.fromEither=function(n){return n.isRight()?z(n.value):G()},V.fromId=function(n){return V.from(n.value)},V.fromList=function(n){return V.from(n.head)},V.fn.isSome=function(){return this.caseOf({None:function(){return!1},Some:function(){return!0}})},V.fn.concat=function(t){var n=this;if(V.is(t))return this.caseOf({None:function(){return n},Some:function(n){return t.isSome()?z(n.concat(t.value)):t}});throw"Maybe::concat cannot append "+b(t)+" to "+b(this)},V.fn.map=function(t){var n=this;return this.caseOf({None:function(){return n},Some:function(n){return V.from(t(n))}})},V.fn.flat=function(){var n=this;return this.caseOf({None:function(){return n},Some:function(n){return n}})},V.fn.flatMap=function(n){return this.map(n).flat()},V.fn.extract=function(){return this.value},V.fn.extend=function(n){var t=this;return this.caseOf({None:function(){return t},Some:function(){return V.from(n(t))}})},V.fn.ap=function(t){var n=this;return this.caseOf({None:function(){return n},Some:function(n){return t.map(n)}})},V.fn.biMap=function(n,t){return this.caseOf({None:function(){return V.from(n(null))},Some:function(n){return V.from(t(n))}})},V.fn.reduce=function(t,r){return this.caseOf({None:function(){return r},Some:function(n){return t(r,n)}})},V.fn.traverse=function(t,n){var r=this;return this.caseOf({None:function(){return n.of(r)},Some:function(n){return t(n).map(V.from)}})},V.fn.sequence=function(n){return this.traverse(function(n){return n},n)},V.fn.alt=function(n){var t=this;return this.caseOf({None:function(){return n},Some:function(){return t}})};var J=e("Either",{Right:["value"],Left:["value"]}).deriving(C,O,w),K=J.Right,Y=J.Left;J.of=K,J.empty=function(){return Y(null)},J.from=function(n){return null==n||Error.prototype.isPrototypeOf(n)?Y(n||null):K(n)},J.fromMaybe=function(n){return n.isSome()?K(n.value):Y(null)},J.fromId=function(n){return J.from(n.value)},J.fromList=function(n){return J.from(n.head)},J.try=function(n){return function(){try{return J.from(n.run?n.run.apply(n,arguments):n.apply(void 0,arguments))}catch(n){return Y(n)}}},J.fn.isRight=function(){return this.caseOf({Left:function(){return!1},Right:function(){return!0}})},J.fn.concat=function(t){var n=this;if(J.is(t))return this.caseOf({Left:function(){return n},Right:function(n){return t.isRight()?K(n.concat(t.value)):t}});throw"Either::concat cannot append "+b(t)+" to "+b(this)},J.fn.map=function(t){var n=this;return this.caseOf({Left:function(){return n},Right:function(n){return J.from(t(n))}})},J.fn.flat=function(){var n=this;return this.caseOf({Left:function(){return n},Right:function(n){return n}})},J.fn.flatMap=function(n){return this.map(n).flat()},J.fn.extract=function(){return this.value},J.fn.extend=function(n){var t=this;return this.caseOf({Left:function(){return t},Right:function(){return J.from(n(t))}})},J.fn.ap=function(t){var n=this;return this.caseOf({Left:function(){return n},Right:function(n){return t.map(n)}})},J.fn.biMap=function(t,r){return this.caseOf({Left:function(n){return J.from(t(n))},Right:function(n){return J.from(r(n))}})},J.fn.reduce=function(t,r){return this.caseOf({Left:function(){return r},Right:function(n){return t(r,n)}})},J.fn.traverse=function(t,n){var r=this;return this.caseOf({Left:function(){return n.of(r)},Right:function(n){return t(n).map(J.from)}})},J.fn.sequence=function(n){return this.traverse(function(n){return n},n)},J.fn.swap=function(){return this.caseOf({Left:K,Right:Y})},J.fn.alt=function(n){var t=this;return this.caseOf({Left:function(){return n},Right:function(){return t}})};var H=e("List",{Cons:["head","tail"],Nil:[]}),Q=H.Cons,W=H.Nil;H.fn.head=null,H.fn.tail=W();var X=Symbol("BREAK"),Z=function(n,t,r){for(var e=t,u=r;!W.is(u);)e=n(e,u.head,u),u=u.tail;return e};H.of=function(n){return Q(n,W())},H.empty=W,H.from=function(n){return null==n?W():Array.isArray(n)?H.fromArray(n):Q(n,W())},H.fromArray=function(n){return n.reduceRight(function(n,t){return Q(t,n)},W())},H.fromId=function(n){return H.from(n.value)},H.fromMaybe=function(n){return n.isSome()?H.from(n.value):H.empty()},H.fromEither=function(n){return n.isRight()?H.from(n.value):H.empty()},H.fn[Symbol.iterator]=function(){var n=this;return this.caseOf({Nil:function(){return{done:!0,next:function(){}}},Cons:function(){return n.toArray()[Symbol.iterator]()}})},H.fn.toString=function(){var n=this;return this.caseOf({Nil:function(){return"Nil"},Cons:function(){return n.reduceRight(function(n,t){return"Cons("+E(t)+", "+n+")"},"Nil")}})},H.fn.toArray=function(){return this.reduce(function(n,t){return n.concat(t)},[])},H.fn.concat=function(n){var t=this;if(H.is(n))return this.caseOf({Nil:function(){return t},Cons:function(){return W.is(n)?n:t.reduceRight(function(n,t){return Q(t,n)},n)}});throw"List::concat cannot append "+b(n)+" to "+b(this)},H.fn.map=function(r){return this.reduceRight(function(n,t){return Q(r(t),n)},W())},H.fn.flat=function(){return this.reduceRight(function(n,t){return t.reduceRight(function(n,t){return Q(t,n)},n)},W())},H.fn.flatMap=function(n){return this.map(n).flat()},H.fn.extract=function(){return this.head},H.fn.extend=function(e){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(){return n.reduceRight(function(n,t,r){return Q(e(r),n)},W())}})},H.fn.ap=function(t){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(n){return t.map(n)}})},H.fn.reduce=function(n,t){var r=this;return this.caseOf({Nil:function(){return t},Cons:function(){return Z(n,t,r)}})},H.fn.reduceRight=function(t,r){var e=this;return this.caseOf({Nil:function(){return r},Cons:function(){return n=e,Z(t,r,Z(function(n,t){return Q(t,n)},W(),n));var n}})},H.fn.traverse=function(e,n){var t=this;return this.caseOf({Nil:function(){return n.of(t)},Cons:function(){return t.reduceRight(function(n,r){return n.flatMap(function(t){return e(r).map(function(n){return Q(n,t)})})},n.of(W()))}})},H.fn.sequence=function(n){return this.traverse(function(n){return n},n)},H.fn.alt=function(n){var t=this;return this.caseOf({Nil:function(){return n},Cons:function(){return t}})},H.fn.foldMap=function(r){return this.reduceRight(function(n,t){return null==n?r(t):n.concat(r(t))},null)},H.fn.fold=function(n){return this.foldMap(n.of)},H.fn.filter=function(r){return this.reduceRight(function(n,t){return r(t)?Q(t,n):n},W())},H.fn.intersperse=function(r){return this.reduceRight(function(n,t){return W.is(n)?Q(t,n):Q(t,Q(r,n))},W())},H.fn.cons=function(n){return Q(n,this)},H.fn.snoc=function(n){return this.reduceRight(function(n,t){return Q(t,n)},Q(n,W()))},H.fn.take=function(r){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(n,t){return 0<r?Q(n,t.take(r-1)):W()}})},H.fn.drop=function(r){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(n,t){return 1<r?t.drop(r-1):t}})},H.fn.find=function(r){var n=this;return this.caseOf({Nil:function(){return null},Cons:function(){return function(n,t,r){for(var e=t,u=r;!W.is(u);){var o=n(e,u.head,u),i=a(o,2),c=i[0];if(e=i[1],c===X)break;u=u.tail}return e}(function(n,t){return r(t)?[X,t]:[null,n]},null,n)}})},H.fn.nubBy=function(r){return this.reduce(function(n,t){return null!=n.find(function(n){return r(t,n)})?n:n.snoc(t)},W())},H.fn.nub=function(){return this.nubBy(A)};var $=n("IO",["run"]);$.of=function(n){return $(function(){return n})},$.empty=function(){return $(function(n){return n})},$.from=function(n){return"function"==typeof n?$(n):$.of(n)},$.fromEither=function(n){return $.of(n.value)},$.fromMaybe=function(n){return $.of(n.value)},$.fromList=function(n){return $.of(n.head)},$.fromId=function(n){return $.of(n.value)},$.fn.concat=function(t){var r=this;if($.is(t))return $(function(n){return t.run(r.run(n))});throw"IO::concat cannot append "+b(t)+" to "+b(this)},$.fn.map=function(t){var r=this;return $(function(n){return t(r.run(n))})},$.fn.flat=function(){return this.run()},$.fn.flatMap=function(n){return this.map(n).flat()},$.fn.ap=function(n){var t=this;return n.map(function(n){return t.run(n)})},$.fn.contraMap=function(t){var r=this;return $(function(n){return r.run(t(n))})},$.fn.proMap=function(t,r){var e=this;return $(function(n){return r(e.run(t(n)))})};var nn=n("State",["compute"]);nn.Result=n("State.Result",["value","state"]),nn.of=function(t){return nn(function(n){return nn.Result(t,n)})},nn.get=function(){return nn(function(n){return nn.Result(n,n)})},nn.put=function(n){return nn(function(){return nn.Result(null,n)})},nn.modify=function(t){return nn.get().flatMap(function(n){return nn.put(t(n))})},nn.fn.map=function(u){var o=this;return nn(function(n){var t=o.compute(n),r=t.value,e=t.state;return nn.Result(u(r),e)})},nn.fn.flat=function(){var u=this;return nn(function(n){var t=u.compute(n),r=t.value,e=t.state;return r.compute(e)})},nn.fn.flatMap=function(n){return this.map(n).flat()},nn.fn.ap=function(n){return this.flatMap(n.map.bind(n))},nn.fn.run=function(n){return this.compute(n).value},nn.fn.exec=function(n){return this.compute(n).state};var tn=function(n){return"undefined"!=typeof setImmediate?setImmediate(n):"undefined"!=typeof process?process.nextTick(n):setTimeout(n,0)},rn=function(){},en=n("Task",["run"]).deriving(C,O);en.fn.cleanUp=rn,en.of=function(r){return en(function(n,t){t(r)})},en.empty=function(){return en(rn)},en.resolve=en.of,en.reject=function(t){return en(function(n){n(t)})},en.timeout=function(r,e){return en(function(n,t){setTimeout(function(){return t(e())},r)})},en.fromPromiseFunction=function(e){return function(){for(var n=arguments.length,r=Array(n),t=0;t<n;t++)r[t]=arguments[t];return en(function(n,t){e.apply(void 0,r).then(t).catch(n)})}},en.fromNodeFunction=function(u){return function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return en(function(r,e){u.apply(void 0,t.concat([function(n,t){n?r(n):e(t)}]))})}},en.fromId=function(n){return en.of(n.value)},en.fromMaybe=function(r){return en(function(n,t){r.isSome()?t(r.value):n(null)})},en.fromEither=function(r){return en(function(n,t){r.cata({Left:n,Right:t})})},en.fromList=function(n){return null==n.head?en.reject(n.head):en.of(n.head)},en.fromIO=function(r){return en(function(t,n){try{n(r.run())}catch(n){t(n)}})},en.fn.toPromise=function(){var r=this;return new Promise(function(n,t){r.run(t,n)})},en.fn.concat=function(o){var i=this;if(en.is(o)){var c=function(n,t){i.cleanUp(n),o.cleanUp(t)},n=en(function(n,t){var r=!1,e=[],u=function(t){return function(n){r||(r=!0,tn(function(){return c(e[0],e[1])}),t(n))}};return e[0]=i.run(u(n),u(t)),e[1]=o.run(u(n),u(t)),e});return n.cleanUp=c,n}throw"Task::concat cannot append "+b(o)+" to "+b(this)},en.fn.map=function(r){var e=this,n=en(function(n,t){e.run(n,function(n){return t(r(n))})});return n.cleanUp=this.cleanUp,n},en.fn.flat=function(){var n=this,t=en(function(t,r){n.run(t,function(n){return n.run(t,r)})});return t.cleanUp=this.cleanUp,t},en.fn.flatMap=function(e){var n=this,t=en(function(t,r){n.run(t,function(n){return e(n).run(t,r)})});return t.cleanUp=this.cleanUp,t},en.fn.ap=function(s){var l=this,h=function(n,t){l.cleanUp(n),s.cleanUp(t)},n=en(function(t,r){var e=!1,u=!1,o=!1,i=!1,c=!1,f=[],n=function(n){c||(c=!0,t(n))},a=function(t){return function(n){if(!c)return t(n),u&&i?(tn(function(){return h(f[0],f[1])}),r(e(o))):n}};return f[0]=l.run(n,a(function(n){u=!0,e=n})),f[1]=s.run(n,a(function(n){i=!0,o=n})),f});return n.cleanUp=h,n},en.fn.swap=function(){var r=this,n=en(function(n,t){r.run(t,n)});return n.cleanUp=this.cleanUp,n},en.fn.alt=function(r){var e=this,n=en(function(n,t){e.run(function(){return r.run(n,t)},t)});return n.cleanUp=this.cleanUp,n};var un=e("Free",{Cont:["value","run"],Return:["value"]}),on=un.Cont,cn=un.Return;un.of=cn,un.liftM=function(n){return on(n,cn)},un.from=function(n){return f(n.length,function(){return un.liftM(n.apply(void 0,arguments))})},un.fn.map=function(r){return this.caseOf({Return:function(n){return cn(r(n))},Cont:function(n,t){return on(n,function(n){return t(n).map(r)})}})},un.fn.flatMap=function(r){return this.caseOf({Return:function(n){return r(n)},Cont:function(n,t){return on(n,function(n){return t(n).flatMap(r)})}})},un.fn.ap=function(r){return this.caseOf({Return:function(n){return r.map(n)},Cont:function(n,t){return on(n,function(n){return t(n).ap(r)})}})},un.fn.interpret=function(r,e){return this.caseOf({Return:function(n){return e.of(n)},Cont:function(n,t){return null==n?t().interpret(r,e):r(n).flatMap(function(n){return t(n).interpret(r,e)})}})};var fn={Id:D,Maybe:V,Either:J,List:H,IO:$,State:nn,Task:en,Free:un},an=m(function(n,t,r,e,u){return R(function(n){return t(r,n,u)},e(n(r,u)))}),sn=an(function(n,t){var r=t[n];return null==r?null:r},function(n,t,r){var e=Array.isArray(r)?[].concat(s(r)):Object.assign({},r);return e[n]=t,e}),ln=function t(r){return{value:r,map:function(n){return t(n(r))}}},hn=m(function(t,n){return ln(R(function(n){return t(n).value},n))}),pn=function(n){return{value:n,map:function(){return this}}},vn=m(function(n,t){return n(pn)(t).value}),yn=m(function(n,t,r){return n(function(n){return ln(t(n))})(r).value}),dn=m(function(n,t,r){return n(function(){return ln(t)})(r).value}),mn=u,gn=g,bn=M,An=x,On=q,_n=fn,Rn={createLens:an,lenses:function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return t.reduce(function(n,t){return n[t]=sn(t),n},{index:sn})},mapped:hn,view:vn,over:yn,set:dn},Sn={again:function(n){for(var t=arguments.length,r=Array(1<t?t-1:0),e=1;e<t;e++)r[e-1]=arguments[e];return u=n,o=r,{isRecur:!0,run:function(){return u.apply(void 0,s(o))}};var u,o},recur:function(t){return f(t.length,function(){for(var n=t.apply(void 0,arguments);n&&n.isRecur;)n=n.run();return n})}};return Object.freeze({adt:mn,lambda:gn,operation:bn,generics:An,monoid:On,data:_n,optic:Rn,trampoline:Sn})});
