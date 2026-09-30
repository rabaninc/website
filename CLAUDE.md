<!-- Kurzfassung für Claude Code (30.09.2026). Geltend ist AGENTS.md; bei Widerspruch gilt AGENTS.md. Grund: AGENTS.md hat
über 240 Zeilen, die meisten zur Gestaltung; die lädt Claude jetzt erst, wenn es an app/ arbeitet (.claude/rules/design.md). -->

# website — raban.ai

Öffentliche Website von Raban (Next.js, Vercel, live). **Das Repo ist öffentlich:** keine Kundendaten,
Zugangsdaten oder internen Überlegungen in Code und Kommentaren.

- **Texte:** Jeder Satz ist Entwurf, bis Johannes ihn freigibt. Substanz aus `~/Raban/Kontext/`
  (Positionierung, Angebot, Branding); dort gilt „Belegt oder geraten“. Die Seite sagt „Du“.
- **Globus und Datenschutz gehören zusammen:** `utils/visitor-geo.ts` liest pro Anfrage nur das Land
  (nichts gespeichert, kein Cookie); dazu gehört der Abschnitt `globe-location` in
  `app/(public)/privacy/copy.tsx`. Wer eins ändert oder entfernt, ändert das andere mit.
- **Texte stehen in `copy.ts(x)` neben jeder `page.tsx`** (Startseite `app/(public)/copy.ts`, Linkvorschau
  `app/preview.ts`); daraus entsteht auch die Markdown-Fassung für Agenten (`app/md/`, Schalter „Ansicht“).
- **Kontakt** ist `humans@raban.ai`; Anbieter im Impressum ist Simon Waiß, Einzelunternehmen, Tübingen.
- **Vor jedem Livegang** kommt `grep -rn "<Placeholder" app` leer zurück.
- **Gestaltung und Seitenaufbau** stehen in `AGENTS.md` (Abschnitte „Stand“ und „Gestaltungssprache“); vor jeder
  Änderung an `app/` dort lesen, neue Gestaltungsregeln dort eintragen.
- **Git:** Start `git pull --rebase`; am Ende committen (deutsch) und pushen, freigegeben bei grünen oder
  fehlenden Tests. Jeder Push auf `main` geht auf Vercel live. Uncommitteten Stand beim Aufhören in
  `~/rabaninc/STAND.md` vermerken.
- Landkarte aller Repos: `~/rabaninc/AGENTS.md`.
