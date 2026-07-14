/* ═══════════════════════════
   LOADER
═══════════════════════════ */
(function(){
  const lnum=document.getElementById('lnum'),lfill=document.getElementById('lfill'),loader=document.getElementById('loader');
  let p=0;
  const t=setInterval(()=>{
    p+=Math.random()*14;
    if(p>=100){p=100;clearInterval(t);
      setTimeout(()=>{loader.classList.add('out');document.body.classList.add('ready')},250);
    }
    lnum.textContent=Math.floor(p);
    lfill.style.width=p+'%';
  },90);
})();

/* ═══════════════════════════
   NAV + SCROLL INDICATOR
═══════════════════════════ */
const nav=document.getElementById('nav'),si=document.getElementById('si');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('sc',scrollY>55);
  si.classList.toggle('h',scrollY>220);
},{passive:true});

/* ═══════════════════════════
   FADE / BLUR REVEAL ON SCROLL
═══════════════════════════ */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('v');io.unobserve(e.target)}
}),{threshold:.08});
document.querySelectorAll('.fu').forEach(el=>io.observe(el));
window.addEventListener('load',()=>document.querySelectorAll('#hero .fu').forEach(el=>el.classList.add('v')));

/* ═══════════════════════════
   COUNTERS
═══════════════════════════ */
function countUp(el,target,suf){
  const dur=1700,st=performance.now();
  (function step(now){
    const t=Math.min((now-st)/dur,1),ease=1-Math.pow(1-t,4);
    el.innerHTML=Math.floor(ease*target)+suf;
    if(t<1)requestAnimationFrame(step);else el.innerHTML=target+suf;
  })(performance.now());
}
const co=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){countUp(e.target,+e.target.dataset.cnt,e.target.dataset.suf);co.unobserve(e.target)}
}),{threshold:.4});
document.querySelectorAll('[data-cnt]').forEach(el=>co.observe(el));

/* ═══════════════════════════
   MARQUEE
═══════════════════════════ */
const mqItems=['Long Form Editing','Short Form','Motion Graphics','Color Grading','Sound Design','Storytelling','YouTube Edits','Reels & Shorts'];
document.getElementById('mqt').innerHTML=[...mqItems,...mqItems]
  .map(t=>`<span class="mq-i">${t}<span class="mq-d"></span></span>`).join('');

/* Gold marquee divider — SaaS & Commercials / Collaborations section break.
   Same rendering pattern as the marquee above, own content + element. */
const saasMqItems=['Performance Ads','SaaS Marketing','Product Launches','Commercial Campaigns'];
const saasMqEl=document.getElementById('mqtSaas');
if(saasMqEl){
  saasMqEl.innerHTML=[...saasMqItems,...saasMqItems]
    .map(t=>`<span class="mq-i">${t}<span class="mq-d"></span></span>`).join('');
}

/* ═══════════════════════════
   HERO TYPEWRITER
═══════════════════════════ */
const hRoles=[{t:'Storyteller',c:'c-y'},{t:'Editor',c:'c-p'},{t:'Animator',c:'c-o'},{t:'Creator',c:'c-g'}];
let hI=0;
const hW=document.getElementById('hW'),hT=document.getElementById('hT'),hL=document.getElementById('hL'),hR=document.getElementById('hR');
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
async function typeH(){
  const d=hRoles[hI];hW.className=`tw ${d.c} fu d2 v`;
  hL.style.height='96px';hR.style.height='96px';hT.textContent='';
  for(const ch of d.t){hT.textContent+=ch;await wait(95)}
  await wait(2100);hL.style.height='52px';hR.style.height='52px';
  while(hT.textContent.length){hT.textContent=hT.textContent.slice(0,-1);await wait(55)}
  hI=(hI+1)%hRoles.length;typeH();
}typeH();

/* ═══════════════════════════
   PORTRAIT PARALLAX
═══════════════════════════ */
const pc=document.getElementById('pc');
document.addEventListener('mousemove',e=>{
  if(!pc)return;
  const r=pc.getBoundingClientRect();
  const dx=(e.clientX-(r.left+r.width/2))/window.innerWidth*14;
  const dy=(e.clientY-(r.top+r.height/2))/window.innerHeight*10;
  pc.style.transform=`perspective(750px) rotateY(${dx}deg) rotateX(${-dy}deg) scale(1.01)`;
});

