---
paths:
  - "next.config.ts"
  - "app/md/**/route.ts"
  - "app/llms*/route.ts"
  - "app/components/agent-view.tsx"
  - "utils/markdown.ts"
---

# Agenten-Ansicht (nach cdata.com)

- Jede Seite gibt es auch als Markdown: an ihrer eigenen Adresse für jeden, der `Accept: text/markdown` schickt,
  dazu als `.md`-Zwilling (`/index.md` für die Startseite), in `/llms.txt` und `/llms-full.txt`. Umleitungen und
  `Link`-Header stehen in `next.config.ts` (`beforeFiles`, weil sonst die Seiten zuerst antworten), die Route in
  `app/md/`.
- Das Markdown einer Seite schreibt ihre `copy.ts(x)` mit den Helfern aus `utils/markdown.ts`, aus denselben Texten
  wie die Seite. Liste, Reihenfolge in llms.txt und Titel der Seiten (`titleAt`) stehen in `app/md/pages.ts`; eine
  neue Seite kommt dort hinein. Die Fußkarte schließt jedes Markdown (`footerMarkdown`).
- Der Schalter „Ansicht: Mensch | Agent“ in der Fußkarte tauscht die Seite gegen genau das Markdown, das ein Agent
  an ihrer Adresse bekommt, mit Kopierknopf (`app/components/agent-view.tsx`); Navbar und Fußkarte bleiben. Die Wahl
  lebt im Zustand des Layouts: Sie hält beim Weiterklicken und ist nach einem Neuladen weg. Kein Cookie, nichts
  gespeichert, sonst stimmt die Datenschutzerklärung nicht mehr.
- Die App-Fenster sind keine Bilddateien; im Markdown steht ihre Beschreibung als Alt-Text.
