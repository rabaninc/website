Stand: was gerade auf raban.ai zu sehen ist, je Seite (wird überschrieben, nicht fortgeschrieben; höchstens 8.000 Zeichen)

# Seitenstand der Website

Regeln in `AGENTS.md`, Gestaltung unter `.claude/rules/`, die Texte in den `copy.ts(x)` der Seiten. Hier steht nur,
was die Seiten gerade zeigen. Wer etwas daran ändert, überschreibt die Zeile im selben Commit.

## Alle Seiten

- Live auf raban.ai; jeder Push auf `main` geht über Vercel live.
- Deutsch und Englisch: die Sprache des Browsers, sonst Deutsch, bis jemand in der Fußkarte umschaltet (Cookie).
  Jede Seite steht auf Salbei, Anrede „Du“.
- Navbar: links „Raban“ und die Brotkrumen, rechts „Über uns“, „Kontakt“ und „Anmelden“ (Link auf
  https://app.raban.ai); auf dem Handy hinter einem `+`.
- Fußkarte: der Satz „Wissen was bleibt.“, die Spalten „Rechtliches“ (Datenschutz, Impressum), „Raban“ (Über uns,
  Kontakt, Anmelden) und „Kontakt“ (humans@raban.ai), darunter die Schalter Sprache und Ansicht (Mensch | Agent),
  unten die Wortmarke.
- Titel: Jede Seite trägt im Tab und in Suchergebnissen ihren eigenen, denselben wie im Markdown („Raban - Über uns“
  …, die Startseite „Raban - Wissen was bleibt“).
- Eine falsche Adresse zeigt „Seite nicht gefunden“ mit einem Link zur Startseite, im Rahmen jeder Seite mit Fußkarte
  (`app/not-found.tsx`). `/product` leitet auf `/#so-arbeitet-raban` um.
- Linkvorschau (iMessage, WhatsApp, Slack, LinkedIn) in der Sprache des Besuchers: Texte in `app/preview.ts`, Bilder
  in `public/vorschau/`.
- Favicon: dasselbe Zeichen wie im Vorprojekt der Gründer; `app/favicon.ico` ist `app/icon.svg` in mehreren Größen.

## Startseite (/)

1. Hero: Leitsatz oben links, Globus dahinter mit dem Land des Besuchers in der Sprache der Seite (ohne Edge-Header
   Deutschland), kurzer Text unten rechts.
2. „Warum Raban“: das Problem als eine große Aussage, darunter drei Grundsätze.
3. „So arbeitet Raban“ (`#so-arbeitet-raban`): fünf Zeilen, je ein gezeichnetes App-Fenster und der Text daneben,
   im Wechsel links und rechts: 01 Aufzeichnen, 02 Fragen (Raban zeigt den Plan), 03 Nachfragen (bei dem Menschen,
   der es weiß), 04 Erledigen (Raban erledigt einen Schritt selbst), 05 Anschließen (woraus eine Aufgabe schöpft:
   Systeme, die die Firma einmal anschließt und je Aufgabe wählt, Dateien, Köpfe). Die Inhalte sind erfunden; zwei
   echte Fotos zeigen, dass Raban auch Bilder nimmt (in 01 und 02).
4. „Preise“ (`#preise`): große Zahlen, die Fußnote zum Pilot, ein Aufruf zur Kontaktseite. Weder Navbar noch Fußkarte
   verlinken die Preise.
5. Häufige Fragen, dann die Fußkarte.

## Über uns (/about)

Genau das Bühnen-Pitch-Deck: neun Folien, auf der deutschen Seite deutsch, auf der englischen englisch, als Stapel,
der beim Scrollen wächst; daneben (auf dem Handy darunter) was die Gründer zur Folie sagen. Folie 8 ist das Team.
Über dem Deck nur die Überschrift „Unser Pitch-Deck“ („Our Pitch Deck“).

## Kontakt (/contact)

Eine Display-Zeile („Schreib uns.“), die Adresse humans@raban.ai als großer unterstrichener Link mit Kopierknopf,
darunter in einer Haarlinien-Spalte der Aufruf an ein zweites Pilotunternehmen.

## Impressum (/legal) und Datenschutz (/privacy)

- Anbieter und Verantwortlicher ist die Raban GbR (Simon Waiß und Johannes Koch) mit Postanschrift in Tübingen
  (§ 5 DDG). Texte in `app/(public)/legal/copy.tsx` und `app/(public)/privacy/copy.tsx`.
- Die Datenschutzerklärung beschreibt den Globus (Abschnitt `globe-location`) und nennt das Postfach bei iCloud Mail
  (Apple Distribution International, Irland) unter Empfänger und Drittländer.
- Beide Seiten haben einen Abschnitts-Index (am Rand ab großer Breite, sonst in der Navbar).

## Agenten-Ansicht

Jede Seite gibt es auch als Markdown: an ihrer Adresse mit `Accept: text/markdown`, als `.md`-Zwilling, gesammelt in
`/llms.txt` und `/llms-full.txt`. Der Schalter „Ansicht“ in der Fußkarte zeigt einem Menschen genau diesen Text, mit
Kopierknopf.
