'use strict';
/* ====== التطبيق: الحالة والتنقل والشاشات ====== */
const $=s=>document.querySelector(s);
const V=$('#view');
const APP_URL='https://alialsaffarmosuluniversity.github.io/MATH/';
const LV=['مبتدئ','مستكشف','نشيط','ماهر','محترف','عبقري','بطل الرياضيات','أسطورة الأرقام'];
const AVATARS=['🦁','🐯','🐼','🦊','🐸','🦄','🚀','🤖','⚽','🌟'];
const TIPS=['لتقريب عدد إلى أقرب مليون انظر إلى رقم مئات الآلاف.','عند الضرب في ١٠٠٠ أضف ثلاثة أصفار.','الباقي في القسمة دائماً أصغر من المقسوم عليه.','العدد ١ ليس أولياً، والعدد ٢ هو الأولي الزوجي الوحيد.','مجموع زوايا المثلث ١٨٠° ومجموع زوايا الرباعي ٣٦٠°.','مساحة المثلث = ½ × القاعدة × الارتفاع.','لجمع كسرين وحّد المقامين أولاً.','٠٫٥ و٠٫٥٠٠ عددان متساويان.','الوسط الحسابي = مجموع القيم ÷ عددها.','الجذر التربيعي لـ ٨١ هو ٩ لأن ٩ × ٩ = ٨١.','١ كغم = ١٠٠٠ غم و١ طن = ١٠٠٠ كغم.','تحقق من إجابتك دائماً بعملية عكسية.'];

/* ---------- الحالة ---------- */
const DEF={name:'',avatar:'🦁',xp:0,stars:{},answered:0,correct:0,bestCombo:0,streak:{last:'',n:0},badges:{},daily:'',dailyN:0,theme:'auto',sound:true,known:{},best:{},wins:{},last:null,mastered:{},testBest:{}};
function loadState(){try{const o=JSON.parse(localStorage.getItem('math5v2')||'null');if(o)return Object.assign({},JSON.parse(JSON.stringify(DEF)),o);
 const old=JSON.parse(localStorage.getItem('math5')||'{}');const st={};for(const k in old)if(/^\d+_\d+$/.test(k)&&typeof old[k]=='number')st[k]=old[k];return Object.assign(JSON.parse(JSON.stringify(DEF)),{stars:st})}catch(e){return JSON.parse(JSON.stringify(DEF))}}
let S=loadState();
const save=()=>{try{localStorage.setItem('math5v2',JSON.stringify(S))}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10);
const lvl=()=>Math.floor(S.xp/150)+1, lvName=()=>LV[Math.min(LV.length-1,lvl()-1)], lvPct=()=>(S.xp%150)/150*100;
const starKey=(c,l)=>c+'_'+l, starsOf=(c,l)=>S.stars[starKey(c,l)]||0;
const totalStars=()=>Object.values(S.stars).reduce((a,b)=>a+b,0);
const chStars=c=>CH[c].ls.reduce((a,_,l)=>a+starsOf(c,l),0);
const mastered=c=>(S.mastered[c]||[]).length;
const starsHtml=n=>`<span class="stars">${[1,2,3].map(i=>`<span class="${i<=n?'on':'off'}">⭐</span>`).join('')}</span>`;
function touchStreak(){const t=today();if(S.streak.last==t)return;const y=new Date(Date.now()-864e5).toISOString().slice(0,10);S.streak.n=S.streak.last==y?S.streak.n+1:1;S.streak.last=t}
function addXP(n){const l0=lvl();S.xp+=n;if(lvl()>l0){toast(`🎉 ارتقيت إلى المستوى ${ar(lvl())}: ${lvName()}`);confetti();sfx.win()}save();upTop()}
function upTop(){$('#tstars').textContent=ar(totalStars())}

/* ---------- الأوسمة ---------- */
const BADGES=[
 {id:'first',ic:'🌱',t:'البداية',d:'أجب عن أول سؤال',f:()=>S.answered>=1},
 {id:'ten',ic:'🔟',t:'عشر صحيحات',d:'١٠ إجابات صحيحة',f:()=>S.correct>=10},
 {id:'hund',ic:'💯',t:'المئة',d:'١٠٠ إجابة صحيحة',f:()=>S.correct>=100},
 {id:'combo',ic:'🔥',t:'متوهج',d:'٨ إجابات صحيحة متتالية',f:()=>S.bestCombo>=8},
 {id:'star3',ic:'🌟',t:'ثلاث نجوم',d:'احصل على ٣ نجوم في درس',f:()=>Object.values(S.stars).some(x=>x==3)},
 {id:'chap',ic:'📘',t:'أنهيت فصلاً',d:'نجمة على الأقل في كل دروس فصل',f:()=>CH.some((c,i)=>c.ls.every((_,j)=>starsOf(i,j)>0))},
 {id:'bank',ic:'🏅',t:'متقن',d:'أتقن ٥٠ سؤالاً من فصل',f:()=>CH.some((_,i)=>mastered(i)>=50)},
 {id:'streak',ic:'📅',t:'مواظب',d:'٣ أيام متتالية',f:()=>S.streak.n>=3},
 {id:'daily',ic:'☀️',t:'تحدي اليوم',d:'أكمل تحدي اليوم',f:()=>S.dailyN>=1},
 {id:'speed',ic:'⚡',t:'سريع البرق',d:'١٥٠ نقطة في سباق الحساب',f:()=>(S.best.speed||0)>=150},
 {id:'mem',ic:'🧠',t:'ذاكرة فولاذية',d:'اربح مطابقة الذاكرة',f:()=>(S.wins.memory||0)>=1},
 {id:'prime',ic:'🎯',t:'صياد الأولية',d:'١٠٠ نقطة في صيد الأولية',f:()=>(S.best.primes||0)>=100},
 {id:'lad',ic:'🪜',t:'مرتّب ماهر',d:'١٠٠ نقطة في سلّم الأعداد',f:()=>(S.best.ladder||0)>=100},
 {id:'night',ic:'🌙',t:'سهران',d:'جرّب الوضع الليلي',f:()=>!!S.badges.nightUsed},
 {id:'inst',ic:'📲',t:'مثبّت',d:'ثبّت التطبيق',f:()=>!!S.badges.installed||isStandalone()},
 {id:'lv5',ic:'👑',t:'محترف',d:'المستوى ٥',f:()=>lvl()>=5}];
function checkBadges(){let n=0;BADGES.forEach(b=>{if(!S.badges[b.id]&&b.f()){S.badges[b.id]=1;n++;setTimeout(()=>{toast(`${b.ic} وسام جديد: ${b.t}`);sfx.win()},400*n)}});if(n)save()}

