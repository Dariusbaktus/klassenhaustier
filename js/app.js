'use strict';

/* ---------- Kartendefinitionen ---------- */

function chevronSVG(deg, long) {
  const inner = long
    ? '<polyline points="6,15 12,9 18,15"/><polyline points="6,9 12,3 18,9"/>'
    : '<line x1="12" y1="19" x2="12" y2="7"/><polyline points="7,11 12,6 17,11"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <g transform="rotate(${deg} 12 12)">${inner}</g></svg>`;
}

const ICONS = {
  up: chevronSVG(0, false),
  down: chevronSVG(180, false),
  left: chevronSVG(270, false),
  right: chevronSVG(90, false),
  up2: chevronSVG(0, true),
  down2: chevronSVG(180, true),
  left2: chevronSVG(270, true),
  right2: chevronSVG(90, true),
  hop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round"><path d="M4 18 Q12 4 20 18" stroke-dasharray="2.5 3.5"/>
    <circle cx="4" cy="18" r="1.6" fill="currentColor" stroke="none"/>
    <circle cx="20" cy="18" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  feed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round"><path d="M4 12a8 6 0 0 0 16 0"/><line x1="4" y1="12" x2="20" y2="12"/>
    <circle cx="9" cy="7.5" r="1.1" fill="currentColor" stroke="none"/>
    <circle cx="13.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/>
    <circle cx="17" cy="8" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  pet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="16" r="4"/><circle cx="6.5" cy="9" r="2"/>
    <circle cx="12" cy="6" r="2"/><circle cx="17.5" cy="9" r="2"/></svg>`,
  sleep: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M16 3a9 9 0 1 0 5 16 7 7 0 0 1-5-16z"/></svg>`,
  brush: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round"><rect x="8" y="3" width="8" height="8" rx="2"/>
    <line x1="12" y1="11" x2="12" y2="20"/>
    <line x1="9" y1="5.5" x2="6.5" y2="4"/><line x1="9" y1="8" x2="6.5" y2="7.5"/>
    <line x1="15" y1="5.5" x2="17.5" y2="4"/><line x1="15" y1="8" x2="17.5" y2="7.5"/></svg>`,
  trim: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/>
    <line x1="8" y1="7.5" x2="19" y2="17"/><line x1="8" y1="16.5" x2="19" y2="7"/></svg>`,
  trick: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12,3 14.6,9.6 21.5,9.9 16,14.3 17.9,21 12,17.1 6.1,21 8,14.3 2.5,9.9 9.4,9.6"/></svg>`,
};

const CARD_DEFS = {
  up: { group: 'move', label: 'Hoch' },
  down: { group: 'move', label: 'Runter' },
  left: { group: 'move', label: 'Links' },
  right: { group: 'move', label: 'Rechts' },
  up2: { group: 'move', label: '2× Hoch' },
  down2: { group: 'move', label: '2× Runter' },
  left2: { group: 'move', label: '2× Links' },
  right2: { group: 'move', label: '2× Rechts' },
  hop: { group: 'bonus', label: 'Hüpfen' },
  feed: { group: 'care', label: 'Füttern' },
  pet: { group: 'care', label: 'Streicheln' },
  sleep: { group: 'care', label: 'Schlafen' },
  brush: { group: 'care', label: 'Bürsten' },
  trim: { group: 'care', label: 'Krallen' },
  trick: { group: 'bonus', label: 'Kunststück' },
};

const CARD_SETS = {
  baby: ['up', 'down', 'left', 'right', 'feed', 'pet', 'sleep'],
  adult: ['up', 'down', 'left', 'right', 'up2', 'down2', 'left2', 'right2',
    'hop', 'feed', 'pet', 'sleep', 'brush', 'trim', 'trick'],
};

const DIRS = {
  up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
  up2: [0, -1], down2: [0, 1], left2: [-1, 0], right2: [1, 0],
};

const MISSIONS = {
  baby: [
    { text: 'Tippe unten eine Pfeil-Karte an und drücke „Los!", um einen Schritt zu gehen!',
      solution: null, validate: 'anyMove', hint: 'Wähle einen Richtungspfeil und drücke auf Los!' },
    { text: '🍽️ Siehst du den blinkenden Napf? Führe dein Tier mit den Pfeilen dorthin und tippe dann „Füttern" an!',
      solution: null, validate: 'feedAtBowl', hint: 'Nutze die Pfeile um zum Napf zu kommen, dann tippe Füttern an!' },
    { text: 'Verwöhne dein Tier! Tippe erst „Streicheln" 🐾 und dann „Schlafen" 🌙 an.',
      solution: ['pet', 'sleep'], hint: 'Tippe unten erst die Pfoten-Karte, dann den Mond an!' },
    { text: '🍽️ Finde wieder den Weg zum Napf an der neuen Stelle und fütter dein Tier!',
      solution: null, validate: 'feedAtBowl', hint: 'Der Napf steht jedes Mal woanders – finde den Weg dorthin!' },
    { text: 'Gehe spazieren und belohne dein Tier danach mit Streicheln 🐾!',
      solution: null, validate: 'moveAndPet', hint: 'Kombiniere Pfeile mit Streicheln!' },
  ],
  adult: [
    { text: '🍽️ Finde den schnellsten Weg zum blinkenden Napf und fütter dein Tier!',
      solution: null, validate: 'feedAtBowl', hint: 'Nutze die einfachen oder doppelten Pfeile, um zum Napf zu gelangen!' },
    { text: '🛏️ Zeit fürs Bettchen! Führe dein Tier zum kuscheligen Körbchen und lege es schlafen!',
      solution: null, validate: 'sleepAtBasket', hint: 'Führe dein Tier auf das Körbchen oben links und nutze die Schlafen-Karte 🌙!' },
    { text: 'Spaziergang im Quadrat: Lege die Karten ↑ → ↓ ← an!',
      solution: ['up', 'right', 'down', 'left'], hint: 'Oben, rechts, unten, links – ein Quadrat!' },
    { text: 'Wellness-Programm: Erst bürsten, dann Krallen schneiden, dann ein Kunststück zeigen!',
      solution: ['brush', 'trim', 'trick'], hint: 'Drei Karten: Bürste 🪥 → Krallen ✂️ → Stern ⭐!' },
    { text: '🍽️⭐ Füttere dein Tier am Napf und lass es ein Kunststück zeigen!',
      solution: null, validate: 'feedAndTrick', hint: 'Gehe zum Napf, füttere dein Tier und füge das Kunststück ⭐ an!' },
    { text: 'Überrasche dein Tier! Baue ein großes Programm mit mindestens 5 Karten!',
      solution: null, validate: 'fiveCards', hint: 'Probier einfach verschiedene Karten aus – Hauptsache mindestens 5 Stück!' },
  ],
};

const ACCESSORIES = [
  { id: 'bow', name: 'Schleife', starsNeeded: 3 },
  { id: 'hat', name: 'Zylinder', starsNeeded: 6 },
  { id: 'glasses', name: 'Sonnenbrille', starsNeeded: 10 },
  { id: 'cape', name: 'Superhelden-Umhang', starsNeeded: 15 },
  { id: 'crown', name: 'Krone', starsNeeded: 20 },
];

const DISCOVERY_MESSAGES = {
  feed: 'Füttern entdeckt!',
  pet: 'Streicheln entdeckt!',
  sleep: 'Schlafen legen entdeckt!',
  brush: 'Bürsten entdeckt!',
  trim: 'Krallen schneiden entdeckt!',
  trick: 'Kunststück entdeckt!',
  hop: 'Hüpfen entdeckt!',
  wallBump: 'Wandkollision entdeckt – Debugging!',
  longSequence: 'Lange Sequenz gebaut!',
};

/* ---------- Web Audio Synthesizer (Zero Assets) ---------- */

let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === 'click') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'step') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'hop') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.22);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  } else if (type === 'eat') {
    [0, 0.09, 0.18].forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(420 + idx * 70, now + delay);
      osc.frequency.exponentialRampToValueAtTime(220, now + delay + 0.07);
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.linearRampToValueAtTime(0.01, now + delay + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.07);
    });
  } else if (type === 'purr') {
    [320, 380, 440, 520].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.15);
    });
  } else if (type === 'thud') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } else if (type === 'success') {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.25, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }
}

