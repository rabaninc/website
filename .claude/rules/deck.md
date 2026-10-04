---
paths:
  - "app/components/pitch/**"
  - "app/**/about/page.tsx"
  - "werkzeuge/pitch-folien/**"
  - "werkzeuge/deck-film/**"
---

# Gestaltung: Pitch-Deck auf /about (`app/components/pitch/slide-stack.tsx`)

- /about ist genau das Bühnen-Pitch-Deck: neun Folien, auf der deutschen Seite die deutschen, auf der englischen die
  englischen, aus den PDFs auf ihr 16:9-Feld zugeschnitten (`werkzeuge/pitch-folien/`, Bilder in `public/pitch/`),
  daneben das Bühnen-Skript. Folien und Skript bleiben, wie sie gezeigt wurden (`AGENTS.md`).
- Kein weiterer Titel: Die h1 der Seite ist die Überschrift des Decks („Unser Pitch-Deck“); den Namen der Seite nennt
  nur die Navbar. Sonst steht nichts auf der Seite.
- Die Folien sind die Ausnahme von Salbei, Tinte und Weiß. Jede liegt auf `--hero`, wo ihr Rand nicht weiß ist auf
  ihrer eigenen Farbe (`ground`), mit `--slide-cast` und ohne Rahmenlinie.
- Ein Stapel, der beim Scrollen wächst: Jede Folie gleitet gerade von unten herein, ohne Drehung, und legt sich auf
  die vorige. Die früheren fahren aufrecht wie Gondeln eines Riesenrads hoch, nach hinten und über den Scheitel
  hinter den Stapel, ganz körperlich: Eine Folie zeigt, was keine vordere verdeckt. In Ruhe stehen vier Folien, ihre
  Oberkanten auf einem Kreis, die Logos schauen hervor. Die Maße stehen als Konstanten im Kopf der Datei.
- Die Bühne samt Überschrift klebt ab Seitenanfang, die erste Folie steht beim Öffnen an ihrem Platz.
- Breit (ab 1024px und auf jedem quer gehaltenen Bildschirm, Variante `deck-wide` in `app/globals.css`): Text rechts
  neben dem Deck. Handy hochkant: eine Spalte, Text unter dem Deck; jeder Text nimmt die größte Schrift zwischen 13
  und 11px, bei der er in seinen Kasten passt, und steht still. Nur wo 11px nicht reicht, scrollt er in seinem
  Kasten, solange seine Folie ruht, und erst danach dreht das Rad. Mit reduzierter Bewegung stehen die Folien
  untereinander, jede mit ihrem Text.
- Prüfen im Film: `werkzeuge/deck-film/`.