/* ---------- صوت وتأثيرات ---------- */
let AC;function beep(f,d,t='sine',v=.12){if(!S.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
const sfx={ok(){beep(660,.12);setTimeout(()=>beep(880,.18),90)},no(){beep(200,.25,'sawtooth',.08)},tap(){beep(520,.05)},win(){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.2),i*110))}};
const vib=p=>{try{S.sound&&navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2600)}
function confetti(){const c=$('#confetti'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=['#ff5d8f','#ffb81f','#17a361','#4c3fd6','#ff8a3d','#2ec4ff'];const P=Array.from({length:110},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,r:4+Math.random()*6,c:cols[R(0,5)],a:Math.random()*6}));let f=0;(function d(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a+=.15;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r,-p.r/2,p.r*2,p.r);x.restore()});if(++f<130)requestAnimationFrame(d);else x.clearRect(0,0,c.width,c.height)})()}
function floatXP(t){const e=document.createElement('div');e.className='xpf';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1000)}
function sheet(html,mount){const ov=document.createElement('div');ov.className='ov';ov.innerHTML=`<div class="sheet"><div class="grab"></div>${html}</div>`;document.body.appendChild(ov);const close=()=>ov.remove();ov.addEventListener('click',e=>{if(e.target==ov)close()});ov.querySelectorAll('[data-close]').forEach(b=>b.onclick=close);mount&&mount(ov.querySelector('.sheet'),close);return close}

/* ---------- المظهر ---------- */
function applyTheme(){const dark=S.theme=='dark'||(S.theme=='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';$('#themeBtn').textContent=dark?'☀️':'🌙';document.querySelector('meta[name=theme-color]').content=dark?'#2a2670':'#4c3fd6'}
$('#themeBtn').onclick=()=>{const dark=document.documentElement.dataset.theme=='dark';S.theme=dark?'light':'dark';if(!dark)S.badges.nightUsed=1;save();applyTheme();checkBadges()};

/* ---------- التثبيت والباركود ---------- */
let DP=null;const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();DP=e;if(location.hash.match(/#\/(home|more)?$/))render()});
addEventListener('appinstalled',()=>{DP=null;S.badges.installed=1;save();toast('تم تثبيت التطبيق 🎉');checkBadges();render()});
async function doInstall(){if(DP){DP.prompt();try{await DP.userChoice}catch(e){}DP=null;render()}else installHelp()}
function installHelp(){const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);sheet(`<h3>📲 تثبيت التطبيق</h3>${ios?`<ol class="steps"><li>افتح الرابط في متصفح <b>Safari</b>.</li><li>اضغط زر المشاركة ⬆️ أسفل الشاشة.</li><li>اختر <b>إضافة إلى الشاشة الرئيسية</b>.</li><li>اضغط <b>إضافة</b>، وسيظهر التطبيق بين تطبيقاتك.</li></ol>`:`<ol class="steps"><li>افتح الرابط في متصفح <b>Chrome</b>.</li><li>اضغط قائمة النقاط الثلاث ⋮ أعلى المتصفح.</li><li>اختر <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b>.</li><li>أكّد، وسيظهر التطبيق بين تطبيقاتك ويعمل دون إنترنت.</li></ol>`}<p class="sm">على الحاسوب: اضغط أيقونة التثبيت في شريط العنوان.</p><button class="btn block" data-close>حسناً</button>`)}
const shareURL=()=>(location.protocol.startsWith('http')&&!/localhost|127\.0\.0\.1/.test(location.hostname))?location.origin+location.pathname:APP_URL;
function qrCanvas(text,size=300){const qr=qrcode(0,'M');qr.addData(text);qr.make();const n=qr.getModuleCount(),m=3,cell=Math.max(3,Math.floor(size/(n+m*2)));const cv=document.createElement('canvas');cv.width=cv.height=cell*(n+m*2);const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);const g=x.createLinearGradient(0,0,cv.width,cv.height);g.addColorStop(0,'#4c3fd6');g.addColorStop(1,'#a24dff');x.fillStyle=g;
 for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c)){const px=(c+m)*cell,py=(r+m)*cell;x.beginPath();x.roundRect?x.roundRect(px,py,cell,cell,cell*.28):x.rect(px,py,cell,cell);x.fill()}return cv}
