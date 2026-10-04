---
paths:
  - "app/components/navbar.tsx"
  - "app/components/section-index.tsx"
  - "app/**/legal/page.tsx"
  - "app/**/privacy/page.tsx"
---

# Gestaltung: Navbar und Abschnitts-Index

## Navbar (`app/components/navbar.tsx`)

- Milchglas: Schleier aus `--frost` (das Salbei der Seite) von /40 nach /15 und 24px Unschärfe über die Utility
  `frost` aus `app/globals.css`, nie Tailwinds `backdrop-blur-*` (macOS-Safari verwirft dessen var()-Kette);
  `frost-none` schaltet sie ab. Kein `backdrop-saturate`. Leiser heißt: weniger Füllung, nicht weniger Unschärfe.
- Kante: kein `border-b`, allein `--edge-polish`, ein innerer Schatten (folgt der Rundung, ein Verlaufsrand nicht),
  dazu `--lift`, lang und blass. Beide schwach halten.
- Ecken: `rounded-b-[var(--radius)]`, einfache Kreisbögen wie ein macOS-Fenster, kein `corner-shape`.
- Telefon: Menü und Abschnittsleiste sind ein Blatt unter der Leiste, das Menü direkt darunter, die Abschnittsleiste
  darunter. Ist eines offen, gibt die Leiste Milchglas, Schatten und Rundung an das Blatt ab (`frost-none`,
  `shadow-none`, `rounded-b-none`), damit nichts doppelt liegt.
- `touch-pinch-zoom` steht auf den Flächen (Leiste und Blatt), nie auf dem klebenden Wrapper und nicht auf dem
  unsichtbaren Hintergrund zum Schließen: sonst sperrt ein offenes Menü den ganzen Bildschirm.
- Links mit `LinkStyle chrome`, Schrift 16px (`text-base`). Die Ziele stehen einmal in `NAV_LINKS` (Leiste, Menü und
  Brotkrumen lesen dieselbe Liste), dazu „Anmelden“ als Link auf die App.
- Das Wandern der klebenden Leiste auf iOS nicht durch Weglassen von Milchglas oder Federn oder durch ein `transform`
  umgehen; beides macht es schlimmer (Kommentar an html und body in `app/globals.css`).

## Abschnitts-Index (`app/components/section-index.tsx`, auf /privacy und /legal)

- Raster mit drei Spuren `grid-cols-[1fr_minmax(0,var(--measure))_1fr]`: das Dokument in der Mitte, der Index im
  linken Rand. Nicht als zentrierte Flex-Reihe bauen (das zentriert das Paar statt des Texts), keine Spaltenlücke
  (`gap-x`).
- Die Überschrift hat eine eigene Rasterzeile; Index und Text stehen in Zeile 2 mit `items-baseline`, so teilen
  erster Eintrag und erste Textzeile eine Grundlinie. Kein `self-start` am Index, kein Versatz per Rand.
- Ab `xl` als Spalte, darunter als zweite Zeile der Navbar (aufklappbar, mit Winkel statt `+`); immer genau einer.
  Die Leiste nimmt keinen Platz im Fluss: Die Seiten halten ihre Zeile frei (`max-xl:pt-…`, passendes `scroll-mt`).
- Abschnitte sind Daten (`id`, `title`, Inhalt): Index und `<h2>` kommen aus derselben Liste, die Nummern aus der
  Position.
- Einträge 12px, in Ruhe `text-ink/50`, bei Hover oder aktuell `text-ink`. Abstand als `py-2` auf `block`-Einträgen
  in einer `w-max`-Spalte, damit die Trefferflächen lückenlos aneinanderstoßen. Nicht über `LinkStyle`.
- Ein Klick heftet die Markierung, bis der Leser selbst scrollt (gelöst bei `wheel`, `touchmove`, `keydown`, nie bei
  `scroll`). Index und Leiste sprechen über die Ereignisse `raban-sections` und `raban-section-pin`.
