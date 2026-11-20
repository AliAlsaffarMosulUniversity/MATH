'use strict';
/* ====== المختبر التفاعلي ====== */
const EAST='٠١٢٣٤٥٦٧٨٩';
const num=v=>{const s=String(v).replace(/[٠-٩]/g,d=>EAST.indexOf(d)).replace(/٫/g,'.').replace(/[٬, ]/g,'');const x=parseFloat(s);return isNaN(x)?0:x};
const showN=x=>{if(!isFinite(x))return '—';let s=String(+x.toFixed(6));let [i,f]=s.split('.');const neg=i[0]=='-';if(neg)i=i.slice(1);if(i.length>4)i=i.replace(/\B(?=(\d{3})+(?!\d))/g,',');return ar((neg?'-':'')+i+(f?'.'+f:'')).replace(/\./g,'٫').replace(/,/g,'٬')};
const decs=x=>{const s=String(x);return s.includes('.')?s.split('.')[1].length:0};
const rng=(id,min,max,v,step=1,lab='')=>`<label>${lab}<b id="${id}v">${ar(v)}</b></label><input type="range" id="${id}" min="${min}" max="${max}" value="${v}" step="${step}">`;
const bind=(el,ids,fn)=>{ids.forEach(i=>el.querySelector('#'+i).addEventListener('input',fn));fn()};
const Q=(el,s)=>el.querySelector(s);
function pieSVG(n,d,col='#ff8a3d',size=130){const cx=size/2,cy=size/2,r=size/2-6;let s=`<svg class="pie" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
 if(d==1||n>=d)s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
 for(let i=0;i<d;i++){const a0=i/d*2*Math.PI-Math.PI/2,a1=(i+1)/d*2*Math.PI-Math.PI/2;const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
  s+=`<path d="M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${1/d>.5?1:0} 1 ${x1} ${y1} Z" fill="${i<n?col:'#e9edff'}" stroke="#fff" stroke-width="2"/>`}
 return s+'</svg>'}
function barSVG(n,d,col){const w=280,h=34;let s=`<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:320px;direction:ltr">`;for(let i=0;i<d;i++)s+=`<rect x="${i*w/d+1}" y="2" width="${w/d-2}" height="${h-4}" rx="5" fill="${i<n?col:'#e9edff'}"/>`;return s+'</svg>'}
function clockSVG(min){const h=(Math.floor(min/60))%12,m=min%60;const ah=(h+m/60)*30,am=m*6;let s='<svg viewBox="0 0 120 120" width="120"><circle cx="60" cy="60" r="56" fill="#fff" stroke="#4c3fd6" stroke-width="5"/>';
 for(let i=0;i<12;i++){const a=i*30*Math.PI/180;s+=`<line x1="${60+46*Math.sin(a)}" y1="${60-46*Math.cos(a)}" x2="${60+52*Math.sin(a)}" y2="${60-52*Math.cos(a)}" stroke="#333" stroke-width="3"/>`}
 const hand=(a,l,w,c)=>`<line x1="60" y1="60" x2="${60+l*Math.sin(a*Math.PI/180)}" y2="${60-l*Math.cos(a*Math.PI/180)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
 return s+hand(ah,30,6,'#1c2340')+hand(am,44,4,'#e5484d')+'<circle cx="60" cy="60" r="4" fill="#1c2340"/></svg>'}
const hm=min=>{let h=Math.floor(min/60)%24,m=min%60;const ap=h>=12?'م':'ص';h=h%12||12;return ar(h+':'+String(m).padStart(2,'0'))+' '+ap};

const LABS={
place:{t:'مستكشف القيمة المكانية',ic:'🔢',d:'اكتب عدداً حتى المليارات وانظر مراتبه وقراءته',render(el){
 el.innerHTML=`<div class="lab"><input type="text" id="n" inputmode="numeric" value="4325000000" maxlength="13"><div class="row c"><button class="btn ghost" id="rnd">🎲 عدد عشوائي</button></div><div id="o"></div></div>`;
 const f=()=>{let s=num(Q(el,'#n').value);s=Math.floor(Math.abs(s));let t=String(s);if(t.length>12){t=t.slice(0,12);}const n=Number(t);const d=t.split('');
  const dg=d.map((x,i)=>{const p=d.length-1-i;return `<div class="dg"><b>${ar(x)}</b><span>${PL[p]||''}</span></div>`}).join('');
  const b=Math.floor(n/1e9),m=Math.floor(n%1e9/1e6),r=n%1e6;
  const verb=[b?`${ar(b)} ${b==1?'مليار':b==2?'ملياران':b<=10?'مليارات':'مليار'}`:'',m?`${ar(m)} ${m<=10&&m>2?'ملايين':'مليون'}`:'',r?fmt(r):''].filter(Boolean).join(' و')||'صفر';
  const ex=d.map((x,i)=>x!='0'?`${ar(x)} × ${fmt(Math.pow(10,d.length-1-i))}`:'').filter(Boolean).join(' + ');
  Q(el,'#o').innerHTML=`<div class="dig">${dg}</div><div class="out" style="margin-top:10px"><div class="big">${fmt(n)}</div><div>${verb}</div><div class="sm" style="direction:ltr">${ex}</div></div>`};
 Q(el,'#n').addEventListener('input',f);Q(el,'#rnd').onclick=()=>{Q(el,'#n').value=String(R(1e5,9.9e9));f()};f()}},
compare:{t:'مقارنة الأعداد',ic:'⚖️',d:'قارن أي عددين (صحيحين أو عشريين)',render(el){
 el.innerHTML=`<div class="lab"><div class="grid2"><input type="text" id="a" inputmode="decimal" value="0.7"><input type="text" id="b" inputmode="decimal" value="0.69"></div><div class="out"><div class="big" id="s" style="font-size:3rem"></div><div id="e"></div></div></div>`;
 bind(el,['a','b'],()=>{const a=num(Q(el,'#a').value),b=num(Q(el,'#b').value);Q(el,'#s').innerHTML=`<bdi dir="ltr">${showN(a)} ${a>b?'&gt;':a<b?'&lt;':'='} ${showN(b)}</bdi>`;Q(el,'#e').textContent=a==b?'العددان متساويان':a>b?'العدد الأول أكبر':'العدد الأول أصغر'})}},
round:{t:'آلة التقريب',ic:'🎯',d:'حرّك المؤشر وشاهد إلى أي عدد يُقرَّب',render(el){
 const modes={m:{n:'أقرب مليون',base:3e6,u:1e6,step:1e4},w:{n:'أقرب عدد صحيح',base:3,u:1,step:.01},t:{n:'أقرب عُشر',base:3.4,u:.1,step:.001},h:{n:'أقرب جزء من مئة',base:3.45,u:.01,step:.0001}};let md='m';
 el.innerHTML=`<div class="lab"><div class="chips" id="ch">${Object.entries(modes).map(([k,v])=>`<button class="chip${k=='m'?' on':''}" data-k="${k}">${v.n}</button>`).join('')}</div><div id="nl"></div><input type="range" id="sl" min="0" max="1000" value="320"><div class="out" id="o"></div></div>`;
 const f=()=>{const M=modes[md],t=Q(el,'#sl').value/1000,v=M.base+M.u*t,lo=M.base,hi=M.base+M.u;const near=(v-lo<hi-v)?lo:hi;const dp=md=='m'||md=='w'?0:md=='t'?1:2;const sh=x=>md=='m'?fmt(Math.round(x)):showN(+x.toFixed(4));
  Q(el,'#nl').innerHTML=`<div class="nl"><div class="ln"></div><div class="tk" style="left:0"><span>${sh(lo)}</span></div><div class="tk" style="left:50%"><span style="color:#888">${sh((lo+hi)/2)}</span></div><div class="tk" style="left:100%"><span>${sh(hi)}</span></div><div class="mk" style="left:${t*100}%"></div><div class="mid" style="left:50%">المنتصف</div></div>`;
  Q(el,'#o').innerHTML=`العدد: <b>${sh(v)}</b><div class="big">≈ ${sh(near)}</div><div class="sm">${near==hi?'أقرب إلى العدد الأكبر (نصف أو أكثر)':'أقرب إلى العدد الأصغر'}</div>`};
 Q(el,'#sl').addEventListener('input',f);el.querySelectorAll('#ch button').forEach(b=>b.onclick=()=>{md=b.dataset.k;el.querySelectorAll('#ch button').forEach(x=>x.classList.toggle('on',x==b));f()});f()}},
calc:{t:'آلة العمليات',ic:'🧮',d:'اجمع واطرح واضرب واقسم مع التقدير',render(el){
 let op='+';el.innerHTML=`<div class="lab"><div class="grid2"><input type="text" id="a" inputmode="decimal" value="2500.5"><input type="text" id="b" inputmode="decimal" value="1300.25"></div><div class="chips" id="ops">${['+','−','×','÷'].map(o=>`<button class="chip${o=='+'?' on':''}" data-o="${o}" style="font-size:1.3rem">${o}</button>`).join('')}</div><div class="out" id="o"></div></div>`;
 const f=()=>{const a=num(Q(el,'#a').value),b=num(Q(el,'#b').value);let r,x='';const k=Math.max(decs(a),decs(b),0),S=Math.pow(10,k);
  if(op=='+')r=(Math.round(a*S)+Math.round(b*S))/S;else if(op=='−')r=(Math.round(a*S)-Math.round(b*S))/S;else if(op=='×')r=Math.round(a*S)*Math.round(b*S)/(S*S);else{if(b==0){Q(el,'#o').textContent='لا يمكن القسمة على صفر';return}r=a/b;if(Number.isInteger(a)&&Number.isInteger(b)){x=`<div class="sm">الناتج ${showN(Math.floor(a/b))} والباقي ${showN(a%b)}</div>`}}
  const est=op=='+'?Math.round(a)+Math.round(b):op=='−'?Math.round(a)-Math.round(b):op=='×'?Math.round(a)*Math.round(b):Math.round(a/Math.max(1,Math.round(b)));
  Q(el,'#o').innerHTML=`<div class="big" dir="ltr">${showN(a)} ${op} ${showN(b)} = ${showN(r)}</div>${x}<div class="sm">التقدير بالتقريب إلى عدد صحيح: ≈ ${showN(est)}</div>`};
 bind(el,['a','b'],f);el.querySelectorAll('#ops button').forEach(b=>b.onclick=()=>{op=b.dataset.o;el.querySelectorAll('#ops button').forEach(x=>x.classList.toggle('on',x==b));f()})}},
times10:{t:'الضرب في ١٠ و١٠٠ و١٠٠٠',ic:'0️⃣',d:'شاهد الأصفار تُضاف عند الضرب',render(el){
 el.innerHTML=`<div class="lab"><input type="text" id="n" inputmode="numeric" value="45">${rng('k',0,3,2,1,'عدد الأصفار')}<div class="out" id="o"></div></div>`;
 bind(el,['n','k'],()=>{const n=Math.floor(num(Q(el,'#n').value)),k=+Q(el,'#k').value;Q(el,'#kv').textContent=ar(k);const m=Math.pow(10,k);Q(el,'#o').innerHTML=`<div class="big" dir="ltr">${ar(n)} × ${fmt(m)} = ${ar(n)}<span style="color:#e5484d">${'٠'.repeat(k)}</span></div><div>${fmt(n*m)}</div>`})}},
mult:{t:'نموذج مساحة الضرب',ic:'🟦',d:'قسّم العددين إلى عشرات وآحاد',render(el){
 el.innerHTML=`<div class="lab">${rng('a',11,99,34,1,'العدد الأول')}${rng('b',11,99,27,1,'العدد الثاني')}<div id="o"></div></div>`;
 bind(el,['a','b'],()=>{const a=+Q(el,'#a').value,b=+Q(el,'#b').value;Q(el,'#av').textContent=ar(a);Q(el,'#bv').textContent=ar(b);const ta=Math.floor(a/10)*10,oa=a%10,tb=Math.floor(b/10)*10,ob=b%10;
  Q(el,'#o').innerHTML=`<table class="pv" style="font-size:1.1rem"><tr><th></th><th>${ar(tb)}</th><th>${ar(ob)}</th></tr><tr><th>${ar(ta)}</th><td style="background:#ffd9b8">${fmt(ta*tb)}</td><td style="background:#d4e4ff">${fmt(ta*ob)}</td></tr><tr><th>${ar(oa)}</th><td style="background:#d4e4ff">${fmt(oa*tb)}</td><td style="background:#d9f5df">${fmt(oa*ob)}</td></tr></table><div class="out"><div class="big" dir="ltr">${ar(a)} × ${ar(b)} = ${fmt(a*b)}</div><div class="sm">نجمع النواتج الأربعة: ${[ta*tb,ta*ob,oa*tb,oa*ob].map(fmt).join(' + ')}</div></div>`})}},
divide:{t:'مختبر القسمة',ic:'➗',d:'وزّع العناصر على مجموعات وشاهد الباقي',render(el){
 el.innerHTML=`<div class="lab">${rng('n',10,120,47,1,'المقسوم')}${rng('d',2,12,5,1,'المقسوم عليه')}<div class="dots" id="dt"></div><div class="out" id="o"></div></div>`;
 bind(el,['n','d'],()=>{const n=+Q(el,'#n').value,d=+Q(el,'#d').value;Q(el,'#nv').textContent=ar(n);Q(el,'#dv').textContent=ar(d);const q=Math.floor(n/d),r=n%d;let h='';for(let g=0;g<q;g++){for(let i=0;i<d;i++)h+='<i></i>';h+='<em></em>'}for(let i=0;i<r;i++)h+='<i class="r"></i>';Q(el,'#dt').innerHTML=h;
  Q(el,'#o').innerHTML=`<div class="big" dir="ltr">${ar(n)} ÷ ${ar(d)} = ${ar(q)}${r?` r ${ar(r)}`:''}</div><div class="sm">${ar(q)} مجموعة كاملة${r?` وبقي ${ar(r)} (الباقي)`:' بلا باقٍ'}</div><div class="sm" dir="ltr">${ar(q)} × ${ar(d)} + ${ar(r)} = ${ar(n)}</div>`})}},
decimal:{t:'شبكة الكسور العشرية',ic:'🟧',d:'مئة مربع تمثل الواحد: لوّن الأجزاء',render(el){
 el.innerHTML=`<div class="lab">${rng('p',0,100,35,1,'عدد المربعات الملونة من ١٠٠')}<div class="cellg" id="g" style="grid-template-columns:repeat(10,1fr)"></div><div class="out" id="o"></div></div>`;
 bind(el,['p'],()=>{const p=+Q(el,'#p').value;Q(el,'#pv').textContent=ar(p);let h='';for(let i=0;i<100;i++)h+=`<i class="${i<p?'on':''}"></i>`;Q(el,'#g').innerHTML=h;const g=gcd(p,100)||1;
  Q(el,'#o').innerHTML=`<div class="big">${fmtD(p*10)}</div><div>الكسر العشري = <span dir="ltr">${frac(p,100)}</span>${p&&g>1?` = ${showF(p,100)}`:''}</div><div class="sm">${ar(p)} جزءاً من مئة = ${ar(p)}٪</div>`})}},
fraction:{t:'مختبر الكسور',ic:'🍕',d:'اختر البسط والمقام وشاهد الكسر ومكافئاته',render(el){
 el.innerHTML=`<div class="lab">${rng('d',2,12,8,1,'المقام (عدد الأجزاء)')}${rng('n',0,12,3,1,'البسط (الأجزاء الملونة)')}<div id="pie"></div><div id="bar" style="text-align:center"></div><div class="out" id="o"></div></div>`;
 bind(el,['d','n'],()=>{const d=+Q(el,'#d').value;const nEl=Q(el,'#n');nEl.max=d;let n=Math.min(+nEl.value,d);nEl.value=n;Q(el,'#dv').textContent=ar(d);Q(el,'#nv').textContent=ar(n);
  Q(el,'#pie').innerHTML=pieSVG(n,d);Q(el,'#bar').innerHTML=barSVG(n,d,'#ff8a3d');const g=gcd(n,d)||1;
  Q(el,'#o').innerHTML=`<div class="big" dir="ltr">${frac(n,d)}${n&&g>1?` = ${frac(n/g,d/g)}`:''}</div><div>الكسور المكافئة: ${[2,3,4].map(k=>`<span dir="ltr">${frac(n*k,d*k)}</span>`).join(' ، ')}</div><div class="sm">القيمة العشرية ≈ ${showN(n/d)}</div>`})}},
fracadd:{t:'جمع الكسور وطرحها',ic:'➕',d:'وحّد المقامات وشاهد الجمع على الأشرطة',render(el){
 let op='+';el.innerHTML=`<div class="lab"><div class="chips" id="ops"><button class="chip on" data-o="+">جمع +</button><button class="chip" data-o="−">طرح −</button></div>${rng('d1',2,12,3,1,'مقام الكسر الأول')}${rng('n1',1,11,1,1,'بسطه')}${rng('d2',2,12,4,1,'مقام الكسر الثاني')}${rng('n2',1,11,1,1,'بسطه')}<div id="bars" style="text-align:center"></div><div class="out" id="o"></div></div>`;
 const f=()=>{const d1=+Q(el,'#d1').value,d2=+Q(el,'#d2').value;Q(el,'#n1').max=d1-1;Q(el,'#n2').max=d2-1;const n1=Math.min(+Q(el,'#n1').value,d1-1),n2=Math.min(+Q(el,'#n2').value,d2-1);Q(el,'#n1').value=n1;Q(el,'#n2').value=n2;
  ['d1','n1','d2','n2'].forEach(k=>Q(el,'#'+k+'v').textContent=ar(Q(el,'#'+k).value));const m=lcm(d1,d2),a=n1*m/d1,b=n2*m/d2;let r=op=='+'?a+b:a-b;let neg=false;if(r<0){neg=true}
  Q(el,'#bars').innerHTML=barSVG(n1,d1,'#ff8a3d')+barSVG(n2,d2,'#6c8dff');
  Q(el,'#o').innerHTML=neg?'اجعل الكسر الأول أكبر عند الطرح':`<div class="sm">المقام المشترك (م.م.أ) = ${ar(m)}</div><div dir="ltr">${frac(a,m)} ${op} ${frac(b,m)} = ${frac(r,m)}</div><div class="big" dir="ltr">${showF(r,m)}</div>`};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',f));el.querySelectorAll('#ops button').forEach(b=>b.onclick=()=>{op=b.dataset.o;el.querySelectorAll('#ops button').forEach(x=>x.classList.toggle('on',x==b));f()});f()}},
fracmul:{t:'ضرب الكسور بالمساحة',ic:'🟪',d:'التداخل بين الكسرين هو ناتج الضرب',render(el){
 el.innerHTML=`<div class="lab">${rng('d1',2,8,4,1,'مقام الأول (أعمدة)')}${rng('n1',1,7,3,1,'بسط الأول')}${rng('d2',2,8,3,1,'مقام الثاني (صفوف)')}${rng('n2',1,7,2,1,'بسط الثاني')}<div class="cellg" id="g"></div><div class="out" id="o"></div></div>`;
 const f=()=>{const d1=+Q(el,'#d1').value,d2=+Q(el,'#d2').value;Q(el,'#n1').max=d1-1;Q(el,'#n2').max=d2-1;const n1=Math.min(+Q(el,'#n1').value,d1-1),n2=Math.min(+Q(el,'#n2').value,d2-1);Q(el,'#n1').value=n1;Q(el,'#n2').value=n2;['d1','n1','d2','n2'].forEach(k=>Q(el,'#'+k+'v').textContent=ar(Q(el,'#'+k).value));
  const g=Q(el,'#g');g.style.gridTemplateColumns=`repeat(${d1},1fr)`;let h='';for(let r=0;r<d2;r++)for(let c=0;c<d1;c++){const a=c<n1,b=r<n2;h+=`<i class="${a&&b?'both':a?'on':b?'on2':''}" style="aspect-ratio:1.3"></i>`}g.innerHTML=h;
  Q(el,'#o').innerHTML=`<div class="big" dir="ltr">${frac(n1,d1)} × ${frac(n2,d2)} = ${frac(n1*n2,d1*d2)}${gcd(n1*n2,d1*d2)>1?` = ${showF(n1*n2,d1*d2)}`:''}</div><div class="sm">البنفسجي = التداخل = ${ar(n1*n2)} من ${ar(d1*d2)} مربعاً</div>`};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',f));f()}},
primes:{t:'غربال الأعداد الأولية',ic:'⭐',d:'اضغط أي عدد لتعرف قواسمه وهل هو أولي',render(el){
 let h='';for(let i=1;i<=100;i++)h+=`<button class="sv${isPrime(i)?' p':''}${i==1?' one':''}" data-n="${i}">${ar(i)}</button>`;
 el.innerHTML=`<div class="lab"><div class="sieve" id="sv">${h}</div><div class="chips"><button class="chip on" id="tg">إظهار الأولية ⭐</button></div><div class="out" id="o">اضغط على عدد</div></div>`;
 let show=true;const sv=Q(el,'#sv');const paint=()=>sv.querySelectorAll('.sv').forEach(b=>b.classList.toggle('p',show&&isPrime(+b.dataset.n)));
 const info=n=>{const ds=[];for(let i=1;i<=n;i++)if(n%i==0)ds.push(i);const fz=n>1?factorize(n):{};sv.querySelectorAll('.sv').forEach(b=>{b.classList.remove('sel','d');if(ds.includes(+b.dataset.n)&&+b.dataset.n!=n)b.classList.add('d');if(+b.dataset.n==n)b.classList.add('sel')});
  Q(el,'#o').innerHTML=`<div class="big">${ar(n)} ${n==1?'ليس أولياً ولا غير أولي':isPrime(n)?'عدد أولي ⭐':'عدد غير أولي'}</div><div>قواسمه: ${ds.map(ar).join('، ')} (${ar(ds.length)})</div>${n>1&&!isPrime(n)?`<div class="sm">التحليل: ${facStr(fz)}</div>`:''}`};
 sv.addEventListener('click',e=>{const b=e.target.closest('.sv');if(b)info(+b.dataset.n)});Q(el,'#tg').onclick=e=>{show=!show;e.target.classList.toggle('on',show);paint()}}},
gcdlcm:{t:'ق.م.أ و م.م.أ',ic:'🔗',d:'أدخل عددين واعرف قواسمهما ومضاعفاتهما',render(el){
 el.innerHTML=`<div class="lab"><div class="grid2"><input type="text" id="a" inputmode="numeric" value="12"><input type="text" id="b" inputmode="numeric" value="18"></div><div class="out" id="o"></div></div>`;
 bind(el,['a','b'],()=>{let a=Math.min(999,Math.max(1,Math.floor(num(Q(el,'#a').value)))),b=Math.min(999,Math.max(1,Math.floor(num(Q(el,'#b').value))));const dv=n=>{const d=[];for(let i=1;i<=n;i++)if(n%i==0)d.push(i);return d};const da=dv(a),db=dv(b),com=da.filter(x=>db.includes(x));const g=gcd(a,b),l=lcm(a,b);const mu=(n,l2)=>{const r=[];for(let i=1;i<=6;i++)r.push(n*i);return r};
  Q(el,'#o').innerHTML=`<div>قواسم ${ar(a)}: ${da.map(ar).join('، ')}</div><div>قواسم ${ar(b)}: ${db.map(ar).join('، ')}</div><div>المشتركة: <b>${com.map(ar).join('، ')}</b></div><div class="big">ق.م.أ = ${ar(g)}</div><div class="sm">مضاعفات ${ar(a)}: ${mu(a).map(ar).join('، ')}…</div><div class="sm">مضاعفات ${ar(b)}: ${mu(b).map(ar).join('، ')}…</div><div class="big">م.م.أ = ${fmt(l)}</div>`})}},
factors:{t:'شجرة العوامل الأولية',ic:'🌳',d:'حلّل أي عدد إلى عوامله الأولية بالصورة الأسية',render(el){
 el.innerHTML=`<div class="lab"><input type="text" id="n" inputmode="numeric" value="360"><div class="out" id="o"></div></div>`;
 bind(el,['n'],()=>{let n=Math.min(100000,Math.max(2,Math.floor(num(Q(el,'#n').value))));let steps=[],m=n;for(let p=2;m>1;p++){while(m%p==0){steps.push(`${ar(m)} ÷ ${ar(p)} = ${ar(m/p)}`);m/=p}}const ff=x=>{const m={};for(let p=2;x>1;p++){while(x%p==0){m[p]=(m[p]||0)+1;x/=p}}return m};
  Q(el,'#o').innerHTML=`<div class="big">${ar(n)} = ${facStr(ff(n))}</div><div class="sm" dir="rtl">${steps.map(s=>`<div>${s}</div>`).join('')}</div>`})}},
squares:{t:'المربعات والمكعبات',ic:'🧊',d:'شاهد المربع الكامل والجذر والمكعب',render(el){
 el.innerHTML=`<div class="lab">${rng('k',1,10,4,1,'العدد')}<div class="cellg" id="g"></div><div class="out" id="o"></div></div>`;
 bind(el,['k'],()=>{const k=+Q(el,'#k').value;Q(el,'#kv').textContent=ar(k);const g=Q(el,'#g');g.style.gridTemplateColumns=`repeat(${k},1fr)`;g.style.maxWidth=Math.min(300,k*34)+'px';g.innerHTML=Array.from({length:k*k},()=>'<i class="on"></i>').join('');
  Q(el,'#o').innerHTML=`<div class="big" dir="ltr">${sup(k,2)} = ${ar(k*k)}</div><div>√${ar(k*k)} = ${ar(k)}</div><div class="big" dir="ltr">${sup(k,3)} = ${ar(k*k*k)}</div><div>∛${ar(k*k*k)} = ${ar(k)}</div>`})}},
lines:{t:'التوازي والتعامد',ic:'📏',d:'دوّر المستقيم الثاني وراقب العلاقة',render(el){
 el.innerHTML=`<div class="lab">${rng('a',0,180,90,1,'زاوية المستقيم الأزرق (بالدرجات)')}<div id="s"></div><div class="out" id="o"></div></div>`;
 bind(el,['a'],()=>{const a=+Q(el,'#a').value;Q(el,'#av').textContent=ar(a);const L1=90,c=80,cy=60;const ln=(deg,col,ox=0)=>{const r=deg*Math.PI/180;return `<line x1="${c+ox-90*Math.cos(r)}" y1="${cy+90*Math.sin(r)}" x2="${c+ox+90*Math.cos(r)}" y2="${cy-90*Math.sin(r)}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`};
  const par=a<3||a>177,perp=Math.abs(a-90)<3;Q(el,'#s').innerHTML=`<svg class="fig" viewBox="0 0 160 120" width="240" style="background:#fbfdff;border-radius:14px">${ln(0,'#e8590c',0).replace('y1="60"','y1="40"').replace('y2="60"','y2="40"')}${par?ln(0,'#1e6fd9',0).replace('y1="60"','y1="85"').replace('y2="60"','y2="85"'):ln(a,'#1e6fd9')}</svg>`;
  Q(el,'#o').innerHTML=par?'<div class="big">متوازيان ✅</div><div>لا يتقاطعان مهما امتدا</div>':perp?'<div class="big">متعامدان ✅</div><div>يتقاطعان بزاوية ٩٠°</div>':'<div class="big">متقاطعان</div><div>غير متعامدين</div>'})}},
