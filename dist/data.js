/* @banner futils | www.npmjs.com/package/futils */
"use strict";var typeOf=function(n){return null===n?"Null":void 0===n?"Void":void 0!==n.__type__?n.__type__:n.constructor.name},arity=function(n,d){if("number"!=typeof n||isNaN(n)||!isFinite(n))throw"Aritiy of a function cannot be "+n;if("function"!=typeof d)throw d+" does not have an arity, only functions have";switch(Math.abs(n)){case 1:return function(n){return d(n)};case 2:return function(n,t){return d(n,t)};case 3:return function(n,t,r){return d(n,t,r)};case 4:return function(n,t,r,e){return d(n,t,r,e)};case 5:return function(n,t,r,e,u){return d(n,t,r,e,u)};case 6:return function(n,t,r,e,u,i){return d(n,t,r,e,u,i)};case 7:return function(n,t,r,e,u,i,o){return d(n,t,r,e,u,i,o)};case 8:return function(n,t,r,e,u,i,o,a){return d(n,t,r,e,u,i,o,a)};case 9:return function(n,t,r,e,u,i,o,a,f){return d(n,t,r,e,u,i,o,a,f)};case 10:return function(n,t,r,e,u,i,o,a,f,c){return d(n,t,r,e,u,i,o,a,f,c)};case 11:return function(n,t,r,e,u,i,o,a,f,c,s){return d(n,t,r,e,u,i,o,a,f,c,s)};case 12:return function(n,t,r,e,u,i,o,a,f,c,s,l){return d(n,t,r,e,u,i,o,a,f,c,s,l)};case 13:return function(n,t,r,e,u,i,o,a,f,c,s,l,h){return d(n,t,r,e,u,i,o,a,f,c,s,l,h)};case 14:return function(n,t,r,e,u,i,o,a,f,c,s,l,h,p){return d(n,t,r,e,u,i,o,a,f,c,s,l,h,p)};case 15:return function(n,t,r,e,u,i,o,a,f,c,s,l,h,p,y){return d(n,t,r,e,u,i,o,a,f,c,s,l,h,p,y)};case 16:return function(n,t,r,e,u,i,o,a,f,c,s,l,h,p,y,m){return d(n,t,r,e,u,i,o,a,f,c,s,l,h,p,y,m)};default:return d}},classCallCheck=function(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function e(n,t){for(var r=0;r<t.length;r++){var e=t[r];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(n,e.key,e)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),defineProperty=function(n,t,r){return t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r,n},slicedToArray=function(n,t){if(Array.isArray(n))return n;if(Symbol.iterator in Object(n))return function(n,t){var r=[],e=!0,u=!1,i=void 0;try{for(var o,a=n[Symbol.iterator]();!(e=(o=a.next()).done)&&(r.push(o.value),!t||r.length!==t);e=!0);}catch(n){u=!0,i=n}finally{try{!e&&a.return&&a.return()}finally{if(u)throw i}}return r}(n,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},toConsumableArray=function(n){if(Array.isArray(n)){for(var t=0,r=Array(n.length);t<n.length;t++)r[t]=n[t];return r}return Array.from(n)},TYPE=Symbol("@@type"),VALS=Symbol("@@values"),TYPE_TAG=Symbol("@@type_tag"),def=function(n,t,r){return Object.defineProperty(n,t,{enumerable:!1,writable:!1,configurable:!1,value:r})},caseOfT=function(t,n){if("function"==typeof n[t[TYPE]])return n[t[TYPE]].apply(t,t[VALS].map(function(n){return t[n]}));throw n[TYPE_TAG]+"::caseOf - No pattern matched "+t[TYPE]+" in "+Object.keys(n)},initT=function(n,t,e,r){if(t.length===e.length){var u=Object.create(r);return u.__type__=u[TYPE]=n,u.__values__=u[VALS]=t,t.reduce(function(n,t,r){return n[t]=e[r],n},u)}throw n+" awaits "+t.length+" arguments but got "+e.length},makeCtor=function(e,u,i){switch(u.length){case 0:return function(){return initT(e,u,[],i)};default:return arity(u.length,function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return initT(e,u,t,i)})}},deriveT=function(e){return function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return t.reduce(function(n,t){return t.mixInto(n)},e)}},Type=function(t,n){var r={},e=makeCtor(t,n,r);return def(e,"is",function(n){return n&&n[TYPE]===t}),def(e,"deriving",deriveT(e)),e.fn=e.prototype=r,e.prototype.constructor=e},UnionType=function(t,r){var n,e=defineProperty({},TYPE,t);return e.fn=e.prototype=(defineProperty(n={},TYPE_TAG,t),defineProperty(n,"caseOf",function(n){return caseOfT(this,n)}),defineProperty(n,"cata",function(n){return caseOfT(this,n)}),n),def(e,"is",function(n){return null!=n&&n[TYPE_TAG]===t}),def(e,"deriving",deriveT(e)),Object.keys(r).forEach(function(t){var n=makeCtor(t,r[t],e.prototype);def(n,"is",function(n){return null!=n&&n[TYPE]===t}),e[t]=n}),e},showT=function u(t){if(null===t)return"Null";if(void 0===t)return"Void";if(null!=t.__type__)return t.__values__.length<1?t.__type__:t.__type__+"("+t.__values__.map(function(n){return u(t[n])}).join(", ")+")";switch(t.constructor.name){case"Boolean":case"String":case"Number":case"RegExp":case"Symbol":return t.toString();case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return t.constructor.name;case"Date":return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();case"Array":return"["+t.map(u).join(", ")+"]";case"Object":return"{"+Object.keys(t).map(function(n){return n+": "+u(t[n])}).join(", ")+"}";case"Set":return"Set("+[].concat(toConsumableArray(t.entries())).map(function(n){var t=slicedToArray(n,2),r=t[0],e=t[1];return r+": "+u(e)}).join(", ")+")";case"Map":return"Map("+[].concat(toConsumableArray(t.entries())).map(function(n){var t=slicedToArray(n,2),r=t[0],e=t[1];return r+": "+u(e)}).join(", ")+")";default:return""+t}},Show=function(){function n(){classCallCheck(this,n)}return createClass(n,null,[{key:"mixInto",value:function(n){if(n&&n.prototype)return n.prototype.toString=function(){return showT(this)},n.prototype.inspect=function(){return this.toString()},n;throw"Cannot derive Show from "+typeOf(n)}}]),n}(),compareEq=function r(t,e){var n=typeOf(t);if(n!==typeOf(e))return!1;switch(n){case"Null":case"Void":case"Boolean":case"String":case"Number":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return t===e;case"Date":return e.valueOf()===t.valueOf();case"RegExp":return e.toString()===t.toString();case"Array":return e.length===t.length&&t.every(function(n,t){return r(n,e[t])});case"Object":return Object.keys(t).every(function(n){return r(t[n],e[n])})&&Object.keys(e).every(function(n){return r(t[n],e[n])});case"Set":case"Map":return r([].concat(toConsumableArray(e.entries())),[].concat(toConsumableArray(t.entries())));case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return t.name===e.name&&t.message===e.message;default:return r(t.value,e.value)}},Eq=function(){function n(){classCallCheck(this,n)}return createClass(n,null,[{key:"mixInto",value:function(n){if(n&&n.prototype)return n.prototype.equals=function(n){return compareEq(this,n)},n;throw"Cannot derive Eq from "+typeOf(n)}}]),n}(),compareOrd=function r(t,e){var n=typeOf(t),u=typeOf(e);if(n===u)switch(n){case"String":return t.localeCompare(e)<0;case"Number":case"Date":return t<e;case"Array":return t.length<e.length&&t.every(function(n,t){return r(n,e[t])});case"Object":return Object.keys(t).every(function(n){return r(t[n],e[n])});case"Set":case"Map":return r([].concat(toConsumableArray(t.entries())),[].concat(toConsumableArray(e.entries())));case"Null":case"Void":case"Boolean":case"RegExp":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return!1;default:return r(t.value,e.value)}throw"Cannot order value of type "+n+" with value of type "+u},Ord=function(){function n(){classCallCheck(this,n)}return createClass(n,null,[{key:"mixInto",value:function(n){if(n&&n.prototype&&n.prototype.equals)return n.prototype.lt=function(n){return compareOrd(this,n)},n.prototype.lte=function(n){return this.lt(n)||this.equals(n)},n.prototype.gt=function(n){return!this.lte(n)},n.prototype.gte=function(n){return!this.lt(n)||this.equals(n)},n;throw"Cannot derive Ord from "+typeOf(n)}}]),n}(),Id=Type("Id",["value"]).deriving(Show,Eq,Ord);((Id.of=Id).from=Id).fromEither=function(n){return Id(n.value)},Id.fromMaybe=function(n){return Id(n.value)},Id.fromList=function(n){return Id(n.head)},Id.fn.concat=function(n){if(Id.is(n))return Id(this.value.concat(n.value));throw"Id::concat cannot append "+typeOf(n)+" to "+typeOf(this)},Id.fn.map=function(n){return Id(n(this.value))},Id.fn.flat=function(){return this.value},Id.fn.flatMap=function(n){return this.map(n).flat()},Id.fn.extract=function(){return this.value},Id.fn.extend=function(n){return Id.of(n(this))},Id.fn.ap=function(n){return n.map(this.value)},Id.fn.reduce=function(n,t){return n(t,this.value)},Id.fn.traverse=function(n,t){return t.fn&&t.fn.ap?t.of(Id.of).ap(n(this.value)):n(this.value).map(Id.of)},Id.fn.sequence=function(n){return this.traverse(function(n){return n},n)};var Maybe=UnionType("Maybe",{Some:["value"],None:[]}).deriving(Show,Eq,Ord),_Some=Maybe.Some,None=Maybe.None;Maybe.fn.value=null,Maybe.of=_Some,Maybe.empty=None,Maybe.from=function(n){return null==n?None():_Some(n)},Maybe.fromEither=function(n){return n.isRight()?_Some(n.value):None()},Maybe.fromId=function(n){return Maybe.from(n.value)},Maybe.fromList=function(n){return Maybe.from(n.head)},Maybe.fn.isSome=function(){return this.caseOf({None:function(){return!1},Some:function(){return!0}})},Maybe.fn.concat=function(t){var n=this;if(Maybe.is(t))return this.caseOf({None:function(){return n},Some:function(n){return t.isSome()?_Some(n.concat(t.value)):t}});throw"Maybe::concat cannot append "+typeOf(t)+" to "+typeOf(this)},Maybe.fn.map=function(t){var n=this;return this.caseOf({None:function(){return n},Some:function(n){return Maybe.from(t(n))}})},Maybe.fn.flat=function(){var n=this;return this.caseOf({None:function(){return n},Some:function(n){return n}})},Maybe.fn.flatMap=function(n){return this.map(n).flat()},Maybe.fn.extract=function(){return this.value},Maybe.fn.extend=function(n){var t=this;return this.caseOf({None:function(){return t},Some:function(){return Maybe.from(n(t))}})},Maybe.fn.ap=function(t){var n=this;return this.caseOf({None:function(){return n},Some:function(n){return t.map(n)}})},Maybe.fn.biMap=function(n,t){return this.caseOf({None:function(){return Maybe.from(n(null))},Some:function(n){return Maybe.from(t(n))}})},Maybe.fn.reduce=function(t,r){return this.caseOf({None:function(){return r},Some:function(n){return t(r,n)}})},Maybe.fn.traverse=function(t,n){var r=this;return this.caseOf({None:function(){return n.of(r)},Some:function(n){return t(n).map(Maybe.from)}})},Maybe.fn.sequence=function(n){return this.traverse(function(n){return n},n)},Maybe.fn.alt=function(n){var t=this;return this.caseOf({None:function(){return n},Some:function(){return t}})};var Either=UnionType("Either",{Right:["value"],Left:["value"]}).deriving(Show,Eq,Ord),_Right=Either.Right,Left=Either.Left;Either.of=_Right,Either.empty=function(){return Left(null)},Either.from=function(n){return null==n||Error.prototype.isPrototypeOf(n)?Left(n||null):_Right(n)},Either.fromMaybe=function(n){return n.isSome()?_Right(n.value):Left(null)},Either.fromId=function(n){return Either.from(n.value)},Either.fromList=function(n){return Either.from(n.head)},Either.try=function(n){return function(){try{return Either.from(n.run?n.run.apply(n,arguments):n.apply(void 0,arguments))}catch(n){return Left(n)}}},Either.fn.isRight=function(){return this.caseOf({Left:function(){return!1},Right:function(){return!0}})},Either.fn.concat=function(t){var n=this;if(Either.is(t))return this.caseOf({Left:function(){return n},Right:function(n){return t.isRight()?_Right(n.concat(t.value)):t}});throw"Either::concat cannot append "+typeOf(t)+" to "+typeOf(this)},Either.fn.map=function(t){var n=this;return this.caseOf({Left:function(){return n},Right:function(n){return Either.from(t(n))}})},Either.fn.flat=function(){var n=this;return this.caseOf({Left:function(){return n},Right:function(n){return n}})},Either.fn.flatMap=function(n){return this.map(n).flat()},Either.fn.extract=function(){return this.value},Either.fn.extend=function(n){var t=this;return this.caseOf({Left:function(){return t},Right:function(){return Either.from(n(t))}})},Either.fn.ap=function(t){var n=this;return this.caseOf({Left:function(){return n},Right:function(n){return t.map(n)}})},Either.fn.biMap=function(t,r){return this.caseOf({Left:function(n){return Either.from(t(n))},Right:function(n){return Either.from(r(n))}})},Either.fn.reduce=function(t,r){return this.caseOf({Left:function(){return r},Right:function(n){return t(r,n)}})},Either.fn.traverse=function(t,n){var r=this;return this.caseOf({Left:function(){return n.of(r)},Right:function(n){return t(n).map(Either.from)}})},Either.fn.sequence=function(n){return this.traverse(function(n){return n},n)},Either.fn.swap=function(){return this.caseOf({Left:_Right,Right:Left})},Either.fn.alt=function(n){var t=this;return this.caseOf({Left:function(){return n},Right:function(){return t}})};var List=UnionType("List",{Cons:["head","tail"],Nil:[]}),_Cons=List.Cons,Nil=List.Nil;List.fn.head=null,List.fn.tail=Nil();var BREAK=Symbol("BREAK"),foldl=function(n,t,r){for(var e=t,u=r;!Nil.is(u);)e=n(e,u.head,u),u=u.tail;return e},breakableFoldl=function(n,t,r){for(var e=t,u=r;!Nil.is(u);){var i=n(e,u.head,u),o=slicedToArray(i,2),a=o[0];if(e=o[1],a===BREAK)break;u=u.tail}return e},foldr=function(n,t,r){return foldl(n,t,foldl(function(n,t){return _Cons(t,n)},Nil(),r))};List.of=function(n){return _Cons(n,Nil())},List.empty=Nil,List.from=function(n){return null==n?Nil():Array.isArray(n)?List.fromArray(n):_Cons(n,Nil())},List.fromArray=function(n){return n.reduceRight(function(n,t){return _Cons(t,n)},Nil())},List.fromId=function(n){return List.from(n.value)},List.fromMaybe=function(n){return n.isSome()?List.from(n.value):List.empty()},List.fromEither=function(n){return n.isRight()?List.from(n.value):List.empty()},List.fn[Symbol.iterator]=function(){var n=this;return this.caseOf({Nil:function(){return{done:!0,next:function(){}}},Cons:function(){return n.toArray()[Symbol.iterator]()}})},List.fn.toString=function(){var n=this;return this.caseOf({Nil:function(){return"Nil"},Cons:function(){return n.reduceRight(function(n,t){return"Cons("+showT(t)+", "+n+")"},"Nil")}})},List.fn.toArray=function(){return this.reduce(function(n,t){return n.concat(t)},[])},List.fn.concat=function(n){var t=this;if(List.is(n))return this.caseOf({Nil:function(){return t},Cons:function(){return Nil.is(n)?n:t.reduceRight(function(n,t){return _Cons(t,n)},n)}});throw"List::concat cannot append "+typeOf(n)+" to "+typeOf(this)},List.fn.map=function(r){return this.reduceRight(function(n,t){return _Cons(r(t),n)},Nil())},List.fn.flat=function(){return this.reduceRight(function(n,t){return t.reduceRight(function(n,t){return _Cons(t,n)},n)},Nil())},List.fn.flatMap=function(n){return this.map(n).flat()},List.fn.extract=function(){return this.head},List.fn.extend=function(e){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(){return n.reduceRight(function(n,t,r){return _Cons(e(r),n)},Nil())}})},List.fn.ap=function(t){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(n){return t.map(n)}})},List.fn.reduce=function(n,t){var r=this;return this.caseOf({Nil:function(){return t},Cons:function(){return foldl(n,t,r)}})},List.fn.reduceRight=function(n,t){var r=this;return this.caseOf({Nil:function(){return t},Cons:function(){return foldr(n,t,r)}})},List.fn.traverse=function(e,n){var t=this;return this.caseOf({Nil:function(){return n.of(t)},Cons:function(){return t.reduceRight(function(n,r){return n.flatMap(function(t){return e(r).map(function(n){return _Cons(n,t)})})},n.of(Nil()))}})},List.fn.sequence=function(n){return this.traverse(function(n){return n},n)},List.fn.alt=function(n){var t=this;return this.caseOf({Nil:function(){return n},Cons:function(){return t}})},List.fn.foldMap=function(r){return this.reduceRight(function(n,t){return null==n?r(t):n.concat(r(t))},null)},List.fn.fold=function(n){return this.foldMap(n.of)},List.fn.filter=function(r){return this.reduceRight(function(n,t){return r(t)?_Cons(t,n):n},Nil())},List.fn.intersperse=function(r){return this.reduceRight(function(n,t){return Nil.is(n)?_Cons(t,n):_Cons(t,_Cons(r,n))},Nil())},List.fn.cons=function(n){return _Cons(n,this)},List.fn.snoc=function(n){return this.reduceRight(function(n,t){return _Cons(t,n)},_Cons(n,Nil()))},List.fn.take=function(r){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(n,t){return 0<r?_Cons(n,t.take(r-1)):Nil()}})},List.fn.drop=function(r){var n=this;return this.caseOf({Nil:function(){return n},Cons:function(n,t){return 1<r?t.drop(r-1):t}})},List.fn.find=function(r){var n=this;return this.caseOf({Nil:function(){return null},Cons:function(){return breakableFoldl(function(n,t){return r(t)?[BREAK,t]:[null,n]},null,n)}})};var IO=Type("IO",["run"]);IO.of=function(n){return IO(function(){return n})},IO.empty=function(){return IO(function(n){return n})},IO.from=function(n){return"function"==typeof n?IO(n):IO.of(n)},IO.fromEither=function(n){return IO.of(n.value)},IO.fromMaybe=function(n){return IO.of(n.value)},IO.fromList=function(n){return IO.of(n.head)},IO.fromId=function(n){return IO.of(n.value)},IO.fn.concat=function(t){var r=this;if(IO.is(t))return IO(function(n){return t.run(r.run(n))});throw"IO::concat cannot append "+typeOf(t)+" to "+typeOf(this)},IO.fn.map=function(t){var r=this;return IO(function(n){return t(r.run(n))})},IO.fn.flat=function(){return this.run()},IO.fn.flatMap=function(n){return this.map(n).flat()},IO.fn.ap=function(n){return n.map(this.run)},IO.fn.contraMap=function(t){var r=this;return IO(function(n){return r.run(t(n))})},IO.fn.proMap=function(t,r){var e=this;return IO(function(n){return r(e.run(t(n)))})};var State=Type("State",["compute"]);State.Result=Type("State.Result",["value","state"]),State.of=function(t){return State(function(n){return State.Result(t,n)})},State.get=function(){return State(function(n){return State.Result(n,n)})},State.put=function(n){return State(function(){return State.Result(null,n)})},State.modify=function(t){return State.get().flatMap(function(n){return State.put(t(n))})},State.fn.map=function(u){var i=this;return State(function(n){var t=i.compute(n),r=t.value,e=t.state;return State.Result(u(r),e)})},State.fn.flat=function(){var u=this;return State(function(n){var t=u.compute(n),r=t.value,e=t.state;return r.compute(e)})},State.fn.flatMap=function(n){return this.map(n).flat()},State.fn.ap=function(n){return this.flatMap(n.map.bind(n))},State.fn.run=function(n){return this.compute(n).value},State.fn.exec=function(n){return this.compute(n).state};var delay=function(n){return"undefined"!=typeof setImmediate?setImmediate(n):"undefined"!=typeof process?process.nextTick(n):setTimeout(n,0)},voids=function(){},Task=Type("Task",["run"]).deriving(Show,Eq);Task.fn.cleanUp=voids,Task.of=function(r){return Task(function(n,t){t(r)})},Task.empty=function(){return Task(voids)},Task.resolve=Task.of,Task.reject=function(t){return Task(function(n){n(t)})},Task.timeout=function(r,e){return Task(function(n,t){setTimeout(function(){return t(e())},r)})},Task.fromPromiseFunction=function(e){return function(){for(var n=arguments.length,r=Array(n),t=0;t<n;t++)r[t]=arguments[t];return Task(function(n,t){e.apply(void 0,r).then(t).catch(n)})}},Task.fromNodeFunction=function(u){return function(){for(var n=arguments.length,t=Array(n),r=0;r<n;r++)t[r]=arguments[r];return Task(function(r,e){u.apply(void 0,t.concat([function(n,t){n?r(n):e(t)}]))})}},Task.fromId=function(n){return Task.of(n.value)},Task.fromMaybe=function(r){return Task(function(n,t){r.isSome()?t(r.value):n(null)})},Task.fromEither=function(r){return Task(function(n,t){r.cata({Left:n,Right:t})})},Task.fromList=function(n){return null==n.head?Task.reject(n.head):Task.of(n.head)},Task.fromIO=function(r){return Task(function(t,n){try{n(r.run())}catch(n){t(n)}})},Task.fn.toPromise=function(){var r=this;return new Promise(function(n,t){r.run(t,n)})},Task.fn.concat=function(i){var o=this;if(Task.is(i)){var a=function(n,t){o.cleanUp(n),i.cleanUp(t)},n=Task(function(n,t){var r=!1,e=[],u=function(t){return function(n){r||(r=!0,delay(function(){return a(e[0],e[1])}),t(n))}};return e[0]=o.run(u(n),u(t)),e[1]=i.run(u(n),u(t)),e});return n.cleanUp=a,n}throw"Task::concat cannot append "+typeOf(i)+" to "+typeOf(this)},Task.fn.map=function(r){var e=this,n=Task(function(n,t){e.run(n,function(n){return t(r(n))})});return n.cleanUp=this.cleanUp,n},Task.fn.flat=function(){var n=this,t=Task(function(t,r){n.run(t,function(n){return n.run(t,r)})});return t.cleanUp=this.cleanUp,t},Task.fn.flatMap=function(e){var n=this,t=Task(function(t,r){n.run(t,function(n){return e(n).run(t,r)})});return t.cleanUp=this.cleanUp,t},Task.fn.ap=function(s){var l=this,h=function(n,t){l.cleanUp(n),s.cleanUp(t)},n=Task(function(t,r){var e=!1,u=!1,i=!1,o=!1,a=!1,f=[],n=function(n){a||(a=!0,t(n))},c=function(t){return function(n){if(!a)return t(n),u&&o?(delay(function(){return h(f[0],f[1])}),r(e(i))):n}};return f[0]=l.run(n,c(function(n){u=!0,e=n})),f[1]=s.run(n,c(function(n){o=!0,i=n})),f});return n.cleanUp=h,n},Task.fn.swap=function(){var r=this,n=Task(function(n,t){r.run(t,n)});return n.cleanUp=this.cleanUp,n},Task.fn.alt=function(r){var e=this,n=Task(function(n,t){e.run(function(){return r.run(n,t)},t)});return n.cleanUp=this.cleanUp,n};var Free=UnionType("Free",{Cont:["value","run"],Return:["value"]}),_Cont=Free.Cont,_Return=Free.Return;Free.of=_Return,Free.liftM=function(n){return _Cont(n,_Return)},Free.from=function(n){return arity(n.length,function(){return Free.liftM(n.apply(void 0,arguments))})},Free.fn.map=function(r){return this.caseOf({Return:function(n){return _Return(r(n))},Cont:function(n,t){return _Cont(n,function(n){return t(n).map(r)})}})},Free.fn.flatMap=function(r){return this.caseOf({Return:function(n){return r(n)},Cont:function(n,t){return _Cont(n,function(n){return t(n).flatMap(r)})}})},Free.fn.ap=function(r){return this.caseOf({Return:function(n){return r.map(n)},Cont:function(n,t){return _Cont(n,function(n){return t(n).ap(r)})}})},Free.fn.interpret=function(r,e){return this.caseOf({Return:function(n){return e.of(n)},Cont:function(n,t){return null==n?t().interpret(r,e):r(n).flatMap(function(n){return t(n).interpret(r,e)})}})};var __export={Id:Id,Maybe:Maybe,Either:Either,List:List,IO:IO,State:State,Task:Task,Free:Free};module.exports=__export;
