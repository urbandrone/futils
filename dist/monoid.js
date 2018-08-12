/* @banner futils | www.npmjs.com/package/futils */
"use strict";var typeOf=function(r){return null===r?"Null":void 0===r?"Void":void 0!==r.prototype.__type__?r.prototype.__type__:r.constructor.name},arity=function(r,v){if("number"!=typeof r||isNaN(r)||!isFinite(r))throw"Aritiy of a function cannot be "+r;if("function"!=typeof v)throw v+" does not have some arity, only functions have";switch(Math.abs(r)){case 1:return function(r){return v(r)};case 2:return function(r,e){return v(r,e)};case 3:return function(r,e,t){return v(r,e,t)};case 4:return function(r,e,t,n){return v(r,e,t,n)};case 5:return function(r,e,t,n,a){return v(r,e,t,n,a)};case 6:return function(r,e,t,n,a,o){return v(r,e,t,n,a,o)};case 7:return function(r,e,t,n,a,o,u){return v(r,e,t,n,a,o,u)};case 8:return function(r,e,t,n,a,o,u,c){return v(r,e,t,n,a,o,u,c)};case 9:return function(r,e,t,n,a,o,u,c,i){return v(r,e,t,n,a,o,u,c,i)};case 10:return function(r,e,t,n,a,o,u,c,i,s){return v(r,e,t,n,a,o,u,c,i,s)};case 11:return function(r,e,t,n,a,o,u,c,i,s,f){return v(r,e,t,n,a,o,u,c,i,s,f)};case 12:return function(r,e,t,n,a,o,u,c,i,s,f,y){return v(r,e,t,n,a,o,u,c,i,s,f,y)};case 13:return function(r,e,t,n,a,o,u,c,i,s,f,y,l){return v(r,e,t,n,a,o,u,c,i,s,f,y,l)};case 14:return function(r,e,t,n,a,o,u,c,i,s,f,y,l,p){return v(r,e,t,n,a,o,u,c,i,s,f,y,l,p)};case 15:return function(r,e,t,n,a,o,u,c,i,s,f,y,l,p,h){return v(r,e,t,n,a,o,u,c,i,s,f,y,l,p,h)};case 16:return function(r,e,t,n,a,o,u,c,i,s,f,y,l,p,h,d){return v(r,e,t,n,a,o,u,c,i,s,f,y,l,p,h,d)};default:return v}},classCallCheck=function(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")},createClass=function(){function n(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}return function(r,e,t){return e&&n(r.prototype,e),t&&n(r,t),r}}(),slicedToArray=function(r,e){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return function(r,e){var t=[],n=!0,a=!1,o=void 0;try{for(var u,c=r[Symbol.iterator]();!(n=(u=c.next()).done)&&(t.push(u.value),!e||t.length!==e);n=!0);}catch(r){a=!0,o=r}finally{try{!n&&c.return&&c.return()}finally{if(a)throw o}}return t}(r,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")},toConsumableArray=function(r){if(Array.isArray(r)){for(var e=0,t=Array(r.length);e<r.length;e++)t[e]=r[e];return t}return Array.from(r)},TYPE=Symbol("@@type"),VALS=Symbol("@@values"),def=function(r,e,t){return Object.defineProperty(r,e,{enumerable:!1,writable:!1,configurable:!1,value:t})},initT=function(r,e,n,t){if(e.length===n.length){var a=Object.create(t);return a.__type__=a[TYPE]=r,a.__values__=a[VALS]=e,e.reduce(function(r,e,t){return r[e]=n[t],r},a)}throw r+" awaits "+e.length+" arguments but got "+n.length},makeCtor=function(n,a,o){switch(a.length){case 0:return function(){return initT(n,a,[],o)};default:return arity(a.length,function(){for(var r=arguments.length,e=Array(r),t=0;t<r;t++)e[t]=arguments[t];return initT(n,a,e,o)})}},deriveT=function(n){return function(){for(var r=arguments.length,e=Array(r),t=0;t<r;t++)e[t]=arguments[t];return e.reduce(function(r,e){return e.mixInto(r)},n)}},Type=function(e,r){var t={},n=makeCtor(e,null,r,t);return def(n,"is",function(r){return r&&r[TYPE]===e}),def(n,"deriving",deriveT(n)),n.prototype=t,n.prototype.constructor=n},showT=function a(e){if(null===e)return"Null";if(void 0===e)return"Void";switch(e.constructor.name){case"Boolean":case"String":case"Number":case"RegExp":case"Symbol":return e.toString();case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return e.constructor.name;case"Date":return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate();case"Array":return"["+e.map(a).join(", ")+"]";case"Object":return"{"+Object.keys(e).map(function(r){return r+": "+a(e[r])}).join(", ")+"}";case"Set":return"Set("+[].concat(toConsumableArray(e.entries())).map(function(r){var e=slicedToArray(r,2),t=e[0],n=e[1];return t+": "+a(n)}).join(", ")+")";case"Map":return"Map("+[].concat(toConsumableArray(e.entries())).map(function(r){var e=slicedToArray(r,2),t=e[0],n=e[1];return t+": "+a(n)}).join(", ")+")";default:return""+e}},Show=function(){function r(){classCallCheck(this,r)}return createClass(r,null,[{key:"mixInto",value:function(r){if(r&&r.prototype)return r.prototype.toString=function(){var e=this;return null!=this.__type__?this.__type__+"("+this.__values__.map(function(r){return showT(e[r])}).join(" ")+")":showT(this)},r.prototype.inspect=function(){return this.toString()},r;throw"Cannot derive Show from "+typeOf(r)}}]),r}(),compareEq=function t(e,n){var r=typeOf(e);if(r!==typeOf(n))return!1;switch(r){case"Null":case"Void":case"Boolean":case"String":case"Number":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return e===n;case"Date":return n.valueOf()===e.valueOf();case"RegExp":return n.toString()===e.toString();case"Array":return n.length===e.length&&e.every(function(r,e){return t(r,n[e])});case"Object":return Object.keys(e).every(function(r){return t(e[r],n[r])})&&Object.keys(n).every(function(r){return t(e[r],n[r])});case"Set":case"Map":return t([].concat(toConsumableArray(n.entries())),[].concat(toConsumableArray(e.entries())));case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":return e.name===n.name&&e.message===n.message;default:return t(e.value,n.value)}},Eq=function(){function r(){classCallCheck(this,r)}return createClass(r,null,[{key:"mixInto",value:function(r){if(r&&r.prototype)return r.prototype.equals=function(r){return compareEq(this,r)},r;throw"Cannot derive Eq from "+typeOf(r)}}]),r}(),compareOrd=function t(e,n){var r=typeOf(e),a=typeOf(n);if(r===a)switch(r){case"String":return e.localeCompare(n)<0;case"Number":case"Date":return e<n;case"Array":return e.length<n.length&&e.every(function(r,e){return t(r,n[e])});case"Object":return Object.keys(e).every(function(r){return t(e[r],n[r])});case"Set":case"Map":return t([].concat(toConsumableArray(e.entries())),[].concat(toConsumableArray(n.entries())));case"Null":case"Void":case"Boolean":case"RegExp":case"Error":case"EvalError":case"TypeError":case"RangeError":case"SyntaxError":case"ReferenceError":case"Function":case"GeneratorFunction":case"Promise":case"Proxy":case"Symbol":case"IO":case"Task":case"State":case"State.Value":case"DataBuffer":case"ArrayBuffer":case"SharedArrayBuffer":case"UInt8Array":case"UInt8ClampedArray":case"UInt16Array":case"UInt64Array":case"Float32Array":case"Float64Array":case"TypedArray":return!1;default:return t(e.value,n.value)}throw"Cannot order value of type "+r+" with value of type "+a},Ord=function(){function r(){classCallCheck(this,r)}return createClass(r,null,[{key:"mixInto",value:function(r){if(r&&r.prototype&&r.prototype.equals)return r.prototype.lt=function(r){return compareOrd(this,r)},r.prototype.lte=function(r){return this.lt(r)||this.equals(r)},r.prototype.gt=function(r){return!this.lte(r)},r.prototype.gte=function(r){return!this.lt(r)||this.equals(r)},r;throw"Cannot derive Ord from "+typeOf(r)}}]),r}(),Sum=Type("Sum",["value"]).deriving(Show,Eq,Ord);Sum.of=function(r){var e=Number(r);return"number"!=typeof e||isNaN(e)?Sum(0):Sum(e)},Sum.empty=function(){return Sum(0)},Sum.prototype.concat=function(r){if(Sum.is(r))return Sum(this.value+r.value);throw"Sum::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var Product=Type("Product",["value"]).deriving(Show,Eq,Ord);Product.of=function(r){var e=Number(r);return"number"!=typeof e||isNaN(e)?Product(1):Product(e)},Product.empty=function(){return Product(1)},Product.prototype.concat=function(r){if(Product.is(r))return Product(this.value*r.value);throw"Product::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var Min=Type("Min",["value"]).deriving(Show,Eq,Ord);Min.of=function(r){var e=Number(r);return"number"!=typeof e||isNaN(e)?Min(1/0):Min(e)},Min.empty=function(){return Min(1/0)},Min.prototype.concat=function(r){if(Min.is(r))return this.lt(r)?this:r;throw"Min::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var Max=Type("Max",["value"]).deriving(Show,Eq,Ord);Max.of=function(r){var e=Number(r);return"number"!=typeof e||isNaN(e)?Max(-1/0):Max(e)},Max.empty=function(){return Max(-1/0)},Max.prototype.concat=function(r){if(Max.is(r))return this.gt(r)?this:r;throw"Max::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var Char=Type("Char",["value"]).deriving(Show,Eq,Ord);Char.of=function(r){return Char("string"==typeof r?r:"")},Char.empty=function(){return Char("")},Char.prototype.concat=function(r){if(Char.is(r))return Char(this.value.concat(r.value));throw"Char::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var Fn=Type("Fn",["value"]).deriving(Show,Eq);Fn.of=function(r){return Fn("function"==typeof r?r:function(r){return r})},Fn.empty=function(){return Fn(function(r){return r})},Fn.prototype.concat=function(e){var t=this;if(Fn.is(e))return Fn(function(r){return e.value(t.value(r))});throw"Fn::concat cannot append "+typeOf(e)+" to "+typeOf(this)};var Any=Type("Any",["value"]).deriving(Show,Eq,Ord);Any.of=function(r){return Any("boolean"==typeof r&&r)},Any.empty=function(){return Any(!1)},Any.prototype.concat=function(r){if(Any.is(r))return this.value?this:Any(!!r.value);throw"Any::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var All=Type("All",["value"]).deriving(Show,Eq,Ord);All.of=function(r){return All("boolean"!=typeof r||r)},All.empty=function(){return All(!0)},All.prototype.concat=function(r){if(All.is(r))return this.value?All(!!this.value&&!!r.value):this;throw"All::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var Record=Type("Record",["value"]).deriving(Show,Eq,Ord);Record.of=function(r){return"Object"===typeOf(r)?Record(r):Record({})},Record.empty=function(){return Record({})},Record.prototype.concat=function(r){if(Record.is(r))return Record(Object.assign({},this.value,r.value));throw"Record::concat cannot append "+typeOf(r)+" to "+typeOf(this)};var __export={Sum:Sum,Product:Product,Min:Min,Max:Max,Char:Char,Fn:Fn,Any:Any,All:All,Record:Record};module.exports=__export;
