# Klassenhaustier

Browserbasiertes Lernspiel für Kinder von 4 bis 10 Jahren. Kinder legen Symbolkarten in eine Reihe,
das virtuelle Haustier führt die Sequenz exakt so aus, wie sie gelegt wurde. Vermittelt zwei
Grundprinzipien der KI- und Programmier-Kompetenz: **Präzision** (ungenaue Anweisung = sichtbar
falsches Ergebnis) und **Sequenz** (Reihenfolge bestimmt den Ablauf).

Prototyp-Stand: 07.09.2026. Grundlage ist das Konzeptpapier `Klassenhaustier_Konzept_2026-09-07_v2`.

Teil der Spielesammlung **Medienpädagogik** — Übersicht mit allen vier Spielen:
https://dariusbaktus.github.io/medienpaedagogik/

## Starten

Kein Build-Schritt, keine Abhängigkeiten zu installieren. Entweder `index.html` direkt im Browser
öffnen oder einen beliebigen statischen Server im Projektordner starten:

```bash
python3 -m http.server 8123
```

Danach `http://localhost:8123` aufrufen. Für die Bonus-Modi (Mikrofon, Bewegungssensor) ist auf
echten Geräten HTTPS nötig.

## Aufbau

```
index.html      Seitenstruktur, Bildschirme, Overlay
css/style.css   Farbpalette, Layout, Touch-Größen
js/app.js       Karten, 3D-Szene, Sequenzausführung, Bonus-Modi
```

Three.js wird als klassisches Script von einem CDN geladen (Version r128, globales `THREE`).
Bewusst kein ES-Module-/Import-Map-Setup, damit die Seite auch auf älteren Tablet-Browsern lädt.

## Spielmechanik

- **Kartensteuerung** (Kernmechanik, läuft auf jedem Gerät): Karten antippen, sie erscheinen in der
  Sequenzleiste. Jede Karte dort kann vor dem Start beliebig oft wieder einzeln entfernt werden.
  Mit „Los!" läuft die Sequenz ohne Abbruchmöglichkeit bis zum Ende durch.
- **Bewegung**: 5×5-Raster. Ein Pfeil = ein Feld, Doppelpfeil (ab 7 Jahren) = zwei Felder. Am Rand
  stoppt das Tier sichtbar („Da geht es nicht weiter.").
- **Füttern**: gelingt nur, wenn das Tier auf dem Feld beim Napf steht – der zentrale
  Präzisions-Moment. Sonst passiert sichtbar nichts Sinnvolles und die Stimmung sinkt leicht.
- **Altersstufen**: 4–6 Jahre = 7 Karten (Richtungen, füttern, streicheln, schlafen legen),
  7–10 Jahre = 15 Karten (zusätzlich Doppelpfeile, hüpfen, bürsten, Krallen schneiden, Kunststück).

## Technische Entscheidungen

- **Echtes 3D (WebGL)** mit Low-Poly-Geometrie, ohne Shadow-Maps (stattdessen einfache
  Schatten-Blobs), Lambert- statt PBR-Materialien.
- **Geräte-Tier-Erkennung** (`detectLowTier`): bei ≤4 CPU-Kernen oder erkannt schwacher GPU wird
  Antialiasing abgeschaltet, die Pixel-Ratio auf 1 begrenzt und die Dekoration weggelassen. Die
  Schwellenwerte sind eine erste Heuristik und gehören auf echter Schul-Hardware nachjustiert.
- **Kein Speichern**: Der Tierzustand lebt nur in der laufenden Sitzung. Kein localStorage, kein
  Login, kein Server, kein Offline-Cache.
- **Sprachsteuerung** ist Bonus, nicht Voraussetzung: Der Button erscheint nur in Browsern, die die
  Web Speech API unterstützen (faktisch Chrome/Android). Vor der ersten Nutzung erscheint ein
  Datenschutzhinweis, weil die Audiodaten zur Erkennung an einen externen Dienst gehen.
- **iPad/Safari**: eigener „Bewegung aktivieren"-Button, der die seit iOS 13 nötige
  Sensor-Freigabe per Nutzergeste auslöst.

## Offene Punkte

- Finale Symbol-Liste je Altersstufe (aktuelle Icons sind funktionale Platzhalter)
- Charakterdesign des Tieres (aktuell Primitiv-Geometrie)
- Formulierung der Datenschutzhinweise für Schulen, inkl. Klärung, ob Testschulen den
  cloudbasierten Sprachmodus überhaupt zulassen
- Kalibrierung der Geräte-Tier-Schwellenwerte auf echten Schul-Tablets
- Testschule(n) für die erste Prototyp-Runde
