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

// pose overlays drawn relative to a character's local origin
function poseOverlay(pose){
  switch(pose){
    case "point": return `<line x1="0" y1="175" x2="46" y2="150" stroke="#ffdcb0" stroke-width="9" stroke-linecap="round"/>`;
    case "thumbsUp": return `<circle cx="26" cy="182" r="9" fill="#ffdcb0" stroke="#10151d" stroke-width="2"/>`;
    case "thumbsDown": return `<circle cx="26" cy="210" r="9" fill="#ffdcb0" stroke="#10151d" stroke-width="2"/>`;
    case "clipboard": return `<rect x="16" y="168" width="20" height="26" rx="2" fill="#fff" stroke="#10151d" stroke-width="2"/>`;
    default: return '';
  }
}

function charFigure(role, x, opts={}){
  const r = ROLES[role] || ROLES.site_engineer;
  const helmet = r.helmet || "#c9d3de";
  const vest = r.vest || "#8a94a3";
  const shout = opts.shout;
  return `
    <g transform="translate(${x},0)">
      <ellipse cx="0" cy="248" rx="34" ry="10" fill="rgba(16,21,29,.18)"/>
      <circle cx="0" cy="150" r="46" fill="${helmet}" opacity=".16"/>
      <rect x="-24" y="150" width="48" height="80" rx="14" fill="${vest}" stroke="#10151d" stroke-width="3"/>
      <rect x="-24" y="150" width="48" height="18" fill="#f5f5f5" opacity=".85"/>
      <rect x="-24" y="150" width="10" height="80" fill="#ffffff" opacity=".35"/>
      <circle cx="0" cy="128" r="26" fill="#ffdcb0" stroke="#10151d" stroke-width="3"/>
      <path d="M -26 118 a 26 22 0 0 1 52 0 z" fill="${helmet}" stroke="#10151d" stroke-width="3"/>
      <rect x="-27" y="112" width="54" height="8" rx="4" fill="${helmet}" stroke="#10151d" stroke-width="2"/>
      ${poseOverlay(opts.pose)}
      <text x="0" y="240" text-anchor="middle" font-size="30">${r.emoji}</text>
      ${shout?`<circle cx="32" cy="92" r="17" fill="#fff" stroke="#10151d" stroke-width="3"/><text x="32" y="99" text-anchor="middle" font-size="19" font-weight="bold">!</text>`:''}
    </g>
  `;
}

/**
 * Build a full comic panel SVG.
 * @param {string} sceneKey - key in SCENES
 * @param {string[]} roleKeys - array of role keys to render
 * @param {object} opts - {sky, weather:'rain'|'wind'|null, shoutIndex, poses:[...], impact:bool}
 */
function buildPanel(sceneKey, roleKeys=['site_engineer'], opts={}){
  __svgIdCounter++;
  const uid = __svgIdCounter;
  const bgFn = SCENES[sceneKey] || SCENES.site;
  const positions = roleKeys.length===1 ? [300] : roleKeys.length===2 ? [220,380] : [150,300,450];
  const poses = opts.poses || [];
  const figures = roleKeys.map((rk,i)=>charFigure(rk, positions[i], {shout:opts.shoutIndex===i, pose:poses[i]})).join('');
  const impactBurst = opts.impact ? `
    <g opacity=".5" stroke="#fff" stroke-width="4">
      ${Array.from({length:10}).map((_,i)=>{
        const ang = i*36 * Math.PI/180, cx=500, cy=70;
        const x2 = cx+Math.cos(ang)*36, y2=cy+Math.sin(ang)*36;
        const x1 = cx+Math.cos(ang)*18, y1=cy+Math.sin(ang)*18;
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      }).join('')}
    </g>` : '';
  return `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
    ${skyLayer(uid, opts.sky || 'day', opts.weather)}
    ${bgFn()}
    ${figures}
    ${impactBurst}
  </svg>`;
}

// Small cover thumbnail for cards — reuses same engine
function buildCover(sceneKey, roleKey, opts={}){
  return buildPanel(sceneKey, roleKey?[roleKey]:[], {sky:opts.sky||'day', weather:opts.weather});
}