/* ---------- Text-to-Speech (Vorlesefunktion) ---------- */

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  // Strip emojis from reading
  const clean = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
  if (!clean) return;
  const utter = new SpeechSynthesisUtterance(clean);
  utter.lang = 'de-DE';
  utter.rate = 0.92;
  utter.pitch = 1.15; // Friendly, slightly higher tone for kids
  window.speechSynthesis.speak(utter);
}

/* ---------- Spielzustand ---------- */

const GRID = 5;
const TILE = 1.5;
const BOWL_POS = { x: 4, z: 2 };
const BOWL_OFFSET = 0.55;

const PET_PALETTES = {
  orange: {
    name: 'Karamell / Getigert',
    primary: 0xef7c2c,
    belly: 0xfff6ec,
    earsInner: 0xff99aa,
    muzzle: 0xfff6ec,
    nose: 0x3d2013,
    eyes: 0x1e293b,
    eyeHighlight: 0xffffff,
    paws: 0xfff6ec,
    collar: 0xe63946,
    bell: 0xffd166,
  },
  white: {
    name: 'Schneeweiß',
    primary: 0xfbfaf8,
    belly: 0xffffff,
    earsInner: 0xffb3c1,
    muzzle: 0xffffff,
    nose: 0xff8fa3,
    eyes: 0x1e293b,
    eyeHighlight: 0xffffff,
    paws: 0xf1ece4,
    collar: 0x7209b7,
    bell: 0xffd166,
  },
  brown: {
    name: 'Schokobraun',
    primary: 0x6e4324,
    belly: 0xf2e1d0,
    earsInner: 0xbb856a,
    muzzle: 0xf2e1d0,
    nose: 0x24140d,
    eyes: 0x18100a,
    eyeHighlight: 0xffffff,
    paws: 0xf2e1d0,
    collar: 0x2a9d8f,
    bell: 0xffd166,
  },
  gray: {
    name: 'Silbergrau',
    primary: 0x768396,
    belly: 0xf1f5f9,
    earsInner: 0xffa8ba,
    muzzle: 0xf1f5f9,
    nose: 0x334155,
    eyes: 0x0f172a,
    eyeHighlight: 0xffffff,
    paws: 0xf1f5f9,
    collar: 0xe76f51,
    bell: 0xffd166,
  },
  golden: {
    name: 'Goldgelb',
    primary: 0xdda135,
    belly: 0xfff9e6,
    earsInner: 0xeea374,
    muzzle: 0xfff9e6,
    nose: 0x422812,
    eyes: 0x28190d,
    eyeHighlight: 0xffffff,
    paws: 0xfff9e6,
    collar: 0x4361ee,
    bell: 0xffd166,
  },
  magic: {
    name: 'Magisches Lila',
    primary: 0x8c58d8,
    belly: 0xf4edff,
    earsInner: 0xff70a6,
    muzzle: 0xf4edff,
    nose: 0x4a197e,
    eyes: 0x270f4a,
    eyeHighlight: 0xffffff,
    paws: 0xf4edff,
    collar: 0x06d6a0,
    bell: 0xffd166,
  }
};

const state = {
  age: null,
  sequence: [],
  running: false,
  mood: 50,
  petPos: { x: 2, z: 2 },
  bowlPos: { x: 4, z: 2 },
  basketPos: { x: 0, z: 0 },
  stars: 0,
  missionMode: true,
  currentMission: 0,
  completedMissions: { baby: [], adult: [] },
  discoveries: {},
  equippedAccessories: [],
  soundEnabled: true,
  petType: 'cat',
  petColor: 'orange',
  userSelectedColor: false,
  petName: 'Tierchen',
};

function gridToWorld(gx, gz) {
  const half = (GRID - 1) / 2;
  return { x: (gx - half) * TILE, z: (gz - half) * TILE };
}

/* ---------- Geräte-Erkennung ---------- */

function detectLowTier() {
  const cores = navigator.hardwareConcurrency || 4;
  let weakGpu = false;
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    const info = gl && gl.getExtension('WEBGL_debug_renderer_info');
    if (info) {
      const renderer = gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '';
      weakGpu = /swiftshader|software|mali-4|adreno 3/i.test(renderer);
    }
  } catch (e) {}
  return cores <= 4 || weakGpu;
}

const LOW_TIER = detectLowTier();

/* ---------- Three.js Szene ---------- */

let renderer, scene, camera, petGroup, petEyes = [], petPaws = [], petTail = null, bowlFood, petHead, bowlGroup, basketGroup, accessoryMeshes = {};
let lastBlink = 0;
let lastLook = 0;

function initScene() {
  const canvas = document.getElementById('scene');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 6.6, 7.4);
  camera.lookAt(0, 0.35, 0);

  // Beleuchtung: Warmes Sonnenlicht + weiches Raumlicht
  const hemi = new THREE.HemisphereLight(0xfffaed, 0xbab0a2, 0.75);
  scene.add(hemi);

  const sunLight = new THREE.DirectionalLight(0xfff7e8, 1.15);
  sunLight.position.set(4.5, 8.5, 4.5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 25;
  sunLight.shadow.camera.left = -5.5;
  sunLight.shadow.camera.right = 5.5;
  sunLight.shadow.camera.top = 5.5;
  sunLight.shadow.camera.bottom = -5.5;
  sunLight.shadow.bias = -0.0006;
  scene.add(sunLight);

  // Sanftes Randlicht von hinten/links für schöne Silhouette
  const rimLight = new THREE.DirectionalLight(0xdfe8f7, 0.45);
  rimLight.position.set(-4, 4.5, -4);
  scene.add(rimLight);

  // Hochwertiges Holz-/Spiel-Podest mit Kontrast
  const groundSize = GRID * TILE + 0.9;
  const baseGeo = new THREE.BoxGeometry(groundSize, 0.18, groundSize);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xa88365,
    roughness: 0.85,
    metalness: 0.05
  });
  const groundBase = new THREE.Mesh(baseGeo, baseMat);
  groundBase.position.y = -0.09;
  groundBase.receiveShadow = true;
  scene.add(groundBase);

  // 5x5 Kontrastreiche Kacheln (gemütliche helle Parkett-/Mattenfarben)
  const tileGeo = new THREE.BoxGeometry(TILE * 0.93, 0.04, TILE * 0.93);
  const tileMatLight = new THREE.MeshStandardMaterial({
    color: 0xf9f4ec,
    roughness: 0.65,
    metalness: 0.02
  });
  const tileMatDark = new THREE.MeshStandardMaterial({
    color: 0xeee3d3,
    roughness: 0.7,
    metalness: 0.02
  });

  for (let gx = 0; gx < GRID; gx++) {
    for (let gz = 0; gz < GRID; gz++) {
      const isEven = (gx + gz) % 2 === 0;
      const tileMesh = new THREE.Mesh(tileGeo, isEven ? tileMatLight : tileMatDark);
      const worldPos = gridToWorld(gx, gz);
      tileMesh.position.set(worldPos.x, 0.01, worldPos.z);
      tileMesh.receiveShadow = true;
      scene.add(tileMesh);
    }
  }

  addDecoration();
  buildBasket();
  buildBowl();
  buildPet();

  window.addEventListener('resize', onResize);
  onResize();
  requestAnimationFrame(tick);
}