angle:{t:'المنقلة التفاعلية',ic:'📐',d:'حرّك الزاوية من ٠° إلى ١٨٠° وتعرّف نوعها',render(el){
 el.innerHTML=`<div class="lab">${rng('a',0,180,60,1,'قياس الزاوية (°)')}<div id="s"></div><div class="out" id="o"></div></div>`;
 bind(el,['a'],()=>{const a=+Q(el,'#a').value;Q(el,'#av').textContent=ar(a);const rad=a*Math.PI/180,vx=110,vy=105,L=95;let ticks='';for(let d=0;d<=180;d+=10){const r=d*Math.PI/180;ticks+=`<line x1="${vx+L*Math.cos(r)}" y1="${vy-L*Math.sin(r)}" x2="${vx+(L+(d%30?5:10))*Math.cos(r)}" y2="${vy-(L+(d%30?5:10))*Math.sin(r)}" stroke="#999" stroke-width="2"/>`}
  const col=a<90?'#17a361':a==90?'#e8590c':a<180?'#a24dff':'#e5484d';
  Q(el,'#s').innerHTML=`<svg class="fig" viewBox="0 0 220 125" width="320" style="background:#fbfdff;border-radius:14px"><path d="M${vx-L} ${vy} A${L} ${L} 0 0 1 ${vx+L} ${vy}" fill="#eef2ff" stroke="#9bb3da" stroke-width="2"/>${ticks}<line x1="${vx}" y1="${vy}" x2="${vx+L+10}" y2="${vy}" stroke="#1c2340" stroke-width="3"/><line x1="${vx}" y1="${vy}" x2="${vx+(L+10)*Math.cos(rad)}" y2="${vy-(L+10)*Math.sin(rad)}" stroke="${col}" stroke-width="4" stroke-linecap="round"/><path d="M${vx+30} ${vy} A30 30 0 0 0 ${vx+30*Math.cos(rad)} ${vy-30*Math.sin(rad)}" fill="none" stroke="${col}" stroke-width="3"/></svg>`;
  Q(el,'#o').innerHTML=`<div class="big" style="color:${col}">${a==0?'لا زاوية':a<90?'زاوية حادة':a==90?'زاوية قائمة':a<180?'زاوية منفرجة':'زاوية مستقيمة'}</div><div>${ar(a)}°</div>`})}},
