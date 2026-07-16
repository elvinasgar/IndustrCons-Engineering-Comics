/* ============================================================
   IndustrCons — App Engine
   ============================================================ */

const STORAGE_KEY = "industrcons_state_v1";

const RANKS = [
  {min:0,   title:"Trainee Engineer",   emoji:"🎓"},
  {min:150, title:"Junior Engineer",    emoji:"🛠️"},
  {min:450, title:"Site Engineer",      emoji:"👷"},
  {min:900, title:"Senior Engineer",    emoji:"📐"},
  {min:1600,title:"Chief Engineer",     emoji:"🏗️"},
  {min:2600,title:"Master Engineer",    emoji:"🏆"},
];

const BADGES = [
  {id:"first_blueprint", label:"First Blueprint", ic:"📘", test:s=>Object.keys(s.completed).length>=1},
  {id:"zero_accident",   label:"Zero Accident",    ic:"🦺", test:s=>Object.values(s.completed).some(c=>c.type==="safety" && c.stars>=5)},
  {id:"quality_guardian",label:"Quality Guardian", ic:"🧱", test:s=>Object.values(s.completed).filter(c=>c.type==="quality" && c.stars>=5).length>=3},
  {id:"budget_guardian", label:"Budget Guardian",  ic:"💰", test:s=>Object.values(s.completed).some(c=>c.type==="budget" && c.stars>=5)},
  {id:"perfectionist",   label:"Perfectionist",    ic:"⭐", test:s=>Object.values(s.completed).filter(c=>c.stars>=5).length>=5},
  {id:"century_club",    label:"Century Club",     ic:"💯", test:s=>s.xp>=500},
  {id:"streak_keeper",   label:"Streak Keeper",    ic:"🔥", test:s=>s.streak>=3},
  {id:"iron_streak",     label:"Iron Streak",      ic:"🔱", test:s=>s.streak>=7},
  {id:"explorer",        label:"Explorer",         ic:"🧭", test:s=>(s.everOpened||[]).length>=5},
  {id:"comic_collector", label:"Comic Collector",  ic:"📚", test:s=>Object.keys(s.completed).length>=STORIES.length},
  {id:"all_rounder",     label:"All Rounder",      ic:"🌍", test:s=>{
      const cats = new Set(STORIES.map(x=>x.category));
      const done = new Set(Object.keys(s.completed).map(id=>STORIES.find(x=>x.id===id)?.category));
      return [...cats].every(c=>done.has(c));
  }},
];

function defaultState(){
  return { xp:0, streak:0, lastPlayedDay:null, completed:{}, bookmarks:[], favorites:[], recent:[],
           badgesEarned:[], theme:"light", sound:true, dailySeed:null, dailyDoneDay:null, everOpened:[] };
}

let STATE = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  }catch(e){ return defaultState(); }
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); }catch(e){}
}

function todayStr(){ return new Date().toISOString().slice(0,10); }

function bumpStreak(){
  const today = todayStr();
  if(STATE.lastPlayedDay === today) return;
  const y = new Date(); y.setDate(y.getDate()-1);
  const yesterday = y.toISOString().slice(0,10);
  STATE.streak = (STATE.lastPlayedDay === yesterday) ? STATE.streak+1 : 1;
  STATE.lastPlayedDay = today;
}

function getRank(xp){
  let r = RANKS[0];
  for(const rk of RANKS){ if(xp>=rk.min) r = rk; }
  return r;
}
function nextRank(xp){
  return RANKS.find(r=>r.min>xp) || null;
}

function checkBadges(){
  const newly=[];
  BADGES.forEach(b=>{
    if(!STATE.badgesEarned.includes(b.id) && b.test(STATE)){
      STATE.badgesEarned.push(b.id); newly.push(b);
    }
  });
  return newly;
}

/* ---------------- sound ---------------- */
let audioCtx=null;
function beep(freq=440, dur=0.09, type="sine", vol=0.18){
  if(!STATE.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type=type; o.frequency.value=freq; g.gain.value=vol;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+dur);
    o.stop(audioCtx.currentTime+dur+0.02);
  }catch(e){}
}
const sfx = {
  tap:()=>beep(520,0.06,"square",0.12),
  page:()=>beep(340,0.09,"triangle",0.16),
  good:()=>{beep(523,0.1,"sine",0.18); setTimeout(()=>beep(659,0.14,"sine",0.18),90);},
  bad:()=>{beep(220,0.16,"sawtooth",0.16); setTimeout(()=>beep(160,0.18,"sawtooth",0.14),100);},
  xp:()=>{beep(660,0.07,"sine",0.15); setTimeout(()=>beep(880,0.12,"sine",0.16),70);},
};

