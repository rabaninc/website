---
paths:
  - "app/components/footer.tsx"
  - "app/components/language-flip.tsx"
  - "app/components/view-flip.tsx"
---

# Gestaltung: Fußkarte (`app/components/footer.tsx`)

- Eine Karte, kein Balken, nach Personio: `--inset` von den Seiten, bündig am Seitenende (nur die oberen Ecken rund,
  40px), statisch (keine Bewegung beim Erscheinen). Statt einer Randlinie das Relief `--neu`: helles Licht von oben
  links, dunkler Fall nach unten rechts, beide Arme gleich schwer (Kommentar an `--neu` in `app/globals.css`).
- Innen: links oben der Satz der Karte in Salbei (`text-paper`), daneben die Spalten mit Mono-Labels (`LABEL`,
  `text-slab-ink/50`), dann Adresse und die Schalter Sprache und Ansicht; unten die Wortmarke, so breit wie die Karte
  (Größe in `cqw`) und von ihrer Unterkante angeschnitten.
- Spalten: „Rechtliches“ zuerst, dann „Raban“, dann „Kontakt“. Ihre linken Kanten stehen gleich weit auseinander
  (gleiche Rasterspalten); ab `xl` beginnt die erste dort, wo das „b“ der Wortmarke beginnt (42.49cqw).
- Gruppen und Links sind Daten in `T` oben in der Datei: eine neue Gruppe ist ein Eintrag, kein neues JSX.
  `footerMarkdown` schreibt dieselben Daten ans Ende jedes Markdowns.
- Links mit `LinkStyle tone="light" chrome`, 17px. Die Schalter (`app/components/language-flip.tsx`,
  `app/components/view-flip.tsx`) sind eine Familie: Kapsel mit Knopf in `currentColor`, das Wort auf dem Knopf in
  der Farbe der Karte, über `LinkStyle tone="light" icon highlight={false}`. Die Sprache steht in einem Cookie; die
  Ansicht speichert nichts (siehe `AGENTS.md`).
