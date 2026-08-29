/* ═══════════════════════════
   EDITEDBYAMINE — rebuilt from scratch
   Single unified "Work" data + lightbox system replaces three
   near-duplicate custom video players from the previous build —
   same YouTube content, far less code, easier to extend.
═══════════════════════════ */

if('scrollRestoration' in history){history.scrollRestoration='manual'}
window.scrollTo(0,0);
window.addEventListener('load',()=>window.scrollTo(0,0));

/* ── LOADER ── */
(function(){
  const lfill=document.getElementById('lfill'),loader=document.getElementById('loader');
  if(!loader)return;
  let p=0;
  const t=setInterval(()=>{
    p+=Math.random()*16;
    if(p>=100){p=100;clearInterval(t);
      setTimeout(()=>{loader.classList.add('out');document.body.classList.add('ready')},200);
    }
    if(lfill)lfill.style.width=p+'%';
  },90);
})();

/* ── LIVE TIMECODE (hero badge + both timeline dividers) ── */
(function(){
  const els=[...document.querySelectorAll('[data-tc]')];
  if(!els.length)return;
  const start=performance.now();
  const pad=n=>String(n).padStart(2,'0');
  function tick(now){
    const total=(now-start)/1000;
    const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=Math.floor(total%60),f=Math.floor((total%1)*24);
    const str=`${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    els.forEach(el=>el.textContent=str);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ── SCROLL PROGRESS ── */
(function(){
  const bar=document.getElementById('scrollProgress');
  if(!bar)return;
  function update(){
    const h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    bar.style.width=(max>0?(h.scrollTop/max)*100:0)+'%';
  }
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  update();
})();

/* ── CUSTOM CURSOR ── */
(function(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');
  if(!dot||!ring)return;
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
  document.addEventListener('mouseover',e=>{
    ring.classList.toggle('is-active',!!e.target.closest('a,button,[tabindex],input,textarea,.wk-card'));
  });
  document.addEventListener('mousedown',()=>ring.style.transform='translate(-50%,-50%) scale(.85)');
  document.addEventListener('mouseup',()=>ring.style.transform='translate(-50%,-50%) scale(1)');
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop)})();
})();

/* ── NAV: shrink-on-scroll + active side dots + mobile drawer ── */
const nav=document.getElementById('nav'),si=document.getElementById('si');
const sections=[...document.querySelectorAll('section[id]')];
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(nav)nav.classList.toggle('sc',y>60);
  let current=sections[0]?.id;
  for(const s of sections){if(y>=s.offsetTop-140)current=s.id;}
  if(si)si.querySelectorAll('a').forEach(a=>a.classList.toggle('h',a.getAttribute('href')==='#'+current));
},{passive:true});

const burger=document.getElementById('navBurger'),mobile=document.getElementById('navMobile'),scrim=document.getElementById('navScrim');
function closeMobile(){burger?.classList.remove('open');mobile?.classList.remove('open');scrim?.classList.remove('open');}
burger?.addEventListener('click',()=>{
  const open=!mobile.classList.contains('open');
  burger.classList.toggle('open',open);mobile.classList.toggle('open',open);scrim.classList.toggle('open',open);
});
scrim?.addEventListener('click',closeMobile);
document.querySelectorAll('.nav-mobile a').forEach(a=>a.addEventListener('click',closeMobile));

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    const target=id.length>1?document.querySelector(id):null;
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

/* ── SCROLL REVEAL (shared .fu utility + staggered .wk-card grid) ── */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('v');io.unobserve(en.target);}});
},{threshold:.15,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.fu').forEach(el=>io.observe(el));

/* ── HERO TYPEWRITER ── */
const hRoles=['Storyteller','Editor','Animator','Creator'];
(function(){
  const el=document.getElementById('hT');
  if(!el)return;
  let ri=0,ci=0,deleting=false;
  function step(){
    const word=hRoles[ri];
    ci+=deleting?-1:1;
    el.textContent=word.slice(0,ci);
    let delay=deleting?45:95;
    if(!deleting&&ci===word.length){delay=1400;deleting=true;}
    else if(deleting&&ci===0){deleting=false;ri=(ri+1)%hRoles.length;delay=300;}
    setTimeout(step,delay);
  }
  step();
})();

/* ── HERO STAT COUNTERS ── */
(function(){
  const nums=document.querySelectorAll('[data-cnt]');
  if(!nums.length)return;
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      const el=en.target,target=+el.dataset.cnt,suf=el.dataset.suf||'';
      let cur=0;const step=Math.max(1,target/50);
      const t=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(t);}el.textContent=Math.floor(cur)+suf;},24);
      obs.unobserve(el);
    });
  },{threshold:.6});
  nums.forEach(n=>obs.observe(n));
})();

/* ── PORTRAIT 3D TILT ── */
const pc=document.getElementById('pc');
document.addEventListener('mousemove',e=>{
  if(!pc)return;
  const r=pc.getBoundingClientRect();
  const dx=(e.clientX-(r.left+r.width/2))/window.innerWidth*14;
  const dy=(e.clientY-(r.top+r.height/2))/window.innerHeight*10;
  pc.style.transform=`perspective(750px) rotateY(${dx}deg) rotateX(${-dy}deg) scale(1.01)`;
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-p,.btn-s,.nav-cta,.con-send').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const dx=(e.clientX-(r.left+r.width/2))*.25,dy=(e.clientY-(r.top+r.height/2))*.35;
    btn.style.transform=`translate(${dx}px,${dy}px)`;
  });
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});

/* ── TIMELINE DIVIDER LABEL CONTENT ── */
(function(){
  const items=['Long Form Editing','Short Form','Motion Graphics','Color Grading','Sound Design','Storytelling','YouTube Edits','Reels & Shorts'];
  document.querySelectorAll('[data-tl]').forEach(el=>{
    el.innerHTML=[...items,...items].map(t=>`<span class="tl-i">${t}<span class="tl-d"></span></span>`).join('');
  });
})();

/* ═══════════════════════════
   SHOWCASE DATA — three dedicated sections (Shorts / Long Form /
   Commercials), each with its own layout, sharing one lightbox
   that can play either a YouTube video or a Google Drive file.
═══════════════════════════ */
const SHORTS=[
  {src:'yt',id:'RHbh1ggzc5w',year:'2026'},
  {src:'yt',id:'DpmTiegTgSg',year:'2026'},
  {src:'yt',id:'9UYD9wNuOrE',year:'2026'},
  {src:'yt',id:'o3Fa0lyHC-w',year:'2026'},
  {src:'yt',id:'YUtNjogUrlU',year:'2026'},
  {src:'yt',id:'1DY0rg1EdwA',year:'2026'},
  {src:'yt',id:'bqh0P_7SKos',year:'2026'},
  {src:'yt',id:'5NeUdeqINiM',year:'2026'},
  {src:'yt',id:'hqzEK0Sb_RE',year:'2026'},
  {src:'yt',id:'8x8if3PDtcY',year:'2026'},
  {src:'drive',id:'1RbRyk6ufNCFE4wINCV3QMdylZwqQL1H9',year:'2026'},
  {src:'drive',id:'14uDlXQDzIzuzyddfAEH9PsLRDWNit2k2',year:'2026'}
];
const LONGFORM=[
  {src:'yt',id:'NXQTS1J31Tg',category:'Featured',year:'2026',featured:true},
  {src:'yt',id:'yw6jr3jXrEI',category:'Podcast',duration:'18:24',year:'2026'},
  {src:'yt',id:'PTnRYDBoS98',category:'Interview',duration:'24:10',year:'2026'},
  {src:'yt',id:'Z9P_fJGcFUA',category:'Documentary',duration:'15:47',year:'2025'},
  {src:'yt',id:'ij8dMxFkbug',category:'Podcast',duration:'21:33',year:'2025'},
  {src:'yt',id:'X2Rfjeh4QwI',category:'Brand Story',duration:'9:52',year:'2025'},
  {src:'yt',id:'-qQsvqKB1_Y',category:'Interview',duration:'27:05',year:'2025'},
  {src:'yt',id:'jAKU_YR0YDs',category:'Documentary',duration:'19:38',year:'2024'}
];
const SAAS=[
  {src:'yt',id:'cXuI_S4f6BY',category:'Commercial',duration:'0:30',year:'2026'},
  {src:'yt',id:'iPB5hUqP3eU',category:'SaaS Ad',duration:'0:45',year:'2026'}
];

/* ── Shared lightbox: plays a YouTube embed or a Google Drive preview ── */
const lb=document.getElementById('lb'),lbFrame=document.getElementById('lbFrame'),lbClose=document.getElementById('lbClose');
let lbLastFocused=null;
function openLightbox(v,isPortrait){
  if(!lb)return;
  lbLastFocused=document.activeElement;
  lbFrame.classList.toggle('is-portrait',!!isPortrait);
  const src=v.src==='drive'
    ? `https://drive.google.com/file/d/${v.id}/preview`
    : `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
  lbFrame.innerHTML=`<iframe src="${src}" title="Video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  lb.classList.add('open');
  lbClose.focus();
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  if(!lb)return;
  lb.classList.remove('open');
  lbFrame.innerHTML='';
  document.body.style.overflow='';
  lbLastFocused?.focus();
}
lbClose?.addEventListener('click',closeLightbox);
lb?.addEventListener('click',e=>{if(e.target===lb)closeLightbox();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lb?.classList.contains('open'))closeLightbox();});

/* ── SHORT FORM — dense vertical grid ── */
(function initShorts(){
  const grid=document.getElementById('sfGrid');
  if(!grid)return;
  grid.innerHTML=SHORTS.map((v,i)=>`
    <div class="sf-card fu" style="transition-delay:${Math.min(i*0.05,0.4)}s" data-i="${i}" tabindex="0" role="button" aria-label="Play short">
      <span class="sf-tag">${v.src==='drive'?'New':'Short'}</span>
      <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy"
        onerror="this.src='https://drive.google.com/thumbnail?id=${v.id}&sz=w640'; this.onerror=function(){this.closest('.sf-card').classList.add('no-thumb'); this.remove();}">
      <span class="sf-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
    </div>`).join('');
  io.observe && [...grid.children].forEach(el=>io.observe(el));
  grid.addEventListener('click',e=>{
    const card=e.target.closest('.sf-card');
    if(card)openLightbox(SHORTS[+card.dataset.i],true);
  });
  grid.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const card=e.target.closest('.sf-card');
    if(card){e.preventDefault();openLightbox(SHORTS[+card.dataset.i],true);}
  });
})();