function buildBowl() {
  if (bowlGroup) scene.remove(bowlGroup);

  const bowlWorld = gridToWorld(state.bowlPos.x, state.bowlPos.z);
  bowlGroup = new THREE.Group();
  bowlGroup.position.set(bowlWorld.x, 0, bowlWorld.z);

  // Pulsierender Leuchtring
  const glowRing = new THREE.Mesh(
    new THREE.RingGeometry(0.36, 0.52, 32),
    new THREE.MeshBasicMaterial({ color: 0xf0b429, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  glowRing.rotation.x = -Math.PI / 2;
  glowRing.position.y = 0.025;
  glowRing.name = 'bowlGlow';
  bowlGroup.add(glowRing);

  // Keramiknapf mit Glanz
  const bowlBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.26, 0.22, 24),
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.15
    })
  );
  bowlBody.position.y = 0.11;
  bowlBody.castShadow = true;
  bowlBody.receiveShadow = true;
  bowlGroup.add(bowlBody);

  // Weißer Innenrand
  const bowlRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.33, 0.03, 12, 24),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  bowlRim.rotation.x = Math.PI / 2;
  bowlRim.position.y = 0.22;
  bowlGroup.add(bowlRim);

  // Futter-Kroketten mit Glanz
  bowlFood = new THREE.Group();
  const kibbleMat = new THREE.MeshStandardMaterial({ color: 0xde9b35, roughness: 0.4, metalness: 0.1 });
  [[-0.1, 0.22, -0.05], [0.08, 0.23, 0.06], [0, 0.24, 0.08], [0.05, 0.22, -0.07], [-0.06, 0.23, 0.04]].forEach(([x, y, z]) => {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), kibbleMat);
    dot.position.set(x, y, z);
    dot.castShadow = true;
    bowlFood.add(dot);
  });
  bowlGroup.add(bowlFood);
  scene.add(bowlGroup);
}

function relocateBowl(newPos = null) {
  if (newPos) {
    state.bowlPos = { ...newPos };
  } else {
    const candidates = [];
    for (let x = 0; x < GRID; x++) {
      for (let z = 0; z < GRID; z++) {
        const isPet = (x === state.petPos.x && z === state.petPos.z);
        const isBasket = (state.age === 'adult' && x === state.basketPos.x && z === state.basketPos.z);
        const dist = Math.abs(x - state.petPos.x) + Math.abs(z - state.petPos.z);
        if (!isPet && !isBasket && dist >= 2) {
          candidates.push({ x, z });
        }
      }
    }
    if (candidates.length > 0) {
      state.bowlPos = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      state.bowlPos = { x: 4, z: 2 };
    }
  }

  if (bowlGroup) {
    const bowlWorld = gridToWorld(state.bowlPos.x, state.bowlPos.z);
    bowlGroup.position.set(bowlWorld.x, 0, bowlWorld.z);
    if (bowlFood) bowlFood.visible = true;
  }
}

function buildBasket() {
  if (basketGroup) scene.remove(basketGroup);

  const basketWorld = gridToWorld(state.basketPos.x, state.basketPos.z);
  basketGroup = new THREE.Group();
  basketGroup.position.set(basketWorld.x, 0, basketWorld.z);

  // Leuchtring für Schlafe-Aufgabe
  const glowRing = new THREE.Mesh(
    new THREE.RingGeometry(0.38, 0.54, 32),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0, side: THREE.DoubleSide })
  );
  glowRing.rotation.x = -Math.PI / 2;
  glowRing.position.y = 0.025;
  glowRing.name = 'basketGlow';
  basketGroup.add(glowRing);

  // Körbchen-Rand (Rattan / Holz)
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xb47846, roughness: 0.85, metalness: 0.05 });
  const basketRim = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.08, 12, 28), rimMat);
  basketRim.rotation.x = Math.PI / 2;
  basketRim.position.y = 0.09;
  basketRim.castShadow = true;
  basketRim.receiveShadow = true;
  basketGroup.add(basketRim);

  // Boden
  const basketBottom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.34, 0.06, 24),
    new THREE.MeshStandardMaterial({ color: 0x965f32, roughness: 0.9 })
  );
  basketBottom.position.y = 0.03;
  basketBottom.receiveShadow = true;
  basketGroup.add(basketBottom);

  // Weiches Kissen
  const cushion = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 22, 16),
    new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.75, metalness: 0.02 })
  );
  cushion.scale.set(1, 0.35, 1);
  cushion.position.y = 0.07;
  cushion.castShadow = true;
  cushion.receiveShadow = true;
  basketGroup.add(cushion);

  // Niedlicher Deko-Mond
  const starMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.25, metalness: 0.7 });
  const star = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 6), starMat);
  star.rotation.z = Math.PI / 3;
  star.position.set(0.32, 0.14, 0);
  star.castShadow = true;
  basketGroup.add(star);

  basketGroup.visible = state.age === 'adult';
  scene.add(basketGroup);
}

function addDecoration() {
  // Schöner 3D-Pflanzentopf im Eck
  const plantGroup = new THREE.Group();
  plantGroup.position.set(-3.6, 0, -3.6);

  // Terrakotta Topf
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.26, 0.6, 16),
    new THREE.MeshStandardMaterial({ color: 0xc86446, roughness: 0.7 })
  );
  pot.position.y = 0.3;
  pot.castShadow = true;
  pot.receiveShadow = true;
  plantGroup.add(pot);

  // Erde
  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.05, 16),
    new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.9 })
  );
  soil.position.y = 0.58;
  plantGroup.add(soil);

  // Stylisierte Blätter-Kugeln
  const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.6 });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x66bb6a, roughness: 0.6 });
  const foliage1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 14), leafMat1);
  foliage1.position.set(0, 0.9, 0);
  foliage1.castShadow = true;
  plantGroup.add(foliage1);

  const foliage2 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), leafMat2);
  foliage2.position.set(0.18, 1.15, -0.08);
  foliage2.castShadow = true;
  plantGroup.add(foliage2);

  const foliage3 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), leafMat1);
  foliage3.position.set(-0.16, 1.05, 0.1);
  foliage3.castShadow = true;
  plantGroup.add(foliage3);

  scene.add(plantGroup);

  // Spielzeug-Wollknäuel im anderen Eck
  const ballGroup = new THREE.Group();
  ballGroup.position.set(3.6, 0, -3.6);
  const ballMat = new THREE.MeshStandardMaterial({ color: 0xe056fd, roughness: 0.7 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), ballMat);
  ball.position.y = 0.28;
  ball.castShadow = true;
  ballGroup.add(ball);

  // Ring um den Ball
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.025, 8, 20), ringMat);
  ring.rotation.x = Math.PI / 4;
  ring.position.y = 0.28;
  ballGroup.add(ring);

  scene.add(ballGroup);
}

/* ---------- Hochwertiger 3D-Tier-Builder ---------- */

