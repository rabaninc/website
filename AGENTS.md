# Raban website

Dieses Repo ist die oeffentliche Website von **Raban** (Domain raban.ai).

Der Kontext des Startups — Positionierung, Angebot, ICP, Branding, Sprachregeln —
liegt NICHT hier, sondern im Wissens-Repo `rabaninc/legacy` (Ordner `~/Raban`, in der Landkarte „wissen“;
zugleich Obsidian-Vault). Landkarte aller Repos: AGENTS.md im Firmen-Repo rabaninc.
Wer hier Text schreibt, holt sich die Substanz von dort: `Kontext/Positionierung.md`,
`Kontext/Angebot.md`, `Kontext/Branding.md`. Dessen Regeln gelten auch hier,
besonders **„Belegt oder geraten"** und **„Nichts geht ohne Gruender-Freigabe nach
aussen"**: Diese Seite ist Aussenkommunikation, jeder Satz darauf braucht eine
Freigabe.

**Dieses Repo ist oeffentlich.** Keine Kundendaten, keine Zugangsdaten, keine
internen Ueberlegungen im Code oder in Kommentaren.

## Stand

Der Code stammt aus einem frueheren eigenen Projekt der Gruender (privates
Repo, hier bewusst nicht verlinkt): die
Gestaltungssprache, die Navigationsleiste, die Fusszeile, der Hell-Dunkel-Schalter
und das Seitenraster, dazu der Globus. **Nicht übernommen** wurden
Anmeldung/Konten, die `/backdoor`-Oberfläche und sämtliche personenbezogenen
Daten. Seit dem 29.09.2026 trägt die Navbar rechts „Anmelden" („Sign in") als
letzten Punkt, als Text wie die anderen, ebenso die Fußkarte in der Spalte
„Raban" — nur ein Link auf
`https://app.raban.ai`, dessen Anmeldung dort liegt; die Website selbst hat
weiter keine Konten.

**Der Globus liest den Besucher-Standort.** `utils/visitor-geo.ts` holt das
LAND des Besuchers aus Vercels Edge-Headern — pro Anfrage, nichts gespeichert,
kein Cookie, nie auf Stadt-Ebene — und nennt es in der Sprache der Seite
(„Deutschland“, "Germany"; bis 03.10.2026 immer Englisch); ohne Header
(lokal) steht er auf Deutschland. Das macht die Startseite dynamisch (`ƒ` statt
statisch) und **muss in der Datenschutzerklärung stehen**: der Abschnitt
`globe-location` steht dort geschrieben. Wer den Globus entfernt,
entfernt auch den Abschnitt — und umgekehrt.

