/* ============================================================
   IndustrCons — Original SVG Comic Illustration Engine v2
   Every scene is generated as vector art at render time so the
   whole app stays a handful of KB and works fully offline.
   ============================================================ */

const ROLES = {
  site_engineer:   { name:"Site Engineer",        emoji:"👷", helmet:"#f9b233", vest:"#f5941f" },
  project_manager: { name:"Project Manager",      emoji:"🧑‍💼", helmet:"#1c4b82", vest:"#2f5fa0" },
  qa_engineer:     { name:"QA/QC Engineer",       emoji:"🔍", helmet:"#2fae66", vest:"#1c4b82" },
  planning_eng:    { name:"Planning Engineer",    emoji:"📅", helmet:"#f9b233", vest:"#5b6675" },
  qs:              { name:"Quantity Surveyor",    emoji:"🧮", helmet:"#8a94a3", vest:"#1c4b82" },
  surveyor:        { name:"Surveyor",             emoji:"📐", helmet:"#f9b233", vest:"#2fae66" },
  bim_engineer:    { name:"BIM Engineer",         emoji:"💻", helmet:"#1c4b82", vest:"#8a94a3" },
  hse_officer:     { name:"HSE Officer",          emoji:"🦺", helmet:"#e5484d", vest:"#f9b233" },
  concrete_insp:   { name:"Concrete Inspector",   emoji:"🧱", helmet:"#f9b233", vest:"#8a94a3" },
  formwork_eng:    { name:"Formwork Engineer",    emoji:"🪵", helmet:"#f9b233", vest:"#f5941f" },
  rebar_eng:       { name:"Rebar Engineer",       emoji:"🔩", helmet:"#f9b233", vest:"#5b6675" },
  bridge_eng:      { name:"Bridge Engineer",      emoji:"🌉", helmet:"#1c4b82", vest:"#f5941f" },
  highway_eng:     { name:"Highway Engineer",     emoji:"🛣️", helmet:"#f9b233", vest:"#e5484d" },
  geotech_eng:     { name:"Geotechnical Engineer",emoji:"🪨", helmet:"#8a94a3", vest:"#f9b233" },
  procurement_eng: { name:"Procurement Engineer", emoji:"📦", helmet:"#2f5fa0", vest:"#8a94a3" },
  mep_eng:         { name:"MEP Engineer",         emoji:"🔧", helmet:"#2fae66", vest:"#f9b233" },
  worker:          { name:"Construction Worker",  emoji:"👷‍♂️", helmet:"#f9b233", vest:"#f5941f" },
  crane_operator:  { name:"Crane Operator",       emoji:"🏗️", helmet:"#f9b233", vest:"#1c4b82" },
  client:          { name:"Client",               emoji:"🧑‍💻", helmet:null,    vest:null },
};

let __svgIdCounter = 0;

const SKY = {
  day:     { top:"#8fc7ec", bottom:"#d7ecfb", cloud:"#ffffff" },
  sunset:  { top:"#f0995a", bottom:"#f8d9a0", cloud:"#ffe6c2" },
  overcast:{ top:"#aeb9c4", bottom:"#dbe2e8", cloud:"#c7d0d8" },
  dusk:    { top:"#3d5680", bottom:"#8ca3c4", cloud:"#c2d0e4" },
  night:   { top:"#0c1830", bottom:"#26365a", cloud:"#3a4e78" },
};