tri:{t:'مثلثات وزواياها',ic:'🔺',d:'غيّر زاويتين وتعلّم أن المجموع ١٨٠°',render(el){
 el.innerHTML=`<div class="lab">${rng('a',20,120,60,1,'الزاوية الأولى')}${rng('b',20,120,60,1,'الزاوية الثانية')}<div id="s"></div><div class="out" id="o"></div></div>`;
 bind(el,['a','b'],()=>{let a=+Q(el,'#a').value,b=+Q(el,'#b').value;if(a+b>=170){b=170-a;Q(el,'#b').value=b}Q(el,'#av').textContent=ar(a);Q(el,'#bv').textContent=ar(b);const c=180-a-b;Q(el,'#s').innerHTML=triSVG(a,b,true);const mx=Math.max(a,b,c);
  Q(el,'#o').innerHTML=`<div dir="ltr">${ar(a)}° + ${ar(b)}° + ${ar(c)}° = ١٨٠°</div><div class="big">${mx>90?'مثلث منفرج الزاوية':mx==90?'مثلث قائم الزاوية':'مثلث حاد الزوايا'}</div>`})}},
triarea:{t:'مساحة المثلث',ic:'🔻',d:'غيّر القاعدة والارتفاع وشاهد المساحة',render(el){
 el.innerHTML=`<div class="lab">${rng('b',2,16,8,1,'القاعدة (سم)')}${rng('h',2,12,5,1,'الارتفاع (سم)')}<div id="s"></div><div class="out" id="o"></div></div>`;
 bind(el,['b','h'],()=>{const b=+Q(el,'#b').value,h=+Q(el,'#h').value;Q(el,'#bv').textContent=ar(b);Q(el,'#hv').textContent=ar(h);const W=230,s=Math.min(200/b,110/h);const w=b*s,hh=h*s,x0=15,y0=125;
  Q(el,'#s').innerHTML=`<svg class="fig" viewBox="0 0 230 140" width="300"><rect x="${x0}" y="${y0-hh}" width="${w}" height="${hh}" fill="#fff3dc" stroke="#ffb81f" stroke-dasharray="5"/><polygon points="${x0},${y0} ${x0+w},${y0} ${x0+w*0.35},${y0-hh}" fill="#cfe0ff" stroke="#4c3fd6" stroke-width="3"/><line x1="${x0+w*0.35}" y1="${y0}" x2="${x0+w*0.35}" y2="${y0-hh}" stroke="#e5484d" stroke-dasharray="4" stroke-width="2"/><text x="${x0+w/2}" y="136" font-size="11" text-anchor="middle">${ar(b)}</text><text x="${x0+w*0.35+4}" y="${y0-hh/2}" font-size="11" fill="#e5484d">${ar(h)}</text></svg>`;
  Q(el,'#o').innerHTML=`<div class="sm">المثلث نصف المستطيل المحيط به</div><div class="big" dir="ltr">(${ar(b)} × ${ar(h)}) ÷ ٢ = ${showN(b*h/2)} سم²</div>`})}},