function buildPet() {
  petGroup = new THREE.Group();
  petEyes = [];
  petPaws = [];
  petTail = null;

  const isBaby = state.age === 'baby';
  const scaleF = isBaby ? 0.75 : 1.0;
  const petType = state.petType || 'cat';
  const palette = PET_PALETTES[state.petColor || 'orange'] || PET_PALETTES.orange;

  // Hochwertige PBR-Materialien mit sanftem Glanz
  const primaryMat = new THREE.MeshStandardMaterial({
    color: palette.primary,
    roughness: 0.65,
    metalness: 0.04
  });
  const bellyMat = new THREE.MeshStandardMaterial({
    color: palette.belly,
    roughness: 0.7,
    metalness: 0.02
  });
  const earsInnerMat = new THREE.MeshStandardMaterial({
    color: palette.earsInner,
    roughness: 0.6,
    metalness: 0.0
  });
  const noseMat = new THREE.MeshStandardMaterial({
    color: palette.nose,
    roughness: 0.2,
    metalness: 0.1
  });
  const pawsMat = new THREE.MeshStandardMaterial({
    color: palette.paws,
    roughness: 0.68,
    metalness: 0.02
  });

  // --- KÖRPER (Rund & flauschig) ---
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 28, 22),
    primaryMat
  );
  body.scale.set(1, 0.88, 1.2);
  body.position.y = 0.52;
  body.castShadow = true;
  body.receiveShadow = true;
  petGroup.add(body);

  // Heller Brust- / Bauchlatz
  const belly = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 22, 18),
    bellyMat
  );
  belly.scale.set(0.78, 0.75, 1.05);
  belly.position.set(0, 0.48, 0.18);
  petGroup.add(belly);

  // Halsband mit glänzendem Glöckchen
  const collarMat = new THREE.MeshStandardMaterial({ color: palette.collar, roughness: 0.35, metalness: 0.1 });
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.035, 10, 24),
    collarMat
  );
  collar.rotation.x = Math.PI / 2.3;
  collar.position.set(0, 0.68, 0.46);
  collar.castShadow = true;
  petGroup.add(collar);

  const bellMat = new THREE.MeshStandardMaterial({ color: palette.bell, roughness: 0.18, metalness: 0.85 });
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 14), bellMat);
  bell.position.set(0, 0.61, 0.74);
  bell.castShadow = true;
  petGroup.add(bell);

  // --- 4 PFÖTCHEN (Mit weißem Söckchen-Look) ---
  const pawPositions = [
    { x: -0.28, z: 0.36 },  // Vorne Links
    { x: 0.28, z: 0.36 },   // Vorne Rechts
    { x: -0.32, z: -0.32 }, // Hinten Links
    { x: 0.32, z: -0.32 }   // Hinten Rechts
  ];

  pawPositions.forEach((pos) => {
    const pawGroup = new THREE.Group();
    pawGroup.position.set(pos.x, 0.12, pos.z);

    const pawMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 14),
      pawsMat
    );
    pawMesh.scale.set(1, 0.75, 1.3);
    pawMesh.castShadow = true;
    pawGroup.add(pawMesh);

    petPaws.push(pawGroup);
    petGroup.add(pawGroup);
  });

  // --- KOPF ---
  petHead = new THREE.Group();
  petHead.position.set(0, 0.86, 0.54);

  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 28, 22),
    primaryMat
  );
  headMesh.castShadow = true;
  petHead.add(headMesh);

  // Süße runde Bäckchen
  [-0.22, 0.22].forEach(x => {
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 14), bellyMat);
    cheek.position.set(x, -0.06, 0.18);
    cheek.scale.set(1, 0.8, 0.8);
    petHead.add(cheek);
  });

  // Schnäuzchen
  const muzzle = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 18, 14),
    bellyMat
  );
  muzzle.position.set(0, -0.04, 0.27);
  muzzle.scale.set(1.1, 0.75, 0.85);
  petHead.add(muzzle);

  // Glänzende 3D-Nase
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.048, 14, 14),
    noseMat
  );
  nose.position.set(0, 0.02, 0.38);
  nose.scale.set(1.2, 0.9, 0.9);
  petHead.add(nose);

  // Rosa Wangen-Rouge
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.65 });
  [-0.24, 0.24].forEach(x => {
    const blush = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), blushMat);
    blush.position.set(x, -0.04, 0.28);
    blush.scale.z = 0.2;
    petHead.add(blush);
  });

  // Schnurrhaare
  const lineMat = new THREE.LineBasicMaterial({ color: 0x475569, linewidth: 2 });
  [-1, 1].forEach(side => {
    [-1, 0, 1].forEach(angle => {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(side * 0.16, -0.04, 0.34),
        new THREE.Vector3(side * 0.42, -0.04 + angle * 0.05, 0.38)
      ]);
      petHead.add(new THREE.Line(geom, lineMat));
    });
  });

  // Lebendige, glänzende Augen mit Pixar/Anime-Reflexionspunkt
  const eyeMat = new THREE.MeshStandardMaterial({
    color: palette.eyes,
    roughness: 0.1,
    metalness: 0.15
  });
  const highlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  [-0.14, 0.14].forEach((x) => {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(x, 0.07, 0.31);

    // Pupille
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.065, 18, 18), eyeMat);
    pupil.scale.set(0.9, 1.1, 0.6);
    eyeGroup.add(pupil);

    // Großer Glanzpunkt
    const shine1 = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), highlightMat);
    shine1.position.set(x < 0 ? -0.018 : -0.012, 0.025, 0.038);
    eyeGroup.add(shine1);

    // Kleiner Zweit-Glanzpunkt
    const shine2 = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), highlightMat);
    shine2.position.set(x < 0 ? 0.018 : 0.022, -0.02, 0.035);
    eyeGroup.add(shine2);

    petEyes.push(eyeGroup);
    petHead.add(eyeGroup);
  });

  // --- OHREN NACH TIERART ---
  if (petType === 'cat') {
    // Schicke Katzenohren mit rosa Innenohr
    [-0.18, 0.18].forEach((x) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(x, 0.32, 0.05);
      earGroup.rotation.z = x < 0 ? 0.28 : -0.28;
      earGroup.rotation.x = -0.1;

      const outerEar = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.32, 14), primaryMat);
      outerEar.scale.set(1, 1, 0.65);
      outerEar.castShadow = true;
      earGroup.add(outerEar);

      const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 12), earsInnerMat);
      innerEar.position.set(0, -0.02, 0.045);
      innerEar.scale.set(0.9, 1, 0.4);
      earGroup.add(innerEar);

      petHead.add(earGroup);
    });
  } else if (petType === 'dog') {
    // Süße flauschige Schlappohren
    [-0.26, 0.26].forEach((x) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(x, 0.14, 0.08);
      earGroup.rotation.z = x < 0 ? 0.35 : -0.35;
      earGroup.rotation.x = 0.25;

      const outerEar = new THREE.Mesh(new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.09, 0.22, 8, 12) : new THREE.CylinderGeometry(0.08, 0.11, 0.34, 12), primaryMat);
      outerEar.castShadow = true;
      earGroup.add(outerEar);

      petHead.add(earGroup);
    });
  } else if (petType === 'bunny') {
    // Lange Hasen-Löffel mit rosa Innenfläche
    [-0.14, 0.14].forEach((x) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(x, 0.42, -0.02);
      earGroup.rotation.z = x < 0 ? 0.14 : -0.14;
      earGroup.rotation.x = -0.1;

      const outerEar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.1, 0.54, 14), primaryMat);
      outerEar.scale.set(1, 1, 0.55);
      outerEar.castShadow = true;
      earGroup.add(outerEar);

      const innerEar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.065, 0.42, 10), earsInnerMat);
      innerEar.position.set(0, 0, 0.03);
      innerEar.scale.set(0.9, 1, 0.35);
      earGroup.add(innerEar);

      petHead.add(earGroup);
    });
  }

  petGroup.add(petHead);

  // --- SCHWANZ NACH TIERART ---
  petTail = new THREE.Group();
  if (petType === 'bunny') {
    // Weicher weißer Hasen-Puschel
    const pompom = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      bellyMat
    );
    pompom.position.set(0, 0.52, -0.58);
    pompom.castShadow = true;
    petTail.add(pompom);
  } else if (petType === 'dog') {
    // Fröhlicher Hundeschwanz
    const tailMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.09, 0.42, 12),
      primaryMat
    );
    tailMesh.position.set(0, 0.2, 0);
    tailMesh.castShadow = true;
    petTail.position.set(0, 0.6, -0.6);
    petTail.rotation.x = Math.PI / 3;
    petTail.add(tailMesh);
  } else {
    // Eleganter Katzenschwanz mit weißer Spitze
    const tailBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.09, 0.35, 12),
      primaryMat
    );
    tailBase.position.set(0, 0.16, 0);
    tailBase.castShadow = true;
    petTail.add(tailBase);

    const tailTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.065, 0.22, 12),
      bellyMat
    );
    tailTip.position.set(0, 0.4, 0.02);
    tailTip.castShadow = true;
    petTail.add(tailTip);

    petTail.position.set(0, 0.58, -0.62);
    petTail.rotation.x = Math.PI / 2.5;
  }
  petGroup.add(petTail);

  // Accessoires
  buildAccessories();

  petGroup.scale.setScalar(scaleF);
  const world = gridToWorld(state.petPos.x, state.petPos.z);
  petGroup.position.set(world.x, 0, world.z);
  scene.add(petGroup);
}

