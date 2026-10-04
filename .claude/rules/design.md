---
paths:
  - "app/globals.css"
  - "app/components/type.ts"
  - "app/components/**/*.tsx"
  - "app/**/layout.tsx"
  - "app/**/page.tsx"
  - "app/**/address.tsx"
  - "app/*.tsx"
---

# Gestaltung: Grundlagen

Was nur ein Bauteil betrifft, steht in dessen Datei daneben. Im Zweifel gilt der Code: die Tokens in
`app/globals.css` und die Kommentare an den Bauteilen, die auch die Gründe tragen. Neue Regeln kommen in die Datei
ihres Bauteils, als Anweisung ohne Verlauf. Vorbilder: typesafe.ai (Stil, Farben), x.ai/build (App-Fenster),
Personio (Fußkarte). Einfach halten: die kleinste Änderung, die passt.

## Farben

- Jede Farbe ist ein Token in `app/globals.css` und steht nirgends sonst. Der Rest nutzt die Tailwind-Farben, die
  `@theme inline` daraus macht (`text-ink`, `bg-paper`, `bg-slab`, `border-ink/10`); `inline` bleibt, sonst backt
  Tailwind den heutigen Wert ein. Ausnahmen: `neutral-500` (Hover von Navbar und Fußkarte), die Icons
  (`app/icon.svg`, `app/apple-icon.tsx`), Masken und die Randfarbe einer Folie (`ground` in
  `app/(public)/about/copy.tsx`).
- Palette: `--paper` (Salbei) ist die Fläche jeder Seite, auch des Heros. `--ink` (fast Schwarz) ist aller Text und
  die Fußkarte (`--slab`), deren Schrift Weiß (`--slab-ink`). `--hero` (Weiß) liegt nur unter den Folien auf /about.
  Der Globus nimmt Mischungen aus Salbei und Tinte (`--globe-*`), die App-Fenster die Farben der App (`--app-*`,
  `--light-*`). Die Folien sind Bilder des Decks. Sonst keine Farbe.
- Ein Thema, hell: `color-scheme: light` bleibt auf `:root`; keine `dark:`-Klasse, kein `theme-color`-Meta.

## Schrift

- SF vom System des Besuchers (`-apple-system, BlinkMacSystemFont`), sonst Inter über next/font, nicht vorgeladen; SF
  wird nie ausgeliefert (Lizenz). Nie `system-ui` in den Stapel (Windows nähme Segoe UI). Labels in SF Mono
  (`ui-monospace`), sonst JetBrains Mono.
- Überschriften nur mit den Klassen aus `app/components/type.ts` (DISPLAY, SECTION, H1, H2, dazu LABEL, TAG, BODY,
  BARE), keine neuen Größen. Überschriften sind `font-medium` (Token 570), Fließtext 440. Englische Überschriften in
  Title Case (`[&:lang(en)]:capitalize`), deutsche mit ihren eigenen Großbuchstaben.
- Die Typo-Skala hat einen Umbruch bei 640px: darunter werden `--h1` und `--h2` kleiner, `--h2-line` bleibt.
  DISPLAY und SECTION sind fließend (`clamp`).
- Text in `<main>` trägt typesafes halben Pixel Kontur (`-webkit-text-stroke`); nicht Überschriften (`font-medium`),
  `nav`, `figure`, SVG und mit BARE markierter Text.

## Raster und Seitenaufbau

- Maße von Chrom und Abständen sind Vielfache von 8px; einzige Ausnahme `--radius` (28px, genau die halbe `--nav-h`)
  und `--gutter`, das ihm folgt. Ändert sich `--nav-h`, folgt `--radius`. Schriftgrößen folgen der Typo-Skala.
- Chrom (Navbar, Hero der Startseite) hält `--gutter` zum Bildschirmrand; Inhalt (`<main>`, auf der Startseite ihre
  Abschnitte, die Fußkarte) hält `--inset` (64px ab 640px, darunter `--gutter`).
- Seiten mit Überschrift oben öffnen mit `pt-[var(--content-top)]` und schließen mit `pb-[var(--inset)]`; zwischen
  Überschrift und Inhalt und zwischen Abschnitten höchstens `--header-gap`. Immer die Variablen, nie feste Werte.
- Überlauf mit `overflow-clip`, nie `overflow-hidden`: das machte einen Scroll-Container und verankerte den klebenden
  Index neu (Inhalt in `app/(public)/layout.tsx`, `overflow-x: clip` auf html und body).

## Flächen und Schatten

- Inhalt ist flach. Schatten gibt es an vier Stellen, je mit eigenem Token: Navbar (`--lift`, `--edge-polish`),
  App-Fenster (`--window-cast`), Folien auf /about (`--slide-cast`), Fußkarte (`--neu`). Keine weiteren.
- Wo ein Effekt physisch ist (das Milchglas der Navbar), wird er echt gebaut, nicht gemalt.
- Keine Serifenschrift und keine Terminal-Metaphern ohne Rückfrage bei den Gründern.

## Links (`app/components/link-style.tsx`)

- Links und Knöpfe laufen über `LinkStyle`, und jedes Steuerelement zeigt sich genau einmal als solches: der
  Hover-Kasten (Standard, etwa auf 404 und der Fehlerseite); `chrome`, volle Tinte und beim Hover `neutral-500`
  (Navbar und Fußkarte); `icon highlight={false}`, gar keine Markierung (Sprach- und Ansichtsschalter, ihr Knopf ist
  die Antwort). `highlight={false}` ohne `icon` heißt halbe Tinte, die beim Hover voll wird. Ein Zeichen (Glyphe)
  bekommt nie halbe Tinte.
- Hover rastet ohne Übergang ein; `active:` spiegelt `hover:` für Touch. Unter `lg` wächst jede Trefferfläche um 8px
  je Seite, mit gleich großen negativen Rändern. In gestapelten Listen ist ein Link eine ganze Zeile (`block`), der
  Abstand `py` auf der Zeile, nie `gap` an der Liste.
- Der unterstrichene Aufruf (Startseite, Adresse auf /contact) läuft nicht über `LinkStyle`: Unterstrich in Ruhe,
  beim Hover `text-ink/60`.