convert:{t:'محوّل الوحدات',ic:'⚖️',d:'كتلة (غم، كغم، طن) وزمن (ثانية، دقيقة، ساعة، يوم)',render(el){
 const U={m:{غم:1,كغم:1000,طن:1e6},t:{ثانية:1,دقيقة:60,ساعة:3600,يوم:86400,أسبوع:604800}};let k='m';
 el.innerHTML=`<div class="lab"><div class="chips" id="k"><button class="chip on" data-k="m">الكتلة</button><button class="chip" data-k="t">الزمن</button></div><input type="text" id="v" inputmode="decimal" value="3"><div class="grid2"><select id="f"></select><select id="g"></select></div><div class="out" id="o"></div></div>`;
 const fill=()=>{const keys=Object.keys(U[k]);Q(el,'#f').innerHTML=keys.map(x=>`<option>${x}</option>`).join('');Q(el,'#g').innerHTML=keys.map(x=>`<option>${x}</option>`).join('');Q(el,'#f').selectedIndex=k=='m'?1:2;Q(el,'#g').selectedIndex=0};
 const f=()=>{const v=num(Q(el,'#v').value),a=Q(el,'#f').value,b=Q(el,'#g').value;const r=v*U[k][a]/U[k][b];Q(el,'#o').innerHTML=`<div class="big" dir="rtl">${showN(v)} ${a} = ${showN(r)} ${b}</div>`};
 fill();el.querySelectorAll('#k button').forEach(b=>b.onclick=()=>{k=b.dataset.k;el.querySelectorAll('#k button').forEach(x=>x.classList.toggle('on',x==b));fill();f()});bind(el,['v','f','g'],f);Q(el,'#f').addEventListener('change',f);Q(el,'#g').addEventListener('change',f)}},