function skyLayer(uid, skyKey, weather){
  const s = SKY[skyKey] || SKY.day;
  const stars = skyKey==="night" ? Array.from({length:18}).map(()=>{
    const x=(Math.random()*600).toFixed(0), y=(Math.random()*140).toFixed(0), r=(Math.random()*1.4+0.4).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(Math.random()*0.6+0.3).toFixed(2)}"/>`;
  }).join('') : '';
  const sun = (skyKey==="day"||skyKey==="sunset") ? `<circle cx="${skyKey==='sunset'?500:520}" cy="${skyKey==='sunset'?70:55}" r="30" fill="${skyKey==='sunset'?'#ffb066':'#fff3c2'}" opacity=".85"/>` : '';
  const clouds = `
    <ellipse cx="90" cy="60" rx="46" ry="16" fill="${s.cloud}" opacity=".8"/>
    <ellipse cx="125" cy="52" rx="34" ry="14" fill="${s.cloud}" opacity=".8"/>
    <ellipse cx="420" cy="40" rx="52" ry="17" fill="${s.cloud}" opacity=".7"/>
    <ellipse cx="380" cy="34" rx="30" ry="12" fill="${s.cloud}" opacity=".7"/>
  `;
  const birds = (skyKey==="day"||skyKey==="sunset") ? `
    <path d="M 250 45 q 6 -8 12 0 q 6 -8 12 0" stroke="#3a4a5c" stroke-width="2" fill="none" opacity=".55"/>
    <path d="M 275 60 q 5 -7 10 0 q 5 -7 10 0" stroke="#3a4a5c" stroke-width="2" fill="none" opacity=".45"/>
  ` : '';
  let weatherLayer = '';
  if(weather==="rain"){
    weatherLayer = `<g stroke="#7fa6cf" stroke-width="2" opacity=".55">
      ${Array.from({length:22}).map(()=>{
        const x=(Math.random()*600).toFixed(0), y=(Math.random()*300).toFixed(0);
        return `<line x1="${x}" y1="${y}" x2="${+x-8}" y2="${+y+22}"/>`;
      }).join('')}
    </g>`;
  } else if(weather==="wind"){
    weatherLayer = `<g stroke="#ffffff" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round">
      <path d="M 40 90 q 40 -14 80 0 t 80 0"/>
      <path d="M 340 140 q 40 -14 80 0 t 80 0"/>
      <path d="M 120 190 q 40 -12 80 0 t 80 0"/>
    </g>`;
  }
  return `
    <defs><linearGradient id="sky${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${s.top}"/><stop offset="1" stop-color="${s.bottom}"/>
    </linearGradient></defs>
    <rect width="600" height="360" fill="url(#sky${uid})"/>
    ${stars}${sun}${clouds}${birds}${weatherLayer}
  `;
}