function qrSheet(){S.badges.qr=1;save();const url=shareURL();sheet(`<h3>📱 باركود التطبيق</h3><div class="qrbox" id="qb"></div><p class="sm" style="text-align:center;direction:ltr;word-break:break-all">${url}</p><div class="row c"><button class="btn" id="sh">📤 مشاركة</button><button class="btn ghost" id="cp">📋 نسخ الرابط</button><button class="btn ghost" id="dl">⬇️ حفظ الباركود</button></div><p class="sm" style="text-align:center">وجّه كاميرا الهاتف إلى الباركود لفتح التطبيق مباشرة.</p>`,(sh)=>{const cv=qrCanvas(url);sh.querySelector('#qb').appendChild(cv);
  sh.querySelector('#sh').onclick=async()=>{try{if(navigator.share)await navigator.share({title:'رياضيات الخامس الابتدائي',text:'تطبيق رياضيات الخامس الابتدائي - علي الصفار .. دعم لبراعم العراق',url})
   else{await navigator.clipboard.writeText(url);toast('تم نسخ الرابط')}}catch(e){}};
  sh.querySelector('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(url);toast('تم نسخ الرابط ✅')}catch(e){toast('انسخ الرابط يدوياً')}};
  sh.querySelector('#dl').onclick=()=>{const a=document.createElement('a');a.download='math5-qr.png';a.href=cv.toDataURL('image/png');a.click()}})}

/* ---------- المفردات ---------- */
const VOCAB=[
[['مليار','١٬٠٠٠ مليون، يُكتب واحداً وأمامه ٩ أصفار'],['القيمة المكانية','قيمة الرقم حسب موقعه (مرتبته) في العدد'],['الصورة الرقمية','كتابة العدد بالأرقام'],['الصورة التحليلية','كتابة العدد كمجموع قيم أرقامه'],['التقريب','إيجاد عدد قريب مدوَّر من العدد'],['مئات الملايين','المرتبة التاسعة من اليمين'],['مستقيم الأعداد','خط تمثَّل عليه الأعداد للمقارنة والتحقق'],['المراتب','مواقع الأرقام: آحاد، عشرات، مئات، آلاف…']],
[['المجموع','ناتج عملية الجمع'],['الفرق','ناتج عملية الطرح'],['التقدير','ناتج قريب نحصل عليه بتقريب الأعداد'],['الجملة المفتوحة','جملة فيها عدد مجهول يُرمز له بـ □'],['الحمل','نقل عشرة إلى المرتبة التالية في الجمع'],['الاستلاف','أخذ عشرة من المرتبة التالية في الطرح'],['حل مسألة أسهل','تعديل الأعداد لتسهيل الحساب ثم تصحيح الناتج'],['العملية العكسية','الطرح عكس الجمع، نتحقق بها']],
[['حاصل الضرب','ناتج عملية الضرب'],['العوامل','الأعداد التي نضربها'],['المضاعفات','نواتج ضرب العدد في ١، ٢، ٣، …'],['الضرب في ١٠٠٠','نضيف ثلاثة أصفار'],['الناتج الجزئي','ناتج الضرب في رقم واحد من العدد'],['التخمين','تقدير الناتج بالتقريب قبل الحساب'],['خاصية التبديل','أ × ب = ب × أ'],['أتحقق','أراجع الناتج بالتقدير أو بعملية أخرى']],
[['المقسوم','العدد الذي نقسمه'],['المقسوم عليه','العدد الذي نقسم عليه'],['ناتج القسمة','عدد المجموعات أو حصة الواحد'],['الباقي','ما يتبقى ولا يكفي لمجموعة جديدة، وأصغر من المقسوم عليه'],['القسمة التامة','قسمة بلا باقٍ'],['الأعداد المتوافقة','أعداد قريبة تسهّل القسمة الذهنية'],['معقولية الإجابة','هل الناتج قريب من التقدير؟'],['نمط القسمة','حذف الأصفار المشتركة لا يغيّر الناتج']],
[['الكسر العشري','عدد يحتوي فاصلة عشرية مثل ٠٫٧٥'],['الفاصلة العشرية','تفصل الجزء الصحيح عن الكسري'],['أجزاء من عشرة','الخانة الأولى بعد الفاصلة'],['أجزاء من مئة','الخانة الثانية بعد الفاصلة'],['أجزاء من ألف','الخانة الثالثة بعد الفاصلة'],['العدد الكسري','عدد صحيح مع كسر مثل ٢ ½'],['تقريب الكسر العشري','ننظر إلى الخانة التي تلي مرتبة التقريب'],['الكسر الاعتيادي','بسط ومقام مثل ٣/٤']],
[['المقام المشترك','مقام مشترك بين كسرين، نختار م.م.أ'],['م.م.أ','المضاعف المشترك الأصغر'],['كسر مكافئ','كسر مختلف الشكل له القيمة نفسها'],['الاختصار','قسمة البسط والمقام على القاسم نفسه'],['العدد الكسري','عدد صحيح وكسر معاً'],['كسر غير فعلي','بسطه أكبر من مقامه أو يساويه'],['ضرب الكسور','بسط × بسط، ومقام × مقام'],['الجملة العددية','مسألة مكتوبة بالأعداد والرموز']],
[['العدد الأولي','أكبر من ١ وله قاسمان فقط: ١ ونفسه'],['العدد غير الأولي','له أكثر من قاسمين مثل ٩ و١٢'],['العامل الأولي','قاسم أولي للعدد'],['الأس','يبيّن عدد مرات ضرب الأساس في نفسه: ٢³'],['المربع الكامل','عدد × نفسه مثل ٤٩'],['الجذر التربيعي','العدد الذي مربعه يساوي الناتج: √٤٩ = ٧'],['المكعب الكامل','عدد × نفسه × نفسه مثل ٢٧'],['ق.م.أ','القاسم المشترك الأكبر لعددين'],['م.م.أ','المضاعف المشترك الأصغر لعددين'],['المثال المضاد','مثال يبطل عبارة عامة']],
[['المستقيمان المتوازيان','لا يتقاطعان مهما امتدا'],['المستقيمان المتعامدان','يتقاطعان بزاوية قائمة ٩٠°'],['مثلث حاد الزوايا','كل زواياه أقل من ٩٠°'],['مثلث قائم الزاوية','فيه زاوية ٩٠°'],['مثلث منفرج الزاوية','فيه زاوية أكبر من ٩٠°'],['متساوي الأضلاع','أضلاعه الثلاثة متساوية'],['متساوي الساقين','فيه ضلعان متساويان'],['مختلف الأضلاع','لا يوجد فيه ضلعان متساويان'],['النمط الهندسي','أشكال أو أعداد تتكرر أو تتغير بقاعدة']],
[['الزاوية','تتكون من شعاعين لهما نقطة بداية مشتركة'],['المنقلة','أداة لقياس الزوايا بالدرجات'],['الدرجة','وحدة قياس الزاوية °'],['مجموع زوايا المثلث','١٨٠°'],['مجموع زوايا الرباعي','٣٦٠°'],['مساحة المثلث','½ × القاعدة × الارتفاع'],['الكيلوغرام','١٠٠٠ غرام'],['الطن','١٠٠٠ كيلوغرام'],['الساعة','٦٠ دقيقة، والدقيقة ٦٠ ثانية']],
[['المخطط النقطي','نقطة لكل قيمة فوق خط الأعداد'],['البيانات','معلومات نجمعها ونرتبها'],['التكرار','عدد مرات ظهور القيمة'],['الوسط الحسابي','مجموع القيم ÷ عددها'],['الوسيط','القيمة التي في منتصف القيم المرتبة'],['المنوال','القيمة الأكثر تكراراً'],['المدى','أكبر قيمة − أصغر قيمة'],['القائمة المنظمة','كتابة كل الحالات بترتيب']]];

/* ---------- التوجيه ---------- */
const routes=[];const route=(re,fn)=>routes.push([re,fn]);
const LEAVE=[];const onLeave=f=>LEAVE.push(f);const runLeave=()=>{while(LEAVE.length){try{LEAVE.pop()()}catch(e){}}};
const go=h=>{location.hash=h};
function render(){runLeave();const h=location.hash.replace(/^#/,'')||'/home';for(const [re,fn] of routes){const m=h.match(re);if(m){let r;try{r=fn(...m.slice(1))}catch(e){console.error(e);r={title:'خطأ',html:'<div class="card">حدث خطأ غير متوقع. <a class="btn" href="#/home">الرئيسية</a></div>'}}show(r);return}}go('#/home')}
function show(r){$('#ttl').textContent=r.title||'رياضيات ٥';$('#sub').textContent=r.sub||'';const b=$('#backBtn');b.hidden=!r.back;b.onclick=()=>{if(typeof r.back=='function')r.back();else go(r.back)};
 $('#tabbar').classList.toggle('hide',!!r.immersive);document.querySelectorAll('#tabbar a').forEach(a=>a.classList.toggle('on',a.dataset.t==r.tab));
 document.body.style.paddingBottom=r.immersive?'24px':'';V.innerHTML=r.html;V.classList.remove('in');void V.offsetWidth;V.classList.add('in');scrollTo(0,0);upTop();r.mount&&r.mount(V);checkBadges()}
addEventListener('hashchange',render);
$('#starPill').onclick=()=>go('#/me');

/* ---------- عناصر مشتركة ---------- */
const ring=(pct,col,txt)=>{const r=22,c=2*Math.PI*r;return `<div class="ring"><svg width="54" height="54"><circle cx="27" cy="27" r="${r}" fill="none" stroke="var(--bg2)" stroke-width="6"/><circle cx="27" cy="27" r="${r}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct/100)}"/></svg><b>${txt}</b></div>`};
const chPct=c=>Math.round(chStars(c)/(CH[c].ls.length*3)*100);
const bookRange=(c,l)=>{const a=CH[c].ls[l].pg;let nx=CH[c].ls[l+1]?CH[c].ls[l+1].pg:(CH[c+1]?CH[c+1].ls[0].pg:199);return[a,Math.min(198,Math.max(a,nx-1))]};
const pgSrc=n=>`pages/p-${String(n).padStart(3,'0')}.jpg`;
const srcTag=q=>q.src=='book'?'<span class="src book">📖 من الكتاب</span>':q.src=='ext'?'<span class="src ext">🌍 إضافي</span>':'';

/* ---------- الرئيسية ---------- */
route(/^\/home$/,()=>{const last=S.last&&CH[S.last.c]&&CH[S.last.c].ls[S.last.l]?S.last:{c:0,l:0};const lc=CH[last.c],ll=lc.ls[last.l];const done=S.daily==today();const sc=!isStandalone();const tip=TIPS[new Date().getDate()%TIPS.length];
 return{title:'رياضيات الخامس الابتدائي',sub:'علي الصفار .. دعم لبراعم العراق',tab:'home',html:`
 <div class="hero"><div class="top"><div class="avatar">${S.avatar}</div><div><h2>أهلاً يا ${S.name||'بطل'}! 👋</h2><p>المستوى ${ar(lvl())} • ${lvName()}</p></div></div>
  <div class="lvl"><div class="row"><span>⚡ ${ar(S.xp)} نقطة خبرة</span><span>التالي: ${ar(lvl()*150)}</span></div><div class="bar"><i style="width:${lvPct()}%"></i></div></div>
  <div class="stats"><div><b>${ar(totalStars())}</b>نجمة</div><div><b>🔥 ${ar(S.streak.last==today()||S.streak.last==new Date(Date.now()-864e5).toISOString().slice(0,10)?S.streak.n:0)}</b>أيام متتالية</div><div><b>${ar(Object.keys(S.badges).filter(k=>BADGES.some(b=>b.id==k)).length)}</b>وسام</div></div></div>
 <button class="cont" data-go="#/les/${last.c}/${last.l}/learn"><div class="ic" style="background:${lc.col}">${lc.ic}</div><div class="tx"><span class="sm">تابع من حيث توقفت</span><b>${ll.t}</b><span class="sm">الفصل ${ar(last.c+1)}: ${lc.t}</span></div><span style="font-size:1.6rem">›</span></button>
${(()=>{const r=resLoad();return r&&r.i<r.items.length?`<button class="cont" data-go="${r.key}" style="border:2px solid var(--gold,#ffb81f)"><div class="ic" style="background:#ffb81f">📝</div><div class="tx"><span class="sm">اختبار غير مكتمل</span><b>${r.title}</b><span class="sm">أجبت ${ar(r.i)} من ${ar(r.items.length)} • ✅ ${ar(r.score)} ❌ ${ar(r.wrong.length)}</span></div><span style="font-size:1.6rem">›</span></button>`:''})()}
 <button class="daily ${done?'done':''}" data-go="#/daily"><div class="em">${done?'✅':'☀️'}</div><div><h3>تحدي اليوم</h3><p>${done?'أحسنت! عُد غداً لتحدٍّ جديد':'٥ أسئلة من فصول مختلفة لتحافظ على سلسلتك 🔥'}</p></div><span class="go">${done?'تدرّب':'ابدأ'}</span></button>
 <div class="tiles">
  <button class="tile" data-go="#/games" style="background:linear-gradient(135deg,#ff8a3d,#ff5d8f)" data-bg="🎮"><span class="em">🎮</span><b>ألعاب</b><span>٤ ألعاب ممتعة</span></button>
  <button class="tile" data-go="#/lab" style="background:linear-gradient(135deg,#17a361,#0f8a8a)" data-bg="🧪"><span class="em">🧪</span><b>المختبر</b><span>جرّب وتعلّم</span></button>
  <button class="tile" data-go="#/cards/${last.c}" style="background:linear-gradient(135deg,#4c3fd6,#8a5cff)" data-bg="🃏"><span class="em">🃏</span><b>بطاقات</b><span>مفردات كل فصل</span></button>
  <button class="tile" data-go="#/big" style="background:linear-gradient(135deg,#e5484d,#ff8a3d)" data-bg="🏆"><span class="em">🏆</span><b>التحدي الكبير</b><span>٢٠ سؤالاً</span></button></div>
 <div class="sec"><h3>📚 الفصول</h3><a href="#/lessons">عرض الكل</a></div>
 <div class="hs">${CH.map((c,i)=>`<button class="chc" data-go="#/ch/${i}" style="background:${c.col}"><span class="no">${ar(i+1)}</span><span class="em">${c.ic}</span><b>${c.t}</b><small>${ar(c.ls.length)} دروس</small><div class="bar"><i style="width:${chPct(i)}%"></i></div></button>`).join('')}</div>
 ${sc?`<div class="install"><div class="em">📲</div><div class="tx"><b>ثبّت التطبيق على جهازك</b><p>يعمل دون إنترنت وبأيقونة على الشاشة الرئيسية</p></div><button class="btn" id="ins">تثبيت</button></div>`:''}
 <div class="row"><button class="btn ghost" id="qr" style="flex:1">📱 الباركود</button><button class="btn ghost" id="shr" style="flex:1">📤 مشاركة</button></div>
 <div class="tip"><span class="em">💡</span><div><b>نصيحة اليوم</b><br>${tip}</div></div>`,
 mount(el){el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));const i=el.querySelector('#ins');if(i)i.onclick=doInstall;el.querySelector('#qr').onclick=qrSheet;el.querySelector('#shr').onclick=qrSheet}}});

/* ---------- الدروس ---------- */
route(/^\/lessons$/,()=>({title:'الدروس',sub:'١٠ فصول • '+ar(CH.reduce((a,c)=>a+c.ls.length,0))+' درساً',tab:'lessons',html:`<div class="chl">${CH.map((c,i)=>`<button class="chrow" data-go="#/ch/${i}" style="--c:${c.col}"><div class="em">${c.ic}</div><div class="tx"><div class="no">الفصل ${ar(i+1)}</div><h3>${c.t}</h3><div class="sm">${ar(c.ls.length)} دروس • أتقنت ${ar(mastered(i))}/٥٠ سؤالاً</div></div>${ring(chPct(i),c.col,ar(chPct(i))+'٪')}</button>`).join('')}</div>`,mount(el){el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go))}}));
route(/^\/ch\/(\d+)$/,ci=>{ci=+ci;const c=CH[ci];return{title:`الفصل ${ar(ci+1)}`,sub:c.t,back:'#/lessons',tab:'lessons',html:`
 <div class="banner" style="background:linear-gradient(135deg,${c.col},${c.col}bb)"><div class="em">${c.ic}</div><div><h2>${c.t}</h2><p>${ar(c.ls.length)} دروس • ⭐ ${ar(chStars(ci))}/${ar(c.ls.length*3)}</p></div></div>
 ${c.ls.map((l,j)=>`<button class="les" data-go="#/les/${ci}/${j}/learn" style="--c:${c.col}"><div class="no">${ar(j+1)}</div><div class="t"><b>${l.t}</b><span class="sm">صفحة ${ar(l.pg)} من الكتاب</span></div>${starsHtml(starsOf(ci,j))}</button>`).join('')}
 <div class="card"><h3>📝 بنك أسئلة الفصل</h3><p class="sm">٥٠ سؤالاً: <b>${ar(BANK[ci].filter(q=>q.src=='book').length)}</b> من تمارين الكتاب والباقي إضافية. أتقنت ${ar(mastered(ci))}/٥٠.</p><div class="bar" style="margin-bottom:12px"><i style="width:${mastered(ci)*2}%"></i></div><button class="btn acc block" id="tst">ابدأ اختبار الفصل</button></div>
 <button class="btn ghost block" data-go="#/cards/${ci}">🃏 بطاقات مفردات الفصل</button>`,
 mount(el){el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));el.querySelector('#tst').onclick=()=>testSheet(ci)}}});