clock:{t:'الساعة والمدة الزمنية',ic:'⏰',d:'حدّد وقت البداية والمدة واعرف وقت الانتهاء',render(el){
 el.innerHTML=`<div class="lab">${rng('s',0,1435,510,5,'وقت البداية')}${rng('d',5,600,95,5,'المدة (بالدقائق)')}<div class="row c" id="c" style="gap:30px"></div><div class="out" id="o"></div></div>`;
 bind(el,['s','d'],()=>{const s=+Q(el,'#s').value,d=+Q(el,'#d').value;Q(el,'#sv').textContent=hm(s);Q(el,'#dv').textContent=ar(d);const e=(s+d)%1440;Q(el,'#c').innerHTML=`<div style="text-align:center">${clockSVG(s)}<div>${hm(s)}</div></div><div style="font-size:2rem;align-self:center">⬅</div><div style="text-align:center">${clockSVG(e)}<div>${hm(e)}</div></div>`;
  Q(el,'#o').innerHTML=`المدة: <b>${dur(Math.floor(d/60),d%60)||'—'}</b><div class="sm">${ar(Math.floor(d/60))} ساعة × ٦٠ + ${ar(d%60)} دقيقة = ${ar(d)} دقيقة</div>`})}},
dots:{t:'المخطط النقطي والإحصاء',ic:'📊',d:'أضف نقاطاً وشاهد الوسط والوسيط والمنوال والمدى',render(el){
 let data=[3,4,4,5,5,5,7];el.innerHTML=`<div class="lab"><div class="sm">اضغط على عدد لإضافة نقطة (اضغط مطولاً/الزر الأحمر لإزالة آخر نقطة)</div><div class="dp" id="dp"></div><div class="row c"><button class="btn ghost" id="rd">🎲 بيانات عشوائية</button><button class="btn bad" id="cl">مسح</button></div><div class="out" id="o"></div></div>`;
 const f=()=>{let h='';for(let v=1;v<=10;v++){const c=data.filter(x=>x==v).length;h+=`<button data-v="${v}">${'<i></i>'.repeat(c)}<span>${ar(v)}</span></button>`}Q(el,'#dp').innerHTML=h;
  if(!data.length){Q(el,'#o').textContent='لا توجد بيانات';return}const s=data.slice().sort((a,b)=>a-b),n=s.length,mean=s.reduce((a,b)=>a+b,0)/n,med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;const cnt={};s.forEach(x=>cnt[x]=(cnt[x]||0)+1);const mc=Math.max(...Object.values(cnt));const modes=Object.keys(cnt).filter(k=>cnt[k]==mc);
  Q(el,'#o').innerHTML=`<div>عدد البيانات: ${ar(n)}</div><div>الوسط الحسابي = ${showN(mean)}</div><div>الوسيط = ${showN(med)}</div><div>المنوال = ${mc>1&&modes.length<n?modes.map(ar).join(' و'):'لا يوجد'}</div><div>المدى = ${ar(s[n-1]-s[0])}</div>`};
 Q(el,'#dp').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;data.push(+b.dataset.v);if(data.length>40)data.shift();f()});Q(el,'#rd').onclick=()=>{data=Array.from({length:R(6,12)},()=>R(2,9));f()};Q(el,'#cl').onclick=()=>{data=[];f()};f()}},
