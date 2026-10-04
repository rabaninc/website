# Raban website

Die öffentliche Website von **Raban** (raban.ai), Next.js auf Vercel. Was gerade auf welcher Seite steht: `STAND.md`.

Die Substanz für Texte (Positionierung, Angebot, ICP, Branding, Sprachregeln) liegt nicht hier, sondern im Wissens-Repo
rabaninc/legacy (Ordner ~/Raban, in der Landkarte „wissen“): Kontext/Positionierung.md,
Kontext/Angebot.md, Kontext/Branding.md. Dessen Regeln gelten auch hier, besonders „Belegt oder geraten“.

**Das Repo ist öffentlich.** Keine Kundendaten, keine Zugangsdaten, keine internen Überlegungen in Code oder
Kommentaren.

## Feste Kopplungen

- **Texte stehen in `copy.ts(x)` neben der `page.tsx` jeder Seite** (Startseite `app/(public)/copy.ts`, Linkvorschau
  `app/preview.ts`, App-Fenster `app/components/home/window/content.ts`). Dieselbe Datei schreibt das Markdown der
  Agenten-Ansicht; wer einen Text ändert, ändert ihn dort. Eine neue Seite kommt zusätzlich in `app/md/pages.ts`.
- **Globus und Datenschutz:** `utils/visitor-geo.ts` liest das Land des Besuchers aus Vercels Edge-Headern, je
  Anfrage, nichts gespeichert, kein Cookie, nie die Stadt. Die Datenschutzerklärung beschreibt das im Abschnitt
  `globe-location`: Wer den Globus entfernt oder ändert, ändert den Abschnitt mit, und umgekehrt.
- **Postfach und Datenschutz:** Kontaktadresse ist humans@raban.ai (Kontaktseite, Impressum, Datenschutz,
  Fußkarte). Das Postfach liegt bei iCloud Mail, und die Datenschutzerklärung nennt es unter Empfänger und
  Drittländer: Wer das Postfach umzieht, ändert beide Abschnitte mit.
- **Agenten-Ansicht speichert nichts:** Der Schalter „Ansicht: Mensch | Agent“ hält seine Wahl ohne Cookie; sonst
  stimmt die Datenschutzerklärung nicht mehr.
- **Keine Konten:** Die Website hat keine Anmeldung und keine personenbezogenen Daten; „Anmelden“ ist nur ein Link
  auf https://app.raban.ai.
- **Das Pitch-Deck auf /about** (Folien und Bühnen-Skript) bleibt, wie es an dem Tag gezeigt und gesagt wurde, auch
  wo heute anderes gilt: nicht nachbessern.
- Die Seite spricht mit „Du“, wie die App.

## Freigabe und Ausrollen

Die Seite ist Außenkommunikation: Jeder Satz ist Entwurf, bis Johannes ihn freigibt. Bittet er um eine Änderung, ist
das seine Freigabe. Jeder Push auf `main` geht auf Vercel live; der Push ist hier das Ausrollen.

**Fertig heißt** vor jedem Push: `npm run build` grün, und `grep -rn "<Placeholder" app --exclude=placeholder.tsx`
kommt leer zurück (`Placeholder` markiert ungeschriebenen Text; jede Verwendung blockiert den Livegang).

## Git

Beim Start der Session `git pull --rebase`.

**Direkt auf `main`.** Die Website ist Johannes' Arbeitsfeld. Auf seine Bitte baut, prüft, committet und pusht die
Session auf `main`, ohne Zweig, ohne Pull Request und ohne Rückfrage; Johannes sieht es live und sagt, was weiter
soll. Über einen Zweig mit Vercel-Vorschau läuft nur, was er erst ansehen will (etwa Varianten zum Auswählen); auf
`main` kommt es, sobald er Ja sagt.

**Mehrere Sessions im selben Ordner.** Oft arbeiten hier mehrere Sessions zugleich, auch in denselben Dateien.
Abweichend vom gemeinsamen Block lässt eine Session eine Datei, die eine andere schon geändert hat, nicht aus: Sie
ändert ihre eigenen Stellen und stagt nur diese (`git apply --cached` mit ihrem Teil des Diffs), nie fremde. Fallen
ihre Änderungen in dieselben Zeilen wie fremde, lässt sie die Datei aus und nennt das im Bericht.

## Gestaltung

Je Bauteil eine Datei unter `.claude/rules/` (design.md sind die Grundlagen). Claude Code lädt sie, wenn es eine
Datei nach ihrem Kopf `paths:` liest oder ändert, Textdateien laden keine; andere Agenten lesen die passende vor der
ersten Änderung. Neue Gestaltungsregeln kommen in die Datei ihres Bauteils, ohne Verlauf.

<!-- gemeinsam:anfang — Quelle: rabaninc/werkzeug/regeln-gemeinsam.md, hier nicht ändern, verteilen mit werkzeug/regeln-verteilen.sh -->
## Gemeinsame Regeln aller Raban-Repos (für Simon, Johannes und jeden Agenten)

**Wo eine Regel steht.** Jede Regel an genau einer Stelle: gemeinsam in diesem Block; Repo-Eigenes in der AGENTS.md; der
Ablauf einer Aufgabe im Abschnitt „Stolperfallen“ ihres Skills (fehlt er, anlegen) oder in `.claude/rules/`; was nur für
den Rechner oder das Gespräch eines Gründers gilt, in dessen persönlichen Dateien. `CLAUDE.md` enthält nur `@AGENTS.md`.
Das Gedächtnis eines Agenten hält nur Tatsachen, keine Regeln und keine Entscheidungen.