/* ═══════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════ */
document.querySelectorAll('.btn-p,.btn-s,.nav-cta,.con-send').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.11}px,${(e.clientY-r.top-r.height/2)*.11}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});

/* ═══════════════════════════
   COLLABORATIONS — NIGHT SKY STARFIELD
   Slow, soft twinkling dots behind the orbit cluster.
═══════════════════════════ */
(function initCollabStarfield(){
  const container=document.getElementById('collabCanvas');
  if(!container)return;
  const canvas=document.createElement('canvas');
  canvas.style.cssText='width:100%;height:100%;position:absolute;inset:0;';
  container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  let stars=[];
  function resize(){
    canvas.width=container.offsetWidth;
    canvas.height=container.offsetHeight;
    stars=Array.from({length:130},()=>({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*1.3+.3,
      alpha:Math.random()*.7+.1,
      speed:Math.random()*.15+.03
    }));
  }
  resize();
  window.addEventListener('resize',resize);
  (function tick(t){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{
      s.phase=(s.phase||0)+s.speed*0.03;
      const a=s.alpha*(.6+.4*Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(212,175,55,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  })();
})();

/* Gentle parallax on the orbit cluster — subtle, not distracting */
const coWrap=document.getElementById('coWrap');
document.addEventListener('mousemove',e=>{
  if(!coWrap)return;
  const r=coWrap.getBoundingClientRect();
  if(e.clientY<r.top-200||e.clientY>r.bottom+200)return;
  const dx=(e.clientX-(r.left+r.width/2))/window.innerWidth*10;
  const dy=(e.clientY-(r.top+r.height/2))/window.innerHeight*8;
  coWrap.style.transform=`translate(${dx}px,${dy}px)`;
});

/* ═══════════════════════════
   YOUTUBE OEMBED — AUTO-FETCH TITLE + CHANNEL
   Thumbnails load instantly from img.youtube.com (no fetch needed).
   Titles + channel names are fetched live from YouTube's public
   oEmbed endpoint at runtime — no hardcoding required. If a viewer's
   browser blocks the request (ad-blocker, offline), the fallback
   text already in the DOM is left in place.
═══════════════════════════ */
async function fetchYTMeta(url){
  try{
    const res=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if(!res.ok)throw new Error('oembed failed');
    const data=await res.json();
    return{title:data.title,author:data.author_name};
  }catch(e){return null}
}

/* ═══════════════════════════
   LONG FORM — featured player + scrollable playlist
   Left: one large player (poster → real YouTube iframe on play,
   with Play/Sound/Prev/Next/Autoplay/Fullscreen controls). Right:
   an independently-scrolling playlist; clicking an item swaps the
   featured video instantly. Play/Sound use YouTube's postMessage
   API (enablejsapi=1) — this needs the page served over http(s),
   not opened directly as a local file, to work in every browser.
   Replace the `id` values below with your own YouTube video IDs.
   category/duration/year are illustrative — YouTube's oEmbed API
   doesn't expose duration or category, so these are manually set;
   edit them freely to match your real videos.
═══════════════════════════ */
const videos=[
  {id:'yw6jr3jXrEI',category:'Podcast',duration:'18:24',year:'2026'},
  {id:'PTnRYDBoS98',category:'Interview',duration:'24:10',year:'2026'},
  {id:'Z9P_fJGcFUA',category:'Documentary',duration:'15:47',year:'2025'},
  {id:'ij8dMxFkbug',category:'Podcast',duration:'21:33',year:'2025'},
  {id:'X2Rfjeh4QwI',category:'Brand Story',duration:'9:52',year:'2025'},
  {id:'-qQsvqKB1_Y',category:'Interview',duration:'27:05',year:'2025'},
  {id:'jAKU_YR0YDs',category:'Documentary',duration:'19:38',year:'2024'}
];

(function initLongFormPlayer(){
  const list=document.getElementById('lf2List');
  const stage=document.getElementById('lf2Stage');
  const poster=document.getElementById('lf2Poster');
  const titleEl=document.getElementById('lf2Title');
  const playBigBtn=document.getElementById('lf2PlayBig');
  const playBtn=document.getElementById('lf2Play');
  const soundBtn=document.getElementById('lf2Sound');
  const prevBtn=document.getElementById('lf2Prev');
  const nextBtn=document.getElementById('lf2Next');
  const autoplayBtn=document.getElementById('lf2Autoplay');
  const fullscreenBtn=document.getElementById('lf2Fullscreen');
  if(!list||!stage)return;

  let active=0;
  let autoplay=false;
  let muted=false;
  let iframeEl=null;

  function ytEmbedSrc(id,opts={}){
    const params=new URLSearchParams({enablejsapi:'1',rel:'0',playsinline:'1',origin:window.location.origin});
    if(opts.autoplay)params.set('autoplay','1');
    if(muted)params.set('mute','1');
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }
  function postCmd(func,args=[]){
    if(!iframeEl||!iframeEl.contentWindow)return;
    iframeEl.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*');
  }
  function updatePlayIcon(isPlaying){
    playBtn.querySelector('.ic-play').style.display=isPlaying?'none':'block';
    playBtn.querySelector('.ic-pause').style.display=isPlaying?'block':'none';
  }
  function destroyPlayer(){
    if(iframeEl){iframeEl.remove();iframeEl=null}
    stage.classList.remove('has-player');
    updatePlayIcon(false);
  }
  function mountPlayer(withAutoplay){
    destroyPlayer();
    const v=videos[active];
    iframeEl=document.createElement('iframe');
    iframeEl.src=ytEmbedSrc(v.id,{autoplay:withAutoplay});
    iframeEl.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframeEl.allowFullscreen=true;
    iframeEl.title='Featured video player';
    stage.appendChild(iframeEl);
    stage.classList.add('has-player');
    updatePlayIcon(!!withAutoplay);
  }

  function render(){
    const v=videos[active];
    stage.classList.add('is-loading');
    poster.onload=()=>{stage.classList.remove('is-loading')};
    poster.src=`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
    titleEl.textContent='Loading…';

    Array.from(list.children).forEach((item,i)=>item.classList.toggle('is-active',i===active));
    const activeItem=list.children[active];
    if(activeItem)activeItem.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});

    fetchYTMeta(`https://youtu.be/${v.id}`).then(meta=>{
      titleEl.textContent=meta?meta.title:'Featured video';
    });
  }

  function goTo(index,withAutoplay){
    active=((index%videos.length)+videos.length)%videos.length;
    destroyPlayer();
    render();
    const shouldAutoplay=withAutoplay===undefined?autoplay:withAutoplay;
    if(shouldAutoplay)mountPlayer(true);
  }

  // Build playlist
  list.innerHTML=videos.map((v,i)=>`
    <div class="lf2-item${i===0?' is-active':''}" data-index="${i}" role="option" tabindex="0">
      <div class="lf2-item-thumb"><img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy"></div>
      <div class="lf2-item-body">
        <p class="lf2-item-title" id="lf2it-${i}">Loading…</p>
        <p class="lf2-item-sub" id="lf2is-${i}">YouTube</p>
        <div class="lf2-item-meta">
          <span class="lf2-meta-tag">${v.category}</span>
          <span class="lf2-meta-dot">•</span>
          <span class="lf2-meta-text">${v.duration}</span>
          <span class="lf2-meta-dot">•</span>
          <span class="lf2-meta-text">${v.year}</span>
        </div>
      </div>
    </div>`).join('');

  videos.forEach((v,i)=>{
    fetchYTMeta(`https://youtu.be/${v.id}`).then(meta=>{
      if(!meta)return;
      const t=document.getElementById(`lf2it-${i}`),sub=document.getElementById(`lf2is-${i}`);
      if(t)t.textContent=meta.title;
      if(sub)sub.textContent=meta.author;
    });
  });

  // Playlist click
  list.addEventListener('click',e=>{
    const item=e.target.closest('.lf2-item');
    if(!item)return;
    goTo(+item.dataset.index);
  });
  list.addEventListener('keydown',e=>{
    const item=e.target.closest('.lf2-item');
    if(!item)return;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();goTo(+item.dataset.index)}
  });

  // Big play button
  playBigBtn.addEventListener('click',()=>mountPlayer(true));

  // Bottom control bar
  playBtn.addEventListener('click',()=>{
    if(!iframeEl){mountPlayer(true);return}
    const isPlaying=playBtn.querySelector('.ic-pause').style.display!=='none';
    if(isPlaying){postCmd('pauseVideo');updatePlayIcon(false)}
    else{postCmd('playVideo');updatePlayIcon(true)}
  });
  soundBtn.addEventListener('click',()=>{
    muted=!muted;
    soundBtn.querySelector('.ic-on').style.display=muted?'none':'block';
    soundBtn.querySelector('.ic-off').style.display=muted?'block':'none';
    postCmd(muted?'mute':'unMute');
  });
  prevBtn.addEventListener('click',()=>goTo(active-1));
  nextBtn.addEventListener('click',()=>goTo(active+1));
  autoplayBtn.addEventListener('click',()=>{
    autoplay=!autoplay;
    autoplayBtn.classList.toggle('is-on',autoplay);
    autoplayBtn.setAttribute('aria-pressed',String(autoplay));
  });
  fullscreenBtn.addEventListener('click',()=>{
    const target=iframeEl||stage;
    if(target.requestFullscreen)target.requestFullscreen();
    else if(target.webkitRequestFullscreen)target.webkitRequestFullscreen();
  });

  // Keyboard navigation — only while the player is in view, and
  // never while the visitor is typing in a form field.
  let inView=false;
  new IntersectionObserver(es=>{inView=es[0].isIntersecting},{threshold:.3}).observe(stage);
  document.addEventListener('keydown',e=>{
    if(!inView)return;
    const tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    if(e.key==='ArrowLeft'){e.preventDefault();goTo(active-1)}
    if(e.key==='ArrowRight'){e.preventDefault();goTo(active+1)}
  });

  render();
})();