numpattern:{t:'مولّد الأنماط',ic:'🔁',d:'اختر البداية والقاعدة وشاهد الحدود',render(el){
 let op='+';el.innerHTML=`<div class="lab"><div class="chips" id="ops"><button class="chip on" data-o="+">+ جمع</button><button class="chip" data-o="−">− طرح</button><button class="chip" data-o="×">× ضرب</button></div>${rng('s',0,50,3,1,'الحد الأول')}${rng('d',1,12,4,1,'مقدار التغير')}<div class="seq" id="q"></div><div class="out" id="o"></div></div>`;
 const f=()=>{const s=+Q(el,'#s').value,d=+Q(el,'#d').value;Q(el,'#sv').textContent=ar(s);Q(el,'#dv').textContent=ar(d);const dd=op=='×'?Math.max(d,2):d;let t=s,a=[];for(let i=0;i<8;i++){a.push(t);t=op=='+'?t+dd:op=='−'?t-dd:t*dd}Q(el,'#q').innerHTML=a.map((x,i)=>`<span style="animation-delay:${i*.05}s">${fmt(x)}</span>`).join('');Q(el,'#o').textContent=`القاعدة: ${op=='+'?'نضيف':op=='−'?'ننقص':'نضرب في'} ${ar(dd)} في كل مرة`};
 el.querySelectorAll('input').forEach(i=>i.addEventListener('input',f));el.querySelectorAll('#ops button').forEach(b=>b.onclick=()=>{op=b.dataset.o;el.querySelectorAll('#ops button').forEach(x=>x.classList.toggle('on',x==b));f()});f()}},