**Texte und Grafiken (Neubau 28.09.2026):** Die Startseite trägt die ganze
Seite, im Stil von typesafe.ai: oben der Globus-Hero (Aufbau wie
vorher: Leitsatz oben links, Globus dahinter, kurzer Text unten rechts; seit
30.09.2026 auf Salbei, Schrift und Globus dunkel), darunter das Problem als eine große Aussage mit drei Grundsätzen,
dann die App in fünf Zeilen wie auf x.ai/build, das macOS-Fenster im
Wechsel links und rechts, der Text daneben (seit 30.09.2026 in Johannes'
Reihenfolge: Aufzeichnen, Fragen mit Plan, Nachfragen bei einem Menschen,
Raban erledigt einen Schritt selbst, und worauf diese Aufgabe zugreift: aus
Systemen, die die Firma einmal anschließt und je Aufgabe wählt, aus Dateien
und aus Köpfen), die Preise als große
Zahlen (`#preise`; seit 29.09.2026 weder in Navbar noch Fußkarte verlinkt),
darunter, wem die Daten gehören (`#eure-daten`, seit 04.10.2026: „Euer Wissen
gehört euch.“ in Abschnittsgröße links, rechts ein Satz und „Pilot anfragen“,
das vorher die Preise schloss; darunter ein gezeichneter Reißverschluss, der
beim ersten Mal den Abschnitt anhält, während das Scrollen ihn schließt (wer
zurückscrollt, bevor er je ganz zu war, öffnet ihn wieder; einmal zu, bleibt
er zu, und die Seite scrollt normal an ihm vorbei, auch zurück; auf dem Handy
reicht er geschlossen bis an den rechten Rand der Spalte) —
`app/components/home/daten/`, Regel in `.claude/rules/design.md`; „holt ihr
euch jederzeit selbst heraus“ stimmt, weil die Leitung seitdem in der App unter
Einstellungen › Leitstelle › Export alles selbst als ZIP packt — vorher hieß es
„auf Wunsch“),
häufige Fragen
und die Fußkarte. `/product` gibt es nicht mehr, es leitet auf die Startseite
um (`next.config.ts`). Die Fenster sind seit dem 30.09.2026 gezeichnet, keine
Bildschirmfotos mehr: die App als Code nachgebaut (Salbei-Boden mit den drei
Lichtern und dem Menü, weiße Karte darauf, wie in Buzz), in echter Größe der
App: ein 1280 × 800 großes Fenster, das Menü in seiner schmalsten Breite
(220 px), Schrift und Abstände wie in der App (die drei Lichter in Größe,
Lage und Farbe wie an einem echten macOS-Fenster gemessen, seit 01.10.2026 ohne den feinen
dunklen Rand des Systems, der verkleinert wie ein schwarzer Umriss wirkte), als Ganzes auf
die Breite
skaliert, damit alle
fünf gleich groß sind und in der Sprache der Seite erscheinen; jede Szene
spielt einmal ab, wenn sie ins Bild kommt (`app/components/home/app-window.tsx`,
`app/components/home/window/`). Die Inhalte sind erfunden (eine
Faltschachtel-Fertigung, Konto Johannes Koch in der Firma „Raban“); zwei
echte Fotos zeigen, dass Raban auch Bilder nimmt — am ersten Schritt in 01
und mit der Frage in 02 (`public/fenster/`, aus freien Bildarchiven geholt und zugeschnitten von
`werkzeuge/fenster-fotos/zuschneiden.py`, Quellen und Lizenz dort; fremde Marken weichgezeichnet). `/about` beginnt seit dem 06.10.2026 mit der Auszeichnung (siehe unten), danach
kommt, wie seit dem 29.09.2026, genau das Bühnen-Pitch-Deck: neun
Folien (Englisch), aus dem PDF auf ihr 16:9-Feld zugeschnitten
(`werkzeuge/pitch-folien/`, Bilder in `public/pitch/`) und als Stapel
gezeigt, der beim Scrollen wächst — jede Folie gleitet gerade von unten
herein, ohne Drehung, und legt sich auf die vorige; die früheren fahren
aufrecht wie auf einem Riesenrad hoch, nach hinten und über den Scheitel
hinter den Stapel, ganz körperlich (kein Abdecken der Logos: jede Folie
zeigt, was keine vordere verdeckt); in Ruhe stehen vier Folien eng
gestapelt, die vordere und drei dahinter, rund wie der Kranz eines
Riesenrads (seit 01.10.2026, vorher gerade Stufen): alle Oberkanten auf
einem Kreis, die Streifen werden nach oben schmaler, die Seiten rücken
immer stärker ein, so laufen die Ecken im Bogen; ein kleines Rad, die
Folien 25° auseinander, der Bogen steht gut ein Viertel einer Folienhöhe
über der vorderen, Logos schauen hervor (Johannes, 01.10.2026: erst
„20% arch“, dann „make the arch bigger, sort of make the wheel smaller“);
die hinterste beginnt ihre letzte Drehung nah am Scheitel und ist im Takt
des Rads (nur wenig schneller) zur Mitte der Drehung hinter dem Stapel
versunken: die hinteren gehen schnell runter, ohne sich vom Rad zu lösen
(ein eigener Sprung von 120° wirkte abgelöst, und den ganzen Stapel im
selben Ruck mitzudrehen wollte Johannes nicht); daneben
steht, was die Gründer zur Folie sagen (Bühnen-Skript). Folien und Skript
bleiben, wie sie an dem Tag gezeigt und gesagt wurden, auch wo heute etwas
anderes gilt (Pilot „im September“, Folie 7 „Europa“; Johannes, 04.10.2026:
„That's the pitch we gave on that day“) — nicht nachbessern. Kein Seitentitel:
über dem Deck steht nur „Unser Pitch-Deck“ (seit 06.10.2026 eine h2, die h1
der Seite ist die Auszeichnung darüber; seit 07.10.2026 eine Fallblattanzeige,
deren Kacheln einmal durchs Alphabet blättern, sobald sie ins Bild kommt, am
Desktop 48 px hoch, am Handy so breit wie die Spalte, Johannes: „use the
style of A, like the airplane terminal graphic“ — die Tafel aus der Vorschau
d69afb8, `app/components/pitch/anzeigetafel.tsx`; vorher kurz ein Tinten-Tag
und davor eine 28-px-Überschrift, die fehl am Platz wirkte); „Über uns“
nennt nur die Navbar (Johannes, 01.10.2026: erst der große Titel, dann
das Mono-Label weg). Die ganze Bühne samt Überschrift klebt ab dem Anfang
ihrer Spur, die erste Folie steht also an ihrem Platz, sobald das Deck oben
ankommt (bis 06.10.2026 eröffnete das Deck die Seite). Auf dem Handy dieselbe Bühne in einer Spalte,
der Text unter dem Deck statt rechts daneben, die nächste Folie steigt aus
der Lücke zwischen Deck und Text auf statt über den Text; jeder Text
bekommt dort die größte Schrift zwischen 13 und 11 px (Zeilenabstand 1,3),
bei der er in seinen Kasten passt, und steht still (Johannes, 01.10.2026:
kleiner, und kein Scrollen im Kasten); auf einem iPhone in Safari
(etwa 393 × 659 sichtbar) sind fast alle 13 px, die längste, Folie 6, 11 px.
Nur wo selbst 11 px nicht reichen (iPhone SE, quer gehaltenes Handy),
scrollt ein Text noch in seinem Kasten, solange seine Folie ruht, erst
danach dreht das Rad (`app/components/pitch/slide-stack.tsx`; filmen mit
`werkzeuge/deck-film/`). Die Folie 8
ist das Team; Teamblock und die alten SVG-Grafiken sind entfernt (in git).
Vor dem Deck, als Erstes auf der Seite und einen Bildschirm hoch, steht seit
dem 06.10.2026 die Auszeichnung (Johannes: erst „das Deck vielleicht als
Zweites“, dann die Karte gewählt, vor einer Fallblattanzeige, einem Siegel
und dem Kalender, der am selben Tag kurz unter dem Deck stand; alle vier im
Vorschau-Commit d69afb8): als h1 in Display-Größe, so groß, wie
ihre Spalte es erlaubt, „Unter den Gewinnerteams.“ / "Among the winning
teams." (es waren mehrere Gewinnerteams, und das soll klar sein; seit
07.10.2026 in Johannes' Worten, vorher „Unter den Gewinnern.“), in beiden
Sprachen zweizeilig (höchstens 13 % der Spaltenbreite), darunter sein
Satz (mit diesem Pitch eines der Gewinnerteams bei AI Start von Campus
Founders, Heilbronn, 2. September 2026), daneben eine Punktkarte von
Deutschland mit Gradnetz: zwei Haarlinien fahren ein und finden Heilbronn,
die Markierung blinkt, und daneben tippen sich drei Tags wie beim Globus der
Startseite, Ort, Finale und zuletzt „Gewinnerteam“, dann läuft ein Ping über
die Punkte; sie spielt einmal, sofort beim Öffnen der Seite (Johannes,
07.10.2026: „starts right away when I land on the page“), nur auf einer
weiter unten wiederhergestellten Seite erst beim Zurückscrollen. Seit dem
07.10.2026 passt die Auszeichnung auf den ersten Bildschirm, auch am Handy:
hochkant steht die Karte unter dem Satz, unten rechts, und nimmt die Höhe,
die bleibt; quer steht sie wie am Desktop daneben, so hoch wie der Bildschirm,
und die letzte Zeile des Satzes steht auf der Grundlinie der Längengrade
unter der Karte (Johannes, 07.10.2026). Auszeichnung und Deck sind ein
einziger Abschnitt mit einem Klammerrahmen (Johannes, 07.10.2026: „all one
big section“): oben die Ecken unter der Navbar, unten nach der letzten
Folie, am Handy hochkant 32 px unter ihrem Text statt am Fuß der Bühne
(die Spur endet um den leeren Rest höher, Johannes, 07.10.2026); das Deck
rückt eine Navbar-Höhe unter die Karte, ohne Linie dazwischen (`app/(public)/about/page.tsx`, `app/components/pitch/karte.tsx`; der Umriss aus world-atlas, von
`werkzeuge/deutschland-karte/karte.mjs` nach
`app/components/pitch/deutschland.ts` gerechnet).
Die Folien sind die Ausnahme vom Salbei-Tinte-Weiß der übrigen Seite.
`/contact` spricht dieselbe Sprache wie die Startseite: eine
Display-Zeile („Schreibt uns.“, ohne Mono-Label „Kontakt“ darüber seit
01.10.2026; die Navbar nennt die Seite), die Adresse als großer unterstrichener Link
mit Kopierknopf, der Pilotaufruf in einer Haarlinien-Spalte. Die Seite spricht mit
„Du", wie die App. Jeder Satz ist Entwurf, bis Johannes ihn freigibt. Das
`Placeholder`-Bauteil bleibt für künftige offene Stellen; vor jedem Livegang
muss `grep -rn "<Placeholder" app` leer zurückkommen.

**Die Seite ist live** (raban.ai seit 26.08.2026). Impressum und Datenschutz
sind ausgefüllt: Anbieter und Verantwortlicher ist seit 01.10.2026 die Raban GbR
(Simon Waiß und Johannes Koch) mit Postanschrift in Tübingen (§ 5 DDG), vorher Simon als Einzelunternehmen; der Abschnitt `globe-location` ist geschrieben ✅ (geprüft 15.09.2026; die Texte stehen
seit 30.09.2026 in `app/(public)/legal/copy.tsx` und
`app/(public)/privacy/copy.tsx`). **Kontaktadresse ist `humans@raban.ai`** (seit 18.09.2026, vorher `kontakt@raban.ai`) — auf der
Kontaktseite, im Impressum und in der Datenschutzerklärung; das Postfach existiert und empfängt Post ✅
(Johannes' Stand, 18.09.2026). **Das Postfach liegt bei iCloud Mail** (Apple Distribution International,
Irland; Johannes, 03.10.2026: Migadu ist vorbei, kein Google Workspace, später vielleicht Microsoft 365), und
die Datenschutzerklärung nennt es unter Empfänger und Drittländer: Wer das Postfach umzieht, ändert beide
Abschnitte mit — wie beim Globus.
Das Favicon ist bewusst dasselbe Zeichen wie im Vorprojekt.

**Agenten-Ansicht (30.09.2026, nach cdata.com):** Jede Seite gibt es auch
als Markdown. Ein Agent, der `Accept: text/markdown` schickt, bekommt es an
der Adresse der Seite selbst; dazu die `.md`-Zwillinge (`/index.md`,
`/about.md`, …), `/llms.txt` und `/llms-full.txt` (Umleitungen und
`Link`-Header in `next.config.ts`, Route in `app/md/`). Der Schalter
„Ansicht: Mensch | Agent" in der Fußkarte, unter der Sprache, zeigt einem
Menschen genau diesen Text an Stelle der Seite, mit Kopierknopf
(`app/components/agent-view.tsx`, `view-flip.tsx`); die Wahl gilt beim
Weiterklicken und ist nach einem Neuladen weg — kein Cookie, nichts
gespeichert, die Datenschutzerklärung bleibt richtig. **Die Texte jeder
Seite stehen seitdem in `copy.ts(x)` neben ihrer `page.tsx`** (Startseite:
`app/(public)/copy.ts`, Linkvorschau: `app/preview.ts`); dieselbe Datei
schreibt daraus das Markdown, beides kann also nicht auseinanderlaufen. Wer
einen Text ändert, ändert ihn dort; eine neue Seite kommt in
`app/md/pages.ts`. Die gezeichneten App-Fenster stehen im Markdown als ihr
Alt-Text (es gibt kein Bild, auf das man verlinken könnte).

**Titel und falsche Adressen (03.10.2026):** Jede Seite trägt im Tab und in
Suchergebnissen ihren eigenen Titel, denselben wie im Markdown („Raban - Über
uns“ …, die Startseite „Raban - Wissen was bleibt“; `titleAt` in
`app/md/pages.ts`, vorher hieß jede Seite nur „Raban“). Eine falsche Adresse
zeigt „Seite nicht gefunden.“ mit einem Link zur Startseite im selben Rahmen
wie jede Seite, mit Fußkarte und Schaltern (`app/not-found.tsx` legt das
Layout von `(public)` darum), und die Navbar nennt nur Seiten, die es gibt.
`app/favicon.ico` ist das Zeichen aus `icon.svg` in 16, 32 und 48 px.

## Git

Beim Start der Session `git pull --rebase`. Jeder Push auf `main` geht auf Vercel live; das ändert nichts an der
Gründer-Freigabe für Inhalte, die auf raban.ai erscheinen.

**Direkt auf `main` (03.10.2026).** Die Website ist Johannes' Arbeitsfeld. Bittet er um eine Änderung, ist das seine
Freigabe: Die Session baut, prüft, committet und pusht auf `main`, ohne Zweig, ohne Pull Request und ohne Rückfrage;
Johannes sieht es live und sagt, was weiter soll. Der Push auf `main` ist hier das Ausrollen, seine Bitte gibt es frei.
Über einen Zweig mit Vercel-Vorschau läuft nur, was Johannes erst ansehen will, bevor es live geht (etwa Varianten zum
Auswählen); auf `main` kommt es, sobald er Ja sagt.

**Mehrere Sessions im selben Ordner (03.10.2026).** Hier arbeiten oft mehrere Sessions zugleich, auch in denselben
Dateien (etwa `app/globals.css`). Abweichend vom gemeinsamen Block lässt eine Session eine Datei, die eine andere
Session schon geändert hat, nicht aus: Sie ändert ihre eigenen Stellen und stagt nur diese (`git apply --cached` mit
ihrem Teil des Diffs), nie fremde. Fallen ihre Änderungen in dieselben Zeilen wie fremde, lässt sie die Datei aus und
nennt das im Bericht.

## Gestaltung

Seitenaufbau, Folien, Farben, Schrift, Fenster und Karten stehen in `.claude/rules/design.md` (Abschnitt
„Gestaltungssprache“, bis 01.10.2026 hier). Claude Code lädt die Datei bei Arbeit an `app/`; andere Agenten lesen sie
vor der ersten Änderung dort. Neue Gestaltungsregeln kommen ebenfalls dorthin.

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