function buildAccessories() {
  accessoryMeshes = {};
  
  // Schleife mit PBR Glanz
  const bow = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.18, 12),
    new THREE.MeshStandardMaterial({ color: 0xff4081, roughness: 0.35, metalness: 0.1 })
  );
  bow.position.set(0.14, 0.34, 0.12);
  bow.rotation.z = -Math.PI / 4;
  bow.castShadow = true;
  bow.visible = false;
  petHead.add(bow);
  accessoryMeshes.bow = bow;

  // Zylinder / Hut
  const hatGroup = new THREE.Group();
  const hatMat = new THREE.MeshStandardMaterial({ color: 0x1e1b2e, roughness: 0.4, metalness: 0.2 });
  const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.26, 16), hatMat);
  hatCrown.position.y = 0.13;
  hatCrown.castShadow = true;
  hatGroup.add(hatCrown);

  const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 16), hatMat);
  hatBrim.position.y = 0.015;
  hatBrim.castShadow = true;
  hatGroup.add(hatBrim);

  const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.19, 0.05, 16), new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.4 }));
  hatBand.position.y = 0.06;
  hatGroup.add(hatBand);

  hatGroup.position.set(0, 0.4, 0);
  hatGroup.visible = false;
  petHead.add(hatGroup);
  accessoryMeshes.hat = hatGroup;

  // Brille
  const glassesGroup = new THREE.Group();
  const glassGeo = new THREE.TorusGeometry(0.075, 0.018, 10, 20);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.8 });
  [-0.14, 0.14].forEach(x => {
    const g = new THREE.Mesh(glassGeo, glassMat);
    g.position.set(x, 0.07, 0.35);
    g.castShadow = true;
    glassesGroup.add(g);
  });
  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12), glassMat);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.07, 0.35);
  glassesGroup.add(bridge);
  glassesGroup.visible = false;
  petHead.add(glassesGroup);
  accessoryMeshes.glasses = glassesGroup;

  // Umhang
  const cape = new THREE.Mesh(
    new THREE.PlaneGeometry(0.68, 0.85),
    new THREE.MeshStandardMaterial({ color: 0xd90429, side: THREE.DoubleSide, roughness: 0.6 })
  );
  cape.position.set(0, 0.72, -0.32);
  cape.rotation.x = Math.PI / 4;
  cape.castShadow = true;
  cape.visible = false;
  petGroup.add(cape);
  accessoryMeshes.cape = cape;

  // Goldene Krone mit Edelsteinen
  const crownGroup = new THREE.Group();
  const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.2, metalness: 0.85 });
  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16, 1, true), crownMat);
  crownBase.position.y = 0.03;
  crownBase.castShadow = true;
  crownGroup.add(crownBase);

  [-0.12, 0, 0.12].forEach(x => {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.16, 8), crownMat);
    spike.position.set(x, 0.12, 0);
    spike.castShadow = true;
    crownGroup.add(spike);
  });
  crownGroup.position.set(0, 0.36, 0);
  crownGroup.visible = false;
  petHead.add(crownGroup);
  accessoryMeshes.crown = crownGroup;

  // Ausgerüstete wieder aktivieren
  state.equippedAccessories.forEach(id => {
    if (accessoryMeshes[id]) accessoryMeshes[id].visible = true;
  });
}

function equipAccessory(id) {
  if (!state.equippedAccessories.includes(id)) {
    state.equippedAccessories.push(id);
    if (accessoryMeshes[id]) accessoryMeshes[id].visible = true;
  }
}

function resetPet() {
  if (petGroup) scene.remove(petGroup);
  state.petPos = { x: 2, z: 2 };
  state.mood = 50;
  buildPet();
  if (petGroup) petGroup.rotation.y = 0;
  if (basketGroup) basketGroup.visible = (state.age === 'adult');
  relocateBowl();
}

