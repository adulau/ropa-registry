/*! Vitrine 7c379edba7ffb89abcae01b0806f20ed43dbc627 | MIT | https://github.com/ecrou-exact/vitrine
 * JSON and Markdown viewers. See LICENSE and THIRD_PARTY_NOTICES.md. */
var ho=Object.create;var bs=Object.defineProperty;var po=Object.getOwnPropertyDescriptor;var fo=Object.getOwnPropertyNames;var go=Object.getPrototypeOf,mo=Object.prototype.hasOwnProperty;var bo=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}};var yo=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of fo(e))!mo.call(t,s)&&s!==n&&bs(t,s,{get:()=>e[s],enumerable:!(r=po(e,s))||r.enumerable});return t};var xo=(t,e,n)=>(n=t!=null?ho(go(t)):{},yo(e||!t||!t.__esModule?bs(n,"default",{value:t,enumerable:!0}):n,t));var Ni=bo((wd,Ri)=>{function mi(t){return t instanceof Map?t.clear=t.delete=t.set=function(){throw new Error("map is read-only")}:t instanceof Set&&(t.add=t.clear=t.delete=function(){throw new Error("set is read-only")}),Object.freeze(t),Object.getOwnPropertyNames(t).forEach(e=>{let n=t[e],r=typeof n;(r==="object"||r==="function")&&!Object.isFrozen(n)&&mi(n)}),t}var An=class{constructor(e){e.data===void 0&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function bi(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Ge(t,...e){let n=Object.create(null);for(let r in t)n[r]=t[r];return e.forEach(function(r){for(let s in r)n[s]=r[s]}),n}var nl="</span>",ui=t=>!!t.scope,rl=(t,{prefix:e})=>{if(t.startsWith("language:"))return t.replace("language:","language-");if(t.includes(".")){let n=t.split(".");return[`${e}${n.shift()}`,...n.map((r,s)=>`${r}${"_".repeat(s+1)}`)].join(" ")}return`${e}${t}`},br=class{constructor(e,n){this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){this.buffer+=bi(e)}openNode(e){if(!ui(e))return;let n=rl(e.scope,{prefix:this.classPrefix});this.span(n)}closeNode(e){ui(e)&&(this.buffer+=nl)}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}},hi=(t={})=>{let e={children:[]};return Object.assign(e,t),e},yr=class t{constructor(){this.rootNode=hi(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){let n=hi({scope:e});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){return typeof n=="string"?e.addText(n):n.children&&(e.openNode(n),n.children.forEach(r=>this._walk(e,r)),e.closeNode(n)),e}static _collapse(e){typeof e!="string"&&e.children&&(e.children.every(n=>typeof n=="string")?e.children=[e.children.join("")]:e.children.forEach(n=>{t._collapse(n)}))}},xr=class extends yr{constructor(e){super(),this.options=e}addText(e){e!==""&&this.add(e)}startScope(e){this.openNode(e)}endScope(){this.closeNode()}__addSublanguage(e,n){let r=e.root;n&&(r.scope=`language:${n}`),this.add(r)}toHTML(){return new br(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function Ft(t){return t?typeof t=="string"?t:t.source:null}function yi(t){return rt("(?=",t,")")}function sl(t){return rt("(?:",t,")*")}function il(t){return rt("(?:",t,")?")}function rt(...t){return t.map(n=>Ft(n)).join("")}function al(t){let e=t[t.length-1];return typeof e=="object"&&e.constructor===Object?(t.splice(t.length-1,1),e):{}}function Nn(...t){return"("+(al(t).capture?"":"?:")+t.map(r=>Ft(r)).join("|")+")"}function xi(t){return new RegExp(t.toString()+"|").exec("").length-1}function ol(t,e){let n=t&&t.exec(e);return n&&n.index===0}var ll=new RegExp(Nn(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function wr(t,{joinWith:e}){let n=0;return t.map(r=>{n+=1;let s=n,i=Ft(r),a="";for(;i.length>0;){let o=ll.exec(i);if(!o){a+=i;break}a+=i.substring(0,o.index),i=i.substring(o.index+o[0].length),o[0][0]==="\\"&&o[1]?a+="\\"+String(Number(o[1])+s):(a+=o[0],(o[0]==="("||/^\(\?[<']/.test(o[0]))&&n++)}return a}).map(r=>`(${r})`).join(e)}var cl=/\b\B/,vi="[a-zA-Z]\\w*",_r="[a-zA-Z_]\\w*",wi="\\b\\d+(\\.\\d+)?",_i="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",ki="\\b(0b[01]+)",ul="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",hl=(t={})=>{let e=/^#![ ]*\//;return t.binary&&(t.begin=rt(e,/.*\b/,t.binary,/\b.*/)),Ge({scope:"meta",begin:e,end:/$/,relevance:0,"on:begin":(n,r)=>{n.index!==0&&r.ignoreMatch()}},t)},jt={begin:"\\\\[\\s\\S]",relevance:0},dl={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[jt]},pl={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[jt]},fl={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},Cn=function(t,e,n={}){let r=Ge({scope:"comment",begin:t,end:e,contains:[]},n);r.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let s=Nn("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:rt(/[ ]+/,"(",s,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),r},gl=Cn("//","$"),ml=Cn("/\\*","\\*/"),bl=Cn("#","$"),yl={scope:"number",begin:wi,relevance:0},xl={scope:"number",begin:_i,relevance:0},vl={scope:"number",begin:ki,relevance:0},wl={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[jt,{begin:/\[/,end:/\]/,relevance:0,contains:[jt]}]},_l={scope:"title",begin:vi,relevance:0},kl={scope:"title",begin:_r,relevance:0},El={begin:"\\.\\s*"+_r,relevance:0},Tl=function(t){return Object.assign(t,{"on:begin":(e,n)=>{n.data._beginMatch=e[1]},"on:end":(e,n)=>{n.data._beginMatch!==e[1]&&n.ignoreMatch()}})},Sn=Object.freeze({__proto__:null,APOS_STRING_MODE:dl,BACKSLASH_ESCAPE:jt,BINARY_NUMBER_MODE:vl,BINARY_NUMBER_RE:ki,COMMENT:Cn,C_BLOCK_COMMENT_MODE:ml,C_LINE_COMMENT_MODE:gl,C_NUMBER_MODE:xl,C_NUMBER_RE:_i,END_SAME_AS_BEGIN:Tl,HASH_COMMENT_MODE:bl,IDENT_RE:vi,MATCH_NOTHING_RE:cl,METHOD_GUARD:El,NUMBER_MODE:yl,NUMBER_RE:wi,PHRASAL_WORDS_MODE:fl,QUOTE_STRING_MODE:pl,REGEXP_MODE:wl,RE_STARTERS_RE:ul,SHEBANG:hl,TITLE_MODE:_l,UNDERSCORE_IDENT_RE:_r,UNDERSCORE_TITLE_MODE:kl});function Sl(t,e){t.input[t.index-1]==="."&&e.ignoreMatch()}function Al(t,e){t.className!==void 0&&(t.scope=t.className,delete t.className)}function Rl(t,e){e&&t.beginKeywords&&(t.begin="\\b("+t.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",t.__beforeBegin=Sl,t.keywords=t.keywords||t.beginKeywords,delete t.beginKeywords,t.relevance===void 0&&(t.relevance=0))}function Nl(t,e){Array.isArray(t.illegal)&&(t.illegal=Nn(...t.illegal))}function Cl(t,e){if(t.match){if(t.begin||t.end)throw new Error("begin & end are not supported with match");t.begin=t.match,delete t.match}}function Ll(t,e){t.relevance===void 0&&(t.relevance=1)}var Ol=(t,e)=>{if(!t.beforeMatch)return;if(t.starts)throw new Error("beforeMatch cannot be used with starts");let n=Object.assign({},t);Object.keys(t).forEach(r=>{delete t[r]}),t.keywords=n.keywords,t.begin=rt(n.beforeMatch,yi(n.begin)),t.starts={relevance:0,contains:[Object.assign(n,{endsParent:!0})]},t.relevance=0,delete n.beforeMatch},Ml=["of","and","for","in","not","or","if","then","parent","list","value"],Il="keyword";function Ei(t,e,n=Il){let r=Object.create(null);return typeof t=="string"?s(n,t.split(" ")):Array.isArray(t)?s(n,t):Object.keys(t).forEach(function(i){Object.assign(r,Ei(t[i],e,i))}),r;function s(i,a){e&&(a=a.map(o=>o.toLowerCase())),a.forEach(function(o){let c=o.split("|");r[c[0]]=[i,Dl(c[0],c[1])]})}}function Dl(t,e){return e?Number(e):Pl(t)?0:1}function Pl(t){return Ml.includes(t.toLowerCase())}var di={},nt=t=>{console.error(t)},pi=(t,...e)=>{console.log(`WARN: ${t}`,...e)},St=(t,e)=>{di[`${t}/${e}`]||(console.log(`Deprecated as of ${t}. ${e}`),di[`${t}/${e}`]=!0)},Rn=new Error;function Ti(t,e,{key:n}){let r=0,s=t[n],i={},a={};for(let o=1;o<=e.length;o++)a[o+r]=s[o],i[o+r]=!0,r+=xi(e[o-1]);t[n]=a,t[n]._emit=i,t[n]._multi=!0}function zl(t){if(Array.isArray(t.begin)){if(t.skip||t.excludeBegin||t.returnBegin)throw nt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Rn;if(typeof t.beginScope!="object"||t.beginScope===null)throw nt("beginScope must be object"),Rn;Ti(t,t.begin,{key:"beginScope"}),t.begin=wr(t.begin,{joinWith:""})}}function $l(t){if(Array.isArray(t.end)){if(t.skip||t.excludeEnd||t.returnEnd)throw nt("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Rn;if(typeof t.endScope!="object"||t.endScope===null)throw nt("endScope must be object"),Rn;Ti(t,t.end,{key:"endScope"}),t.end=wr(t.end,{joinWith:""})}}function Bl(t){t.scope&&typeof t.scope=="object"&&t.scope!==null&&(t.beginScope=t.scope,delete t.scope)}function Ul(t){Bl(t),typeof t.beginScope=="string"&&(t.beginScope={_wrap:t.beginScope}),typeof t.endScope=="string"&&(t.endScope={_wrap:t.endScope}),zl(t),$l(t)}function Hl(t){function e(a,o){return new RegExp(Ft(a),"m"+(t.case_insensitive?"i":"")+(t.unicodeRegex?"u":"")+(o?"g":""))}class n{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(o,c){c.position=this.position++,this.matchIndexes[this.matchAt]=c,this.regexes.push([c,o]),this.matchAt+=xi(o)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let o=this.regexes.map(c=>c[1]);this.matcherRe=e(wr(o,{joinWith:"|"}),!0),this.lastIndex=0}exec(o){this.matcherRe.lastIndex=this.lastIndex;let c=this.matcherRe.exec(o);if(!c)return null;let u=c.findIndex((p,y)=>y>0&&p!==void 0),d=this.matchIndexes[u];return c.splice(0,u),Object.assign(c,d)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(o){if(this.multiRegexes[o])return this.multiRegexes[o];let c=new n;return this.rules.slice(o).forEach(([u,d])=>c.addRule(u,d)),c.compile(),this.multiRegexes[o]=c,c}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(o,c){this.rules.push([o,c]),c.type==="begin"&&this.count++}exec(o){let c=this.getMatcher(this.regexIndex);c.lastIndex=this.lastIndex;let u=c.exec(o);if(this.resumingScanAtSamePosition()&&!(u&&u.index===this.lastIndex)){let d=this.getMatcher(0);d.lastIndex=this.lastIndex+1,u=d.exec(o)}return u&&(this.regexIndex+=u.position+1,this.regexIndex===this.count&&this.considerAll()),u}}function s(a){let o=new r;return a.contains.forEach(c=>o.addRule(c.begin,{rule:c,type:"begin"})),a.terminatorEnd&&o.addRule(a.terminatorEnd,{type:"end"}),a.illegal&&o.addRule(a.illegal,{type:"illegal"}),o}function i(a,o){let c=a;if(a.isCompiled)return c;[Al,Cl,Ul,Ol].forEach(d=>d(a,o)),t.compilerExtensions.forEach(d=>d(a,o)),a.__beforeBegin=null,[Rl,Nl,Ll].forEach(d=>d(a,o)),a.isCompiled=!0;let u=null;return typeof a.keywords=="object"&&a.keywords.$pattern&&(a.keywords=Object.assign({},a.keywords),u=a.keywords.$pattern,delete a.keywords.$pattern),u=u||/\w+/,a.keywords&&(a.keywords=Ei(a.keywords,t.case_insensitive)),c.keywordPatternRe=e(u,!0),o&&(a.begin||(a.begin=/\B|\b/),c.beginRe=e(c.begin),!a.end&&!a.endsWithParent&&(a.end=/\B|\b/),a.end&&(c.endRe=e(c.end)),c.terminatorEnd=Ft(c.end)||"",a.endsWithParent&&o.terminatorEnd&&(c.terminatorEnd+=(a.end?"|":"")+o.terminatorEnd)),a.illegal&&(c.illegalRe=e(a.illegal)),a.contains||(a.contains=[]),a.contains=[].concat(...a.contains.map(function(d){return Fl(d==="self"?a:d)})),a.contains.forEach(function(d){i(d,c)}),a.starts&&i(a.starts,o),c.matcher=s(c),c}if(t.compilerExtensions||(t.compilerExtensions=[]),t.contains&&t.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return t.classNameAliases=Ge(t.classNameAliases||{}),i(t)}function Si(t){return t?t.endsWithParent||Si(t.starts):!1}function Fl(t){return t.variants&&!t.cachedVariants&&(t.cachedVariants=t.variants.map(function(e){return Ge(t,{variants:null},e)})),t.cachedVariants?t.cachedVariants:Si(t)?Ge(t,{starts:t.starts?Ge(t.starts):null}):Object.isFrozen(t)?Ge(t):t}var jl="11.12.0",vr=class extends Error{constructor(e,n){super(e),this.name="HTMLInjectionError",this.html=n}},mr=bi,fi=Ge,gi=Symbol("nomatch"),ql=7,Ai=function(t){let e=Object.create(null),n=Object.create(null),r=[],s=!0,i="Could not find the language '{}', did you forget to load/include a language module?",a={disableAutodetect:!0,name:"Plain text",contains:[]},o={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:xr};function c(g){return o.noHighlightRe.test(g)}function u(g){let E=g.className+" ";E+=g.parentNode?g.parentNode.className:"";let A=o.languageDetectRe.exec(E);if(A){let I=X(A[1]);return I||(pi(i.replace("{}",A[1])),pi("Falling back to no-highlight mode for this block.",g)),I?A[1]:"no-highlight"}return E.split(/\s+/).find(I=>c(I)||X(I))}function d(g,E,A){let I="",j="";typeof E=="object"?(I=g,A=E.ignoreIllegals,j=E.language):(St("10.7.0","highlight(lang, code, ...args) has been deprecated."),St("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),j=g,I=E),A===void 0&&(A=!0);let se={code:I,language:j};Be("before:highlight",se);let ge=se.result?se.result:p(se.language,se.code,A);return ge.code=se.code,Be("after:highlight",ge),ge}function p(g,E,A,I){let j=Object.create(null);function se(w,k){return w.keywords[k]}function ge(){if(!T.keywords){te.addText(z);return}let w=0;T.keywordPatternRe.lastIndex=0;let k=T.keywordPatternRe.exec(z),R="";for(;k;){R+=z.substring(w,k.index);let B=me.case_insensitive?k[0].toLowerCase():k[0],J=se(T,B);if(J){let[be,It]=J;if(te.addText(R),R="",j[B]=(j[B]||0)+1,j[B]<=ql&&(Je+=It),be.startsWith("_"))R+=k[0];else{let je=me.classNameAliases[be]||be;Te(k[0],je)}}else R+=k[0];w=T.keywordPatternRe.lastIndex,k=T.keywordPatternRe.exec(z)}R+=z.substring(w),te.addText(R)}function Ue(){if(z==="")return;let w=null;if(typeof T.subLanguage=="string"){if(!e[T.subLanguage]){te.addText(z);return}w=p(T.subLanguage,z,!0,Fe[T.subLanguage]),Fe[T.subLanguage]=w._top}else w=v(z,T.subLanguage.length?T.subLanguage:null);T.relevance>0&&(Je+=w.relevance),te.__addSublanguage(w._emitter,w.language)}function M(){T.subLanguage!=null?Ue():ge(),z=""}function Te(w,k){w!==""&&(te.startScope(k),te.addText(w),te.endScope())}function nn(w,k){let R=1,B=k.length-1;for(;R<=B;){if(!w._emit[R]){R++;continue}let J=me.classNameAliases[w[R]]||w[R],be=k[R];J?Te(be,J):(z=be,ge(),z=""),R++}}function rn(w,k){return w.scope&&typeof w.scope=="string"&&te.openNode(me.classNameAliases[w.scope]||w.scope),w.beginScope&&(w.beginScope._wrap?(Te(z,me.classNameAliases[w.beginScope._wrap]||w.beginScope._wrap),z=""):w.beginScope._multi&&(nn(w.beginScope,k),z="")),T=Object.create(w,{parent:{value:T}}),T}function sn(w,k,R){let B=ol(w.endRe,R);if(B){if(w["on:end"]){let J=new An(w);w["on:end"](k,J),J.isMatchIgnored&&(B=!1)}if(B){for(;w.endsParent&&w.parent;)w=w.parent;return w}}if(w.endsWithParent)return sn(w.parent,k,R)}function Yn(w){return T.matcher.regexIndex===0?(z+=w[0],1):(pt=!0,0)}function Xn(w){let k=w[0],R=w.rule,B=new An(R),J=[R.__beforeBegin,R["on:begin"]];for(let be of J)if(be&&(be(w,B),B.isMatchIgnored))return Yn(k);return R.skip?z+=k:(R.excludeBegin&&(z+=k),M(),!R.returnBegin&&!R.excludeBegin&&(z=k)),rn(R,w),R.returnBegin?0:k.length}function an(w){let k=w[0],R=E.substring(w.index),B=sn(T,w,R);if(!B)return gi;let J=T;T.endScope&&T.endScope._wrap?(M(),Te(k,T.endScope._wrap)):T.endScope&&T.endScope._multi?(M(),nn(T.endScope,w)):J.skip?z+=k:(J.returnEnd||J.excludeEnd||(z+=k),M(),J.excludeEnd&&(z=k));do T.scope&&te.closeNode(),!T.skip&&!T.subLanguage&&(Je+=T.relevance),T=T.parent;while(T!==B.parent);return B.starts&&rn(B.starts,w),J.returnEnd?0:k.length}function Zn(){let w=[];for(let k=T;k!==me;k=k.parent)k.scope&&w.unshift(k.scope);w.forEach(k=>te.openNode(k))}let Xe={};function G(w,k){let R=k&&k[0];if(z+=w,R==null)return M(),0;if(Xe.type==="begin"&&k.type==="end"&&Xe.index===k.index&&R===""){if(z+=E.slice(k.index,k.index+1),!s){let B=new Error(`0 width match regex (${g})`);throw B.languageName=g,B.badRule=Xe.rule,B}return 1}if(Xe=k,k.type==="begin")return Xn(k);if(k.type==="illegal"&&!A){let B=new Error('Illegal lexeme "'+R+'" for mode "'+(T.scope||"<unnamed>")+'"');throw B.mode=T,B}else if(k.type==="end"){let B=an(k);if(B!==gi)return B}if(k.type==="illegal"&&R==="")return k.index===E.length||(z+=`
`),1;if(dt>1e5&&dt>k.index*3)throw new Error("potential infinite loop, way more iterations than matches");return z+=R,R.length}let me=X(g);if(!me)throw nt(i.replace("{}",g)),new Error('Unknown language: "'+g+'"');let V=Hl(me),Ze="",T=I||V,Fe={},te=new o.__emitter(o);Zn();let z="",Je=0,Re=0,dt=0,pt=!1;try{if(me.__emitTokens)me.__emitTokens(E,te);else{for(T.matcher.considerAll();;){dt++,pt?pt=!1:T.matcher.considerAll(),T.matcher.lastIndex=Re;let w=T.matcher.exec(E);if(!w)break;let k=E.substring(Re,w.index),R=G(k,w);Re=w.index+R}G(E.substring(Re))}return te.finalize(),Ze=te.toHTML(),{language:g,value:Ze,relevance:Je,illegal:!1,_emitter:te,_top:T}}catch(w){if(w.message&&w.message.includes("Illegal"))return{language:g,value:mr(E),illegal:!0,relevance:0,_illegalBy:{message:w.message,index:Re,context:E.slice(Re-100,Re+100),mode:w.mode,resultSoFar:Ze},_emitter:te};if(s)return{language:g,value:mr(E),illegal:!1,relevance:0,errorRaised:w,_emitter:te,_top:T};throw w}}function y(g){let E={value:mr(g),illegal:!1,relevance:0,_top:a,_emitter:new o.__emitter(o)};return E._emitter.addText(g),E}function v(g,E){E=E||o.languages||Object.keys(e);let A=y(g),I=E.filter(X).filter(Ee).map(M=>p(M,g,!1));I.unshift(A);let j=I.sort((M,Te)=>{if(M.relevance!==Te.relevance)return Te.relevance-M.relevance;if(M.language&&Te.language){if(X(M.language).supersetOf===Te.language)return 1;if(X(Te.language).supersetOf===M.language)return-1}return 0}),[se,ge]=j,Ue=se;return Ue.secondBest=ge,Ue}function _(g,E,A){let I=E&&n[E]||A;g.classList.add("hljs"),g.classList.add(`language-${I}`)}function C(g){let E=null,A=u(g);if(c(A))return;if(Be("before:highlightElement",{el:g,language:A}),g.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",g);return}if(g.children.length>0&&(o.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(g)),o.throwUnescapedHTML))throw new vr("One of your code blocks includes unescaped HTML.",g.innerHTML);E=g;let I=E.textContent,j=A?d(I,{language:A,ignoreIllegals:!0}):v(I);g.innerHTML=j.value,g.dataset.highlighted="yes",_(g,A,j.language),g.result={language:j.language,re:j.relevance,relevance:j.relevance},j.secondBest&&(g.secondBest={language:j.secondBest.language,relevance:j.secondBest.relevance}),Be("after:highlightElement",{el:g,result:j,text:I})}function N(g){o=fi(o,g)}let H=()=>{P(),St("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function O(){P(),St("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let F=!1;function P(){function g(){P()}if(document.readyState==="loading"){F||window.addEventListener("DOMContentLoaded",g,!1),F=!0;return}document.querySelectorAll(o.cssSelector).forEach(C)}function q(g,E){let A=null;try{A=E(t)}catch(I){if(nt("Language definition for '{}' could not be registered.".replace("{}",g)),s)nt(I);else throw I;A=a}A.name||(A.name=g),e[g]=A,A.rawDefinition=E.bind(null,t),A.aliases&&Z(A.aliases,{languageName:g})}function K(g){delete e[g];for(let E of Object.keys(n))n[E]===g&&delete n[E]}function he(){return Object.keys(e)}function X(g){return g=(g||"").toLowerCase(),e[g]||e[n[g]]}function Z(g,{languageName:E}){typeof g=="string"&&(g=[g]),g.forEach(A=>{n[A.toLowerCase()]=E})}function Ee(g){let E=X(g);return E&&!E.disableAutodetect}function Ye(g){g["before:highlightBlock"]&&!g["before:highlightElement"]&&(g["before:highlightElement"]=E=>{g["before:highlightBlock"](Object.assign({block:E.el},E))}),g["after:highlightBlock"]&&!g["after:highlightElement"]&&(g["after:highlightElement"]=E=>{g["after:highlightBlock"](Object.assign({block:E.el},E))})}function ht(g){Ye(g),r.push(g)}function $e(g){let E=r.indexOf(g);E!==-1&&r.splice(E,1)}function Be(g,E){let A=g;r.forEach(function(I){I[A]&&I[A](E)})}function Oe(g){return St("10.7.0","highlightBlock will be removed entirely in v12.0"),St("10.7.0","Please use highlightElement now."),C(g)}Object.assign(t,{highlight:d,highlightAuto:v,highlightAll:P,highlightElement:C,highlightBlock:Oe,configure:N,initHighlighting:H,initHighlightingOnLoad:O,registerLanguage:q,unregisterLanguage:K,listLanguages:he,getLanguage:X,registerAliases:Z,autoDetection:Ee,inherit:fi,addPlugin:ht,removePlugin:$e}),t.debugMode=function(){s=!1},t.safeMode=function(){s=!0},t.versionString=jl,t.regex={concat:rt,lookahead:yi,either:Nn,optional:il,anyNumberOfTimes:sl};for(let g in Sn)typeof Sn[g]=="object"&&mi(Sn[g]);return Object.assign(t,Sn),t},At=Ai({});At.newInstance=()=>Ai({});Ri.exports=At;At.HighlightJS=At;At.default=At});var wt=`/*
 * Syntax highlighting roles for highlight.js classes.
 * Mapping: docs/DESIGN_SYSTEM.md \xA72.3. Colors come from theme tokens.
 */
.hljs-keyword,
.hljs-built_in,
.hljs-literal,
.hljs-bullet,
.hljs-doctag {
  color: var(--_syntax-keyword);
}

.hljs-string,
.hljs-regexp,
.hljs-symbol,
.hljs-char,
.hljs-code,
.hljs-link {
  color: var(--_syntax-string);
}

.hljs-number {
  color: var(--_syntax-number);
}

.hljs-title,
.hljs-title.function_,
.hljs-section,
.hljs-selector-class,
.hljs-selector-id {
  color: var(--_syntax-function);
}

.hljs-type,
.hljs-title.class_,
.hljs-title.class_.inherited__ {
  color: var(--_syntax-type);
}

.hljs-comment,
.hljs-quote {
  color: var(--_syntax-comment);
  font-style: italic;
}

.hljs-attr,
.hljs-attribute,
.hljs-property,
.hljs-template-variable,
.hljs-variable.language_ {
  color: var(--_syntax-attr);
}

.hljs-tag,
.hljs-name,
.hljs-selector-tag,
.hljs-selector-pseudo,
.hljs-selector-attr {
  color: var(--_syntax-tag);
}

.hljs-meta,
.hljs-punctuation,
.hljs-operator,
.hljs-tag .hljs-punctuation {
  color: var(--_syntax-meta);
}

.hljs-meta .hljs-keyword {
  color: var(--_syntax-keyword);
}

.hljs-meta .hljs-string {
  color: var(--_syntax-string);
}

.hljs-addition {
  color: var(--_success);
}

.hljs-deletion {
  color: var(--_danger);
}

.hljs-section,
.hljs-strong {
  font-weight: 600;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-link {
  text-decoration: underline;
  text-underline-offset: 3px;
}
`;var bn=`/*
 * Code view: used by <vt-code>, the Markdown source tab and the JSON raw view.
 */
.code-view {
  position: relative;
}

.code {
  display: grid;
  width: max-content;
  min-width: 100%;
  margin: 0;
  padding: var(--_space-3) 0;
  color: var(--_code-fg);
  font-family: var(--_font-mono);
  font-size: var(--_font-size);
  font-variant-ligatures: var(--vt-font-ligatures, none);
  line-height: var(--_line-height);
  tab-size: var(--_tab-size);
}

.wrap .code {
  width: auto;
}

.line {
  display: flex;
  min-width: 0;
}

/* Long code: off-screen blocks of lines skip layout and paint. */
.chunk.revealed {
  content-visibility: visible;
}

.chunk {
  display: block;
  content-visibility: auto;
  contain-intrinsic-block-size: auto
    calc(var(--_chunk-lines) * var(--_font-size) * var(--_line-height));
}

/* A block whose lines are not built yet keeps the height they will take. */
.chunk[data-pending] {
  block-size: calc(var(--_chunk-lines) * var(--_font-size) * var(--_line-height));
}

.gutter {
  position: sticky;
  left: 0;
  z-index: 1;
  flex: none;
  min-width: calc(var(--_digits, 2) * 1ch + 2 * var(--_space-3));
  padding: 0 var(--_space-3);
  border-right: 1px solid color-mix(in srgb, var(--_code-gutter) 35%, transparent);
  background: var(--_code-bg-solid);
  color: var(--_code-gutter);
  font-size: var(--_font-size-small);
  line-height: calc(var(--_font-size) * var(--_line-height));
  font-variant-numeric: tabular-nums;
  text-align: right;
  user-select: none;
  -webkit-user-select: none;
}

.gutter::before {
  content: attr(data-n);
}

.sign {
  flex: none;
  width: 2ch;
  padding-left: var(--_space-2);
  color: var(--_fg-muted);
  user-select: none;
  -webkit-user-select: none;
}

.content {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 var(--_space-4);
  white-space: pre;
}

.sign + .content {
  padding-left: var(--_space-1);
}

.wrap .content {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.line.highlighted {
  background: var(--_line-highlight);
}

.line.highlighted .gutter {
  box-shadow: inset 2px 0 0 var(--_accent);
  color: var(--_code-fg);
}

.line.added {
  background: var(--_diff-added);
}

.line.removed {
  background: var(--_diff-removed);
}

.line.added .sign::before {
  content: '+';
  color: var(--_success);
}

.line.removed .sign::before {
  content: '\\2212';
  color: var(--_danger);
}

.line.hunk .content {
  color: var(--_info);
}

/* Collapsible: show the first N lines, fade the rest. */
.collapsed .code {
  max-height: calc(
    (var(--_collapse-lines) + 0.6) * var(--_font-size) * var(--_line-height) + var(--_space-3)
  );
  overflow: hidden;
}

.collapsed .code-view::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: calc(0.9 * var(--_font-size) * var(--_line-height));
  background: linear-gradient(transparent, var(--_code-bg-solid));
  pointer-events: none;
}

.more {
  display: flex;
  justify-content: center;
  padding: var(--_space-2);
  border-top: 1px solid var(--_border);
  background: var(--_surface);
}

/* ---------- Editor: a transparent textarea laid over the highlighted code ---------- */

.editor {
  position: relative;
  width: max-content;
  min-width: 100%;
}

.editor.wrap {
  width: auto;
}

.editor-layer {
  pointer-events: none;
}

/* Bold or italic tokens can shift characters in some fonts: keep the layer regular. */
.editor-layer .code * {
  font-style: inherit !important;
  font-weight: inherit !important;
}

/* An empty last line still needs its height under the caret. */
.editor-layer .content:empty::before {
  content: '\\200b';
}

.editor-input {
  position: absolute;
  top: 0;
  left: var(--_editor-gutter, 0px);
  width: calc(100% - var(--_editor-gutter, 0px));
  height: 100%;
  margin: 0;
  padding: var(--_space-3) var(--_space-4);
  overflow: hidden;
  border: 0;
  outline: none;
  background: transparent;
  color: transparent;
  -webkit-text-fill-color: transparent;
  caret-color: var(--_code-fg);
  font-family: var(--_font-mono);
  font-size: var(--_font-size);
  font-variant-ligatures: var(--vt-font-ligatures, none);
  line-height: var(--_line-height);
  tab-size: var(--_tab-size);
  white-space: pre;
  overflow-wrap: normal;
  resize: none;
}

.editor.wrap .editor-input {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.editor-input::selection {
  background: color-mix(in srgb, var(--_accent) 32%, transparent);
}

.editor-input::placeholder {
  color: var(--_fg-muted);
  -webkit-text-fill-color: var(--_fg-muted);
  opacity: 1;
}

/* Long text: plain text while typing, highlighting after a pause. */
.editor.pending .editor-input {
  color: var(--_fg);
  -webkit-text-fill-color: var(--_fg);
}

.editor.pending .editor-layer .content {
  visibility: hidden;
}

.body:has(.editor-input:focus) {
  outline: 2px solid var(--_accent);
  outline-offset: -2px;
}

.edit-status {
  display: flex;
  align-items: center;
  gap: var(--_space-2);
  padding: var(--_space-2) var(--_space-3);
  border-top: 1px solid var(--_border);
  background: var(--_surface);
  font-family: var(--_font-ui);
  font-size: var(--_font-size-small);
}

.edit-status.ok {
  color: var(--_success);
}

.edit-status.bad {
  color: var(--_danger);
}

.edit-status .icon {
  width: 14px;
  height: 14px;
  flex: none;
}
`;var ys=`/*
 * JSON tree. Colors reuse the syntax roles so code and JSON look the same.
 * Spec: docs/DESIGN_SYSTEM.md \xA72.4 and \xA76 (tree-toggle).
 */
.tree-body {
  padding: var(--_space-2) 0;
}

.tree,
.group {
  margin: 0;
  padding: 0;
  list-style: none;
}

.tree {
  min-width: 100%;
  color: var(--_code-fg);
  font-family: var(--_font-mono);
  font-size: var(--_font-size);
  line-height: var(--_line-height);
}

.item {
  outline: none;
}

.row {
  display: flex;
  align-items: baseline;
  gap: 0;
  min-height: calc(var(--_font-size) * var(--_line-height));
  padding: 1px var(--_space-4) 1px calc(var(--_space-3) + var(--_level, 0) * 1.25em);
  cursor: default;
}

.row > * {
  flex: none;
  white-space: pre;
}

.row > .key {
  flex: 0 0 auto;
  max-width: min(50%, 48ch);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.row:hover {
  background: color-mix(in srgb, var(--_accent-soft) 60%, transparent);
}

.item[aria-selected='true'] > .row {
  background: var(--_accent-soft);
}

.item:focus-visible > .row {
  outline: 2px solid var(--_accent);
  outline-offset: -2px;
  border-radius: 2px;
}

.toggle {
  display: inline-grid;
  flex: none;
  place-items: center;
  align-self: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  color: var(--_fg-muted);
  cursor: pointer;
}

.toggle .icon {
  width: 14px;
  height: 14px;
  transition: transform var(--_duration) var(--_easing);
}

.item[aria-expanded='true'] > .row > .toggle .icon {
  transform: rotate(90deg);
}

.toggle.leaf {
  cursor: default;
}

.vt:not([data-syntax-theme]) .key {
  color: var(--_syntax-attr);
}

.vt:not([data-syntax-theme]) .index {
  color: var(--_syntax-meta);
}

.vt:not([data-syntax-theme]) .punct {
  color: var(--_syntax-meta);
}

.row > .value.string,
.row > .value-wrap {
  flex: 0 1 auto;
  min-width: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.vt:not([data-syntax-theme]) .value.string {
  color: var(--_syntax-string);
}

.vt:not([data-syntax-theme]) .value.number {
  color: var(--_syntax-number);
}

.vt:not([data-syntax-theme]) .value.literal {
  color: var(--_syntax-keyword);
}

.count {
  margin-left: var(--_space-2);
  color: var(--_fg-muted);
  font-family: var(--_font-ui);
  font-size: var(--_font-size-small);
}

.type {
  margin-left: var(--_space-2);
  padding: 0 5px;
  border: 1px solid var(--_border);
  border-radius: var(--_radius-sm);
  background: var(--_surface-sunken);
  color: var(--_fg-muted);
  font-family: var(--_font-ui);
  font-size: var(--_font-size-small);
  line-height: 1.5;
}

.inline-more,
.more-label {
  font-family: var(--_font-ui);
  font-size: var(--_font-size-small);
}

.inline-more {
  margin-left: var(--_space-2);
  padding: 0 6px;
  border: 1px solid var(--_border-strong);
  border-radius: var(--_radius-sm);
  background: var(--_surface);
  color: var(--_accent-fg);
  cursor: pointer;
}

.more-item > .row {
  cursor: pointer;
}

.more-label {
  color: var(--_accent-fg);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ---------- Path bar ---------- */

.pathbar {
  display: flex;
  align-items: center;
  gap: var(--_space-2);
  min-height: 36px;
  padding: 0 var(--_space-2) 0 var(--_space-3);
  border-top: 1px solid var(--_border);
  background: var(--_surface);
}

.path-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--_fg-muted);
  font-family: var(--_font-mono);
  font-size: var(--_font-size-small);
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* With a syntax theme, badges and counts take the colors of the code area. */
.vt[data-syntax-theme] .count {
  color: color-mix(in srgb, var(--_code-fg) 80%, var(--_code-bg-solid));
}

.vt[data-syntax-theme] .type {
  border-color: color-mix(in srgb, var(--_code-fg) 30%, transparent);
  background: transparent;
  color: color-mix(in srgb, var(--_code-fg) 80%, var(--_code-bg-solid));
}
`;function De(t){if(t===null)return null;let e=t.trim().toLowerCase();return!(e==="false"||e==="off"||e==="no"||e==="0")}function lr(t,{min:e,max:n,fallback:r}){if(t===null||t.length>32)return r;let s=t.trim();if(!/^[+-]?\d+$/.test(s))return r;let i=Number(s);return Number.isSafeInteger(i)?Math.min(n,Math.max(e,i)):r}function Ne(t,e,n){if(t===null)return n;let r=t.trim().toLowerCase();return e.includes(r)?r:n}function xs(t,e){if(t===null||t.length>1e3)return null;let n=[];for(let r of t.split(",")){let s=r.trim().toLowerCase();e.includes(s)&&!n.includes(s)&&n.push(s)}return n.length?n:null}function vs(t,e){let n=0,r=e.length-1;for(;n<=r;){let s=n+r>>1,[i,a]=e[s];if(t<i)r=s-1;else if(t>a)n=s+1;else return!0}return!1}function ws(t){if(t===null)return null;let e=t.trim().toLowerCase();return/^\d{1,6}(?:\.\d{1,4})?(?:px|em|rem|vh|svh|lvh|dvh|%|ch|lh)$/.test(e)?e:null}function _s(t,e=200){if(!t)return"";let r=t.slice(0,e*4).replace(/[\u0000-\u001f\u007f-\u009f]/g,"").replace(/\s+/g," ").trim();return r.length>e?r.slice(0,e-1)+"\u2026":r}function ks(t,e){let n=(t??"").split(/[\\/]/).pop()??"",r=/[\u0000-\u001f\u007f<>:"|?*]/g;return n.replace(r,"").replace(/^[.\s]+/,"").trim().slice(0,120)||e}var Es=`/*
 * Theme-independent tokens: typography, spacing, radius, motion.
 * Values: docs/DESIGN_SYSTEM.md \xA73, \xA74 and \xA77.
 * Each private \`--_\` variable reads the public \`--vt-\` variable first, so hosts can
 * override any token on the element or on an ancestor.
 */
:host {
  --_font-ui: var(
    --vt-font-ui,
    system-ui,
    -apple-system,
    'Segoe UI',
    'IBM Plex Sans',
    Roboto,
    sans-serif
  );
  --_font-mono: var(
    --vt-font-mono,
    'JetBrains Mono',
    ui-monospace,
    'Cascadia Code',
    'SF Mono',
    Menlo,
    Consolas,
    monospace
  );
  --_font-size: var(--vt-font-size, 14px);
  --_font-size-small: var(--vt-font-size-small, 12px);
  --_font-size-ui: var(--vt-font-size-ui, 13px);
  --_line-height: var(--vt-line-height, 1.6);
  --_space-1: var(--vt-space-1, 4px);
  --_space-2: var(--vt-space-2, 8px);
  --_space-3: var(--vt-space-3, 12px);
  --_space-4: var(--vt-space-4, 16px);
  --_space-5: var(--vt-space-5, 24px);
  --_space-6: var(--vt-space-6, 32px);
  --_space-7: var(--vt-space-7, 48px);
  --_space-8: var(--vt-space-8, 64px);
  --_radius-sm: var(--vt-radius-sm, 6px);
  --_radius: var(--vt-radius, 10px);
  --_radius-lg: var(--vt-radius-lg, 16px);
  --_radius-full: var(--vt-radius-full, 999px);
  --_header-height: var(--vt-header-height, 40px);
  --_tab-size: var(--vt-tab-size, 4);
  --_duration-fast: var(--vt-duration-fast, 120ms);
  --_duration: var(--vt-duration, 180ms);
  --_easing: var(--vt-easing, cubic-bezier(0.2, 0, 0, 1));
}

@media (prefers-reduced-motion: reduce) {
  :host {
    --_duration-fast: 0ms;
    --_duration: 0ms;
  }
}
`;var Ts=`/*
 * Shared component frame: container, header, toolbar, tabs, search, states.
 * Anatomy: docs/DESIGN_SYSTEM.md \xA76. Colors come only from theme tokens.
 */
:host {
  display: block;
  min-width: 0;
  margin-block: var(--vt-margin, 0);
}

:host([hidden]) {
  display: none;
}

[hidden] {
  display: none !important;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.vt {
  /* Code areas: interface colors by default, replaced by a syntax theme when one is set. */
  --_code-bg: var(--_surface-sunken);
  --_code-bg-solid: var(--_surface-sunken);
  --_code-fg: var(--_fg);
  --_code-gutter: color-mix(in srgb, var(--_fg-muted) 70%, transparent);
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  color: var(--_fg);
  background: var(--_surface);
  border: 1px solid var(--_border);
  border-radius: var(--_radius);
  font-family: var(--_font-ui);
  font-size: var(--_font-size-ui);
  line-height: 1.4;
  text-align: start;
  -webkit-text-size-adjust: 100%;
}

/* Chrome always uses the UI font, even when the content inherits the page font. */
.header,
.search,
.notice,
.message,
.empty,
.more,
.toolbar,
.toc {
  font-family: var(--_font-ui);
  font-size: var(--_font-size-ui);
  line-height: 1.4;
}

/* ---------- Header ---------- */

.header {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--_space-2);
  min-height: var(--_header-height);
  padding: 0 var(--_space-2) 0 var(--_space-3);
  border-bottom: 1px solid var(--_border);
  background: var(--_surface);
}

.dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: var(--_radius-full);
  background: var(--_accent);
}

.title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--_fg);
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.spacer {
  flex: 1 1 auto;
}

.badge {
  flex: none;
  padding: 2px 6px;
  border-radius: var(--_radius-sm);
  background: var(--_surface-sunken);
  color: var(--_fg-muted);
  font-size: var(--_font-size-small);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.vt {
  position: relative;
}

.toolbar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 2px;
}

.toolbar.floating {
  position: absolute;
  top: var(--_space-2);
  right: var(--_space-2);
  z-index: 3;
  padding: 2px;
  border: 1px solid var(--_border);
  border-radius: var(--_radius-sm);
  background: var(--_surface);
  opacity: 0;
  transition: opacity var(--_duration-fast) var(--_easing);
}

.vt:hover .toolbar.floating,
.toolbar.floating:focus-within {
  opacity: 1;
}

@media (hover: none) {
  .toolbar.floating {
    opacity: 1;
  }
}

/* ---------- Buttons ---------- */

.btn {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--_radius-sm);
  background: transparent;
  color: var(--_fg-muted);
  font: inherit;
  cursor: pointer;
  transition:
    background-color var(--_duration-fast) var(--_easing),
    color var(--_duration-fast) var(--_easing);
}

.btn:hover {
  background: var(--_accent-soft);
  color: var(--_fg);
}

.btn[aria-pressed='true'] {
  background: var(--_accent-soft);
  color: var(--_accent-fg);
}

.btn.done {
  color: var(--_success);
}

.btn:disabled {
  opacity: 0.45;
  cursor: default;
  background: transparent;
}

.icon {
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.text-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--_space-1);
  min-height: 28px;
  padding: 0 var(--_space-2);
  border: 1px solid var(--_border-strong);
  border-radius: var(--_radius-sm);
  background: var(--_surface);
  color: var(--_fg);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--_duration-fast) var(--_easing);
}

.text-btn:hover {
  background: var(--_accent-soft);
}

.text-btn.done {
  border-color: var(--_success);
  color: var(--_success);
}

.pathbar .text-btn {
  min-height: 24px;
  font-size: var(--_font-size-small);
}

:focus-visible {
  outline: 2px solid var(--_accent);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

@media (pointer: coarse) {
  .btn {
    width: 44px;
    height: 44px;
  }

  .text-btn,
  .tab {
    min-height: 44px;
  }
}

/* ---------- Tabs (WAI-ARIA tabs pattern) ---------- */

.tabs {
  display: flex;
  align-self: stretch;
  align-items: stretch;
  gap: var(--_space-1);
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 var(--_space-2);
  border: 0;
  background: transparent;
  color: var(--_fg-muted);
  font: inherit;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--_duration-fast) var(--_easing);
}

.tab::after {
  content: '';
  position: absolute;
  right: var(--_space-2);
  bottom: -1px;
  left: var(--_space-2);
  height: 2px;
  border-radius: 2px;
  background: transparent;
  transition: background-color var(--_duration) var(--_easing);
}

.tab:hover {
  color: var(--_fg);
}

.tab[aria-selected='true'] {
  color: var(--_fg);
}

.tab[aria-selected='true']::after {
  background: var(--_accent);
}

.tab:focus-visible {
  outline-offset: -2px;
}

.tab .icon {
  width: 14px;
  height: 14px;
}

/* ---------- Search ---------- */

.search {
  display: flex;
  align-items: center;
  gap: var(--_space-1);
  padding: var(--_space-2) var(--_space-2) var(--_space-2) var(--_space-3);
  border-bottom: 1px solid var(--_border);
  background: var(--_surface);
}

.search-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 28px;
  padding: 0 var(--_space-2);
  border: 1px solid var(--_border-strong);
  border-radius: var(--_radius-sm);
  background: var(--_surface-sunken);
  color: var(--_fg);
  font: inherit;
}

.search-input::placeholder {
  color: var(--_fg-muted);
  opacity: 1;
}

.search-input:focus-visible {
  outline-offset: 0;
  border-color: var(--_accent);
}

.search-count {
  flex: none;
  min-width: 5ch;
  color: var(--_fg-muted);
  font-variant-numeric: tabular-nums;
  text-align: end;
  white-space: nowrap;
}

mark.match {
  border-radius: 2px;
  background: var(--_highlight);
  color: inherit;
}

mark.match.current {
  background: var(--_highlight-current);
  box-shadow: 0 0 0 1px var(--_warning);
}

/* ---------- Body ---------- */

.body {
  position: relative;
  min-width: 0;
  max-height: var(--_max-height, none);
  overflow: auto;
  background: var(--_code-bg);
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--_border-strong) transparent;
}

.body:focus-visible {
  outline-offset: -2px;
}

/* ---------- States ---------- */

.notice {
  display: flex;
  align-items: center;
  gap: var(--_space-2);
  padding: var(--_space-2) var(--_space-3);
  border-bottom: 1px solid var(--_border);
  background: var(--_surface);
  color: var(--_fg-muted);
  font-size: var(--_font-size-small);
}

.notice .icon {
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--_warning);
}

.message {
  display: flex;
  align-items: flex-start;
  gap: var(--_space-2);
  padding: var(--_space-4);
  background: var(--_surface);
  overflow-wrap: anywhere;
}

.message .icon {
  flex: none;
  margin-top: 1px;
  color: var(--_danger);
}

.message-title {
  margin: 0;
  color: var(--_danger);
  font-weight: 600;
}

.message-detail {
  margin: var(--_space-1) 0 0;
  color: var(--_fg-muted);
}

.empty {
  padding: var(--_space-5) var(--_space-4);
  color: var(--_fg-muted);
  text-align: center;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--_space-3);
  min-height: 140px;
  padding: var(--_space-5);
  color: var(--_fg-muted);
  /* Fast loads show nothing: the loader only appears after a short delay. */
  opacity: 0;
  animation: vt-loader-in var(--_duration) var(--_easing) 300ms forwards;
}

.loader-mark {
  width: 44px;
  height: 44px;
  overflow: visible;
}

.loader-frame {
  fill: none;
  stroke: currentColor;
  stroke-width: 9;
}

.loader-dot {
  fill: var(--_accent);
  transform-origin: 29px 29px;
  animation: vt-loader-dot 1.4s var(--_easing) infinite;
}

.loader-v {
  fill: none;
  stroke: var(--_accent);
  stroke-width: 11;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 100;
  animation: vt-loader-v 1.4s var(--_easing) infinite;
}

.loader-label {
  font-size: var(--_font-size-small);
}

@keyframes vt-loader-in {
  to {
    opacity: 1;
  }
}

@keyframes vt-loader-v {
  0% {
    stroke-dashoffset: 100;
  }
  45%,
  70% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -100;
  }
}

@keyframes vt-loader-dot {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .loader {
    animation-duration: 0ms;
  }

  .loader-v,
  .loader-dot {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ---------- Full screen ---------- */

:host(:fullscreen) {
  display: block;
  width: 100%;
  height: 100%;
}

.vt[data-fullscreen] {
  height: 100%;
  border-radius: 0;
  border-width: 0;
}

/* Window mode: used where the Fullscreen API is not available. */
.vt[data-fullscreen='window'] {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  height: auto;
}

.vt[data-fullscreen] > .panel,
.vt[data-fullscreen] > .body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.vt[data-fullscreen] .body {
  flex: 1 1 auto;
  max-height: none;
}

.vt[data-fullscreen] .panel.split {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
}

.vt[data-fullscreen] .panel.split:is([data-preview='top'], [data-preview='bottom']) {
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
}

.vt[data-fullscreen] .panel.split > .body {
  height: auto;
  min-height: 0;
}
`;async function cr(t,e=document){if(navigator.clipboard&&window.isSecureContext)try{return await navigator.clipboard.writeText(t),!0}catch{}return To(t,e)}function To(t,e){let n=document.createElement("textarea");n.value=t,n.setAttribute("readonly",""),n.setAttribute("aria-hidden","true"),n.style.position="fixed",n.style.opacity="0",n.style.pointerEvents="none",(e instanceof Document?e.body:e).appendChild(n);try{return n.select(),document.execCommand("copy")}catch{return!1}finally{n.remove()}}function Ss(t,e,n="text/plain"){let r=new Blob([t],{type:`${n};charset=utf-8`}),s=URL.createObjectURL(r),i=document.createElement("a");i.href=s,i.download=e,i.rel="noopener",i.style.display="none",document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}var So=Object.freeze({theme:"auto",lightTheme:"light",darkTheme:"dark",lang:"en",maxSize:2097152,highlightLimit:3e5,maxDepth:512,fetchTimeout:15e3,languagesUrl:"",syntaxTheme:"",syntaxThemeDark:"",syntaxThemesUrl:"",vendorUrl:""}),kh=Object.freeze({maxSize:50*1024*1024,highlightLimit:5*1024*1024,maxDepth:1e4,fetchTimeout:12e4}),Ao={...So},As=new Set;function ee(){return Object.freeze({...Ao})}function Rs(t){return As.add(t),()=>As.delete(t)}function b(t,e={},...n){let r=document.createElement(t);if(e.class&&(r.className=e.class),e.part&&r.setAttribute("part",e.part),e.attrs)for(let[s,i]of Object.entries(e.attrs))i===!1||i===null||i===void 0||r.setAttribute(s,i===!0?"":String(i));if(e.text!==void 0&&(r.textContent=e.text),e.on)for(let[s,i]of Object.entries(e.on))r.addEventListener(s,i);return Ro(r,n),r}function Ro(t,e){for(let n of e)n==null||n===!1||t.append(typeof n=="string"?document.createTextNode(n):n)}var Ns=0;function _t(t){return Ns+=1,`vt-${t}-${Ns}`}function yn(t){let e=t.replace(/\r\n?/g,`
`).split(`
`);for(;e.length&&e[0].trim()==="";)e.shift();for(;e.length&&e[e.length-1].trim()==="";)e.pop();let n=1/0;for(let r of e){if(r.trim()==="")continue;let s=/^[ \t]*/.exec(r);if(n=Math.min(n,s?s[0].length:0),n===0)break}return!Number.isFinite(n)||n===0?e.join(`
`):e.map(r=>r.slice(n)).join(`
`)}function Cs(t,e){let n,r=(...s)=>{clearTimeout(n),n=setTimeout(()=>t(...s),e)};return r.cancel=()=>clearTimeout(n),r}var No=new Set(["http:","https:","mailto:","tel:"]),Co=/^data:image\/(?:png|gif|jpe?g|webp|avif);base64,[a-z0-9+/]+=*$/i;function zt(t,e={}){if(typeof t!="string")return!1;let n=t.replace(/^[\u0000- ]+|[\u0000- ]+$/g,"").replace(/[\t\n\r]/g,"");if(n===""||e.allowDataImage&&Co.test(n))return!0;let r=/^([a-z][a-z0-9+.-]*):/i.exec(n);return r?No.has(r[1].toLowerCase()+":"):!0}function $t(t){try{return new URL(t,document.baseURI).origin===location.origin}catch{return!1}}var oe=class extends Error{constructor(e,n={},r){super(e,r===void 0?void 0:{cause:r}),this.name="VitrineError",this.code=e,this.params=n}},Lo=new Set(["text/plain","text/markdown","text/x-markdown","application/json","text/json"]);function Ls(t){for(let r of Array.from(t.children)){let s=Oo(r);if(s!==null)return s}let e="";for(let r of Array.from(t.childNodes))r.nodeType===Node.TEXT_NODE||r.nodeType===Node.CDATA_SECTION_NODE?e+=r.nodeValue??"":r.nodeType===Node.ELEMENT_NODE&&(e+=r.textContent??"");let n=yn(e);return n===""?null:n}function Oo(t){if(t instanceof HTMLTemplateElement){let e=t.content.children.length>0;return yn(e?t.innerHTML:t.content.textContent??"")}return t instanceof HTMLScriptElement&&Lo.has(t.type.trim().toLowerCase())?yn(t.textContent??""):null}function xn(t,e){if(t.length>e)throw new oe("tooLarge",{size:t.length,limit:e})}async function Os(t,e){let n=Mo(t),r=$t(n.href);if(!r&&!e.allowRemote)throw new oe("remoteBlocked");let s=new AbortController,i=setTimeout(()=>s.abort(new oe("timeout")),e.timeout),a=()=>s.abort(e.signal?.reason);e.signal?.addEventListener("abort",a,{once:!0}),e.signal?.aborted&&a();try{let o=await fetch(n.href,{mode:r?"same-origin":"cors",credentials:"same-origin",redirect:"follow",referrerPolicy:"strict-origin-when-cross-origin",signal:s.signal});if(!o.ok)throw new oe("loadFailed",{url:Ms(n),reason:`HTTP ${o.status}`});let c=Number(o.headers.get("content-length"));if(Number.isFinite(c)&&c>e.maxSize*4)throw new oe("tooLarge",{size:c,limit:e.maxSize});return await Io(o,e.maxSize,s)}catch(o){throw Do(o,s.signal,n)}finally{clearTimeout(i),e.signal?.removeEventListener("abort",a)}}function Mo(t){let e;try{e=new URL(t.trim(),document.baseURI)}catch{throw new oe("unsafeUrl")}if(e.protocol!=="http:"&&e.protocol!=="https:")throw new oe("unsafeUrl");return e}async function Io(t,e,n){if(!t.body){let a=await t.text();return xn(a,e),a}let r=t.body.getReader(),s=new TextDecoder,i="";for(;;){let{done:a,value:o}=await r.read();if(a)break;if(i+=s.decode(o,{stream:!0}),i.length>e)throw n.abort(),new oe("tooLarge",{size:`> ${e}`,limit:e})}return i+=s.decode(),xn(i,e),i}function Do(t,e,n){if(t instanceof oe)return t;if(e.aborted&&e.reason instanceof oe)return e.reason;if(t instanceof DOMException&&t.name==="AbortError")return t;let r=t instanceof Error?t.message:String(t);return new oe("loadFailed",{url:Ms(n),reason:r},t)}function Ms(t){let e=t.origin===location.origin?t.pathname+t.search:t.href;return e.length>120?e.slice(0,119)+"\u2026":e}function Is(t){return t instanceof DOMException&&t.name==="AbortError"}var le=Object.freeze({READY:"vt-ready",COPY:"vt-copy",SEARCH:"vt-search",TAB_CHANGE:"vt-tab-change",INPUT:"vt-input",CHANGE:"vt-change",MODE_CHANGE:"vt-mode-change",TAG_ADD:"vt-tag-add",TAG_REMOVE:"vt-tag-remove",TAG_CREATE:"vt-tag-create",TAG_CLICK:"vt-tag-click",SORT:"vt-sort",FULLSCREEN_CHANGE:"vt-fullscreen-change",LAYOUT_CHANGE:"vt-layout-change",SELECT:"vt-select",TOGGLE:"vt-toggle",FILTER_CHANGE:"vt-filter-change",TYPING_END:"vt-typing-end",CHANGE_NAVIGATE:"vt-change-navigate",ERROR:"vt-error"});function ce(t,e,n){return t.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0,cancelable:!0}))}var zs=Object.freeze({copy:"Copy",copyCode:"Copy code",copied:"Copied",copyFailed:"Copy failed",copySource:"Copy source",download:"Download",search:"Search",searchPlaceholder:"Search\u2026",searchNext:"Next match",searchPrevious:"Previous match",searchClose:"Close search",searchCount:"{current} / {total}",searchCountCapped:"{current} / {total}+",searchNone:"No matches",searchResults:"{total} matches",wrap:"Toggle line wrap",showMore:"Show all {count} lines",preview:"Preview",source:"Source",split:"Split",swapPanes:"Swap panes",stackPanes:"Stack panes",syncScroll:"Sync scrolling",tabs:"View",actions:"Actions",toc:"Table of contents",anchor:"Link to this section",table:"Table",tree:"Tree",raw:"Raw",expandAll:"Expand all",collapseAll:"Collapse all",copyPath:"Copy path",copyValue:"Copy value",items:"{count} items",item:"1 item",keys:"{count} keys",key:"1 key",showMoreItems:"Show {count} more",showFullString:"Show full string ({count} characters)",truncated:"Partially expanded: too many nodes.",loading:"Loading\u2026",errorTitle:"Unable to display content",invalidJson:"Invalid JSON at line {line}, column {column}: {message}.",invalidJsonRaw:"Invalid JSON at line {line}, column {column} \u2014 showing raw text.",empty:"Nothing to display",tooLarge:"Content is too large ({size} characters, limit {limit}).",tooDeep:"Nesting is too deep (limit {limit}).",tooComplex:"This document is nested too deeply to display.",unserializable:"This value cannot be converted to JSON (circular reference or BigInt).",highlightSkipped:"Content is large: syntax highlighting is disabled.",loadFailed:'Could not load "{url}": {reason}',remoteBlocked:'Cross-origin URL blocked. Add the "allow-remote" attribute to allow it.',unsafeUrl:"URL blocked: only http(s) URLs can be loaded.",timeout:"Request timed out.",added:"Added",removed:"Removed",code:"Code",edit:"Edit",splitView:"Side by side",unifiedView:"Unified",diffStats:"+{added} \u2212{removed}",diffSimplified:"Many changes: the comparison is simplified to removed and added blocks.",noDifferences:"No differences",previousChange:"Previous change",nextChange:"Next change",changePosition:"{current} of {total}",changeTotal:"{count} changes",terminal:"Terminal",command:"Command",copyCommand:"Copy command",copyCommands:"Copy commands",replay:"Replay",showMoreLines:"Show {count} more lines",files:"Files",copyTree:"Copy tree",treeStats:"{folders} folders, {files} files",invalidTree:"This tree could not be read: {message}",treeTruncated:"Only the first {limit} entries are shown.",status_added:"added",status_removed:"removed",status_modified:"modified",status_highlighted:"highlighted",httpExchange:"Exchange",httpRequest:"Request",httpResponse:"Response",httpBody:"Body",httpHeaders:"Headers",httpQuery:"Query",httpNone:"None",httpNoBody:"No body",copyUrl:"Copy URL",codeLanguage:"Language",showSecrets:"Show secrets",hideSecrets:"Hide secrets",secretsShown:"Secrets shown",secretsHidden:"Secrets hidden",secretsInCode:"Credentials are masked in this code. Replace them with your own.",invalidHttp:"This HTTP message could not be read: {message}",log:"Log",followLog:"Follow new lines",levelToggle:"Show or hide {level} entries",logNoMatch:"No entry matches the filters.",chartView:"Chart",legend:"Legend",seriesToggle:"Show or hide {name}",copyData:"Copy data",chartSummary:"{type} with {series} series and {points} points.",chartRange:"{name} from {min} to {max}",chart_line:"Line chart",chart_area:"Area chart",chart_bar:"Bar chart",chart_pie:"Donut chart",chartError:"This data could not be charted: {message}",chartTruncated:"Only the first 5,000 points of each series are shown.",chartLoadFailed:"The chart library could not be loaded: {message}",openapiInvalid:"This API description could not be read: {message}",openapiYamlFailed:"The YAML reader could not be loaded: {message}",openapiTruncated:"Only the first 2,000 endpoints are shown.",openapiServers:"Servers",openapiAuth:"Authentication",openapiEndpoints:"Endpoints",openapiTags:"Tags",openapiAllTags:"All",openapiNoMatch:"No endpoint matches.",openapiDeprecated:"deprecated",openapiParameters:"Parameters",openapiName:"Name",openapiIn:"In",openapiType:"Type",openapiDescription:"Description",openapiRequired:"required",openapiRequestBody:"Request body",openapiResponses:"Responses",openapiExample:"Example",openapiExampleValue:"Example",unchangedLines:"Show {count} unchanged lines",copyPatch:"Copy patch",changes:"Changes",original:"Original",modified:"Modified",patch:"Patch",tags:"Tags",noTags:"No tags",addTag:"Add a tag",tagPlaceholder:"tag",suggestions:"Suggestions",createTag:'Create "{tag}"',removeTag:"Remove {tag}",tagAdded:"{tag} added",tagRemoved:"{tag} removed",pressAgainToRemove:"Press Backspace again to remove {tag}",tagDuplicate:"{tag} is already selected.",tagDisabled:"{tag} cannot be selected.",tagLimit:"You can select up to {max} tags.",tagNotAllowed:"{tag} is not in the list.",tagTooLong:"{tag} is too long.",tagInvalid:"{tag} is not a valid tag.",tagRefused:"{tag} was refused.",tagsRequired:"Select at least one tag.",tagCount:"{count} tags",tagCountOne:"1 tag",tagCountMax:"{count} / {max} tags",browseTags:"Browse all tags",otherTags:"Other",clearTags:"Remove all tags",filterTags:"Filter tags",tagsFound:"{count} tags",invalidTags:'The tags must be a JSON array, or an object with "value" and "options".',rowsRange:"Rows {from}\u2013{to} of {total}",noRows:"No rows",firstPage:"First page",previousPage:"Previous page",nextPage:"Next page",lastPage:"Last page",sortBy:"Sort by {name}",column:"Column {n}",rowNumber:"Row",csvStatus:"{rows} rows \xD7 {columns} columns",csvUnclosed:"Unclosed quote starting at line {line}.",tooManyColumns:"Only the first {limit} columns are shown.",matchingRows:"{count} matching rows",undo:"Undo",redo:"Redo",fullscreen:"Full screen",exitFullscreen:"Exit full screen",stopEditing:"Stop editing",editor:"Editor",validJson:"Valid JSON"}),Po=Object.freeze({copy:"Copier",copyCode:"Copier le code",copied:"Copi\xE9",copyFailed:"\xC9chec de la copie",copySource:"Copier la source",download:"T\xE9l\xE9charger",search:"Rechercher",searchPlaceholder:"Rechercher\u2026",searchNext:"R\xE9sultat suivant",searchPrevious:"R\xE9sultat pr\xE9c\xE9dent",searchClose:"Fermer la recherche",searchCount:"{current} / {total}",searchCountCapped:"{current} / {total}+",searchNone:"Aucun r\xE9sultat",searchResults:"{total} r\xE9sultats",wrap:"Activer/d\xE9sactiver le retour \xE0 la ligne",showMore:"Afficher les {count} lignes",preview:"Aper\xE7u",source:"Source",split:"C\xF4te \xE0 c\xF4te",swapPanes:"Inverser les panneaux",stackPanes:"Empiler les panneaux",syncScroll:"Synchroniser le d\xE9filement",tabs:"Affichage",actions:"Actions",toc:"Table des mati\xE8res",anchor:"Lien vers cette section",table:"Tableau",tree:"Arbre",raw:"Brut",expandAll:"Tout d\xE9plier",collapseAll:"Tout replier",copyPath:"Copier le chemin",copyValue:"Copier la valeur",items:"{count} \xE9l\xE9ments",item:"1 \xE9l\xE9ment",keys:"{count} cl\xE9s",key:"1 cl\xE9",showMoreItems:"Afficher {count} de plus",showFullString:"Afficher toute la cha\xEEne ({count} caract\xE8res)",truncated:"D\xE9pliage partiel : trop de n\u0153uds.",loading:"Chargement\u2026",errorTitle:"Impossible d\u2019afficher le contenu",invalidJson:"JSON invalide \xE0 la ligne {line}, colonne {column} : {message}.",invalidJsonRaw:"JSON invalide \xE0 la ligne {line}, colonne {column} \u2014 affichage du texte brut.",empty:"Rien \xE0 afficher",tooLarge:"Contenu trop volumineux ({size} caract\xE8res, limite {limit}).",tooDeep:"Imbrication trop profonde (limite {limit}).",tooComplex:"Ce document est trop imbriqu\xE9 pour \xEAtre affich\xE9.",unserializable:"Cette valeur ne peut pas \xEAtre convertie en JSON (r\xE9f\xE9rence circulaire ou BigInt).",highlightSkipped:"Contenu volumineux : coloration syntaxique d\xE9sactiv\xE9e.",loadFailed:"Impossible de charger \xAB {url} \xBB : {reason}",remoteBlocked:"URL d\u2019une autre origine bloqu\xE9e. Ajoutez l\u2019attribut \xAB allow-remote \xBB pour l\u2019autoriser.",unsafeUrl:"URL bloqu\xE9e : seules les URL http(s) peuvent \xEAtre charg\xE9es.",timeout:"D\xE9lai de la requ\xEAte d\xE9pass\xE9.",added:"Ajout\xE9",removed:"Supprim\xE9",code:"Code",edit:"Modifier",splitView:"C\xF4te \xE0 c\xF4te",unifiedView:"Unifi\xE9",diffStats:"+{added} \u2212{removed}",diffSimplified:"Beaucoup de changements : la comparaison est simplifi\xE9e en blocs retir\xE9s et ajout\xE9s.",noDifferences:"Aucune diff\xE9rence",previousChange:"Modification pr\xE9c\xE9dente",nextChange:"Modification suivante",changePosition:"{current} sur {total}",changeTotal:"Modifications : {count}",terminal:"Terminal",command:"Commande",copyCommand:"Copier la commande",copyCommands:"Copier les commandes",replay:"Rejouer",showMoreLines:"Afficher {count} lignes de plus",files:"Fichiers",copyTree:"Copier l'arborescence",treeStats:"{folders} dossiers, {files} fichiers",invalidTree:"Impossible de lire cette arborescence : {message}",treeTruncated:"Seules les {limit} premi\xE8res entr\xE9es sont affich\xE9es.",status_added:"ajout\xE9",status_removed:"supprim\xE9",status_modified:"modifi\xE9",status_highlighted:"mis en \xE9vidence",httpExchange:"\xC9change",httpRequest:"Requ\xEAte",httpResponse:"R\xE9ponse",httpBody:"Corps",httpHeaders:"En-t\xEAtes",httpQuery:"Param\xE8tres",httpNone:"Aucun",httpNoBody:"Pas de corps",copyUrl:"Copier l'URL",codeLanguage:"Langage",showSecrets:"Afficher les secrets",hideSecrets:"Masquer les secrets",secretsShown:"Secrets affich\xE9s",secretsHidden:"Secrets masqu\xE9s",secretsInCode:"Les identifiants sont masqu\xE9s dans ce code. Remplacez-les par les v\xF4tres.",invalidHttp:"Impossible de lire ce message HTTP : {message}",log:"Journal",followLog:"Suivre les nouvelles lignes",levelToggle:"Afficher ou masquer les entr\xE9es {level}",logNoMatch:"Aucune entr\xE9e ne correspond aux filtres.",chartView:"Graphique",legend:"L\xE9gende",seriesToggle:"Afficher ou masquer {name}",copyData:"Copier les donn\xE9es",chartSummary:"{type} avec {series} s\xE9ries et {points} points.",chartRange:"{name} de {min} \xE0 {max}",chart_line:"Graphique en courbes",chart_area:"Graphique en aires",chart_bar:"Graphique en barres",chart_pie:"Graphique en anneau",chartError:"Impossible de tracer ces donn\xE9es : {message}",chartTruncated:"Seuls les 5 000 premiers points de chaque s\xE9rie sont affich\xE9s.",chartLoadFailed:"Impossible de charger la biblioth\xE8que de graphiques : {message}",openapiInvalid:"Impossible de lire cette description d\u2019API : {message}",openapiYamlFailed:"Impossible de charger le lecteur YAML : {message}",openapiTruncated:"Seuls les 2 000 premiers points d\u2019acc\xE8s sont affich\xE9s.",openapiServers:"Serveurs",openapiAuth:"Authentification",openapiEndpoints:"Points d\u2019acc\xE8s",openapiTags:"Tags",openapiAllTags:"Tous",openapiNoMatch:"Aucun point d\u2019acc\xE8s ne correspond.",openapiDeprecated:"obsol\xE8te",openapiParameters:"Param\xE8tres",openapiName:"Nom",openapiIn:"Emplacement",openapiType:"Type",openapiDescription:"Description",openapiRequired:"requis",openapiRequestBody:"Corps de la requ\xEAte",openapiResponses:"R\xE9ponses",openapiExample:"Exemple",openapiExampleValue:"Exemple",unchangedLines:"Afficher {count} lignes inchang\xE9es",copyPatch:"Copier le patch",changes:"Modifications",original:"Original",modified:"Modifi\xE9",patch:"Patch",tags:"Tags",noTags:"Aucun tag",addTag:"Ajouter un tag",tagPlaceholder:"tag",suggestions:"Suggestions",createTag:"Cr\xE9er \xAB {tag} \xBB",removeTag:"Retirer {tag}",tagAdded:"{tag} ajout\xE9",tagRemoved:"{tag} retir\xE9",pressAgainToRemove:"Appuyez de nouveau sur Retour arri\xE8re pour retirer {tag}",tagDuplicate:"{tag} est d\xE9j\xE0 s\xE9lectionn\xE9.",tagDisabled:"{tag} ne peut pas \xEAtre s\xE9lectionn\xE9.",tagLimit:"Vous pouvez s\xE9lectionner jusqu\u2019\xE0 {max} tags.",tagNotAllowed:"{tag} n\u2019est pas dans la liste.",tagTooLong:"{tag} est trop long.",tagInvalid:"{tag} n\u2019est pas un tag valide.",tagRefused:"{tag} a \xE9t\xE9 refus\xE9.",tagsRequired:"S\xE9lectionnez au moins un tag.",tagCount:"{count} tags",tagCountOne:"1 tag",tagCountMax:"{count} / {max} tags",browseTags:"Parcourir tous les tags",otherTags:"Autres",clearTags:"Retirer tous les tags",filterTags:"Filtrer les tags",tagsFound:"{count} tags",invalidTags:"Les tags doivent \xEAtre un tableau JSON, ou un objet avec \xAB value \xBB et \xAB options \xBB.",rowsRange:"Lignes {from}\u2013{to} sur {total}",noRows:"Aucune ligne",firstPage:"Premi\xE8re page",previousPage:"Page pr\xE9c\xE9dente",nextPage:"Page suivante",lastPage:"Derni\xE8re page",sortBy:"Trier par {name}",column:"Colonne {n}",rowNumber:"Ligne",csvStatus:"{rows} lignes \xD7 {columns} colonnes",csvUnclosed:"Guillemet non ferm\xE9 \xE0 partir de la ligne {line}.",tooManyColumns:"Seules les {limit} premi\xE8res colonnes sont affich\xE9es.",matchingRows:"{count} lignes correspondantes",undo:"Annuler",redo:"R\xE9tablir",fullscreen:"Plein \xE9cran",exitFullscreen:"Quitter le plein \xE9cran",stopEditing:"Terminer la modification",editor:"\xC9diteur",validJson:"JSON valide"}),Ds=new Map([["en",zs],["fr",Po]]);var Ps=new Set;function $s(t){return Ps.add(t),()=>Ps.delete(t)}function ur(t){let e=Ds.get(t),n=Ds.get(String(t).split("-")[0]);return(r,s)=>{let i=e?.[r]??n?.[r]??zs[r]??String(r);return s?i.replace(/\{(\w+)\}/g,(a,o)=>Object.prototype.hasOwnProperty.call(s,o)?String(s[o]):a):i}}function kt(t,e){try{return new Intl.NumberFormat(e).format(t)}catch{return String(t)}}var Bs=`/* Vitrine Light \u2014 default light theme. Values: docs/DESIGN_SYSTEM.md \xA72. */
[data-theme='light'] {
  color-scheme: light;
  --vt-bg: #f3f4f1;
  --vt-surface: #ffffff;
  --vt-surface-sunken: #eaece7;
  --vt-surface-raised: #ffffff;
  --vt-border: #d6d9d2;
  --vt-border-strong: #b9beb4;
  --vt-fg: #11151c;
  --vt-fg-muted: #4a5260;
  --vt-accent: #14b8a6;
  --vt-accent-fg: #0a6e6f;
  --vt-on-accent: #11151c;
  --vt-accent-soft: rgba(20, 184, 166, 0.12);
  --vt-highlight: rgba(242, 169, 59, 0.35);
  --vt-highlight-current: rgba(242, 169, 59, 0.7);
  --vt-line-highlight: rgba(20, 184, 166, 0.1);
  --vt-success: #0a6e6f;
  --vt-warning: #a6510b;
  --vt-danger: #b2384f;
  --vt-info: #2f55c9;
  --vt-diff-added: rgba(20, 184, 166, 0.12);
  --vt-diff-removed: rgba(178, 56, 79, 0.12);
  --vt-shadow: 0 8px 24px rgba(17, 21, 28, 0.12);
  --vt-syntax-keyword: #7a3ec8;
  --vt-syntax-string: #0a6e6f;
  --vt-syntax-number: #a6510b;
  --vt-syntax-function: #2f55c9;
  --vt-syntax-type: #b2384f;
  --vt-syntax-comment: #5f6773;
  --vt-syntax-attr: #2f55c9;
  --vt-syntax-tag: #b2384f;
  --vt-syntax-meta: #4a5260;
}
`;var Us=`/* Vitrine Dark \u2014 default dark theme. Values: docs/DESIGN_SYSTEM.md \xA72. */
[data-theme='dark'] {
  color-scheme: dark;
  --vt-bg: #11151c;
  --vt-surface: #171c25;
  --vt-surface-sunken: #0c0f14;
  --vt-surface-raised: #1e2430;
  --vt-border: #262d3a;
  --vt-border-strong: #3a4354;
  --vt-fg: #e8eae6;
  --vt-fg-muted: #9aa3b2;
  --vt-accent: #14b8a6;
  --vt-accent-fg: #14b8a6;
  --vt-on-accent: #11151c;
  --vt-accent-soft: rgba(20, 184, 166, 0.16);
  --vt-highlight: rgba(242, 169, 59, 0.3);
  --vt-highlight-current: rgba(242, 169, 59, 0.6);
  --vt-line-highlight: rgba(20, 184, 166, 0.12);
  --vt-success: #14b8a6;
  --vt-warning: #f2a93b;
  --vt-danger: #ff8f73;
  --vt-info: #7c9cff;
  --vt-diff-added: rgba(20, 184, 166, 0.16);
  --vt-diff-removed: rgba(255, 143, 115, 0.14);
  --vt-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  --vt-syntax-keyword: #c4a5ff;
  --vt-syntax-string: #5eead4;
  --vt-syntax-number: #f2a93b;
  --vt-syntax-function: #7c9cff;
  --vt-syntax-type: #ff8f73;
  --vt-syntax-comment: #8a93a3;
  --vt-syntax-attr: #7c9cff;
  --vt-syntax-tag: #ff8f73;
  --vt-syntax-meta: #9aa3b2;
}
`;var Hs=`/* Vitrine Dim \u2014 softer, blue-grey dark theme for long reading sessions. */
[data-theme='dim'] {
  color-scheme: dark;
  --vt-bg: #1b2230;
  --vt-surface: #212a3a;
  --vt-surface-sunken: #192030;
  --vt-surface-raised: #29334a;
  --vt-border: #33405a;
  --vt-border-strong: #46557a;
  --vt-fg: #dce2ec;
  --vt-fg-muted: #a3adc0;
  --vt-accent: #14b8a6;
  --vt-accent-fg: #2dd4bf;
  --vt-on-accent: #11151c;
  --vt-accent-soft: rgba(45, 212, 191, 0.16);
  --vt-highlight: rgba(242, 169, 59, 0.3);
  --vt-highlight-current: rgba(242, 169, 59, 0.6);
  --vt-line-highlight: rgba(45, 212, 191, 0.12);
  --vt-success: #2dd4bf;
  --vt-warning: #f2a93b;
  --vt-danger: #ff9b82;
  --vt-info: #8faeff;
  --vt-diff-added: rgba(45, 212, 191, 0.16);
  --vt-diff-removed: rgba(255, 155, 130, 0.16);
  --vt-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  --vt-syntax-keyword: #c9aeff;
  --vt-syntax-string: #6ee7d5;
  --vt-syntax-number: #f5b85c;
  --vt-syntax-function: #8faeff;
  --vt-syntax-type: #ff9b82;
  --vt-syntax-comment: #95a0b5;
  --vt-syntax-attr: #8faeff;
  --vt-syntax-tag: #ff9b82;
  --vt-syntax-meta: #a3adc0;
}
`;var Fs=`/* Vitrine Paper \u2014 warm, low-glare light theme. */
[data-theme='paper'] {
  color-scheme: light;
  --vt-bg: #f4efe4;
  --vt-surface: #fbf8f1;
  --vt-surface-sunken: #f0e9da;
  --vt-surface-raised: #fffdf8;
  --vt-border: #ddd3c0;
  --vt-border-strong: #c3b79f;
  --vt-fg: #2b2620;
  --vt-fg-muted: #5c5347;
  --vt-accent: #14b8a6;
  --vt-accent-fg: #0a6566;
  --vt-on-accent: #11151c;
  --vt-accent-soft: rgba(20, 184, 166, 0.14);
  --vt-highlight: rgba(242, 169, 59, 0.38);
  --vt-highlight-current: rgba(242, 169, 59, 0.72);
  --vt-line-highlight: rgba(20, 184, 166, 0.11);
  --vt-success: #0a6566;
  --vt-warning: #974a09;
  --vt-danger: #a63148;
  --vt-info: #2b4fbd;
  --vt-diff-added: rgba(20, 184, 166, 0.14);
  --vt-diff-removed: rgba(166, 49, 72, 0.12);
  --vt-shadow: 0 8px 24px rgba(43, 38, 32, 0.12);
  --vt-syntax-keyword: #7239bd;
  --vt-syntax-string: #0a6566;
  --vt-syntax-number: #974a09;
  --vt-syntax-function: #2b4fbd;
  --vt-syntax-type: #a63148;
  --vt-syntax-comment: #6b6255;
  --vt-syntax-attr: #2b4fbd;
  --vt-syntax-tag: #a63148;
  --vt-syntax-meta: #5c5347;
}
`;var js=`/* Vitrine High Contrast \u2014 maximum legibility (WCAG AAA text contrast). */
[data-theme='high-contrast'] {
  color-scheme: dark;
  --vt-bg: #000000;
  --vt-surface: #000000;
  --vt-surface-sunken: #0a0a0a;
  --vt-surface-raised: #141414;
  --vt-border: #8a8a8a;
  --vt-border-strong: #ffffff;
  --vt-fg: #ffffff;
  --vt-fg-muted: #d6d6d6;
  --vt-accent: #2ee6d0;
  --vt-accent-fg: #5eead4;
  --vt-on-accent: #000000;
  --vt-accent-soft: rgba(46, 230, 208, 0.22);
  --vt-highlight: rgba(255, 214, 0, 0.35);
  --vt-highlight-current: rgba(255, 214, 0, 0.55);
  --vt-line-highlight: rgba(46, 230, 208, 0.18);
  --vt-success: #5eead4;
  --vt-warning: #ffd166;
  --vt-danger: #ffa08a;
  --vt-info: #a8c1ff;
  --vt-diff-added: rgba(46, 230, 208, 0.22);
  --vt-diff-removed: rgba(255, 160, 138, 0.24);
  --vt-shadow: 0 0 0 1px #ffffff;
  --vt-syntax-keyword: #dcc2ff;
  --vt-syntax-string: #7cf5e0;
  --vt-syntax-number: #ffd166;
  --vt-syntax-function: #a8c1ff;
  --vt-syntax-type: #ffb3a1;
  --vt-syntax-comment: #c8c8c8;
  --vt-syntax-attr: #a8c1ff;
  --vt-syntax-tag: #ffb3a1;
  --vt-syntax-meta: #e0e0e0;
}
`;var jh=Object.freeze(["bg","surface","surface-sunken","surface-raised","border","border-strong","fg","fg-muted","accent","accent-fg","on-accent","accent-soft","highlight","highlight-current","line-highlight","success","warning","danger","info","diff-added","diff-removed","shadow","syntax-keyword","syntax-string","syntax-number","syntax-function","syntax-type","syntax-comment","syntax-attr","syntax-tag","syntax-meta"]),tt=new Map,et=new CSSStyleSheet;function Fo(t){let e=/\[data-theme='([a-z0-9-]+)'\]/.exec(t)?.[1];if(!e)throw new Error("[vitrine] Theme file without a [data-theme] selector.");let n=/color-scheme:\s*(light|dark)\s*;/.exec(t)?.[1]==="dark"?"dark":"light",r={};for(let[,s,i]of t.matchAll(/--vt-([a-z0-9-]+)\s*:\s*([^;]+);/g))r[s]=i.trim();return{name:e,definition:{colorScheme:n,tokens:r}}}for(let t of[Bs,Us,Hs,Fs,js]){let{name:e,definition:n}=Fo(t);tt.set(e,n)}var qh=Object.freeze([...tt.keys()]);function qs(t){let e=tt.get(t);return e?{colorScheme:e.colorScheme,tokens:{...e.tokens}}:void 0}function jo(){for(;et.cssRules.length;)et.deleteRule(0);for(let[t,e]of tt){let n=et.insertRule(`.vt[data-theme="${t}"] {}`,et.cssRules.length),r=et.cssRules[n].style;r.setProperty("color-scheme",e.colorScheme);for(let[s,i]of Object.entries(e.tokens))r.setProperty(`--_${s}`,`var(--vt-${s}, ${i})`)}}jo();var hr=typeof matchMedia=="function"?matchMedia("(prefers-color-scheme: dark)"):null,dr=new Set;function qo(){for(let t of dr)t()}hr?.addEventListener?.("change",qo);function Gs(t){return dr.add(t),()=>dr.delete(t)}function Ws(t){let e=ee(),n=t?.trim().toLowerCase()||e.theme;if(n!=="auto"&&!tt.has(n)&&(n=tt.has(e.theme)?e.theme:"auto"),n!=="auto")return n;let r=hr?.matches?e.darkTheme:e.lightTheme;return tt.has(r)?r:hr?.matches?"dark":"light"}var Go="",Wo="";function Vs(){return Go}function Ks(){return Wo}var Ys=Object.freeze({"1c-light":0,"a11y-dark":1,"a11y-light":0,agate:1,"an-old-hope":1,androidstudio:1,"arduino-light":0,arta:1,ascetic:0,"atom-one-dark":1,"atom-one-dark-reasonable":1,"atom-one-light":0,"base16-3024":1,"base16-apathy":1,"base16-apprentice":1,"base16-ashes":1,"base16-atelier-cave":1,"base16-atelier-cave-light":0,"base16-atelier-dune":1,"base16-atelier-dune-light":0,"base16-atelier-estuary":1,"base16-atelier-estuary-light":0,"base16-atelier-forest":1,"base16-atelier-forest-light":0,"base16-atelier-heath":1,"base16-atelier-heath-light":0,"base16-atelier-lakeside":1,"base16-atelier-lakeside-light":0,"base16-atelier-plateau":1,"base16-atelier-plateau-light":0,"base16-atelier-savanna":1,"base16-atelier-savanna-light":0,"base16-atelier-seaside":1,"base16-atelier-seaside-light":0,"base16-atelier-sulphurpool":1,"base16-atelier-sulphurpool-light":0,"base16-atlas":1,"base16-bespin":1,"base16-black-metal":1,"base16-black-metal-bathory":1,"base16-black-metal-burzum":1,"base16-black-metal-dark-funeral":1,"base16-black-metal-gorgoroth":1,"base16-black-metal-immortal":1,"base16-black-metal-khold":1,"base16-black-metal-marduk":1,"base16-black-metal-mayhem":1,"base16-black-metal-nile":1,"base16-black-metal-venom":1,"base16-brewer":1,"base16-bright":1,"base16-brogrammer":1,"base16-brush-trees":0,"base16-brush-trees-dark":1,"base16-chalk":1,"base16-circus":1,"base16-classic-dark":1,"base16-classic-light":0,"base16-codeschool":1,"base16-colors":1,"base16-cupcake":0,"base16-cupertino":0,"base16-danqing":1,"base16-darcula":1,"base16-dark-violet":1,"base16-darkmoss":1,"base16-darktooth":1,"base16-decaf":1,"base16-default-dark":1,"base16-default-light":0,"base16-dirtysea":0,"base16-dracula":1,"base16-edge-dark":1,"base16-edge-light":0,"base16-eighties":1,"base16-embers":1,"base16-equilibrium-dark":1,"base16-equilibrium-gray-dark":1,"base16-equilibrium-gray-light":0,"base16-equilibrium-light":0,"base16-espresso":1,"base16-eva":1,"base16-eva-dim":1,"base16-flat":1,"base16-framer":1,"base16-fruit-soda":0,"base16-gigavolt":1,"base16-github":0,"base16-google-dark":1,"base16-google-light":0,"base16-grayscale-dark":1,"base16-grayscale-light":0,"base16-green-screen":1,"base16-gruvbox-dark-hard":1,"base16-gruvbox-dark-medium":1,"base16-gruvbox-dark-pale":1,"base16-gruvbox-dark-soft":1,"base16-gruvbox-light-hard":0,"base16-gruvbox-light-medium":0,"base16-gruvbox-light-soft":0,"base16-hardcore":1,"base16-harmonic16-dark":1,"base16-harmonic16-light":0,"base16-heetch-dark":1,"base16-heetch-light":0,"base16-helios":1,"base16-hopscotch":1,"base16-horizon-dark":1,"base16-horizon-light":0,"base16-humanoid-dark":1,"base16-humanoid-light":0,"base16-ia-dark":1,"base16-ia-light":0,"base16-icy-dark":1,"base16-ir-black":1,"base16-isotope":1,"base16-kimber":1,"base16-london-tube":1,"base16-macintosh":1,"base16-marrakesh":1,"base16-materia":1,"base16-material":1,"base16-material-darker":1,"base16-material-lighter":0,"base16-material-palenight":1,"base16-material-vivid":1,"base16-mellow-purple":1,"base16-mexico-light":0,"base16-mocha":1,"base16-monokai":1,"base16-nebula":1,"base16-nord":1,"base16-nova":1,"base16-ocean":1,"base16-oceanicnext":1,"base16-one-light":0,"base16-onedark":1,"base16-outrun-dark":1,"base16-papercolor-dark":1,"base16-papercolor-light":0,"base16-paraiso":1,"base16-pasque":1,"base16-phd":1,"base16-pico":1,"base16-pop":1,"base16-porple":1,"base16-qualia":1,"base16-railscasts":1,"base16-rebecca":1,"base16-ros-pine":1,"base16-ros-pine-dawn":0,"base16-ros-pine-moon":1,"base16-sagelight":0,"base16-sandcastle":1,"base16-seti-ui":1,"base16-shapeshifter":0,"base16-silk-dark":1,"base16-silk-light":0,"base16-snazzy":1,"base16-solar-flare":1,"base16-solar-flare-light":0,"base16-solarized-dark":1,"base16-solarized-light":0,"base16-spacemacs":1,"base16-summercamp":1,"base16-summerfruit-dark":1,"base16-summerfruit-light":0,"base16-synth-midnight-terminal-dark":1,"base16-synth-midnight-terminal-light":0,"base16-tango":1,"base16-tender":1,"base16-tomorrow":0,"base16-tomorrow-night":1,"base16-twilight":1,"base16-unikitty-dark":1,"base16-unikitty-light":0,"base16-vulcan":1,"base16-windows-10":1,"base16-windows-10-light":0,"base16-windows-95":1,"base16-windows-95-light":0,"base16-windows-high-contrast":1,"base16-windows-high-contrast-light":0,"base16-windows-nt":1,"base16-windows-nt-light":0,"base16-woodland":1,"base16-xcode-dusk":1,"base16-zenburn":1,"brown-paper":0,"codepen-embed":1,"color-brewer":0,"cybertopia-cherry":0,"cybertopia-dimmer":0,"cybertopia-icecap":0,"cybertopia-saturated":0,dark:1,default:0,devibeans:1,docco:0,equinox:0,far:1,felipec:1,foundation:0,github:0,"github-dark":1,"github-dark-dimmed":1,gml:1,googlecode:0,"gradient-dark":1,"gradient-light":0,grayscale:0,hybrid:1,idea:0,"intellij-light":0,"ir-black":1,"isbl-editor-dark":1,"isbl-editor-light":0,"kimbie-dark":1,"kimbie-light":0,lightfair:0,lioshi:1,magula:0,"mono-blue":0,monokai:1,"monokai-sublime":1,"night-owl":1,"nnfx-dark":1,"nnfx-light":0,nord:1,obsidian:1,"panda-syntax-dark":1,"panda-syntax-light":0,"paraiso-dark":1,"paraiso-light":0,pojoaque:0,purebasic:0,"qtcreator-dark":1,"qtcreator-light":0,rainbow:1,"rose-pine":1,"rose-pine-dawn":0,"rose-pine-moon":1,routeros:0,"school-book":0,"shades-of-purple":1,srcery:1,"stackoverflow-dark":1,"stackoverflow-light":0,sunburst:1,"tokyo-night-dark":1,"tokyo-night-light":0,"tomorrow-night-blue":1,"tomorrow-night-bright":1,vs:0,"vs-dark":1,vs2015:1,xcode:0,xt256:1});var pr=new Map,Xs=new Map;function Zs(t){if(typeof t!="string")return null;let e=t.trim().toLowerCase().replace(/\//g,"-");return!e||e.length>60?null:Object.prototype.hasOwnProperty.call(Ys,e)?e:null}function Js(t){return Xs.get(t)}function Qs(t){let e=pr.get(t);if(e)return e;let n=Vo(t);return pr.set(t,n),n}async function Vo(t){let e=ee().syntaxThemesUrl||Ks();if(!e)return null;try{let n=new URL(`${t}.css`,new URL(e.endsWith("/")?e:`${e}/`,document.baseURI));if(n.protocol!=="https:"&&n.protocol!=="http:")return null;let r=await fetch(n.href,{credentials:"same-origin"});if(!r.ok)throw new Error(`HTTP ${r.status}`);let s=await r.text(),i=new CSSStyleSheet;return i.replaceSync(s),Xs.set(t,i),i}catch(n){return console.warn(`[vitrine] Could not load the "${t}" syntax theme.`,n),pr.delete(t),null}}var ei="http://www.w3.org/2000/svg";var Bt=["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],Ut=["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],Ko={copy:[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]],check:[["path",{d:"M20 6 9 17l-5-5"}]],search:[["path",{d:"m21 21-4.34-4.34"}],["circle",{cx:"11",cy:"11",r:"8"}]],"chevron-up":[["path",{d:"m18 15-6-6-6 6"}]],"chevron-down":[["path",{d:"m6 9 6 6 6-6"}]],"chevron-right":[["path",{d:"m9 18 6-6-6-6"}]],wrap:[["path",{d:"m16 16-3 3 3 3"}],["path",{d:"M3 12h14.5a1 1 0 0 1 0 7H13"}],["path",{d:"M3 19h6"}],["path",{d:"M3 5h18"}]],download:[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]],"expand-all":[["path",{d:"m7 15 5 5 5-5"}],["path",{d:"m7 9 5-5 5 5"}]],"collapse-all":[["path",{d:"m7 20 5-5 5 5"}],["path",{d:"m7 4 5 5 5-5"}]],link:[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"}]],eye:[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{cx:"12",cy:"12",r:"3"}]],code:[["path",{d:"m16 18 6-6-6-6"}],["path",{d:"m8 6-6 6 6 6"}]],columns:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M12 3v18"}]],list:[["path",{d:"M3 5h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 19h.01"}],["path",{d:"M8 5h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 19h13"}]],pencil:[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]],"chevron-left":[["path",{d:"m15 18-6-6 6-6"}]],"chevrons-left":[["path",{d:"m11 17-5-5 5-5"}],["path",{d:"m18 17-5-5 5-5"}]],"chevrons-right":[["path",{d:"m6 17 5-5-5-5"}],["path",{d:"m13 17 5-5-5-5"}]],sort:[["path",{d:"m21 16-4 4-4-4"}],["path",{d:"M17 20V4"}],["path",{d:"m3 8 4-4 4 4"}],["path",{d:"M7 4v16"}]],"sort-up":[["path",{d:"m5 12 7-7 7 7"}],["path",{d:"M12 19V5"}]],"sort-down":[["path",{d:"M12 5v14"}],["path",{d:"m19 12-7 7-7-7"}]],table:[["path",{d:"M12 3v18"}],["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M3 9h18"}],["path",{d:"M3 15h18"}]],undo:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]],redo:[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]],maximize:[["path",{d:"M15 3h6v6"}],["path",{d:"m21 3-7 7"}],["path",{d:"m3 21 7-7"}],["path",{d:"M9 21H3v-6"}]],minimize:[["path",{d:"m14 10 7-7"}],["path",{d:"M20 10h-6V4"}],["path",{d:"m3 21 7-7"}],["path",{d:"M4 14h6v6"}]],swap:[["path",{d:"M8 3 4 7l4 4"}],["path",{d:"M4 7h16"}],["path",{d:"m16 21 4-4-4-4"}],["path",{d:"M20 17H4"}]],rows:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M3 12h18"}]],"sync-scroll":[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12"}]],alert:[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]],close:[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]],replay:[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}]],chart:[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16"}],["path",{d:"m19 9-5 5-4-4-3 3"}]],follow:[["path",{d:"M12 17V3"}],["path",{d:"m6 11 6 6 6-6"}],["path",{d:"M19 21H5"}]],terminal:[["path",{d:"M12 19h8"}],["path",{d:"m4 17 6-6-6-6"}]],folder:[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"}]],"folder-open":[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]],file:[Bt,Ut],"file-code":[Bt,Ut,["path",{d:"m10 13-2 2 2 2"}],["path",{d:"m14 17 2-2-2-2"}]],"file-text":[Bt,Ut,["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]],"file-image":[Bt,Ut,["circle",{cx:"10",cy:"12",r:"2"}],["path",{d:"m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22"}]],"file-data":[Bt,Ut,["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"}]],lock:[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4"}]],"eye-off":[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{d:"m2 2 20 20"}]]};function ve(t){let e=document.createElementNS(ei,"svg");e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.setAttribute("stroke","currentColor"),e.setAttribute("stroke-width","2.1"),e.setAttribute("stroke-linecap","round"),e.setAttribute("stroke-linejoin","round"),e.setAttribute("aria-hidden","true"),e.setAttribute("focusable","false"),e.setAttribute("class","icon");for(let[n,r]of Ko[t]??[]){let s=document.createElementNS(ei,n);for(let[i,a]of Object.entries(r))s.setAttribute(i,a);e.append(s)}return e}var fr=new WeakMap,Ht=null;function Yo(){return Ht||typeof IntersectionObserver>"u"||(Ht=new IntersectionObserver(t=>{for(let e of t)e.isIntersecting&&vn(e.target)},{rootMargin:"600px 0px"})),Ht}function ti(t,e){fr.set(t,e);let n=Yo();n?n.observe(t):vn(t)}function vn(t){let e=fr.get(t);e&&(fr.delete(t),Ht?.unobserve(t),e())}function ni(t){for(let e of Array.from(t.querySelectorAll(".chunk[data-pending]")))vn(e)}function ri(t,e){for(let n of Array.from(t.querySelectorAll(".chunk[data-pending]"))){let r=Number(n.getAttribute("data-first")),s=Number(n.getAttribute("data-count"));if(e>=r&&e<r+s){vn(n);break}}return t.querySelector(`.line[data-line="${e}"]`)}var wn=5e3,_n=200;function Xo(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Zo(t,e,n=wn){let r=[];if(!e)return{starts:r,capped:!1};let s=new RegExp(Xo(e),"gi"),i;for(;(i=s.exec(t))!==null;){if(r.length===n)return{starts:r,capped:!0};r.push(i.index),i[0].length===0&&(s.lastIndex+=1)}return{starts:r,capped:!1}}var Pe=class{constructor(e,n={}){this.root=e,this.skip=n.skip??"",this.matches=[],this.current=-1}run(e){this.clear();let n=e.slice(0,_n);if(!n)return{total:0,capped:!1};ni(this.root);let{nodes:r,starts:s,text:i}=this.collectText(),{starts:a,capped:o}=Zo(i,n),c=a.map(()=>[]);for(let u=a.length-1;u>=0;u-=1){let d=a[u],p=d+n.length,y=Jo(s,p-1);for(;y>=0&&s[y]+(r[y].nodeValue??"").length>d;){let v=s[y],_=Math.max(d,v)-v,C=Math.min(p,v+(r[y].nodeValue??"").length)-v;C>_&&c[u].unshift(Qo(r[y],_,C,u)),y-=1}}return this.matches=c,{total:c.length,capped:o}}collectText(){let e=this.skip,n=document.createTreeWalker(this.root,NodeFilter.SHOW_TEXT,{acceptNode(o){let c=o.parentElement;return e&&c&&c.closest(e)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}}),r=[],s=[],i=[],a=0;for(let o=n.nextNode();o;o=n.nextNode()){let c=o.nodeValue??"";c&&(r.push(o),s.push(a),i.push(c),a+=c.length)}return{nodes:r,starts:s,text:i.join("")}}go(e){if(!this.matches.length)return null;let n=this.matches.length,r=(e%n+n)%n;for(let s of this.matches[this.current]??[])s.classList.remove("current");this.current=r;for(let s of this.matches[r])s.classList.add("current");return this.matches[r][0]??null}unsetCurrent(){for(let e of this.matches[this.current]??[])e.classList.remove("current");this.current=-1}clear(){let e=new Set;for(let n of this.matches)for(let r of n){let s=r.parentNode;s&&(r.replaceWith(...Array.from(r.childNodes)),e.add(s))}for(let n of e)n.normalize();this.matches=[],this.current=-1}};function Jo(t,e){let n=0,r=t.length-1;for(;n<r;){let s=n+r+1>>1;t[s]<=e?n=s:r=s-1}return n}function Qo(t,e,n,r){let s=t.splitText(e);s.splitText(n-e);let i=document.createElement("mark");return i.className="match",i.setAttribute("part","match"),i.dataset.match=String(r),s.replaceWith(i),i.appendChild(s),i}function si(t,e){let n=[];return{run(r){let s=!1;return n=t.map(i=>{let a=i.run(r);return s||=a.capped,a.total}),{total:n.reduce((i,a)=>i+a,0),capped:s}},go(r){let s=r;for(let i=0;i<t.length;i+=1){if(s<n[i]){for(let o of t)o!==t[i]&&o.unsetCurrent();let a=t[i].go(s);a&&e(a);return}s-=n[i]}},clear(){for(let r of t)r.clear()}}}function ie(t){let e=b("button",{class:"btn",part:`button${t.part?` ${t.part}`:""}`,attrs:{type:"button","aria-label":t.label,title:t.label,"aria-pressed":t.pressed===void 0?null:String(t.pressed),"data-focus-key":t.key},on:{click:t.onClick}});return e.append(ve(t.icon)),e}function ai(t,e,n){let r=t.querySelector("svg");r&&(r.replaceWith(ve(n?"check":"alert")),t.classList.toggle("done",n),setTimeout(()=>{t.querySelector("svg")?.replaceWith(ve(e)),t.classList.remove("done")},1500))}var kn=class{constructor(e,n,r=""){this.t=e,this.handlers=n,this.total=0,this.capped=!1,this.index=-1;let s=_t("search");this.input=b("input",{class:"search-input",part:"search-input",attrs:{id:s,type:"search",placeholder:e("searchPlaceholder"),"aria-label":e("search"),maxlength:_n,autocomplete:"off",spellcheck:"false",enterkeyhint:"search","data-focus-key":"search-input"}}),this.input.value=r.slice(0,_n),this.count=b("span",{class:"search-count",part:"search-count",attrs:{"aria-hidden":"true"}});let i=ie({icon:"chevron-up",label:e("searchPrevious"),onClick:()=>this.step(-1),key:"search-prev"}),a=ie({icon:"chevron-down",label:e("searchNext"),onClick:()=>this.step(1),key:"search-next"}),o=ie({icon:"close",label:e("searchClose"),onClick:()=>n.onClose(),key:"search-close"});this.element=b("div",{class:"search",part:"search",attrs:{role:"search"}},this.input,this.count,i,a,o);let c=Cs(()=>this.run(),150);this.input.addEventListener("input",c),this.input.addEventListener("keydown",u=>{u.key==="Enter"?(u.preventDefault(),c.cancel(),this.input.value!==this.lastQuery?this.run():this.step(u.shiftKey?-1:1)):u.key==="Escape"&&(u.preventDefault(),u.stopPropagation(),this.input.value?(this.input.value="",this.run()):n.onClose())}),this.lastQuery=void 0}run(){let e=this.input.value;this.lastQuery=e;let{total:n,capped:r}=this.handlers.run(e);this.total=n,this.capped=r,this.index=-1,n>0?this.step(1):this.updateCount(),this.handlers.onResult?.(e,n,r)}step(e){this.total&&(this.index=((this.index+e)%this.total+this.total)%this.total,this.handlers.go(this.index),this.updateCount())}updateCount(){if(!this.input.value)this.count.textContent="";else if(!this.total)this.count.textContent=this.t("searchNone");else{let e=this.capped?"searchCountCapped":"searchCount";this.count.textContent=this.t(e,{current:this.index+1,total:this.total})}}focus(){this.input.focus(),this.input.select()}};function En({tabs:t,selected:e,label:n,onSelect:r,panelId:s}){let i=b("div",{class:"tabs",part:"tabs",attrs:{role:"tablist","aria-label":n}}),a=t.map(o=>{let c=o.id===e;return b("button",{class:"tab",part:c?"tab tab-active":"tab",attrs:{type:"button",role:"tab","aria-selected":String(c),"aria-controls":s,tabindex:c?"0":"-1","data-tab":o.id,"data-focus-key":`tab-${o.id}`},on:{click:()=>r(o.id)}},o.icon?ve(o.icon):null,o.label)});return i.append(...a),i.addEventListener("keydown",o=>{let c=a.findIndex(d=>d===o.target);if(c<0)return;let u=-1;o.key==="ArrowRight"?u=(c+1)%a.length:o.key==="ArrowLeft"?u=(c-1+a.length)%a.length:o.key==="Home"?u=0:o.key==="End"&&(u=a.length-1),!(u<0)&&(o.preventDefault(),r(t[u].id))}),i}function oi(t){return b("div",{class:"loader",part:"loading",attrs:{role:"status"}},el(),b("span",{class:"loader-label",text:t("loading")}))}var ii="http://www.w3.org/2000/svg";function el(){let t=document.createElementNS(ii,"svg");t.setAttribute("viewBox","0 0 120 120"),t.setAttribute("class","loader-mark"),t.setAttribute("aria-hidden","true"),t.setAttribute("focusable","false");let e=[["rect",{class:"loader-frame",x:"12",y:"16",width:"96",height:"88",rx:"18"}],["path",{class:"loader-frame",d:"M12 42 L108 42"}],["circle",{class:"loader-dot",cx:"29",cy:"29",r:"5"}],["path",{class:"loader-v",d:"M42 60 L60 86 L78 60",pathLength:"100"}]];for(let[n,r]of e){let s=document.createElementNS(ii,n);for(let[i,a]of Object.entries(r))s.setAttribute(i,a);t.append(s)}return t}function Et(t,e){return b("div",{class:"message",part:"error",attrs:{role:"alert"}},ve("alert"),b("div",{},b("p",{class:"message-title",text:t}),e?b("p",{class:"message-detail",text:e}):null))}function gr(t){return b("div",{class:"notice",part:"notice",attrs:{role:"note"}},ve("alert"),b("span",{text:t}))}function li(t){return b("div",{class:"empty",part:"empty",text:t("empty")})}var ci=new Map;function Tn(t){let e=ci.get(t);return e||(e=new CSSStyleSheet,e.replaceSync(t),ci.set(t,e)),e}var tl=Object.freeze(["variant","theme","src","allow-remote","max-height","copy","search","download","header","dot","title","label","lang-ui","mode","edit-toggle","placeholder","syntax-theme","syntax-theme-dark","badge","history","fullscreen","status"]),Tt=class extends HTMLElement{static type="base";static componentAttributes=[];static presets={simple:{},full:{}};static allowEmpty=!1;static keepCarriageReturns=!1;static upgradeProperties=["content"];static styles=[];static get observedAttributes(){return[...tl,...this.componentAttributes]}constructor(){super(),this.root=this.attachShadow({mode:"open"}),this.frame=b("div",{class:"vt",part:"container"}),this.syntaxTheme=null,this.updateSheets(null),this.live=b("div",{class:"sr-only",attrs:{"aria-live":"polite","aria-atomic":"true"}}),this.root.append(this.frame,this.live),this._content=void 0,this.text=null,this.error=null,this.loading=!1,this.searchOpen=!1,this.searchQuery="",this.searchBar=null,this.t=ur("en"),this._loadToken=0,this._abort=null,this._renderQueued=!1,this._readyPending=!1,this._cleanups=[],this._observer=null,this._connected=!1,this.modeState=null,this.editHistory=null,this._historyCleanup=null,this._escapeFullscreen=null}get content(){return this.text??""}set content(e){let n=e==null?void 0:String(e);n!==void 0&&n===this._content&&n===this.text||(this._content=n,this._connected&&this.reload())}upgradeProperty(e){if(Object.prototype.hasOwnProperty.call(this,e)){let n=this[e];delete this[e],this[e]=n}}connectedCallback(){for(let n of this.constructor.upgradeProperties)this.upgradeProperty(n);this._cleanups.push(Rs(n=>n.has("maxSize")?this.reload():this.requestRender()),Gs(()=>this.applyTheme()),$s(()=>this.requestRender())),this._observer=new MutationObserver(()=>{this._content===void 0&&!this.hasAttribute("src")&&this.reload()}),this._observer.observe(this,{childList:!0,characterData:!0,subtree:!0});let e=()=>{document.fullscreenElement===this?this.setFullscreen("native"):this.frame.dataset.fullscreen==="native"&&this.setFullscreen(null)};document.addEventListener("fullscreenchange",e),this._cleanups.push(()=>document.removeEventListener("fullscreenchange",e)),this._connected=!0,this.reload()}disconnectedCallback(){this._connected=!1;for(let e of this._cleanups.splice(0))e();this._observer?.disconnect(),this._observer=null,this._abort?.abort(),this._abort=null}attributeChangedCallback(e,n,r){n===r||!this.isConnected||(e==="mode"&&(this.modeState=null),e==="src"||e==="allow-remote"?this.reload():e==="theme"?this.applyTheme():this.requestRender())}reload(){let e=++this._loadToken;this._abort?.abort(),this._abort=null;let n=ee(),r=this.getAttribute("src");if(this._content!==void 0)this.setText(this._content);else if(r!==null&&r.trim()!==""){this.loading=!0,this.error=null,this.requestRender();let s=new AbortController;this._abort=s,Os(r,{allowRemote:De(this.getAttribute("allow-remote"))===!0,maxSize:n.maxSize,timeout:n.fetchTimeout,signal:s.signal}).then(i=>e===this._loadToken&&this.setText(i),i=>e===this._loadToken&&!Is(i)&&this.setError(i))}else this.setText(this.readInline()??"")}setText(e){this.loading=!1,this.editHistory=null;try{xn(e,ee().maxSize)}catch(r){this.setError(r);return}let n=this.constructor;this.text=e.replace(n.keepCarriageReturns?/\r\n/g:/\r\n?/g,`
`),this.error=null,this.contentChanged(),this._readyPending=!0,this.requestRender()}setError(e){this.loading=!1,this._readyPending=!1,this.error=e,this.text=null,this.contentChanged(),this.requestRender();let{title:n,detail:r}=this.describeError(e);ce(this,le.ERROR,{message:r||n,cause:e})}describeError(e){let n=this.t;if(e instanceof oe){let r={...e.params};for(let s of["size","limit"])typeof r[s]=="number"&&(r[s]=kt(Number(r[s]),this.locale));return{title:n("errorTitle"),detail:n(e.code,r)}}return{title:n("errorTitle"),detail:e instanceof Error?e.message:String(e)}}get editing(){return(this.modeState??Ne(this.getAttribute("mode"),["view","edit"],"view"))==="edit"}edited(e){this.text=e,this._content=e,this.contentEdited(e),ce(this,le.INPUT,{value:e})}contentEdited(e){}historyButtons(e){if(this.editHistory=e.history,De(this.getAttribute("history"))===!1)return[];let n=ie({icon:"undo",label:this.t("undo"),key:"undo",part:"undo-button",onClick:()=>e.undo()}),r=ie({icon:"redo",label:this.t("redo"),key:"redo",part:"redo-button",onClick:()=>e.redo()}),s=()=>{n.disabled=!e.history.canUndo,r.disabled=!e.history.canRedo};return s(),this._historyCleanup?.(),this._historyCleanup=e.history.subscribe(s),[n,r]}fullscreenButton(){if(!this.feature("fullscreen"))return null;let e=!!this.frame.dataset.fullscreen;return ie({icon:e?"minimize":"maximize",label:this.t(e?"exitFullscreen":"fullscreen"),key:"fullscreen",part:"fullscreen-button",pressed:e,onClick:()=>this.toggleFullscreen()})}async toggleFullscreen(){let e=this.frame.dataset.fullscreen;if(e==="native"){await document.exitFullscreen?.().catch(()=>{});return}if(e==="window"){this.setFullscreen(null);return}if(document.fullscreenEnabled&&this.requestFullscreen)try{await this.requestFullscreen({navigationUI:"hide"});return}catch{}this.setFullscreen("window")}setFullscreen(e){e?this.frame.dataset.fullscreen=e:delete this.frame.dataset.fullscreen,e==="window"?(this._escapeFullscreen=n=>{n.key==="Escape"&&!n.defaultPrevented&&this.setFullscreen(null)},this.frame.addEventListener("keydown",this._escapeFullscreen)):this._escapeFullscreen&&(this.frame.removeEventListener("keydown",this._escapeFullscreen),this._escapeFullscreen=null),this.render(),this.root.querySelector('[data-focus-key="fullscreen"]')?.focus(),ce(this,le.FULLSCREEN_CHANGE,{fullscreen:!!e})}editToggleButton(){return this.feature("edit-toggle")?ie({icon:this.editing?"eye":"pencil",label:this.t(this.editing?"stopEditing":"edit"),key:"edit-toggle",part:"edit-button",pressed:this.editing,onClick:()=>{this.modeState=this.editing?"view":"edit",this.render(),ce(this,le.MODE_CHANGE,{mode:this.modeState}),this.modeState==="edit"&&this.root.querySelector(".editor-input")?.focus()}}):null}readInline(){return Ls(this)}contentChanged(){}get variant(){return Ne(this.getAttribute("variant"),["simple","full"],"simple")}feature(e){let n=De(this.getAttribute(e));return n!==null?n:this.constructor.presets[this.variant][e]??!1}get locale(){let e=this.getAttribute("lang-ui")?.trim();return e&&/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(e)?e:ee().lang}get heading(){return _s(this.getAttribute("label")??this.getAttribute("title"))}requestRender(){this._renderQueued||(this._renderQueued=!0,queueMicrotask(()=>{this._renderQueued=!1,this.isConnected&&this.render()}))}applyTheme(){let e=Ws(this.getAttribute("theme"));this.frame.dataset.theme=e,this.applySyntaxTheme(qs(e)?.colorScheme==="dark")}applySyntaxTheme(e){let n=ee(),r=e&&this.getAttribute("syntax-theme-dark")||this.getAttribute("syntax-theme")||e&&n.syntaxThemeDark||n.syntaxTheme,s=Zs(r);if(this.syntaxTheme=s,!s){this.updateSheets(null);return}let i=Js(s);if(i){this.updateSheets(i);return}Qs(s).then(a=>{a&&this.syntaxTheme===s&&this.updateSheets(a)})}updateSheets(e){let r=this.constructor.styles.map(Tn),s=[Tn(Es),et,Tn(Ts),...r];this.frame.toggleAttribute("data-syntax-theme",!!e),this.root.adoptedStyleSheets=e?[...s.filter(i=>i!==Tn(wt)),e]:s}render(){let e=this.activeFocusKey(),n=this.root.activeElement,r=n instanceof HTMLTextAreaElement||n instanceof HTMLInputElement?[n.selectionStart,n.selectionEnd]:null;this.t=ur(this.locale),this.applyTheme();let s=ws(this.getAttribute("max-height"));if(s?this.frame.style.setProperty("--_max-height",s):this.frame.style.removeProperty("--_max-height"),this.searchBar=null,this.frame.replaceChildren(),this.loading){this.frame.append(...this.chrome(null),b("div",{class:"body",part:"body"},oi(this.t))),this.frame.setAttribute("aria-busy","true");return}if(this.frame.removeAttribute("aria-busy"),this.error){let{title:a,detail:o}=this.describeError(this.error);this.frame.append(...this.chrome(null),Et(a,o));return}if(!this.text&&!this.editing&&!this.constructor.allowEmpty)this.frame.append(...this.chrome(null),li(this.t));else{this.renderContent(this.frame);let a=this.searchBar;this.searchOpen&&this.searchQuery&&a?.run()}this.restoreFocus(e);let i=this.root.activeElement;if(r&&(i instanceof HTMLTextAreaElement||i instanceof HTMLInputElement)&&r[0]!==null)try{i.setSelectionRange(r[0],r[1])}catch{}this._readyPending&&(this._readyPending=!1,ce(this,le.READY,{type:this.constructor.type}))}renderContent(e){throw new Error("renderContent() must be implemented.")}chrome(e){let n=(e?.actions??[]).filter(a=>a!==null),r=n.length?b("div",{class:"toolbar",part:"toolbar",attrs:{role:"toolbar","aria-label":this.t("actions")}},...n):null;if(!this.feature("header"))return r?.classList.add("floating"),[r,e?.tabs??null,this.searchBar?.element??null].filter(a=>a!==null);let s=this.heading,i=b("div",{class:"header",part:"header"},this.feature("dot")?b("span",{class:"dot",part:"status-dot",attrs:{"aria-hidden":"true"}}):null,s?b("span",{class:"title",part:"title",text:s,attrs:{title:s}}):null,e?.tabs??null,s?null:b("span",{class:"spacer"}),e?.badge&&De(this.getAttribute("badge"))!==!1?b("span",{class:"badge",part:"badge",text:e.badge}):null);return r&&i.append(r),this.searchBar?[i,this.searchBar.element]:[i]}copyButton(e,n=this.t("copy"),r="copy"){let s=ie({icon:"copy",label:n,key:r,part:"copy-button",onClick:async()=>{let i=e(),a=await cr(i,this.root);ai(s,"copy",a),this.announce(this.t(a?"copied":"copyFailed")),a&&ce(this,le.COPY,{text:i})}});return s}copyTextButton(e,n,r){let s=b("button",{class:"text-btn",part:"copy-button",text:n,attrs:{type:"button","data-focus-key":r},on:{click:async()=>{let i=e(),a=await cr(i,this.root);s.textContent=this.t(a?"copied":"copyFailed"),s.classList.toggle("done",a),setTimeout(()=>{s.textContent=n,s.classList.remove("done")},1500),this.announce(this.t(a?"copied":"copyFailed")),a&&ce(this,le.COPY,{text:i})}}});return s}downloadName(e){let n=this.getAttribute("download"),r=n&&De(n)!==!1&&!/^(?:true|on|yes)$/i.test(n.trim())?n:null,s=/\.[a-z0-9]{1,10}$/i.test(this.heading)?this.heading:null;return ks(r??s,e)}downloadButton(e,n,r){return ie({icon:"download",label:this.t("download"),key:"download",part:"download-button",onClick:()=>Ss(e(),n,r)})}searchButton(e){return this.feature("search")?(this.searchOpen&&(this.searchBar=new kn(this.t,{run:n=>(this.searchQuery=n,e.run(n)),go:n=>e.go(n),onResult:(n,r,s)=>{n&&this.announce(r?this.t("searchResults",{total:s?`${r}+`:r}):this.t("searchNone")),ce(this,le.SEARCH,{query:n,matches:r})},onClose:()=>{e.clear(),this.searchOpen=!1,this.searchQuery="",this.render(),this.root.querySelector('[data-focus-key="search"]')?.focus()}},this.searchQuery)),ie({icon:"search",label:this.t("search"),key:"search",part:"search-button",pressed:this.searchOpen,onClick:()=>{this.searchOpen=!this.searchOpen,this.searchOpen||(this.searchQuery=""),this.render(),this.searchOpen&&this.searchBar?.focus()}})):null}announce(e){this.live.textContent="",setTimeout(()=>{this.live.textContent=e},50)}activeFocusKey(){let e=this.root.activeElement;return e instanceof HTMLElement?e.dataset.focusKey??null:null}restoreFocus(e){if(!e)return;let n=this.root.querySelector(`[data-focus-key="${CSS.escape(e)}"]`);n instanceof HTMLElement&&n.focus({preventScroll:!0})}};var Ci=xo(Ni(),1);var Rt=Ci.default;function Li(t){let e=t.regex,n={},r={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{begin:e.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},r]});let s={className:"subst",begin:/\$\(/,end:/\)/,contains:[t.BACKSLASH_ESCAPE]},i=t.inherit(t.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),a={begin:/<<-?\s*(?=\w+)/,starts:{contains:[t.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},o={className:"string",begin:/"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,n,s]};s.contains.push(o);let c={match:/\\"/},u={className:"string",begin:/'/,end:/'/},d={match:/\\'/},p={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},t.NUMBER_MODE,n]},y=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],v=t.SHEBANG({binary:`(${y.join("|")})`,relevance:10}),_={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[t.inherit(t.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},C=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],N=["true","false"],H={match:/(\/[a-z._-]+)+/},O=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],F=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],P=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],q=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:C,literal:N,built_in:[...O,...F,"set","shopt",...P,...q]},contains:[v,t.SHEBANG(),_,p,i,a,H,o,c,u,d,n]}}function Oi(t){let e=t.regex;return{name:"Diff",aliases:["patch"],contains:[{className:"meta",relevance:10,match:e.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+,\d+ +\+\d+ +@@/,/^@@ +-\d+ +\+\d+ +@@/,/^\*\*\* +\d+,\d+ +\*\*\*\*$/,/^--- +\d+,\d+ +----$/)},{className:"comment",variants:[{begin:e.either(/Index: /,/^index/,/={3,}/,/^-{3}/,/^\*{3} /,/^\+{3}/,/^diff --git/),end:/$/},{match:/^\*{15}$/}]},{className:"addition",begin:/^\+/,end:/$/},{className:"deletion",begin:/^-/,end:/$/},{className:"addition",begin:/^!/,end:/$/}]}}var Mi="[A-Za-z$_][0-9A-Za-z$_]*",Gl=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Wl=["true","false","null","undefined","NaN","Infinity"],Ii=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Di=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Pi=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Vl=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],Kl=[].concat(Pi,Ii,Di);function zi(t){let e=t.regex,n=(A,{after:I})=>{let j="</"+A[0].slice(1);return A.input.indexOf(j,I)!==-1},r=Mi,s={begin:"<>",end:"</>"},i=/<[A-Za-z0-9\\._:-]+\s*\/>/,a={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(A,I)=>{let j=A[0].length+A.index,se=A.input[j];if(se==="<"||se===","){I.ignoreMatch();return}se===">"&&(n(A,{after:j})||I.ignoreMatch());let ge,Ue=A.input.substring(j);if(ge=Ue.match(/^\s*=/)){I.ignoreMatch();return}if((ge=Ue.match(/^\s+extends\s+/))&&ge.index===0){I.ignoreMatch();return}}},o={$pattern:Mi,keyword:Gl,literal:Wl,built_in:Kl,"variable.language":Vl},c="[0-9](_?[0-9])*",u=`\\.(${c})`,d="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",p={className:"number",variants:[{begin:`(\\b(${d})((${u})|\\.)?|(${u}))[eE][+-]?(${c})\\b`},{begin:`\\b(${d})\\b((${u})\\b|\\.)?|(${u})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},y={className:"subst",begin:"\\$\\{",end:"\\}",keywords:o,contains:[]},v={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,y],subLanguage:"xml"}},_={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,y],subLanguage:"css"}},C={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,y],subLanguage:"graphql"}},N={className:"string",begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,y]},O={className:"comment",variants:[t.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]},F=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,v,_,C,N,{match:/\$\d+/},p];y.contains=F.concat({begin:/\{/,end:/\}/,keywords:o,contains:["self"].concat(F)});let P=[].concat(O,y.contains),q=P.concat([{begin:/(\s*)\(/,end:/\)/,keywords:o,contains:["self"].concat(P)}]),K={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:o,contains:q},he={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,e.concat(r,"(",e.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},X={relevance:0,match:e.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Ii,...Di]}},Z={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},Ee={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[K],illegal:/%/},Ye={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function ht(A){return e.concat("(?!",A.join("|"),")")}let $e={match:e.concat(/\b/,ht([...Pi,"super","import","await"].map(A=>`${A}\\s*\\(`)),r,e.lookahead(/\s*\(/)),className:"title.function",relevance:0},Be={begin:e.concat(/\./,e.lookahead(e.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},Oe={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},K]},g="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",E={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,e.lookahead(g)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[K]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:o,exports:{PARAMS_CONTAINS:q,CLASS_REFERENCE:X},illegal:/#(?![$_A-Za-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",relevance:5}),Z,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,v,_,C,N,O,{match:/\$\d+/},p,X,{scope:"attr",match:r+e.lookahead(":"),relevance:0},E,{begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[O,t.REGEXP_MODE,{className:"function",begin:g,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:o,contains:q}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:s.begin,end:s.end},{match:i},{begin:a.begin,"on:begin":a.isTrulyOpeningTag,end:a.end}],subLanguage:"xml",contains:[{begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}]},Ee,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[K,t.inherit(t.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},Be,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[K]},$e,Ye,he,Oe,{match:/\$[(.]/}]}}var Yl="([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",Xl={scope:"number",match:Yl,relevance:0};function $i(t){let e={className:"attr",begin:/(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,relevance:1.01},n={match:/[{}[\],:]/,className:"punctuation",relevance:0},r=["true","false","null"],s={scope:"literal",beginKeywords:r.join(" ")};return{name:"JSON",aliases:["jsonc","json5"],keywords:{literal:r},contains:[e,n,t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,s,Xl,t.C_LINE_COMMENT_MODE,t.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}function Bi(t){let e=t.regex,n={begin:/<\/?[A-Za-z_]/,end:">",subLanguage:"xml",relevance:0},r={match:/^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}$/},s={className:"code",variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},i={className:"bullet",begin:"^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",end:"\\s+",excludeEnd:!0},a={begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]},o=/[A-Za-z][A-Za-z0-9+.-]*/,c={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:e.concat(/\[.+?\]\(/,o,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/},{className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0}]},u={className:"strong",contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]},d={className:"emphasis",contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]},p=t.inherit(u,{contains:[]}),y=t.inherit(d,{contains:[]});u.contains.push(y),d.contains.push(p);let v=[n,c];return[u,d,p,y].forEach(H=>{H.contains=H.contains.concat(v)}),v=v.concat(u,d),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:v},{begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",contains:v}]}]},n,i,r,u,d,{className:"quote",begin:"^>\\s+",contains:v,end:"$"},s,c,a,{scope:"literal",match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}function Ui(t){return{name:"Plain text",aliases:["text","txt"],disableAutodetect:!0}}function Hi(t){let e=t.regex,n=new RegExp("[\\p{XID_Start}_]\\p{XID_Continue}*","u"),r=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","lazy","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],o={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:r,built_in:["__import__","abs","aiter","all","anext","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozendict","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","sentinel","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]},c={className:"meta",begin:/^(>>>|\.\.\.) /},u={className:"subst",begin:/\{/,end:/\}/,keywords:o,illegal:/#/},d={begin:/\{\{/,relevance:0},p={className:"string",contains:[t.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[t.BACKSLASH_ESCAPE,c],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[t.BACKSLASH_ESCAPE,c],relevance:10},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'''/,end:/'''/,contains:[t.BACKSLASH_ESCAPE,c,d,u]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"""/,end:/"""/,contains:[t.BACKSLASH_ESCAPE,c,d,u]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'/,end:/'/,contains:[t.BACKSLASH_ESCAPE,d,u]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"/,end:/"/,contains:[t.BACKSLASH_ESCAPE,d,u]},t.APOS_STRING_MODE,t.QUOTE_STRING_MODE]},y="[0-9](_?[0-9])*",v=`(\\b(${y}))?\\.(${y})|\\b(${y})\\.`,_=`\\b|${r.join("|")}`,C={className:"number",relevance:0,variants:[{begin:`(\\b(${y})|(${v}))[eE][+-]?(${y})[jJ]?(?=${_})`},{begin:`(${v})[jJ]?`},{begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${_})`},{begin:`\\b0[bB](_?[01])+[lL]?(?=${_})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${_})`},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${_})`},{begin:`\\b(${y})[jJ](?=${_})`}]},N={className:"comment",begin:e.lookahead(/# type:/),end:/$/,keywords:o,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},H={className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:o,contains:["self",c,C,p,t.HASH_COMMENT_MODE]}]};return u.contains=[p,C,c],{name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:o,illegal:/(<\/|\?)|=>/,contains:[c,C,{scope:"variable.language",match:/\bself\b/},{beginKeywords:"if",relevance:0},{match:/\bor\b/,scope:"keyword"},p,N,t.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,n],scope:{1:"keyword",3:"title.function"},contains:[H]},{variants:[{match:[/\bclass/,/\s+/,n,/\s*/,/\(\s*/,n,/\s*\)/]},{match:[/\bclass/,/\s+/,n]}],scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[C,H,p]}]}}function Fi(t){return{name:"Shell Session",aliases:["console","shellsession"],contains:[{className:"meta.prompt",begin:/^\s{0,3}[./~\w\d[\]()@-]*[>%$#][ ]?/,starts:{end:/[^\\](?=\s*$)/,subLanguage:"bash"}}]}}function ji(t){let e=t.regex,n=e.concat(/[\p{L}_]/u,e.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,s={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},i={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},a=t.inherit(i,{begin:/\(/,end:/\)/}),o=t.inherit(t.APOS_STRING_MODE,{className:"string"}),c=t.inherit(t.QUOTE_STRING_MODE,{className:"string"}),u={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[s]},{begin:/'/,end:/'/,contains:[s]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[i,c,o,a,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[i,a,c,o]}]}]},t.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},s,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[c]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[u],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:"css"}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[u],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:"javascript"}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:e.concat(/</,e.lookahead(e.concat(n,e.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:u}]},{className:"tag",begin:e.concat(/<\//,e.lookahead(e.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}function qi(t){let e="true false yes no null",n="[\\w#;/?:@&=+$,.~*'()[\\]]+",r={className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},s={className:"template-variable",variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]},i={className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,scope:"char.escape",relevance:0}]},a={className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],contains:[t.BACKSLASH_ESCAPE,s]},o=t.inherit(a,{variants:[{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),y={className:"number",begin:"\\b"+"[0-9]{4}(-[0-9][0-9]){0,2}"+"([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"+"(\\.[0-9]*)?"+"([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"+"\\b"},v={end:",",endsWithParent:!0,excludeEnd:!0,keywords:e,relevance:0},_={begin:/\{/,end:/\}/,contains:[v],illegal:"\\n",relevance:0},C={begin:"\\[",end:"\\]",contains:[v],illegal:"\\n",relevance:0},N=[r,{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!\\w+!"+n},{className:"type",begin:"!<"+n+">"},{className:"type",begin:"!"+n},{className:"type",begin:"!!"+n},{className:"meta",begin:"&"+t.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+t.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",relevance:0},t.HASH_COMMENT_MODE,{beginKeywords:e,keywords:{literal:e}},y,{className:"number",begin:t.C_NUMBER_RE+"\\b",relevance:0},_,C,i,a],H=[...N];return H.pop(),H.push(o),v.contains=H,{name:"YAML",case_insensitive:!0,aliases:["yml"],contains:N}}var Ln=Object.freeze({"1c":"",abnf:"",accesslog:"",actionscript:"as",ada:"",angelscript:"asc",apache:"apacheconf",applescript:"osascript",arcade:"",arduino:"ino",armasm:"arm",asciidoc:"adoc",aspectj:"",autohotkey:"ahk",autoit:"",avrasm:"",awk:"",axapta:"x++",bash:"sh zsh",basic:"",bnf:"",brainfuck:"bf",c:"h",cal:"",capnproto:"capnp",ceylon:"",clean:"dcl icl",clojure:"clj edn","clojure-repl":"",cmake:"cmake.in",coffeescript:"coffee cson iced",coq:"",cos:"cls",cpp:"c++ cc cxx h++ hh hpp hxx",crmsh:"crm pcmk",crystal:"cr",csharp:"c# cs",csp:"",css:"",d:"",dart:"",delphi:"dfm dpr pas pascal",diff:"patch",django:"jinja",dns:"bind zone",dockerfile:"docker",dos:"bat batch cmd",dsconfig:"",dts:"",dust:"dst",ebnf:"",elixir:"ex exs",elm:"",erb:"",erlang:"erl","erlang-repl":"",excel:"xls xlsx",fix:"",flix:"",fortran:"f90 f95",freedesktop:"desktop systemd",fsharp:"f# fs",gams:"gms",gauss:"gss",gcode:"nc",gherkin:"feature",glsl:"",gml:"",go:"golang",golo:"",gradle:"",graphql:"gql",groovy:"",haml:"",handlebars:"hbs html.handlebars html.hbs htmlbars",haskell:"hs",haxe:"hx",hsp:"",http:"https",hy:"hylang",inform7:"i7",ini:"toml",irpf90:"",isbl:"",java:"jsp",javascript:"cjs js jsx mjs","jboss-cli":"wildfly-cli",json:"json5 jsonc",julia:"","julia-repl":"jldoctest",kotlin:"kt ktm kts ktx",lasso:"lassoscript ls",latex:"tex",ldif:"",leaf:"",less:"",lisp:"",livecodeserver:"",livescript:"ls",llvm:"",lsl:"",lua:"pluto",makefile:"mak make mk",markdown:"md mkd mkdown",mathematica:"mma wl",matlab:"",maxima:"",mel:"",mercury:"m moo",mipsasm:"mips",mizar:"",mojolicious:"",monkey:"",moonscript:"moon",n1ql:"",nestedtext:"nt",nginx:"nginxconf",nim:"",nix:"nixos","node-repl":"",nsis:"",objectivec:"mm obj-c obj-c++ objc objective-c++",ocaml:"ml",openscad:"scad",oxygene:"",parser3:"",perl:"pl pm",pf:"pf.conf",pgsql:"postgres postgresql",php:"","php-template":"",plaintext:"text txt",pony:"",powershell:"ps ps1 pwsh",processing:"pde",profile:"",prolog:"",properties:"",protobuf:"proto",puppet:"pp",purebasic:"pb pbi",python:"gyp ipython py","python-repl":"pycon",q:"k kdb",qml:"qt",r:"",reasonml:"re",rib:"",roboconf:"graph instances",routeros:"mikrotik",rsl:"",ruby:"gemspec irb podspec rb thor",ruleslanguage:"",rust:"rs",sas:"",scala:"",scheme:"scm",scilab:"sci",scss:"",shell:"console shellsession",smali:"",smalltalk:"st",sml:"ml",sqf:"",sql:"",stan:"stanfuncs",stata:"ado do",step21:"p21 step stp",stylus:"styl",subunit:"",swift:"",taggerscript:"",tap:"",tcl:"tk",thrift:"",tp:"",twig:"craftcms",typescript:"cts mts ts tsx",vala:"",vbnet:"vb",vbscript:"vbs","vbscript-html":"",verilog:"sv svh v",vhdl:"",vim:"",wasm:"",wren:"",x86asm:"",xl:"tao",xml:"atom html plist rss svg wsf xhtml xjb xsd xsl",xquery:"xpath xq xqm",yaml:"yml",zephir:"zep"});function Zl(t,e){this.v=t,this.k=e}function Gi(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Jl(t){if(Array.isArray(t))return t}function Ql(t,e){var n=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(n!=null){var r,s,i,a,o=[],c=!0,u=!1;try{if(i=(n=n.call(t)).next,e===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=i.call(n)).done)&&(o.push(r.value),o.length!==e);c=!0);}catch(d){u=!0,s=d}finally{try{if(!c&&n.return!=null&&(a=n.return(),Object(a)!==a))return}finally{if(u)throw s}}return o}}function ec(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function tc(t,e){return Jl(t)||Ql(t,e)||nc(t,e)||ec()}function nc(t,e){if(t){if(typeof t=="string")return Gi(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Gi(t,e):void 0}}function On(t){var e,n;function r(i,a){try{var o=t[i](a),c=o.value,u=c instanceof Zl;Promise.resolve(u?c.v:c).then(function(d){if(u){var p=i==="return"&&c.k?i:"next";if(!c.k||d.done)return r(p,d);d=t[p](d).value}s(!!o.done,d)},function(d){r("throw",d)})}catch(d){s(2,d)}}function s(i,a){i===2?e.reject(a):e.resolve({value:a,done:i}),(e=e.next)?r(e.key,e.arg):n=null}this._invoke=function(i,a){return new Promise(function(o,c){var u={key:i,arg:a,resolve:o,reject:c,next:null};n?n=n.next=u:(e=n=u,r(i,a))})},typeof t.return!="function"&&(this.return=void 0)}On.prototype[typeof Symbol=="function"&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},On.prototype.next=function(t){return this._invoke("next",t)},On.prototype.throw=function(t){return this._invoke("throw",t)},On.prototype.return=function(t){return this._invoke("return",t)};var aa=Object.entries,Wi=Object.setPrototypeOf,rc=Object.isFrozen,sc=Object.getPrototypeOf,ic=Object.getOwnPropertyDescriptor,re=Object.freeze,ae=Object.seal,Nt=Object.create,oa=typeof Reflect<"u"&&Reflect,Nr=oa.apply,Cr=oa.construct;re||(re=function(e){return e});ae||(ae=function(e){return e});Nr||(Nr=function(e,n){for(var r=arguments.length,s=new Array(r>2?r-2:0),i=2;i<r;i++)s[i-2]=arguments[i];return e.apply(n,s)});Cr||(Cr=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return new e(...r)});var st=ne(Array.prototype.forEach);Array.prototype.indexOf;var ac=ne(Array.prototype.lastIndexOf),Vi=ne(Array.prototype.pop),qt=ne(Array.prototype.push);Array.prototype.slice;var oc=ne(Array.prototype.splice),Ct=Array.isArray,Vt=ne(String.prototype.toLowerCase),kr=ne(String.prototype.toString),Ki=ne(String.prototype.match),Gt=ne(String.prototype.replace),Yi=ne(String.prototype.indexOf),lc=ne(String.prototype.trim),cc=ne(Number.prototype.toString),uc=ne(Boolean.prototype.toString),Xi=typeof BigInt>"u"?null:ne(BigInt.prototype.toString),Zi=typeof Symbol>"u"?null:ne(Symbol.prototype.toString),ye=ne(Object.prototype.hasOwnProperty),Wt=ne(Object.prototype.toString),de=ne(RegExp.prototype.test),We=hc(TypeError);function ne(t){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return Nr(t,e,r)}}function hc(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return Cr(t,n)}}function U(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Vt;if(Wi&&Wi(t,null),!Ct(e))return t;let r=e.length;for(;r--;){let s=e[r];if(typeof s=="string"){let i=n(s);i!==s&&(rc(e)||(e[r]=i),s=i)}t[s]=!0}return t}function dc(t){for(let e=0;e<t.length;e++)ye(t,e)||(t[e]=null);return t}function _e(t){let e=Nt(null);for(let r of aa(t)){var n=tc(r,2);let s=n[0],i=n[1];ye(t,s)&&(Ct(i)?e[s]=dc(i):i&&typeof i=="object"&&i.constructor===Object?e[s]=_e(i):e[s]=i)}return e}function pc(t){switch(typeof t){case"string":return t;case"number":return cc(t);case"boolean":return uc(t);case"bigint":return Xi?Xi(t):"0";case"symbol":return Zi?Zi(t):"Symbol()";case"undefined":return Wt(t);case"function":case"object":{if(t===null)return Wt(t);let e=t,n=Ae(e,"toString");if(typeof n=="function"){let r=n(e);return typeof r=="string"?r:Wt(r)}return Wt(t)}default:return Wt(t)}}function Ae(t,e){for(;t!==null;){let r=ic(t,e);if(r){if(r.get)return ne(r.get);if(typeof r.value=="function")return ne(r.value)}t=sc(t)}function n(){return null}return n}function fc(t){try{return de(t,""),!0}catch{return!1}}var Ji=re(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Er=re(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Tr=re(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),gc=re(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Sr=re(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),mc=re(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Qi=re(["#text"]),ea=re(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Ar=re(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),ta=re(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Mn=re(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),bc=ae(/{{[\w\W]*|^[\w\W]*}}/g),yc=ae(/<%[\w\W]*|^[\w\W]*%>/g),xc=ae(/\${[\w\W]*/g),vc=ae(/^data-[\-\w.\u00B7-\uFFFF]+$/),wc=ae(/^aria-[\-\w]+$/),na=ae(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),_c=ae(/^(?:\w+script|data):/i),kc=ae(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ec=ae(/^html$/i),Tc=ae(/^[a-z][.\w]*(-[.\w]+)+$/i),ra=ae(/<[/\w!]/g),sa=ae(/<[/\w]/g),Sc=ae(/<\/no(script|embed|frames)/i),Ac=ae(/\/>/i),we={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},la=["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"],Rc=re(U({},la)),Nc=(function(){let t={};return st(la,e=>{t[e]=ae(new RegExp("</"+e+"(?=[\\t\\n\\f\\r />])","i"))}),re(t)})(),Cc=function(){return typeof window>"u"?null:window},Lc=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null,s="data-tt-policy-suffix";n&&n.hasAttribute(s)&&(r=n.getAttribute(s));let i="dompurify"+(r?"#"+r:"");try{return e.createPolicy(i,{createHTML(a){return a},createScriptURL(a){return a}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},ia=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},Ve=function(e,n,r,s){return ye(e,n)&&Ct(e[n])?U(s.base?_e(s.base):{},e[n],s.transform):r},Rr=function(e,n,r){let s=ye(e,n)?e[n]:void 0;return s&&typeof s=="object"?_e(s):r()};function ca(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Cc(),e=m=>ca(m);if(e.version="3.4.16",e.removed=[],!t||!t.document||t.document.nodeType!==we.document||!t.Element)return e.isSupported=!1,e;let n=t.document,r=n,s=r.currentScript;t.DocumentFragment;let i=t.HTMLTemplateElement,a=t.Node,o=t.Element,c=t.NodeFilter;t.NamedNodeMap===void 0&&(t.NamedNodeMap||t.MozNamedAttrMap),t.HTMLFormElement;let u=t.DOMParser,d=t.trustedTypes,p=o.prototype,y=Ae(p,"cloneNode"),v=Ae(p,"remove"),_=Ae(p,"removeAttributeNode"),C=Ae(p,"nextSibling"),N=Ae(p,"childNodes"),H=Ae(p,"parentNode"),O=Ae(p,"shadowRoot"),F=Ae(p,"attributes"),P=a&&a.prototype?Ae(a.prototype,"nodeType"):null,q=a&&a.prototype?Ae(a.prototype,"nodeName"):null,K=a&&a.prototype?Ae(a.prototype,"ownerDocument"):null,he=function(l){return P?P(l):l.nodeType},X=function(l){return q?q(l):l.nodeName};if(typeof i=="function"){let m=n.createElement("template");m.content&&m.content.ownerDocument&&(n=m.content.ownerDocument)}let Z,Ee="",Ye,ht=!1,$e=0,Be=function(){if($e>0)throw We('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Oe=function(l){Be(),$e++;try{return Z.createHTML(l)}finally{$e--}},g=function(l){Be(),$e++;try{return Z.createScriptURL(l)}finally{$e--}},E=function(){return ht||(Ye=Lc(d,s),ht=!0),Ye},A=n,I=A.implementation,j=A.createNodeIterator,se=A.createDocumentFragment,ge=A.getElementsByTagName,Ue=r.importNode,M=ia();e.isSupported=typeof aa=="function"&&typeof H=="function"&&I&&I.createHTMLDocument!==void 0;let Te=bc,nn=yc,rn=xc,sn=vc,Yn=wc,Xn=_c,an=kc,Zn=Tc,Xe=na,G=null,me=U({},[...Ji,...Er,...Tr,...Sr,...Qi]),V=null,Ze=U({},[...ea,...Ar,...ta,...Mn]),T=Object.seal(Nt(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Fe=null,te=null,z=Object.seal(Nt(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Je=!0,Re=!0,dt=!1,pt=!0,w=!1,k=!0,R=!1,B=!1,J=null,be=null,It=!1,je=!1,on=!1,ln=!1,Kr=!0,Yr=!1,Xr="user-content-",Jn=!0,Qn=!1,ft={},gt=null,Zr=U({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]),Jr=null,Qr=U({},["audio","video","img","source","image","track"]),es=null,ts=U({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),cn="http://www.w3.org/1998/Math/MathML",un="http://www.w3.org/2000/svg",Me="http://www.w3.org/1999/xhtml",mt=Me,er=!1,tr=null,Ya=U({},[cn,un,Me],kr),ns=re(["mi","mo","mn","ms","mtext"]),nr=U({},ns),rs=re(["annotation-xml"]),rr=U({},rs),Xa=U({},["title","style","font","a","script"]),Dt=null,Za=["application/xhtml+xml","text/html"],Ja="text/html",Q=null,bt=null,Qa=n.createElement("form"),ss=function(l){return l instanceof RegExp||l instanceof Function},sr=function(){let l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(bt&&bt===l)return;(!l||typeof l!="object")&&(l={}),l=_e(l),Dt=Za.indexOf(l.PARSER_MEDIA_TYPE)===-1?Ja:l.PARSER_MEDIA_TYPE,Q=Dt==="application/xhtml+xml"?kr:Vt,G=Ve(l,"ALLOWED_TAGS",me,{transform:Q}),V=Ve(l,"ALLOWED_ATTR",Ze,{transform:Q}),tr=Ve(l,"ALLOWED_NAMESPACES",Ya,{transform:kr}),es=Ve(l,"ADD_URI_SAFE_ATTR",ts,{transform:Q,base:ts}),Jr=Ve(l,"ADD_DATA_URI_TAGS",Qr,{transform:Q,base:Qr}),gt=Ve(l,"FORBID_CONTENTS",Zr,{transform:Q}),Fe=Ve(l,"FORBID_TAGS",_e({}),{transform:Q}),te=Ve(l,"FORBID_ATTR",_e({}),{transform:Q}),ft=ye(l,"USE_PROFILES")?l.USE_PROFILES&&typeof l.USE_PROFILES=="object"?_e(l.USE_PROFILES):l.USE_PROFILES:!1,Je=l.ALLOW_ARIA_ATTR!==!1,Re=l.ALLOW_DATA_ATTR!==!1,dt=l.ALLOW_UNKNOWN_PROTOCOLS||!1,pt=l.ALLOW_SELF_CLOSE_IN_ATTR!==!1,w=l.SAFE_FOR_TEMPLATES||!1,k=l.SAFE_FOR_XML!==!1,R=l.WHOLE_DOCUMENT||!1,je=l.RETURN_DOM||!1,on=l.RETURN_DOM_FRAGMENT||!1,ln=l.RETURN_TRUSTED_TYPE||!1,It=l.FORCE_BODY||!1,Kr=l.SANITIZE_DOM!==!1,Yr=l.SANITIZE_NAMED_PROPS||!1,Jn=l.KEEP_CONTENT!==!1,Qn=l.IN_PLACE||!1,Xe=fc(l.ALLOWED_URI_REGEXP)?l.ALLOWED_URI_REGEXP:na,mt=typeof l.NAMESPACE=="string"?l.NAMESPACE:Me,nr=Rr(l,"MATHML_TEXT_INTEGRATION_POINTS",()=>U({},ns)),rr=Rr(l,"HTML_INTEGRATION_POINTS",()=>U({},rs));let h=Rr(l,"CUSTOM_ELEMENT_HANDLING",()=>Nt(null));if(T=Nt(null),ye(h,"tagNameCheck")&&ss(h.tagNameCheck)&&(T.tagNameCheck=h.tagNameCheck),ye(h,"attributeNameCheck")&&ss(h.attributeNameCheck)&&(T.attributeNameCheck=h.attributeNameCheck),ye(h,"allowCustomizedBuiltInElements")&&typeof h.allowCustomizedBuiltInElements=="boolean"&&(T.allowCustomizedBuiltInElements=h.allowCustomizedBuiltInElements),ae(T),w&&(Re=!1),on&&(je=!0),ft&&(G=U({},Qi),V=Nt(null),ft.html===!0&&(U(G,Ji),U(V,ea)),ft.svg===!0&&(U(G,Er),U(V,Ar),U(V,Mn)),ft.svgFilters===!0&&(U(G,Tr),U(V,Ar),U(V,Mn)),ft.mathMl===!0&&(U(G,Sr),U(V,ta),U(V,Mn))),z.tagCheck=null,z.attributeCheck=null,ye(l,"ADD_TAGS")&&(typeof l.ADD_TAGS=="function"?z.tagCheck=l.ADD_TAGS:Ct(l.ADD_TAGS)&&(G===me&&(G=_e(G)),U(G,l.ADD_TAGS,Q))),ye(l,"ADD_ATTR")&&(typeof l.ADD_ATTR=="function"?z.attributeCheck=l.ADD_ATTR:Ct(l.ADD_ATTR)&&(V===Ze&&(V=_e(V)),U(V,l.ADD_ATTR,Q))),ye(l,"ADD_FORBID_CONTENTS")&&Ct(l.ADD_FORBID_CONTENTS)&&(gt===Zr&&(gt=_e(gt)),U(gt,l.ADD_FORBID_CONTENTS,Q)),Jn&&(G["#text"]=!0),R&&U(G,["html","head","body"]),G.table&&(U(G,["tbody"]),delete Fe.tbody),l.TRUSTED_TYPES_POLICY){if(typeof l.TRUSTED_TYPES_POLICY.createHTML!="function")throw We('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof l.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw We('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');let f=Z;Z=l.TRUSTED_TYPES_POLICY;try{Ee=Oe("")}catch(x){throw Z=f,x}}else l.TRUSTED_TYPES_POLICY===null?(Z=void 0,Ee=""):(Z===void 0&&(Z=E()),Z&&typeof Ee=="string"&&(Ee=Oe("")));re&&re(l),bt=l},is=U({},[...Er,...Tr,...gc]),as=U({},[...Sr,...mc]),eo=function(l,h,f){return h.namespaceURI===Me?l==="svg":h.namespaceURI===cn?l==="svg"&&(f==="annotation-xml"||nr[f]):!!is[l]},to=function(l,h,f){return h.namespaceURI===Me?l==="math":h.namespaceURI===un?l==="math"&&rr[f]:!!as[l]},no=function(l,h,f){return h.namespaceURI===un&&!rr[f]||h.namespaceURI===cn&&!nr[f]?!1:!as[l]&&(Xa[l]||!is[l])},ro=function(l){let h=H(l);(!h||!h.tagName)&&(h={namespaceURI:mt,tagName:"template"});let f=Vt(l.tagName),x=Vt(h.tagName);return tr[l.namespaceURI]?l.namespaceURI===un?eo(f,h,x):l.namespaceURI===cn?to(f,h,x):l.namespaceURI===Me?no(f,h,x):!!(Dt==="application/xhtml+xml"&&tr[l.namespaceURI]):!1},qe=function(l){qt(e.removed,{element:l});try{H(l).removeChild(l)}catch{if(v(l),!H(l))throw We("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},os=function(l,h,f){try{_(l,h)}catch{try{l.removeAttribute(f)}catch{}}},hn=function(l){dn(l);let h=N(l);if(h){let x=[];st(h,S=>{qt(x,S)}),st(x,S=>{try{v(S)}catch{}})}let f=F(l);if(f)for(let x=f.length-1;x>=0;--x){let S=f[x],D=S&&S.name;typeof D=="string"&&os(l,S,D)}},Qe=function(l,h,f){if(!f)try{f=h.getAttributeNode(l)}catch{f=null}qt(e.removed,{attribute:f||null,from:h});try{f?_(h,f):h.removeAttribute(l)}catch{try{h.removeAttribute(l)}catch{}}if(l==="is")if(je||on)try{qe(h)}catch{}else try{h.setAttribute(l,"")}catch{}},so=function(l){let h=F(l);if(h)for(let f=h.length-1;f>=0;--f){let x=h[f],S=x&&x.name;typeof S!="string"||V[Q(S)]||os(l,x,S)}},dn=function(l){let h=[l];for(;h.length>0;){let f=h.pop();he(f)===we.element&&so(f);let x=N(f);if(x)for(let S=x.length-1;S>=0;--S)h.push(x[S])}},ls=function(l,h){return k?l==="patchsrc"?!0:l==="for"&&h!=="label"&&h!=="output":!1},io=function(l){if(!k)return;let h=[l];for(;h.length>0;){let f=h.pop(),x=he(f);if(x===we.processingInstruction||x===we.comment&&de(sa,f.data)){try{v(f)}catch{}continue}if(x===we.element){let D=f,$=Q(X(f));try{D.hasAttribute&&D.hasAttribute("patchsrc")&&D.removeAttribute("patchsrc"),D.hasAttribute&&D.hasAttribute("for")&&ls("for",$)&&D.removeAttribute("for")}catch{}}let S=N(f);if(S)for(let D=S.length-1;D>=0;--D)h.push(S[D])}},cs=function(l){let h=null,f=null;if(It)l="<remove></remove>"+l;else{let D=Ki(l,/^[\r\n\t ]+/);f=D&&D[0]}Dt==="application/xhtml+xml"&&mt===Me&&(l='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+l+"</body></html>");let x=Z?Oe(l):l;if(mt===Me)try{h=new u().parseFromString(x,Dt)}catch{}if(!h||!h.documentElement){h=I.createDocument(mt,"template",null);try{h.documentElement.innerHTML=er?Ee:x}catch{}}let S=h.body||h.documentElement;return l&&f&&S.insertBefore(n.createTextNode(f),S.childNodes[0]||null),mt===Me?ge.call(h,R?"html":"body")[0]:R?h.documentElement:S},us=function(l){let h=K?K(l):l.ownerDocument;return j.call(h||l,l,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},pn=function(l){return l=Gt(l,Te," "),l=Gt(l,nn," "),l=Gt(l,rn," "),l},ir=function(l){var h;l.normalize();let f=K?K(l):l.ownerDocument,x=j.call(f||l,l,c.SHOW_TEXT|c.SHOW_COMMENT|c.SHOW_CDATA_SECTION|c.SHOW_PROCESSING_INSTRUCTION,null),S=x.nextNode();for(;S;)S.data=pn(S.data),S=x.nextNode();let D=(h=l.querySelectorAll)===null||h===void 0?void 0:h.call(l,"template");D&&st(D,$=>{yt($.content)&&ir($.content)})},fn=function(l){let h=q?q(l):null;return typeof h!="string"||Q(h)!=="form"?!1:typeof l.nodeName!="string"||typeof l.textContent!="string"||typeof l.removeChild!="function"||l.attributes!==F(l)||typeof l.removeAttribute!="function"||typeof l.removeAttributeNode!="function"||typeof l.getAttributeNode!="function"||typeof l.setAttribute!="function"||typeof l.namespaceURI!="string"||typeof l.insertBefore!="function"||typeof l.hasChildNodes!="function"||l.nodeType!==P(l)||l.childNodes!==N(l)},yt=function(l){if(!P||typeof l!="object"||l===null)return!1;try{return P(l)===we.documentFragment}catch{return!1}},Pt=function(l){if(!P||typeof l!="object"||l===null)return!1;try{return typeof P(l)=="number"}catch{return!1}};function Ie(m,l,h){m.length!==0&&st(m,f=>{f.call(e,l,h,bt)})}let ao=function(l,h){return!!(k&&l.hasChildNodes()&&!Pt(l.firstElementChild)&&de(ra,l.textContent)&&de(ra,l.innerHTML)||k&&l.namespaceURI===Me&&Rc[h]&&(Pt(l.firstElementChild)||typeof l.textContent=="string"&&de(Nc[h],l.textContent))||l.nodeType===we.processingInstruction||k&&l.nodeType===we.comment&&de(sa,l.data))},gn=function(l,h){if(l instanceof RegExp)return de(l,h);if(l instanceof Function){for(var f=arguments.length,x=new Array(f>2?f-2:0),S=2;S<f;S++)x[S-2]=arguments[S];return!!l(h,...x)}return!1},oo=function(l,h,f){if(!Fe[h]&&fs(h)&&gn(T.tagNameCheck,h))return!1;if(Jn&&!gt[h]){let x=H(l),S=N(l);if(S&&x){let D=S.length;for(let $=D-1;$>=0;--$){let Y=l===f?y(S[$],!0):S[$];x.insertBefore(Y,C(l))}}}return qe(l),!0},hs=function(l,h,f,x){return l.length===0?h:h===f||h===x?_e(h):h},xt=function(l,h){return l===h||H(l)!==null?!1:(Qn&&dn(l),!0)},ds=function(l,h){if(Ie(M.beforeSanitizeElements,l,null),xt(l,h))return!0;if(fn(l))return qe(l),!0;let f=Q(X(l));if(G=hs(M.uponSanitizeElement,G,me,J),Ie(M.uponSanitizeElement,l,{tagName:f,allowedTags:G}),xt(l,h))return!0;if(ao(l,f))return qe(l),!0;if(Fe[f]||!(z.tagCheck instanceof Function&&z.tagCheck(f))&&!G[f]){let x=oo(l,f,h);return x===!1&&(Ie(M.afterSanitizeElements,l,null),xt(l,h))?!0:x}if(he(l)===we.element&&!ro(l)||(f==="noscript"||f==="noembed"||f==="noframes")&&de(Sc,l.innerHTML))return qe(l),!0;if(w&&l.nodeType===we.text){let x=pn(l.textContent);l.textContent!==x&&(qt(e.removed,{element:l.cloneNode()}),l.textContent=x)}return Ie(M.afterSanitizeElements,l,null),xt(l,h)},ps=function(l,h,f){if(te[h]||ls(h,l)||Kr&&(h==="id"||h==="name")&&(f in n||f in Qa))return!1;let x=V[h]||z.attributeCheck instanceof Function&&z.attributeCheck(h,l);return Re&&de(sn,h)||Je&&de(Yn,h)?!0:x?es[h]||de(Xe,Gt(f,an,""))||(h==="src"||h==="xlink:href"||h==="href")&&l!=="script"&&Yi(f,"data:")===0&&Jr[l]||dt&&!de(Xn,Gt(f,an,""))?!0:!f:fs(l)&&gn(T.tagNameCheck,l)&&gn(T.attributeNameCheck,h,l)||h==="is"&&T.allowCustomizedBuiltInElements&&gn(T.tagNameCheck,f)},lo=U({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),fs=function(l){return!lo[Vt(l)]&&de(Zn,l)},co=function(l,h,f,x){if(Z&&typeof d=="object"&&typeof d.getAttributeType=="function"&&!f)switch(d.getAttributeType(l,h)){case"TrustedHTML":return Oe(x);case"TrustedScriptURL":return g(x)}return x},uo=function(l,h,f,x){try{return f?l.setAttributeNS(f,h,x):l.setAttribute(h,x),fn(l)?(qe(l),!1):!0}catch{return Qe(h,l),!1}},gs=function(l,h){if(Ie(M.beforeSanitizeAttributes,l,null),xt(l,h))return;let f=l.attributes;if(!f||fn(l))return;V=hs(M.uponSanitizeAttribute,V,Ze,be);let x={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:V,forceKeepAttr:void 0},S=f.length,D=Q(l.nodeName);for(;S--;){let $=f[S],Y=$.name,Se=$.namespaceURI,xe=$.value,vt=Q(Y),or=xe,fe=Y==="value"?or:lc(or),ms=!1;if(x.attrName=vt,x.attrValue=fe,x.keepAttr=!0,x.forceKeepAttr=void 0,Ie(M.uponSanitizeAttribute,l,x),fe=x.attrValue,Yr&&(vt==="id"||vt==="name")&&Yi(fe,Xr)!==0&&(Qe(Y,l,$),fe=Xr+fe,ms=!0),k&&de(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,fe)){Qe(Y,l,$);continue}if(vt==="attributename"&&Ki(fe,"href")){Qe(Y,l,$);continue}if(!x.forceKeepAttr){if(!x.keepAttr){Qe(Y,l,$);continue}if(!pt&&de(Ac,fe)){Qe(Y,l,$);continue}if(w&&(fe=pn(fe)),!ps(D,vt,fe)){Qe(Y,l,$);continue}fe=co(D,vt,Se,fe),fe!==or&&uo(l,Y,Se,fe)&&ms&&Vi(e.removed)}}Ie(M.afterSanitizeAttributes,l,null),xt(l,h)},mn=function(l){let h=null,f=us(l);for(Ie(M.beforeSanitizeShadowDOM,l,null);h=f.nextNode();)if(Ie(M.uponSanitizeShadowNode,h,null),ds(h,l),gs(h,l),yt(h.content)&&mn(h.content),he(h)===we.element){let x=O(h);yt(x)&&(ar(x),mn(x))}Ie(M.afterSanitizeShadowDOM,l,null)},ar=function(l){let h=[{node:l,shadow:null}];for(;h.length>0;){let f=h.pop();if(f.shadow){mn(f.shadow);continue}let x=f.node,S=he(x)===we.element,D=N(x);if(D)for(let $=D.length-1;$>=0;--$)h.push({node:D[$],shadow:null});if(S){let $=q?q(x):null;if(typeof $=="string"&&Q($)==="template"){let Y=x.content;yt(Y)&&h.push({node:Y,shadow:null})}}if(S){let $=O(x);yt($)&&h.push({node:null,shadow:$},{node:$,shadow:null})}}};return e.sanitize=function(m){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},h=null,f=null,x=null,S=null;if(er=!m,er&&(m="<!-->"),typeof m!="string"&&!Pt(m)&&(m=pc(m),typeof m!="string"))throw We("dirty is not a string, aborting");if(!e.isSupported)return m;B?(G=J,V=be):sr(l),(M.uponSanitizeElement.length>0||M.uponSanitizeAttribute.length>0)&&(G=_e(G)),M.uponSanitizeAttribute.length>0&&(V=_e(V)),e.removed=[];let D=Qn&&typeof m!="string"&&Pt(m);if(D){io(m);let Se=X(m);if(typeof Se=="string"){let xe=Q(Se);if(!G[xe]||Fe[xe])throw hn(m),We("root node is forbidden and cannot be sanitized in-place")}if(fn(m))throw hn(m),We("root node is clobbered and cannot be sanitized in-place");try{ar(m)}catch(xe){throw hn(m),xe}}else if(Pt(m))h=cs("<!---->"),f=h.ownerDocument.importNode(m,!0),f.nodeType===we.element&&f.nodeName==="BODY"||f.nodeName==="HTML"?h=f:h.appendChild(f),ar(h);else{if(!je&&!w&&!R&&m.indexOf("<")===-1)return Z&&ln?Oe(m):m;if(h=cs(m),!h)return je?null:ln?Ee:""}h&&It&&qe(h.firstChild);let $=D?m:h;try{let Se=us($);for(;x=Se.nextNode();)ds(x,$),gs(x,$),yt(x.content)&&mn(x.content)}catch(Se){throw D&&(hn(m),st(e.removed,xe=>{xe.element&&dn(xe.element)})),Se}if(D){let Se=!1;if(st(e.removed,xe=>{xe.element&&(xe.element===m&&(Se=!0),dn(xe.element))}),Se)throw We("a node selected for removal could not be safely returned; refusing to sanitize in place");return w&&ir(m),m}if(je){if(w&&ir(h),on)for(S=se.call(h.ownerDocument);h.firstChild;)S.appendChild(h.firstChild);else S=h;return(V.shadowroot||V.shadowrootmode)&&(S=Ue.call(r,S,!0)),S}let Y=R?h.outerHTML:h.innerHTML;return R&&G["!doctype"]&&h.ownerDocument&&h.ownerDocument.doctype&&h.ownerDocument.doctype.name&&de(Ec,h.ownerDocument.doctype.name)&&(Y="<!DOCTYPE "+h.ownerDocument.doctype.name+`>
`+Y),w&&(Y=pn(Y)),Z&&ln?Oe(Y):Y},e.setConfig=function(){let m=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};sr(m),B=!0,J=G,be=V},e.clearConfig=function(){bt=null,B=!1,J=null,be=null,Z=Ye,Ee=""},e.isValidAttribute=function(m,l,h){bt||sr({});let f=Q(m),x=Q(l);return ps(f,x,h)},e.addHook=function(m,l){typeof l=="function"&&ye(M,m)&&qt(M[m],l)},e.removeHook=function(m,l){if(ye(M,m)){if(l!==void 0){let h=ac(M[m],l);return h===-1?void 0:oc(M[m],h,1)[0]}return Vi(M[m])}},e.removeHooks=function(m){ye(M,m)&&(M[m]=[])},e.removeAllHooks=function(){M=ia()},e}var Kt=ca();var ua="vitrine",Oc=Object.freeze(["a","abbr","b","blockquote","br","caption","code","col","colgroup","dd","del","details","div","dl","dt","em","figcaption","figure","h1","h2","h3","h4","h5","h6","hr","i","img","input","ins","kbd","li","mark","ol","p","pre","q","s","samp","small","span","strong","sub","summary","sup","table","tbody","td","tfoot","th","thead","tr","u","ul","var"]),ha=Object.freeze(["align","alt","checked","class","colspan","dir","disabled","height","href","lang","open","rowspan","span","src","start","title","type","width"]),Mc=/^language-[\w#+.-]{1,40}$/,Yt;function In(){if(Yt!==void 0)return Yt;Yt=null;let t=globalThis.trustedTypes;if(t&&typeof t.createPolicy=="function")try{Yt=t.createPolicy(ua,{createHTML:e=>e,createScriptURL:e=>e})}catch{console.warn(`[vitrine] Could not create the "${ua}" Trusted Types policy. Add it to your CSP "trusted-types" directive.`)}return Yt??null}function da(t){let e=document.createDocumentFragment();return e.append(document.createTextNode(String(t))),e}var it;function pa(){if(it!==void 0)return it;it=!1;try{if(!Kt.isSupported)return!1;let t=Kt.sanitize('<img src="x" onerror="1"><script>1<\/script><a href="javascript:1">a</a>',{RETURN_DOM_FRAGMENT:!0,...In()?{TRUSTED_TYPES_POLICY:In()}:{}}),e=t.querySelector("img");it=t instanceof DocumentFragment&&e!==null&&!e.hasAttribute("onerror")&&t.querySelector("script")===null&&!t.querySelector("a")?.hasAttribute("href")}catch{it=!1}return it||console.warn("[vitrine] HTML sanitizer unavailable: rich content is shown as plain text."),it}function fa(t,e={}){if(!pa())return da(t);let n=In(),r={ALLOWED_TAGS:[...Oc],ALLOWED_ATTR:e.lineMarkers?[...ha,"data-vt-line"]:[...ha],ALLOW_DATA_ATTR:!1,ALLOW_ARIA_ATTR:!1,ALLOW_UNKNOWN_PROTOCOLS:!1,SAFE_FOR_TEMPLATES:!1,WHOLE_DOCUMENT:!1,RETURN_DOM_FRAGMENT:!0,KEEP_CONTENT:!0};n&&(r.TRUSTED_TYPES_POLICY=n);let s=Kt.sanitize(String(t),r);return Dc(s,e),s}var Ic=/^(?:hljs-[\w-]{1,40}|[a-z]{1,20}_{1,2})$/;function ga(t){if(!pa())return da(t);let e=In(),n={ALLOWED_TAGS:["span"],ALLOWED_ATTR:["class"],ALLOW_DATA_ATTR:!1,ALLOW_ARIA_ATTR:!1,RETURN_DOM_FRAGMENT:!0,KEEP_CONTENT:!0};e&&(n.TRUSTED_TYPES_POLICY=e);let r=Kt.sanitize(String(t),n);for(let s of Array.from(r.querySelectorAll("[class]"))){let i=Array.from(s.classList).filter(a=>Ic.test(a));i.length?s.setAttribute("class",i.join(" ")):s.removeAttribute("class")}return r}function Dc(t,e){let n=e.images??"allow",r=(e.externalLinks??"new-tab")==="new-tab",s=e.baseUrl;for(let i of Array.from(t.querySelectorAll("[data-vt-line]"))){let a=/^(\d{1,9}):(.+)$/.exec(i.getAttribute("data-vt-line")??"");a&&e.lineMarkers&&a[2]===e.lineMarkers&&i.localName==="span"&&!i.hasChildNodes()?i.setAttribute("data-vt-line",a[1]):i.removeAttribute("data-vt-line")}for(let i of Array.from(t.querySelectorAll("[class]"))){let a=Array.from(i.classList).filter(o=>i.localName==="code"&&Mc.test(o));a.length?i.setAttribute("class",a.join(" ")):i.removeAttribute("class")}for(let i of Array.from(t.querySelectorAll("a")))Pc(i,r,s);for(let i of Array.from(t.querySelectorAll("img")))zc(i,n,s);for(let i of Array.from(t.querySelectorAll("input")))i.getAttribute("type")!=="checkbox"?i.remove():i.setAttribute("disabled","")}function ma(t,e){if(!e||t.startsWith("#")||/^[a-z][a-z0-9+.-]*:/i.test(t.trim()))return t;try{return new URL(t,e).href}catch{return t}}function Pc(t,e,n){let r=t.getAttribute("href");if(r===null)return;if(!zt(r)){t.removeAttribute("href");return}let s=ma(r,n);s!==r&&t.setAttribute("href",s),!s.startsWith("#")&&($t(s)||(t.setAttribute("rel","noopener noreferrer nofollow"),e&&/^https?:/i.test(s.trim())&&t.setAttribute("target","_blank")))}function zc(t,e,n){let r=t.getAttribute("src")??"",s=zt(r,{allowDataImage:!0})?ma(r,n):r;if(s!==r&&t.setAttribute("src",s),!(e==="allow"?zt(s,{allowDataImage:!0}):e==="same-origin"&&zt(s)&&$t(s))||!s){let a=t.ownerDocument.createElement("span");a.className="vt-blocked-image",a.textContent=t.getAttribute("alt")||"",a.title=s.length>200?s.slice(0,200)+"\u2026":s,t.replaceWith(a);return}t.setAttribute("loading","lazy"),t.setAttribute("decoding","async"),t.setAttribute("referrerpolicy","no-referrer")}var $c={bash:Li,diff:Oi,javascript:zi,json:$i,markdown:Bi,plaintext:Ui,python:Hi,shell:Fi,xml:ji,yaml:qi};for(let[t,e]of Object.entries($c))Rt.registerLanguage(t,e);Rt.configure({ignoreUnescapedHTML:!0,throwUnescapedHTML:!1});var at=null,ba=new Map;function ya(t){if(typeof t!="string")return null;let e=t.trim().toLowerCase();if(!e||e.length>40)return null;if(Object.prototype.hasOwnProperty.call(Ln,e))return e;if(!at){at=new Map;for(let[n,r]of Object.entries(Ln))for(let s of r.split(" "))s&&!at.has(s)&&at.set(s,n);at.set("text","plaintext"),at.set("plain","plaintext")}return at.get(e)??null}function Dn(t){return!!Rt.getLanguage(t)}function xa(t){if(Dn(t))return Promise.resolve(!0);if(!Object.prototype.hasOwnProperty.call(Ln,t))return Promise.resolve(!1);let e=ba.get(t);if(e)return e;let n=Bc(t);return ba.set(t,n),n}async function Bc(t){let e=ee().languagesUrl||Vs();if(!e)return!1;try{let n=new URL(`${t}.js`,new URL(e.endsWith("/")?e:`${e}/`,document.baseURI));if(n.protocol!=="https:"&&n.protocol!=="http:")return!1;let r=await import(n.href);return typeof r.default!="function"?!1:(Rt.registerLanguage(t,r.default),!0)}catch(n){return console.warn(`[vitrine] Could not load the "${t}" language.`,n),!1}}function Pn(t,e){if(e==="plaintext"||!Dn(e)){let r=document.createDocumentFragment();return r.append(document.createTextNode(t)),r}let n=Rt.highlight(t,{language:e,ignoreIllegals:!0});return ga(n.value)}function va(t){let e=[],n=[],r=document.createDocumentFragment(),s=r,i=()=>{e.push(r),r=document.createDocumentFragment(),s=r;for(let o of n){let c=o.cloneNode(!1);s.appendChild(c),s=c}},a=o=>{if(o.nodeType===Node.TEXT_NODE){(o.nodeValue??"").split(`
`).forEach((d,p)=>{p>0&&i(),d&&s.appendChild(document.createTextNode(d))});return}if(o.nodeType!==Node.ELEMENT_NODE)return;let c=o;s.appendChild(c.cloneNode(!1)),s=s.lastChild,n.push(c);for(let u of Array.from(c.childNodes))a(u);n.pop(),s=s.parentNode};for(let o of Array.from(t.childNodes))a(o);return e.push(r),e}var Uc=1e3,wa=200;function Hc(t){let e=[],n=[];for(let r of t)r.startsWith("@@")?(e.push("hunk"),n.push(r)):/^(?:\+\+\+|---)(?: |$)|^diff |^index /.test(r)?(e.push("meta"),n.push(r)):r.startsWith("+")?(e.push("added"),n.push(r.slice(1))):r.startsWith("-")?(e.push("removed"),n.push(r.slice(1))):(e.push("context"),n.push(r.startsWith(" ")?r.slice(1):r));return{kinds:e,code:n}}function ot(t,e){let r=(t.endsWith(`
`)&&!e.trailingNewline?t.slice(0,-1):t).split(`
`),s=null;if(e.diff){let O=Hc(r);s=O.kinds,r=O.code}let i=r.join(`
`),a=i.length>e.highlightLimit,o=a||e.language==="plaintext",c=o?null:va(Pn(i,e.language)),u=o?i.split(`
`):null,d=c?c.length:u.length,p=e.startLine+d-1,y=Math.max(String(e.startLine).length,String(p).length),v=b("pre",{class:"code",part:"code"});v.style.setProperty("--_digits",String(y));let _=O=>{let F=e.startLine+O,P=s?.[O],q=b("span",{class:"line",part:"line",attrs:{"data-line":F}});if(e.highlightRanges.length&&vs(F,e.highlightRanges)&&(q.classList.add("highlighted"),q.setAttribute("part","line line-highlighted")),P&&P!=="context"&&q.classList.add(P),e.lineNumbers&&q.append(b("span",{class:"gutter",part:"gutter line-number",attrs:{"aria-hidden":"true","data-n":F}})),s){let he=P==="added"?e.diffLabels?.added:P==="removed"?e.diffLabels?.removed:"";q.append(b("span",{class:"sign"},he?b("span",{class:"sr-only",text:`${he}: `}):null))}let K=b("span",{class:"content"});return c?K.append(c[O]):u?.[O]&&K.append(u[O]),O<d-1&&K.append(`
`),q.append(K),q},C=(O,F,P)=>{let q=document.createDocumentFragment();for(let K=F;K<P;K+=1)q.appendChild(_(K));O.appendChild(q)},N=document.createDocumentFragment();if(e.chunk!==!1&&d>Uc)for(let O=0;O<d;O+=wa){let F=Math.min(d,O+wa),P=b("span",{class:"chunk",attrs:{"data-first":e.startLine+O,"data-count":F-O}});P.style.setProperty("--_chunk-lines",String(F-O)),N.append(P),O===0?C(P,O,F):(P.setAttribute("data-pending",""),ti(P,()=>{P.removeAttribute("data-pending"),C(P,O,F)}))}else C(N,0,d);return v.append(N),{element:b("div",{class:"code-view"},v),code:v,lineCount:d,highlightSkipped:a}}function Xt(t){t&&(t.closest(".chunk")?.classList.add("revealed"),t.scrollIntoView({block:"nearest",inline:"nearest"}))}var zn=class{constructor(e){this.steps=[{value:e,start:0,end:0}],this.index=0,this.lastKind="",this.lastTime=0,this.listeners=new Set}get canUndo(){return this.index>0}get canRedo(){return this.index<this.steps.length-1}get current(){return this.steps[this.index]}record(e,n){if(e.value===this.current.value)return;let r=Date.now(),i=(n==="insertText"||n.startsWith("delete"))&&n===this.lastKind&&r-this.lastTime<600&&!this.canRedo;this.steps.length=this.index+1,i&&this.index>0?this.steps[this.index]=e:(this.steps.push(e),this.index+=1),this.lastKind=n,this.lastTime=r,this.trim(),this.notify()}undo(){return this.canUndo?(this.index-=1,this.lastKind="",this.notify(),this.current):null}redo(){return this.canRedo?(this.index+=1,this.lastKind="",this.notify(),this.current):null}trim(){let e=this.steps.reduce((n,r)=>n+r.value.length,0);for(;this.steps.length>1&&(this.steps.length>300||e>2e7)&&this.index>0;)e-=this.steps.shift().value.length,this.index-=1}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){for(let e of this.listeners)e()}};var Fc=6e4,jc=250,$n="  ",Lt=class{constructor(e){this.options=e,this.text=e.text,this.tabReleased=!1,this.changedSinceFocus=!1,this.timer=void 0,this.textarea=b("textarea",{class:"editor-input",part:"editor",attrs:{"aria-label":e.label,placeholder:e.placeholder??null,spellcheck:"false",autocapitalize:"off",autocomplete:"off",autocorrect:"off",wrap:e.wrap?"soft":"off","data-focus-key":"editor"}}),this.textarea.value=e.text,this.history=e.history&&e.history.current.value===e.text?e.history:new zn(e.text),this.layer=this.buildLayer(e.text),this.element=b("div",{class:e.wrap?"editor wrap":"editor"},this.layer,this.textarea),this.textarea.addEventListener("input",n=>this.onInput(n.inputType||"other")),this.textarea.addEventListener("beforeinput",n=>{(n.inputType==="historyUndo"||n.inputType==="historyRedo")&&(n.preventDefault(),n.inputType==="historyUndo"?this.undo():this.redo())}),this.textarea.addEventListener("keydown",n=>this.onKeyDown(n)),this.textarea.addEventListener("focus",()=>{this.changedSinceFocus=!1}),this.textarea.addEventListener("blur",()=>{this.changedSinceFocus&&e.onChange?.(this.text)})}buildLayer(e){let n=ot(e,{language:this.options.language,lineNumbers:this.options.lineNumbers,startLine:1,highlightRanges:this.options.highlightRanges??[],diff:!1,highlightLimit:this.options.highlightLimit,trailingNewline:!0,chunk:!1});return n.element.classList.add("editor-layer"),n.element.setAttribute("aria-hidden","true"),n.element}refresh(){clearTimeout(this.timer);let e=this.buildLayer(this.text);this.layer.replaceWith(e),this.layer=e,this.element.classList.remove("pending"),this.align()}align(){let e=this.layer.querySelector(".gutter"),n=e?e.getBoundingClientRect().width:0;this.element.style.setProperty("--_editor-gutter",`${n}px`)}setHighlightRanges(e){this.options.highlightRanges=e,this.refresh()}onInput(e){this.text=this.textarea.value.replace(/\r\n?/g,`
`),this.changedSinceFocus=!0,this.history.record({value:this.text,start:this.textarea.selectionStart,end:this.textarea.selectionEnd},e),this.text.length<=Fc?this.refresh():(this.element.classList.add("pending"),clearTimeout(this.timer),this.timer=setTimeout(()=>this.refresh(),jc)),this.options.onInput(this.text)}onKeyDown(e){let n=e.ctrlKey||e.metaKey,r=e.key.toLowerCase();if(n&&!e.altKey&&(r==="z"||r==="y")){e.preventDefault(),r==="y"||e.shiftKey?this.redo():this.undo();return}if(e.key==="Escape"){this.tabReleased=!0;return}if(e.key==="Tab"&&!this.tabReleased&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault(),e.shiftKey?this.outdent():this.indent();return}if(e.key!=="Tab"&&(this.tabReleased=!1),e.key==="Enter"&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.isComposing){let{value:s,selectionStart:i}=this.textarea,a=s.lastIndexOf(`
`,i-1)+1,o=/^[ \t]*/.exec(s.slice(a,i))?.[0]??"";o&&(e.preventDefault(),this.insert(`
${o}`))}}indent(){let{value:e,selectionStart:n,selectionEnd:r}=this.textarea;if(n===r||!e.slice(n,r).includes(`
`)){this.insert($n);return}let s=e.lastIndexOf(`
`,n-1)+1,i=e.slice(s,r),a=i.replace(/^/gm,$n);this.replaceRange(s,r,a),this.textarea.setSelectionRange(n+$n.length,r+(a.length-i.length))}outdent(){let{value:e,selectionStart:n,selectionEnd:r}=this.textarea,s=e.lastIndexOf(`
`,n-1)+1,i=e.slice(s,r),a=new RegExp(`^(?:\\t| {1,${$n.length}})`,"gm"),o=(/^(?:\t| {1,2})/.exec(i)?.[0]??"").length,c=i.replace(a,"");c!==i&&(this.replaceRange(s,r,c),this.textarea.setSelectionRange(Math.max(s,n-o),r-(i.length-c.length)))}insert(e){this.textarea.focus(),document.execCommand?.("insertText",!1,e)||(this.textarea.setRangeText(e,this.textarea.selectionStart,this.textarea.selectionEnd,"end"),this.onInput("insertText"))}replaceRange(e,n,r){this.textarea.setSelectionRange(e,n),this.insert(r)}undo(){this.restore(this.history.undo())}redo(){this.restore(this.history.redo())}restore(e){e&&(this.textarea.value=e.value,this.textarea.focus(),this.textarea.setSelectionRange(e.start,e.end),this.text=e.value,this.changedSinceFocus=!0,this.refresh(),this.options.onInput(this.text))}destroy(){clearTimeout(this.timer)}};var pe=class extends Error{constructor(e,n,r=!1){super(e),this.offset=n,this.tooDeep=r}},_a=/-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y,ka={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:`
`,r:"\r",t:"	"};function Ta(t,{maxDepth:e}){try{let{value:n,count:r}=new Lr(t,e).parse();return{ok:!0,value:n,count:r}}catch(n){if(!(n instanceof pe))throw n;let{line:r,column:s}=qc(t,n.offset);return{ok:!1,error:{message:n.message,offset:n.offset,line:r,column:s,tooDeep:n.tooDeep}}}}function qc(t,e){let n=1,r=0,s=Math.min(e,t.length);for(let i=t.indexOf(`
`);i!==-1&&i<s;i=t.indexOf(`
`,i+1))n+=1,r=i+1;return{line:n,column:s-r+1}}var Lr=class{constructor(e,n){this.text=e,this.maxDepth=n,this.i=e.charCodeAt(0)===65279?1:0,this.count=0}parse(){let e=this.text,n=[],r=null,s="",i="value";for(;;){this.skipWhitespace();let a=e[this.i],o=n[n.length-1];if(i==="value"){if(a===void 0)throw new pe("Unexpected end of input",this.i);let u=o??null,d=u?.type==="object"?s:u?u.items.length:null;if(a==="{"||a==="["){if(n.length>=this.maxDepth)throw new pe(`Nesting deeper than ${this.maxDepth} levels`,this.i,!0);let y=a==="{"?{type:"object",entries:[],id:this.count++,parent:u,key:d}:{type:"array",items:[],id:this.count++,parent:u,key:d};this.i+=1,u?Ea(u,y,s):r=y,n.push(y),this.skipWhitespace(),e[this.i]===(a==="{"?"}":"]")?(this.i+=1,n.pop(),i="after"):i=a==="{"?"key":"value";continue}let p=this.readPrimitive(u,d);u?Ea(u,p,s):r=p,i="after";continue}if(i==="key"){if(a!=='"')throw new pe(a===void 0?"Unexpected end of input":"Expected a property name in double quotes",this.i);if(s=this.readString(),this.skipWhitespace(),e[this.i]!==":")throw new pe('Expected ":" after the property name',this.i);this.i+=1,i="value";continue}if(!o){if(a!==void 0)throw new pe("Unexpected content after the JSON value",this.i);return{value:r,count:this.count}}let c=o.type==="object"?"}":"]";if(a===","){if(this.i+=1,this.skipWhitespace(),e[this.i]===c)throw new pe("Trailing comma",this.i-1);i=o.type==="object"?"key":"value"}else if(a===c)this.i+=1,n.pop();else throw new pe(a===void 0?"Unexpected end of input":`Expected "," or "${c}"`,this.i)}}skipWhitespace(){let e=this.text,n=e.charCodeAt(this.i);for(;n===32||n===10||n===13||n===9;)this.i+=1,n=e.charCodeAt(this.i)}readPrimitive(e,n){let r=this.text,s=r[this.i],i=this.count++;if(s==='"')return{type:"string",value:this.readString(),id:i,parent:e,key:n};if(s==="-"||s>="0"&&s<="9"){_a.lastIndex=this.i;let o=_a.exec(r);if(!o)throw new pe("Invalid number",this.i);return this.i+=o[0].length,{type:"number",raw:o[0],id:i,parent:e,key:n}}for(let[o,c]of[["true",{type:"boolean",value:!0}],["false",{type:"boolean",value:!1}],["null",{type:"null"}]])if(r.startsWith(o,this.i))return this.i+=o.length,{...c,id:i,parent:e,key:n};let a=/[\x20-\x7e]/.test(s)?`"${s}"`:`U+${s.codePointAt(0)?.toString(16).toUpperCase().padStart(4,"0")}`;throw new pe(`Unexpected character ${a}`,this.i)}readString(){let e=this.text,n=this.i;this.i+=1;let r="",s=this.i;for(;;){let i=e.charCodeAt(this.i);if(Number.isNaN(i))throw new pe("Unterminated string",n);if(i===34)break;if(i<32)throw new pe("Control character in string (escape it)",this.i);if(i===92){r+=e.slice(s,this.i);let a=e[this.i+1];if(a==="u"){let o=e.slice(this.i+2,this.i+6);if(!/^[0-9a-fA-F]{4}$/.test(o))throw new pe("Invalid \\u escape",this.i);r+=String.fromCharCode(parseInt(o,16)),this.i+=6}else if(a!==void 0&&Object.prototype.hasOwnProperty.call(ka,a))r+=ka[a],this.i+=2;else throw new pe("Invalid escape sequence",this.i);s=this.i;continue}this.i+=1}return r+=e.slice(s,this.i),this.i+=1,r}};function Ea(t,e,n){t.type==="object"?t.entries.push({key:n,value:e}):t.items.push(e)}function Or(t,{indent:e,sortKeys:n}){let r=[],s=" ".repeat(e),i=e?`
`:"",a=e?": ":":",o=[[t,0]];for(;o.length;){let[c,u]=o.pop();if(typeof c=="string"){r.push(c);continue}let d=i+s.repeat(u+1),p=i+s.repeat(u);if(c.type==="object"){let y=n?Mr(c):c.entries;if(!y.length){r.push("{}");continue}let v=[["{",u]];y.forEach((_,C)=>{v.push([`${C?",":""}${d}${JSON.stringify(_.key)}${a}`,u],[_.value,u+1])}),v.push([`${p}}`,u]);for(let _=v.length-1;_>=0;_-=1)o.push(v[_])}else if(c.type==="array"){if(!c.items.length){r.push("[]");continue}let y=[["[",u]];c.items.forEach((v,_)=>y.push([`${_?",":""}${d}`,u],[v,u+1])),y.push([`${p}]`,u]);for(let v=y.length-1;v>=0;v-=1)o.push(y[v])}else r.push(Gc(c))}return r.join("")}function Mr(t){return[...t.entries].sort((e,n)=>e.key<n.key?-1:e.key>n.key?1:0)}function Gc(t){switch(t.type){case"string":return JSON.stringify(t.value);case"number":return t.raw;case"boolean":return String(t.value);case"null":return"null";default:return""}}var Wc=/^[A-Za-z_$][\w$]*$/;function Bn(t){let e=[],n=t;for(;n&&n.parent;){let r=n.key;typeof r=="number"?e.push(`[${r}]`):Wc.test(String(r))?e.push(`.${r}`):e.push(`[${JSON.stringify(r)}]`),n=n.parent}return`$${e.reverse().join("")}`}var ze=100,Vc=5e3,Kc=2e4,Sa=500,Yc=120,Un=class{constructor(e,n){this.root=e,this.options=n,this.expanded=new Map,this.defaultDepth=n.depth,this.shown=new Map,this.fullStrings=new Set,this.selected=e,this.matches=[],this.current=-1,this.query="",this.info=new WeakMap,this.items=new Map,this.rendered=0,this.element=b("ul",{class:"tree",part:"tree",attrs:{role:"tree","aria-label":n.label}}),this.element.addEventListener("keydown",r=>this.onKeyDown(r)),this.element.addEventListener("click",r=>this.onClick(r))}children(e){return e.type==="object"?(this.options.sortKeys?Mr(e):e.entries).map(r=>({node:r.value,label:r.key})):e.type==="array"?e.items.map((n,r)=>({node:n,label:r})):[]}isExpanded(e,n){return e.type!=="object"&&e.type!=="array"?!1:this.expanded.get(e.id)??n<=this.defaultDepth}render(){this.items.clear(),this.rendered=0;let e=this.renderItem({node:this.root,label:null},1,1,1);this.element.replaceChildren(e),(this.items.get(this.selected.id)??e).setAttribute("tabindex","0")}renderItem(e,n,r,s){let{node:i,label:a}=e;this.rendered+=1;let o=i.type==="object"||i.type==="array",c=this.isExpanded(i,n),u=b("li",{class:`item ${i.type}`,part:"tree-item",attrs:{role:"treeitem","aria-level":n,"aria-setsize":s,"aria-posinset":r,"aria-expanded":o?String(c):null,"aria-selected":String(i===this.selected),tabindex:"-1"}});return this.info.set(u,{node:i,label:a,level:n,pos:r,size:s}),this.items.set(i.id,u),u.append(this.renderRow(i,a,n,o,c)),o&&c&&u.append(this.renderGroup(i,n)),u}renderRow(e,n,r,s,i){let{locale:a}=this.options,o=b("div",{class:"row",part:"row"});o.style.setProperty("--_level",String(r-1));let c=b("span",{class:s?"toggle":"toggle leaf",part:"tree-toggle",attrs:{"aria-hidden":"true"}});if(s&&c.append(ve("chevron-right")),o.append(c),n!==null){let u=typeof n=="number",d=u?String(n):Jc(Zc(n),Yc);o.append(b("span",{class:u?"index hljs-number":"key hljs-attr",part:u?"index":"key",text:d}),b("span",{class:"punct hljs-punctuation",text:": "}))}if(s){let u=e,d=u.type==="object"?u.entries.length:u.items.length,[p,y]=e.type==="object"?["{","}"]:["[","]"];o.append(b("span",{class:"punct hljs-punctuation",text:i||d===0?`${p}${d?"":y}`:`${p}\u2026${y}`}));let v=e.type==="object"?d===1?"key":"keys":d===1?"item":"items";o.append(b("span",{class:"count",part:"count",text:this.options.t(v,{count:kt(d,a)})}))}else o.append(this.renderValue(e));return this.options.showTypes&&o.append(b("span",{class:"type",part:"type-badge",text:e.type})),this.decorate(o,e),o}renderValue(e){if(e.type==="string"){let s=this.fullStrings.has(e.id)||e.value.length<=Sa,i=s?JSON.stringify(e.value):`${JSON.stringify(e.value.slice(0,Sa)).slice(0,-1)}\u2026"`,a=b("span",{class:"value string hljs-string",part:"value",text:i});if(!s){let o=b("button",{class:"inline-more",text:this.options.t("showFullString",{count:kt(e.value.length,this.options.locale)}),attrs:{type:"button",tabindex:"-1","data-action":"full-string"}});return b("span",{class:"value-wrap"},a,o)}return a}let n=e.type==="number"?e.raw:e.type==="boolean"?String(e.value):"null",r=e.type==="number"?"number":"literal";return b("span",{class:`value ${r} ${r==="number"?"hljs-number":"hljs-literal"}`,part:"value",text:n})}renderGroup(e,n){let r=b("ul",{class:"group",attrs:{role:"group"}}),s=this.children(e),i=Math.min(s.length,this.shown.get(e.id)??ze);for(let o=0;o<i&&!(this.rendered>=Kc);o+=1)r.append(this.renderItem(s[o],n+1,o+1,s.length));let a=s.length-Math.min(i,r.children.length);if(a>0){let o=Math.min(ze,a),c=b("li",{class:"item more-item",part:"more-item",attrs:{role:"treeitem","aria-level":n+1,tabindex:"-1","data-action":"more"}},b("div",{class:"row",part:"row"},b("span",{class:"toggle leaf"}),b("span",{class:"more-label",text:this.options.t("showMoreItems",{count:kt(o,this.options.locale)})})));c.firstElementChild.style.setProperty("--_level",String(n)),this.info.set(c,{node:e,label:null,level:n+1,pos:0,size:0}),r.append(c)}return r}decorate(e,n){if(!this.query)return;let r=this.matches[this.current];for(let s of this.matches){if(s.node!==n)continue;let i=e.querySelector(s.field==="key"?".key":".value");if(!i)continue;let a=new Pe(i);if(a.run(this.query),r===s)for(let o of a.matches)for(let c of o)c.classList.add("current")}}toggle(e,n){let r=this.info.get(e);if(!r||r.node.type!=="object"&&r.node.type!=="array")return;let s=n??!this.isExpanded(r.node,r.level);this.expanded.set(r.node.id,s),this.replaceItem(e,r)}replaceItem(e,n){this.rendered=0;let r=this.renderItem({node:n.node,label:n.label},n.level,n.pos,n.size);return e.replaceWith(r),this.focusItem(r),r}showMore(e){let n=this.info.get(e);if(!n)return;let r=n.node;this.shown.set(r.id,(this.shown.get(r.id)??ze)+ze);let s=e.closest('ul[role="group"]')?.parentElement??null,i=s?this.info.get(s):null;if(!s||!i)return;let a=(this.shown.get(r.id)??ze)-ze,c=this.replaceItem(s,i).querySelector(`:scope > ul > li:nth-child(${a+1})`);c instanceof HTMLElement&&this.focusItem(c)}expandAll(){this.expanded.clear(),this.defaultDepth=0;let e=Vc,n=[this.root],r=!0;for(;n.length;){let s=[];for(let i of n){if(i.type!=="object"&&i.type!=="array")continue;let a=this.children(i);if(e<=0){r=!1;break}this.expanded.set(i.id,!0);let o=a.slice(0,this.shown.get(i.id)??ze);e-=o.length;for(let c of o)s.push(c.node)}if(!r)break;n=s}return this.render(),r}collapseAll(){this.expanded.clear(),this.defaultDepth=1,this.shown.clear(),this.render()}search(e){this.query=e,this.matches=[],this.current=-1;let n=!1;if(e){let r=e.toLowerCase(),s=[{node:this.root,label:null}];for(;s.length;){let{node:i,label:a}=s.pop();if(typeof a=="string"&&a.toLowerCase().includes(r)&&this.matches.push({node:i,field:"key"}),i.type!=="object"&&i.type!=="array"&&Xc(i).toLowerCase().includes(r)&&this.matches.push({node:i,field:"value"}),this.matches.length>=wn){n=!0,this.matches.length=wn;break}let o=this.children(i);for(let c=o.length-1;c>=0;c-=1)s.push(o[c])}}return this.render(),{total:this.matches.length,capped:n}}goToMatch(e){let n=this.matches[e];if(!n)return;this.current=e,this.reveal(n.node),this.selected=n.node,this.render(),this.items.get(n.node.id)?.querySelector("mark.current")?.scrollIntoView({block:"nearest",inline:"nearest"}),this.options.onSelect(n.node)}reveal(e){let n=e;for(;n.parent;){let r=n.parent;this.expanded.set(r.id,!0);let s=this.children(r).findIndex(a=>a.node===n),i=Math.ceil((s+1)/ze)*ze;i>(this.shown.get(r.id)??ze)&&this.shown.set(r.id,i),n=r}}visibleItems(){return Array.from(this.element.querySelectorAll('[role="treeitem"]'))}focusItem(e){for(let r of this.element.querySelectorAll('[tabindex="0"]'))r.setAttribute("tabindex","-1");e.setAttribute("tabindex","0"),e.focus({preventScroll:!0}),e.scrollIntoView({block:"nearest",inline:"nearest"});let n=this.info.get(e);n&&e.dataset.action!=="more"&&(this.element.querySelector('[aria-selected="true"]')?.setAttribute("aria-selected","false"),e.setAttribute("aria-selected","true"),this.selected=n.node,this.options.onSelect(n.node))}onKeyDown(e){let n=e.target.closest?.('[role="treeitem"]');if(!n)return;let r=this.visibleItems(),s=r.indexOf(n),i=this.info.get(n),a=i&&n.dataset.action!=="more"&&(i.node.type==="object"||i.node.type==="array"),o=n.getAttribute("aria-expanded")==="true",c=!0;switch(e.key){case"ArrowDown":r[s+1]&&this.focusItem(r[s+1]);break;case"ArrowUp":r[s-1]&&this.focusItem(r[s-1]);break;case"Home":r[0]&&this.focusItem(r[0]);break;case"End":r.length&&this.focusItem(r[r.length-1]);break;case"ArrowRight":a&&!o?this.toggle(n,!0):a&&r[s+1]&&this.focusItem(r[s+1]);break;case"ArrowLeft":{if(a&&o)this.toggle(n,!1);else{let u=n.parentElement?.closest('[role="treeitem"]');u instanceof HTMLElement&&this.focusItem(u)}break}case"Enter":case" ":this.activate(n);break;default:c=!1}c&&(e.preventDefault(),e.stopPropagation())}activate(e){e.dataset.action==="more"?this.showMore(e):e.querySelector(':scope > .row [data-action="full-string"]')?this.showFullString(e):this.toggle(e)}showFullString(e){let n=this.info.get(e);n&&(this.fullStrings.add(n.node.id),this.replaceItem(e,n))}onClick(e){let n=e.target,r=n.closest?.('[role="treeitem"]');r&&(n.closest('[data-action="full-string"]')?this.showFullString(r):r.dataset.action==="more"?this.showMore(r):n.closest(".toggle:not(.leaf)")?this.toggle(r):this.focusItem(r))}};function Xc(t){return t.type==="string"?t.value:t.type==="number"?t.raw:t.type==="boolean"?String(t.value):"null"}function Zc(t){return t===""||/[\u0000-\u001f\u007f]/.test(t)?JSON.stringify(t):t}function Jc(t,e){return t.length>e?`${t.slice(0,e)}\u2026`:t}var Qc=["tree","raw"],Ir=class extends Tt{static type="json";static componentAttributes=Object.freeze(["view","tabs","depth","indent","sort-keys","show-types","expand-controls","path","line-numbers","on-invalid"]);static presets={simple:{},full:{header:!0,dot:!0,copy:!0,search:!0,download:!0,tabs:!0,"show-types":!0,"expand-controls":!0,path:!0,"line-numbers":!0,fullscreen:!0}};static styles=[wt,bn,ys];static upgradeProperties=["content","data"];constructor(){super(),this.viewState=null,this.panelId=_t("panel"),this.parsed=null,this.treeCache=null,this.rawCache=null,this.invalidReported=!1,this.pathText=null,this.editor=null,this.status=null,this.errorLine=0,this.validateTimer=void 0}get data(){return this.parse()?.ok?JSON.parse(this.text??"null"):void 0}set data(e){let n;try{n=JSON.stringify(e,null,2)}catch(r){this._content="",this.setError(new Error(this.t("unserializable"),{cause:r}));return}this.content=n===void 0?"":n}attributeChangedCallback(e,n,r){e==="view"&&(this.viewState=null),super.attributeChangedCallback(e,n,r)}contentChanged(){this.parsed=null,this.treeCache=null,this.rawCache=null,this.invalidReported=!1}parse(){if(this.text===null)return null;let e=ee().maxDepth;return(!this.parsed||this.parsed.text!==this.text||this.parsed.maxDepth!==e)&&(this.parsed={text:this.text,maxDepth:e,result:Ta(this.text,{maxDepth:e})}),this.parsed.result}get view(){let e=this.editing||this.variant!=="full"?"raw":"tree";return this.viewState??Ne(this.getAttribute("view"),Qc,e)}get format(){return{indent:lr(this.getAttribute("indent"),{min:0,max:8,fallback:2}),sortKeys:this.feature("sort-keys")}}prettyText(e){let n=JSON.stringify(this.format);return(!this.rawCache||this.rawCache.key!==n)&&(this.rawCache={key:n,text:Or(e,this.format)}),this.rawCache.text}renderContent(e){let n=this.parse();if(!n)return;if(this.editing&&this.view==="raw"){this.renderEditor(e,n);return}if(!n.ok){this.renderInvalid(e,n.error);return}let r=n.value,s=this.view,i,a,o=null;if(s==="tree"){o=this.treeFor(r),o.render(),a=[b("div",{class:"body tree-body",part:"body"},o.element)],this.feature("path")&&a.push(this.pathBar(o));let y=o;i={run:v=>y.search(v),go:v=>y.goToMatch(v),clear:()=>y.search("")}}else{let p=this.prettyText(r),y=ot(p,{language:"json",lineNumbers:this.feature("line-numbers"),startLine:1,highlightRanges:[],diff:!1,highlightLimit:ee().highlightLimit}),v=new Pe(y.code);i={run:_=>v.run(_),go:_=>Xt(v.go(_)),clear:()=>v.clear()},a=[b("div",{class:"body",part:"body",attrs:{tabindex:"0",role:"region","aria-label":this.heading||"JSON"}},y.element)],y.highlightSkipped&&a.unshift(gr(this.t("highlightSkipped")))}let c=[this.searchButton(i),o&&this.feature("expand-controls")?this.expandButtons(o):null,this.editToggleButton(),this.fullscreenButton(),this.feature("download")?this.downloadButton(()=>this.prettyText(r),this.downloadName("data.json"),"application/json"):null,this.feature("copy")?this.copyButton(()=>this.prettyText(r),this.t("copy")):null].flat(),u=this.viewTabs(s),d=b("div",{class:"panel",attrs:{id:this.panelId,role:u?"tabpanel":null}},...a);e.append(...this.chrome({badge:u?"":"JSON",tabs:u,actions:c}),d)}viewTabs(e){return this.feature("tabs")?En({tabs:[{id:"tree",label:this.t("tree"),icon:"list"},{id:"raw",label:this.t("raw"),icon:"code"}],selected:e,label:this.t("tabs"),panelId:this.panelId,onSelect:n=>this.selectView(n)}):null}renderEditor(e,n){let r=this.t,s=n.ok?null:n.error;this.editor?.destroy();let i=new Lt({text:this.text??"",language:"json",lineNumbers:this.feature("line-numbers"),wrap:!1,highlightRanges:s?[[s.line,s.line]]:[],highlightLimit:ee().highlightLimit,label:this.heading||`JSON ${r("editor").toLowerCase()}`,placeholder:this.getAttribute("placeholder")??void 0,onInput:p=>this.edited(p),onChange:p=>ce(this,le.CHANGE,{value:p}),history:this.editHistory??void 0});this.editor=i,this.errorLine=s?.line??0,this.status=b("div",{class:"edit-status",part:"status",attrs:{role:"status"}}),this.showStatus(n);let a=null,o={run:p=>(a=new Pe(i.layer.querySelector("pre.code")),a.run(p)),go:p=>Xt(a?.go(p)??null),clear:()=>a?.clear()},c=this.viewTabs("raw"),u=[this.searchButton(o),...this.historyButtons(i),this.editToggleButton(),this.fullscreenButton(),this.feature("download")?this.downloadButton(()=>this.text??"",this.downloadName("data.json"),"application/json"):null,this.feature("copy")?this.copyButton(()=>this.text??"",r("copy")):null],d=b("div",{class:"panel",attrs:{id:this.panelId,role:c?"tabpanel":null}},b("div",{class:"body editor-body",part:"body"},i.element),De(this.getAttribute("status"))===!1?null:this.status);e.append(...this.chrome({badge:c?"":"JSON",tabs:c,actions:u}),d),i.align()}showStatus(e){if(!this.status)return;let n=this.t,r=n("validJson");if(!e.ok){let{error:s}=e;r=s.tooDeep?n("tooDeep",{limit:ee().maxDepth}):n("invalidJson",{line:s.line,column:s.column,message:s.message})}this.status.className=`edit-status ${e.ok?"ok":"bad"}`,this.status.replaceChildren(ve(e.ok?"check":"alert"),b("span",{text:r}))}contentEdited(){this.treeCache=null,this.rawCache=null,this.invalidReported=!1,clearTimeout(this.validateTimer),this.validateTimer=setTimeout(()=>{let e=this.parse();if(!e)return;this.showStatus(e);let n=e.ok?0:e.error.line;n!==this.errorLine&&(this.errorLine=n,this.editor?.setHighlightRanges(n?[[n,n]]:[])),this.searchOpen&&this.searchQuery&&this.searchBar?.run()},150)}treeFor(e){let n={t:this.t,locale:this.locale,depth:lr(this.getAttribute("depth"),{min:0,max:1e3,fallback:2}),sortKeys:this.feature("sort-keys"),showTypes:this.feature("show-types"),label:this.heading||"JSON",onSelect:s=>this.updatePath(s)},r=JSON.stringify({...n,t:void 0,onSelect:void 0});return!this.treeCache||this.treeCache.key!==r?this.treeCache={key:r,tree:new Un(e,n)}:this.treeCache.tree.options=n,this.treeCache.tree}expandButtons(e){return[ie({icon:"expand-all",label:this.t("expandAll"),key:"expand-all",onClick:()=>{e.expandAll()||this.announce(this.t("truncated"))}}),ie({icon:"collapse-all",label:this.t("collapseAll"),key:"collapse-all",onClick:()=>e.collapseAll()})]}pathBar(e){this.pathText=b("code",{class:"path-text",text:Bn(e.selected)});let n=this.copyTextButton(()=>Bn(e.selected),this.t("copyPath"),"copy-path"),r=this.copyTextButton(()=>eu(e.selected,this.format),this.t("copyValue"),"copy-value");return b("div",{class:"pathbar",part:"path"},this.pathText,b("div",{class:"toolbar"},n,r))}updatePath(e){this.pathText&&(this.pathText.textContent=Bn(e))}renderInvalid(e,n){let r=this.t,s=Ne(this.getAttribute("on-invalid"),["error","raw"],"error"),i=n.tooDeep?r("tooDeep",{limit:ee().maxDepth}):r("invalidJson",{line:n.line,column:n.column,message:n.message}),a=ot(this.text??"",{language:"plaintext",lineNumbers:!0,startLine:1,highlightRanges:[[n.line,n.line]],diff:!1,highlightLimit:0}),o=b("div",{class:"body",part:"body",attrs:{tabindex:"0",role:"region","aria-label":this.heading||"JSON"}},a.element);e.append(...this.chrome({badge:"JSON",actions:[this.editToggleButton(),this.fullscreenButton(),this.feature("copy")?this.copyButton(()=>this.text??""):null]}),s==="raw"?gr(r("invalidJsonRaw",{line:n.line,column:n.column})):Et(r("errorTitle"),i),o),requestAnimationFrame(()=>{let c=ri(o,n.line);c instanceof HTMLElement&&(o.scrollTop=Math.max(0,c.offsetTop-o.clientHeight/2))}),this._readyPending=!1,this.invalidReported||(this.invalidReported=!0,ce(this,le.ERROR,{message:i,cause:n}))}selectView(e){e!==this.view&&(this.viewState=e,this.render(),this.root.querySelector(`[data-tab="${e}"]`)?.focus(),ce(this,le.TAB_CHANGE,{tab:e}))}};function eu(t,e){return t.type==="string"?t.value:Or(t,e)}var Aa=`/*
 * Rendered Markdown. The content inherits the host page font (it is the host's content);
 * only the chrome uses the UI font. Spec: docs/DESIGN_SYSTEM.md \xA73.3.
 */
.vt.md {
  font-family: var(--vt-font-body, inherit);
  font-size: var(--vt-font-size-body, inherit);
}

.vt {
  container-type: inline-size;
}

.panel {
  min-width: 0;
}

.panel.split {
  /* Panes scroll on their own so they can be kept in sync; max-height sets their size. */
  --_split-height: var(--_max-height, min(70vh, 640px));
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.panel.split > .body {
  height: var(--_split-height);
  max-height: none;
}

.panel.split > .body + .body {
  border-left: 1px solid var(--_border);
}

.panel.split:is([data-preview='top'], [data-preview='bottom']) {
  grid-template-columns: minmax(0, 1fr);
}

.panel.split:is([data-preview='top'], [data-preview='bottom']) > .body {
  height: calc(var(--_split-height) / 2);
}

.panel.split:is([data-preview='top'], [data-preview='bottom']) > .body + .body {
  border-top: 1px solid var(--_border);
  border-left: 0;
}

@container (max-width: 640px) {
  .panel.split {
    grid-template-columns: minmax(0, 1fr);
  }

  .panel.split > .body {
    height: calc(var(--_split-height) / 2);
  }

  .panel.split > .body + .body {
    border-top: 1px solid var(--_border);
    border-left: 0;
  }
}

.md-body {
  padding: var(--_space-5);
  background: var(--_surface);
}

/* ---------- Table of contents ---------- */

.toc {
  margin: 0 0 var(--_space-5);
  padding: var(--_space-2) var(--_space-3);
  border: 1px solid var(--_border);
  border-radius: var(--_radius-sm);
  background: var(--_surface-sunken);
}

.toc summary {
  color: var(--_fg-muted);
  font-size: var(--_font-size-small);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
}

.toc-list {
  margin: var(--_space-2) 0 var(--_space-1);
  padding: 0;
  list-style: none;
}

.toc-list li {
  padding: 2px 0;
}

.toc-list a {
  color: var(--_accent-fg);
  text-decoration: none;
}

.toc-list a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.toc-level-1 {
  padding-left: var(--_space-4) !important;
}

.toc-level-2 {
  padding-left: var(--_space-6) !important;
}

.toc-level-3 {
  padding-left: 48px !important;
}

/* ---------- Typography ---------- */

.markdown {
  color: var(--_fg);
  line-height: 1.65;
  overflow-wrap: break-word;
}

.markdown > :first-child,
.markdown > [data-vt-line]:first-child + * {
  margin-top: 0;
}

.markdown > :last-child {
  margin-bottom: 0;
}

.markdown :is(h1, h2, h3, h4, h5, h6) {
  position: relative;
  margin: 1.6em 0 0.6em;
  color: var(--_fg);
  font-weight: 650;
  line-height: 1.25;
  scroll-margin-top: var(--_space-4);
}

.markdown h1 {
  font-size: 1.75em;
  letter-spacing: -0.02em;
}

.markdown h2 {
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--_border);
  font-size: 1.4em;
  letter-spacing: -0.01em;
}

.markdown h3 {
  font-size: 1.2em;
}

.markdown h4 {
  font-size: 1.05em;
}

.markdown :is(h5, h6) {
  color: var(--_fg-muted);
  font-size: 0.95em;
}

.markdown :is(h1, h2, h3, h4, h5, h6):focus {
  outline: none;
}

.anchor {
  display: inline-grid;
  place-items: center;
  width: 1.4em;
  height: 1.4em;
  margin-left: 0.25em;
  border-radius: var(--_radius-sm);
  color: var(--_fg-muted);
  vertical-align: middle;
  opacity: 0;
  transition: opacity var(--_duration-fast) var(--_easing);
}

.anchor .icon {
  width: 0.8em;
  height: 0.8em;
}

:is(h1, h2, h3, h4, h5, h6):hover .anchor,
.anchor:focus-visible {
  opacity: 1;
}

.anchor:hover {
  background: var(--_accent-soft);
  color: var(--_accent-fg);
}

@media (hover: none) {
  .anchor {
    opacity: 0.6;
  }
}

.markdown :is(p, ul, ol, dl, blockquote, .table-wrap, .code-block, details, figure) {
  margin: 0 0 1em;
}

.markdown a {
  color: var(--_accent-fg);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.markdown a:hover {
  text-decoration-thickness: 2px;
}

.markdown :is(ul, ol) {
  padding-left: 1.6em;
}

.markdown li + li {
  margin-top: 0.25em;
}

.markdown li > :is(ul, ol) {
  margin: 0.25em 0 0;
}

.markdown li:has(> input[type='checkbox']) {
  list-style: none;
}

.markdown li > input[type='checkbox'] {
  margin: 0 0.5em 0 -1.4em;
  vertical-align: -0.1em;
  accent-color: var(--_accent);
}

.markdown blockquote {
  padding: 0 0 0 1em;
  border-left: 3px solid var(--_border-strong);
  color: var(--_fg-muted);
}

.markdown hr {
  height: 0;
  margin: 2em 0;
  border: 0;
  border-top: 1px solid var(--_border);
}

.markdown img {
  max-width: 100%;
  height: auto;
  border-radius: var(--_radius-sm);
}

.vt-blocked-image {
  display: inline-flex;
  align-items: center;
  gap: var(--_space-1);
  padding: 2px 8px;
  border: 1px dashed var(--_border-strong);
  border-radius: var(--_radius-sm);
  color: var(--_fg-muted);
  font-size: 0.875em;
}

.vt-blocked-image:empty::before {
  content: '\\25A1';
}

.markdown :is(code, kbd, samp) {
  font-family: var(--_font-mono);
  font-size: 0.875em;
}

.markdown :not(pre) > code {
  padding: 0.12em 0.35em;
  border-radius: var(--_radius-sm);
  background: var(--_surface-sunken);
}

.markdown kbd {
  padding: 0.1em 0.4em;
  border: 1px solid var(--_border-strong);
  border-radius: var(--_radius-sm);
  background: var(--_surface-raised);
  box-shadow: inset 0 -1px 0 var(--_border-strong);
}

.markdown mark {
  background: var(--_highlight);
  color: inherit;
}

/* ---------- Code blocks ---------- */

.code-block {
  position: relative;
}

.code-block pre {
  margin: 0;
  padding: var(--_space-3) var(--_space-4);
  overflow: auto;
  border: 1px solid var(--_border);
  border-radius: var(--_radius-sm);
  background: var(--_code-bg);
  color: var(--_code-fg);
  font-family: var(--_font-mono);
  font-size: var(--_font-size);
  line-height: var(--_line-height);
  tab-size: var(--_tab-size);
}

.code-block pre code {
  font-size: inherit;
}

.code-block > .btn {
  position: absolute;
  top: var(--_space-1);
  right: var(--_space-1);
  border: 1px solid var(--_border);
  background: var(--_surface);
  opacity: 0;
}

.code-block:hover > .btn,
.code-block > .btn:focus-visible,
.code-block > .btn.done {
  opacity: 1;
}

@media (hover: none) {
  .code-block > .btn {
    opacity: 1;
  }
}

/* ---------- Tables ---------- */

.table-wrap {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--_border);
  border-radius: var(--_radius-sm);
}

.markdown table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.925em;
  font-variant-numeric: tabular-nums;
}

.markdown :is(th, td) {
  padding: var(--_space-2) var(--_space-3);
  border-bottom: 1px solid var(--_border);
  text-align: start;
  vertical-align: top;
}

.markdown tr:last-child td {
  border-bottom: 0;
}

.markdown th {
  background: var(--_surface-sunken);
  color: var(--_fg-muted);
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.markdown :is(th, td)[align='center'] {
  text-align: center;
}

.markdown :is(th, td)[align='right'] {
  text-align: end;
}

.markdown details {
  padding: var(--_space-2) var(--_space-3);
  border: 1px solid var(--_border);
  border-radius: var(--_radius-sm);
}

.markdown summary {
  cursor: pointer;
  font-weight: 600;
}
`;function $r(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ut=$r();function Ba(t){ut=t}var lt={exec:()=>null};function Ot(t){let e=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),s=e[r];return s||(s=t(r),e[r]=s),s}}function L(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(s,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(ue.caret,"$1"),n=n.replace(s,a),r},getRegex:()=>new RegExp(n,e)};return r}var nu=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),ue={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:Ot(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:Ot(t=>new RegExp(`^ {0,${t}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:Ot(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:Ot(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:Ot(t=>new RegExp(`^ {0,${t}}(?:</?(?:${en})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,"i")),blockquoteBeginRegex:Ot(t=>new RegExp(`^ {0,${t}}>`))},ru=/^(?:[ \t]*(?:\n|$))+/,su=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,iu=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Qt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,au=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Br=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Ua=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Ha=L(Ua).replace(/bull/g,Br).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ou=L(Ua).replace(/bull/g,Br).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Ur=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,lu=/^[^\n]+/,Hr=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,cu=L(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Hr).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),uu=L(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Br).getRegex(),en="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Fr=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,hu=L("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Fr).replace("tag",en).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Fa=t=>L(Ur).replace("hr",Qt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",t).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",en).getRegex(),du=Fa(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),pu=Fa(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),fu=L(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",pu).getRegex(),jr={blockquote:fu,code:su,def:cu,fences:iu,heading:au,hr:Qt,html:hu,lheading:Ha,list:uu,newline:ru,paragraph:du,table:lt,text:lu},Ra=L("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Qt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",en).getRegex(),gu={...jr,lheading:ou,table:Ra,paragraph:L(Ur).replace("hr",Qt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ra).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",en).getRegex()},mu={...jr,html:L(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Fr).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:lt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:L(Ur).replace("hr",Qt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Ha).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},bu=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,yu=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ja=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,xu=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,He=/[\p{P}\p{S}]/u,Mt=/[\s\p{P}\p{S}]/u,tn=/[^\s\p{P}\p{S}]/u,vu=L(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Mt).getRegex(),wu=/[\p{Pi}\p{Ps}"']/u,qa=/(?!~)[\p{P}\p{S}]/u,_u=/(?!~)[\s\p{P}\p{S}]/u,ku=/(?:[^\s\p{P}\p{S}]|~)/u,Eu=L(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",nu?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Ga=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Tu=L(Ga,"u").replace(/punct/g,He).getRegex(),Su=L(Ga,"u").replace(/punct/g,qa).getRegex(),Au=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Ru=L(Au,"u").replace(/openQuote/g,wu).replace(/punct/g,He).getRegex(),Wa="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Nu=L(Wa,"gu").replace(/notPunctSpace/g,tn).replace(/punctSpace/g,Mt).replace(/punct/g,He).getRegex(),Cu=L(Wa,"gu").replace(/notPunctSpace/g,ku).replace(/punctSpace/g,_u).replace(/punct/g,qa).getRegex(),Lu="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Ou=L(Lu,"gu").replace(/notPunctSpace/g,tn).replace(/punctSpace/g,Mt).replace(/punct/g,He).getRegex(),Mu=L("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,tn).replace(/punctSpace/g,Mt).replace(/punct/g,He).getRegex(),Iu="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",Du=L(Iu,"gu").replace(/notPunctSpace/g,tn).replace(/punctSpace/g,Mt).replace(/punct/g,He).getRegex(),Pu=L(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,He).getRegex(),zu="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",$u=L(zu,"gu").replace(/notPunctSpace/g,tn).replace(/punctSpace/g,Mt).replace(/punct/g,He).getRegex(),Bu=L(/\\(punct)/,"gu").replace(/punct/g,He).getRegex(),Uu=L(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Hu=L(Fr).replace("(?:-->|$)","-->").getRegex(),Fu=L("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Hu).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Va=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,Fn=L(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Va).getRegex(),ju=L(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",Fn).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),qu=L(/^!?\[(label)\]\[(ref)\]/).replace("label",Fn).replace("ref",Hr).getRegex(),Gu=L(/^!?\[(ref)\](?:\[\])?/).replace("ref",Hr).getRegex(),Na=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,Wu=L(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Va).getRegex(),Vu=L("reflink|nolink(?!\\()","g").replace("reflink",L(/^!?\[(label)\]\[(ref)\]/).replace("label",Wu).replace("ref",Na).getRegex()).replace("nolink",L(/^!?\[(ref)\](?:\[\])?/).replace("ref",Na).getRegex()).getRegex(),Ca=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ku=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,Yu=L(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,Ku).getRegex(),qr={_backpedal:lt,anyPunctuation:Bu,autolink:Uu,blockSkip:Eu,br:ja,code:yu,del:lt,delLDelim:lt,delRDelim:lt,emStrongLDelim:Tu,emStrongRDelimAst:Nu,emStrongRDelimUnd:Mu,escape:bu,link:ju,nolink:Gu,punctuation:vu,reflink:qu,reflinkSearch:Vu,tag:Fu,text:xu,url:lt},Xu={...qr,emStrongLDelim:Ru,emStrongRDelimAst:Ou,emStrongRDelimUnd:Du,link:L(/^!?\[(label)\]\((.*?)\)/).replace("label",Fn).getRegex(),reflink:L(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Fn).getRegex()},Dr={...qr,emStrongRDelimAst:Cu,emStrongLDelim:Su,delLDelim:Pu,delRDelim:$u,url:L(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",Yu).replace("protocol",Ca).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:L(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",Ca).replace(/emailProtocol/g,/(?:mailto|xmpp):/).getRegex()},Zu={...Dr,br:L(ja).replace("{2,}","*").getRegex(),text:L(Dr.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Hn={normal:jr,gfm:gu,pedantic:mu},Zt={normal:qr,gfm:Dr,breaks:Zu,pedantic:Xu},Ju={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},La=t=>Ju[t];function ke(t,e){if(e){if(ue.escapeTest.test(t))return t.replace(ue.escapeReplace,La)}else if(ue.escapeTestNoEncode.test(t))return t.replace(ue.escapeReplaceNoEncode,La);return t}function Qu(t){return t.replace(ue.numericCharacterReference,(e,n,r)=>{let s=n===void 0?Number.parseInt(r,16):Number.parseInt(n,10);return s===0||s>1114111||s>=55296&&s<=57343?"\uFFFD":String.fromCodePoint(s)})}function Oa(t){try{t=encodeURI(t).replace(ue.percentDecode,"%")}catch{return null}return t}function Ma(t,e){let n=t.replace(ue.findPipe,(i,a,o)=>{let c=!1,u=a;for(;--u>=0&&o[u]==="\\";)c=!c;return c?"|":" |"}),r=n.split(ue.splitPipe),s=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;s<r.length;s++)r[s]=r[s].trim().replace(ue.slashPipe,"|");return r}function Ke(t,e,n){let r=t.length;if(r===0)return"";let s=0;for(;s<r;){let i=t.charAt(r-s-1);if(i===e&&!n)s++;else if(i!==e&&n)s++;else break}return t.slice(0,r-s)}function Ia(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&ue.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function jn(t){return t.trim().toLowerCase().toUpperCase().toLowerCase()}function Da(t,e){if(t.indexOf(e[0])===-1&&t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function Pa(t,e=0){let n=e,r="";for(let s of t)if(s==="	"){let i=4-n%4;r+=" ".repeat(i),n+=i}else r+=s,n++;return r}function za(t,e,n,r,s){let i=e.href,a=e.title||null,o=t[1].replace(s.other.outputLinkReplace,"$1"),c=t[0].charAt(0)==="!";r.state.inLink=!0;let u=r.state.linkEmitted,d=r.state.inRawBlock;r.state.linkEmitted=!1;let p=r.inlineTokens(o),y=r.state.linkEmitted;if(r.state.linkEmitted=u,r.state.inLink=!1,!c){if(y){r.state.inRawBlock=d;return}r.state.linkEmitted=!0}return{type:c?"image":"link",raw:n,href:i,title:a,text:o,tokens:p}}function eh(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let s=r[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[o]=a;return i.slice(Math.min(o.length,s.length))}).join(`
`)}function $a(t,e,n,r){if(!e.includes("<"))return!1;for(let s=0;s<e.length;s++){if(e[s]==="\\"){s++;continue}if(e[s]==="`"){let o=r.inline.code.exec(e.slice(s));if(o){s+=o[0].length-1;continue}}if(e[s]!=="<")continue;let i=t.slice(n+s),a=r.inline.tag.exec(i)||r.inline.autolink.exec(i);if(a){if(a[0].length>e.length-s)return!0;s+=a[0].length-1}}return!1}var qn=class{options;rules;lexer;constructor(t){this.options=t||ut}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:Ia(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=eh(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=Ke(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceTabChar.test(r))&&(n=r.trim())}return{type:"heading",raw:Ke(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Ke(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=Ke(e[0],`
`).split(`
`),r="",s="",i=[];for(;n.length>0;){let a=!1,o=[],c;for(c=0;c<n.length;c++)if(this.rules.other.blockquoteStart.test(n[c]))o.push(n[c]),a=!0;else if(!a)o.push(n[c]);else break;n=n.slice(c);let u=o.join(`
`),d=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${u}`:u,s=s?`${s}
${d}`:d;let p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,i,!0),this.lexer.state.top=p,n.length===0)break;let y=i.at(-1);if(y?.type==="code")break;if(y?.type==="blockquote"){let v=y,_=n.join(`
`),C=v.raw+`
`+_.replace(this.rules.other.blockquoteSetextReplace2,""),N=this.blockquote(C);i[i.length-1]=N;let H=C.substring(N.raw.length).replace(/^\n/,""),O=H?H.split(`
`).length:0,F=O?n.slice(0,-O):n;F.length>0&&(r=`${r}
${F.join(`
`)}`),s=s.substring(0,s.length-v.text.length)+N.text;break}else if(y?.type==="list"){let v=y,_=v.raw+`
`+n.join(`
`),C=this.list(_);i[i.length-1]=C,r=r.substring(0,r.length-y.raw.length)+C.raw,s=s.substring(0,s.length-v.raw.length)+C.raw,n=_.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:s}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),r=n.length>1,s={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;t;){let c=!1,u="",d="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let p=e[2].split(`
`,1)[0],y=e[1].length,v=this.options.pedantic?Pa(p,y):p.replace(this.rules.other.leadingSpaceTab,H=>Pa(H,y)),_=t.split(`
`,1)[0],C=!v.trim(),N=0;if(this.options.pedantic?(N=2,d=v.trimStart()):C?N=y+1:(N=v.search(this.rules.other.nonSpaceChar),N=N>4?1:N,d=v.slice(N),N+=y),C&&this.rules.other.blankLine.test(_)&&(u+=_+`
`,t=t.substring(_.length+1),c=!0),!c){let H=this.rules.other.nextBulletRegex(N),O=this.rules.other.hrRegex(N),F=this.rules.other.fencesBeginRegex(N),P=this.rules.other.headingBeginRegex(N),q=this.rules.other.htmlBeginRegex(N),K=this.rules.other.blockquoteBeginRegex(N);for(;t;){let he=t.split(`
`,1)[0],X;if(_=he,this.options.pedantic?(_=_.replace(this.rules.other.listReplaceNesting,"  "),X=_):X=_.replace(this.rules.other.leadingSpaceTab,Z=>Z.replace(this.rules.other.tabCharGlobal,"    ")),F.test(_)||P.test(_)||q.test(_)||K.test(_)||H.test(_)||O.test(_))break;if(X.search(this.rules.other.nonSpaceChar)>=N||!_.trim())d+=`
`+X.slice(N);else{if(C||v.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||F.test(v)||P.test(v)||O.test(v))break;d+=`
`+_}C=!_.trim(),u+=he+`
`,t=t.substring(he.length+1),v=X.slice(N)}}s.loose||(a?s.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0)),s.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(d),loose:!1,text:d,tokens:[]}),s.raw+=u}let o=s.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let c of s.items)if(this.lexer.state.top=!1,c.tokens=this.lexer.blockTokens(c.text,[]),!s.loose){let u=c.tokens.filter(p=>p.type==="space"),d=u.length>0&&u.some(p=>this.rules.other.anyLine.test(p.raw));s.loose=d}for(let c of s.items){let u=c.tokens[0];if(c.task&&(u?.type==="text"||u?.type==="paragraph")){c.text=c.text.replace(this.rules.other.listReplaceTask,""),u.raw=u.raw.replace(this.rules.other.listReplaceTask,""),u.text=u.text.replace(this.rules.other.listReplaceTask,"");for(let p=this.lexer.inlineQueue.length-1;p>=0;p--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)){this.lexer.inlineQueue[p].src=this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask,"");break}let d=this.rules.other.listTaskCheckbox.exec(c.raw);if(d){let p={type:"checkbox",raw:d[0]+" ",checked:d[0]!=="[ ]"};c.checked=p.checked,s.loose?c.tokens[0]&&["paragraph","text"].includes(c.tokens[0].type)&&"tokens"in c.tokens[0]&&c.tokens[0].tokens?(c.tokens[0].raw=p.raw+c.tokens[0].raw,c.tokens[0].text=p.raw+c.tokens[0].text,c.tokens[0].tokens.unshift(p)):c.tokens.unshift({type:"paragraph",raw:p.raw,text:p.raw,tokens:[p]}):c.tokens.unshift(p)}}else c.task&&(c.task=!1)}if(s.loose)for(let c of s.items){c.loose=!0;for(let u of c.tokens)u.type==="text"&&(u.type="paragraph")}return s}}html(t){let e=this.rules.block.html.exec(t);if(e){let n=Ia(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){if(!this.rules.other.startAngleBracket.test(e[2])&&Da(e[2],"()")!==-1)return;let n=jn(e[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:Ke(e[0],`
`),href:r,title:s}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Ma(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:Ke(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let a of r)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of s)i.rows.push(Ma(a,i.header.length).map((o,c)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:i.align[c]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:Ke(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){if(this.lexer.state.linkParenPossible===!1)return;let e=this.rules.inline.link.exec(t);if(e){let n=e[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&$a(t,e[1],n,this.rules))return;let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let a=Ke(r.slice(0,-1),"\\");if((r.length-a.length)%2===0)return}else{let a=Da(e[2],"()");if(a===-2)return;if(a>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+a;e[2]=e[2].substring(0,a),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let s=e[2],i="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(s);a&&(s=a[1],i=a[3])}else i=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?s=s.slice(1):s=s.slice(1,-1)),za(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:i&&i.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let r=n[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&$a(t,n[1],r,this.rules))return;let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=e[jn(s)];if(!i){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return za(n,i,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,a,o=s,c=0,u=r[0][0],d=n===u,p=u==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(p.lastIndex=0,e=e.slice(-1*t.length+s);(r=p.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}else if(r[5]||r[6]){if(s%3&&!((s+a)%3)){c+=a;continue}if(d)break}if(o-=a,o>0)continue;a=Math.min(a,a+o+c);let y=[...r[0]][0].length,v=t.slice(0,s+r.index+y+a);if(Math.min(s,a)%2){let C=v.slice(1,-1);return{type:"em",raw:v,text:C,tokens:this.lexer.inlineTokens(C)}}let _=v.slice(2,-2);return{type:"strong",raw:v,text:_,tokens:this.lexer.inlineTokens(_)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,a,o=s,c=this.rules.inline.delRDelim;for(c.lastIndex=0,e=e.slice(-1*t.length+s);(r=c.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(a=[...i].length,a!==s))continue;if(r[3]||r[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let u=[...r[0]][0].length,d=t.slice(0,s+r.index+u+a),p=d.slice(s,-s);return{type:"del",raw:d,text:p,tokens:this.lexer.inlineTokens(p)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,autolink:!0,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:n?e[0]:Qu(e[0]),escaped:n}}}},Ce=class Pr{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ut,this.options.tokenizer=this.options.tokenizer||new qn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let n={other:ue,block:Hn.normal,inline:Zt.normal};this.options.pedantic?(n.block=Hn.pedantic,n.inline=Zt.pedantic):this.options.gfm&&(n.block=Hn.gfm,this.options.breaks?n.inline=Zt.breaks:n.inline=Zt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Hn,inline:Zt}}static lex(e,n){return new Pr(n).lex(e)}static lexInline(e,n){return new Pr(n).inlineTokens(e)}lex(e){e=e.replace(ue.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(ue.tabCharGlobal,"    ").replace(ue.spaceLine,""));let s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(o=>(i=o.call({lexer:this},e,n))?(e=e.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let o=n.at(-1);i.raw.length===1&&o!==void 0?o.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);let o=n.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),n.push(i);continue}let a=e;if(this.options.extensions?.startBlock){let o=1/0,c=e.slice(1),u;this.options.extensions.startBlock.forEach(d=>{u=d.call({lexer:this},c),typeof u=="number"&&u>=0&&(o=Math.min(o,u))}),o<1/0&&o>=0&&(a=e.substring(0,o+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let o=n.at(-1);r&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i),r=a.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);let o=n.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):n.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}linkInText(e){if(!e.includes("["))return!1;let n=this.tokenizer.rules.inline.link;for(let r of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(n.test(r[0])&&e.charAt(r.index-1)!=="!")return!0;for(let r of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let s=r[0],i=s.lastIndexOf("[");if(!(s.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,jn(s.slice(i+1,-1))))&&!(i>1&&this.linkInText(s.slice(1,i-1))))return!0}return!1}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=this.state.linkParenPossible;this.state.linkParenPossible=r&&e.includes(")");try{return this.#e(e,n)}finally{this.state.linkParenPossible=r}}#e(e,n){let r=e;if(this.tokens.links&&e.includes("[")){let o=this.tokenizer.rules.inline.reflinkSearch,c=u=>{let d=u.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,jn(u.slice(d+1,-1))))return u;if(d>1&&u.charAt(0)!=="!"){let p=u.slice(1,d-1);if(this.linkInText(p))return"["+p.replace(o,c)+"]["+"a".repeat(u.length-d-2)+"]"}return"["+"a".repeat(u.length-2)+"]"};r=r.replace(o,c)}r=r.replace(this.tokenizer.rules.inline.anyPunctuation,o=>"+".repeat(o.length)),r=r.replace(this.tokenizer.rules.inline.blockSkip,(o,c,u)=>{let d=u?u.length:0;return o.slice(0,d)+"["+"a".repeat(o.length-d-2)+"]"}),r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let s=!1,i="",a=1/0;for(;e;){if(e.length<a)a=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}s||(i=""),s=!1;let o;if(this.options.extensions?.inline?.some(u=>(o=u.call({lexer:this},e,n))?(e=e.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let u=n.at(-1);o.type==="text"&&u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(e,r,i)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(e,r,i)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),n.push(o);continue}let c=e;if(this.options.extensions?.startInline){let u=1/0,d=e.slice(1),p;this.options.extensions.startInline.forEach(y=>{p=y.call({lexer:this},d),typeof p=="number"&&p>=0&&(u=Math.min(u,p))}),u<1/0&&u>=0&&(c=e.substring(0,u+1))}if(o=this.tokenizer.inlineText(c)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(i=o.raw.slice(-1)),s=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},Gn=class{options;parser;constructor(t){this.options=t||ut}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(ue.notSpaceStart)?.[0],s=t?t.replace(ue.endingNewline,"")+`
`:"";return r?'<pre><code class="language-'+ke(r)+'">'+(n?s:ke(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:ke(s,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,r="";for(let a=0;a<t.items.length;a++){let o=t.items[a];r+=this.listitem(o)}let s=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+s+i+`>
`+r+"</"+s+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let s=0;s<t.header.length;s++)n+=this.tablecell(t.header[s]);e+=this.tablerow({text:n});let r="";for(let s=0;s<t.rows.length;s++){let i=t.rows[s];n="";for(let a=0;a<i.length;a++)n+=this.tablecell(i[a]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${ke(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,text:n,tokens:r,autolink:s}){let i=s?ke(n,!0):this.parser.parseInline(r),a=Oa(t);if(a===null)return i;t=ke(a,s);let o='<a href="'+t+'"';return e&&(o+=' title="'+ke(e)+'"'),o+=">"+i+"</a>",o}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let s=Oa(t);if(s===null)return ke(n);t=s;let i=`<img src="${ke(t)}" alt="${ke(n)}"`;return e&&(i+=` title="${ke(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:ke(t.text)}},Gr=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Le=class zr{options;renderer;textRenderer;constructor(e){this.options=e||ut,this.options.renderer=this.options.renderer||new Gn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Gr}static parse(e,n){return new zr(n).parse(e)}static parseInline(e,n){return new zr(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let s=e[r];if(this.options.extensions?.renderers?.[s.type]){let a=s,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(a.type)){n+=o||"";continue}}let i=s;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let s=0;s<e.length;s++){let i=e[s];if(this.options.extensions?.renderers?.[i.type]){let o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){r+=o||"";continue}}let a=i;switch(a.type){case"escape":{r+=n.text(a);break}case"html":{r+=n.html(a);break}case"link":{r+=n.link(a);break}case"image":{r+=n.image(a);break}case"checkbox":{r+=n.checkbox(a);break}case"strong":{r+=n.strong(a);break}case"em":{r+=n.em(a);break}case"codespan":{r+=n.codespan(a);break}case"br":{r+=n.br(a);break}case"del":{r+=n.del(a);break}case"text":{r+=n.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return r}},Jt=class{options;block;constructor(t){this.options=t||ut}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?Ce.lex:Ce.lexInline}provideParser(t=this.block){return t?Le.parse:Le.parseInline}},Wn=class{defaults=$r();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Le;Renderer=Gn;TextRenderer=Gr;Lexer=Ce;Tokenizer=qn;Hooks=Jt;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{let s=r;for(let i of s.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of s.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let s=r;n=n.concat(this.walkTokens(s.items,e));break}default:{let s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(i=>{let a=s[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):s.tokens&&(n=n.concat(this.walkTokens(s.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let i=e.renderers[s.name];i?e.renderers[s.name]=function(...a){let o=s.renderer.apply(this,a);return o===!1&&(o=i.apply(this,a)),o}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[s.level];i?i.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),r.extensions=e),n.renderer){let s=this.defaults.renderer||new Gn(this.defaults);for(let i in n.renderer){if(!(i in s))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,o=n.renderer[a],c=s[a];s[a]=(...u)=>{let d=o.apply(s,u);return d===!1&&(d=c.apply(s,u)),d||""}}r.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new qn(this.defaults);for(let i in n.tokenizer){if(!(i in s))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,o=n.tokenizer[a],c=s[a];s[a]=(...u)=>{let d=o.apply(s,u);return d===!1&&(d=c.apply(s,u)),d}}r.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new Jt;for(let i in n.hooks){if(!(i in s))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,o=n.hooks[a],c=s[a];Jt.passThroughHooks.has(i)?s[a]=u=>{if(this.defaults.async&&Jt.passThroughHooksRespectAsync.has(i))return(async()=>{let p=await o.call(s,u);return c.call(s,p)})();let d=o.call(s,u);return c.call(s,d)}:s[a]=(...u)=>{if(this.defaults.async)return(async()=>{let p=await o.apply(s,u);return p===!1&&(p=await c.apply(s,u)),p})();let d=o.apply(s,u);return d===!1&&(d=c.apply(s,u)),d}}r.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,i=n.walkTokens;r.walkTokens=function(a){let o=[];return o.push(i.call(this,a)),s&&(o=o.concat(s.call(this,a))),o}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Ce.lex(t,e??this.defaults)}parser(t,e){return Le.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},s={...this.defaults,...r},i=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&r.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=t),s.async)return(async()=>{let a=s.hooks?await s.hooks.preprocess(e):e,o=await(s.hooks?await s.hooks.provideLexer(t):t?Ce.lex:Ce.lexInline)(a,s),c=s.hooks?await s.hooks.processAllTokens(o):o;s.walkTokens&&await Promise.all(this.walkTokens(c,s.walkTokens));let u=await(s.hooks?await s.hooks.provideParser(t):t?Le.parse:Le.parseInline)(c,s);return s.hooks?await s.hooks.postprocess(u):u})().catch(i);try{s.hooks&&(e=s.hooks.preprocess(e));let a=(s.hooks?s.hooks.provideLexer(t):t?Ce.lex:Ce.lexInline)(e,s);s.hooks&&(a=s.hooks.processAllTokens(a)),s.walkTokens&&this.walkTokens(a,s.walkTokens);let o=(s.hooks?s.hooks.provideParser(t):t?Le.parse:Le.parseInline)(a,s);return s.hooks&&(o=s.hooks.postprocess(o)),o}catch(a){return i(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+ke(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},ct=new Wn;function W(t,e){return ct.parse(t,e)}W.options=W.setOptions=function(t){return ct.setOptions(t),W.defaults=ct.defaults,Ba(W.defaults),W};W.getDefaults=$r;W.defaults=ut;function th(...t){return ct.use(...t),W.defaults=ct.defaults,Ba(W.defaults),W}W.use=th;W.walkTokens=function(t,e){return ct.walkTokens(t,e)};W.parseInline=ct.parseInline;W.Parser=Le;W.parser=Le.parse;W.Renderer=Gn;W.TextRenderer=Gr;W.Lexer=Ce;W.lexer=Ce.lex;W.Tokenizer=qn;W.Hooks=Jt;W.parse=W;var $p=W.options,Bp=W.setOptions,Up=W.walkTokens,Hp=W.parseInline;var Fp=Le.parse,jp=Ce.lex;var nh=300;function rh(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var sh=new Wn({gfm:!0,breaks:!1,async:!1,renderer:{html(t){let e=rh(t.text);return t.block?`<p>${e}</p>`:e}}}),ih=new Wn({gfm:!0,breaks:!1,async:!1});function Ka(t,e){let n=e.allowHtml?ih:sh,r=oh(),s=ah(n,t,r),i=fa(s,{images:e.images,externalLinks:e.externalLinks,baseUrl:e.baseUrl,lineMarkers:r}),a=lh(i,e),o=uh(i,e);for(let c of Array.from(i.querySelectorAll('li > input[type="checkbox"]'))){let u=(c.parentElement?.textContent??"").replace(/\s+/g," ").trim().slice(0,200);u&&c.setAttribute("aria-label",u)}for(let c of Array.from(i.querySelectorAll("table"))){let u=c.querySelector("caption")?.textContent?.trim(),d=b("div",{class:"table-wrap",attrs:{tabindex:"0",role:"region","aria-label":u||e.tableLabel}});c.replaceWith(d),d.append(c)}return{fragment:i,headings:a,codeBlocks:o}}function ah(t,e,n){let r=t.lexer(e),s=1,i="";for(let a of r)a.type!=="space"&&a.type!=="def"&&(i+=`<span data-vt-line="${s}:${n}"></span>`),i+=t.parser(Object.assign([a],{links:r.links})),s+=(a.raw.match(/\n/g)??[]).length;return i}function oh(){let t=new Uint8Array(12);return crypto.getRandomValues(t),Array.from(t,e=>e.toString(16).padStart(2,"0")).join("")}function lh(t,e){let n=[],r=new Map;for(let s of Array.from(t.querySelectorAll("h1, h2, h3, h4, h5, h6"))){let i=(s.textContent??"").trim(),a=ch(i,r);if(s.id=a,s.setAttribute("tabindex","-1"),n.length<nh&&n.push({level:Number(s.localName[1]),text:i.slice(0,200),id:a}),e.anchors){let o=b("a",{class:"anchor",part:"anchor",attrs:{href:`#${a}`,"aria-label":`${e.anchorLabel}: ${i.slice(0,100)}`}});o.append(ve("link")),s.append(o)}}return n}function ch(t,e){let n=t.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu,"").replace(/ /g,"-").slice(0,100)||"section",r=n;for(let s=e.get(n)??0;e.has(r);s+=1)r=`${n}-${s+1}`,e.set(n,s+1);return e.set(r,e.get(r)??0),r}function uh(t,e){let n=[];for(let r of Array.from(t.querySelectorAll("pre > code"))){let s=r.parentElement,i=/language-([\w#+.-]+)/.exec(r.className)?.[1]??"",a=ya(i),o=(r.textContent??"").replace(/\n$/,"");a&&a!=="plaintext"&&o.length<=e.highlightLimit&&(Dn(a)?r.replaceChildren(Pn(o,a)):xa(a).then(u=>u&&e.onLanguageLoaded())),s.setAttribute("tabindex","0");let c=b("div",{class:"code-block",part:"code-block",attrs:{"data-language":a??""}});s.replaceWith(c),c.append(s),n.push(c)}return n}var Vn=class{constructor(e,n){this.source=e,this.preview=n,this.anchors=null,this.lockedUntil=new Map,this.onSourceScroll=()=>this.follow(this.source,this.preview),this.onPreviewScroll=()=>this.follow(this.preview,this.source),this.resize=new ResizeObserver(()=>{this.anchors=null})}start(){this.source.addEventListener("scroll",this.onSourceScroll,{passive:!0}),this.preview.addEventListener("scroll",this.onPreviewScroll,{passive:!0});for(let e of[this.source,this.preview])this.resize.observe(e),e.firstElementChild&&this.resize.observe(e.firstElementChild);return this}stop(){this.source.removeEventListener("scroll",this.onSourceScroll),this.preview.removeEventListener("scroll",this.onPreviewScroll),this.resize.disconnect()}follow(e,n){if(performance.now()<(this.lockedUntil.get(e)??0))return;let r=this.anchors??(this.anchors=this.measure());if(r.length<2)return;let s=e===this.source?"source":"preview",i=s==="source"?"preview":"source",a=e.scrollTop,o=0;for(;o<r.length-2&&r[o+1][s]<=a;)o+=1;let c=r[o],u=r[o+1],d=u[s]-c[s],p=d>0?Math.min(1,Math.max(0,(a-c[s])/d)):0,y=Math.round(c[i]+p*(u[i]-c[i]));Math.abs(n.scrollTop-y)<1||(this.lockedUntil.set(n,performance.now()+150),n.scrollTop=y)}measure(){let e=this.source.querySelectorAll(".line"),n=e[0];if(!n)return[];let r=this.source.querySelector(".chunk")!==null,s=Wr(this.source,n),i=n.getBoundingClientRect().height||1,a=d=>{if(r)return s+(d-1)*i;let p=e[d-1];return p?Wr(this.source,p):s+(d-1)*i},o=Math.max(0,this.source.scrollHeight-this.source.clientHeight),c=Math.max(0,this.preview.scrollHeight-this.preview.clientHeight),u=[{source:0,preview:0}];for(let d of this.preview.querySelectorAll("[data-vt-line]")){let p=Number(d.getAttribute("data-vt-line")),y=d.nextElementSibling??d,v={source:a(p),preview:Wr(this.preview,y)},_=u[u.length-1];v.source>_.source&&v.preview>_.preview&&u.push(v)}for(;u.length>1;){let d=u[u.length-1];if(d.source<o&&d.preview<c)break;u.pop()}return u.push({source:o,preview:c}),u}};function Wr(t,e){return e.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop}var Kn=["preview","source","split"],hh={preview:"eye",source:"code",split:"columns"},dh=["right","left","bottom","top"],ph={right:"left",left:"right",bottom:"top",top:"bottom"},fh={right:"bottom",bottom:"right",left:"top",top:"left"},Vr=class extends Tt{static type="markdown";static componentAttributes=Object.freeze(["tabs","default-tab","toc","anchors","allow-html","external-links","images","line-numbers","split-preview","sync-scroll","split-controls"]);static presets={simple:{"line-numbers":!0,"sync-scroll":!0},full:{header:!0,dot:!0,copy:!0,search:!0,download:!0,toc:!0,anchors:!0,"line-numbers":!0,"sync-scroll":!0,"split-controls":!0,fullscreen:!0}};static styles=[wt,bn,Aa];constructor(){super(),this.tab=null,this.panelId=_t("panel"),this.cache=null,this.position=null,this.sync=null,this.scrollSync=null,this.editor=null,this.previewTimer=void 0}disconnectedCallback(){clearTimeout(this.previewTimer),this.editor?.destroy(),this.scrollSync?.stop(),this.scrollSync=null,super.disconnectedCallback()}get previewPosition(){return this.position??Ne(this.getAttribute("split-preview"),dh,"right")}get syncScroll(){return this.sync??this.feature("sync-scroll")}attributeChangedCallback(e,n,r){(e==="default-tab"||e==="tabs")&&(this.tab=null),e==="split-preview"&&(this.position=null),e==="sync-scroll"&&(this.sync=null),super.attributeChangedCallback(e,n,r)}contentChanged(){this.cache=null}get visibleTabs(){return this.hasAttribute("tabs")?xs(this.getAttribute("tabs"),Kn)??[]:this.variant==="full"?[...Kn]:[]}get activeTab(){let e=this.visibleTabs,n=e.length?e:[...Kn],r=this.editing&&n.includes("split")?"split":"preview",s=n.includes(r)?r:n[0],i=this.tab??Ne(this.getAttribute("default-tab"),Kn,s);return n.includes(i)?i:s}rendered(){let e={allowHtml:De(this.getAttribute("allow-html"))===!0,images:Ne(this.getAttribute("images"),["allow","block","same-origin"],"allow"),externalLinks:Ne(this.getAttribute("external-links"),["new-tab","same"],"new-tab"),baseUrl:this.baseUrl(),anchors:this.feature("anchors"),anchorLabel:this.t("anchor"),tableLabel:this.t("table"),highlightLimit:ee().highlightLimit,onLanguageLoaded:()=>{this.cache=null,this.requestRender()}},n=JSON.stringify({...e,onLanguageLoaded:void 0});if(!this.cache||this.cache.key!==n)try{this.cache={key:n,result:Ka(this.text??"",e),error:null}}catch(a){this.cache={key:n,result:null,error:a instanceof RangeError?new oe("tooComplex",{},a):a}}if(this.cache.error||!this.cache.result)throw this.cache.error;let{fragment:r,headings:s}=this.cache.result,i=r.cloneNode(!0);return{fragment:i,headings:s,codeBlocks:Array.from(i.querySelectorAll(".code-block"))}}baseUrl(){let e=this.getAttribute("src");if(!(!e||this._content!==void 0))try{return new URL(e,document.baseURI).href}catch{return}}renderContent(e){let n=this.t,r=this.activeTab;e.classList.add("md"),this.scrollSync?.stop(),this.scrollSync=null;let s=null,i=null,a=[];try{(r==="preview"||r==="split")&&(s=this.previewPane(),a.push(new Pe(s.querySelector(".markdown"),{skip:".anchor"})))}catch(_){this.setError(_);return}if((r==="source"||r==="split")&&this.editing)i=this.editorPane();else if(r==="source"||r==="split"){let _=ot(this.text??"",{language:"markdown",lineNumbers:this.feature("line-numbers"),startLine:1,highlightRanges:[],diff:!1,highlightLimit:ee().highlightLimit});i=b("div",{class:"body",part:"body source",attrs:{tabindex:"0",role:"region","aria-label":n("source")}},_.element),a.push(new Pe(_.code))}let o=si(a,Xt),c=this.visibleTabs,u=c.length>1?En({tabs:c.map(_=>({id:_,label:n(_),icon:hh[_]})),selected:r,label:n("tabs"),panelId:this.panelId,onSelect:_=>this.selectTab(_)}):null,d=[this.searchButton(o),...r==="split"&&this.feature("split-controls")?this.splitButtons():[],...this.editor&&this.editing?this.historyButtons(this.editor):[],this.editToggleButton(),this.fullscreenButton(),this.feature("download")?this.downloadButton(()=>this.text??"",this.downloadName("document.md"),"text/markdown"):null,this.feature("copy")?this.copyButton(()=>this.text??"",n("copySource")):null],p=this.previewPosition,y=b("div",{class:r==="split"?"panel split":"panel",attrs:{id:this.panelId,role:u?"tabpanel":null,"data-preview":r==="split"?p:null}}),v=p==="left"||p==="top";for(let _ of v?[s,i]:[i,s])_&&y.append(_);e.append(...this.chrome({tabs:u,actions:d}),y),this.editor?.align(),this.startSync()}startSync(){this.scrollSync?.stop(),this.scrollSync=null;let e=this.root.querySelector('.split > [part~="source"]'),n=this.root.querySelector('.split > [part~="preview"]');e&&n&&this.syncScroll&&(this.scrollSync=new Vn(e,n).start())}editorPane(){return this.editor?.destroy(),this.editor=new Lt({text:this.text??"",language:"markdown",lineNumbers:this.feature("line-numbers"),wrap:!0,highlightLimit:ee().highlightLimit,label:this.heading||this.t("editor"),placeholder:this.getAttribute("placeholder")??void 0,onInput:e=>this.edited(e),onChange:e=>ce(this,le.CHANGE,{value:e}),history:this.editHistory??void 0}),b("div",{class:"body editor-body",part:"body source"},this.editor.element)}contentEdited(){this.cache=null,clearTimeout(this.previewTimer),this.previewTimer=setTimeout(()=>this.refreshPreview(),120)}refreshPreview(){let e=this.root.querySelector('[part~="preview"]');if(!e)return;let n;try{n=this.previewPane()}catch(r){let{title:s,detail:i}=this.describeError(r);n=b("div",{class:"body md-body",part:"body preview"},Et(s,i))}e.replaceWith(n),n.scrollTop=e.scrollTop,this.startSync(),this.scrollSync?.follow(this.scrollSync.source,this.scrollSync.preview),this.searchOpen&&this.searchQuery&&this.searchBar?.run()}splitButtons(){let e=this.t,n=this.previewPosition,r=n==="top"||n==="bottom";return[ie({icon:"swap",label:e("swapPanes"),key:"swap-panes",part:"swap-button",onClick:()=>this.changeLayout(ph[n],this.syncScroll)}),ie({icon:"rows",label:e("stackPanes"),key:"stack-panes",part:"stack-button",pressed:r,onClick:()=>this.changeLayout(fh[n],this.syncScroll)}),ie({icon:"sync-scroll",label:e("syncScroll"),key:"sync-scroll",part:"sync-button",pressed:this.syncScroll,onClick:()=>this.changeLayout(n,!this.syncScroll)})]}changeLayout(e,n){this.position=e,this.sync=n,this.render(),ce(this,le.LAYOUT_CHANGE,{preview:e,sync:n})}previewPane(){let{fragment:e,headings:n,codeBlocks:r}=this.rendered(),s=b("div",{class:"markdown",part:"markdown"});if(s.append(e),this.feature("copy"))for(let a of r){let o=a.querySelector("pre");a.append(this.copyButton(()=>(o?.textContent??"").replace(/\n$/,""),this.t("copyCode"),`copy-block-${r.indexOf(a)}`))}let i=b("div",{class:"body md-body",part:"body preview",attrs:{tabindex:"0",role:"region","aria-label":this.heading||this.t("preview")}});return this.feature("toc")&&n.length>1&&i.append(this.tableOfContents(n)),i.append(s),i.addEventListener("click",a=>this.onLinkClick(a)),i}tableOfContents(e){let n=Math.min(...e.map(s=>s.level)),r=b("ol",{class:"toc-list"});for(let s of e){let i=b("li",{class:`toc-level-${Math.min(s.level-n,3)}`});i.append(b("a",{attrs:{href:`#${s.id}`},text:s.text||"\u2014"})),r.append(i)}return b("nav",{class:"toc",part:"toc",attrs:{"aria-label":this.t("toc")}},b("details",{attrs:{open:!0}},b("summary",{text:this.t("toc")}),r))}onLinkClick(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey)return;let n=e.target.closest?.('a[href^="#"]');if(!n)return;let r=decodeURIComponent((n.getAttribute("href")??"").slice(1)),s=r?this.root.getElementById(r):null;s&&(e.preventDefault(),s.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}),s.focus({preventScroll:!0}))}selectTab(e){e!==this.activeTab&&(this.tab=e,this.render(),this.root.querySelector(`[data-tab="${e}"]`)?.focus(),ce(this,le.TAB_CHANGE,{tab:e}))}};export{Ir as VtJson,Vr as VtMarkdown};
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE *)
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)
*/
