/* ============================================================
   IndustrCons — Original SVG Comic Illustration Engine
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

// background layer generators, each returns an svg fragment string (no outer <svg>)
const SCENES = {
  site: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="230" width="600" height="130" fill="#c9d3de"/>
    <polygon points="0,235 120,150 210,235" fill="#9aa7b8"/>
    <polygon points="180,235 330,110 470,235" fill="#8593a6"/>
    <rect x="60" y="150" width="14" height="90" fill="#5b6675"/>
    <rect x="46" y="130" width="120" height="10" fill="#5b6675"/>
    <rect x="150" y="30" width="10" height="205" fill="#e5484d"/>
    <rect x="40" y="30" width="120" height="8" fill="#e5484d"/>
    <circle cx="150" cy="30" r="7" fill="#f9b233"/>
    <g fill="#f9b233" opacity=".9">
      <rect x="230" y="255" width="60" height="6"/><rect x="230" y="266" width="60" height="6"/>
    </g>
    <rect x="500" y="255" width="8" height="90" fill="#8a94a3"/>
    <rect x="470" y="245" width="70" height="10" fill="#e5484d"/>
  `,
  bridge: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="270" width="600" height="90" fill="#7fa6c9"/>
    <rect y="255" width="600" height="18" fill="#5b6675"/>
    <polygon points="0,255 60,120 120,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="120,255 180,90 240,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="240,255 300,120 360,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="360,255 420,90 480,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <polygon points="480,255 540,140 600,255" fill="none" stroke="#1c4b82" stroke-width="10"/>
    <rect x="0" y="248" width="600" height="10" fill="#f9b233"/>
  `,
  road: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="230" width="600" height="130" fill="#9aa7b8"/>
    <polygon points="0,360 260,230 340,230 600,360" fill="#5b6675"/>
    <g fill="#f9b233"><rect x="270" y="290" width="30" height="10"/><rect x="330" y="310" width="34" height="10"/><rect x="400" y="335" width="40" height="12"/></g>
    <circle cx="90" cy="70" r="26" fill="#f9b233" opacity=".8"/>
  `,
  building: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="250" width="600" height="110" fill="#c9d3de"/>
    <rect x="140" y="40" width="180" height="220" fill="#8593a6"/>
    <rect x="330" y="90" width="120" height="170" fill="#9aa7b8"/>
    ${Array.from({length:24}).map((_,i)=>`<rect x="${150+ (i%6)*28}" y="${55+Math.floor(i/6)*40}" width="18" height="24" fill="#dfe9f5"/>`).join('')}
    <rect x="60" y="150" width="12" height="110" fill="#5b6675"/>
    <rect x="30" y="140" width="90" height="8" fill="#e5484d"/>
  `,
  factory: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="250" width="600" height="110" fill="#c9d3de"/>
    <rect x="80" y="150" width="420" height="110" fill="#8a94a3"/>
    <polygon points="80,150 200,90 320,150" fill="#5b6675"/>
    <rect x="360" y="60" width="26" height="190" fill="#8a94a3"/>
    <ellipse cx="373" cy="55" rx="16" ry="8" fill="#c9d3de" opacity=".8"/>
    <rect x="150" y="200" width="30" height="60" fill="#f9b233"/>
  `,
  port: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="270" width="600" height="90" fill="#3d6f96"/>
    <rect y="255" width="600" height="18" fill="#5b6675"/>
    <rect x="80" y="120" width="16" height="140" fill="#f9b233"/>
    <polygon points="88,120 200,60 88,60" fill="#f9b233"/>
    <rect x="380" y="140" width="16" height="120" fill="#e5484d"/>
    <polygon points="388,140 500,90 388,90" fill="#e5484d"/>
    <rect x="150" y="230" width="60" height="30" fill="#2f5fa0"/>
    <rect x="220" y="225" width="60" height="35" fill="#f5941f"/>
  `,
  railway: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="260" width="600" height="100" fill="#9aa7b8"/>
    <rect y="290" width="600" height="10" fill="#5b6675"/>
    <rect y="310" width="600" height="10" fill="#5b6675"/>
    ${Array.from({length:14}).map((_,i)=>`<rect x="${i*44}" y="285" width="26" height="30" fill="#8a5a2b"/>`).join('')}
    <rect x="60" y="150" width="10" height="140" fill="#5b6675"/>
  `,
  airport: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="260" width="600" height="100" fill="#c9d3de"/>
    <polygon points="40,260 260,260 210,150 90,150" fill="#dfe9f5" stroke="#5b6675" stroke-width="4"/>
    <rect x="300" y="90" width="18" height="170" fill="#5b6675"/>
    <rect x="280" y="70" width="58" height="26" fill="#1c4b82"/>
  `,
  plant: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="250" width="600" height="110" fill="#c9d3de"/>
    <rect x="120" y="120" width="70" height="140" fill="#8a94a3"/>
    <rect x="210" y="90" width="70" height="170" fill="#9aa7b8"/>
    <rect x="300" y="140" width="70" height="120" fill="#8a94a3"/>
    <circle cx="155" cy="110" r="16" fill="#5b6675"/>
    <circle cx="245" cy="80" r="16" fill="#5b6675"/>
  `,
  lab: (sky)=>`
    <rect width="600" height="360" fill="#eef2f7"/>
    <rect y="250" width="600" height="110" fill="#dfe9f5"/>
    <rect x="60" y="180" width="480" height="16" fill="#8a94a3"/>
    <rect x="90" y="140" width="30" height="40" fill="#2f5fa0" opacity=".7"/>
    <rect x="140" y="130" width="24" height="50" fill="#f5941f" opacity=".7"/>
    <rect x="190" y="150" width="26" height="30" fill="#2fae66" opacity=".7"/>
    <rect x="400" y="120" width="16" height="60" fill="#5b6675"/>
  `,
  office: (sky)=>`
    <rect width="600" height="360" fill="#eef2f7"/>
    <rect y="250" width="600" height="110" fill="#dfe9f5"/>
    <rect x="80" y="170" width="200" height="80" fill="#8a94a3"/>
    <rect x="330" y="60" width="130" height="190" fill="#c9d3de"/>
    <rect x="100" y="60" width="90" height="90" fill="#dfe9f5" stroke="#5b6675" stroke-width="4"/>
  `,
  meeting: (sky)=>`
    <rect width="600" height="360" fill="#eef2f7"/>
    <rect y="250" width="600" height="110" fill="#dfe9f5"/>
    <ellipse cx="300" cy="230" rx="180" ry="30" fill="#8a5a2b"/>
    <rect x="260" y="60" width="90" height="90" fill="#dfe9f5" stroke="#5b6675" stroke-width="4"/>
  `,
  inspection: (sky)=>`
    <rect width="600" height="360" fill="${sky[0]}"/>
    <rect y="240" width="600" height="120" fill="#c9d3de"/>
    <rect x="150" y="150" width="300" height="90" fill="#9aa7b8"/>
    <rect x="150" y="240" width="300" height="10" fill="#5b6675"/>
    <rect x="270" y="90" width="10" height="150" fill="#e5484d"/>
  `,
};

const SKY = {
  day:["#bcdcf2"], sunset:["#f3c98a"], overcast:["#d7dee6"], dusk:["#9fb3d1"]
};

function charFigure(role, x, opts={}){
  const r = ROLES[role] || ROLES.site_engineer;
  const helmet = r.helmet || "#c9d3de";
  const vest = r.vest || "#8a94a3";
  const shout = opts.shout;
  return `
    <g transform="translate(${x},0)">
      <ellipse cx="0" cy="248" rx="34" ry="10" fill="rgba(16,21,29,.18)"/>
      <circle cx="0" cy="150" r="46" fill="${helmet}" opacity=".18"/>
      <rect x="-24" y="150" width="48" height="80" rx="14" fill="${vest}" stroke="#10151d" stroke-width="3"/>
      <rect x="-24" y="150" width="48" height="18" fill="#f5f5f5" opacity=".85"/>
      <circle cx="0" cy="128" r="26" fill="#ffdcb0" stroke="#10151d" stroke-width="3"/>
      <path d="M -26 118 a 26 22 0 0 1 52 0 z" fill="${helmet}" stroke="#10151d" stroke-width="3"/>
      <rect x="-27" y="112" width="54" height="8" rx="4" fill="${helmet}" stroke="#10151d" stroke-width="2"/>
      <text x="0" y="240" text-anchor="middle" font-size="30">${r.emoji}</text>
      ${shout?`<circle cx="30" cy="95" r="16" fill="#fff" stroke="#10151d" stroke-width="3"/><text x="30" y="101" text-anchor="middle" font-size="18">!</text>`:''}
    </g>
  `;
}

/**
 * Build a full comic panel SVG.
 * @param {string} sceneKey - key in SCENES
 * @param {string[]} roleKeys - array of role keys to render (max 2 shown big)
 * @param {object} opts - {sky:'day'|'sunset'|'overcast'|'dusk', shoutIndex:0}
 */
function buildPanel(sceneKey, roleKeys=['site_engineer'], opts={}){
  const sky = SKY[opts.sky || 'day'];
  const bgFn = SCENES[sceneKey] || SCENES.site;
  const positions = roleKeys.length===1 ? [300] : roleKeys.length===2 ? [220,380] : [150,300,450];
  const figures = roleKeys.map((rk,i)=>charFigure(rk, positions[i], {shout:opts.shoutIndex===i})).join('');
  return `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
    ${bgFn(sky)}
    ${figures}
  </svg>`;
}

// Small cover thumbnail for cards — reuses same engine, no character (faster) or one character
function buildCover(sceneKey, roleKey, opts={}){
  return buildPanel(sceneKey, roleKey?[roleKey]:[], {sky:opts.sky||'day'});
}