function testSheet(ci){let n=20,f='all';const bkN=BANK[ci].filter(q=>q.src=='book').length;sheet(`<h3>📝 اختبار الفصل ${ar(ci+1)}</h3><p class="sm">اختر عدد الأسئلة:</p><div class="chips" id="cn">${[10,20,30,40,50].map(x=>`<button class="chip${x==n?' on':''}" data-n="${x}">${ar(x)}</button>`).join('')}</div><p class="sm" style="margin-top:12px">مصدر الأسئلة:</p><div class="chips" id="cf"><button class="chip on" data-f="all">الكل</button><button class="chip" data-f="book">من الكتاب (${ar(bkN)})</button><button class="chip" data-f="ext">إضافية (${ar(50-bkN)})</button></div><button class="btn acc block" id="st" style="margin-top:16px">ابدأ الآن 🚀</button>`,(sh,close)=>{
 const upd=()=>{const max=f=='book'?bkN:f=='ext'?50-bkN:50;sh.querySelectorAll('#cn button').forEach(b=>{b.classList.toggle('on',+b.dataset.n==n);b.style.opacity=+b.dataset.n>max?.35:1})};
 sh.querySelectorAll('#cn button').forEach(b=>b.onclick=()=>{n=+b.dataset.n;upd()});sh.querySelectorAll('#cf button').forEach(b=>b.onclick=()=>{f=b.dataset.f;sh.querySelectorAll('#cf button').forEach(x=>x.classList.toggle('on',x==b));upd()});
 sh.querySelector('#st').onclick=()=>{close();go(`#/test/${ci}/${n}/${f}`)}})}