function onResize() {
  const wrap = document.getElementById('canvas-wrap');
  if (!wrap) return;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function tick(now) {
  const time = now * 0.001;
  
  if (petGroup && !state.running) {
    const baseScaleY = state.age === 'baby' ? 0.75 : 1.0;
    // Sanfte Atembewegung
    petGroup.scale.y = baseScaleY + Math.sin(time * 2.5) * 0.018;

    // Schwanzwedeln im Ruhezustand
    if (petTail) {
      petTail.rotation.z = Math.sin(time * 3) * 0.18;
    }

    // Blinzeln
    if (now - lastBlink > 3200 && Math.random() < 0.02) {
      lastBlink = now;
      petEyes.forEach(e => e.scale.y = 0.08);
      setTimeout(() => petEyes.forEach(e => e.scale.y = 1), 160);
    }

    // Neugieriges Umschauen
    if (now - lastLook > 7000 && Math.random() < 0.015 && petHead) {
      lastLook = now;
      const target = (Math.random() > 0.5 ? 1 : -1) * 0.18;
      tween(450, t => petHead.rotation.y = easeInOut(t) * target).then(() => {
        setTimeout(() => {
          if (!state.running && petHead) {
            tween(450, t => petHead.rotation.y = target * (1 - easeInOut(t)));
          }
        }, 1200);
      });
    }
  }

  if (accessoryMeshes.cape && accessoryMeshes.cape.visible) {
    accessoryMeshes.cape.rotation.x = Math.PI / 4 + Math.sin(time * 4) * 0.12;
  }

  // Napf blinken / pulsieren lassen, wenn eine Futter-Aufgabe aktiv ist
  if (bowlGroup) {
    const glowRing = bowlGroup.getObjectByName('bowlGlow');
    const isFeedMission = state.missionMode && MISSIONS[state.age] && (
      (MISSIONS[state.age][state.currentMission]?.solution?.includes('feed')) ||
      (MISSIONS[state.age][state.currentMission]?.validate?.includes('feed')) ||
      (MISSIONS[state.age][state.currentMission]?.text?.includes('Napf')) ||
      (MISSIONS[state.age][state.currentMission]?.text?.includes('fütter'))
    );

    if (glowRing) {
      if (isFeedMission) {
        const pulse = 0.5 + Math.sin(time * 6) * 0.4;
        glowRing.material.opacity = pulse;
        glowRing.scale.setScalar(1 + Math.sin(time * 6) * 0.08);
      } else {
        glowRing.material.opacity = 0;
      }
    }

    if (bowlFood) {
      if (isFeedMission && bowlFood.visible) {
        bowlFood.position.y = Math.sin(time * 6) * 0.025;
      } else {
        bowlFood.position.y = 0;
      }
    }
  }

  // Körbchen blinken / pulsieren lassen, wenn eine Schlaf-Aufgabe aktiv ist
  if (basketGroup && basketGroup.visible) {
    const basketGlow = basketGroup.getObjectByName('basketGlow');
    const isSleepMission = state.missionMode && MISSIONS[state.age] && (
      (MISSIONS[state.age][state.currentMission]?.solution?.includes('sleep')) ||
      (MISSIONS[state.age][state.currentMission]?.validate?.includes('sleep')) ||
      (MISSIONS[state.age][state.currentMission]?.text?.includes('Körbchen')) ||
      (MISSIONS[state.age][state.currentMission]?.text?.includes('Bettchen'))
    );

    if (basketGlow) {
      if (isSleepMission) {
        const pulse = 0.5 + Math.sin(time * 6) * 0.4;
        basketGlow.material.opacity = pulse;
        basketGlow.scale.setScalar(1 + Math.sin(time * 6) * 0.08);
      } else {
        basketGlow.material.opacity = 0;
      }
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}

/* ---------- Animations-Helfer ---------- */

function tween(duration, onUpdate) {
  return new Promise((resolve) => {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      onUpdate(t);
      if (t < 1) requestAnimationFrame(step); else resolve();
    }
    requestAnimationFrame(step);
  });
}

function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

async function rotateToDir(dirId) {
  // Three.js Koordinaten:
  // Standard-Ausrichtung (rotation.y = 0) = +Z (nach unten/vorne zum Bildschirm)
  // up (-Z, weg von Kamera): Math.PI (180°)
  // down (+Z, zur Kamera): 0°
  // left (-X, nach links): -Math.PI / 2 (-90°)
  // right (+X, nach rechts): Math.PI / 2 (+90°)
  const rotMap = {
    up: Math.PI,
    down: 0,
    left: -Math.PI / 2,
    right: Math.PI / 2,
  };
  const targetId = dirId.replace('2', '');
  if (!(targetId in rotMap)) return;

  const target = rotMap[targetId];
  const current = petGroup.rotation.y;

  // Kürzester Rotationspfad
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  if (Math.abs(diff) > 0.01) {
    const startRot = current;
    await tween(180, t => {
      petGroup.rotation.y = startRot + diff * easeInOut(t);
    });
  }
  petGroup.rotation.y = target;
}

async function moveTo(targetGrid) {
  playSound('step');
  const from = petGroup.position.clone();
  const to3 = gridToWorld(targetGrid.x, targetGrid.z);
  const targetY = petGroup.position.y;
  await tween(450, (t) => {
    const e = easeInOut(t);
    petGroup.position.x = from.x + (to3.x - from.x) * e;
    petGroup.position.z = from.z + (to3.z - from.z) * e;
    petGroup.position.y = targetY + Math.sin(t * Math.PI) * 0.1;

    // Pfötchen beim Laufen trippeln lassen
    if (petPaws && petPaws.length === 4) {
      const stepPhase = Math.sin(t * Math.PI * 2);
      petPaws[0].position.z = 0.36 + stepPhase * 0.08;
      petPaws[1].position.z = 0.36 - stepPhase * 0.08;
      petPaws[2].position.z = -0.32 - stepPhase * 0.08;
      petPaws[3].position.z = -0.32 + stepPhase * 0.08;
    }
  });
  if (petPaws && petPaws.length === 4) {
    petPaws[0].position.z = 0.36;
    petPaws[1].position.z = 0.36;
    petPaws[2].position.z = -0.32;
    petPaws[3].position.z = -0.32;
  }
  state.petPos = targetGrid;
}

async function bumpTowards(dx, dz) {
  playSound('thud');
  const wrap = document.getElementById('canvas-wrap');
  if (wrap) {
    wrap.classList.remove('shake');
    void wrap.offsetWidth; // trigger reflow
    wrap.classList.add('shake');
    setTimeout(() => wrap.classList.remove('shake'), 350);
  }
  const from = petGroup.position.clone();
  await tween(220, (t) => {
    const e = Math.sin(t * Math.PI);
    petGroup.position.x = from.x + dx * 0.18 * e;
    petGroup.position.z = from.z + dz * 0.18 * e;
  });
  petGroup.position.copy(from);
}

async function hopInPlace() {
  playSound('hop');
  const baseY = petGroup.position.y;
  await tween(420, (t) => {
    petGroup.position.y = baseY + Math.sin(t * Math.PI) * 0.5;
  });
  petGroup.position.y = baseY;
}

async function wiggle() {
  const baseRotZ = petGroup.rotation.z;
  await tween(500, (t) => {
    petGroup.rotation.z = baseRotZ + Math.sin(t * Math.PI * 4) * 0.08 * (1 - t);
  });
  petGroup.rotation.z = baseRotZ;
}

async function spinTrick() {
  const baseY = petGroup.rotation.y;
  await tween(700, (t) => {
    petGroup.rotation.y = baseY + easeInOut(t) * Math.PI * 2;
  });
  petGroup.rotation.y = baseY;
}

async function squashSleep() {
  const baseScale = petGroup.scale.y;
  petEyes.forEach((e) => e.scale.set(1, 0.15, 1));
  await tween(500, (t) => {
    petGroup.scale.y = baseScale * (1 - 0.3 * Math.sin(t * Math.PI));
  });
  petGroup.scale.y = baseScale;
  setTimeout(() => petEyes.forEach((e) => e.scale.set(1, 1, 1)), 900);
}

/* ---------- UI & Feedback ---------- */

const els = {};

function cacheEls() {
  ['age-select', 'game', 'card-tray', 'sequence-bar', 'run-btn', 'mood-face',
    'mood-fill', 'back-btn', 'motion-btn', 'mic-btn', 'sound-btn',
    'mission-speak-btn', 'bubble-speak-btn', 'pet-name-input',
    'speech-consent', 'speech-consent-ok', 'speech-consent-cancel',
    'speech-bubble', 'speech-bubble-text', 'particles', 'confetti-container',
    'level-up-overlay', 'level-up-title', 'level-up-text', 'accessory-reveal',
    'accessory-name', 'level-up-ok', 'discovery-toast', 'discovery-text',
    'mode-toggle', 'mission-bar', 'mission-picker', 'mission-text', 'xp-count'
  ].forEach((id) => { els[id] = document.getElementById(id); });
}

function renderCardTray() {
  els['card-tray'].innerHTML = '';
  CARD_SETS[state.age].forEach((id, index) => {
    const def = CARD_DEFS[id];
    const btn = document.createElement('button');
    btn.className = `card-btn ${def.group}`;
    btn.style.setProperty('--i', index);
    btn.innerHTML = ICONS[id] + `<span class="card-label">${def.label}</span>`;
    btn.setAttribute('aria-label', def.label);
    btn.title = def.label;
    btn.addEventListener('click', () => addToSequence(id));
    els['card-tray'].appendChild(btn);
  });
}

function renderSequenceBar() {
  const bar = els['sequence-bar'];
  bar.innerHTML = '';
  if (state.sequence.length === 0) {
    const hint = document.createElement('span');
    hint.className = 'seq-empty-hint';
    hint.textContent = 'Tippe Karten an ↑';
    bar.appendChild(hint);
  } else {
    state.sequence.forEach((id, i) => {
      const chip = document.createElement('button');
      chip.className = 'seq-chip';
      chip.innerHTML = ICONS[id];
      chip.title = 'Entfernen';
      chip.dataset.index = String(i);
      chip.disabled = state.running;
      chip.addEventListener('click', () => removeFromSequence(i));
      bar.appendChild(chip);

      if (i < state.sequence.length - 1) {
        const conn = document.createElement('span');
        conn.className = 'seq-connector';
        conn.innerHTML = '→';
        bar.appendChild(conn);
      }
    });
  }
  els['run-btn'].disabled = state.sequence.length === 0 || state.running;
}

function addToSequence(id) {
  if (state.running) return;
  playSound('click');
  state.sequence.push(id);
  renderSequenceBar();
}

function removeFromSequence(index) {
  if (state.running) return;
  playSound('click');
  state.sequence.splice(index, 1);
  renderSequenceBar();
}

function setMood(delta) {
  state.mood = Math.max(0, Math.min(100, state.mood + delta));
  els['mood-fill'].style.width = state.mood + '%';
  let color = '#5fae7e';
  let face = '😄';
  if (state.mood < 30) { color = '#dd76a8'; face = '😢'; }
  else if (state.mood < 50) { color = '#efc04a'; face = '😕'; }
  else if (state.mood < 70) { color = '#e0a843'; face = '🙂'; }
  
  els['mood-fill'].style.background = color;
  els['mood-face'].textContent = face;
}

let speechBubbleTimer = null;
function showSpeechBubble(msg, duration = 3000) {
  const bubble = els['speech-bubble'];
  const text = els['speech-bubble-text'];
  text.textContent = msg;
  bubble.hidden = false;
  bubble.classList.remove('hiding');
  bubble.classList.add('show');
  
  // Auto-speak for young kids (baby mode) or on demand
  if (state.age === 'baby') {
    speakText(msg);
  }

  clearTimeout(speechBubbleTimer);
  speechBubbleTimer = setTimeout(() => {
    bubble.classList.add('hiding');
    bubble.classList.remove('show');
    setTimeout(() => { bubble.hidden = true; bubble.classList.remove('hiding'); }, 400);
  }, duration);
}

function spawnParticles(type, count = 5) {
  const container = els['particles'];
  const emojis = { heart: '❤️', zzz: '💤', note: '🎵', star: '⭐', sparkle: '✨' };
  const emoji = emojis[type] || '✨';
  
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = `particle ${type}`;
    p.style.left = (30 + Math.random() * 40) + '%';
    p.style.bottom = (20 + Math.random() * 30) + '%';
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    p.textContent = emoji;
    container.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

function spawnConfetti() {
  const container = els['confetti-container'];
  const colors = ['#7c5cbf', '#4db87a', '#f0b429', '#e06098', '#3ba8b3'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

/* ---------- XP / Stars / Discoveries ---------- */

function updateXP() {
  els['xp-count'].textContent = state.stars;
}

function showDiscovery(id) {
  if (!state.discoveries[id]) {
    state.discoveries[id] = true;
    state.stars += 1;
    updateXP();
    
    const text = DISCOVERY_MESSAGES[id] || `${id} entdeckt!`;
    const toast = els['discovery-toast'];
    els['discovery-text'].textContent = text;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3000);
    checkAccessoryUnlock();
  }
}

function checkAccessoryUnlock() {
  const unlockable = ACCESSORIES.find(a => a.starsNeeded === state.stars && !state.equippedAccessories.includes(a.id));
  if (unlockable) {
    showLevelUp(unlockable);
  }
}

function showLevelUp(accessory) {
  const overlay = els['level-up-overlay'];
  els['level-up-title'].textContent = 'Level Up! 🌟';
  els['level-up-text'].textContent = `Du hast ${state.stars} Sterne gesammelt!`;
  els['accessory-reveal'].hidden = false;
  els['accessory-name'].textContent = accessory.name;
  overlay.hidden = false;
  spawnConfetti();
  
  els['level-up-ok'].onclick = () => {
    overlay.hidden = true;
    equipAccessory(accessory.id);
  };
}

/* ---------- Missions ---------- */

function toggleMode() {
  state.missionMode = !state.missionMode;
  updateModeUI();
  if (state.missionMode) {
    showSpeechBubble('Wähle eine Aufgabe! 🎯');
  } else {
    showSpeechBubble('Freies Spielen! Entdecke neue Sachen. 🎮');
  }
}

function updateModeUI() {
  els['mode-toggle'].textContent = state.missionMode ? '🎮' : '🎯';
  els['mode-toggle'].title = state.missionMode ? 'Zum Freispiel wechseln' : 'Zu Aufgaben wechseln';
  els['mission-bar'].hidden = !state.missionMode;
  if (state.missionMode) renderMissionPicker();
}

function renderMissionPicker() {
  const list = MISSIONS[state.age];
  if (!list) return;
  const picker = document.getElementById('mission-picker');
  picker.innerHTML = '';

  list.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'mission-level-btn';
    const isCompleted = state.completedMissions[state.age].includes(i);
    if (isCompleted) btn.classList.add('completed');
    if (i === state.currentMission) btn.classList.add('active');
    btn.textContent = String(i + 1);
    btn.title = m.text;
    btn.addEventListener('click', () => selectMission(i));
    picker.appendChild(btn);
  });

  renderMissionText();
}

function selectMission(index) {
  state.currentMission = index;
  resetPet();
  renderMissionPicker();
  const m = MISSIONS[state.age][index];
  const personalized = m.text.replace(/dein Tier/g, state.petName).replace(/Dein Tier/g, state.petName);
  showSpeechBubble(personalized, 3500);
}

function renderMissionText() {
  const list = MISSIONS[state.age];
  if (!list || state.currentMission >= list.length) return;
  const m = list[state.currentMission];
  const isCompleted = state.completedMissions[state.age].includes(state.currentMission);
  const personalized = m.text.replace(/dein Tier/g, state.petName).replace(/Dein Tier/g, state.petName);
  els['mission-text'].textContent = isCompleted ? `✅ ${personalized}` : personalized;
}

function validateMission(mission, sequence) {
  if (mission.solution) {
    if (mission.solution.length !== sequence.length) return false;
    return mission.solution.every((val, i) => val === sequence[i]);
  }

  const atBowl = (state.petPos.x === state.bowlPos.x && state.petPos.z === state.bowlPos.z);
  const atBasket = (state.petPos.x === state.basketPos.x && state.petPos.z === state.basketPos.z);

  if (mission.validate === 'anyMove') {
    return sequence.some(card => DIRS[card]);
  }
  if (mission.validate === 'feedAtBowl') {
    return sequence.includes('feed') && atBowl;
  }
  if (mission.validate === 'sleepAtBasket') {
    return sequence.includes('sleep') && atBasket;
  }
  if (mission.validate === 'feedAndTrick') {
    return sequence.includes('feed') && atBowl && sequence.includes('trick');
  }
  if (mission.validate === 'moveAndPet') {
    return sequence.some(card => DIRS[card]) && sequence.includes('pet');
  }
  if (mission.validate === 'fiveCards') {
    return sequence.length >= 5;
  }
  return false;
}

/* ---------- Kartenausführung ---------- */

async function executeCard(id, chipEl) {
  if (chipEl) chipEl.classList.add('running');

  if (DIRS[id]) {
    await rotateToDir(id);
    const steps = id.endsWith('2') ? 2 : 1;
    const [dx, dz] = DIRS[id];
    let moved = 0;
    for (let i = 0; i < steps; i++) {
      const target = { x: state.petPos.x + dx, z: state.petPos.z + dz };
      if (target.x < 0 || target.x >= GRID || target.z < 0 || target.z >= GRID) {
        await bumpTowards(dx, dz);
        if (moved === 0) {
          showSpeechBubble('Autsch! 🧱 Da ist eine Wand. Versuch mal eine andere Richtung!');
          if (!state.missionMode) showDiscovery('wallBump');
        }
        break;
      }
      await moveTo(target);
      moved++;
    }
  } else if (id === 'hop') {
    await hopInPlace();
    spawnParticles('star');
    if (!state.missionMode) showDiscovery('hop');
  } else if (id === 'feed') {
    const atBowl = (state.petPos.x === state.bowlPos.x && state.petPos.z === state.bowlPos.z);
    if (atBowl && bowlFood.visible) {
      playSound('eat');
      await wiggle();
      bowlFood.visible = false;
      setTimeout(() => { bowlFood.visible = true; }, 4000);
      setMood(10);
      spawnParticles('heart');
      if (!state.missionMode) showDiscovery('feed');
    } else {
      playSound('thud');
      await wiggle();
      setMood(-4);
      showSpeechBubble(atBowl ? 'Der Napf ist gerade leer... warte kurz! 🍽️' : 'Hier ist kein Futter! 🗺️ Bring mich erst zum Napf!');
    }
  } else if (id === 'pet') {
    playSound('purr');
    await wiggle();
    setMood(8);
    spawnParticles('heart');
    if (!state.missionMode) showDiscovery('pet');
  } else if (id === 'sleep') {
    const atBasket = (state.age === 'adult' && state.petPos.x === state.basketPos.x && state.petPos.z === state.basketPos.z);
    playSound('purr');
    await squashSleep();
    if (atBasket) {
      setMood(15);
      spawnParticles('heart');
      spawnParticles('zzz');
      showSpeechBubble('Mmmh... so gemütlich im Körbchen! 🛏️💤', 3000);
    } else {
      setMood(8);
      spawnParticles('zzz');
    }
    if (!state.missionMode) showDiscovery('sleep');
  } else if (id === 'brush') {
    playSound('purr');
    await wiggle();
    setMood(8);
    spawnParticles('sparkle');
    if (!state.missionMode) showDiscovery('brush');
  } else if (id === 'trim') {
    playSound('click');
    await wiggle();
    setMood(6);
    if (!state.missionMode) showDiscovery('trim');
  } else if (id === 'trick') {
    playSound('success');
    await spinTrick();
    setMood(10);
    spawnParticles('note');
    spawnParticles('star');
    if (!state.missionMode) showDiscovery('trick');
  }

  if (chipEl) chipEl.classList.remove('running');
}

async function runSequence() {
  if (state.running || state.sequence.length === 0) return;
  state.running = true;
  els['run-btn'].disabled = true;
  
  if (state.sequence.length >= 10 && !state.missionMode) {
    showDiscovery('longSequence');
  }
  
  if (petHead) petHead.rotation.y = 0; // reset look around
  
  const chips = Array.from(els['sequence-bar'].querySelectorAll('.seq-chip'));
  document.querySelectorAll('.card-btn').forEach((b) => (b.disabled = true));

  for (let i = 0; i < state.sequence.length; i++) {
    await executeCard(state.sequence[i], chips[i]);
  }

  state.running = false;
  document.querySelectorAll('.card-btn').forEach((b) => (b.disabled = false));
  
  // Check Repeated Commands
  let repeated = 0;
  let lastCmd = null;
  for(const cmd of state.sequence) {
     if (cmd === lastCmd) repeated++;
     else repeated = 1;
     lastCmd = cmd;
     if (repeated >= 3) break;
  }

  // Evaluate Mission or Sandbox
  if (state.missionMode) {
    const list = MISSIONS[state.age];
    if (state.currentMission < list.length) {
      const mission = list[state.currentMission];
      if (validateMission(mission, state.sequence)) {
        // Mark as completed if not already
        if (!state.completedMissions[state.age].includes(state.currentMission)) {
          playSound('success');
          state.completedMissions[state.age].push(state.currentMission);
          state.stars += 1;
          updateXP();
          checkAccessoryUnlock();
          spawnConfetti();
          showSpeechBubble('Super gemacht! ⭐ Wähl die nächste Aufgabe!', 3000);
        } else {
          playSound('success');
          showSpeechBubble('Nochmal geschafft! 💪 Probier eine andere Aufgabe!', 2500);
        }

        // Check if ALL missions completed
        if (state.completedMissions[state.age].length === list.length) {
          setTimeout(() => {
            playSound('success');
            showSpeechBubble('Alle Aufgaben geschafft! 🎉🏆', 4000);
          }, 3200);
        }

        renderMissionPicker();
      } else {
        playSound('thud');
        showSpeechBubble(mission.hint || 'Versuch es noch einmal! 🤔');
      }
    }
  } else {
    if (repeated >= 3) {
      showSpeechBubble(`Das waren ${repeated} gleiche Befehle hintereinander – vielleicht mischen wir mal? 🤔`);
    } else {
      const msg = ['Super gemacht! 🌟', 'Toll programmiert! 💻', 'Dein Tier ist begeistert! 🎉', 'Perfekt ausgeführt! ✨'];
      showSpeechBubble(msg[Math.floor(Math.random() * msg.length)]);
    }
  }

  state.sequence = [];
  renderSequenceBar();

  // In mission mode: reset pet to start for next mission/retry
  if (state.missionMode) {
    setTimeout(() => resetPet(), 1200);
  }
}

/* ---------- Sprachsteuerung (Bonus) ---------- */

const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null;
let speechConsentGiven = false;

const VOICE_MAP = [
  [/hoch|rauf|oben/, 'up'], [/runter|unten/, 'down'],
  [/links/, 'left'], [/rechts/, 'right'],
  [/hüpf|spring/, 'hop'], [/futter|füttern|essen/, 'feed'],
  [/streichel|kuschel/, 'pet'], [/bürst/, 'brush'],
  [/schlaf/, 'sleep'], [/schneid|kralle/, 'trim'],
  [/kunststück|trick|zeig/, 'trick'],
];

function setupSpeech() {
  if (!SpeechRecognitionCtor) return;
  els['mic-btn'].hidden = false;
  els['mic-btn'].addEventListener('click', () => {
    if (!speechConsentGiven) {
      els['speech-consent'].hidden = false;
    } else {
      startListening();
    }
  });
  els['speech-consent-ok'].addEventListener('click', () => {
    speechConsentGiven = true;
    els['speech-consent'].hidden = true;
    startListening();
  });
  els['speech-consent-cancel'].addEventListener('click', () => {
    els['speech-consent'].hidden = true;
  });
}

function startListening() {
  if (state.running) return;
  recognizer = new SpeechRecognitionCtor();
  recognizer.lang = 'de-DE';
  recognizer.continuous = false;
  recognizer.interimResults = false;
  els['mic-btn'].classList.add('active');
  recognizer.onresult = (event) => {
    const said = event.results[0][0].transcript.toLowerCase();
    const match = VOICE_MAP.find(([re]) => re.test(said));
    if (match && CARD_SETS[state.age].includes(match[1])) {
      executeCard(match[1]);
    } else {
      showSpeechBubble(`"${said}" – das kennt dein Tier noch nicht.`);
    }
  };
  recognizer.onend = () => els['mic-btn'].classList.remove('active');
  recognizer.onerror = () => els['mic-btn'].classList.remove('active');
  recognizer.start();
}

/* ---------- Bewegungssensor (Bonus) ---------- */

let motionActive = false;
let lastShakeAt = 0;

function handleMotion(e) {
  const a = e.accelerationIncludingGravity || e.acceleration;
  if (!a) return;
  const magnitude = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
  const now = Date.now();
  if (magnitude > 28 && now - lastShakeAt > 900) {
    lastShakeAt = now;
    if (!state.running) {
      wiggle();
      setMood(6);
      showSpeechBubble('Schütteln = Bürsten! ✨');
      spawnParticles('sparkle');
      if (!state.missionMode) showDiscovery('brush');
    }
  }
}

function setupMotion() {
  els['motion-btn'].addEventListener('click', async () => {
    if (motionActive) return;
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== 'granted') { showSpeechBubble('Bewegungssensor nicht erlaubt.'); return; }
      } catch (e) { showSpeechBubble('Bewegungssensor nicht verfügbar.'); return; }
    }
    window.addEventListener('devicemotion', handleMotion);
    motionActive = true;
    els['motion-btn'].classList.add('active');
    showSpeechBubble('Bewegungssensor aktiv – schütteln zum Bürsten!');
  });
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  if (els['sound-btn']) {
    els['sound-btn'].textContent = state.soundEnabled ? '🔊' : '🔇';
    els['sound-btn'].title = state.soundEnabled ? 'Ton ausschalten' : 'Ton einschalten';
  }
}