// background layer generators — foreground only (sky handled separately)
const SCENES = {
  site: ()=>`
    <rect y="230" width="600" height="130" fill="#c9d3de"/>
    <polygon points="0,235 120,150 210,235" fill="#9aa7b8"/>
    <polygon points="180,235 330,110 470,235" fill="#8593a6"/>
    <rect x="60" y="150" width="14" height="90" fill="#5b6675"/>
    <rect x="46" y="130" width="120" height="10" fill="#5b6675"/>
    <rect x="150" y="30" width="10" height="205" fill="#e5484d"/>
    <rect x="40" y="30" width="120" height="8" fill="#e5484d"/>
    <circle cx="150" cy="30" r="7" fill="#f9b233"/>
    <g fill="#f9b233" opacity=".9"><rect x="230" y="255" width="60" height="6"/><rect x="230" y="266" width="60" height="6"/></g>
    <rect x="500" y="255" width="8" height="90" fill="#8a94a3"/>
    <rect x="470" y="245" width="70" height="10" fill="#e5484d"/>
    <g opacity=".5"><rect x="20" y="330" width="26" height="18" rx="3" fill="#f9b233"/><rect x="540" y="325" width="30" height="24" rx="3" fill="#8a94a3"/></g>
  `,
  bridge: ()=>`
    <rect y="270" width="600" height="90" fill="#7fa6c9"/>
    <path d="M0,285 q 40,-6 80,0 t 80,0 t 80,0 t 80,0 t 80,0 t 80,0 t 80,0" stroke="#5f8bb0" stroke-width="3" fill="none" opacity=".6"/>
    <rect y="255" width="600" height="18" fill="#5b6675"/>
    <polygon points="0,255 60,120 120,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="120,255 180,90 240,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="240,255 300,120 360,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="360,255 420,90 480,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="480,255 540,140 600,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <rect x="0" y="248" width="600" height="10" fill="#f9b233"/>
  `,
  road: ()=>`
    <rect y="230" width="600" height="130" fill="#9aa7b8"/>
    <polygon points="0,360 260,230 340,230 600,360" fill="#5b6675"/>
    <g fill="#f9b233"><rect x="270" y="290" width="30" height="10"/><rect x="330" y="310" width="34" height="10"/><rect x="400" y="335" width="40" height="12"/></g>
    <rect x="30" y="200" width="18" height="60" fill="#e5484d"/><polygon points="20,200 58,200 39,180" fill="#e5484d"/>
  `,
  building: ()=>`
    <rect y="250" width="600" height="110" fill="#c9d3de"/>
    <rect x="140" y="40" width="180" height="220" fill="#8593a6"/>
    <rect x="330" y="90" width="120" height="170" fill="#9aa7b8"/>
    ${Array.from({length:24}).map((_,i)=>`<rect x="${150+ (i%6)*28}" y="${55+Math.floor(i/6)*40}" width="18" height="24" fill="#dfe9f5"/>`).join('')}
    <rect x="60" y="150" width="12" height="110" fill="#5b6675"/>
    <rect x="30" y="140" width="90" height="8" fill="#e5484d"/>
  `,
  factory: ()=>`
    <rect y="250" width="600" height="110" fill="#c9d3de"/>
    <rect x="80" y="150" width="420" height="110" fill="#8a94a3"/>
    <polygon points="80,150 200,90 320,150" fill="#5b6675"/>
    <rect x="360" y="60" width="26" height="190" fill="#8a94a3"/>
    <ellipse cx="373" cy="52" rx="18" ry="9" fill="#c9d3de" opacity=".7"/>
    <ellipse cx="373" cy="38" rx="24" ry="10" fill="#dfe9f5" opacity=".5"/>
    <rect x="150" y="200" width="30" height="60" fill="#f9b233"/>
  `,
  port: ()=>`
    <rect y="270" width="600" height="90" fill="#3d6f96"/>
    <path d="M0,285 q30,-6 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0" stroke="#336186" stroke-width="3" fill="none" opacity=".6"/>
    <rect y="255" width="600" height="18" fill="#5b6675"/>
    <rect x="80" y="120" width="16" height="140" fill="#f9b233"/>
    <polygon points="88,120 200,60 88,60" fill="#f9b233"/>
    <rect x="380" y="140" width="16" height="120" fill="#e5484d"/>
    <polygon points="388,140 500,90 388,90" fill="#e5484d"/>
    <rect x="150" y="230" width="60" height="30" fill="#2f5fa0"/>
    <rect x="220" y="225" width="60" height="35" fill="#f5941f"/>
  `,
  railway: ()=>`
    <rect y="260" width="600" height="100" fill="#9aa7b8"/>
    <rect y="290" width="600" height="10" fill="#5b6675"/>
    <rect y="310" width="600" height="10" fill="#5b6675"/>
    ${Array.from({length:14}).map((_,i)=>`<rect x="${i*44}" y="285" width="26" height="30" fill="#8a5a2b"/>`).join('')}
    <rect x="60" y="150" width="10" height="140" fill="#5b6675"/>
  `,
  airport: ()=>`
    <rect y="260" width="600" height="100" fill="#c9d3de"/>
    <polygon points="40,260 260,260 210,150 90,150" fill="#dfe9f5" stroke="#5b6675" stroke-width="4"/>
    <rect x="300" y="90" width="18" height="170" fill="#5b6675"/>
    <rect x="280" y="70" width="58" height="26" fill="#1c4b82"/>
  `,
  plant: ()=>`
    <rect y="250" width="600" height="110" fill="#c9d3de"/>
    <rect x="120" y="120" width="70" height="140" fill="#8a94a3"/>
    <rect x="210" y="90" width="70" height="170" fill="#9aa7b8"/>
    <rect x="300" y="140" width="70" height="120" fill="#8a94a3"/>
    <circle cx="155" cy="110" r="16" fill="#5b6675"/>
    <circle cx="245" cy="80" r="16" fill="#5b6675"/>
  `,
  lab: ()=>`
    <rect width="600" height="360" fill="#eef2f7"/>
    <rect y="250" width="600" height="110" fill="#dfe9f5"/>
    <rect x="60" y="180" width="480" height="16" fill="#8a94a3"/>
    <rect x="90" y="140" width="30" height="40" fill="#2f5fa0" opacity=".7"/>
    <rect x="140" y="130" width="24" height="50" fill="#f5941f" opacity=".7"/>
    <rect x="190" y="150" width="26" height="30" fill="#2fae66" opacity=".7"/>
    <rect x="400" y="120" width="16" height="60" fill="#5b6675"/>
  `,
  office: ()=>`
    <rect width="600" height="360" fill="#eef2f7"/>
    <rect y="250" width="600" height="110" fill="#dfe9f5"/>
    <rect x="80" y="170" width="200" height="80" fill="#8a94a3"/>
    <rect x="330" y="60" width="130" height="190" fill="#c9d3de"/>
    <rect x="100" y="60" width="90" height="90" fill="#dfe9f5" stroke="#5b6675" stroke-width="4"/>
  `,
  meeting: ()=>`
    <rect width="600" height="360" fill="#eef2f7"/>
    <rect y="250" width="600" height="110" fill="#dfe9f5"/>
    <ellipse cx="300" cy="230" rx="180" ry="30" fill="#8a5a2b"/>
    <rect x="260" y="60" width="90" height="90" fill="#dfe9f5" stroke="#5b6675" stroke-width="4"/>
  `,
  inspection: ()=>`
    <rect y="240" width="600" height="120" fill="#c9d3de"/>
    <rect x="150" y="150" width="300" height="90" fill="#9aa7b8"/>
    <rect x="150" y="240" width="300" height="10" fill="#5b6675"/>
    <rect x="270" y="90" width="10" height="150" fill="#e5484d"/>
  `,
};

