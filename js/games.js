'use strict';
/* ====== الألعاب ====== */
const GAMES={};
const optsFor=(c,spread=5)=>{const s=new Set([c]);let g=0;while(s.size<4&&g<60){g++;const d=R(1,spread)*(Math.random()<.5?-1:1);const v=c+d;if(v>=0)s.add(v)}return shuffle([...s])};

GAMES.speed={t:'سباق الحساب',ic:'⚡',col:'linear-gradient(135deg,#ff8a3d,#ff5d8f)',d:'٦٠ ثانية وثلاث فرص: أجب بأسرع ما تستطيع',start(el){
 let sel='mix';
 const menu=()=>{el.innerHTML=`<div class="card"><h3>⚡ سباق الحساب</h3><p>اختر نوع العمليات ثم ابدأ. كل إجابة صحيحة متتالية تزيد المكافأة!</p><div class="chips" id="c">${[['mix','مزيج'],['+','جمع'],['−','طرح'],['×','ضرب'],['÷','قسمة']].map(([k,n])=>`<button class="chip${k==sel?' on':''}" data-k="${k}">${n}</button>`).join('')}</div><p class="sm">أفضل نتيجة: ${ar(S.best.speed||0)}</p><button class="btn acc block" id="go">ابدأ السباق 🚀</button></div>`;
  el.querySelectorAll('#c button').forEach(b=>b.onclick=()=>{sel=b.dataset.k;menu()});el.querySelector('#go').onclick=run};
 const run=()=>{let time=60,lives=3,score=0,combo=0,right=0,cur,locked=false;
  const gen=()=>{const lv=Math.min(4,Math.floor(score/100));const op=sel=='mix'?pick(['+','−','×','÷']):sel;let a,b,ans,t;
   if(op=='+'){a=R(5,20+lv*25);b=R(3,20+lv*25);ans=a+b}else if(op=='−'){a=R(10,30+lv*30);b=R(2,a-1);ans=a-b}else if(op=='×'){a=R(2,9+lv);b=R(2,9+Math.min(lv,3));ans=a*b}else{b=R(2,9);ans=R(2,9+lv);a=b*ans}
   t=`${ar(a)} ${op} ${ar(b)}`;return{t,ans,o:optsFor(ans,op=='×'||op=='÷'?6:10)}};
  const draw=()=>{cur=gen();locked=false;el.querySelector('#bq').innerHTML=`<bdi dir="ltr">${cur.t}</bdi>`;el.querySelector('#og').innerHTML=cur.o.map(v=>`<button class="opt" data-v="${v}">${ar(v)}</button>`).join('');
   el.querySelectorAll('#og .opt').forEach(b=>b.onclick=()=>pickA(b))};
  const hud=()=>{el.querySelector('#hs').textContent=ar(score);el.querySelector('#hl').textContent='❤️'.repeat(lives)+'🖤'.repeat(3-lives);el.querySelector('#hc').textContent=combo>1?`🔥 ×${ar(combo)}`:'';el.querySelector('#tm i').style.width=(time/60*100)+'%'};
  const pickA=b=>{if(locked)return;locked=true;const ok=+b.dataset.v==cur.ans;if(ok){combo++;right++;score+=10+Math.min(combo,8)*2;b.classList.add('ok');sfx.ok();vib(15)}else{combo=0;lives--;b.classList.add('no');el.querySelectorAll('#og .opt').forEach(x=>{if(+x.dataset.v==cur.ans)x.classList.add('ok')});sfx.no();vib([60,40,60])}
   hud();if(lives<=0)return end();setTimeout(draw,ok?220:650)};
  const end=()=>{clearInterval(iv);gameOver(el,'speed',score,`${ar(right)} إجابة صحيحة`,run,menu)};
  el.innerHTML=`<div class="qwrap"><div class="hud"><span id="hl"></span><span id="hc" style="background:none"></span><span>⭐ <b id="hs">٠</b></span></div><div class="timer" id="tm"><i></i></div><div class="qcard"><div class="bigq" id="bq"></div><div class="opts g2" id="og"></div></div></div>`;
  const iv=setInterval(()=>{time-=.25;el.querySelector('#tm i').style.width=Math.max(0,time/60*100)+'%';if(time<=0)end()},250);onLeave(()=>clearInterval(iv));draw();hud()};
 menu()}};

