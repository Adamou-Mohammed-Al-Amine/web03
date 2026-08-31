/* ═══════════════════════════
   ALWAYS LOAD FROM THE TOP
   Prevents the browser from restoring a previous scroll position
   on refresh, and forces the page to start at the Hero section.
═══════════════════════════ */
if('scrollRestoration' in history){history.scrollRestoration='manual'}
window.scrollTo(0,0);
window.addEventListener('load',()=>window.scrollTo(0,0));

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
   MOBILE NAV
═══════════════════════════ */
(function(){
  const burger=document.getElementById('navBurger');
  const panel=document.getElementById('navMobile');
  const scrim=document.getElementById('navScrim');
  if(!burger||!panel||!scrim)return;
  function closeMenu(){
    burger.setAttribute('aria-expanded','false');
    panel.classList.remove('open');
    scrim.classList.remove('open');
    document.body.style.overflow='';
  }
  function openMenu(){
    burger.setAttribute('aria-expanded','true');
    panel.classList.add('open');
    scrim.classList.add('open');
    document.body.style.overflow='hidden';
  }
  burger.addEventListener('click',()=>{
    burger.getAttribute('aria-expanded')==='true'?closeMenu():openMenu();
  });
  scrim.addEventListener('click',closeMenu);
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  window.addEventListener('resize',()=>{if(window.innerWidth>820)closeMenu()});
})();

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
  {id:'NXQTS1J31Tg',category:'Featured',duration:'',year:'2026',featured:true},
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
  let muted=true; /* muted-by-default autoplay: mobile browsers block unmuted autoplay in cross-origin iframes even on direct tap; sound button lets the visitor unmute */
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

  const featuredBadge=document.getElementById('lf2FeaturedBadge');

  function render(initial){
    const v=videos[active];
    stage.classList.add('is-loading');
    poster.onload=()=>{stage.classList.remove('is-loading')};
    poster.src=`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
    titleEl.textContent='Loading…';
    if(featuredBadge)featuredBadge.style.display=v.featured?'flex':'none';

    Array.from(list.children).forEach((item,i)=>item.classList.toggle('is-active',i===active));
    if(!initial){
      const activeItem=list.children[active];
      if(activeItem)activeItem.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});
    }

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
    <div class="lf2-item${i===0?' is-active':''}${v.featured?' is-featured':''}" data-index="${i}" role="option" tabindex="0">
      <div class="lf2-item-thumb">${v.featured?'<span class="lf2-featured-tag">★ Featured</span>':''}<img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy"></div>
      <div class="lf2-item-body">
        <p class="lf2-item-title" id="lf2it-${i}">Loading…</p>
        <p class="lf2-item-sub" id="lf2is-${i}">YouTube</p>
        <div class="lf2-item-meta">
          <span class="lf2-meta-tag">${v.category}</span>
          ${v.duration?`<span class="lf2-meta-dot">•</span><span class="lf2-meta-text">${v.duration}</span>`:''}
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

  render(true);
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
  let saasMuted=true; /* muted-by-default autoplay for reliable mobile playback */
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

  function saasRender(initial){
    const v=saasVideos[saasCurrentVideo];
    saasStage.classList.add('is-loading');
    saasPoster.onload=()=>{saasStage.classList.remove('is-loading')};
    saasPoster.src=`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
    saasTitleEl.textContent='Loading…';

    Array.from(saasPlaylist.children).forEach((item,i)=>item.classList.toggle('is-active',i===saasCurrentVideo));
    if(!initial){
      const activeItem=saasPlaylist.children[saasCurrentVideo];
      if(activeItem)activeItem.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});
    }

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

  saasRender(true);
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
(function initShortFormCarousel(){
  const track=document.getElementById('sfcTrack');
  const dotsEl=document.getElementById('sfcDots');
  const prevBtn=document.getElementById('sfcPrev');
  const nextBtn=document.getElementById('sfcNext');
  const wrap=document.getElementById('sfcWrap');
  if(!track)return;

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
    {id:'8x8if3PDtcY',date:'2026'},
    {id:'auPxAjLg-qE',date:'2026'},
    {id:'vU1waaMwUn8',date:'2026'}
  ];

  let iframeEl=null;
  let mountedIndex=null; // DOM index (not real index) of the slide with a live player
  let muted=true; // muted-by-default autoplay: reliable on mobile, unlike unmuted
  let scrollRaf=null;
  let scrollEndTimer=null;
  let programmaticScroll=false;

  // ---- infinite loop via edge-cloning ----
  // K clones of the tail are prepended and K clones of the head are
  // appended around the real N slides. Native scroll-snap then just
  // keeps scrolling in one direction; once the visitor drifts into a
  // cloned zone we silently (no animation) jump the scroll position
  // back to the matching real slide — same artwork, so it's invisible
  // — which is what makes prev/next/swipe feel endless.
  const N=SHORTS.length;
  const K=Math.min(4,N);
  const domData=[
    ...SHORTS.slice(N-K).map((s,i)=>({s,real:N-K+i})),
    ...SHORTS.map((s,i)=>({s,real:i})),
    ...SHORTS.slice(0,K).map((s,i)=>({s,real:i}))
  ];
  const total=domData.length;
  let active=K; // DOM index of the first real slide

  function ytEmbedSrc(id){
    const params=new URLSearchParams({enablejsapi:'1',rel:'0',playsinline:'1',autoplay:'1',origin:window.location.origin});
    if(muted)params.set('mute','1');
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }
  function postCmd(func,args=[]){
    if(!iframeEl||!iframeEl.contentWindow)return;
    iframeEl.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*');
  }
  function destroyPlayer(){
    if(iframeEl){iframeEl.remove();iframeEl=null}
    if(mountedIndex!==null){
      const prevMedia=track.children[mountedIndex]?.querySelector('.sfc-media');
      if(prevMedia)prevMedia.classList.remove('has-player');
    }
    mountedIndex=null;
  }
  function mountPlayer(domIndex){
    destroyPlayer();
    const s=domData[domIndex].s;
    const media=track.children[domIndex]?.querySelector('.sfc-media');
    if(!media)return;
    iframeEl=document.createElement('iframe');
    iframeEl.src=ytEmbedSrc(s.id);
    iframeEl.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframeEl.allowFullscreen=true;
    iframeEl.title='Short form video player';
    media.appendChild(iframeEl);
    media.classList.add('has-player');
    mountedIndex=domIndex;
  }
  function toggleMute(btn){
    muted=!muted;
    btn.querySelector('.ic-on').style.display=muted?'none':'block';
    btn.querySelector('.ic-off').style.display=muted?'block':'none';
    postCmd(muted?'mute':'unMute');
  }

  // ---- build slides ----
  track.innerHTML=domData.map((d,i)=>`
    <div class="sfc-slide${i===active?' is-active':''}" data-index="${i}" data-real="${d.real}" role="option" aria-selected="${i===active}" tabindex="0">
      <span class="sfc-num">${String(d.real+1).padStart(2,'0')}</span>
      <div class="sfc-media">
        <img class="sfc-poster" src="https://img.youtube.com/vi/${d.s.id}/hqdefault.jpg" alt="" loading="lazy">
        <button class="sfc-play" aria-label="Play video">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button class="sfc-mute" aria-label="Toggle sound">
          <svg class="ic-on" viewBox="0 0 24 24" style="display:none"><path d="M4 9v6h4l5 5V4L8 9H4zm11.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z"/></svg>
          <svg class="ic-off" viewBox="0 0 24 24"><path d="M4 9v6h4l5 5V4L8 9H4zm14.7-3.3l-1.4-1.4L15 6.6l-2.3-2.3-1.4 1.4L13.6 8l-2.3 2.3 1.4 1.4L15 9.4l2.3 2.3 1.4-1.4L16.4 8l2.3-2.3z"/></svg>
        </button>
      </div>
      <div class="sfc-info">
        <div class="sfc-tags">
          <span class="sfc-tag">Shorts</span>
          <span class="sfc-tag">YouTube</span>
        </div>
        <h3 class="sfc-title-txt" id="sfcTitle-${i}">Loading…</h3>
        <p class="sfc-desc">Vertical short edited for fast-paced watch time.</p>
        <a class="sfc-open" href="https://youtube.com/shorts/${d.s.id}" target="_blank" rel="noopener">
          Open <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H8m9 0v9"/></svg>
        </a>
      </div>
    </div>`).join('');

  // Fetch each real video's title once and apply it to every DOM
  // clone that shares that id (avoids redundant oEmbed calls).
  const titleCache={};
  domData.forEach((d,i)=>{
    const t=document.getElementById(`sfcTitle-${i}`);
    const cached=titleCache[d.s.id];
    if(cached){cached.then(meta=>{if(t)t.textContent=meta?meta.title:'Short form video'});return}
    const p=fetchYTMeta(`https://youtube.com/shorts/${d.s.id}`);
    titleCache[d.s.id]=p;
    p.then(meta=>{if(t)t.textContent=meta?meta.title:'Short form video'});
  });

  // ---- dots (one per real slide) ----
  dotsEl.innerHTML=SHORTS.map((s,i)=>`<button class="sfc-dot${i===0?' is-active':''}" data-real="${i}" aria-label="Go to video ${i+1}"></button>`).join('');

  function setActive(domIndex){
    if(domIndex===active){
      // still refresh classes in case this is a post-reposition relabel
    }
    active=domIndex;
    const realIndex=domData[domIndex].real;
    Array.from(track.children).forEach((slide,i)=>{
      slide.classList.toggle('is-active',i===active);
      slide.setAttribute('aria-selected',i===active);
    });
    Array.from(dotsEl.children).forEach((dot,i)=>dot.classList.toggle('is-active',i===realIndex));
    if(mountedIndex!==null&&mountedIndex!==active)destroyPlayer();
  }

  // If we've drifted into a cloned zone, silently re-center on the
  // matching real slide — identical artwork, so the jump is invisible.
  let repositioning=false;
  function maybeReposition(){
    if(repositioning)return;
    let target=null;
    if(active<K)target=active+N;
    else if(active>=K+N)target=active-N;
    if(target===null)return;
    repositioning=true;
    programmaticScroll=true;
    setActive(target);
    const slide=track.children[target];
    if(slide)slide.scrollIntoView({behavior:'auto',inline:'center',block:'nearest'});
    requestAnimationFrame(()=>{requestAnimationFrame(()=>{programmaticScroll=false;repositioning=false})});
  }

  function domIndexForReal(realIndex){
    const candidates=[K+realIndex-N,K+realIndex,K+realIndex+N].filter(v=>v>=0&&v<total);
    return candidates.reduce((best,c)=>Math.abs(c-active)<Math.abs(best-active)?c:best,candidates[0]);
  }

  function goTo(domIndex){
    domIndex=Math.max(0,Math.min(total-1,domIndex));
    const slide=track.children[domIndex];
    if(!slide)return;
    setActive(domIndex);
    programmaticScroll=true;
    slide.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    // Only resets the flag here — actual reposition-after-settle is
    // owned solely by the scroll-end timer below, so the two never race.
    window.clearTimeout(goTo._t);
    goTo._t=window.setTimeout(()=>{programmaticScroll=false},500);
  }

  // ---- scroll → detect nearest-to-center slide ----
  function onScroll(){
    if(scrollRaf)return;
    scrollRaf=requestAnimationFrame(()=>{
      scrollRaf=null;
      if(programmaticScroll)return;
      const trackRect=track.getBoundingClientRect();
      const center=trackRect.left+trackRect.width/2;
      let closest=0,closestDist=Infinity;
      Array.from(track.children).forEach((slide,i)=>{
        const r=slide.getBoundingClientRect();
        const dist=Math.abs((r.left+r.width/2)-center);
        if(dist<closestDist){closestDist=dist;closest=i}
      });
      if(closest!==active)setActive(closest);
    });
    clearTimeout(scrollEndTimer);
    scrollEndTimer=setTimeout(maybeReposition,140);
  }
  track.addEventListener('scroll',onScroll,{passive:true});

  // ---- interactions ----
  track.addEventListener('click',e=>{
    const slide=e.target.closest('.sfc-slide');
    if(!slide)return;
    const domIndex=+slide.dataset.index;
    if(domIndex!==active){goTo(domIndex);return}
    const muteBtn=e.target.closest('.sfc-mute');
    if(muteBtn){toggleMute(muteBtn);return}
    if(e.target.closest('.sfc-open'))return; // let the link work
    if(e.target.closest('.sfc-play')||e.target.closest('.sfc-media')){
      if(mountedIndex!==domIndex)mountPlayer(domIndex);
    }
  });
  track.addEventListener('keydown',e=>{
    const slide=e.target.closest('.sfc-slide');
    if(!slide)return;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();goTo(+slide.dataset.index)}
  });
  dotsEl.addEventListener('click',e=>{
    const dot=e.target.closest('.sfc-dot');
    if(!dot)return;
    goTo(domIndexForReal(+dot.dataset.real));
  });
  prevBtn.addEventListener('click',()=>goTo(active-1));
  nextBtn.addEventListener('click',()=>goTo(active+1));

  // Keyboard navigation — only while the carousel is in view, and
  // never while the visitor is typing in a form field.
  let inView=false;
  new IntersectionObserver(es=>{inView=es[0].isIntersecting},{threshold:.3}).observe(wrap);
  document.addEventListener('keydown',e=>{
    if(!inView)return;
    const tag=(e.target.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea')return;
    if(e.key==='ArrowLeft'){e.preventDefault();goTo(active-1)}
    if(e.key==='ArrowRight'){e.preventDefault();goTo(active+1)}
  });

  // Center the first real slide once layout has settled.
  requestAnimationFrame(()=>{
    const slide=track.children[active];
    if(slide)slide.scrollIntoView({behavior:'auto',inline:'center',block:'nearest'});
  });
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
   CONTACT FORM — EmailJS (client-side, no backend)
   Uses the official EmailJS SDK (script tag in index.html) to send
   the form directly from the browser via emailjs.sendForm(), which
   reads each field by its `name` attribute — no manual field mapping
   needed. Fill in the three values below from your EmailJS account:

     EMAILJS_PUBLIC_KEY   → Account → General → Public Key
     EMAILJS_SERVICE_ID   → Email Services → your connected inbox
     EMAILJS_TEMPLATE_ID  → Email Templates → your template

   In your EmailJS template, map these variables (they match the
   form field names exactly, via sendForm):
     {{name}}    — Name
     {{email}}   — Email (also set as the template's Reply-To)
     {{social}}  — Social Handle
     {{media}}   — Media
     {{service}} — Selected Service
     {{budget}}  — Budget
     {{message}} — Message

   Until all three IDs below are filled in, submissions will show a
   clear configuration error instead of silently failing.
═══════════════════════════ */
const EMAILJS_PUBLIC_KEY='';   // ← paste your EmailJS Public Key here
const EMAILJS_SERVICE_ID='';   // ← paste your EmailJS Service ID here
const EMAILJS_TEMPLATE_ID='';  // ← paste your EmailJS Template ID here

if(EMAILJS_PUBLIC_KEY&&window.emailjs)emailjs.init(EMAILJS_PUBLIC_KEY);

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
  if(!EMAILJS_PUBLIC_KEY||!EMAILJS_SERVICE_ID||!EMAILJS_TEMPLATE_ID){
    setStatus('error','Contact form isn\'t configured yet — missing EmailJS keys in js/main.js.');
    console.warn('EmailJS is not configured. Fill in EMAILJS_PUBLIC_KEY / EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID in js/main.js.');
    return;
  }

  isSubmitting=true;
  sendBtn.classList.add('loading');
  sendBtn.disabled=true;

  try{
    await emailjs.sendForm(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,this);

    setStatus('success','Message sent — thank you! I\'ll reply within 12–24 hours.');
    this.reset();
    document.getElementById('serviceInput').value='Long Form';
    document.getElementById('budgetInput').value='1k-2k';
    document.querySelectorAll('.svc-o').forEach(x=>x.classList.remove('sel'));
    document.querySelector('.svc-o[data-s="Long Form"]').classList.add('sel');
    document.querySelectorAll('.bud-o').forEach(x=>x.classList.remove('sel'));
    document.querySelector('.bud-o[data-b="1k-2k"]').classList.add('sel');
  }catch(err){
    console.error('EmailJS submission failed:',err);
    // Surface EmailJS's own error text (e.g. invalid service/template ID,
    // rate limit, etc.) instead of a generic message.
    const reason=(err&&(err.text||err.message))||'Unknown error.';
    setStatus('error',`Failed to send: ${reason}`);
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