// ============================================================
// v3 CHARACTERS — fully drawn full-body comic engineers
// ============================================================
const SKIN = ["#ffd9b3","#f1c08f","#d9a066","#b87a4b","#8d5a36"];
const HAIR = ["#2a1b12","#4a2e1a","#1a1a1f","#6b3f1f","#8a8a90"];
const FEMALE = { qa_engineer:1, planning_eng:1, bim_engineer:1, procurement_eng:1, hse_officer:1, surveyor:0, mep_eng:1 };
function roleSeed(role){ let h=0; for(let i=0;i<role.length;i++){ h=(h*31+role.charCodeAt(i))>>>0; } return h; }

// role props drawn near the right hand (local coords, feet at y=0)
function roleProp(role){
  switch(role){
    case "qa_engineer": return `<g transform="translate(34,-72) rotate(12)"><rect x="-9" y="-12" width="18" height="24" rx="2" fill="#fff" stroke="#10151d" stroke-width="2"/><rect x="-5" y="-16" width="10" height="5" rx="1" fill="#8a94a3" stroke="#10151d" stroke-width="1.5"/><path d="M-5 -4h10M-5 1h10M-5 6h6" stroke="#2fae66" stroke-width="1.5"/></g>`;
    case "bim_engineer": return `<g transform="translate(34,-74) rotate(8)"><rect x="-14" y="-10" width="28" height="20" rx="3" fill="#0e2745" stroke="#10151d" stroke-width="2"/><rect x="-11" y="-7" width="22" height="14" rx="1.5" fill="#3a7bd5"/><path d="M-8 3l5-6 4 4 5-7 5 9" stroke="#fff" stroke-width="1.5" fill="none"/></g>`;
    case "surveyor": return `<g transform="translate(40,0)"><path d="M0 -86l-16 86M0 -86l16 86M0 -86v86" stroke="#5b6675" stroke-width="3"/><rect x="-10" y="-104" width="20" height="18" rx="3" fill="#f9b233" stroke="#10151d" stroke-width="2"/><circle cx="0" cy="-95" r="4" fill="#0e2745"/></g>`;
    case "qs": return `<g transform="translate(34,-70) rotate(10)"><rect x="-9" y="-12" width="18" height="24" rx="3" fill="#2f5fa0" stroke="#10151d" stroke-width="2"/><rect x="-6" y="-9" width="12" height="6" fill="#bfe3ff"/><g fill="#fff"><circle cx="-4" cy="2" r="1.6"/><circle cx="0" cy="2" r="1.6"/><circle cx="4" cy="2" r="1.6"/><circle cx="-4" cy="7" r="1.6"/><circle cx="0" cy="7" r="1.6"/><circle cx="4" cy="7" r="1.6"/></g></g>`;
    case "project_manager": case "procurement_eng": case "planning_eng": return `<g transform="translate(32,-70) rotate(6)"><rect x="-13" y="-10" width="26" height="20" fill="#e9f1fb" stroke="#10151d" stroke-width="2"/><path d="M-9 -4h18M-9 1h12M-9 6h16" stroke="#3a7bd5" stroke-width="1.6"/></g>`;
    case "hse_officer": return `<g transform="translate(32,-74)"><rect x="-11" y="-9" width="22" height="18" rx="3" fill="#2fae66" stroke="#10151d" stroke-width="2"/><path d="M-3 -5h6v4h4v6h-4v4h-6v-4h-4v-6h4z" transform="scale(.9) translate(0,0)" fill="#fff"/></g>`;
    case "geotech_eng": return `<g transform="translate(34,-26)"><path d="M-3 -52v52" stroke="#8a5a2b" stroke-width="4"/><path d="M-3 0l-5 10h10z" fill="#5b6675" stroke="#10151d" stroke-width="1.5"/><rect x="-9" y="-58" width="12" height="7" rx="1" fill="#f5941f" stroke="#10151d" stroke-width="1.5"/></g>`;
    case "crane_operator": return `<path d="M-20 -150q-8 10 -2 24" stroke="#10151d" stroke-width="3" fill="none"/><circle cx="-22" cy="-128" r="5" fill="#10151d"/><path d="M-22 -128q4 12 12 14" stroke="#10151d" stroke-width="2" fill="none"/>`;
    case "rebar_eng": return `<g transform="translate(36,-30)"><rect x="-3" y="-62" width="6" height="62" fill="#8a5a2b" stroke="#10151d" stroke-width="1.5" transform="rotate(10)"/><g stroke="#8a94a3" stroke-width="3"><path d="M-8 -20l24 -6M-8 -12l24 -6"/></g></g>`;
    case "formwork_eng": return `<g transform="translate(36,-20) rotate(14)"><rect x="-4" y="-36" width="8" height="36" fill="#c58b4a" stroke="#10151d" stroke-width="1.5"/><rect x="-10" y="-40" width="20" height="8" fill="#8a94a3" stroke="#10151d" stroke-width="1.5"/></g>`;
    case "concrete_insp": return `<g transform="translate(34,-8)"><path d="M-9 -26h18l-3 26h-12z" fill="#f5941f" stroke="#10151d" stroke-width="2"/><ellipse cx="0" cy="-26" rx="9" ry="3" fill="#c9d3de" stroke="#10151d" stroke-width="1.5"/></g>`;
    case "bridge_eng": case "highway_eng": return `<g transform="translate(33,-72) rotate(-8)"><path d="M-15 8l8-24 22 4-6 24z" fill="#cfe3f6" stroke="#10151d" stroke-width="2"/><path d="M-8 -2l16 3M-9 3l12 2" stroke="#1c4b82" stroke-width="1.4"/></g>`;
    case "mep_eng": return `<g transform="translate(34,-72) rotate(16)"><path d="M0 -14v26" stroke="#8a94a3" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-16" r="6" fill="none" stroke="#8a94a3" stroke-width="4"/></g>`;
    default: return '';
  }
}

