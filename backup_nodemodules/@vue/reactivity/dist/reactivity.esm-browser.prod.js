/**
* @vue/reactivity v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function t(t,e){const s=new Set(t.split(","));return e?t=>s.has(t.toLowerCase()):t=>s.has(t)}const e=()=>{},s=Object.assign,n=Object.prototype.hasOwnProperty,i=(t,e)=>n.call(t,e),r=Array.isArray,c=t=>"[object Map]"===a(t),o=t=>"function"==typeof t,u=t=>"symbol"==typeof t,l=t=>null!==t&&"object"==typeof t,h=Object.prototype.toString,a=t=>h.call(t),_=t=>a(t).slice(8,-1),f=t=>"string"==typeof t&&"NaN"!==t&&"-"!==t[0]&&""+parseInt(t,10)===t,d=(t,e)=>!Object.is(t,e);let p,v;class g{constructor(t=!1){this.detached=t,this._active=!0,this.effects=[],this.cleanups=[],this.parent=p,!t&&p&&(this.index=(p.scopes||(p.scopes=[])).push(this)-1)}get active(){return this._active}run(t){if(this._active){const e=p;try{return p=this,t()}finally{p=e}}}on(){p=this}off(){p=this.parent}stop(t){if(this._active){let e,s;for(e=0,s=this.effects.length;e<s;e++)this.effects[e].stop();for(e=0,s=this.cleanups.length;e<s;e++)this.cleanups[e]();if(this.scopes)for(e=0,s=this.scopes.length;e<s;e++)this.scopes[e].stop(!0);if(!this.detached&&this.parent&&!t){const t=this.parent.scopes.pop();t&&t!==this&&(this.parent.scopes[this.index]=t,t.index=this.index)}this.parent=void 0,this._active=!1}}}function y(t){return new g(t)}function w(t,e=p){e&&e.active&&e.effects.push(t)}function R(){return p}function b(t){p&&p.cleanups.push(t)}class S{constructor(t,e,s,n){this.fn=t,this.trigger=e,this.scheduler=s,this.active=!0,this.deps=[],this._dirtyLevel=4,this._trackId=0,this._runnings=0,this._shouldSchedule=!1,this._depsLength=0,w(this,n)}get dirty(){if(2===this._dirtyLevel||3===this._dirtyLevel){this._dirtyLevel=1,A();for(let t=0;t<this._depsLength;t++){const e=this.deps[t];if(e.computed&&(L(e.computed),this._dirtyLevel>=4))break}1===this._dirtyLevel&&(this._dirtyLevel=0),W()}return this._dirtyLevel>=4}set dirty(t){this._dirtyLevel=t?4:0}run(){if(this._dirtyLevel=0,!this.active)return this.fn();let t=x,e=v;try{return x=!0,v=this,this._runnings++,k(this),this.fn()}finally{E(this),this._runnings--,v=e,x=t}}stop(){var t;this.active&&(k(this),E(this),null==(t=this.onStop)||t.call(this),this.active=!1)}}function L(t){return t.value}function k(t){t._trackId++,t._depsLength=0}function E(t){if(t.deps.length>t._depsLength){for(let e=t._depsLength;e<t.deps.length;e++)O(t.deps[e],t);t.deps.length=t._depsLength}}function O(t,e){const s=t.get(e);void 0!==s&&e._trackId!==s&&(t.delete(e),0===t.size&&t.cleanup())}function m(t,n){t.effect instanceof S&&(t=t.effect.fn);const i=new S(t,e,(()=>{i.dirty&&i.run()}));n&&(s(i,n),n.scope&&w(i,n.scope)),n&&n.lazy||i.run();const r=i.run.bind(i);return r.effect=i,r}function j(t){t.effect.stop()}let x=!0,I=0;const P=[];function A(){P.push(x),x=!1}function M(){P.push(x),x=!0}function W(){const t=P.pop();x=void 0===t||t}function z(){I++}function V(){for(I--;!I&&T.length;)T.shift()()}function N(t,e,s){if(e.get(t)!==t._trackId){e.set(t,t._trackId);const s=t.deps[t._depsLength];s!==e?(s&&O(s,t),t.deps[t._depsLength++]=e):t._depsLength++}}const T=[];function D(t,e,s){z();for(const n of t.keys()){let s;n._dirtyLevel<e&&(null!=s?s:s=t.get(n)===n._trackId)&&(n._shouldSchedule||(n._shouldSchedule=0===n._dirtyLevel),n._dirtyLevel=e),n._shouldSchedule&&(null!=s?s:s=t.get(n)===n._trackId)&&(n.trigger(),n._runnings&&!n.allowRecurse||2===n._dirtyLevel||(n._shouldSchedule=!1,n.scheduler&&T.push(n.scheduler)))}V()}const C=(t,e)=>{const s=new Map;return s.cleanup=t,s.computed=e,s},K=new WeakMap,H=Symbol(""),G=Symbol("");function Y(t,e,s){if(x&&v){let e=K.get(t);e||K.set(t,e=new Map);let n=e.get(s);n||e.set(s,n=C((()=>e.delete(s)))),N(v,n)}}function q(t,e,s,n,i,o){const l=K.get(t);if(!l)return;let h=[];if("clear"===e)h=[...l.values()];else if("length"===s&&r(t)){const t=Number(n);l.forEach(((e,s)=>{("length"===s||!u(s)&&s>=t)&&h.push(e)}))}else switch(void 0!==s&&h.push(l.get(s)),e){case"add":r(t)?f(s)&&h.push(l.get("length")):(h.push(l.get(H)),c(t)&&h.push(l.get(G)));break;case"delete":r(t)||(h.push(l.get(H)),c(t)&&h.push(l.get(G)));break;case"set":c(t)&&h.push(l.get(H))}z();for(const r of h)r&&D(r,4);V()}const B=t("__proto__,__v_isRef,__isVue"),F=new Set(Object.getOwnPropertyNames(Symbol).filter((t=>"arguments"!==t&&"caller"!==t)).map((t=>Symbol[t])).filter(u)),J=Q();function Q(){const t={};return["includes","indexOf","lastIndexOf"].forEach((e=>{t[e]=function(...t){const s=Dt(this);for(let e=0,i=this.length;e<i;e++)Y(s,0,e+"");const n=s[e](...t);return-1===n||!1===n?s[e](...t.map(Dt)):n}})),["push","pop","shift","unshift","splice"].forEach((e=>{t[e]=function(...t){A(),z();const s=Dt(this)[e].apply(this,t);return V(),W(),s}})),t}function U(t){const e=Dt(this);return Y(e,0,t),e.hasOwnProperty(t)}class X{constructor(t=!1,e=!1){this._isReadonly=t,this._isShallow=e}get(t,e,s){const n=this._isReadonly,c=this._isShallow;if("__v_isReactive"===e)return!n;if("__v_isReadonly"===e)return n;if("__v_isShallow"===e)return c;if("__v_raw"===e)return s===(n?c?xt:jt:c?mt:Ot).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(s)?t:void 0;const o=r(t);if(!n){if(o&&i(J,e))return Reflect.get(J,e,s);if("hasOwnProperty"===e)return U}const h=Reflect.get(t,e,s);return(u(e)?F.has(e):B(e))?h:(n||Y(t,0,e),c?h:Ft(h)?o&&f(e)?h:h.value:l(h)?n?At(h):It(h):h)}}class Z extends X{constructor(t=!1){super(!1,t)}set(t,e,s,n){let c=t[e];if(!this._isShallow){const e=Vt(c);if(Nt(s)||Vt(s)||(c=Dt(c),s=Dt(s)),!r(t)&&Ft(c)&&!Ft(s))return!e&&(c.value=s,!0)}const o=r(t)&&f(e)?Number(e)<t.length:i(t,e),u=Reflect.set(t,e,s,n);return t===Dt(n)&&(o?d(s,c)&&q(t,"set",e,s):q(t,"add",e,s)),u}deleteProperty(t,e){const s=i(t,e),n=Reflect.deleteProperty(t,e);return n&&s&&q(t,"delete",e,void 0),n}has(t,e){const s=Reflect.has(t,e);return u(e)&&F.has(e)||Y(t,0,e),s}ownKeys(t){return Y(t,0,r(t)?"length":H),Reflect.ownKeys(t)}}class $ extends X{constructor(t=!1){super(!0,t)}set(t,e){return!0}deleteProperty(t,e){return!0}}const tt=new Z,et=new $,st=new Z(!0),nt=new $(!0),it=t=>t,rt=t=>Reflect.getPrototypeOf(t);function ct(t,e,s=!1,n=!1){const i=Dt(t=t.__v_raw),r=Dt(e);s||(d(e,r)&&Y(i,0,e),Y(i,0,r));const{has:c}=rt(i),o=n?it:s?Ht:Kt;return c.call(i,e)?o(t.get(e)):c.call(i,r)?o(t.get(r)):void(t!==i&&t.get(e))}function ot(t,e=!1){const s=this.__v_raw,n=Dt(s),i=Dt(t);return e||(d(t,i)&&Y(n,0,t),Y(n,0,i)),t===i?s.has(t):s.has(t)||s.has(i)}function ut(t,e=!1){return t=t.__v_raw,!e&&Y(Dt(t),0,H),Reflect.get(t,"size",t)}function lt(t){t=Dt(t);const e=Dt(this);return rt(e).has.call(e,t)||(e.add(t),q(e,"add",t,t)),this}function ht(t,e){e=Dt(e);const s=Dt(this),{has:n,get:i}=rt(s);let r=n.call(s,t);r||(t=Dt(t),r=n.call(s,t));const c=i.call(s,t);return s.set(t,e),r?d(e,c)&&q(s,"set",t,e):q(s,"add",t,e),this}function at(t){const e=Dt(this),{has:s,get:n}=rt(e);let i=s.call(e,t);i||(t=Dt(t),i=s.call(e,t)),n&&n.call(e,t);const r=e.delete(t);return i&&q(e,"delete",t,void 0),r}function _t(){const t=Dt(this),e=0!==t.size,s=t.clear();return e&&q(t,"clear",void 0,void 0),s}function ft(t,e){return function(s,n){const i=this,r=i.__v_raw,c=Dt(r),o=e?it:t?Ht:Kt;return!t&&Y(c,0,H),r.forEach(((t,e)=>s.call(n,o(t),o(e),i)))}}function dt(t,e,s){return function(...n){const i=this.__v_raw,r=Dt(i),o=c(r),u="entries"===t||t===Symbol.iterator&&o,l="keys"===t&&o,h=i[t](...n),a=s?it:e?Ht:Kt;return!e&&Y(r,0,l?G:H),{next(){const{value:t,done:e}=h.next();return e?{value:t,done:e}:{value:u?[a(t[0]),a(t[1])]:a(t),done:e}},[Symbol.iterator](){return this}}}}function pt(t){return function(...e){return"delete"!==t&&("clear"===t?void 0:this)}}function vt(){const t={get(t){return ct(this,t)},get size(){return ut(this)},has:ot,add:lt,set:ht,delete:at,clear:_t,forEach:ft(!1,!1)},e={get(t){return ct(this,t,!1,!0)},get size(){return ut(this)},has:ot,add:lt,set:ht,delete:at,clear:_t,forEach:ft(!1,!0)},s={get(t){return ct(this,t,!0)},get size(){return ut(this,!0)},has(t){return ot.call(this,t,!0)},add:pt("add"),set:pt("set"),delete:pt("delete"),clear:pt("clear"),forEach:ft(!0,!1)},n={get(t){return ct(this,t,!0,!0)},get size(){return ut(this,!0)},has(t){return ot.call(this,t,!0)},add:pt("add"),set:pt("set"),delete:pt("delete"),clear:pt("clear"),forEach:ft(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach((i=>{t[i]=dt(i,!1,!1),s[i]=dt(i,!0,!1),e[i]=dt(i,!1,!0),n[i]=dt(i,!0,!0)})),[t,s,e,n]}const[gt,yt,wt,Rt]=vt();function bt(t,e){const s=e?t?Rt:wt:t?yt:gt;return(e,n,r)=>"__v_isReactive"===n?!t:"__v_isReadonly"===n?t:"__v_raw"===n?e:Reflect.get(i(s,n)&&n in e?s:e,n,r)}const St={get:bt(!1,!1)},Lt={get:bt(!1,!0)},kt={get:bt(!0,!1)},Et={get:bt(!0,!0)},Ot=new WeakMap,mt=new WeakMap,jt=new WeakMap,xt=new WeakMap;function It(t){return Vt(t)?t:Wt(t,!1,tt,St,Ot)}function Pt(t){return Wt(t,!1,st,Lt,mt)}function At(t){return Wt(t,!0,et,kt,jt)}function Mt(t){return Wt(t,!0,nt,Et,xt)}function Wt(t,e,s,n,i){if(!l(t))return t;if(t.__v_raw&&(!e||!t.__v_isReactive))return t;const r=i.get(t);if(r)return r;const c=(o=t).__v_skip||!Object.isExtensible(o)?0:function(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}(_(o));var o;if(0===c)return t;const u=new Proxy(t,2===c?n:s);return i.set(t,u),u}function zt(t){return Vt(t)?zt(t.__v_raw):!(!t||!t.__v_isReactive)}function Vt(t){return!(!t||!t.__v_isReadonly)}function Nt(t){return!(!t||!t.__v_isShallow)}function Tt(t){return zt(t)||Vt(t)}function Dt(t){const e=t&&t.__v_raw;return e?Dt(e):t}function Ct(t){return Object.isExtensible(t)&&((t,e,s)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value:s})})(t,"__v_skip",!0),t}const Kt=t=>l(t)?It(t):t,Ht=t=>l(t)?At(t):t;class Gt{constructor(t,e,s,n){this.getter=t,this._setter=e,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this.effect=new S((()=>t(this._value)),(()=>Bt(this,2===this.effect._dirtyLevel?2:3))),this.effect.computed=this,this.effect.active=this._cacheable=!n,this.__v_isReadonly=s}get value(){const t=Dt(this);return t._cacheable&&!t.effect.dirty||!d(t._value,t._value=t.effect.run())||Bt(t,4),qt(t),t.effect._dirtyLevel>=2&&Bt(t,2),t._value}set value(t){this._setter(t)}get _dirty(){return this.effect.dirty}set _dirty(t){this.effect.dirty=t}}function Yt(t,s,n=!1){let i,r;const c=o(t);c?(i=t,r=e):(i=t.get,r=t.set);return new Gt(i,r,c||!r,n)}function qt(t){var e;x&&v&&(t=Dt(t),N(v,null!=(e=t.dep)?e:t.dep=C((()=>t.dep=void 0),t instanceof Gt?t:void 0)))}function Bt(t,e=4,s){const n=(t=Dt(t)).dep;n&&D(n,e)}function Ft(t){return!(!t||!0!==t.__v_isRef)}function Jt(t){return Ut(t,!1)}function Qt(t){return Ut(t,!0)}function Ut(t,e){return Ft(t)?t:new Xt(t,e)}class Xt{constructor(t,e){this.__v_isShallow=e,this.dep=void 0,this.__v_isRef=!0,this._rawValue=e?t:Dt(t),this._value=e?t:Kt(t)}get value(){return qt(this),this._value}set value(t){const e=this.__v_isShallow||Nt(t)||Vt(t);t=e?t:Dt(t),d(t,this._rawValue)&&(this._rawValue=t,this._value=e?t:Kt(t),Bt(this,4))}}function Zt(t){Bt(t,4)}function $t(t){return Ft(t)?t.value:t}function te(t){return o(t)?t():$t(t)}const ee={get:(t,e,s)=>$t(Reflect.get(t,e,s)),set:(t,e,s,n)=>{const i=t[e];return Ft(i)&&!Ft(s)?(i.value=s,!0):Reflect.set(t,e,s,n)}};function se(t){return zt(t)?t:new Proxy(t,ee)}class ne{constructor(t){this.dep=void 0,this.__v_isRef=!0;const{get:e,set:s}=t((()=>qt(this)),(()=>Bt(this)));this._get=e,this._set=s}get value(){return this._get()}set value(t){this._set(t)}}function ie(t){return new ne(t)}function re(t){const e=r(t)?new Array(t.length):{};for(const s in t)e[s]=le(t,s);return e}class ce{constructor(t,e,s){this._object=t,this._key=e,this._defaultValue=s,this.__v_isRef=!0}get value(){const t=this._object[this._key];return void 0===t?this._defaultValue:t}set value(t){this._object[this._key]=t}get dep(){return t=Dt(this._object),e=this._key,null==(s=K.get(t))?void 0:s.get(e);var t,e,s}}class oe{constructor(t){this._getter=t,this.__v_isRef=!0,this.__v_isReadonly=!0}get value(){return this._getter()}}function ue(t,e,s){return Ft(t)?t:o(t)?new oe(t):l(t)&&arguments.length>1?le(t,e,s):Jt(t)}function le(t,e,s){const n=t[e];return Ft(n)?n:new ce(t,e,s)}const he=Yt,ae={GET:"get",HAS:"has",ITERATE:"iterate"},_e={SET:"set",ADD:"add",DELETE:"delete",CLEAR:"clear"},fe={SKIP:"__v_skip",IS_REACTIVE:"__v_isReactive",IS_READONLY:"__v_isReadonly",IS_SHALLOW:"__v_isShallow",RAW:"__v_raw"};export{g as EffectScope,H as ITERATE_KEY,S as ReactiveEffect,fe as ReactiveFlags,ae as TrackOpTypes,_e as TriggerOpTypes,Yt as computed,ie as customRef,he as deferredComputed,m as effect,y as effectScope,M as enableTracking,R as getCurrentScope,Tt as isProxy,zt as isReactive,Vt as isReadonly,Ft as isRef,Nt as isShallow,Ct as markRaw,b as onScopeDispose,z as pauseScheduling,A as pauseTracking,se as proxyRefs,It as reactive,At as readonly,Jt as ref,V as resetScheduling,W as resetTracking,Pt as shallowReactive,Mt as shallowReadonly,Qt as shallowRef,j as stop,Dt as toRaw,ue as toRef,re as toRefs,te as toValue,Y as track,q as trigger,Zt as triggerRef,$t as unref};