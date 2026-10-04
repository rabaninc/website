---
paths:
  - "app/*/page.tsx"
  - "app/components/home/**/*.tsx"
  - "app/components/globe*.tsx"
  - "werkzeuge/fenster-fotos/**"
---

# Gestaltung: Startseite und App-Fenster

- Was die Startseite zeigt, steht in `STAND.md`, die Texte in `app/(public)/copy.ts` und
  `app/components/home/window/content.ts`.
- Hero auf Salbei, in Tinte, auf `--gutter`: Leitsatz oben links (fest gesetzte Zeilen), kurzer Text unten rechts,
  der Globus dahinter, sein Mittelpunkt bei `--hero-marker`. Die Höhe des Globus-Abschnitts muss zu `getEndScale()` in
  `app/components/globe-map.tsx` passen, sonst entsteht eine Lücke.
- Abschnitte (`Section` in `app/(public)/page.tsx`): `--inset` zur Seite, oben und unten 120px (ab `md`), Klammern an
  den Ecken (`app/components/home/brackets.tsx`). Ein folgender Abschnitt rückt 1px hoch, damit seine Klammern auf
  derselben Pixelzeile liegen wie die darüber.
- Typesafes Möbel, und nur so viel: Klammern, Haarlinien-Spalten (`border-l`) unter Mono-Labels, gepunktetes Papier
  (`--grid-dots`) hinter den App-Fenstern, große Zahlen für Preise, Fragen in Mono mit großen Antworten
  (`app/components/home/faq.tsx`), ein unterstrichener Link in Überschriftgröße als Aufruf. Keine Retro-Pixel-Fenster,
  keine Raster-Kunst: Globus und App-Fenster sind die einzigen Bilder.
- Panel (`app/components/home/panel.tsx`): gepunktetes Papier, Mono-`TAG` in der Ecke, die Klammern auf der Kante
  des Panels, die Punkte 8px innen; so stehen Panel- und Abschnittsklammern auf einer Linie.
- Die fünf Zeilen: Fenster und Text im Wechsel links und rechts.

## App-Fenster (`app/components/home/app-window.tsx`, Szenen in `app/components/home/window/`)

- Gezeichnet, keine Bildschirmfotos: die App in echter Größe (Fenster 1280 × 800, Menü in seiner schmalsten Breite
  220px, Schrift, Zeilen und Abstände der App), einmal gesetzt und als Ganzes auf die Breite skaliert (`.app-canvas`
  in `app/globals.css`). So sind alle gleich groß, umbrechen wie in der App und stehen in der Sprache der Seite.
- Farben der App (`--app-*`), Schatten `--window-cast`. Die drei Lichter wie an einem echten macOS-Fenster gemessen:
  12px, 20px Abstand, Mitte 20px vom linken und oberen Rand, nur Füllung (`--light-*`), kein dunkler Rand.
- Jede Szene spielt einmal ab, wenn sie ins Bild kommt, und bleibt auf ihrem letzten Bild; ohne Skript, mit
  reduzierter Bewegung oder schon sichtbar steht gleich das fertige Bild.
- Für Hilfstechnik ist ein Fenster ein Bild: das Fenster verborgen, die Beschreibung der Zeile als Bildunterschrift;
  im Markdown steht sie als Alt-Text.
- Inhalte erfunden (eine Faltschachtel-Fertigung, Konto Johannes Koch in der Firma „Raban“). Die zwei echten Fotos
  (`public/fenster/`) stammen aus freien Bildarchiven, nicht aus einem Betrieb, mit dem Raban arbeitet; geholt und
  zugeschnitten von `werkzeuge/fenster-fotos/zuschneiden.py`, Quellen und Lizenz dort, fremde Marken weichgezeichnet.