/* ---------------- confetti ---------------- */
function fireConfetti(){
  const colors=["#f5941f","#1c4b82","#f9b233","#2fae66","#e5484d"];
  for(let i=0;i<46;i++){
    const el=document.createElement("div");
    el.className="confetti-piece";
    el.style.left = Math.random()*100+"vw";
    el.style.background = colors[i%colors.length];
    el.style.animationDuration = (2.2+Math.random()*1.6)+"s";
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(), 4200);
  }
}

/* ---------------- toast ---------------- */
let toastTimer=null;
function toast(msg){
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove("show"), 2200);
}

/* ============================================================
   SEO / STRUCTURED DATA
   Site-level Organization / ComicSeries / ImageObject / Breadcrumb
   schemas live statically in index.html <head>. This block adds:
   1) a static-at-load ItemList of CreativeWork (one per comic),
      generated from data.js so it always matches the real catalog.
   2) dynamic per-comic CreativeWork + BreadcrumbList + meta/OG/title
      updates while a comic is open, reverted on close.
   ============================================================ */
const SEO_SITE_URL = (window.INDUSTRCONS_SITE_URL || "https://industrcons.github.io/engineering-comics/").replace(/\/?$/, "/");
const SEO_DEFAULT_TITLE = "IndustrCons Engineering Comics — IRE‑3";
const SEO_DEFAULT_DESC = document.querySelector('meta[name="description"]')?.content || "";

function setOrCreateLdScript(id, obj){
  let el = document.getElementById(id);
  if(!el){
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}
function removeLdScript(id){
  const el = document.getElementById(id);
  if(el) el.remove();
}
function setMeta(selector, content){
  const el = document.querySelector(selector);
  if(el) el.setAttribute("content", content);
}

function injectComicCatalogSchema(){
  const itemList = {
    "@context":"https://schema.org",
    "@type":"ItemList",
    "name":"IndustrCons Engineering Comics Catalog",
    "itemListElement": STORIES.map((s,i)=>({
      "@type":"ListItem",
      "position": i+1,
      "item": {
        "@type":"CreativeWork",
        "name": s.title,
        "description": s.description,
        "genre": s.category,
        "educationalLevel": s.difficulty,
        "timeRequired": "PT"+s.readTime+"M",
        "isPartOf": { "@type":"ComicSeries", "name":"IndustrCons Engineering Comics" },
        "url": SEO_SITE_URL + "#comic=" + s.id
      }
    }))
  };
  setOrCreateLdScript("schema-catalog", itemList);
}

function updateSEOForStory(story){
  document.title = story.title + " — IndustrCons Engineering Comics";
  setMeta('meta[name="description"]', story.description);
  setMeta('meta[property="og:title"]', story.title + " — IndustrCons Engineering Comics");
  setMeta('meta[property="og:description"]', story.description);
  setMeta('meta[property="og:url"]', SEO_SITE_URL + "#comic=" + story.id);
  setMeta('meta[name="twitter:title"]', story.title);
  setMeta('meta[name="twitter:description"]', story.description);

  setOrCreateLdScript("schema-comic-creativework", {
    "@context":"https://schema.org",
    "@type":"CreativeWork",
    "name": story.title,
    "description": story.description,
    "genre": story.category,
    "educationalLevel": story.difficulty,
    "timeRequired": "PT"+story.readTime+"M",
    "isPartOf": { "@type":"ComicSeries", "name":"IndustrCons Engineering Comics", "url": SEO_SITE_URL },
    "publisher": { "@type":"Organization", "name":"IndustrCons" },
    "url": SEO_SITE_URL + "#comic=" + story.id,
    "image": SEO_SITE_URL + "assets/logo-og.jpg"
  });

  setOrCreateLdScript("schema-comic-breadcrumb", {
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement":[
      { "@type":"ListItem", "position":1, "name":"Home", "item": SEO_SITE_URL },
      { "@type":"ListItem", "position":2, "name":"Comic Library", "item": SEO_SITE_URL + "#library" },
      { "@type":"ListItem", "position":3, "name": story.category, "item": SEO_SITE_URL + "#library&category=" + encodeURIComponent(story.category) },
      { "@type":"ListItem", "position":4, "name": story.title, "item": SEO_SITE_URL + "#comic=" + story.id }
    ]
  });
}

