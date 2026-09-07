/* Info-Reiter für dieses Spiel — Texte hier anpassen. */
window.MP_INFO = {
  id: 'klassenhaustier',
  emoji: '🐹',
  titel: 'Klassenhaustier',
  untertitel: 'Der Computer macht genau das, was du sagst',
  zielgruppe: 'Kita & Grundschule · 4–10 Jahre',
  dauer: '15–30 Minuten',
  technik: 'Läuft im Browser',
  worumGehts: 'Du bekommst ein eigenes Haustier — Katze, Hund oder Hase — und legst Karten in eine Reihe: nach oben, nach rechts, füttern, streicheln. Dann führt das Tier die ganze Reihe aus. Genau so, wie sie daliegt.',
  ablauf: [
    'Tier aussuchen, Namen und Fellfarbe festlegen.',
    'Karten antippen — sie reihen sich unten auf.',
    'Karten, die nicht passen, einzeln wieder wegnehmen.',
    'Auf „Los!" tippen — jetzt läuft die ganze Reihe durch, ohne Stopp.'
  ],
  lernziel: 'Füttern klappt nur, wenn das Tier wirklich beim Napf steht. Steht es daneben, passiert sichtbar nichts — und niemand schimpft. Das ist der Kern: Ein Computer errät nicht, was gemeint war. Reihenfolge und Genauigkeit entscheiden. Dieselbe Einsicht braucht man später beim Programmieren und beim Formulieren von KI-Anweisungen.',
  uebersichtUrl: 'https://dariusbaktus.github.io/medienpaedagogik/'
};

/* ==========================================================================
   Info-Reiter — generische Engine (in allen Spielen identisch)
   Zeigt beim ersten Besuch automatisch eine Erklärung, danach jederzeit
   über den Reiter unten links wieder aufrufbar.
   ========================================================================== */