GAMES.memory={t:'مطابقة الذاكرة',ic:'🃏',col:'linear-gradient(135deg,#4c3fd6,#8a5cff)',d:'اعثر على كل زوج متطابق (عدد ↔ قيمته) بأقل محاولات',start(el){
 const SETS=[['٠٫٥','½'],['٠٫٢٥','¼'],['٠٫٧٥','¾'],['٦ × ٧','٤٢'],['٨ × ٨','٦٤'],['٩ × ٦','٥٤'],['√٤٩','٧'],['√٨١','٩'],['٢³','٨'],['٣²','٩'],['١٠٠٠ مليون','مليار'],['٩٠°','قائمة'],['١٨٠°','مستقيمة'],['٣ كغم','٣٠٠٠ غم'],['٢ ساعة','١٢٠ دقيقة'],['٥ ملايين','٥٬٠٠٠٬٠٠٠'],['٢ × ٥ × ٧','٧٠'],['ق.م.أ(٦،٩)','٣'],['م.م.أ(٤،٦)','١٢'],['٧ أولي؟','نعم']];
 const run=()=>{const pairs=shuffle(SETS).slice(0,6);const cards=shuffle(pairs.flatMap(([a,b],i)=>[{id:i,t:a},{id:i,t:b}]));let open=[],moves=0,found=0,lock=false,t0=Date.now();
  el.innerHTML=`<div class="qwrap"><div class="hud"><span>🔁 <b id="mv">٠</b></span><span>⏱ <b id="tm">٠</b></span></div><div class="mem" id="g">${cards.map((c,i)=>`<button class="mc" data-i="${i}"><div class="in"><div class="f">?</div><div class="b">${c.t}</div></div></button>`).join('')}</div></div>`;
  const iv=setInterval(()=>{const q=el.querySelector('#tm');if(q)q.textContent=ar(Math.floor((Date.now()-t0)/1000))},500);onLeave(()=>clearInterval(iv));
  el.querySelectorAll('.mc').forEach(b=>b.onclick=()=>{if(lock||b.classList.contains('flip')||b.classList.contains('done'))return;b.classList.add('flip');sfx.tap();open.push(b);
   if(open.length==2){moves++;el.querySelector('#mv').textContent=ar(moves);const [x,y]=open;if(cards[x.dataset.i].id==cards[y.dataset.i].id){x.classList.add('done');y.classList.add('done');x.classList.remove('flip');y.classList.remove('flip');open=[];found++;sfx.ok();if(found==6){clearInterval(iv);const stars=moves<=9?3:moves<=13?2:1;setTimeout(()=>gameOver(el,'memory',Math.max(0,200-moves*10+stars*30),`${ar(moves)} محاولة • ${'⭐'.repeat(stars)}`,run,null),600)}}
    else{lock=true;setTimeout(()=>{x.classList.remove('flip');y.classList.remove('flip');open=[];lock=false},800)}}})};
 run()}};