function setupCustomizer() {
  document.querySelectorAll('.pet-type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pet-type-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.petType = btn.dataset.type || 'cat';
      if (!state.userSelectedColor) {
        const defColor = state.petType === 'dog' ? 'golden' : state.petType === 'bunny' ? 'white' : 'orange';
        selectPetColor(defColor);
      }
      playSound('click');
    });
  });

  document.querySelectorAll('.pet-color-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      if (color) {
        state.userSelectedColor = true;
        selectPetColor(color);
        playSound('click');
      }
    });
  });
}

function selectPetColor(colorId) {
  state.petColor = colorId;
  document.querySelectorAll('.pet-color-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.color === colorId);
  });
}

/* ---------- Ablauf / Init ---------- */

function startAge(age) {
  state.age = age;
  state.sequence = [];
  state.mood = 50;
  
  // Read pet name if provided
  const nameInput = document.getElementById('pet-name-input');
  if (nameInput && nameInput.value.trim()) {
    state.petName = nameInput.value.trim();
  } else {
    state.petName = state.petType === 'dog' ? 'Balu' : state.petType === 'bunny' ? 'Hoppel' : 'Mimi';
  }

  els['age-select'].hidden = true;
  els['game'].hidden = false;
  if (!renderer) {
    initScene();
    relocateBowl();
  } else {
    resetPet();
  }
  if (basketGroup) basketGroup.visible = (state.age === 'adult');
  renderCardTray();
  renderSequenceBar();
  setMood(0);
  updateXP();
  updateModeUI();
  onResize();
  showSpeechBubble(`Hallo! Ich bin ${state.petName}! 🐾`, 3500);
}