(function () {
  'use strict';

  var K = window.MP_INFO;
  if (!K || document.getElementById('mp-info-root')) return;

  var GESEHEN = 'mp-info-gesehen:' + K.id;

  /* localStorage kann in Privatfenstern werfen – nie den Start blockieren */
  function schonGesehen() {
    try { return window.localStorage.getItem(GESEHEN) === '1'; } catch (e) { return false; }
  }
  function merken() {
    try { window.localStorage.setItem(GESEHEN, '1'); } catch (e) { /* egal */ }
  }

  var css = '\
#mp-info-root, #mp-info-root * { box-sizing: border-box; }\
#mp-info-root {\
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;\
  --mp-gruen: #2f7d5d; --mp-gruen-hell: #47a67d; --mp-lila: #6b4ea8;\
  --mp-lila-hell: #8f74c9; --mp-teal: #2a9d9c; --mp-gelb: #e0ad3c;\
  --mp-tinte: #23203a; --mp-grau: #5d5975; --mp-papier: #ffffff;\
  --mp-sanft: #f4f1fa;\
}\
#mp-info-tab {\
  position: fixed; left: 14px; bottom: 14px; z-index: 2147483000;\
  display: inline-flex; align-items: center; gap: 8px;\
  padding: 10px 16px; border: 0; border-radius: 999px;\
  background: linear-gradient(135deg, var(--mp-gruen), var(--mp-lila));\
  color: #fff; font-size: 14px; font-weight: 600; font-family: inherit;\
  cursor: pointer; box-shadow: 0 4px 16px rgba(35,32,58,.24);\
  transition: transform .18s ease, box-shadow .18s ease;\
}\
#mp-info-tab:hover { transform: translateY(-2px); box-shadow: 0 7px 22px rgba(35,32,58,.3); }\
#mp-info-tab:focus-visible { outline: 3px solid var(--mp-gelb); outline-offset: 2px; }\
#mp-info-backdrop {\
  position: fixed; inset: 0; z-index: 2147483001;\
  background: rgba(35,32,58,.55); backdrop-filter: blur(3px);\
  display: flex; align-items: center; justify-content: center; padding: 20px;\
  opacity: 0; transition: opacity .22s ease;\
}\
#mp-info-backdrop[hidden] { display: none !important; }\
#mp-info-backdrop.mp-sichtbar { opacity: 1; }\
#mp-info-karte {\
  position: relative; width: 100%; max-width: 560px; max-height: 88vh; overflow-y: auto;\
  background: var(--mp-papier); color: var(--mp-tinte); border-radius: 20px;\
  box-shadow: 0 18px 50px rgba(35,32,58,.32); text-align: left;\
  transform: translateY(12px) scale(.98); transition: transform .22s ease;\
}\
#mp-info-backdrop.mp-sichtbar #mp-info-karte { transform: none; }\
#mp-info-kopf {\
  padding: 26px 26px 20px; border-radius: 20px 20px 0 0; color: #fff;\
  background: linear-gradient(135deg, var(--mp-gruen) 0%, var(--mp-teal) 45%, var(--mp-lila) 100%);\
}\
#mp-info-kopf .mp-emoji { font-size: 34px; line-height: 1; display: block; margin-bottom: 10px; }\
#mp-info-kopf h2 { margin: 0 0 4px; font-size: 23px; font-weight: 700; line-height: 1.2; color: #fff; }\
#mp-info-kopf p { margin: 0; font-size: 14.5px; opacity: .93; line-height: 1.45; color: #fff; }\
#mp-info-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }\
#mp-info-meta span {\
  background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.28);\
  padding: 4px 11px; border-radius: 999px; font-size: 12.5px; font-weight: 600; color: #fff;\
}\
#mp-info-koerper { padding: 22px 26px 26px; }\
#mp-info-koerper h3 {\
  margin: 0 0 8px; font-size: 12px; font-weight: 700; letter-spacing: .09em;\
  text-transform: uppercase; color: var(--mp-lila);\
}\
#mp-info-koerper h3:not(:first-child) { margin-top: 22px; }\
#mp-info-koerper p { margin: 0; font-size: 15px; line-height: 1.62; color: var(--mp-grau); }\
#mp-info-koerper ol { margin: 0; padding-left: 21px; }\
#mp-info-koerper ol li { font-size: 15px; line-height: 1.55; color: var(--mp-grau); margin-bottom: 7px; }\
#mp-info-koerper ol li::marker { color: var(--mp-teal); font-weight: 700; }\
#mp-info-lernziel {\
  margin-top: 22px; padding: 15px 17px; border-radius: 13px;\
  background: var(--mp-sanft); border-left: 4px solid var(--mp-gruen-hell);\
}\
#mp-info-lernziel strong { display: block; font-size: 12px; letter-spacing: .09em;\
  text-transform: uppercase; color: var(--mp-gruen); margin-bottom: 5px; }\
#mp-info-lernziel span { font-size: 14.5px; line-height: 1.55; color: var(--mp-tinte); }\
#mp-info-fuss { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }\
#mp-info-fuss a, #mp-info-fuss button {\
  flex: 1 1 auto; text-align: center; padding: 12px 18px; border-radius: 12px;\
  font-size: 14.5px; font-weight: 600; font-family: inherit; cursor: pointer;\
  text-decoration: none; border: 0; transition: filter .16s ease;\
}\
#mp-info-fuss button { background: linear-gradient(135deg, var(--mp-gruen), var(--mp-lila)); color: #fff; }\
#mp-info-fuss a { background: var(--mp-sanft); color: var(--mp-lila); border: 1px solid #e2dcf1; }\
#mp-info-fuss a:hover, #mp-info-fuss button:hover { filter: brightness(1.07); }\
#mp-info-schliessen {\
  position: absolute; top: 15px; right: 15px; width: 34px; height: 34px;\
  border: 0; border-radius: 50%; background: rgba(255,255,255,.22); color: #fff;\
  font-size: 19px; line-height: 1; cursor: pointer; font-family: inherit;\
}\
#mp-info-schliessen:hover { background: rgba(255,255,255,.36); }\
@media (max-width: 520px) {\
  #mp-info-kopf { padding: 22px 20px 17px; } #mp-info-koerper { padding: 19px 20px 22px; }\
  #mp-info-kopf h2 { font-size: 20px; } #mp-info-tab { left: 10px; bottom: 10px; padding: 9px 14px; font-size: 13px; }\
}\
@media (prefers-reduced-motion: reduce) {\
  #mp-info-tab, #mp-info-backdrop, #mp-info-karte { transition: none !important; }\
}';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var wurzel = document.createElement('div');
  wurzel.id = 'mp-info-root';

  var stil = document.createElement('style');
  stil.textContent = css;
  wurzel.appendChild(stil);

  var schritte = (K.ablauf || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
  var meta = [K.zielgruppe, K.dauer, K.technik].filter(Boolean)
    .map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('');

  wurzel.insertAdjacentHTML('beforeend',
    '<button id="mp-info-tab" type="button" aria-haspopup="dialog">' +
      '<span aria-hidden="true">ℹ️</span><span>Was ist das?</span>' +
    '</button>' +
    '<div id="mp-info-backdrop" hidden role="dialog" aria-modal="true" aria-labelledby="mp-info-titel">' +
      '<div id="mp-info-karte">' +
        '<div id="mp-info-kopf">' +
          '<button id="mp-info-schliessen" type="button" aria-label="Schließen">✕</button>' +
          '<span class="mp-emoji" aria-hidden="true">' + esc(K.emoji) + '</span>' +
          '<h2 id="mp-info-titel">' + esc(K.titel) + '</h2>' +
          '<p>' + esc(K.untertitel) + '</p>' +
          (meta ? '<div id="mp-info-meta">' + meta + '</div>' : '') +
        '</div>' +
        '<div id="mp-info-koerper">' +
          '<h3>Worum geht es?</h3><p>' + esc(K.worumGehts) + '</p>' +
          (schritte ? '<h3>So läuft es ab</h3><ol>' + schritte + '</ol>' : '') +
          '<div id="mp-info-lernziel"><strong>Das steckt dahinter</strong><span>' + esc(K.lernziel) + '</span></div>' +
          '<div id="mp-info-fuss">' +
            '<button id="mp-info-los" type="button">Los geht\'s</button>' +
            '<a href="' + esc(K.uebersichtUrl) + '">Alle Spiele ansehen</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>');

  (document.body || document.documentElement).appendChild(wurzel);

  var backdrop = wurzel.querySelector('#mp-info-backdrop');
  var tab = wurzel.querySelector('#mp-info-tab');
  var zu = wurzel.querySelector('#mp-info-schliessen');
  var los = wurzel.querySelector('#mp-info-los');

  function oeffnen() {
    backdrop.hidden = false;
    requestAnimationFrame(function () { backdrop.classList.add('mp-sichtbar'); });
    zu.focus();
  }
  function schliessen() {
    backdrop.classList.remove('mp-sichtbar');
    merken();
    window.setTimeout(function () { backdrop.hidden = true; }, 220);
    tab.focus();
  }

  tab.addEventListener('click', oeffnen);
  zu.addEventListener('click', schliessen);
  los.addEventListener('click', schliessen);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) schliessen(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !backdrop.hidden) schliessen();
  });

  if (!schonGesehen()) oeffnen();
})();