/* ═══════════════════════════
   SAAS & COMMERCIALS — featured player + scrollable playlist
   Independent duplicate of the Long Form player pattern above.
   Uses its own unique IDs/classes (saas*) and its own state —
   does not share or touch any Long Form variables or elements.
   PLACEHOLDER DATA: replace the entries in `saasVideos` below
   with your own SaaS/commercial YouTube video IDs when ready.
   category/duration/year are illustrative, same as Long Form.
═══════════════════════════ */
const saasVideos=[
  {id:'cXuI_S4f6BY',category:'Commercial',duration:'0:30',year:'2026'},
  {id:'iPB5hUqP3eU',category:'SaaS Ad',duration:'0:45',year:'2026'}
  // Add more videos here as {id:'YOUTUBE_ID', category:'...', duration:'...', year:'...'} —
  // the layout, playlist, and scroll behavior adapt automatically, no other changes needed.
];

(function initSaasPlayer(){
  const saasSection=document.getElementById('saasSection');
  const saasPlaylist=document.getElementById('saasPlaylist');
  const saasStage=document.getElementById('saasStage');
  const saasPoster=document.getElementById('saasPoster');
  const saasTitleEl=document.getElementById('saasTitle');
  const saasPlayBigBtn=document.getElementById('saasPlayBig');
  const saasPlayBtn=document.getElementById('saasPlay');
  const saasSoundBtn=document.getElementById('saasSound');
  const saasPrevBtn=document.getElementById('saasPrev');
  const saasNextBtn=document.getElementById('saasNext');
  const saasAutoplayBtn=document.getElementById('saasAutoplay');
  const saasFullscreenBtn=document.getElementById('saasFullscreen');
  if(!saasPlaylist||!saasStage)return;

  let saasCurrentVideo=0;
  let saasAutoplay=false;
  let saasMuted=false;
  let saasPlayer=null; // the mounted YouTube iframe

  function saasYtEmbedSrc(id,opts={}){
    const params=new URLSearchParams({enablejsapi:'1',rel:'0',playsinline:'1',origin:window.location.origin});
    if(opts.autoplay)params.set('autoplay','1');
    if(saasMuted)params.set('mute','1');
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }
  function saasPostCmd(func,args=[]){
    if(!saasPlayer||!saasPlayer.contentWindow)return;
    saasPlayer.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*');
  }
  function saasUpdatePlayIcon(isPlaying){
    saasPlayBtn.querySelector('.ic-play').style.display=isPlaying?'none':'block';
    saasPlayBtn.querySelector('.ic-pause').style.display=isPlaying?'block':'none';
  }
  function saasDestroyPlayer(){
    if(saasPlayer){saasPlayer.remove();saasPlayer=null}
    saasStage.classList.remove('has-player');
    saasUpdatePlayIcon(false);
  }
  function saasMountPlayer(withAutoplay){
    saasDestroyPlayer();
    const v=saasVideos[saasCurrentVideo];
    saasPlayer=document.createElement('iframe');
    saasPlayer.src=saasYtEmbedSrc(v.id,{autoplay:withAutoplay});
    saasPlayer.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    saasPlayer.allowFullscreen=true;
    saasPlayer.title='Featured video player';
    saasStage.appendChild(saasPlayer);
    saasStage.classList.add('has-player');
    saasUpdatePlayIcon(!!withAutoplay);
  }

  function saasRender(){
    const v=saasVideos[saasCurrentVideo];
    saasStage.classList.add('is-loading');
    saasPoster.onload=()=>{saasStage.classList.remove('is-loading')};
    saasPoster.src=`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
    saasTitleEl.textContent='Loading…';

    Array.from(saasPlaylist.children).forEach((item,i)=>item.classList.toggle('is-active',i===saasCurrentVideo));
    const activeItem=saasPlaylist.children[saasCurrentVideo];
    if(activeItem)activeItem.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});

    fetchYTMeta(`https://youtu.be/${v.id}`).then(meta=>{
      saasTitleEl.textContent=meta?meta.title:'Featured video';
    });
  }

  function saasGoTo(index,withAutoplay){
    saasCurrentVideo=((index%saasVideos.length)+saasVideos.length)%saasVideos.length;
    saasDestroyPlayer();
    saasRender();
    const shouldAutoplay=withAutoplay===undefined?saasAutoplay:withAutoplay;
    if(shouldAutoplay)saasMountPlayer(true);
  }

  // Build playlist
  saasPlaylist.innerHTML=saasVideos.map((v,i)=>`
    <div class="saas-item${i===0?' is-active':''}" data-index="${i}" role="option" tabindex="0">
      <div class="saas-item-thumb"><img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy"></div>
      <div class="saas-item-body">
        <p class="saas-item-title" id="saasit-${i}">Loading…</p>
        <p class="saas-item-sub" id="saasis-${i}">YouTube</p>
        <div class="saas-item-meta">
          <span class="saas-meta-tag">${v.category}</span>
          <span class="saas-meta-dot">•</span>
          <span class="saas-meta-text">${v.duration}</span>
          <span class="saas-meta-dot">•</span>
          <span class="saas-meta-text">${v.year}</span>
        </div>
      </div>
    </div>`).join('');

  saasVideos.forEach((v,i)=>{
    fetchYTMeta(`https://youtu.be/${v.id}`).then(meta=>{
      if(!meta)return;
      const t=document.getElementById(`saasit-${i}`),sub=document.getElementById(`saasis-${i}`);
      if(t)t.textContent=meta.title;
      if(sub)sub.textContent=meta.author;
    });
  });

  // Playlist click
  saasPlaylist.addEventListener('click',e=>{
    const item=e.target.closest('.saas-item');
    if(!item)return;
    saasGoTo(+item.dataset.index);
  });
  saasPlaylist.addEventListener('keydown',e=>{
    const item=e.target.closest('.saas-item');
    if(!item)return;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();saasGoTo(+item.dataset.index)}
  });

  // Big play button
  saasPlayBigBtn.addEventListener('click',()=>saasMountPlayer(true));

  // Bottom control bar
  saasPlayBtn.addEventListener('click',()=>{
    if(!saasPlayer){saasMountPlayer(true);return}
    const isPlaying=saasPlayBtn.querySelector('.ic-pause').style.display!=='none';
    if(isPlaying){saasPostCmd('pauseVideo');saasUpdatePlayIcon(false)}
    else{saasPostCmd('playVideo');saasUpdatePlayIcon(true)}
  });
  saasSoundBtn.addEventListener('click',()=>{
    saasMuted=!saasMuted;
    saasSoundBtn.querySelector('.ic-on').style.display=saasMuted?'none':'block';
    saasSoundBtn.querySelector('.ic-off').style.display=saasMuted?'block':'none';
    saasPostCmd(saasMuted?'mute':'unMute');
  });
  saasPrevBtn.addEventListener('click',()=>saasGoTo(saasCurrentVideo-1));
  saasNextBtn.addEventListener('click',()=>saasGoTo(saasCurrentVideo+1));
  saasAutoplayBtn.addEventListener('click',()=>{
    saasAutoplay=!saasAutoplay;
    saasAutoplayBtn.classList.toggle('is-on',saasAutoplay);
    saasAutoplayBtn.setAttribute('aria-pressed',String(saasAutoplay));
  });
  saasFullscreenBtn.addEventListener('click',()=>{
    const target=saasPlayer||saasStage;
    if(target.requestFullscreen)target.requestFullscreen();
    else if(target.webkitRequestFullscreen)target.webkitRequestFullscreen();
  });

  // Keyboard navigation — only while this player is in view, and
  // never while the visitor is typing in a form field.
  let saasInView=false;
  new IntersectionObserver(es=>{saasInView=es[0].isIntersecting},{threshold:.3}).observe(saasStage);
  document.addEventListener('keydown',e=>{
    if(!saasInView)return;
    const tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    if(e.key==='ArrowLeft'){e.preventDefault();saasGoTo(saasCurrentVideo-1)}
    if(e.key==='ArrowRight'){e.preventDefault();saasGoTo(saasCurrentVideo+1)}
  });

  saasRender();
})();