function resetSEODefault(){
  document.title = SEO_DEFAULT_TITLE;
  setMeta('meta[name="description"]', SEO_DEFAULT_DESC);
  setMeta('meta[property="og:title"]', SEO_DEFAULT_TITLE);
  setMeta('meta[property="og:description"]', SEO_DEFAULT_DESC);
  setMeta('meta[property="og:url"]', SEO_SITE_URL);
  setMeta('meta[name="twitter:title"]', SEO_DEFAULT_TITLE);
  setMeta('meta[name="twitter:description"]', SEO_DEFAULT_DESC);
  removeLdScript("schema-comic-creativework");
  removeLdScript("schema-comic-breadcrumb");
}

/* ============================================================
   NAVIGATION
   ============================================================ */
let currentView = "home";
function showView(name){
  currentView = name;
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById("view-"+name).classList.add("active");
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active", b.dataset.view===name));
  window.scrollTo({top:0});
  if(name==="home") renderHome();
  if(name==="library") renderLibrary();
  if(name==="profile") renderProfile();
}

/* ============================================================
   CARD BUILDER
   ============================================================ */
function progressFor(story){
  const c = STATE.completed[story.id];
  return c ? 100 : (STATE.recent.includes(story.id) ? 45 : 0);
}
function difficultyColor(d){
  return d==="Beginner" ? "#2fae66" : d==="Intermediate" ? "#f5941f" : "#e5484d";
}
function comicCard(story){
  const isBookmarked = STATE.bookmarks.includes(story.id);
  const prog = progressFor(story);
  const cover = buildCover(story.cover.scene, story.cover.role, {sky:story.cover.sky});
  return `
  <div class="comic-card" data-id="${story.id}" onclick="openReader('${story.id}')">
    <div class="cover halftone">
      ${cover}
      <span class="diff-badge" style="color:${difficultyColor(story.difficulty)}">${story.difficulty}</span>
      <button class="bookmark-btn" onclick="event.stopPropagation(); toggleBookmark('${story.id}')">${isBookmarked?"🔖":"🏷️"}</button>
      <button class="bookmark-btn" style="right:38px;" onclick="event.stopPropagation(); toggleFavorite('${story.id}')">${STATE.favorites.includes(story.id)?"❤️":"🤍"}</button>
    </div>
    <div class="body">
      <div class="cat">${story.category}</div>
      <h3>${story.title}</h3>
      <div class="meta"><span>⏱ ${story.readTime} min</span><span>⚡ ${story.xp} XP</span></div>
      ${prog>0?`<div class="progress-track"><div class="progress-fill" style="width:${prog}%"></div></div>`:''}
    </div>
  </div>`;
}

function toggleBookmark(id){
  const i = STATE.bookmarks.indexOf(id);
  if(i>-1){ STATE.bookmarks.splice(i,1); toast("Removed bookmark"); }
  else{ STATE.bookmarks.push(id); toast("Bookmarked ⭐"); }
  saveState(); sfx.tap();
  if(currentView==="home") renderHome(); if(currentView==="library") renderLibrary();
}

function toggleFavorite(id){
  const i = STATE.favorites.indexOf(id);
  if(i>-1){ STATE.favorites.splice(i,1); toast("Removed from favorites"); }
  else{ STATE.favorites.push(id); toast("Added to favorites ❤️"); }
  saveState(); sfx.tap();
  if(currentView==="home") renderHome(); if(currentView==="library") renderLibrary();
}

/* ============================================================
   HOME VIEW
   ============================================================ */
function dailyChallenge(){
  const day = todayStr();
  const idx = Math.abs(hashCode(day)) % STORIES.length;
  return STORIES[idx];
}
function hashCode(str){ let h=0; for(let i=0;i<str.length;i++){ h=(h<<5)-h+str.charCodeAt(i); h|=0; } return h; }

