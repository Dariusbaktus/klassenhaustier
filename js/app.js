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
  up: { group: 'move', label: 'Nach oben' },
  down: { group: 'move', label: 'Nach unten' },
  left: { group: 'move', label: 'Nach links' },
  right: { group: 'move', label: 'Nach rechts' },
  up2: { group: 'move', label: 'Zwei Schritte nach oben' },
  down2: { group: 'move', label: 'Zwei Schritte nach unten' },
  left2: { group: 'move', label: 'Zwei Schritte nach links' },
  right2: { group: 'move', label: 'Zwei Schritte nach rechts' },
  hop: { group: 'bonus', label: 'Hüpfen' },
  feed: { group: 'care', label: 'Füttern' },
  pet: { group: 'care', label: 'Streicheln' },
  sleep: { group: 'care', label: 'Schlafen legen' },
  brush: { group: 'care', label: 'Bürsten' },
  trim: { group: 'care', label: 'Krallen schneiden' },
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

/* ---------- Spielzustand ---------- */

const GRID = 5;
const TILE = 1.5;
const BOWL_POS = { x: 4, z: 2 };
const BOWL_OFFSET = 0.55;

const state = {
  age: null,
  sequence: [],
  running: false,
  mood: 50,
  petPos: { x: 2, z: 2 },
  fedRecently: false,
};

function gridToWorld(gx, gz) {
  const half = (GRID - 1) / 2;
  return { x: (gx - half) * TILE, z: (gz - half) * TILE };
}

/* ---------- Geräte-Tier-Erkennung (grobe Heuristik) ---------- */

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
  } catch (e) { /* Erkennung fehlgeschlagen -> als potenziell schwach behandeln */ }
  return cores <= 4 || weakGpu;
}

const LOW_TIER = detectLowTier();

/* ---------- Three.js Szene ---------- */

let renderer, scene, camera, petGroup, petEyes, bowlFood, shadowBlob;

function initScene() {
  const canvas = document.getElementById('scene');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW_TIER, alpha: true });
  renderer.setPixelRatio(LOW_TIER ? 1 : Math.min(window.devicePixelRatio, 2));

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(46, 1, 0.1, 50);
  camera.position.set(0, 6.4, 7.2);
  camera.lookAt(0, 0.4, 0);

  const hemi = new THREE.HemisphereLight(0xfbf7ff, 0x8fc79a, 0.85);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.35);
  dir.position.set(3, 6, 4);
  scene.add(dir);

  const groundSize = GRID * TILE + 1.2;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(groundSize, groundSize),
    new THREE.MeshLambertMaterial({ color: 0x86c294 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  if (!LOW_TIER) addDecoration();

  const bowlWorld = gridToWorld(BOWL_POS.x, BOWL_POS.z);
  const bowl = new THREE.Group();
  bowl.position.set(bowlWorld.x + BOWL_OFFSET, 0, bowlWorld.z);
  const bowlBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.28, 0.22, 16),
    new THREE.MeshLambertMaterial({ color: 0x46aeb8 })
  );
  bowlBody.position.y = 0.11;
  bowl.add(bowlBody);
  bowlFood = new THREE.Group();
  [[-0.1, 0.24, -0.05], [0.08, 0.26, 0.06], [0, 0.25, 0.1]].forEach(([x, y, z]) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 10, 10),
      new THREE.MeshLambertMaterial({ color: 0xefc04a })
    );
    dot.position.set(x, y, z);
    bowlFood.add(dot);
  });
  bowl.add(bowlFood);
  scene.add(bowl);

  const bowlShadow = makeShadowBlob(0.45);
  bowlShadow.position.set(bowlWorld.x + BOWL_OFFSET, 0.015, bowlWorld.z);
  scene.add(bowlShadow);

  buildPet();

  shadowBlob = makeShadowBlob(0.5);
  scene.add(shadowBlob);

  window.addEventListener('resize', onResize);
  onResize();
  requestAnimationFrame(tick);
}

function makeShadowBlob(radius) {
  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 })
  );
  blob.rotation.x = -Math.PI / 2;
  return blob;
}

function addDecoration() {
  const spots = [[-3.6, -3.6], [3.6, -3.6]];
  spots.forEach(([x, z]) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.13, 0.6, 8),
      new THREE.MeshLambertMaterial({ color: 0x9b8fa8 })
    );
    trunk.position.y = 0.3;
    const top = new THREE.Mesh(
      new THREE.ConeGeometry(0.55, 0.9, 10),
      new THREE.MeshLambertMaterial({ color: 0x6fbf8c })
    );
    top.position.y = 0.95;
    tree.add(trunk, top);
    tree.position.set(x, 0, z);
    scene.add(tree);
  });
}