function charFigure(role, x, opts={}){
  const r = ROLES[role] || ROLES.site_engineer;
  const seed = roleSeed(role);
  const skin = SKIN[seed % SKIN.length];
  const hairC = HAIR[(seed>>>3) % HAIR.length];
  const female = FEMALE[role]===1;
  const suit = role==="client";
  const helmet = r.helmet;
  const vest = r.vest || "#2b3445";
  const shirt = suit ? "#e9eef5" : "#e8edf3";
  const pants = suit ? "#1d2433" : "#2b3a55";
  const look = opts.look||0;               // -1 look left, 1 look right
  const pose = opts.pose;
  const scale = opts.scale || 1;
  const ink = "#10151d";
  const mouth = opts.shout
    ? `<ellipse cx="0" cy="-130" rx="6" ry="5.5" fill="#6b1d1d" stroke="${ink}" stroke-width="1.8"/><ellipse cx="0" cy="-128" rx="3.5" ry="2" fill="#e5707a"/>`
    : `<path d="M-6 -131q6 6 12 0" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;
  // arms
  let rightArm = `<path d="M26 -108q10 24 4 46" stroke="${shirt}" stroke-width="11" fill="none" stroke-linecap="round"/><circle cx="30" cy="-60" r="6.5" fill="${suit?skin:'#f5941f'}" stroke="${ink}" stroke-width="2"/>`;
  if(pose==="point") rightArm = `<path d="M26 -108l40 -22" stroke="${shirt}" stroke-width="11" stroke-linecap="round"/><circle cx="68" cy="-131" r="6.5" fill="#f5941f" stroke="${ink}" stroke-width="2"/><path d="M72 -133l10 -5" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
  if(pose==="thumbsUp") rightArm = `<path d="M26 -108l22 -14" stroke="${shirt}" stroke-width="11" stroke-linecap="round"/><circle cx="50" cy="-124" r="7" fill="#f5941f" stroke="${ink}" stroke-width="2"/><rect x="47" y="-136" width="5" height="10" rx="2.5" fill="#f5941f" stroke="${ink}" stroke-width="1.6"/>`;
  if(pose==="wave") rightArm = `<path d="M26 -108l26 -34" stroke="${shirt}" stroke-width="11" stroke-linecap="round"/><circle cx="54" cy="-146" r="7" fill="#f5941f" stroke="${ink}" stroke-width="2"/>`;
  const hairBack = female ? `<path d="M-20 -146q-10 24 -2 42q8 -8 6 -30z" fill="${hairC}" stroke="${ink}" stroke-width="2"/>` : '';
  const hairFront = suit || !helmet ? `<path d="M-20 -150q20 -22 40 0q-6 -8 -20 -8q-14 0 -20 8z" fill="${hairC}" stroke="${ink}" stroke-width="2"/>` : '';
  const headgear = helmet ? `
      <path d="M-24 -148a24 22 0 0 1 48 0z" fill="${helmet}" stroke="${ink}" stroke-width="2.6"/>
      <path d="M-4 -170v22M4 -170v22" stroke="rgba(0,0,0,.25)" stroke-width="2"/>
      <path d="M-27 -148h54q0 5 -5 5h-44q-5 0 -5 -5z" fill="${helmet}" stroke="${ink}" stroke-width="2.4"/>
      <path d="M-16 -160q8 -8 18 -6" stroke="rgba(255,255,255,.55)" stroke-width="3" fill="none" stroke-linecap="round"/>` : '';
  const tie = suit ? `<path d="M0 -112l5 10l-5 30l-5 -30z" fill="#c0392b" stroke="${ink}" stroke-width="1.6"/>` : '';
  const vestShape = suit
    ? `<path d="M-26 -112h52v62h-52z" fill="#2b3445" stroke="${ink}" stroke-width="2.6"/><path d="M-6 -112l6 18l6 -18z" fill="#fff" stroke="${ink}" stroke-width="1.4"/>${tie}`
    : `<path d="M-26 -112q26 -10 52 0v64h-52z" fill="${vest}" stroke="${ink}" stroke-width="2.6"/>
       <path d="M-8 -112l8 14l8 -14" fill="${shirt}" stroke="${ink}" stroke-width="1.6"/>
       <rect x="-26" y="-92" width="52" height="7" fill="#e9f2f5" opacity=".92"/><rect x="-26" y="-72" width="52" height="7" fill="#e9f2f5" opacity=".92"/>
       <path d="M-11 -108v60M11 -108v60" stroke="#e9f2f5" stroke-width="5" opacity=".9"/>`;
  const sk = 3 * (look);
  return `
    <g transform="translate(${x},300) scale(${scale})">
      <ellipse cx="0" cy="2" rx="40" ry="9" fill="rgba(10,14,22,.28)"/>
      <g class="char-idle" style="animation-delay:${((seed%7)*.35).toFixed(2)}s">
        <!-- legs -->
        <path d="M-15 -52v44" stroke="${pants}" stroke-width="15" stroke-linecap="round"/>
        <path d="M15 -52v44" stroke="${pants}" stroke-width="15" stroke-linecap="round"/>
        <path d="M-24 -6h18q4 0 4 6h-26q0 -6 4 -6z" fill="#3b2a1d" stroke="${ink}" stroke-width="2.4"/>
        <path d="M6 -6h18q4 0 4 6h-26q0 -6 4 -6z" fill="#3b2a1d" stroke="${ink}" stroke-width="2.4"/>
        <!-- left arm -->
        <path d="M-26 -108q-10 24 -4 46" stroke="${shirt}" stroke-width="11" fill="none" stroke-linecap="round"/>
        <circle cx="-30" cy="-60" r="6.5" fill="${suit?skin:'#f5941f'}" stroke="${ink}" stroke-width="2"/>
        ${hairBack}
        <!-- torso -->
        <rect x="-26" y="-116" width="52" height="68" rx="12" fill="${shirt}"/>
        ${vestShape}
        <!-- neck + head -->
        <rect x="-6" y="-122" width="12" height="12" fill="${skin}" stroke="${ink}" stroke-width="2"/>
        <circle cx="-22" cy="-138" r="4.5" fill="${skin}" stroke="${ink}" stroke-width="2"/>
        <circle cx="22" cy="-138" r="4.5" fill="${skin}" stroke="${ink}" stroke-width="2"/>
        <circle cx="0" cy="-138" r="22" fill="${skin}" stroke="${ink}" stroke-width="2.6"/>
        ${hairFront}
        <!-- face -->
        <g class="char-eyes">
          <ellipse cx="-8" cy="-140" rx="4.6" ry="5.4" fill="#fff" stroke="${ink}" stroke-width="1.6"/>
          <ellipse cx="8" cy="-140" rx="4.6" ry="5.4" fill="#fff" stroke="${ink}" stroke-width="1.6"/>
          <circle cx="${-8+sk}" cy="-139.5" r="2.3" fill="${ink}"/><circle cx="${8+sk}" cy="-139.5" r="2.3" fill="${ink}"/>
        </g>
        <path d="M-13 -148q5 -4 10 -1M3 -149q5 -3 10 1" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M0 -138q-2 5 1 6" stroke="rgba(0,0,0,.35)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        ${mouth}
        ${headgear}
        ${rightArm}
        ${roleProp(role)}
      </g>
      ${opts.shout?`<g transform="translate(40,-176)"><path d="M0 0q-4 14 10 14q16 0 14 -14q-2 -14 -16 -14q-14 2 -8 14z" fill="#fff" stroke="${ink}" stroke-width="2.6"/><text x="9" y="8" text-anchor="middle" font-size="20" font-weight="800" fill="${ink}">!</text></g>`:''}
    </g>`;
}