function renderHome(){
  const el = document.getElementById("view-home");
  const rank = getRank(STATE.xp);
  const nr = nextRank(STATE.xp);
  const daily = dailyChallenge();
  const dailyDoneToday = STATE.dailyDoneDay === todayStr();

  const continueList = STATE.recent.filter(id=>!STATE.completed[id]).map(id=>STORIES.find(s=>s.id===id)).filter(Boolean);
  const favList = STATE.favorites.map(id=>STORIES.find(s=>s.id===id)).filter(Boolean);
  const recentList = STATE.recent.map(id=>STORIES.find(s=>s.id===id)).filter(Boolean);

  el.innerHTML = `
    <div class="page-hero">
      <h1>Build. Decide. <span style="color:var(--orange)">Learn.</span></h1>
      <p>Step into the boots of a real engineer — every choice changes the outcome.</p>
    </div>

    <div class="rank-banner">
      <div class="emoji">${rank.emoji}</div>
      <div style="flex:1">
        <h3>${rank.title}</h3>
        <p>${STATE.xp} XP ${nr? `· ${nr.min-STATE.xp} XP to ${nr.title}`:'· Max rank reached'}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-head"><h2>🎯 Daily Challenge</h2></div>
      <div class="hscroll">
        <div class="comic-card" style="width:100%;max-width:320px" onclick="openReader('${daily.id}')">
          <div class="cover halftone">${buildCover(daily.cover.scene, daily.cover.role,{sky:daily.cover.sky})}
            <span class="diff-badge">${dailyDoneToday? '✅ Done today':'🎯 Today'}</span>
          </div>
          <div class="body">
            <div class="cat">${daily.category}</div>
            <h3>${daily.title}</h3>
            <div class="meta"><span>⏱ ${daily.readTime} min</span><span>⚡ +${Math.round(daily.xp*0.5)} bonus XP</span></div>
          </div>
        </div>
      </div>
    </div>

    ${continueList.length? `
    <div class="section">
      <div class="section-head"><h2>▶️ Continue Reading</h2></div>
      <div class="hscroll">${continueList.map(comicCard).join('')}</div>
    </div>`:''}

    <div class="section">
      <div class="section-head"><h2>🆕 Recommended Comics</h2></div>
      <div class="hscroll">${STORIES.slice(0,6).map(comicCard).join('')}</div>
    </div>

    <div class="section">
      <div class="section-head"><h2>🏗️ Categories</h2></div>
      <div class="chip-row">${CATEGORIES.map(c=>`<div class="chip" onclick="goLibraryCategory('${c}')">${c}</div>`).join('')}</div>
    </div>

    ${favList.length? `
    <div class="section">
      <div class="section-head"><h2>❤️ Favorites</h2></div>
      <div class="hscroll">${favList.map(comicCard).join('')}</div>
    </div>`:''}

    ${recentList.length? `
    <div class="section">
      <div class="section-head"><h2>🕓 Recently Read</h2></div>
      <div class="hscroll">${recentList.slice(0,8).map(comicCard).join('')}</div>
    </div>`:''}

    <div class="section" style="padding-bottom:24px;">
      <button class="btn primary wide" onclick="openRandom()">🎲 Surprise Me — Random Comic</button>
    </div>
  `;
}

function goLibraryCategory(cat){
  showView("library");
  setTimeout(()=>{
    document.getElementById("search-input").value="";
    activeCategory = cat;
    renderLibrary();
  },0);
}

function openRandom(){
  const s = STORIES[Math.floor(Math.random()*STORIES.length)];
  openReader(s.id);
}

/* ============================================================
   LIBRARY VIEW
   ============================================================ */
let activeCategory = "All";
let activeDifficulty = "All";

function renderLibrary(){
  const el = document.getElementById("view-library");
  el.innerHTML = `
    <div class="page-hero"><h1>Comic Library</h1><p>Search, filter, and dive into any engineering story.</p></div>
    <div class="searchbar-wrap">
      <div class="searchbar">
        <span>🔎</span>
        <input id="search-input" placeholder="Search comics, topics, roles..." oninput="renderLibraryGrid()"/>
      </div>
    </div>
    <div class="chip-row" id="cat-chips"></div>
    <div class="chip-row" id="diff-chips"></div>
    <div id="library-grid"></div>
  `;
  const catChips = ["All",...CATEGORIES];
  document.getElementById("cat-chips").innerHTML = catChips.map(c=>
    `<div class="chip ${activeCategory===c?'active':''}" onclick="setCategory('${c.replace(/'/g,"\\'")}')">${c}</div>`).join('');
  const diffs = ["All","Beginner","Intermediate","Professional"];
  document.getElementById("diff-chips").innerHTML = diffs.map(d=>
    `<div class="chip ${activeDifficulty===d?'active':''}" onclick="setDifficulty('${d}')">${d}</div>`).join('');
  renderLibraryGrid();
}
function setCategory(c){ activeCategory=c; renderLibrary(); }
function setDifficulty(d){ activeDifficulty=d; renderLibrary(); }