GAMES.primes={t:'صيد الأعداد الأولية',ic:'🎯',col:'linear-gradient(135deg,#17a361,#0f8a8a)',d:'اضغط الأعداد الأولية فقط خلال ٤٥ ثانية',start(el){
 let time=45,score=0,lives=3,grid=[],found=0,need=0;
 const mkGrid=()=>{const ps=PRIMES.filter(p=>p<=80),cs=[4,6,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30,32,33,34,35,36,39,40,42,44,45,46,48,49,50,51,52,54,55,56,57,58,60,62,63,64,65,66,68,69,70,72,74,75,76,77,78,80];const np=R(5,8);grid=shuffle(shuffle(ps).slice(0,np).concat(shuffle(cs).slice(0,20-np)));need=np;found=0;
  el.querySelector('#pg').innerHTML=grid.map((n,i)=>`<button data-n="${n}">${ar(n)}</button>`).join('');el.querySelectorAll('#pg button').forEach(b=>b.onclick=()=>{if(b.classList.contains('ok'))return;const n=+b.dataset.n;if(isPrime(n)){b.classList.add('ok');found++;score+=10;sfx.ok();vib(10);if(found==need){score+=20;sfx.win();setTimeout(mkGrid,350)}}else{b.classList.add('no');lives--;score=Math.max(0,score-5);sfx.no();vib(60);setTimeout(()=>b.classList.remove('no'),350);if(lives<=0)end()}hud()})};
 const hud=()=>{el.querySelector('#hs').textContent=ar(score);el.querySelector('#hl').textContent='❤️'.repeat(lives)+'🖤'.repeat(3-lives)};
 const end=()=>{clearInterval(iv);gameOver(el,'primes',score,'',()=>GAMES.primes.start(el),null)};
 el.innerHTML=`<div class="qwrap"><div class="card"><b>اضغط الأعداد الأولية فقط ⭐</b><div class="sm">العدد الأولي له قاسمان فقط. العدد ١ ليس أولياً.</div></div><div class="hud"><span id="hl"></span><span>⭐ <b id="hs">٠</b></span></div><div class="timer" id="tm"><i></i></div><div class="pg" id="pg"></div></div>`;
 const iv=setInterval(()=>{time-=.25;el.querySelector('#tm i').style.width=Math.max(0,time/45*100)+'%';if(time<=0)end()},250);onLeave(()=>clearInterval(iv));mkGrid();hud()}};

GAMES.ladder={t:'سلّم الأعداد',ic:'🪜',col:'linear-gradient(135deg,#e8590c,#f08c00)',d:'رتّب الأعداد بالضغط عليها بالترتيب الصحيح',start(el){
 let round=0,score=0,t0;const TOT=5;
 const mkRound=()=>{const kind=pick(['big','dec','frac']);let items=[];
  if(kind=='big'){const s=new Set();while(s.size<5)s.add(R(1e6,9e8)+(Math.random()<.5?R(0,9)*1e5:0));items=[...s].map(v=>({v,h:fmt(v)}))}
  else if(kind=='dec'){const s=new Set();while(s.size<5)s.add(R(100,9999));items=[...s].map(v=>({v,h:fmtD(v)}))}
  else{const s=new Map();while(s.size<5){const d=R(2,9),n=R(1,d-1),k=n/d;if(![...s.keys()].some(x=>Math.abs(x-k)<1e-9))s.set(k,frac(n,d))}items=[...s].map(([v,h])=>({v,h}))}
  const asc=Math.random()<.6;const sorted=items.slice().sort((a,b)=>asc?a.v-b.v:b.v-a.v);let idx=0;items=shuffle(items);
  el.innerHTML=`<div class="qwrap"><div class="hud"><span>الجولة ${ar(round+1)}/${ar(TOT)}</span><span>⭐ ${ar(score)}</span></div><div class="card" style="text-align:center"><b>اضغط الأعداد من ${asc?'الأصغر إلى الأكبر ⬆️':'الأكبر إلى الأصغر ⬇️'}</b></div><div class="lad" id="l">${items.map((x,i)=>`<button data-i="${i}">${x.h}</button>`).join('')}</div></div>`;
  const rs=Date.now();let mistakes=0;
  el.querySelectorAll('#l button').forEach(b=>b.onclick=()=>{if(b.classList.contains('ok'))return;const it=items[+b.dataset.i];if(it.v==sorted[idx].v){b.classList.add('ok');idx++;sfx.tap();if(idx==5){const sec=(Date.now()-rs)/1000;score+=Math.max(10,Math.round(40-sec-mistakes*8));sfx.ok();round++;setTimeout(()=>round>=TOT?gameOver(el,'ladder',score,'',()=>GAMES.ladder.start(el),null):mkRound(),500)}}else{mistakes++;b.classList.add('no');sfx.no();vib(50);setTimeout(()=>b.classList.remove('no'),350)}})};
 mkRound()}};