/* رسوم توضيحية للمراتب */
function illHTML(ci,li){if(ci==0)return `<div class="ill"><h4>🪜 سلّم المراتب</h4>${ladderHTML(7)}<h4>📊 جدول المراتب والفترات</h4><div id="ill1">${pvChartHTML(li==0?3482615970:li==1?45230000:36749218)}</div></div>`;
 if(ci==4&&li<=3)return `<div class="ill"><h4>🔟 مراتب الكسر العشري</h4><div id="ill1">${decChartHTML(['3.472','0.65','12.508','7.049'][li])}</div>${decStripsHTML()}</div>`;return ''}
function illBind(el,ci,li){const b=el.querySelector('#ill1');if(!b)return;ci==0?pvChartBind(b):decChartBind(b)}
/* ---------- الدرس ---------- */
route(/^\/les\/(\d+)\/(\d+)\/(\w+)$/,(ci,li,tab)=>{ci=+ci;li=+li;const c=CH[ci],l=c.ls[li];S.last={c:ci,l:li};save();
 const tabs=[['learn','📖 أتعلّم'],['try','🧪 جرّب'],['book','📕 الكتاب'],['quiz','✏️ تدرّب']];const lab=LABMAP[ci+'.'+li];
 let body='';
 if(tab=='learn')body=`<div class="card"><h3>${l.t}</h3><p>${l.intro}</p>${illHTML(ci,li)}<ul class="pts">${l.pts.map(p=>`<li>${p}</li>`).join('')}</ul><div class="ex"><b>مثال:</b> ${l.ex.q}<div class="reveal" id="rv"><b>الحل:</b> ${l.ex.s}</div><button class="btn gold" id="rb" style="margin-top:8px;padding:6px 14px">أظهر الحل 👀</button></div></div><div class="row"><button class="btn block acc" data-go="#/les/${ci}/${li}/try" style="flex:1">🧪 جرّب بنفسك</button><button class="btn block" data-go="#/quiz/${ci}/${li}/5" style="flex:1">✏️ تدرّب</button></div>`;
 else if(tab=='try')body=`<div class="card" id="lab"></div>`;
 else if(tab=='book'){const [a,b]=bookRange(ci,li);body=`<div class="bookv"><div class="scr" id="scr"><img id="pgimg" src="${pgSrc(a)}" alt="صفحة من الكتاب"></div><div class="nv"><button class="btn ghost" id="nx">‹ التالية</button><b id="pn">صفحة ${ar(a)}</b><button class="btn ghost" id="pv">السابقة ›</button></div><p class="sm">اضغط على الصفحة للتكبير • صفحات الدرس ${ar(a)}–${ar(b)}</p></div>`}
 else body=`<div class="card"><h3>✏️ تدريب الدرس</h3><p class="sm">أسئلة جديدة تتغير أرقامها كل مرة. اختر عدد الأسئلة:</p><div class="grid3">${[5,10,15].map(n=>`<button class="btn" data-go="#/quiz/${ci}/${li}/${n}">${ar(n)} أسئلة</button>`).join('')}</div></div><div class="card"><h3>⭐ نجومك: ${starsHtml(starsOf(ci,li))}</h3><p class="sm">احصل على ٩٠٪ أو أكثر للحصول على ٣ نجوم.</p></div>`;
 const nx=CH[ci].ls[li+1]?`#/les/${ci}/${li+1}/learn`:null;
 return{title:l.t,sub:`الفصل ${ar(ci+1)} • الدرس ${ar(li+1)}`,back:`#/ch/${ci}`,tab:'lessons',html:`<div class="tabs">${tabs.map(([k,n])=>`<a href="#/les/${ci}/${li}/${k}" class="${tab==k?'on':''}">${n}</a>`).join('')}</div>${body}${tab=='learn'&&nx?`<button class="btn ghost block" data-go="${nx}">الدرس التالي ›</button>`:''}`,
 mount(el){el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  illBind(el,ci,li);const rb=el.querySelector('#rb');if(rb)rb.onclick=()=>{el.querySelector('#rv').classList.add('show');rb.remove();sfx.tap()};
  if(tab=='try'){const box=el.querySelector('#lab');if(lab){box.innerHTML=`<h3>${LABS[lab].ic} ${LABS[lab].t}</h3><p class="sm">${LABS[lab].d}</p><div id="lb"></div>`;LABS[lab].render(box.querySelector('#lb'))}else box.innerHTML='<p>لا يوجد مختبر لهذا الدرس.</p>'}
  if(tab=='book'){const [a,b]=bookRange(ci,li);S.pg=S.pg||{};let p=Math.min(b,Math.max(a,S.pg[ci+'_'+li]||a));const img=el.querySelector('#pgimg');const upd=()=>{S.pg[ci+'_'+li]=p;save();img.src=pgSrc(p);img.classList.remove('z');el.querySelector('#pn').textContent='صفحة '+ar(p);el.querySelector('#scr').scrollTop=0};img.onclick=()=>img.classList.toggle('z');
   upd();el.querySelector('#nx').onclick=()=>{if(p<b){p++;upd()}};el.querySelector('#pv').onclick=()=>{if(p>a){p--;upd()}}}}}});