// head-and-shoulders portrait for the Construction Universe row
function buildPortrait(role){
  const uid = ++__svgIdCounter;
  const r = ROLES[role] || ROLES.site_engineer;
  return `<svg viewBox="-46 -182 92 112" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs><radialGradient id="pg${uid}" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="${r.helmet||'#8ab4e8'}" stop-opacity=".55"/><stop offset="1" stop-color="#0d1420" stop-opacity=".9"/></radialGradient></defs>
    <rect x="-46" y="-182" width="92" height="112" fill="url(#pg${uid})"/>
    <g transform="translate(0,300) scale(1)" style="transform:none">${charFigure(role,0,{}).replace('translate(0,300) scale(1)','translate(0,0)')}</g>
  </svg>`;
}

// foreground props + atmosphere --------------------------------------------
function foregroundProps(sceneKey){
  const indoor = ["lab","office","meeting"].includes(sceneKey);
  if(indoor) return `<rect x="0" y="332" width="600" height="28" fill="rgba(10,14,22,.25)"/>`;
  const cone = (x)=>`<g transform="translate(${x},352)"><path d="M-10 0l6 -26h8l6 26z" fill="#f5941f" stroke="#10151d" stroke-width="2"/><rect x="-5" y="-17" width="10" height="4" fill="#fff"/><rect x="-14" y="-2" width="28" height="4" rx="1.5" fill="#10151d"/></g>`;
  return `${cone(30)}${cone(572)}
    <g transform="translate(112,356)"><rect x="-30" y="-14" width="60" height="9" fill="#f9b233" stroke="#10151d" stroke-width="2"/><path d="M-26 -14l8 9M-12 -14l8 9M2 -14l8 9M16 -14l8 9" stroke="#10151d" stroke-width="2.4"/><rect x="-26" y="-5" width="4" height="9" fill="#5b6675"/><rect x="22" y="-5" width="4" height="9" fill="#5b6675"/></g>`;
}