function backToSelect() {
  state.running = false;
  state.currentMission = 0;
  state.missionMode = true;
  els['game'].hidden = true;
  els['age-select'].hidden = false;
}

function init() {
  cacheEls();
  setupCustomizer();

  document.querySelectorAll('.age-card').forEach((btn) => {
    btn.addEventListener('click', () => startAge(btn.dataset.age));
  });
  
  if (els['back-btn']) els['back-btn'].addEventListener('click', backToSelect);
  if (els['run-btn']) els['run-btn'].addEventListener('click', runSequence);
  if (els['mode-toggle']) els['mode-toggle'].addEventListener('click', toggleMode);
  if (els['sound-btn']) els['sound-btn'].addEventListener('click', toggleSound);

  // Voice read-aloud buttons
  if (els['mission-speak-btn']) {
    els['mission-speak-btn'].addEventListener('click', () => {
      const text = els['mission-text']?.textContent || '';
      speakText(text);
    });
  }

  if (els['bubble-speak-btn']) {
    els['bubble-speak-btn'].addEventListener('click', (e) => {
      e.stopPropagation();
      const text = els['speech-bubble-text']?.textContent || '';
      speakText(text);
    });
  }

  setupSpeech();
  setupMotion();
}

document.addEventListener('DOMContentLoaded', init);