/* ═══════════════════════════
   SHORT FORM SHOWCASE — featured player + scrollable playlist
   Left: one large player (poster → real YouTube iframe on play,
   with Play/Sound/Prev/Next/Autoplay/Fullscreen controls). Right:
   an independently-scrolling playlist; clicking an item swaps the
   featured video instantly. Play/Sound use YouTube's postMessage
   API (enablejsapi=1) — this needs the page served over http(s),
   not opened directly as a local file, to work in every browser.
   Replace the `id`/`date` values in SHORTS with your real clips.
═══════════════════════════ */
(function initShortFormPlayer(){
  const list=document.getElementById('sfs2List');
  const stage=document.getElementById('sfs2Stage');
  const poster=document.getElementById('sfs2Poster');
  const titleEl=document.getElementById('sfs2Title');
  const playBigBtn=document.getElementById('sfs2PlayBig');
  const playBtn=document.getElementById('sfs2Play');
  const soundBtn=document.getElementById('sfs2Sound');
  const prevBtn=document.getElementById('sfs2Prev');
  const nextBtn=document.getElementById('sfs2Next');
  const autoplayBtn=document.getElementById('sfs2Autoplay');
  const fullscreenBtn=document.getElementById('sfs2Fullscreen');
  if(!list||!stage)return;

  // Placeholder dates — YouTube's oEmbed API doesn't expose publish
  // dates, so these are illustrative. Edit freely.
  const SHORTS=[
    {id:'RHbh1ggzc5w',date:'2026'},
    {id:'DpmTiegTgSg',date:'2026'},
    {id:'9UYD9wNuOrE',date:'2026'},
    {id:'o3Fa0lyHC-w',date:'2026'},
    {id:'YUtNjogUrlU',date:'2026'},
    {id:'1DY0rg1EdwA',date:'2026'},
    {id:'bqh0P_7SKos',date:'2026'},
    {id:'5NeUdeqINiM',date:'2026'},
    {id:'hqzEK0Sb_RE',date:'2026'},
    {id:'8x8if3PDtcY',date:'2026'}
  ];

  let active=0;
  let autoplay=false;
  let muted=false;
  let iframeEl=null;

  function ytEmbedSrc(id,opts={}){
    const params=new URLSearchParams({enablejsapi:'1',rel:'0',playsinline:'1',origin:window.location.origin});
    if(opts.autoplay)params.set('autoplay','1');
    if(muted)params.set('mute','1');
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }
  function postCmd(func,args=[]){
    if(!iframeEl||!iframeEl.contentWindow)return;
    iframeEl.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*');
  }
  function updatePlayIcon(isPlaying){
    playBtn.querySelector('.ic-play').style.display=isPlaying?'none':'block';
    playBtn.querySelector('.ic-pause').style.display=isPlaying?'block':'none';
  }
  function destroyPlayer(){
    if(iframeEl){iframeEl.remove();iframeEl=null}
    stage.classList.remove('has-player');
    updatePlayIcon(false);
  }
  function mountPlayer(withAutoplay){
    destroyPlayer();
    const s=SHORTS[active];
    iframeEl=document.createElement('iframe');
    iframeEl.src=ytEmbedSrc(s.id,{autoplay:withAutoplay});
    iframeEl.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframeEl.allowFullscreen=true;
    iframeEl.title='Short form video player';
    stage.appendChild(iframeEl);
    stage.classList.add('has-player');
    updatePlayIcon(!!withAutoplay);
  }

  function render(){
    const s=SHORTS[active];
    stage.classList.add('is-loading');
    poster.onload=()=>{stage.classList.remove('is-loading')};
    poster.src=`https://img.youtube.com/vi/${s.id}/hqdefault.jpg`;
    titleEl.textContent='Loading…';

    Array.from(list.children).forEach((item,i)=>item.classList.toggle('is-active',i===active));
    const activeItem=list.children[active];
    if(activeItem)activeItem.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});

    fetchYTMeta(`https://youtube.com/shorts/${s.id}`).then(meta=>{
      titleEl.textContent=meta?meta.title:'Short form video';
    });
  }

  function goTo(index,withAutoplay){
    active=((index%SHORTS.length)+SHORTS.length)%SHORTS.length;
    destroyPlayer();
    render();
    const shouldAutoplay=withAutoplay===undefined?autoplay:withAutoplay;
    if(shouldAutoplay)mountPlayer(true);
  }

  // Build playlist
  list.innerHTML=SHORTS.map((s,i)=>`
    <div class="sfs2-item${i===0?' is-active':''}" data-index="${i}" role="option" tabindex="0">
      <div class="sfs2-item-thumb"><img src="https://img.youtube.com/vi/${s.id}/hqdefault.jpg" alt="" loading="lazy"></div>
      <div class="sfs2-item-body">
        <div class="sfs2-item-title" id="sfs2it-${i}">Loading…</div>
        <div class="sfs2-item-sub" id="sfs2is-${i}">YouTube Shorts</div>
        <div class="sfs2-item-date">${s.date}</div>
        <div class="sfs2-item-icons">
          <svg viewBox="0 0 24 24"><path d="M21 6H3a1 1 0 00-1 1v10a1 1 0 001 1h5l3 3 3-3h7a1 1 0 001-1V7a1 1 0 00-1-1z"/></svg>
          <svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 006 6.93V21h2v-3.07A7 7 0 0019 11h-2z"/></svg>
          <svg viewBox="0 0 24 24"><path d="M3 12h2v4H3zM7 8h2v10H7zM11 5h2v14h-2zM15 9h2v8h-2zM19 11h2v6h-2z"/></svg>
        </div>
      </div>
    </div>`).join('');

  SHORTS.forEach((s,i)=>{
    fetchYTMeta(`https://youtube.com/shorts/${s.id}`).then(meta=>{
      if(!meta)return;
      const t=document.getElementById(`sfs2it-${i}`),sub=document.getElementById(`sfs2is-${i}`);
      if(t)t.textContent=meta.title;
      if(sub)sub.textContent=meta.author;
    });
  });

  // Playlist click
  list.addEventListener('click',e=>{
    const item=e.target.closest('.sfs2-item');
    if(!item)return;
    goTo(+item.dataset.index);
  });
  list.addEventListener('keydown',e=>{
    const item=e.target.closest('.sfs2-item');
    if(!item)return;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();goTo(+item.dataset.index)}
  });

  // Big play button
  playBigBtn.addEventListener('click',()=>mountPlayer(true));

  // Bottom control bar
  playBtn.addEventListener('click',()=>{
    if(!iframeEl){mountPlayer(true);return}
    const isPlaying=playBtn.querySelector('.ic-pause').style.display!=='none';
    if(isPlaying){postCmd('pauseVideo');updatePlayIcon(false)}
    else{postCmd('playVideo');updatePlayIcon(true)}
  });
  soundBtn.addEventListener('click',()=>{
    muted=!muted;
    soundBtn.querySelector('.ic-on').style.display=muted?'none':'block';
    soundBtn.querySelector('.ic-off').style.display=muted?'block':'none';
    postCmd(muted?'mute':'unMute');
  });
  prevBtn.addEventListener('click',()=>goTo(active-1));
  nextBtn.addEventListener('click',()=>goTo(active+1));
  autoplayBtn.addEventListener('click',()=>{
    autoplay=!autoplay;
    autoplayBtn.classList.toggle('is-on',autoplay);
    autoplayBtn.setAttribute('aria-pressed',String(autoplay));
  });
  fullscreenBtn.addEventListener('click',()=>{
    const target=iframeEl||stage;
    if(target.requestFullscreen)target.requestFullscreen();
    else if(target.webkitRequestFullscreen)target.webkitRequestFullscreen();
  });

  // Keyboard navigation — only while the player is in view, and
  // never while the visitor is typing in a form field.
  let inView=false;
  new IntersectionObserver(es=>{inView=es[0].isIntersecting},{threshold:.3}).observe(stage);
  document.addEventListener('keydown',e=>{
    if(!inView)return;
    const tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    if(e.key==='ArrowLeft'){e.preventDefault();goTo(active-1)}
    if(e.key==='ArrowRight'){e.preventDefault();goTo(active+1)}
  });

  render();
})();