function atmosphere(uid, mood){
  const vig = mood==="tension" ? "rgba(120,10,16,.38)" : mood==="victory" ? "rgba(255,200,80,.0)" : "rgba(5,8,14,.30)";
  const rays = mood==="victory" ? `<g opacity=".28" fill="#fff6c9">${Array.from({length:9}).map((_,i)=>`<polygon points="300,150 ${(i*80-60)},0 ${(i*80-20)},0"/>`).join('')}</g>
    <g fill="#ffd34d">${Array.from({length:14}).map(()=>`<path transform="translate(${(Math.random()*580+10).toFixed(0)},${(Math.random()*180+10).toFixed(0)}) scale(${(Math.random()*.6+.5).toFixed(2)})" d="M0 -8l2.2 5.8l6 .2l-4.8 3.8l1.8 5.8l-5.2 -3.4l-5.2 3.4l1.8 -5.8l-4.8 -3.8l6 -.2z" opacity=".9"/>`).join('')}</g>` : '';
  const impact = mood==="tension" ? `<g stroke="#fff" stroke-width="3" opacity=".55">${Array.from({length:14}).map((_,i)=>{const a=i*(360/14)*Math.PI/180;return `<line x1="${(300+Math.cos(a)*190).toFixed(0)}" y1="${(150+Math.sin(a)*120).toFixed(0)}" x2="${(300+Math.cos(a)*300).toFixed(0)}" y2="${(150+Math.sin(a)*220).toFixed(0)}"/>`;}).join('')}</g>` : '';
  return `<defs><radialGradient id="vg${uid}" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="${vig}"/></radialGradient></defs>
    ${rays}${impact}<rect width="600" height="360" fill="url(#vg${uid})"/>`;
}