combos:{t:'القائمة المنظمة',ic:'👕',d:'كم زياً مختلفاً؟ اضرب عدد الخيارات',render(el){
 el.innerHTML=`<div class="lab">${rng('a',1,5,2,1,'عدد القمصان')}${rng('b',1,5,3,1,'عدد البناطيل')}<div class="combo-g" id="g"></div><div class="out" id="o"></div></div>`;
 bind(el,['a','b'],()=>{const a=+Q(el,'#a').value,b=+Q(el,'#b').value;Q(el,'#av').textContent=ar(a);Q(el,'#bv').textContent=ar(b);const sh=['🔴','🔵','🟢','🟡','🟣'],pa=['⬛','🟫','⬜','🟦','🟧'];let h='';for(let i=0;i<a;i++)for(let j=0;j<b;j++)h+=`<span>${sh[i]}${pa[j]}</span>`;Q(el,'#g').innerHTML=h;Q(el,'#o').innerHTML=`<div class="big" dir="ltr">${ar(a)} × ${ar(b)} = ${ar(a*b)}</div><div class="sm">عدد الأزياء المختلفة</div>`})}}
};
/* ربط الدروس بالمختبرات */
const LABMAP={'0.0':'place','0.1':'place','0.2':'round','0.3':'compare','1.0':'calc','1.1':'round','1.2':'calc','1.3':'calc','2.0':'times10','2.1':'mult','2.2':'mult','2.3':'round','3.0':'divide','3.1':'divide','3.2':'divide','3.3':'divide','3.4':'divide','4.0':'decimal','4.1':'compare','4.2':'round','4.3':'decimal','4.4':'numpattern','4.5':'compare','5.0':'fracadd','5.1':'fracadd','5.2':'calc','5.3':'fracmul','5.4':'fraction','5.5':'fraction','6.0':'primes','6.1':'factors','6.2':'squares','6.3':'squares','6.4':'gcdlcm','6.5':'primes','7.0':'lines','7.1':'tri','7.2':'angle','7.3':'numpattern','7.4':'numpattern','8.0':'angle','8.1':'tri','8.2':'triarea','8.3':'convert','8.4':'clock','8.5':'triarea','9.0':'dots','9.1':'dots','9.2':'combos'};

/* ====== رسوم توضيحية للمراتب ====== */
const PCOL=['#4c3fd6','#17a361','#e8590c','#d6336c'];
const PNAME=['الآحاد','الآلاف','الملايين','المليارات'];
const SHORT=['آحاد','عشرات','مئات','آلاف','عشرات الآلاف','مئات الآلاف','ملايين','عشرات الملايين','مئات الملايين','مليارات'];
/* سلّم المراتب: كل مرتبة تساوي عشرة أمثال التي قبلها */
function ladderHTML(n=7){let h='<div class="ladder"><div class="lrow">';
 for(let p=n-1;p>=0;p--){const c=PCOL[Math.floor(p/3)];h+=`<div class="lcol"><div class="lval">${fmt(Math.pow(10,p))}</div><div class="lbar" style="height:${22+p*17}px;background:${c}"></div><div class="lnm">${SHORT[p]}</div></div>`;if(p>0)h+='<div class="larr">‹<small>÷١٠</small></div>'}
 return h+'</div><div class="sm" style="text-align:center">كل مرتبة = عشرة أمثال المرتبة التي على يمينها (×١٠) 👉</div></div>'}
/* جدول المراتب والفترات */
function pvChartHTML(n){const t=String(Math.floor(n));const np=Math.max(3,Math.ceil(t.length/3));const s=t.padStart(np*3,'0');const L=s.length;let h='<div class="pvc">';
 for(let g=np-1;g>=0;g--){const c=PCOL[g];h+=`<div class="pp" style="--c:${c}"><div class="ph">${PNAME[g]}</div><div class="pr">`;
  for(let k=2;k>=0;k--){const p=g*3+k,i=L-1-p,d=s[i];const lead=i<L-t.length;h+=`<button class="pcell${lead?' lead':''}" data-p="${p}" data-d="${d}"><small>${['آحاد','عشرات','مئات'][k]}</small><b>${lead?'':ar(d)}</b></button>`}
  h+='</div></div>'}
 return h+'</div><div class="pinfo out" id="pinfo">اضغط على أي رقم لتعرف مرتبته وقيمته 👆</div>'}
function pvChartBind(el){el.querySelectorAll('.pcell').forEach(b=>b.onclick=()=>{if(b.classList.contains('lead'))return;el.querySelectorAll('.pcell').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');const p=+b.dataset.p,d=+b.dataset.d;const v=d*Math.pow(10,p);
 el.querySelector('#pinfo').innerHTML=`الرقم <b>${ar(d)}</b> في مرتبة <b>${PL[p]}</b><br><span class="big">قيمته = ${ar(d)} × ${fmt(Math.pow(10,p))} = ${fmt(v)}</span>`;try{sfx.tap()}catch(e){}})}
/* رسم المراتب العشرية */
function decChartHTML(str){let [i,f]=String(str).split('.');i=(i||'0').slice(-2).padStart(2,'0');f=(f||'').padEnd(3,'0').slice(0,3);
 const hd=['عشرات','آحاد','','أجزاء من عشرة','أجزاء من مئة','أجزاء من ألف'],cols=['#4c3fd6','#4c3fd6','','#e8590c','#d6336c','#a24dff'];const ds=[i[0],i[1],'.',f[0],f[1],f[2]];
 let h='<div class="pvc dec">';ds.forEach((d,k)=>{if(k==2)h+='<div class="dpoint"><b>٫</b><small>الفاصلة</small></div>';else h+=`<button class="pcell dcell" data-k="${k}" data-d="${d}" style="--c:${cols[k]}"><small>${hd[k]}</small><b>${ar(d)}</b></button>`});
 return h+'</div><div class="pinfo out" id="pinfo">اضغط على أي رقم لتعرف مرتبته وقيمته 👆</div>'}