/* ═══════════════════════════
   SERVICE / BUDGET PICKERS
   Selecting an option also syncs the hidden form fields
   (#serviceInput / #budgetInput) that get submitted with the form.
═══════════════════════════ */
document.getElementById('svcR').addEventListener('click',e=>{
  const o=e.target.closest('.svc-o');if(!o)return;
  document.querySelectorAll('.svc-o').forEach(x=>x.classList.remove('sel'));
  o.classList.add('sel');
  document.getElementById('serviceInput').value=o.dataset.s;
});
document.getElementById('budR').addEventListener('click',e=>{
  const o=e.target.closest('.bud-o');if(!o)return;
  document.querySelectorAll('.bud-o').forEach(x=>x.classList.remove('sel'));
  o.classList.add('sel');
  document.getElementById('budgetInput').value=o.dataset.b;
});

/* ═══════════════════════════
   CONTACT FORM — Vercel Serverless Function (Resend)
   Submits to /api/contact, which sends the email via Resend
   to mohalaminadamou@gmail.com. See /api/contact.js.
═══════════════════════════ */
const CONTACT_ENDPOINT = '/api/contact';

const contactForm=document.getElementById('contactForm');
const sendBtn=document.getElementById('sendBtn');
const conStatus=document.getElementById('conStatus');
let isSubmitting=false; // guards against duplicate/double-click submissions