/* ── LONG FORM — one big featured card + a scannable list ── */
(function initLongform(){
  const featureEl=document.getElementById('lfFeature'),listEl=document.getElementById('lfList');
  if(!featureEl||!listEl)return;
  const [feature,...rest]=LONGFORM;
  featureEl.innerHTML=`
    <div class="lf-card vf" data-i="0" tabindex="0" role="button" aria-label="Play featured video">
      <span class="wk-tag featured">★ Featured</span>
      <img src="https://img.youtube.com/vi/${feature.id}/hqdefault.jpg" alt="" loading="lazy">
      <span class="wk-play lf-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
    </div>`;
  featureEl.querySelector('.lf-card').addEventListener('click',()=>openLightbox(feature));
  featureEl.querySelector('.lf-card').addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(feature);}
  });

  listEl.innerHTML=rest.map((v,i)=>`
    <div class="lf-row fu" style="transition-delay:${Math.min(i*.08,.4)}s" data-i="${i+1}" tabindex="0" role="button" aria-label="Play video">
      <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy">
      <div class="lf-row-meta">
        <b>${v.category}</b>
        <span>${v.year}${v.duration?' · '+v.duration:''}</span>
      </div>
      <span class="lf-row-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
    </div>`).join('');
  [...listEl.children].forEach(el=>io.observe(el));
  listEl.addEventListener('click',e=>{
    const row=e.target.closest('.lf-row');
    if(row)openLightbox(LONGFORM[+row.dataset.i]);
  });
  listEl.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const row=e.target.closest('.lf-row');
    if(row){e.preventDefault();openLightbox(LONGFORM[+row.dataset.i]);}
  });
})();