function renderLibraryGrid(){
  const q = (document.getElementById("search-input")?.value||"").toLowerCase().trim();
  let list = STORIES.filter(s=>{
    const matchCat = activeCategory==="All" || s.category===activeCategory;
    const matchDiff = activeDifficulty==="All" || s.difficulty===activeDifficulty;
    const matchSearch = !q || (s.title+s.category+s.description).toLowerCase().includes(q);
    return matchCat && matchDiff && matchSearch;
  });
  const grid = document.getElementById("library-grid");
  grid.innerHTML = list.length ? `<div class="card-grid">${list.map(comicCard).join('')}</div>`
                                : `<div class="empty-row">No comics match your search yet. Try another keyword or category 🔍</div>`;
}

/* ============================================================
   PROFILE VIEW
   ============================================================ */
function renderProfile(){
  const el = document.getElementById("view-profile");
  const rank = getRank(STATE.xp);
  const completedCount = Object.keys(STATE.completed).length;
  const perfectCount = Object.values(STATE.completed).filter(c=>c.stars>=5).length;
  el.innerHTML = `
    <div class="page-hero"><h1>Your Profile</h1><p>Track your growth as an Industry Ready Engineer.</p></div>
    <div class="rank-banner">
      <div class="emoji">${rank.emoji}</div>
      <div style="flex:1"><h3>${rank.title}</h3><p>${STATE.xp} total XP</p></div>
    </div>
    <div class="dash-grid" style="margin-top:14px;">
      <div class="stat-card"><div class="big">${completedCount}</div><div class="lbl">Comics Done</div></div>
      <div class="stat-card"><div class="big">${perfectCount}</div><div class="lbl">5★ Endings</div></div>
      <div class="stat-card"><div class="big">🔥${STATE.streak}</div><div class="lbl">Day Streak</div></div>
    </div>
    <div class="section">
      <div class="section-head"><h2>🏅 Achievements</h2></div>
      <div class="badge-row">
        ${BADGES.map(b=>`
          <div class="badge ${STATE.badgesEarned.includes(b.id)?'earned':''}">
            <div class="ic">${b.ic}</div><div class="lbl">${b.label}</div>
          </div>`).join('')}
      </div>
    </div>
    ${renderCertificatesSection()}
    ${renderLeaderboardSection()}
    <div class="section">
      <div class="section-head"><h2>📊 Completion by Category</h2></div>
      <div style="padding:0 16px; display:flex; flex-direction:column; gap:10px;">
        ${CATEGORIES.map(cat=>{
          const total = STORIES.filter(s=>s.category===cat).length;
          const done = STORIES.filter(s=>s.category===cat && STATE.completed[s.id]).length;
          const pct = total? Math.round(done/total*100):0;
          return `<div class="summary-item"><h4>${cat}</h4>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            <p style="margin-top:6px;">${done}/${total} comics completed</p></div>`;
        }).join('')}
      </div>
    </div>
    <div class="section" style="padding-bottom:30px;">
      <button class="btn ghost wide" onclick="resetProgress()">↺ Reset All Progress</button>
    </div>
  `;
}
function renderCertificatesSection(){
  const certs = Object.entries(STATE.completed)
    .filter(([id,c])=>c.stars>=4)
    .map(([id,c])=>({story:STORIES.find(s=>s.id===id), c}))
    .filter(x=>x.story);
  if(!certs.length) return '';
  return `
    <div class="section">
      <div class="section-head"><h2>🎓 Certificates</h2></div>
      <div style="padding:0 16px; display:flex; flex-direction:column; gap:10px;">
        ${certs.map(({story,c})=>`
          <div class="cert-card">
            <div class="cert-ribbon">${"⭐".repeat(c.stars)}</div>
            <h4>Certificate of Excellence</h4>
            <p><strong>${story.title}</strong> — ${story.category}</p>
            <p class="cert-sub">Awarded for achieving "${c.title}"</p>
            <button class="btn primary" style="margin-top:8px;" onclick="printCertificate('${story.id}')">🖨️ Print / Save Certificate</button>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function printCertificate(id){
  const story = STORIES.find(s=>s.id===id);
  const c = STATE.completed[id];
  if(!story||!c) return;
  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>Certificate — ${story.title}</title>
    <style>
      body{font-family:'Baloo 2','Comic Sans MS',cursive; text-align:center; padding:60px; background:#f4f6f9;}
      .card{border:6px solid #10151d; border-radius:24px; padding:50px; max-width:640px; margin:0 auto; background:#fff;}
      h1{color:#1c4b82; font-size:34px; margin-bottom:6px;}
      h2{color:#f5941f; font-size:22px;}
      .stars{font-size:30px; margin:14px 0;}
      p{font-size:16px; color:#333;}
      .brand{font-weight:800; margin-top:30px; color:#5b6675; font-size:13px;}
    </style></head>
    <body>
      <div class="card">
        <h1>🏗️ Certificate of Excellence</h1>
        <h2>${story.title}</h2>
        <div class="stars">${"⭐".repeat(c.stars)}</div>
        <p>This certifies that an Industry Ready Engineer successfully completed this scenario with the outcome:</p>
        <p><strong>${c.title}</strong></p>
        <p>Category: ${story.category}</p>
        <div class="brand">IndustrCons Engineering Comics · IRE-3</div>
      </div>
      <script>window.print();</script>
    </body></html>
  `);
  w.document.close();
}

function renderLeaderboardSection(){
  const seedNames = ["Aylin K.","Rashad M.","Elvin T.","Nigar S.","Kamran V.","Leyla R.","Tural H.","Sabina Q."];
  const day = todayStr();
  const npcs = seedNames.map((name,i)=>{
    const seed = hashCode(day+name);
    const xp = 80 + Math.abs(seed % 900) + i*23;
    return {name, xp};
  });
  const all = [...npcs, {name:"You", xp:STATE.xp, isYou:true}].sort((a,b)=>b.xp-a.xp);
  return `
    <div class="section">
      <div class="section-head"><h2>🏆 Your Site Crew Leaderboard</h2></div>
      <p style="padding:0 16px; margin:-4px 0 10px; font-size:11.5px; color:var(--text-soft);">A local, on-device comparison to keep you motivated — not a live global ranking.</p>
      <div style="padding:0 16px; display:flex; flex-direction:column; gap:8px;">
        ${all.map((p,i)=>`
          <div class="lb-row ${p.isYou?'lb-you':''}">
            <span class="lb-rank">#${i+1}</span>
            <span class="lb-name">${p.isYou?'🧑‍🚀 ':''}${p.name}</span>
            <span class="lb-xp">${p.xp} XP</span>
          </div>
        `).join('')}
      </div>
    </div>`;
}

function resetProgress(){
  if(!confirm("This clears all XP, badges, and progress on this device. Continue?")) return;
  const theme=STATE.theme, sound=STATE.sound;
  STATE = defaultState(); STATE.theme=theme; STATE.sound=sound;
  saveState(); renderProfile(); toast("Progress reset");
}

/* ============================================================
   READER ENGINE
   ============================================================ */
let readerStory=null, readerNodeId=null, readerVisited=[];

function openReader(id){
  readerStory = STORIES.find(s=>s.id===id);
  if(!readerStory) return;
  readerNodeId = readerStory.start;
  readerVisited = [readerNodeId];
  if(!STATE.recent.includes(id)){ STATE.recent.unshift(id); STATE.recent = STATE.recent.slice(0,12); }
  else{ STATE.recent = [id, ...STATE.recent.filter(x=>x!==id)]; }
  if(!STATE.everOpened) STATE.everOpened=[];
  if(!STATE.everOpened.includes(id)) STATE.everOpened.push(id);
  saveState();
  document.getElementById("reader").classList.add("open");
  document.getElementById("reader-title").textContent = readerStory.title;
  updateSEOForStory(readerStory);
  renderReaderNode();
  sfx.page();
}
function closeReader(){
  document.getElementById("reader").classList.remove("open");
  resetSEODefault();
  renderHome(); renderLibrary();
}

function estimateProgress(){
  return Math.min(95, readerVisited.length * 22);
}

function renderReaderNode(){
  const node = readerStory.nodes[readerNodeId];
  const body = document.getElementById("reader-body");
  document.getElementById("reader-progress").style.width = (node.ending? 100 : estimateProgress())+"%";

  if(node.ending){
    renderEnding(node);
    return;
  }

  const panelSvg = buildPanel(node.scene, node.roles, {sky:node.sky||"day", shoutIndex: node.dialogue?.length? Math.floor(Math.random()*node.roles.length):null});
  const bubbles = (node.dialogue||[]).map((d,i)=>`
    <div class="bubble ${d.side}" style="animation-delay:${i*0.18}s"><span class="speaker">${d.who}</span>${d.text}</div>
  `).join('');

  let footer = "";
  if(node.decision){
    footer = `
      <div class="panel-wrap">
        <div class="quiz-box" style="margin-top:14px;">
          <h4>🤔 ${node.decision.question}</h4>
          <div class="choice-stack">
            ${node.decision.options.map((o,i)=>`
              <button class="choice-btn ${o.type==='good'?'opt-yes':'opt-no'}" onclick="pickChoice(${i})">
                <span class="dot"></span>${o.label}
              </button>`).join('')}
          </div>
        </div>
      </div>`;
  }

  body.innerHTML = `
    <div class="panel-wrap">
      <div class="comic-panel halftone">${panelSvg}
        <div class="learning-tag">🎓 ${node.learning}</div>
      </div>
      <div class="bubbles">${bubbles}</div>
    </div>
    ${footer}
  `;

  const navEl = document.getElementById("reader-nav");
  if(node.decision){
    navEl.innerHTML = `<button class="btn ghost wide" onclick="closeReader()">✕ Exit Story</button>`;
  } else {
    navEl.innerHTML = `
      <button class="btn ghost" onclick="closeReader()">✕ Exit</button>
      <button class="btn primary" onclick="advanceReader()">Continue ▶</button>
    `;
  }
}

function advanceReader(){
  const node = readerStory.nodes[readerNodeId];
  if(node.next){
    readerNodeId = node.next;
    readerVisited.push(readerNodeId);
    sfx.page();
    renderReaderNode();
    document.getElementById("reader-body").scrollTo({top:0,behavior:"smooth"});
  }
}

function pickChoice(i){
  const node = readerStory.nodes[readerNodeId];
  const opt = node.decision.options[i];
  opt.type==="good" ? sfx.good() : sfx.bad();
  readerNodeId = opt.next;
  readerVisited.push(readerNodeId);
  renderReaderNode();
  document.getElementById("reader-body").scrollTo({top:0,behavior:"smooth"});
}

function endingColor(type){
  const map = { quality:"#2fae66", safety:"#2fae66", budget:"#2fae66",
    "client-satisfaction":"#f9b233", "project-delay":"#f5941f",
    "quality-failure":"#e5484d", "safety-incident":"#e5484d",
    "contract-problem":"#e5484d", "budget-problem":"#e5484d" };
  return map[type] || "#10151d";
}

function renderEnding(node){
  const e = node.ending;
  bumpStreak();
  const isDaily = readerStory.id === dailyChallenge().id;
  const alreadyCompleted = !!STATE.completed[readerStory.id];
  const rankBefore = getRank(STATE.xp);
  let gainedXp = 0;
  if(!alreadyCompleted){
    gainedXp = e.xp;
    if(isDaily && STATE.dailyDoneDay !== todayStr()){ gainedXp += Math.round(readerStory.xp*0.5); STATE.dailyDoneDay = todayStr(); }
    STATE.xp += gainedXp;
  }
  const rankAfter = getRank(STATE.xp);
  const rankedUp = rankAfter.title !== rankBefore.title;
  STATE.completed[readerStory.id] = { type:e.type, stars:e.stars, title:e.title };
  const newBadges = checkBadges();
  saveState();

  const stars = "⭐".repeat(e.stars)+"☆".repeat(5-e.stars);
  const panelSvg = buildPanel(node.scene||readerStory.cover.scene, node.roles||[readerStory.cover.role], {sky:"day"});

  document.getElementById("reader-body").innerHTML = `
    <div class="panel-wrap">
      <div class="comic-panel halftone" style="max-height:210px; overflow:hidden;">${panelSvg}</div>
    </div>
    <div class="ending-card" style="border-color:${endingColor(e.type)}">
      <div class="stars">${stars}</div>
      <h2>${e.title}</h2>
      ${gainedXp>0 ? `<div class="xp-gain">+${gainedXp} XP</div>` : `<div class="xp-gain" style="opacity:.7">Already completed — no new XP</div>`}
    </div>
    <div class="summary-block">
      <div class="summary-item"><h4>What happened</h4><p>${e.what}</p></div>
      <div class="summary-item"><h4>✅ What was correct</h4><p>${e.correct}</p></div>
      <div class="summary-item"><h4>⚠️ What went wrong</h4><p>${e.wrong}</p></div>
      <div class="summary-item"><h4>💡 Engineering tip</h4><p>${e.tip}</p></div>
      <div class="summary-item"><h4>🚧 Common mistakes</h4><p>${e.mistakes}</p></div>
      <div class="summary-item"><h4>🏗️ Real site practice</h4><p>${e.practice}</p></div>
    </div>
    <div class="quiz-box" id="quiz-box">
      <h4>🧠 Mini Quiz: ${e.quiz.q}</h4>
      ${e.quiz.options.map((o,i)=>`<button class="quiz-opt" onclick="answerQuiz(${i},${e.quiz.answer})">${o}</button>`).join('')}
      <div class="quiz-feedback" id="quiz-feedback"></div>
    </div>
    ${renderLearnMoreBlock()}
  `;
  document.getElementById("reader-nav").innerHTML = `
    <button class="btn ghost" onclick="closeReader()">🏠 Home</button>
    <button class="btn primary" onclick="replayStory()">🔁 Replay Story</button>
  `;

  if(e.stars>=4){ fireConfetti(); }
  if(rankedUp){ setTimeout(()=>{ toast("🎖️ Ranked up: "+rankAfter.emoji+" "+rankAfter.title); fireConfetti(); }, 900); }
  if(newBadges.length){ setTimeout(()=>toast("🏅 New badge: "+newBadges[0].label), rankedUp?1900:700); }
}

function answerQuiz(i, correctIdx){
  const box = document.getElementById("quiz-box");
  const btns = box.querySelectorAll(".quiz-opt");
  btns.forEach((b,idx)=>{
    b.disabled = true;
    if(idx===correctIdx) b.classList.add("correct");
    else if(idx===i) b.classList.add("wrong");
  });
  const fb = document.getElementById("quiz-feedback");
  if(i===correctIdx){ fb.textContent="✅ Correct! Great engineering instinct."; sfx.xp(); }
  else{ fb.textContent="❌ Not quite — the highlighted answer is correct. Review the tip above!"; sfx.bad(); }
}

function renderLearnMoreBlock(){
  return `
    <div class="learnmore-box">
      <h4>📚 Learn More</h4>
      <p class="learnmore-sub">Keep building your site knowledge with the rest of the IndustrCons IRE-3 toolkit.</p>
      <div class="learnmore-links">
        <a class="learnmore-link" href="https://industrconsestimator.netlify.app/" target="_blank" rel="noopener noreferrer">
          <span class="lm-ic">🧮</span>
          <span class="lm-text"><strong>Related Knowledge</strong><small>IndustrCons Estimator</small></span>
          <span class="lm-arrow">↗</span>
        </a>
        <a class="learnmore-link" href="https://industrconsdocs.netlify.app/" target="_blank" rel="noopener noreferrer">
          <span class="lm-ic">📄</span>
          <span class="lm-text"><strong>Related Documents</strong><small>IndustrCons Docs</small></span>
          <span class="lm-arrow">↗</span>
        </a>
        <a class="learnmore-link" href="https://industrcons-ai.vercel.app/" target="_blank" rel="noopener noreferrer">
          <span class="lm-ic">🤖</span>
          <span class="lm-text"><strong>Ask IndustrCons AI</strong><small>Get a straight answer, fast</small></span>
          <span class="lm-arrow">↗</span>
        </a>
      </div>
    </div>
  `;
}

function replayStory(){
  openReader(readerStory.id);
}

/* ============================================================
   THEME + SOUND TOGGLES
   ============================================================ */
function applyTheme(){
  document.documentElement.setAttribute("data-theme", STATE.theme);
  document.getElementById("theme-toggle").textContent = STATE.theme==="dark" ? "☀️" : "🌙";
}
function toggleTheme(){
  STATE.theme = STATE.theme==="dark" ? "light" : "dark";
  saveState(); applyTheme(); sfx.tap();
}
function applySoundIcon(){
  document.getElementById("sound-toggle").textContent = STATE.sound ? "🔊" : "🔇";
}
function toggleSound(){
  STATE.sound = !STATE.sound;
  saveState(); applySoundIcon();
  if(STATE.sound) sfx.tap();
}

/* ============================================================
   INIT
   ============================================================ */
function updateXpPill(){
  document.getElementById("xp-pill-val").textContent = STATE.xp + " XP";
}

document.addEventListener("DOMContentLoaded", ()=>{
  applyTheme();
  applySoundIcon();
  updateXpPill();
  injectComicCatalogSchema();
  showView("home");

  document.querySelectorAll(".bottom-nav button").forEach(b=>{
    b.addEventListener("click", ()=>{ sfx.tap(); showView(b.dataset.view); });
  });
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document.getElementById("sound-toggle").addEventListener("click", toggleSound);
  document.getElementById("random-btn").addEventListener("click", ()=>{ sfx.tap(); openRandom(); });

  setInterval(updateXpPill, 800);
});