function decChartBind(el){const V=[10,1,0,.1,.01,.001],N=['عشرات','آحاد','','أجزاء من عشرة','أجزاء من مئة','أجزاء من ألف'],FR=['','','','١٠/١','١٠٠/١','١٠٠٠/١'];
 el.querySelectorAll('.dcell').forEach(b=>b.onclick=()=>{el.querySelectorAll('.dcell').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');const k=+b.dataset.k,d=+b.dataset.d;const v=d*V[k];const dec=k>=3?k-2:0;
  el.querySelector('#pinfo').innerHTML=`الرقم <b>${ar(d)}</b> في مرتبة <b>${N[k]}</b><br><span class="big">قيمته = ${k>=3?fmtFixed(v,dec):ar(v)}</span>${k>=3?`<div class="sm">${ar(d)} من ${['عشرة','مئة','ألف'][k-3]} أجزاء</div>`:''}`;try{sfx.tap()}catch(e){}})}
/* شرائح الكسور العشرية: ١ مقسوم إلى ١٠ ثم ١٠٠ */
function decStripsHTML(){const mk=(n,on,c)=>`<div class="strip" style="grid-template-columns:repeat(${n},1fr)">${Array.from({length:n},(_,i)=>`<i style="${i<on?'background:'+c:''}"></i>`).join('')}</div>`;
 return `<div class="strips"><div><b>١</b> الواحد كامل</div>${mk(1,1,'#4c3fd6')}<div><b>٠٫١</b> جزء من عشرة (١ ÷ ١٠)</div>${mk(10,1,'#e8590c')}<div><b>٠٫٠١</b> جزء من مئة (٠٫١ ÷ ١٠)</div>${mk(100,1,'#d6336c')}<div><b>٠٫٠٠١</b> جزء من ألف</div><div class="strip" style="grid-template-columns:repeat(100,1fr)"><i style="background:#a24dff;grid-column:1/2;width:100%"></i></div><div class="sm">كل مرتبة إلى اليمين أصغر بعشر مرات 👉</div></div>`}

/* مختبر: العدّادات والتجميع (١٠ آحاد = عشرة واحدة) */
LABS.blocks={t:'مكعبات المراتب',ic:'🧱',d:'أضف عدّادات في كل مرتبة وشاهد كيف تتجمّع كل ١٠ إلى مرتبة أعلى',render(el){
 const NP=7,c=Array(NP).fill(0);const cols=p=>PCOL[Math.floor(p/3)];const shade=p=>['','','','',''].length&&`hsl(${[250,230,205,150,125,25,350][p]},70%,55%)`;
 el.innerHTML=`<div class="lab"><div class="sm" style="text-align:center">اضغط ＋ لإضافة عدّاد. عند الوصول إلى ١٠ يتحوّل إلى عدّاد واحد في المرتبة التالية ✨</div><div class="blk" id="bk"></div><div class="out" id="o"></div><div class="row c"><button class="btn ghost" id="r">↺ ابدأ من جديد</button><button class="btn ghost" id="rn">🎲 عدد عشوائي</button></div></div>`;
 let msg='';const draw=()=>{let h='';for(let p=NP-1;p>=0;p--){const k=c[p];h+=`<div class="bcol"><div class="bnm">${SHORT[p]}</div><button class="bpm" data-p="${p}" data-s="1" aria-label="زيادة">＋</button><div class="btk" style="--c:${shade(p)}">${Array.from({length:k},()=>'<i></i>').join('')}</div><button class="bpm m" data-p="${p}" data-s="-1" aria-label="نقصان">−</button><div class="bdg">${ar(k)}</div></div>`}
  el.querySelector('#bk').innerHTML=h;let n=0;for(let p=0;p<NP;p++)n+=c[p]*Math.pow(10,p);el.querySelector('#o').innerHTML=`<div class="big">${fmt(n)}</div>${msg?`<div class="sm" style="color:var(--ok)">${msg}</div>`:''}<div class="sm" dir="ltr">${c.map((x,p)=>x?`${ar(x)}×${fmt(Math.pow(10,p))}`:'').filter(Boolean).reverse().join(' + ')||'٠'}</div>`;
  el.querySelectorAll('.bpm').forEach(b=>b.onclick=()=>{const p=+b.dataset.p,s=+b.dataset.s;msg='';if(s>0){c[p]++;if(c[p]>=10){c[p]=0;if(p+1<NP){c[p+1]++;msg=`🎉 ١٠ ${SHORT[p]} = ١ ${SHORT[p+1]}`;try{sfx.ok()}catch(e){}}else c[p]=9}else try{sfx.tap()}catch(e){}}else if(c[p]>0)c[p]--;draw()})};
 el.querySelector('#r').onclick=()=>{c.fill(0);msg='';draw()};el.querySelector('#rn').onclick=()=>{for(let p=0;p<NP;p++)c[p]=R(0,9);msg='';draw()};draw()}};
LABS.pvchart={t:'جدول المراتب والفترات',ic:'📊',d:'اكتب عدداً وشاهده في جدول المراتب، واضغط أي رقم',render(el){
 el.innerHTML=`<div class="lab"><input type="text" id="n" inputmode="numeric" value="3482615970" maxlength="12"><div id="c"></div></div>`;
 const f=()=>{const n=Math.floor(num(Q(el,'#n').value))||0;Q(el,'#c').innerHTML=pvChartHTML(n);pvChartBind(el)};Q(el,'#n').addEventListener('input',f);f()}};
LABS.decplaces={t:'مراتب الكسر العشري',ic:'🔟',d:'اكتب عدداً عشرياً وشاهد مراتبه بعد الفاصلة',render(el){
 el.innerHTML=`<div class="lab"><input type="text" id="n" inputmode="decimal" value="23.456" maxlength="7"><div id="c"></div>${decStripsHTML()}</div>`;
 const f=()=>{const v=String(Q(el,'#n').value).replace(/[٠-٩]/g,d=>EAST.indexOf(d)).replace('٫','.');Q(el,'#c').innerHTML=decChartHTML(/^\d*\.?\d*$/.test(v)&&v?v:'0');decChartBind(el)};Q(el,'#n').addEventListener('input',f);f()}};
Object.assign(LABMAP,{'0.0':'blocks','0.1':'pvchart','4.0':'decplaces','4.3':'decplaces'});