/* ---------- الاختبار ---------- */
const RK='math5resume';
const resLoad=()=>{try{return JSON.parse(localStorage.getItem(RK)||'null')}catch(e){return null}};
const resSave=o=>{try{localStorage.setItem(RK,JSON.stringify(o))}catch(e){}};
const resClear=()=>{try{localStorage.removeItem(RK)}catch(e){}};
function quizScreen(cfg){return{title:cfg.title,sub:cfg.sub||'',back:cfg.back,immersive:true,tab:cfg.tab||'lessons',html:'<div class="qwrap" id="qw"></div>',mount(el){
 const W=el.querySelector('#qw');const sv0=resLoad();const can=!!(sv0&&sv0.key==location.hash&&sv0.i>0&&sv0.i<sv0.items.length);
 const run=sv=>{const items=sv?sv.items:cfg.items,N=items.length;let i=sv?sv.i:0,score=sv?sv.score:0,combo=sv?sv.combo:0,xp=sv?sv.xp:0,locked=false;const wrong=sv?sv.wrong.map(k=>items[k]):[];
 const draw=()=>{const q=items[i];locked=false;W.innerHTML=`<div class="qtop"><button class="x" id="qx" aria-label="خروج">✕</button><div class="bar"><i style="width:${i/N*100}%"></i></div><b>${ar(i+1)}/${ar(N)}</b></div><div class="qinfo"><span>${srcTag(q)}</span><span class="cnt"><b class="c-ok" id="cok">✅ ${ar(score)}</b><b class="c-no" id="cno">❌ ${ar(wrong.length)}</b></span><span class="combo">${combo>=2?'🔥 '+ar(combo)+' متتالية':''}</span></div><div class="qcard"><div class="q">${q.q}</div><div class="opts">${q.opts.map((o,k)=>`<button class="opt" data-k="${k}">${o}</button>`).join('')}</div><div id="fb"></div></div>`;
  W.querySelector('#qx').onclick=()=>{if(i==0||confirm('سيُحفظ تقدّمك لتكمل لاحقاً. هل تريد الخروج؟'))go(cfg.back)};
  W.querySelectorAll('.opt').forEach(b=>b.onclick=()=>pickA(b,q))};
 const pickA=(b,q)=>{if(locked)return;locked=true;const k=+b.dataset.k,ok=k==q.a;S.answered++;
  W.querySelectorAll('.opt').forEach((x,m)=>{if(m==q.a)x.classList.add('ok');else if(m==k)x.classList.add('no')});
  if(ok){score++;combo++;S.correct++;S.bestCombo=Math.max(S.bestCombo,combo);const g=10+(combo>=3?5:0);xp+=g;floatXP('+'+ar(g));sfx.ok();vib(15);if(q.id){const m=S.mastered[cfg.ci]||(S.mastered[cfg.ci]=[]);if(!m.includes(q.id))m.push(q.id)}}else{combo=0;wrong.push(q);sfx.no();vib([60,40,60])}
  resSave({key:location.hash,title:cfg.title,items,i:i+1,score,combo,xp,wrong:wrong.map(w=>items.indexOf(w)),N});W.querySelector('#cok').textContent='✅ '+ar(score);W.querySelector('#cno').textContent='❌ '+ar(wrong.length);(ok?W.querySelector('#cok'):W.querySelector('#cno')).classList.add('bump');
  W.querySelector('#fb').innerHTML=`<div class="fb ${ok?'ok':'no'}">${ok?pick(['أحسنت! 🌟','ممتاز! 👏','رائع! 🎉','إجابة صحيحة! ✅']):'الإجابة الصحيحة: <b>'+q.opts[q.a]+'</b>'}${q.why?'<br>'+q.why:''}</div><button class="btn block" id="nxt" style="margin-top:12px">${i+1<N?'السؤال التالي ›':'النتيجة 🏁'}</button>`;
  W.querySelector('#nxt').onclick=()=>{i++;i<N?draw():finish()};setTimeout(()=>{const n=W.querySelector('#nxt');n&&n.scrollIntoView({block:'nearest',behavior:'smooth'})},60);save()};
 const finish=()=>{resClear();const pct=score/N,st=pct>=.9?3:pct>=.7?2:pct>=.4?1:0;touchStreak();const bonus=st*10;xp+=bonus;
  const info=cfg.onDone?cfg.onDone({score,total:N,st,pct})||{}:{};save();addXP(xp);if(st==3){confetti();sfx.win()}
  W.innerHTML=`<div class="card res"><h2>${st==3?'ممتاز جداً! 🏅':st==2?'عمل رائع! 👏':st==1?'جيد، تابع التدريب 💪':'حاول مرة ثانية 🌱'}</h2><div class="big">${st?'⭐'.repeat(st):'☆'}</div><div class="rstat"><div class="ok"><b>${ar(score)}</b>✅ صحيحة</div><div class="no"><b>${ar(wrong.length)}</b>❌ خاطئة</div><div><b>${ar(Math.round(pct*100))}٪</b>النسبة</div></div><p class="sm">من مجموع ${ar(N)} سؤالاً</p><p>⚡ حصلت على <b>${ar(xp)}</b> نقطة خبرة</p>${info.note?`<p class="sm">${info.note}</p>`:''}<div class="row c"><button class="btn" id="again">🔁 إعادة</button>${cfg.next?`<button class="btn ok" id="nx2">التالي ›</button>`:''}<button class="btn ghost" id="bk">رجوع</button></div></div>
  ${wrong.length?`<div class="card"><h3>📌 راجع أخطاءك (${ar(wrong.length)})</h3>${wrong.map(q=>`<div class="wrong">${q.q}<div>الصحيح: <b>${q.opts[q.a]}</b></div></div>`).join('')}</div>`:'<div class="card res">🎯 بلا أخطاء!</div>'}`;
  W.querySelector('#again').onclick=()=>render();const n2=W.querySelector('#nx2');if(n2)n2.onclick=()=>go(cfg.next);W.querySelector('#bk').onclick=()=>go(cfg.back);checkBadges();upTop()};
 draw()};
 if(can){W.innerHTML=`<div class="card res"><h2>📌 لديك اختبار غير مكتمل</h2><p>أجبت عن <b>${ar(sv0.i)}</b> من <b>${ar(sv0.items.length)}</b> سؤالاً</p><div class="rstat"><div class="ok"><b>${ar(sv0.score)}</b>✅ صحيحة</div><div class="no"><b>${ar(sv0.wrong.length)}</b>❌ خاطئة</div></div><div class="row c"><button class="btn ok" id="rsm">▶ متابعة من حيث توقفت</button><button class="btn ghost" id="rst">🔁 البدء من جديد</button></div></div>`;W.querySelector('#rsm').onclick=()=>run(sv0);W.querySelector('#rst').onclick=()=>{resClear();run(null)}}else run(null)}}}
