!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.futils=n()}(this,function(){"use strict";function t(n,e){return n.length<=0?e:function(){return G.isArray(n[0])?t([].concat(Y(n[0]),Y(n.slice(1))),e):t(n.slice(1),[].concat(Y(e),[n[0]]))}}function n(t){return{"@@transducer/step":t,"@@transducer/init":function(){throw"transducers/init not supported on generic transformers"},"@@transducer/result":function(t){return t}}}var e=function(t){return"function"==typeof t},r=function(t,n){var e=t,r=[],u=null;if(n.length>=e)return n;for(;e>0;)r.push("arg"+e--);return u="return ("+r.join(",")+") => fx("+r.join(",")+")",new Function("fx",u)(n)},u=function t(n){if(e(n))return function(){var e=arguments.length<=0||void 0===arguments[0]?void 0:arguments[0];return void 0===e?t(n):n(e)};throw"decorators::monadic awaits a function but saw "+n},i=function t(n){if(e(n))return function(){var e=arguments.length<=0||void 0===arguments[0]?void 0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?void 0:arguments[1];return void 0===e?t(n):void 0===r?u(function(t){return n(e,t)}):n(e,r)};throw"decorators::dyadic awaits a function but saw "+n},o=function t(n){if(e(n))return function(){var e=arguments.length<=0||void 0===arguments[0]?void 0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?void 0:arguments[1],o=arguments.length<=2||void 0===arguments[2]?void 0:arguments[2];return void 0===e?t(n):void 0===r?i(function(t,r){return n(e,t,r)}):void 0===o?u(function(t){return n(e,r,t)}):n(e,r,o)};throw"decorators::triadic awaits a function but saw "+n},a=function t(n){if(e(n))return function(){var e=arguments.length<=0||void 0===arguments[0]?void 0:arguments[0],r=arguments.length<=1||void 0===arguments[1]?void 0:arguments[1],a=arguments.length<=2||void 0===arguments[2]?void 0:arguments[2],f=arguments.length<=3||void 0===arguments[3]?void 0:arguments[3];return void 0===e?t(n):void 0===r?o(function(t,r,u){return n(e,t,r,u)}):void 0===a?i(function(t,u){return n(e,r,t,u)}):void 0===f?u(function(t){return n(e,r,a,t)}):n(e,r,a,f)};throw"decorators::tetradic awaits a function but saw "+n},f={aritize:r,monadic:u,dyadic:i,tetradic:a,triadic:o},c=function(t){return null===t||void 0===t},s=function(t){return!c(t)},l=function(t){return void 0===t},p=function(t){return null===t},y=function(t){return"string"==typeof t},v=function(t){return"number"==typeof t&&!isNaN(t)&&isFinite(t)},d=function(t){return v(t)&&t%1===0},h=function(t){return v(t)&&t%1!==0},m=function(t){return"boolean"==typeof t},b=function(t){return!!t},g=function(t){return!t},k=function(t){return"function"==typeof t},w=function(t){return"[object Object]"==={}.toString.call(t)},O=function(t){return Array.isArray(t)},F=function(t){return Date.prototype.isPrototypeOf(t)},A=function(t){return RegExp.prototype.isPrototypeOf(t)},S=function(t){return Node.prototype.isPrototypeOf(t)},x=function(t){return NodeList.prototype.isPrototypeOf(t)},M=function(t){return Map.prototype.isPrototypeOf(t)},I=function(t){return WeakMap.prototype.isPrototypeOf(t)},N=function(t){return Set.prototype.isPrototypeOf(t)},j=function(t){return WeakSet.prototype.isPrototypeOf(t)},R=function(t){return Promise.prototype.isPrototypeOf(t)||t&&k(t.then)},P=function(t){return!c(t)&&k(t.next)},L=function(t){return!(c(t)||!t[Symbol.iterator]&&isNaN(t.length))},T=function t(n,e){return void 0===e?function(e){return t(n,e)}:Array.isArray(e)&&e.every(n)},q=function t(n,e){if(void 0===e)return function(e){return t(n,e)};if(w(e)){for(var r in e)if(e.hasOwnProperty(r)&&!n(e[r]))return!1;return!0}return!1},z=function(t){return!!t&&k(t.equals)},U=function(t){return!!t&&k(t.map)},E=function(t){return!!t&&k(t.ap)},V=function(t){return!!t&&k(t.fold)},W=function(t){return!!t&&k(t.biMap)},B=function(t){return!!t&&k(t.concat)},D=function(t){return O(t)||B(t)&&(k(t.empty)||k(t.constructor.empty))},C=function(t){return E(t)&&(k(t.of)||k(t.constructor.of))},J=function(t){return U(t)&&z(t)&&k(t.flatten)&&k(t.flatMap)},G={isNil:c,isAny:s,isNull:p,isVoid:l,isArray:O,isBool:m,isSet:N,isString:y,isWeakMap:I,isWeakSet:j,isFalse:g,isTrue:b,isFunc:k,isFloat:h,isInt:d,isNumber:v,isNode:S,isNodeList:x,isDate:F,isObject:w,isPromise:R,isIterable:L,isArrayOf:T,isObjectOf:q,isMap:M,isRegex:A,isIterator:P,isSetoid:z,isFunctor:U,isApplicative:C,isApply:E,isFoldable:V,isMonad:J,isMonoid:D,isBifunctor:W},H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},K=function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")},Q=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}(),X=function(){function t(t,n){var e=[],r=!0,u=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done)&&(e.push(o.value),!n||e.length!==n);r=!0);}catch(t){u=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(u)throw i}}return e}return function(n,e){if(Array.isArray(n))return n;if(Symbol.iterator in Object(n))return t(n,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),Y=function(t){if(Array.isArray(t)){for(var n=0,e=Array(t.length);n<t.length;n++)e[n]=t[n];return e}return Array.from(t)},Z=function(t){return t},$=function(t){return function(){return t}},_=function(t){return function(n){return n(t)}},tt=function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];if(G.isFunc(t)&&G.isArrayOf(G.isFunc,e))return f.aritize(t.length,function(){return e.reduce(function(t,n){return n(t)},t.apply(void 0,arguments))});throw"combinators::pipe awaits functions but saw "+[t].concat(e)},nt=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];if(G.isArrayOf(G.isFunc,n))return tt.apply(void 0,Y(n.reverse()));throw"combinators::compose awaits functions but saw "+n},et=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];if(G.isArrayOf(G.isFunc,n))return f.aritize(n[0].length,function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];return!n.some(function(t){return!t.apply(void 0,e)})});throw"combinators::and awaits functions but saw "+n},rt=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];if(G.isArrayOf(G.isFunc,n))return f.aritize(n[0].length,function(){for(var t=arguments.length,e=Array(t),r=0;r<t;r++)e[r]=arguments[r];return n.some(function(t){return!!t.apply(void 0,e)})});throw"combinators::or awaits functions but saw "+n},ut={compose:nt,pipe:tt,id:Z,tap:_,getter:$,and:et,or:rt},it=function(t){var n=0;if(G.isFunc(t))return f.aritize(t.length,function(){return 0===n?(n=1,t.apply(void 0,arguments)):null});throw"decorators::once awaits a function but saw "+t},ot=function(t){if(G.isFunc(t))return f.aritize(t.length,function(){return!t.apply(void 0,arguments)});throw"decorators::not awaits a function but saw "+t},at=function(t){if(G.isFunc(t))return f.aritize(t.length,function(){for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];return t.apply(void 0,Y(e.reverse()))});throw"decorators::flip awaits a function but saw "+t},ft=function t(n){if(G.isFunc(n))return n.length<2?n:function(){for(var e=arguments.length,r=Array(e),u=0;u<e;u++)r[u]=arguments[u];return n.length<=r.length?n.apply(void 0,r):function(){for(var e=arguments.length,u=Array(e),i=0;i<e;i++)u[i]=arguments[i];return t(n).apply(void 0,r.concat(u))}};throw"decorators::curry awaits a function but saw "+n},ct=function(t){if(G.isFunc(t))return t.length<2?t:function(){for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];return t.length<=e.length?t.apply(void 0,Y(e.reverse())):function(){for(var n=arguments.length,r=Array(n),u=0;u<n;u++)r[u]=arguments[u];return ft(t).apply(void 0,e.concat(r))}};throw"decorators::curryRight awaits a function but saw "+t},st=function t(n){for(var e=arguments.length,r=Array(e>1?e-1:0),u=1;u<e;u++)r[u-1]=arguments[u];var i=r;if(G.isFunc(n)){for(;i.length<n.length;)i.push(void 0);return function(){for(var e=arguments.length,r=Array(e),u=0;u<e;u++)r[u]=arguments[u];var o=i.map(function(t){return G.isVoid(t)?r.shift():t});return o.lastIndexOf(void 0)<0?n.apply(void 0,Y(o)):t.apply(void 0,[n].concat(Y(o)))}}throw"decorators::partial awaits a function but saw "+n},lt=function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];var u=e;if(G.isFunc(t)){for(;u.length<t.length;)u.push(void 0);return function(){for(var n=arguments.length,e=Array(n),r=0;r<n;r++)e[r]=arguments[r];var i=u.map(function(t){return G.isVoid(t)?e.shift():t});return i.lastIndexOf(void 0)<0?t.apply(void 0,Y(i.reverse())):st.apply(void 0,[t].concat(Y(i)))}}throw"decorators::partialRight awaits a function but saw "+t},pt=function t(n){var e=arguments.length<=1||void 0===arguments[1]?void 0:arguments[1],r=arguments.length<=2||void 0===arguments[2]?void 0:arguments[2];if(void 0===e)return function(e,r){return t(n,e,r)};if(G.isFunc(n)&&G.isFunc(e))return G.isFunc(r)?f.aritize(e.length,function(){return n.apply(void 0,arguments)?e.apply(void 0,arguments):r.apply(void 0,arguments)}):f.aritize(e.length,function(){return n.apply(void 0,arguments)?e.apply(void 0,arguments):null});throw"decorators::given awaits (fn, fn fn?), but saw "+[n,e,r]},yt=function(t){var n={};if(G.isFunc(t))return f.aritize(t.length,function(){for(var e=arguments.length,r=Array(e),u=0;u<e;u++)r[u]=arguments[u];var i=JSON.stringify(r);return n.hasOwnProperty(i)||(n[i]=t.apply(void 0,r)),n[i]});throw"decorators::memoize awaits a function but saw "+t},vt={not:ot,flip:at,curry:ft,curryRight:ct,partial:st,partialRight:lt,given:pt,memoize:yt,once:it},dt=Object.prototype.hasOwnProperty,ht=function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];return function(n){for(var r=arguments.length,u=Array(r>1?r-1:0),i=1;i<r;i++)u[i-1]=arguments[i];var o=G.isString(t)&&G.isFunc(n[t])?n[t].apply(n,e.concat(u)):G.isFunc(t)?t.call.apply(t,[n].concat(e,u)):null;return null==o?n:o}},mt=f.dyadic(function(t,n){return dt.call(n,t)}),bt=f.dyadic(function(t,n){var e=G.isString(t)&&/\./.test(t)?t.split("."):[t];return e.reduce(function(t,n){return G.isAny(t)&&G.isAny(t[n])?t[n]:null},n)}),gt=f.triadic(function(t,n,e){var r=t,u=e;return G.isArray(e)?(u=[].concat(Y(e)),r=parseInt(r,10),G.isNumber(r)&&r<e.length&&r>=0&&(u[r]=n)):G.isObject(e)&&(u=Object.assign({},e),G.isString(r)&&(u[r]=n)),u}),kt=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];return Object.assign.apply(Object,[{}].concat(n))},wt=function(t){return Object.freeze(kt(t))},Ot=function(t){return Object.keys(t).map(function(n){return[n,t[n]]})},Ft=function(t){return t[0]},At=function(t){return[Ft(t)]},St=function(t){return G.isArray(t)?t.slice(0,t.length-1):G.isIterable(t)?Array.from(t).slice(0,t.length-1):[]},xt=function(t){return t[t.length-1]},Mt=function(t){return[xt(t)]},It=function(t){return G.isArray(t)?t.slice(1):G.isIterable(t)?Array.from(t).slice(1):[]},Nt=function(t){return t.reduce(function(t,n){return t.lastIndexOf(n)<0?[].concat(Y(t),[n]):t},[])},jt=f.dyadic(function(t,n){return Nt([].concat(Y(t),Y(n)))}),Rt=f.dyadic(function(t,n){return jt(t,n).filter(function(e){return t.indexOf(e)>-1&&n.indexOf(e)>-1})}),Pt=f.dyadic(function(t,n){return jt(t,n).filter(function(e){return t.indexOf(e)<0||n.indexOf(e)<0})}),Lt=f.dyadic(function(t,n){return G.isSetoid(n)?n.equals(t):t===n}),Tt=f.dyadic(function(t,n){if(G.isFunc(t))return G.isFunctor(n)?n.map(t):G.isObject(n)?Object.keys(n).reduce(function(e,r){return e[r]=t(n[r],r,n),e},{}):n;throw"operators::map awaits a function as first argument but saw "+t}),qt=f.dyadic(function(t,n){if(G.isFunc(t))return G.isFunctor(n)?n.map(t):G.isObject(n)?Tt(t,n):t(n);if(G.isApply(t))return G.isFunctor(n)?t.ap(n):G.isObject(n)?t.ap({map:function(t){return Tt(t,n)}}):t.ap([n])[0];throw"operators::ap awaits apply/function as first argument but saw "+t}),zt=function(n){if(G.isFunc(n.flatten))return n.flatten();if(G.isArray(n)){for(var e=t(n,[]);e instanceof Function;)e=e();return e}throw"operators::flatten awaits Monad or array but saw "+n},Ut=f.dyadic(function(t,n){if(G.isFunc(t))return G.isObject(n)?kt(n,Tt(t,n)):zt(Tt(t,n));throw"operators::flatMap awaits a function as first argument but saw "+t}),Et={field:bt,has:mt,call:ht,merge:kt,immutable:wt,first:Ft,last:xt,head:At,tail:Mt,initial:St,rest:It,unique:Nt,union:jt,map:Tt,flatten:zt,flatMap:Ut,assoc:gt,equals:Lt,ap:qt,intersect:Rt,differ:Pt,pairs:Ot},Vt=function(t){return{value:t,map:function(){return this}}},Wt=function t(n){return{value:n,map:function(e){return t(e(n))}}},Bt=function(t,n){return function(){return t(n.apply(void 0,arguments))}},Dt=vt.curry(function(t,n,e,r,u){return Et.map(function(t){return n(e,t,u)},r(t(e,u)))}),Ct=Dt(Et.field,Et.assoc),Jt=vt.curry(function(t,n){return t(Vt)(n).value}),Gt=vt.curry(function(t,n,e){return t(function(t){return Wt(n(t))})(e).value}),Ht=vt.curry(function(t,n,e){return Gt(t,function(){return n},e)}),Kt=function(){for(var t=arguments.length,n=Array(t),e=0;e<t;e++)n[e]=arguments[e];return n.reduce(function(t,n){return Et.has(n,t)||(t[n]=Ct(n)),t},{index:Ct})},Qt=vt.curry(function(t,n){return Wt(Et.map(Bt(Et.field("value"),t),n))}),Xt={lens:Dt,makeLenses:Kt,mappedLens:Qt,view:Jt,over:Gt,set:Ht},Yt="@@transducer/step",Zt="@@transducer/init",$t="@@transducer/result";n.isReduced=function(t){return!G.isNil(t)&&t.reduced},n.reduce=function(t){return{value:t,reduced:!0}},n.deref=function(t){return t&&void 0!==t.value?t.value:null};var _t=vt.curry(function(t,e,r){var u=G.isFunc(t)?n(t):t,i=e;if(G.isObject(r)){var o=Object.keys(r),a=!0,f=!1,c=void 0;try{for(var s,l=o[Symbol.iterator]();!(a=(s=l.next()).done);a=!0){var p=s.value;if(i=u[Yt](i,[r[p],p]),n.isReduced(i)){i=n.deref(i);break}}}catch(t){f=!0,c=t}finally{try{!a&&l.return&&l.return()}finally{if(f)throw c}}return u[$t](i)}var y=!0,v=!1,d=void 0;try{for(var h,m=r[Symbol.iterator]();!(y=(h=m.next()).done);y=!0){var b=h.value;if(i=u[Yt](i,b),n.isReduced(i)){i=n.deref(i);break}}}catch(t){v=!0,d=t}finally{try{!y&&m.return&&m.return()}finally{if(v)throw d}}return u[$t](i)}),tn=vt.curry(function(t,e,r,u){return _t(t(G.isFunc(e)?n(e):e),r,u)}),nn=vt.curry(function(t,n,e){if(G.isArray(t))return tn(n,function(t,n){return[].concat(Y(t),[n])},t,e);if(G.isObject(t))return tn(n,function(t,n){var e=X(n,2),r=e[0],u=e[1],i=Object.assign({},t);return i[u]=r,i},t,e);if(G.isNumber(t)||G.isString(t))return tn(n,function(t,n){return t+n},t,e);throw"transducers::into got unknown inital value, use ::transduce with a special step function"}),en=function(t){return function(n){return{"@@transducer/init":function(){return n[Zt]()},"@@transducer/step":function(e,r){return n[Yt](e,t(r))},"@@transducer/result":function(t){return n[$t](t)}}}},rn=function(t){return function(n){return{"@@transducer/init":function(){return n[Zt]()},"@@transducer/step":function(e,r){return t(r)?n[Yt](e,r):e},"@@transducer/result":function(t){return n[$t](t)}}}},un=function(t){return{"@@transducer/init":function(){return t[Zt]()},"@@transducer/step":function(e,r){return _t({"@@transducer/init":function(){return t[Zt]()},"@@transducer/step":function(e,r){var u=t[Yt](e,r);return n.isReduced(u)?n.deref(u):u},"@@transducer/result":function(t){return t}},e,r)},"@@transducer/result":function(n){return t[$t](n)}}},on=function(){var t=arguments.length<=0||void 0===arguments[0]?1:arguments[0];return function(n){var e=t;return{"@@transducer/init":function(){return n[Zt]()},"@@transducer/step":function(t,r){return e>0?(e-=1,t):n[Yt](t,r)},"@@transducer/result":function(t){return n[$t](t)}}}},an=function(t){return function(n){var e=!0,r=!1;return{"@@transducer/init":function(){return n[Zt]()},"@@transducer/step":function(u,i){return!r&&(e=!!t(i))?u:(r=!0,n[Yt](u,i))},"@@transducer/result":function(t){return n[$t](t)}}}},fn=function(){var t=arguments.length<=0||void 0===arguments[0]?1:arguments[0];return function(e){var r=0;return{"@@transducer/init":function(){return e[Zt]()},"@@transducer/step":function(u,i){return r<t?(r+=1,e[Yt](u,i)):n.reduce(u)},"@@transducer/result":function(t){return e[$t](t)}}}},cn=function(t){return function(e){var r=!0;return{"@@transducer/init":function(){return e[Zt]()},"@@transducer/step":function(u,i){return r=!!t(i),r?e[Yt](u,i):n.reduce(u)},"@@transducer/result":function(t){return e[$t](t)}}}},sn=function(t){return{"@@transducer/init":function(){return t[Zt]()},"@@transducer/step":function(n,e){return G.isNil(e)?n:t[Yt](n,e)},"@@transducer/result":function(n){return t[$t](n)}}},ln=function(t){var n=Object.create(null);return{"@@transducer/init":function(){return t[Zt]()},"@@transducer/step":function(e,r){return n[r]?e:(n[r]=!0,t[Yt](e,r))},"@@transducer/result":function(n){return t[$t](n)}}},pn=function(){var t=arguments.length<=0||void 0===arguments[0]?1:arguments[0];return function(n){var e,r=[];return{"@@transducer/init":function(){return n[Zt]()},"@@transducer/step":function(u,i){return r.length<t?(r.push(i),u):(e=n[Yt](u,r),r=[i],e)},"@@transducer/result":function(t){return r.length>0?n[$t](n[Yt](t,r)):n[$t](t)}}}},yn=function(t){return function(n){var e,r,u,i=[];return{"@@transducer/init":function(){return n[Zt]()},"@@transducer/step":function(o,a){return r=t(a),i.length<1?(u=r,i.push(a),o):u===r?(i.push(a),o):(u=r,e=n[Yt](o,i),i=[a],e)},"@@transducer/result":function(t){return i.length>0?n[$t](n[Yt](t,i)):n[$t](t)}}}},vn={fold:_t,transduce:tn,into:nn,map:en,filter:rn,unique:ln,keep:sn,partition:pn,partitionWith:yn,take:fn,takeWhile:cn,drop:on,dropWhile:an,flatten:un},dn=Symbol("MonadicValue"),hn=function(){function t(n){K(this,t),this.mvalue=n}return Q(t,[{key:"toString",value:function(){return"Identity("+this.mvalue+")"}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.mvalue===this.mvalue}},{key:"map",value:function(n){if(G.isFunc(n))return t.of(n(this.mvalue));throw"Identity::map expects argument to be function but saw "+n}},{key:"of",value:function(n){return t.of(n)}},{key:"ap",value:function(t){if(G.isFunc(t.map))return t.map(this.mvalue);throw"Identity::ap expects argument to be Functor but saw "+t}},{key:"flatMap",value:function(t){if(G.isFunc(t))return this.map(t).flatten();throw"Identity::flatMap expects argument to be function but saw "+t}},{key:"flatten",value:function(){return t.of(this.mvalue.mvalue)}},{key:"mvalue",set:function(t){this[dn]=t},get:function(){return this[dn]}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"of",value:function(n){return new t(n)}}]),t}(),mn=Symbol("MonadicValue"),bn=function(){function t(n){K(this,t),this.mvalue=n}return Q(t,[{key:"toString",value:function(){return"Some("+this.mvalue+")"}},{key:"isSome",value:function(){return!0}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.mvalue===this.mvalue}},{key:"map",value:function(t){if(G.isFunc(t))return kn.of(t(this.mvalue));throw"Some::map expects argument to be function but saw "+t}},{key:"of",value:function(n){return t.of(n)}},{key:"ap",value:function(t){if(G.isFunc(t.map))return t.map(this.mvalue);throw"Some::ap expects argument to be Functor but saw "+t}},{key:"flatMap",value:function(t){if(G.isFunc(t))return this.map(t).flatten();throw"Some::flatMap expects argument to be function but saw "+t}},{key:"flatten",value:function(){return kn.of(this.mvalue.mvalue)}},{key:"orElse",value:function(){return this.mvalue}},{key:"orSome",value:function(){return this}},{key:"fold",value:function(t,n){if(G.isFunc(n))return n(this.mvalue);throw"Some::fold expects argument 2 to be function but saw "+n}},{key:"cata",value:function(t){if(G.isFunc(t.Some)&&G.isFunc(t.None))return this.fold(t.None,t.Some);throw"Some::cata expected Object of {Some: fn}, but saw "+t}},{key:"biMap",value:function(t,n){if(G.isFunc(t)&&G.isFunc(n))return kn.of(this.fold(t,n));throw"Some::biMap expects argument 2 to be function but saw "+n}},{key:"mvalue",set:function(t){if(G.isNil(t))throw"Some::of cannot create from null or undefined but saw "+t;this[mn]=t},get:function(){return this[mn]}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"of",value:function(n){return new t(n)}}]),t}(),gn=function(){function t(){K(this,t),this.mvalue=null}return Q(t,[{key:"toString",value:function(){return"None"}},{key:"isSome",value:function(){return!1}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.toString()===this.toString()}},{key:"map",value:function(){return this}},{key:"of",value:function(){return t.of()}},{key:"ap",value:function(t){return t}},{key:"flatMap",value:function(){return this}},{key:"flatten",value:function(){return this}},{key:"orElse",value:function(t){return t}},{key:"orSome",value:function(t){return kn.of(t)}},{key:"fold",value:function(t){if(G.isFunc(t))return t();throw"None::fold expects argument 1 to be function but saw "+t}},{key:"cata",value:function(t){if(G.isFunc(t.None))return this.fold(t.None);throw"None::cata expected Object of {None: fn}, but saw "+t}},{key:"biMap",value:function(t){if(G.isFunc(t))return kn.of(this.fold(t));throw"None::biMap expects argument 1 to be function but saw "+t}},{key:"mvalue",set:function(t){this[mn]=t},get:function(){return this[mn]}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"of",value:function(){return new t}}]),t}(),kn=function(){function t(){K(this,t)}return Q(t,null,[{key:"is",value:function(t){return bn.is(t)||gn.is(t)}},{key:"of",value:function(t){return G.isNil(t)?gn.of():bn.of(t)}},{key:"fromEither",value:function(t){return t.fold(gn.of,bn.of)}}]),t}(),wn=Symbol("MonadicValue"),On=function(){function t(n){K(this,t),this.mvalue=n}return Q(t,[{key:"toString",value:function(){return"Right("+this.mvalue+")"}},{key:"isRight",value:function(){return!0}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.mvalue===this.mvalue}},{key:"map",value:function(n){if(G.isFunc(n))return t.of(n(this.mvalue));throw"Right::map expects argument to be function but saw "+n}},{key:"of",value:function(n){return t.of(n)}},{key:"ap",value:function(t){if(G.isFunc(t.map))return t.map(this.mvalue);throw"Right::ap expects argument to be Functor but saw "+t}},{key:"flatMap",value:function(t){if(G.isFunc(t))return this.map(t).flatten();throw"Right::flatMap expects argument to be function but saw "+t}},{key:"flatten",value:function(){return t.of(this.mvalue.mvalue)}},{key:"orElse",value:function(){return this.mvalue}},{key:"orRight",value:function(){return this}},{key:"fold",value:function(t,n){if(G.isFunc(n))return n(this.mvalue);throw"Right::fold expects argument 2 to be function but saw "+n}},{key:"cata",value:function(t){if(G.isFunc(t.Right))return t.Right(this.mvalue);throw"Right::cata expected Object of {Right: fn}, but saw "+t}},{key:"biMap",value:function(n,e){if(G.isFunc(e))return t.of(e(this.mvalue));throw"Right::biMap expects argument 2 to be function but saw "+e}},{key:"swap",value:function(){return Fn.of(this.mvalue)}},{key:"mapLeft",value:function(){return this}},{key:"mvalue",set:function(t){this[wn]=t},get:function(){return this[wn]}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"of",value:function(n){return new t(n)}}]),t}(),Fn=function(){function t(n){K(this,t),this.mvalue=n}return Q(t,[{key:"toString",value:function(){return"Left("+this.mvalue+")"}},{key:"isRight",value:function(){return!1}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.mvalue===this.mvalue}},{key:"map",value:function(){return this}},{key:"of",value:function(n){return t.of(n)}},{key:"ap",value:function(t){return t}},{key:"flatMap",value:function(){return this}},{key:"flatten",value:function(){return this}},{key:"orElse",value:function(t){return t}},{key:"orRight",value:function(t){return On.of(t)}},{key:"fold",value:function(t){if(G.isFunc(t))return t(this.mvalue);throw"Left::fold expects argument 1 to be function but saw "+t}},{key:"cata",value:function(t){if(G.isFunc(t.Left))return t.Left(this.mvalue);throw"Left::cata expected Object of {Left: fn}, but saw "+t}},{key:"biMap",value:function(n){if(G.isFunc(n))return t.of(n(this.mvalue));throw"Left::biMap expects argument 1 to be function but saw "+n}},{key:"swap",value:function(){return On.of(this.mvalue)}},{key:"mapLeft",value:function(t){if(G.isFunc(t))return this.biMap(t);throw"Left::biMap expects argument 1 to be function but saw "+t}},{key:"mvalue",set:function(t){this[wn]=t},get:function(){return this[wn]}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"of",value:function(n){return new t(n)}}]),t}(),An=function(){function t(){K(this,t)}return Q(t,null,[{key:"is",value:function(t){return Fn.is(t)||On.is(t)}},{key:"fromNullable",value:function(t){return G.isNull(t)||G.isVoid(t)?Fn.of(t):On.of(t)}},{key:"fromMaybe",value:function(t){return t.fold(function(){return Fn.of(null)},On.of)}},{key:"fromIO",value:function(n){return t.try(n.performIO)}},{key:"try",value:function(n){for(var e=arguments.length,r=Array(e>1?e-1:0),u=1;u<e;u++)r[u-1]=arguments[u];if(G.isFunc(n)){if(n.length<=r.length)try{var i=n.apply(void 0,r);return Error.prototype.isPrototypeOf(i)?Fn.of(i.message):On.of(i)}catch(t){return Fn.of(t.message)}return function(){for(var e=arguments.length,u=Array(e),i=0;i<e;i++)u[i]=arguments[i];return t.try.apply(t,[n].concat(r,u))}}throw"Either::try expects argument to be function but saw "+n}}]),t}(),Sn=Symbol("MonadicValue"),xn=function(t,n){return function(){return t(n.apply(void 0,arguments))}},Mn=function(){function t(n){K(this,t),this.performIO=n}return Q(t,[{key:"toString",value:function(){return"IO("+this.performIO+")"}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.performIO===n.performIO}},{key:"map",value:function(n){if(G.isFunc(n))return t.of(xn(n,this.performIO));throw"IO::map expects argument to be function but saw "+n}},{key:"of",value:function(n){return t.of(n)}},{key:"ap",value:function(t){if(G.isFunc(t.map))return t.map(this.performIO);throw"IO::ap expects argument to be Functor but saw "+t}},{key:"flatMap",value:function(t){if(G.isFunc(t))return this.map(t).flatten();throw"IO::flatMap expects argument to be function but saw "+t}},{key:"flatten",value:function(){return t.of(this.performIO().performIO)}},{key:"performIO",set:function(t){this[Sn]=t},get:function(){return this[Sn]}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"of",value:function(n){return new t(n)}}]),t}(),In=Symbol("MonadicValue"),Nn=Symbol("OldMonadicValue"),jn=function(){function t(n,e){K(this,t),this.mvalue=n,this.mbefore=e}return Q(t,[{key:"toString",value:function(){return"State("+this.mvalue+", "+this.mbefore+")"}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.mvalue===this.mvalue&&n.mbefore===this.mbefore}},{key:"map",value:function(n){if(G.isFunc(n))return t.of(n(this.mvalue),this.mvalue);throw"State::map expects argument to be function but saw "+n}},{key:"of",value:function(n,e){return t.of(n,e)}},{key:"ap",value:function(t){if(G.isFunc(t.map))return t.map(this.mvalue);throw"State::ap expects argument to be Functor but saw "+t}},{key:"flatMap",value:function(t){if(G.isFunc(t))return this.map(t).flatten();throw"State::flatMap expects argument to be function but saw "+t}},{key:"flatten",value:function(){return t.of(this.mvalue.mvalue,this.mvalue.mbefore)}},{key:"mvalue",set:function(t){this[In]=t},get:function(){return this[In]}},{key:"mbefore",set:function(t){this[Nn]=t},get:function(){return this[Nn]||null}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"of",value:function(n,e){return new t(n,e)}}]),t}(),Rn=Symbol("MonadicFork"),Pn=Symbol("MonadicCleanUp"),Ln=G.isFunc(setImmediate)?function(t){return setImmediate(t)}:G.isVoid(process)?function(t){return setTimeout(t,0)}:function(t){return process.nextTick(t)},Tn=function(){},qn=function(){function t(n,e){K(this,t),this.fork=n,this.cleanUp=e}return Q(t,[{key:"toString",value:function(){return"Task"}},{key:"equals",value:function(n){return t.prototype.isPrototypeOf(n)&&n.fork===this.fork&&n.cleanUp===this.cleanUp}},{key:"map",value:function(n){var e=this;if(G.isFunc(n))return t.of(function(t,r){return e.fork(function(n){return t(n)},function(t){return r(n(t))})},this.cleanUp);throw"Task::map expects argument to be function but saw "+n}},{key:"of",value:function(n){return t.of(n,this.cleanUp)}},{key:"ap",value:function(n){var e=this.fork,r=n.fork,u=this.cleanUp,i=n.cleanUp,o=function(t){var n=X(t,2),e=n[0],r=n[1];u(e),i(r)};return t.of(function(t,n){var u=!1,i=!1,a=!1,f=!1,c=[],s=!1,l=function(n){if(!s)return s=!0,t(n)},p=function(t){return function(e){if(!s)return t(e),f&&i?(Ln(function(){return o(c)}),n(u(a))):e}},y=e(l,p(function(t){i=!0,u=t})),v=r(l,p(function(t){f=!0,a=t}));return c=[y,v]},o)}},{key:"flatMap",value:function(t){if(G.isFunc(t))return this.map(t).flatten();throw"Task::flatMap expects argument to be function but saw "+t}},{key:"flatten",value:function(){var n=this;return t.of(function(t,e){return n.fork.fork(t,e)},this.cleanUp)}},{key:"fold",value:function(n,e){var r=this;if(G.isFunc(e)&&G.isFunc(n))return t.of(function(t,u){return r.fork(function(e){return t(n(e))},function(t){return u(e(t))})},this.cleanUp);throw"Task::fold expects arguments to be functions but saw "+[n,e]}},{key:"cata",value:function(t){var n=t.Reject,e=t.Resolve;if(G.isFunc(e)&&G.isFunc(n))return this.fold(n,e);throw"Task::cata expected Object of {Reject, Resolve}"}},{key:"biMap",value:function(n,e){var r=this;if(G.isFunc(e)&&G.isFunc(n))return t.of(function(t,n){return r.fold(t,n)},this.cleanUp);throw"Task::biMap expected arguments to be functions but saw "+[n,e]}},{key:"swap",value:function(){var n=this;return t.of(function(t,e){return n.fork(e,t)},this.cleanUp)}},{key:"mapRejected",value:function(n){var e=this;if(G.isFunc(n))return t.of(function(t,r){return e.fork(function(e){return t(n(e))},r)},this.cleanUp)}},{key:"concat",value:function(n){var e=this;if(t.is(n)){var r=function(){var r=e.fork,u=n.fork,i=e.cleanUp,o=n.cleanUp,a=function(t){var n=X(t,2),e=n[0],r=n[1];i(e),o(r)};return{v:t.of(function(t,n){var e=void 0,i=!1,o=void 0,f=void 0,c=function(t){return function(n){i||(i=!0,Ln(function(){return a(o)}),t(n))}};return o=r(c(t),c(n)),f=u(c(t),c(n)),e=[o,f]},a)}}();if("object"===("undefined"==typeof r?"undefined":H(r)))return r.v}throw"Task::concat expected argument to be Task but saw "+n}},{key:"orElse",value:function(n){var e=this;if(G.isFunc(n))return t.of(function(t,r){return e.fork(function(e){return n(e).fork(t,r)},r)},this.cleanUp);throw"Task::orElse expected argument to be function but saw "+n}},{key:"fork",set:function(t){this[Rn]=t},get:function(){return this[Rn]}},{key:"cleanUp",set:function(t){this[Pn]=t||Tn},get:function(){return this[Pn]}}],[{key:"is",value:function(n){return t.prototype.isPrototypeOf(n)}},{key:"resolve",value:function(n){return t.of(function(t,e){return e(n)})}},{key:"reject",value:function(n){return t.of(function(t){return t(n)})}},{key:"of",value:function(n,e){return new t(n,e)}},{key:"empty",value:function(){return t.of(function(){})}}]),t}(),zn=vt.curry(function(t,n,e){return n.map(t).ap(e)}),Un=vt.curry(function(t,n,e,r){return n.map(t).ap(e).ap(r)}),En=vt.curry(function(t,n,e,r,u){return n.map(t).ap(e).ap(r).ap(u)}),Vn=vt.curry(function(t,n,e,r,u,i){return n.map(t).ap(e).ap(r).ap(u).ap(i)}),Wn={Identity:hn,IO:Mn,Maybe:kn,None:gn,Some:bn,State:jn,Either:An,Left:Fn,Right:On,Task:qn,liftA2:zn,liftA3:Un,liftA4:En,liftA5:Vn},Bn={aritize:f.aritize,monadic:f.monadic,dyadic:f.dyadic,triadic:f.triadic,tetradic:f.tetradic,isNil:G.isNil,isAny:G.isAny,isNull:G.isNull,isVoid:G.isVoid,isString:G.isString,isNumber:G.isNumber,
isInt:G.isInt,isFloat:G.isFloat,isBool:G.isBool,isTrue:G.isTrue,isFalse:G.isFalse,isFunc:G.isFunc,isObject:G.isObject,isArray:G.isArray,isDate:G.isDate,isRegex:G.isRegex,isNode:G.isNode,isNodeList:G.isNodeList,isPromise:G.isPromise,isIterator:G.isIterator,isIterable:G.isIterable,isArrayOf:G.isArrayOf,isObjectOf:G.isObjectOf,isSetoid:G.isSetoid,isFunctor:G.isFunctor,isApply:G.isApply,isFoldable:G.isFoldable,isBifunctor:G.isBifunctor,isSemigroup:G.isSemigroup,isMonoid:G.isMonoid,isMonad:G.isMonad,isApplicative:G.isApplicative,id:ut.id,getter:ut.getter,tap:ut.tap,pipe:ut.pipe,compose:ut.compose,and:ut.and,or:ut.or,once:vt.once,not:vt.not,flip:vt.flip,curry:vt.curry,curryRight:vt.curryRight,partial:vt.partial,partialRight:vt.partialRight,given:vt.given,memoize:vt.memoize,Identity:Wn.Identity,IO:Wn.IO,Maybe:Wn.Maybe,None:Wn.None,Some:Wn.Some,Either:Wn.Either,Left:Wn.Left,Right:Wn.Right,State:Wn.State,Task:Wn.Task,liftA2:Wn.liftA2,liftA3:Wn.liftA3,liftA4:Wn.liftA4,liftA5:Wn.liftA5,lens:Xt.lens,makeLenses:Xt.makeLenses,mappedLens:Xt.mappedLens,view:Xt.view,over:Xt.over,set:Xt.set,call:Et.call,field:Et.field,has:Et.has,merge:Et.merge,immutable:Et.immutable,first:Et.first,last:Et.last,head:Et.head,tail:Et.tail,initial:Et.initial,rest:Et.rest,unique:Et.unique,union:Et.union,map:Et.map,flatten:Et.flatten,flatMap:Et.flatMap,assoc:Et.assoc,equals:Et.equals,ap:Et.ap,intersect:Et.intersect,differ:Et.differ,pairs:Et.pairs,transducers:vn};return Bn});