/**
 * Build a full comic panel SVG.
 * opts: {sky, weather:'rain'|'wind'|null, shoutIndex, poses:[...], mood:'tension'|'victory'|null}
 */
function buildPanel(sceneKey, roleKeys=['site_engineer'], opts={}){
  __svgIdCounter++;
  const uid = __svgIdCounter;
  const bgFn = SCENES[sceneKey] || SCENES.site;
  const n = roleKeys.length;
  const positions = n===0 ? [] : n===1 ? [300] : n===2 ? [195,405] : [120,300,480];
  const scale = n>=3 ? .86 : 1;
  const poses = opts.poses || [];
  const defaultPoses = n===2 ? ["point","clipboard"] : n===3 ? ["clipboard","wave","point"] : [];
  const figures = roleKeys.map((rk,i)=>{
    const centre = 300;
    const look = n===1 ? 0 : (positions[i] < centre ? 1 : (positions[i] > centre ? -1 : 0));
    return charFigure(rk, positions[i], {shout:opts.shoutIndex===i, pose:poses[i]||defaultPoses[i], look, scale});
  }).join('');
  const mood = opts.mood || (opts.impact ? "tension" : null);
  return `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
    ${skyLayer(uid, opts.sky || 'day', opts.weather)}
    ${bgFn()}
    ${figures}
    ${foregroundProps(sceneKey)}
    ${atmosphere(uid, mood)}
  </svg>`;
}

function buildCover(sceneKey, roleKey, opts={}){
  return buildPanel(sceneKey, roleKey?[roleKey]:[], {sky:opts.sky||'day', weather:opts.weather, mood:opts.mood});
}