function buildPet() {
  petGroup = new THREE.Group();
  const isBaby = state.age === 'baby';
  const bodyColor = isBaby ? 0x9fdcb4 : 0xb49ae0;
  const scaleF = isBaby ? 0.72 : 1.0;

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 18, 14),
    new THREE.MeshLambertMaterial({ color: bodyColor })
  );
  body.scale.set(1, 0.82, 1.25);
  body.position.y = 0.5;
  petGroup.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 16, 12),
    new THREE.MeshLambertMaterial({ color: bodyColor })
  );
  head.position.set(0, 0.78, 0.58);
  petGroup.add(head);

  const earMat = new THREE.MeshLambertMaterial({ color: bodyColor });
  [-0.2, 0.2].forEach((x) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 8), earMat);
    ear.position.set(x, 1.05, 0.58);
    ear.rotation.z = x < 0 ? 0.3 : -0.3;
    petGroup.add(ear);
  });

  const tail = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.42, 8),
    new THREE.MeshLambertMaterial({ color: bodyColor })
  );
  tail.position.set(0, 0.6, -0.72);
  tail.rotation.x = Math.PI / 2.6;
  petGroup.add(tail);

  petEyes = [];
  [-0.11, 0.11].forEach((x) => {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x3b3446 })
    );
    eye.position.set(x, 0.82, 0.86);
    petEyes.push(eye);
    petGroup.add(eye);
  });

  petGroup.scale.setScalar(scaleF);
  const world = gridToWorld(state.petPos.x, state.petPos.z);
  petGroup.position.set(world.x, 0, world.z);
  scene.add(petGroup);
}

function resetPet() {
  if (petGroup) scene.remove(petGroup);
  state.petPos = { x: 2, z: 2 };
  state.mood = 50;
  buildPet();
}

