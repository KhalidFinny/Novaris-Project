import{r as d,a as g,u as v,b,j as o,L as x,l as y}from"./index-CyXxzEmv.js";/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=(...t)=>t.filter((e,n,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,n,r)=>r?r.toUpperCase():n.toLowerCase());/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=t=>{const e=j(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var C={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1};/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=d.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:s="",children:c,iconNode:u,...a},m)=>d.createElement("svg",{ref:m,...C,width:e,height:e,stroke:t,strokeWidth:r?Number(n)*24/Number(e):n,className:f("lucide",s),...!c&&!N(a)&&{"aria-hidden":"true"},...a},[...u.map(([p,l])=>d.createElement(p,l)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=(t,e)=>{const n=d.forwardRef(({className:r,...s},c)=>d.createElement($,{ref:c,iconNode:e,className:f(`lucide-${w(h(t))}`,`lucide-${t}`,r),...s}));return n.displayName=h(t),n};/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],A=k("moon",E);/**
 * @license lucide-react v0.576.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],M=k("sun",L);function S(){const{theme:t,toggle:e}=g(),{language:n,setLanguage:r,t:s}=v(),u=b().pathname==="/",a=d.useRef(null);return d.useEffect(()=>{const m=a.current;if(!m)return;const p=()=>{m.dataset.scrolled=window.scrollY>30?"true":"false"};return window.addEventListener("scroll",p,{passive:!0}),()=>window.removeEventListener("scroll",p)},[]),o.jsxs("nav",{id:"nav",ref:a,"data-scrolled":"false",className:`fixed top-0 left-0 right-0 z-200
                       flex items-center justify-between
                       px-6 lg:px-12 py-4
                       data-[scrolled=true]:backdrop-blur-[20px]`,children:[o.jsx(x,{to:"/",className:"flex items-center no-underline",children:o.jsx("img",{src:y,alt:s("nav.logoAlt"),className:"h-6 w-auto object-contain dark:invert transition-all duration-[520ms]"})}),o.jsxs("ul",{className:"hidden md:flex gap-8 list-none m-0 p-0 absolute left-1/2 -translate-x-1/2",children:[o.jsx("li",{children:o.jsx(x,{to:"/",className:`font-sans text-[14px] font-medium
                                 transition-colors duration-200 no-underline
                                 cursor-pointer
                                 ${u?"text-ink dark:text-frost":"text-ink/60 dark:text-frost/60 hover:text-ink dark:hover:text-frost"}`,children:s("nav.home")})}),o.jsx("li",{children:o.jsx(x,{to:"/decision-center",className:`font-sans text-[14px] font-medium
                                 transition-colors duration-200 no-underline
                                 cursor-pointer
                                 ${u?"text-ink/60 dark:text-frost/60 hover:text-ink dark:hover:text-frost":"text-ink dark:text-frost"}`,children:s("nav.decisionCenter")})})]}),o.jsxs("div",{className:"flex items-center gap-3",children:[o.jsxs("div",{className:"flex items-center gap-1 font-sans text-[13px]",children:[o.jsx("button",{onClick:()=>r("en"),className:`px-2 py-1 rounded transition-colors duration-200 ${n==="en"?"text-ink dark:text-frost font-semibold":"text-ink/40 dark:text-frost/40 hover:text-ink/70 dark:hover:text-frost/70"}`,children:"EN"}),o.jsx("span",{className:"text-ink/20 dark:text-frost/20",children:"|"}),o.jsx("button",{onClick:()=>r("id"),className:`px-2 py-1 rounded transition-colors duration-200 ${n==="id"?"text-ink dark:text-frost font-semibold":"text-ink/40 dark:text-frost/40 hover:text-ink/70 dark:hover:text-frost/70"}`,children:"ID"})]}),o.jsx("div",{className:"w-px h-4 bg-ink/10 dark:bg-frost/10"}),o.jsx("button",{onClick:e,"aria-label":s(t==="dark"?"nav.lightMode":"nav.darkMode"),className:`w-9 h-9 rounded-full flex items-center justify-center
                             bg-cream dark:bg-charcoal-soft
                             border border-ink/10 dark:border-frost/10
                             text-ink/70 dark:text-frost/70
                             hover:bg-cream-dark dark:hover:bg-charcoal-light
                             hover:text-ink dark:hover:text-frost
                             transition-all duration-200`,children:t==="dark"?o.jsx(M,{size:16,strokeWidth:1.5}):o.jsx(A,{size:16,strokeWidth:1.5})})]})]})}const i=(t,e,n)=>{let r=document.querySelector(`meta[${e}="${t}"]`);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)};function U({title:t,description:e,path:n,image:r,structuredData:s}){d.useEffect(()=>{const c="https://novaris.app",u=`${c}${n}`;document.title=t;let a=document.querySelector('link[rel="canonical"]');a||(a=document.createElement("link"),a.setAttribute("rel","canonical"),document.head.appendChild(a)),a.setAttribute("href",u),i("description","name",e),i("og:type","property","website"),i("og:site_name","property","Novaris"),i("og:title","property",t),i("og:description","property",e),i("og:url","property",u),i("twitter:card","name","summary_large_image"),i("twitter:title","name",t),i("twitter:description","name",e);{const l=r.startsWith("http")?r:`${c}${r}`;i("og:image","property",l),i("twitter:image","name",l)}const m="novaris-route-jsonld",p=document.getElementById(m);if(p&&p.remove(),s){const l=document.createElement("script");l.id=m,l.type="application/ld+json",l.text=JSON.stringify(s),document.head.appendChild(l)}},[t,e,n,r,s])}const I="/assets/logo3-DQACSppG.png";export{S as N,k as c,I as l,U as u};