**Drei Dateiarten.** Jede Arbeitsdatei (alles außer Regeln und Skripten) ist genau eine; ihre erste Zeile nennt die Art.
- **Stand:** was jetzt gilt und ansteht. Wird überschrieben, nie fortgeschrieben; höchstens 8.000 Zeichen, die README
  eines Themenordners höchstens 25 Zeilen; Erledigtes fliegt raus. Grund: Jede Session soll ihn mit einem Blick erfassen.
- **Buch:** je Sache eine Zeile, oben ein kurzer Auszug „Was gilt“. Neues zu einer Sache überschreibt deren Zeile.
- **Verlauf:** Aufträge, Berichte, Protokolle, Ausroll-Log, Abnahme-Einträge. Wächst nur durch Anhängen oder bleibt
  unverändert; nach Abschluss per `git mv` ins Archiv, nie löschen.
- **Neueres ersetzt Älteres:** Gilt zu einer Sache etwas Neues (Entscheidung, Fakt, Regel), wird die alte Fassung
  überschrieben, nicht ergänzt; der Verlauf steht in Git. Ist unklar, ob es ersetzt: die Gründer fragen.
- **Nach dem Zusammenführen** kommen Auftrag und Rückbericht ins Archiv, offene Funde vorher in die offene Liste des
  Repos. **Wer verschiebt,** zieht die Verweise in allen Repos der Landkarte (AGENTS.md in rabaninc) nach (grep), nur
  nicht in Verlaufsdateien; die alten Pfade stehen in der README des Archivs.

**Git.** Am Start den Stand holen (Befehl in der Repo-AGENTS.md). Vor jeder Änderung `git status --porcelain <datei>`:
ist sie schon geändert (fremde Session), auslassen und im Bericht nennen. Nur eigene Pfade stagen (nie `git add -A`).
Die Stand-Zeile ändert sich im selben Commit wie die Arbeit. Deutsch committen, am Ende pushen (freigegeben, wenn Tests
grün sind oder es keine gibt), nie `--no-verify`. Uncommittetes beim Aufhören im Stand des Repos vermerken (hat es
keinen: in dem von rabaninc). **Zweige:** eigener Zweig, Pull Request, grüner Lauf, Merge-Commit (kein Squash, kein
Rebase: `gh pr merge <nr> --merge`), danach Zweig und Bauplatz weg; ob Kleines direkt auf `main` darf, sagt die AGENTS.md.

**Stopps.** Anhalten und einen Gründer fragen nur vor: Ausrollen auf den Server, Änderungen an der echten Datenbank, Geld
ausgeben (außer Wegwerf-Testservern im Hetzner-Projekt `raban-test`), Konten und Anmeldungen, Zerstörerischem außerhalb
des eigenen Zweigs. Nichts geht ohne Freigabe eines Gründers nach außen (Mails, Posts, Angebote, Texte auf raban.ai,
Ansprache von Kunden); Mails verschickt ein Gründer selbst. Sonst ohne Rückfrage weitermachen, bis der Auftrag fertig
ist; Zwischenstände stehen in derselben Nachricht wie der nächste Schritt, Zweifel im Bericht statt als Frage.

**Bauen und Helfer.** Kleine Aufträge baut die Session selbst, mit passenden Tests nach jedem Schritt. Große (ab etwa
fünf Punkten oder absehbar über 300.000 Tokens) orchestriert sie: jeder Punkt nacheinander an einen frischen Helfer mit
Ziel, „fertig heißt …“ samt Testbefehl, erlaubten Dateien und Stopps, die Liste in einer Datei; parallel nur bei
getrennten Dateien. Am Ende genau eine Prüfung; sonst Helfer nur zum breiten Suchen und Lesen. Modell: Opus, wenn Urteil
nötig ist (Bauen, Recherche, Prüfen), Sonnet oder Haiku für Einfaches, nie Fable. Rückbericht höchstens 15 Zeilen
(Blockiert zuerst, dann Geändert / Nachweis / Nicht bestätigt, Tokenverbrauch; Prüfer 25). Ein Bericht ist kein Beweis: Die Session
sieht den Diff an und lässt die Tests selbst laufen, bevor sie abhakt.

**Belege in Dateien.** Jede Tatsachenbehauptung, auf der eine Entscheidung ruht, trägt eine Marke: ✅ belegt (mit Stelle:
Datei, URL mit Datum oder Befehl), 🟡 ungeprüft (wurde gesucht, steht dabei wo), ❌ widerlegt. Unmarkiert heißt geprüft; erfundene Belege sind der
schwerste Fehler. **Kundeninhalte** (Verträge, Mails, Personennamen beim Kunden, Kunden-Entscheidungen, Rollenspiele mit
Kundenfiguren) liegen nur unter `kunden/<kunde>/` im Firmen-Repo rabaninc; rohe Serverprotokolle eines Kunden kommen in
keine Agenten-Sitzung (IP-Adressen sind Personendaten). **Durchsetzung:** `werkzeug/ordnung-pruefen.sh` im Firmen-Repo
rabaninc meldet Verstöße beim Start, ein Git-Haken vor dem Commit sperrt neue.
<!-- gemeinsam:ende -->