function onResize() {
  const wrap = document.getElementById('canvas-wrap');
  const w = wrap.clientWidth, h = wrap.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function tick() {
  if (petGroup && shadowBlob) {
    shadowBlob.position.set(petGroup.position.x, 0.015, petGroup.position.z);
  }
  renderer.render(scene, camera);
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

async function moveTo(targetGrid) {
  const from = petGroup.position.clone();
  const to3 = gridToWorld(targetGrid.x, targetGrid.z);
  const targetY = petGroup.position.y;
  await tween(450, (t) => {
    const e = easeInOut(t);
    petGroup.position.x = from.x + (to3.x - from.x) * e;
    petGroup.position.z = from.z + (to3.z - from.z) * e;
    petGroup.position.y = targetY + Math.sin(t * Math.PI) * 0.08;
  });
  state.petPos = targetGrid;
}

async function bumpTowards(dx, dz) {
  const from = petGroup.position.clone();
  await tween(220, (t) => {
    const e = Math.sin(t * Math.PI);
    petGroup.position.x = from.x + dx * 0.18 * e;
    petGroup.position.z = from.z + dz * 0.18 * e;
  });
  petGroup.position.copy(from);
}

async function hopInPlace() {
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

/* ---------- UI ---------- */

const els = {};

function cacheEls() {
  ['age-select', 'game', 'card-tray', 'sequence-bar', 'run-btn', 'mood-face',
    'mood-fill', 'toast', 'back-btn', 'motion-btn', 'mic-btn',
    'speech-consent', 'speech-consent-ok', 'speech-consent-cancel'
  ].forEach((id) => { els[id] = document.getElementById(id); });
}

function renderCardTray() {
  els['card-tray'].innerHTML = '';
  CARD_SETS[state.age].forEach((id) => {
    const def = CARD_DEFS[id];
    const btn = document.createElement('button');
    btn.className = `card-btn ${def.group}`;
    btn.innerHTML = ICONS[id];
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
    hint.textContent = 'Tippe Karten an, um eine Anweisung zu bauen.';
    bar.appendChild(hint);
  }
  state.sequence.forEach((id, i) => {
    const chip = document.createElement('button');
    chip.className = 'seq-chip';
    chip.innerHTML = ICONS[id];
    chip.title = 'Entfernen';
    chip.dataset.index = String(i);
    chip.disabled = state.running;
    chip.addEventListener('click', () => removeFromSequence(i));
    bar.appendChild(chip);
  });
  els['run-btn'].disabled = state.sequence.length === 0 || state.running;
}

function addToSequence(id) {
  if (state.running) return;
  state.sequence.push(id);
  renderSequenceBar();
}

function removeFromSequence(index) {
  if (state.running) return;
  state.sequence.splice(index, 1);
  renderSequenceBar();
}

function setMood(delta) {
  state.mood = Math.max(0, Math.min(100, state.mood + delta));
  els['mood-fill'].style.width = state.mood + '%';
  els['mood-fill'].style.background = state.mood < 30 ? '#dd76a8' : state.mood < 70 ? '#efc04a' : '#5fae7e';
  els['mood-face'].textContent = state.mood < 30 ? '😕' : state.mood < 70 ? '🙂' : '😄';
}

let toastTimer = null;
function showToast(msg) {
  const t = els['toast'];
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- Kartenausführung ---------- */

async function executeCard(id, chipEl) {
  if (chipEl) chipEl.classList.add('running');

  if (DIRS[id]) {
    const steps = id.endsWith('2') ? 2 : 1;
    const [dx, dz] = DIRS[id];
    let moved = 0;
    for (let i = 0; i < steps; i++) {
      const target = { x: state.petPos.x + dx, z: state.petPos.z + dz };
      if (target.x < 0 || target.x >= GRID || target.z < 0 || target.z >= GRID) {
        await bumpTowards(dx, dz);
        if (moved === 0) showToast('Da geht es nicht weiter.');
        break;
      }
      await moveTo(target);
      moved++;
    }
  } else if (id === 'hop') {
    await hopInPlace();
  } else if (id === 'feed') {
    const atBowl = state.petPos.x === BOWL_POS.x && state.petPos.z === BOWL_POS.z;
    if (atBowl && bowlFood.visible) {
      await wiggle();
      bowlFood.visible = false;
      setTimeout(() => { bowlFood.visible = true; }, 4000);
      setMood(10);
      showToast('Lecker!');
    } else {
      await wiggle();
      setMood(-4);
      showToast(atBowl ? 'Der Napf ist gerade leer.' : 'Hier gibt es kein Futter.');
    }
  } else if (id === 'pet') {
    await wiggle();
    setMood(8);
  } else if (id === 'sleep') {
    await squashSleep();
    setMood(8);
  } else if (id === 'brush') {
    await wiggle();
    setMood(8);
  } else if (id === 'trim') {
    await wiggle();
    setMood(6);
  } else if (id === 'trick') {
    await spinTrick();
    setMood(10);
  }

  if (chipEl) chipEl.classList.remove('running');
}

async function runSequence() {
  if (state.running || state.sequence.length === 0) return;
  state.running = true;
  els['run-btn'].disabled = true;
  const chips = Array.from(els['sequence-bar'].children);
  document.querySelectorAll('.card-btn').forEach((b) => (b.disabled = true));

  for (let i = 0; i < state.sequence.length; i++) {
    await executeCard(state.sequence[i], chips[i]);
  }

  state.running = false;
  state.sequence = [];
  document.querySelectorAll('.card-btn').forEach((b) => (b.disabled = false));
  renderSequenceBar();
  showToast('Fertig!');
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
      showToast(`"${said}" – das kennt dein Tier noch nicht.`);
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
      showToast('Schütteln = Bürsten!');
    }
  }
}

function setupMotion() {
  els['motion-btn'].addEventListener('click', async () => {
    if (motionActive) return;
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== 'granted') { showToast('Bewegungssensor nicht erlaubt.'); return; }
      } catch (e) { showToast('Bewegungssensor nicht verfügbar.'); return; }
    }
    window.addEventListener('devicemotion', handleMotion);
    motionActive = true;
    els['motion-btn'].classList.add('active');
    showToast('Bewegungssensor aktiv – schütteln zum Bürsten!');
  });
}

/* ---------- Ablauf / Init ---------- */

function startAge(age) {
  state.age = age;
  state.sequence = [];
  state.mood = 50;
  els['age-select'].hidden = true;
  els['game'].hidden = false;
  if (!renderer) initScene(); else resetPet();
  renderCardTray();
  renderSequenceBar();
  setMood(0);
  onResize();
}

function backToSelect() {
  state.running = false;
  els['game'].hidden = true;
  els['age-select'].hidden = false;
}

function init() {
  cacheEls();
  document.querySelectorAll('.age-card').forEach((btn) => {
    btn.addEventListener('click', () => startAge(btn.dataset.age));
  });
  els['back-btn'].addEventListener('click', backToSelect);
  els['run-btn'].addEventListener('click', runSequence);
  setupSpeech();
  setupMotion();
}

document.addEventListener('DOMContentLoaded', init);
