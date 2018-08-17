/* @banner futils | www.npmjs.com/package/futils */
"use strict";var typeOf$1=function(t){return null===t?"Null":void 0===t?"Void":void 0!==t.prototype.__type__?t.prototype.__type__:t.constructor.name},arity=function(t,v){if("number"!=typeof t||isNaN(t)||!isFinite(t))throw"Aritiy of a function cannot be "+t;if("function"!=typeof v)throw v+" does not have some arity, only functions have";switch(Math.abs(t)){case 1:return function(t){return v(t)};case 2:return function(t,r){return v(t,r)};case 3:return function(t,r,e){return v(t,r,e)};case 4:return function(t,r,e,n){return v(t,r,e,n)};case 5:return function(t,r,e,n,o){return v(t,r,e,n,o)};case 6:return function(t,r,e,n,o,u){return v(t,r,e,n,o,u)};case 7:return function(t,r,e,n,o,u,a){return v(t,r,e,n,o,u,a)};case 8:return function(t,r,e,n,o,u,a,i){return v(t,r,e,n,o,u,a,i)};case 9:return function(t,r,e,n,o,u,a,i,c){return v(t,r,e,n,o,u,a,i,c)};case 10:return function(t,r,e,n,o,u,a,i,c,f){return v(t,r,e,n,o,u,a,i,c,f)};case 11:return function(t,r,e,n,o,u,a,i,c,f,s){return v(t,r,e,n,o,u,a,i,c,f,s)};case 12:return function(t,r,e,n,o,u,a,i,c,f,s,p){return v(t,r,e,n,o,u,a,i,c,f,s,p)};case 13:return function(t,r,e,n,o,u,a,i,c,f,s,p,y){return v(t,r,e,n,o,u,a,i,c,f,s,p,y)};case 14:return function(t,r,e,n,o,u,a,i,c,f,s,p,y,l){return v(t,r,e,n,o,u,a,i,c,f,s,p,y,l)};case 15:return function(t,r,e,n,o,u,a,i,c,f,s,p,y,l,h){return v(t,r,e,n,o,u,a,i,c,f,s,p,y,l,h)};case 16:return function(t,r,e,n,o,u,a,i,c,f,s,p,y,l,h,m){return v(t,r,e,n,o,u,a,i,c,f,s,p,y,l,h,m)};default:return v}},classCallCheck=function(t,r){if(!(t instanceof r))throw new TypeError("Cannot call a class as a function")},createClass=function(){function n(t,r){for(var e=0;e<r.length;e++){var n=r[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(t,r,e){return r&&n(t.prototype,r),e&&n(t,e),t}}(),defineProperty=function(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t},slicedToArray=function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,r){var e=[],n=!0,o=!1,u=void 0;try{for(var a,i=t[Symbol.iterator]();!(n=(a=i.next()).done)&&(e.push(a.value),!r||e.length!==r);n=!0);}catch(t){o=!0,u=t}finally{try{!n&&i.return&&i.return()}finally{if(o)throw u}}return e}(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")},toConsumableArray=function(t){if(Array.isArray(t)){for(var r=0,e=Array(t.length);r<t.length;r++)e[r]=t[r];return e}return Array.from(t)},TYPE=Symbol("@@type"),VALS=Symbol("@@values"),TYPE_TAG=Symbol("@@type_tag"),def=function(t,r,e){return Object.defineProperty(t,r,{enumerable:!1,writable:!1,configurable:!1,value:e})},caseOfT=function(r,t){if("function"==typeof t[r[TYPE]])return t[r[TYPE]].apply(r,r[VALS].map(function(t){return r[t]}));throw t[TYPE_TAG]+"::caseOf - No pattern matched "+r[TYPE]+" in "+Object.keys(t)},initT=function(t,r,n,e){if(r.length===n.length){var o=Object.create(e);return o.__type__=o[TYPE]=t,o.__values__=o[VALS]=r,r.reduce(function(t,r,e){return t[r]=n[e],t},o)}throw t+" awaits "+r.length+" arguments but got "+n.length},makeCtor=function(n,o,u){switch(o.length){case 0:return function(){return initT(n,o,[],u)};default:return arity(o.length,function(){for(var t=arguments.length,r=Array(t),e=0;e<t;e++)r[e]=arguments[e];return initT(n,o,r,u)})}},deriveT=function(n){return function(){for(var t=arguments.length,r=Array(t),e=0;e<t;e++)r[e]=arguments[e];return r.reduce(function(t,r){return r.mixInto(t)},n)}},Type=function(r,t){var e={},n=makeCtor(r,null,t,e);return def(n,"is",function(t){return t&&t[TYPE]===r}),def(n,"deriving",deriveT(n)),n.prototype=e,n.prototype.constructor=n},UnionType=function(r,e){var t,n,o=(defineProperty(n={},TYPE,r),defineProperty(n,"prototype",(defineProperty(t={},TYPE_TAG,r),defineProperty(t,"caseOf",function(t){return caseOfT(this,t)}),defineProperty(t,"cata",function(t){return caseOfT(this,t)}),t)),n);return def(o,"is",function(t){return null!=t&&t[TYPE_TAG]===r}),def(o,"deriving",deriveT(o)),Object.keys(e).forEach(function(t){var r=makeCtor(t,e[t],o.prototype);o[t]=r}),o},showT=function o(r){if(null===r)return"Null";if(void 0===r)return"Void";switch(r.constructor.name){case"Boolean":case"String":case"Number":case"RegExp":case"Symbol":return r.toString();case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return r.constructor.name;case"Date":return r.getFullYear()+"-"+(r.getMonth()+1)+"-"+r.getDate();case"Array":return"["+r.map(o).join(", ")+"]";case"Object":return"{"+Object.keys(r).map(function(t){return t+": "+o(r[t])}).join(", ")+"}";case"Set":return"Set("+[].concat(toConsumableArray(r.entries())).map(function(t){var r=slicedToArray(t,2),e=r[0],n=r[1];return e+": "+o(n)}).join(", ")+")";case"Map":return"Map("+[].concat(toConsumableArray(r.entries())).map(function(t){var r=slicedToArray(t,2),e=r[0],n=r[1];return e+": "+o(n)}).join(", ")+")";default:return""+r}},Show=function(){function t(){classCallCheck(this,t)}return createClass(t,null,[{key:"mixInto",value:function(t){if(t&&t.prototype)return t.prototype.toString=function(){var r=this;return null!=this.__type__?this.__type__+"("+this.__values__.map(function(t){return showT(r[t])}).join(" ")+")":showT(this)},t.prototype.inspect=function(){return this.toString()},t;throw"Cannot derive Show from "+typeOf$1(t)}}]),t}(),compareEq=function e(r,n){var t=typeOf$1(r);if(t!==typeOf$1(n))return!1;switch(t){case"Null":case"Void":case"Boolean":case"String":case"Number":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return r===n;case"Date":return n.valueOf()===r.valueOf();case"RegExp":return n.toString()===r.toString();case"Array":return n.length===r.length&&r.every(function(t,r){return e(t,n[r])});case"Object":return Object.keys(r).every(function(t){return e(r[t],n[t])})&&Object.keys(n).every(function(t){return e(r[t],n[t])});case"Set":case"Map":return e([].concat(toConsumableArray(n.entries())),[].concat(toConsumableArray(r.entries())));case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return r.name===n.name&&r.message===n.message;default:return e(r.value,n.value)}},Eq=function(){function t(){classCallCheck(this,t)}return createClass(t,null,[{key:"mixInto",value:function(t){if(t&&t.prototype)return t.prototype.equals=function(t){return compareEq(this,t)},t;throw"Cannot derive Eq from "+typeOf$1(t)}}]),t}(),compareOrd=function e(r,n){var t=typeOf$1(r),o=typeOf$1(n);if(t===o)switch(t){case"String":return r.localeCompare(n)<0;case"Number":case"Date":return r<n;case"Array":return r.length<n.length&&r.every(function(t,r){return e(t,n[r])});case"Object":return Object.keys(r).every(function(t){return e(r[t],n[t])});case"Set":case"Map":return e([].concat(toConsumableArray(r.entries())),[].concat(toConsumableArray(n.entries())));case"Null":case"Void":case"Boolean":case"RegExp":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return!1;default:return e(r.value,n.value)}throw"Cannot order value of type "+t+" with value of type "+o},Ord=function(){function t(){classCallCheck(this,t)}return createClass(t,null,[{key:"mixInto",value:function(t){if(t&&t.prototype&&t.prototype.equals)return t.prototype.lt=function(t){return compareOrd(this,t)},t.prototype.lte=function(t){return this.lt(t)||this.equals(t)},t.prototype.gt=function(t){return!this.lte(t)},t.prototype.gte=function(t){return!this.lt(t)||this.equals(t)},t;throw"Cannot derive Ord from "+typeOf$1(t)}}]),t}(),Id=Type("Id",["value"]).deriving(Show,Eq,Ord);((Id.of=Id).from=Id).fromEither=function(t){return Id(t.value)},Id.fromMaybe=function(t){return Id(t.value)},Id.fromList=function(t){return Id(t.value[0])},Id.prototype.concat=function(t){if(Id.is(t))return Id(this.value.concat(t.value));throw"Id::concat cannot append "+typeOf$1(t)+" to "+typeOf$1(this)},Id.prototype.map=function(t){return Id(t(this.value))},Id.prototype.flat=function(){return this.value},Id.prototype.flatMap=function(t){return this.map(t).flat()},Id.prototype.ap=function(t){return t.map(this.value)},Id.prototype.reduce=function(t,r){return t(r,this.value)},Id.prototype.traverse=function(t,r){return r.prototype.ap?r.of(Id.of).ap(t(this.value)):t(this.value).map(Id.of)},Id.prototype.sequence=function(t){return this.traverse(function(t){return t},t)};var Maybe=UnionType("Maybe",{Some:["value"],None:[]}).deriving(Show,Eq,Ord),_Some=Maybe.Some,None=Maybe.None;Maybe.prototype.value=null,Maybe.of=_Some,Maybe.empty=None,Maybe.from=function(t){return null==t?None():_Some(t)},Maybe.fromEither=function(t){return t.isRight()?_Some(t.value):None()},Maybe.fromId=function(t){return Maybe.from(t.value)},Maybe.fromList=function(t){return Maybe.from(t.value[0])},Maybe.prototype.isSome=function(){return this.caseOf({None:function(){return!1},Some:function(){return!0}})},Maybe.prototype.concat=function(r){var e=this;if(Maybe.is(r))return this.caseOf({None:function(){return e},Some:function(t){return r.isSome()?_Some(t.concat(r.value)):e}});throw"Maybe::concat cannot append "+typeOf$1(r)+" to "+typeOf$1(this)},Maybe.prototype.map=function(r){var t=this;return this.caseOf({None:function(){return t},Some:function(t){return Maybe.from(r(t))}})},Maybe.prototype.flat=function(){var t=this;return this.caseOf({None:function(){return t},Some:function(t){return t}})},Maybe.prototype.flatMap=function(t){return this.map(t).flat()},Maybe.prototype.ap=function(r){var t=this;return this.caseOf({None:function(){return t},Some:function(t){return r.map(t)}})},Maybe.prototype.biMap=function(t,r){return this.caseOf({None:function(){return Maybe.from(t(null))},Some:function(t){return Maybe.from(r(t))}})},Maybe.prototype.reduce=function(r,e){return this.caseOf({None:function(){return e},Some:function(t){return r(e,t)}})},Maybe.prototype.traverse=function(r,t){var e=this;return this.caseOf({None:function(){return t.of(e)},Some:function(t){return r(t).map(Maybe.from)}})},Maybe.prototype.sequence=function(t){return this.traverse(function(t){return t},t)},Maybe.prototype.alt=function(t){var r=this;return this.caseOf({None:function(){return t},Some:function(){return r}})};var Either=UnionType("Either",{Right:["value"],Left:["value"]}).deriving(Show,Eq,Ord),_Right=Either.Right,Left=Either.Left;Either.of=_Right,Either.empty=function(){return Left(null)},Either.from=function(t){return null==t||Error.prototype.isPrototypeOf(t)?Left(t||null):_Right(t)},Either.fromMaybe=function(t){return t.isSome()?_Right(t.value):Left(null)},Either.fromId=function(t){return Either.from(t.value)},Either.fromList=function(t){return Either.from(t.value[0])},Either.try=function(t){return function(){try{return Either.from(t.run?t.run.apply(t,arguments):t.apply(void 0,arguments))}catch(t){return Left(t)}}},Either.prototype.isRight=function(){return this.caseOf({Left:function(){return!1},Right:function(){return!0}})},Either.prototype.concat=function(r){var e=this;if(Either.is(r))return this.caseOf({Left:function(){return e},Right:function(t){return r.isRight()?_Right(t.concat(r.value)):e}});throw"Either::concat cannot append "+typeOf$1(r)+" to "+typeOf$1(this)},Either.prototype.map=function(r){var t=this;return this.caseOf({Left:function(){return t},Right:function(t){return Either.from(r(t))}})},Either.prototype.flat=function(){var t=this;return this.caseOf({Left:function(){return t},Right:function(t){return t}})},Either.prototype.flatMap=function(t){return this.map(t).flat()},Either.prototype.ap=function(r){var t=this;return this.caseOf({Left:function(){return t},Right:function(t){return r.map(t)}})},Either.prototype.biMap=function(r,e){return this.caseOf({Left:function(t){return Either.from(r(t))},Right:function(t){return Either.from(e(t))}})},Either.prototype.reduce=function(r,e){return this.caseOf({Left:function(){return e},Right:function(t){return r(e,t)}})},Either.prototype.traverse=function(r,t){var e=this;return this.caseOf({Left:function(){return t.of(e)},Right:function(t){return r(t).map(Either.from)}})},Either.prototype.sequence=function(t){return this.traverse(function(t){return t},t)},Either.prototype.swap=function(){return this.caseOf({Left:_Right,Right:Left})},Either.prototype.alt=function(t){var r=this;return this.caseOf({Left:function(){return t},Right:function(){return r}})};var arrayFrom=function(t){return Array.isArray(t)?t:null==t?[]:t.length&&"string"!=typeof t?Array.from(t):[t]},List=Type("List",["value"]).deriving(Show,Eq,Ord);List.of=function(){for(var t=arguments.length,r=Array(t),e=0;e<t;e++)r[e]=arguments[e];return List(r)},List.empty=function(){return List([])},List.from=function(t){return List(arrayFrom(t))},(List.fromArray=List).fromId=function(t){return List.from(t.value)},List.fromMaybe=function(t){return t.isSome()?List.from(t.value):List.empty()},List.fromEither=function(t){return t.isRight()?List.from(t.value):List.empty()},List.prototype[Symbol.iterator]=function(){return this.value[Symbol.iterator]()},List.prototype.toArray=function(){return this.value},List.prototype.concat=function(t){if(List.is(t))return List(this.value.concat(t.value));throw"List::concat cannot append "+typeOf(t)+" to "+typeOf(this)},List.prototype.map=function(t){return List(this.value.map(t))},List.prototype.flat=function(){return this.value.reduce(function(t,r){return t.concat(r)})},List.prototype.flatMap=function(t){return this.map(t).flat()},List.prototype.ap=function(t){return t.map(this.value[0])},List.prototype.reduce=function(t,r){return this.value.reduce(t,r)},List.prototype.traverse=function(e,t){return this.reduce(function(t,r){return e(r).map(function(r){return function(t){return t.concat(List.of(r))}}).ap(t)},t.of(List.empty()))},List.prototype.sequence=function(t){return this.traverse(function(t){return t},t)},List.prototype.alt=function(t){return this.value.length<1?t:this};var IO=Type("IO",["run"]);IO.of=function(t){return IO(function(){return t})},IO.empty=function(){return IO(function(t){return t})},IO.from=function(t){return"function"==typeof t?IO(t):IO.of(t)},IO.fromEither=function(t){return IO.of(t.value)},IO.fromMaybe=function(t){return IO.of(t.value)},IO.fromList=function(t){return IO.of(null==t.value[0]?null:t.value[0])},IO.fromId=function(t){return IO.of(t.value)},IO.prototype.concat=function(r){var e=this;if(IO.is(r))return IO(function(t){return r.run(e.run(t))});throw"IO::concat cannot append "+typeOf$1(r)+" to "+typeOf$1(this)},IO.prototype.map=function(r){var e=this;return IO(function(t){return r(e.run(t))})},IO.prototype.flat=function(){return this.run()},IO.prototype.flatMap=function(t){return this.map(t).flat()},IO.prototype.ap=function(t){return t.map(this.run)},IO.prototype.contraMap=function(r){var e=this;return IO(function(t){return e.run(r(t))})},IO.prototype.proMap=function(r,e){var n=this;return IO(function(t){return e(n.run(r(t)))})};var State=Type("State",["compute"]),StateResult=Type("State.Result",["value","state"]);State.of=function(r){return State(function(t){return StateResult(r,t)})},State.get=function(){return State(function(t){return StateResult(t,t)})},State.put=function(t){return State(function(){return StateResult(null,t)})},State.modify=function(r){return State.get().flatMap(function(t){return State.put(r(t))})},State.prototype.map=function(o){var u=this;return State(function(t){var r=u.compute(t),e=r.value,n=r.state;return StateResult(o(e),n)})},State.prototype.flat=function(){var o=this;return State(function(t){var r=o.compute(t),e=r.value,n=r.state;return e.compute(n)})},State.prototype.flatMap=function(t){return this.map(t).flat()},State.prototype.ap=function(t){return this.flatMap(t.map.bind(t))},State.prototype.run=function(t){return this.compute(t).value},State.prototype.exec=function(t){return this.compute(t).state};var delay=function(t){return"undefined"!=typeof setImmediate?setImmediate(t):"undefined"!=typeof process?process.nextTick(t):setTimeout(t,0)},voids=function(){},Task=Type("Task",["run"]).deriving(Show,Eq);Task.prototype.cleanUp=voids,Task.of=function(e){return Task(function(t,r){r(e)})},Task.empty=function(){return Task(voids)},Task.resolve=Task.of,Task.reject=function(r){return Task(function(t){t(r)})},Task.timeout=function(e,n){return Task(function(t,r){setTimeout(function(){return r(n())},e)})},Task.fromPromiseFunction=function(n){return function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];return Task(function(t,r){n.apply(void 0,e).then(r).catch(t)})}},Task.fromNodeFunction=function(o){return function(){for(var t=arguments.length,r=Array(t),e=0;e<t;e++)r[e]=arguments[e];return Task(function(e,n){o.apply(void 0,r.concat([function(t,r){t?e(t):n(r)}]))})}},Task.fromId=function(t){return Task.of(t.value)},Task.fromMaybe=function(e){return Task(function(t,r){e.cata({None:t,Some:r})})},Task.fromEither=function(e){return Task(function(t,r){e.cata({Left:t,Right:r})})},Task.fromList=function(t){return null==t.value[0]?Task.reject(t.value[0]):Task.of(t.value[0])},Task.fromIO=function(e){return Task(function(r,t){try{t(e.run())}catch(t){r(t)}})},Task.prototype.toPromise=function(){var e=this;return new Promise(function(t,r){e.run(r,t)})},Task.prototype.concat=function(u){var a=this;if(Task.is(u)){var i=function(t,r){a.cleanUp(t),u.cleanUp(r)},t=Task(function(t,r){var e=!1,n=[],o=function(r){return function(t){e||(e=!0,delay(function(){return i(n[0],n[1])}),r(t))}};return n[0]=a.run(o(t),o(r)),n[1]=u.run(o(t),o(r)),n});return t.cleanUp=i,t}throw"Task::concat cannot append "+typeOf$1(u)+" to "+typeOf$1(this)},Task.prototype.map=function(e){var n=this,t=Task(function(t,r){n.run(t,function(t){return r(e(t))})});return t.cleanUp=this.cleanUp,t},Task.prototype.flat=function(){var e=this,t=Task(function(t,r){e.run().run(t,r)});return t.cleanUp=this.cleanUp,t},Task.prototype.flatMap=function(n){var t=this,r=Task(function(r,e){t.run(r,function(t){return n(t).run(r,e)})});return r.cleanUp=this.cleanUp,r},Task.prototype.ap=function(s){var p=this,y=function(t,r){p.cleanUp(t),s.cleanUp(r)},t=Task(function(r,e){var n=!1,o=!1,u=!1,a=!1,i=!1,c=[],t=function(t){i||(i=!0,r(t))},f=function(r){return function(t){if(!i)return r(t),o&&a?(delay(function(){return y(c[0],c[1])}),e(n(u))):t}};return c[0]=p.run(t,f(function(t){o=!0,n=t})),c[1]=s.run(t,f(function(t){a=!0,u=t})),c});return t.cleanUp=y,t},Task.prototype.swap=function(){var e=this,t=Task(function(t,r){e.run(r,t)});return t.cleanUp=this.cleanUp,t},Task.prototype.alt=function(e){var n=this,t=Task(function(t,r){n.run(function(){return e.run(t,r)},r)});return t.cleanUp=this.cleanUp,t};var Free=UnionType("Free",{Cont:["value","run"],Return:["value"]}),_Cont=Free.Cont,_Return=Free.Return;Free.of=_Return,Free.liftM=function(t){return _Cont(t,_Return)},Free.from=function(t){return arity(t.length,function(){return Free.liftM(t.apply(void 0,arguments))})},Free.prototype.map=function(e){return this.caseOf({Return:function(t){return _Return(e(t))},Cont:function(t,r){return _Cont(t,function(t){return r(t).map(e)})}})},Free.prototype.flatMap=function(e){return this.caseOf({Return:function(t){return e(t)},Cont:function(t,r){return _Cont(t,function(t){return r(t).flatMap(e)})}})},Free.prototype.ap=function(e){return this.caseOf({Return:function(t){return e.map(t)},Cont:function(t,r){return _Cont(t,function(t){return r(t).ap(e)})}})},Free.prototype.interpret=function(e,n){return this.caseOf({Return:function(t){return n.of(t)},Cont:function(t,r){return null==t?r().interpret(e,n):e(t).flatMap(function(t){return r(t).interpret(e,n)})}})};var __export={Id:Id,Maybe:Maybe,Either:Either,List:List,IO:IO,State:State,Task:Task,Free:Free};module.exports=__export;