/* ── SAAS / COMMERCIALS — two large side-by-side cards ── */
(function initSaas(){
  const wrap=document.getElementById('saasDuo');
  if(!wrap)return;
  wrap.innerHTML=SAAS.map((v,i)=>`
    <div class="saas-card vf fu" style="transition-delay:${i*.12}s" data-i="${i}" tabindex="0" role="button" aria-label="Play commercial">
      <span class="wk-tag">${v.category}</span>
      <span class="wk-dur">${v.duration}</span>
      <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
      <span class="wk-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
    </div>`).join('');
  [...wrap.children].forEach(el=>io.observe(el));
  wrap.addEventListener('click',e=>{
    const card=e.target.closest('.saas-card');
    if(card)openLightbox(SAAS[+card.dataset.i]);
  });
  wrap.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const card=e.target.closest('.saas-card');
    if(card){e.preventDefault();openLightbox(SAAS[+card.dataset.i]);}
  });
})();

/* ═══════════════════════════
   COLLAB STARFIELD — slow ambient drift behind the orbit
═══════════════════════════ */
(function(){
  const canvas=document.getElementById('collabCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let w,h,stars=[];
  function resize(){
    w=canvas.width=canvas.offsetWidth;h=canvas.height=canvas.offsetHeight;
    stars=Array.from({length:70},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+.3,s:Math.random()*.25+.05}));
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='rgba(227,178,60,.5)';
    stars.forEach(s=>{
      s.y-=s.s;if(s.y<0)s.y=h;
      ctx.globalAlpha=.3+Math.sin(Date.now()/1400+s.x)*.25;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('resize',resize);resize();draw();
  }
})();

/* ═══════════════════════════
   SERVICE / BUDGET PICKER → feeds the contact form
═══════════════════════════ */
const svcR=document.getElementById('svcR'),budR=document.getElementById('budR');
const serviceInput=document.getElementById('serviceInput'),budgetInput=document.getElementById('budgetInput');
svcR?.querySelectorAll('.svc-o').forEach(o=>o.addEventListener('click',()=>{
  svcR.querySelectorAll('.svc-o').forEach(x=>x.classList.remove('sel'));
  o.classList.add('sel');
  if(serviceInput)serviceInput.value=o.dataset.s;
}));
budR?.querySelectorAll('.bud-o').forEach(o=>o.addEventListener('click',()=>{
  budR.querySelectorAll('.bud-o').forEach(x=>x.classList.remove('sel'));
  o.classList.add('sel');
  if(budgetInput)budgetInput.value=o.dataset.b;
}));

/* ═══════════════════════════
   CONTACT FORM — EmailJS
   To activate: create a free account at emailjs.com, then fill in
   the three constants below. Your EmailJS template should expect
   fields named: name, email, service, budget, message.
═══════════════════════════ */
const EMAILJS_PUBLIC_KEY='';
const EMAILJS_SERVICE_ID='';
const EMAILJS_TEMPLATE_ID='';
if(EMAILJS_PUBLIC_KEY&&window.emailjs)emailjs.init(EMAILJS_PUBLIC_KEY);

const contactForm=document.getElementById('contactForm');
const sendBtn=document.getElementById('sendBtn'),conStatus=document.getElementById('conStatus');
contactForm?.addEventListener('submit',async function(e){
  e.preventDefault();
  const email=this.querySelector('[name="email"]');
  if(email && !email.checkValidity()){
    conStatus.textContent='Please enter a valid email address.';
    conStatus.className='con-status err';
    email.focus();
    return;
  }
  if(!EMAILJS_PUBLIC_KEY||!EMAILJS_SERVICE_ID||!EMAILJS_TEMPLATE_ID){
    conStatus.textContent='Form is not connected yet — fill in the EmailJS keys in js/main.js.';
    conStatus.className='con-status err';
    console.warn('EmailJS is not configured. Fill in EMAILJS_PUBLIC_KEY / EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID in js/main.js.');
    return;
  }
  sendBtn.disabled=true;sendBtn.textContent='Sending…';
  conStatus.textContent='';conStatus.className='con-status';
  try{
    await emailjs.sendForm(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,this);
    conStatus.textContent='Message sent — I\'ll get back to you soon.';
    conStatus.className='con-status ok';
    this.reset();
  }catch(err){
    conStatus.textContent='Something went wrong — please try again or email me directly.';
    conStatus.className='con-status err';
    console.error(err);
  }finally{
    sendBtn.disabled=false;sendBtn.textContent='Send Message';
  }
});