route(/^\/quiz\/(\d+)\/(\d+)\/(\d+)$/,(ci,li,n)=>{ci=+ci;li=+li;n=+n;const l=CH[ci].ls[li];const items=[],seen=new Set();let g=0;while(items.length<n&&g<300){g++;let q;try{q=l.gen()}catch(e){continue}if(!q||seen.has(q.q))continue;seen.add(q.q);items.push(q)}
 return quizScreen({title:l.t,sub:`تدريب • ${ar(n)} أسئلة`,back:`#/les/${ci}/${li}/learn`,items,ci,next:CH[ci].ls[li+1]?`#/les/${ci}/${li+1}/learn`:null,onDone:r=>{const k=starKey(ci,li);if(r.st>(S.stars[k]||0)){S.stars[k]=r.st;return{note:'🌟 رقمت نجومك في هذا الدرس!'}}}})});
route(/^\/test\/(\d+)\/(\d+)\/(\w+)$/,(ci,n,f)=>{ci=+ci;n=+n;const items=pickBank(ci,n,f=='all'?null:f);return quizScreen({title:`اختبار الفصل ${ar(ci+1)}`,sub:`${CH[ci].t} • ${ar(items.length)} سؤالاً`,back:`#/ch/${ci}`,items,ci,onDone:r=>{const k=ci+'_'+n;if(r.pct>(S.testBest[k]||0))S.testBest[k]=r.pct;return{note:`🧠 أتقنت ${ar(mastered(ci))} من ٥٠ سؤالاً في هذا الفصل`}}})});
route(/^\/daily$/,()=>{const cs=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,5);const items=cs.map(c=>pickBank(c,1,null)[0]);return quizScreen({title:'تحدي اليوم ☀️',sub:'٥ أسئلة من فصول مختلفة',back:'#/home',tab:'home',items,ci:0,onDone:r=>{if(S.daily!=today()){S.daily=today();S.dailyN++;return{note:'🔥 أكملت تحدي اليوم وحافظت على سلسلتك!'}}}})});
route(/^\/big$/,()=>{let items=[];for(let c=0;c<10;c++)items=items.concat(pickBank(c,2,null));return quizScreen({title:'التحدي الكبير 🏆',sub:'٢٠ سؤالاً من كل الكتاب',back:'#/home',tab:'home',items:shuffle(items),ci:0,onDone:r=>{S.best.big=Math.max(S.best.big||0,Math.round(r.pct*100))}})});

/* ---------- البطاقات ---------- */
route(/^\/cards\/(\d+)$/,ci=>{ci=+ci;const c=CH[ci];const deck=shuffle(VOCAB[ci].map((v,k)=>({k,v})));return{title:'بطاقات المفردات',sub:`الفصل ${ar(ci+1)}: ${c.t}`,back:`#/ch/${ci}`,tab:'lessons',html:`<div class="chips" id="cs">${CH.map((x,i)=>`<button class="chip${i==ci?' on':''}" data-i="${i}">${x.ic} ${ar(i+1)}</button>`).join('')}</div><div id="cw"></div>`,mount(el){
 el.querySelectorAll('#cs button').forEach(b=>b.onclick=()=>go('#/cards/'+b.dataset.i));let i=0,known=0;const W=el.querySelector('#cw');
 const draw=()=>{if(i>=deck.length){W.innerHTML=`<div class="card res"><h2>أنهيت البطاقات 🎉</h2><p>عرفت <b>${ar(known)}</b> من <b>${ar(deck.length)}</b></p><div class="row c"><button class="btn" id="rs">🔁 من جديد</button><button class="btn ghost" id="bk">رجوع</button></div></div>`;W.querySelector('#rs').onclick=render;W.querySelector('#bk').onclick=()=>go('#/ch/'+ci);if(known==deck.length){confetti();sfx.win()}return}
  const d=deck[i].v;W.innerHTML=`<div class="qinfo"><span>${ar(i+1)} / ${ar(deck.length)}</span><span class="sm">اضغط على البطاقة لقلبها</span></div><div class="fc" id="fc" style="--c:${c.col}"><div class="in"><div class="f">${d[0]}</div><div class="b">${d[1]}</div></div></div><div class="grid2" style="margin-top:14px"><button class="btn bad" id="no">🔁 أعيدها</button><button class="btn ok" id="ok">✅ عرفتها</button></div>`;
  W.querySelector('#fc').onclick=e=>{e.currentTarget.classList.toggle('flip');sfx.tap()};W.querySelector('#ok').onclick=()=>{known++;i++;sfx.ok();draw()};W.querySelector('#no').onclick=()=>{deck.push(deck[i]);i++;draw()}};draw()}}});

/* ---------- المختبر ---------- */
route(/^\/lab$/,()=>({title:'المختبر التفاعلي',sub:ar(Object.keys(LABS).length)+' تجربة',back:'#/games',tab:'games',html:`<div class="grid2">${Object.entries(LABS).map(([k,l])=>`<button class="card" data-go="#/lab/${k}" style="text-align:right"><div style="font-size:2rem">${l.ic}</div><h3 style="font-size:1rem">${l.t}</h3><div class="sm">${l.d}</div></button>`).join('')}</div>`,mount(el){el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go))}}));
route(/^\/lab\/(\w+)$/,id=>{const l=LABS[id];return{title:l.t,back:'#/lab',tab:'games',html:`<div class="card"><p class="sm">${l.d}</p><div id="lb"></div></div>`,mount(el){l.render(el.querySelector('#lb'))}}});

/* ---------- الألعاب ---------- */
route(/^\/games$/,()=>({title:'ألعاب الرياضيات',sub:'العب وتعلّم',tab:'games',html:`<div class="chl">${Object.entries(GAMES).map(([k,g])=>`<button class="gcard" data-go="#/game/${k}" style="background:${g.col}"><div class="em">${g.ic}</div><div style="flex:1"><b>${g.t}</b><p>${g.d}</p></div><div style="text-align:center;font-family:var(--display)"><small>الأفضل</small><br><b>${ar(S.best[k]||0)}</b></div></button>`).join('')}<button class="gcard" data-go="#/lab" style="background:linear-gradient(135deg,#17a361,#0f8a8a)"><div class="em">🧪</div><div style="flex:1"><b>المختبر التفاعلي</b><p>${ar(Object.keys(LABS).length)} تجربة: منقلة، كسور، غربال، مخططات…</p></div>›</button></div>`,mount(el){el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go))}}));
route(/^\/game\/(\w+)$/,id=>{const g=GAMES[id];return{title:g.t,back:'#/games',tab:'games',immersive:id!='memory'&&false,html:'<div id="gm"></div>',mount(el){g.start(el.querySelector('#gm'))}}});
function gameOver(el,id,score,extra,again,menu){touchStreak();const prev=S.best[id]||0,nb=score>prev;if(nb)S.best[id]=score;if(id=='memory'){S.wins.memory=(S.wins.memory||0)+1}const xp=Math.min(60,Math.round(score/4));addXP(xp);save();if(nb||id=='memory'){confetti();sfx.win()}else sfx.ok();
 el.innerHTML=`<div class="card res"><h2>${nb?'رقم قياسي جديد! 🏆':'انتهت اللعبة'}</h2><div class="big">${ar(score)}</div><p>نقطة ${extra?'• '+extra:''}</p><p class="sm">أفضل نتيجة: ${ar(S.best[id]||0)} • ⚡ +${ar(xp)} خبرة</p><div class="row c"><button class="btn acc" id="ag">🔁 العب مجدداً</button><button class="btn ghost" id="bk">الألعاب</button></div></div>`;
 el.querySelector('#ag').onclick=()=>menu?menu():again();el.querySelector('#bk').onclick=()=>go('#/games');checkBadges()}