function setStatus(kind,message){
  conStatus.textContent=message;
  conStatus.className=`con-status show ${kind}`;
}
function clearStatus(){
  conStatus.className='con-status';
}
function validateForm(form){
  let firstInvalid=null;
  form.querySelectorAll('[required]').forEach(f=>{
    const empty=!f.value||!f.value.trim();
    f.classList.toggle('invalid',empty);
    if(empty&&!firstInvalid)firstInvalid=f;
  });
  const emailField=form.querySelector('[name="email"]');
  if(emailField&&emailField.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)){
    emailField.classList.add('invalid');
    if(!firstInvalid)firstInvalid=emailField;
  }
  return firstInvalid;
}
contactForm.querySelectorAll('[required]').forEach(f=>{
  f.addEventListener('input',()=>f.classList.remove('invalid'));
});

contactForm.addEventListener('submit',async function(e){
  e.preventDefault();
  if(isSubmitting)return; // prevent duplicate submissions

  clearStatus();
  const firstInvalid=validateForm(this);
  if(firstInvalid){
    setStatus('error','Please fill in the required fields highlighted below.');
    firstInvalid.focus();
    return;
  }

  isSubmitting=true;
  sendBtn.classList.add('loading');
  sendBtn.disabled=true;

  try{
    const fd=new FormData(this);
    const payload={
      name:(fd.get('name')||'').toString().trim(),
      email:(fd.get('email')||'').toString().trim(),
      social:(fd.get('social')||'').toString().trim(),
      media:(fd.get('media')||'').toString().trim(),
      service:(fd.get('service')||'').toString().trim(),
      budget:(fd.get('budget')||'').toString().trim(),
      message:(fd.get('message')||'').toString().trim(),
    };

    const res=await fetch(CONTACT_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
    });
    const data=await res.json().catch(()=>({}));
    if(!res.ok||!data.success){
      throw new Error(data.error||'Something went wrong sending your message.');
    }

    setStatus('success','Message sent — thank you! I\'ll reply within 12–24 hours.');
    this.reset();
    document.getElementById('serviceInput').value='Long Form';
    document.getElementById('budgetInput').value='1k-2k';
    document.querySelectorAll('.svc-o').forEach(x=>x.classList.remove('sel'));
    document.querySelector('.svc-o[data-s="Long Form"]').classList.add('sel');
    document.querySelectorAll('.bud-o').forEach(x=>x.classList.remove('sel'));
    document.querySelector('.bud-o[data-b="1k-2k"]').classList.add('sel');
  }catch(err){
    console.error('Contact form submission failed:',err);
    setStatus('error',err.message||'Something went wrong sending your message — please try WhatsApp instead.');
  }finally{
    isSubmitting=false;
    sendBtn.classList.remove('loading');
    sendBtn.disabled=false;
  }
});

/* Nav links — smooth hash scroll */
document.querySelectorAll('.nav-links a, .nav-logo, footer .fl').forEach(a=>{
  a.addEventListener('click',e=>{
    const h=a.getAttribute('href');
    if(h && h.startsWith('#')){
      e.preventDefault();
      const el=document.querySelector(h);
      if(el)el.scrollIntoView({behavior:'smooth'});
    }
  });
});