/* ---------- إنجازاتي ---------- */
route(/^\/me$/,()=>{const acc=S.answered?Math.round(S.correct/S.answered*100):0;return{title:'إنجازاتي',sub:`المستوى ${ar(lvl())} • ${lvName()}`,tab:'me',html:`
 <div class="hero"><div class="top"><div class="avatar" id="av">${S.avatar}</div><div style="flex:1"><h2>${S.name||'بطل الرياضيات'}</h2><p>المستوى ${ar(lvl())} • ${lvName()}</p></div></div><div class="lvl"><div class="row"><span>⚡ ${ar(S.xp)}</span><span>${ar(lvl()*150)}</span></div><div class="bar"><i style="width:${lvPct()}%"></i></div></div></div>
 <div class="card"><h3>✏️ ملفي</h3><input type="text" id="nm" placeholder="اكتب اسمك" value="${S.name}" maxlength="18" style="width:100%;font:700 1.1rem var(--body);padding:10px;border-radius:14px;border:2px solid var(--line);background:var(--bg);color:var(--ink);text-align:center"><div class="avs" style="margin-top:10px">${AVATARS.map(a=>`<button class="${a==S.avatar?'on':''}" data-a="${a}">${a}</button>`).join('')}</div></div>
 <div class="card"><h3>📊 إحصائياتي</h3><div class="kv"><span>⭐ النجوم</span><b>${ar(totalStars())} / ${ar(CH.reduce((a,c)=>a+c.ls.length*3,0))}</b></div><div class="kv"><span>🎯 أسئلة أجبتها</span><b>${ar(S.answered)}</b></div><div class="kv"><span>✅ نسبة الدقة</span><b>${ar(acc)}٪</b></div><div class="kv"><span>🔥 أطول سلسلة صحيحة</span><b>${ar(S.bestCombo)}</b></div><div class="kv"><span>📅 أيام متتالية</span><b>${ar(S.streak.n)}</b></div></div>
 <div class="card"><h3>📘 تقدّم الفصول</h3>${CH.map((c,i)=>`<div style="margin:10px 0"><div class="row" style="justify-content:space-between"><span>${c.ic} ${c.t}</span><b>${ar(chPct(i))}٪</b></div><div class="bar"><i style="width:${chPct(i)}%;background:${c.col}"></i></div></div>`).join('')}</div>
 <div class="card"><h3>🏅 الأوسمة (${ar(BADGES.filter(b=>S.badges[b.id]).length)}/${ar(BADGES.length)})</h3><div class="badges">${BADGES.map(b=>`<div class="bd ${S.badges[b.id]?'':'lock'}" title="${b.d}"><i>${b.ic}</i>${b.t}<div class="sm" style="font-weight:400">${b.d}</div></div>`).join('')}</div></div>`,
 mount(el){const nm=el.querySelector('#nm');nm.oninput=()=>{S.name=nm.value.trim();save()};el.querySelectorAll('.avs button').forEach(b=>b.onclick=()=>{S.avatar=b.dataset.a;save();render()})}}});

/* ---------- المزيد ---------- */
const sw=(id,on,t)=>`<div class="set"><span>${t}</span><button class="sw ${on?'on':''}" id="${id}" role="switch" aria-checked="${on}" aria-label="${t}"></button></div>`;
route(/^\/more$/,()=>{const inst=isStandalone();return{title:'المزيد',tab:'more',html:`
 <div class="card" style="text-align:center"><div style="font-size:3rem">🧮</div><h3>رياضيات الخامس الابتدائي</h3><p class="sm">مبني على كتاب الرياضيات للصف الخامس الابتدائي – العراق<br>تصميم: علي الصفار .. دعم لبراعم العراق 🇮🇶</p></div>
 <div class="card"><h3>📲 التثبيت والمشاركة</h3>${inst?'<p>✅ التطبيق مثبّت على جهازك.</p>':'<button class="btn block" id="ins">📲 تثبيت التطبيق</button>'}<div class="row" style="margin-top:10px"><button class="btn ghost" id="qr" style="flex:1">📱 الباركود</button><button class="btn ghost" id="shr" style="flex:1">📤 مشاركة</button></div></div>
 <div class="card"><h3>⚙️ الإعدادات</h3>${sw('s1',document.documentElement.dataset.theme=='dark','الوضع الليلي 🌙')}${sw('s2',S.sound,'الأصوات والاهتزاز 🔊')}</div>
 <div class="card"><h3>🧭 اختصارات</h3><div class="grid2"><button class="btn ghost" data-go="#/lab">🧪 المختبر</button><button class="btn ghost" data-go="#/daily">☀️ تحدي اليوم</button><button class="btn ghost" data-go="#/big">🏆 التحدي الكبير</button><button class="btn ghost" data-go="#/me">🏅 إنجازاتي</button></div></div>
 <div class="card"><h3>🗑️ البيانات</h3><p class="sm">تُحفظ نجومك وتقدّمك على هذا الجهاز فقط.</p><button class="btn bad block" id="rs">إعادة ضبط التقدم</button></div>
 <p class="sm" style="text-align:center">الإصدار ٢٫٠</p>`,
 mount(el){el.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));const i=el.querySelector('#ins');if(i)i.onclick=doInstall;el.querySelector('#qr').onclick=qrSheet;el.querySelector('#shr').onclick=qrSheet;
  el.querySelector('#s1').onclick=()=>$('#themeBtn').click();el.querySelector('#s2').onclick=e=>{S.sound=!S.sound;e.currentTarget.classList.toggle('on',S.sound);save()};
  el.querySelector('#rs').onclick=()=>{if(confirm('سيتم حذف كل النجوم والتقدم. هل أنت متأكد؟')){S=JSON.parse(JSON.stringify(DEF));save();applyTheme();toast('تمت إعادة الضبط');go('#/home')}}}}});

/* ---------- التشغيل ---------- */
applyTheme();matchMedia('(prefers-color-scheme: dark)').addEventListener&&matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme);
touchStreak();save();render();setTimeout(()=>$('#splash').classList.add('off'),1250);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
