---
name: web-pruefung
description: Prüft fertigen Website- und Oberflächen-Code gegen die Web Interface Guidelines von Vercel Labs. Deckt Zugänglichkeit, Fokus-Ringe, Formulare, Bewegung, Typografie, Bilder, Ladezeit, Dunkelmodus und eine Liste bekannter Fehlmuster ab. Verwende dieses Skill nach jedem Bau- oder Umbauschritt an einer Website, und immer bevor etwas veröffentlicht wird. Auslöser sind Sätze wie „prüf die Seite", „check die Zugänglichkeit", „Kontrast prüfen", „ist die Seite sauber", „/web-pruefung", oder das Ende eines Website-Bauauftrags. NICHT für Gestaltungsfragen (dafür der Skill frontend-design), NICHT für Texte (dafür `00 Kontext/Schreibstil.md`).
---

# Web-Prüfung

Abnahmewerkzeug für fertigen Oberflächen-Code. Es gestaltet nichts, es findet Mängel.

## Herkunft und warum die Regeln lokal liegen

Der Regelsatz stammt aus dem Skill `web-design-guidelines` von Vercel Labs (565.000 Installationen, Stand 22.08.2026). Das Original lädt seine Regeln bei jedem Lauf per Web-Abruf nach. Dieser Weg ist hier bewusst abgeschaltet, aus zwei Gründen.

1. Ein Text, der zur Laufzeit aus dem Netz kommt und dann als Anweisung gelesen wird, ist ein offenes Einfallstor. Zu dem Punkt gibt es im Original ein offenes Sicherheits-Issue vom 22.01.2026.
2. Raban verspricht auf der eigenen Website, ohne externe Aufrufe auszukommen. Ein Werkzeug, das dieses Versprechen beim Bauen verletzt, passt nicht dazu.

Der Wortlaut liegt deshalb eingefroren in `regeln.md`, geholt am 22.08.2026. Auffrischen: dieselbe URL erneut laden und die Datei ersetzen — spätestens, wenn der Stand älter als sechs Monate ist. Die Herkunft steht oben in der Datei.

## Ablauf

1. **`regeln.md` in diesem Ordner lesen.** Dort steht der vollständige Regelsatz mit dem Ausgabeformat. Nichts aus dem Netz nachladen.
2. **Prüfgegenstand bestimmen.** Nennt der Auftrag Dateien oder ein Muster, diese nehmen. Sonst alle Komponenten- und Stildateien des Projekts.
3. **Zusätzlich am laufenden Bild messen, nicht nur im Code.** Der Code allein zeigt viele Mängel nicht. Vorschau starten, dann im Browser nachrechnen.
   - Kontrastwerte aller Textfarben gegen ihren tatsächlichen Hintergrund, Mindestwert 4,5 zu 1, bei großer Schrift 3 zu 1.
   - Schriftgrößen unter 12 px auflisten.
   - Handy-Format prüfen (375 px breit), auf seitliches Überlaufen und auf Tippflächen unter 44 px.
   - Konsolenfehler lesen.
4. **Befunde ausgeben** im Format `datei:zeile`, kurz, ohne Höflichkeitsfloskeln, das Schwerste zuerst.
5. **Erst beheben, wenn der Auftrag das verlangt.** Sonst nur melden.

## Grenzen

- Sagt nichts darüber, ob eine Seite schön ist. Das ist Sache des Skills `frontend-design`.
- Sagt nichts über Suchmaschinen-Platzierung. Saubere Struktur hilft dabei, ersetzt aber keine Arbeit an Inhalten und Suchbegriffen.
- Die Regeln sind an React und Next orientiert formuliert. Bei Astro oder reinem HTML gilt der Sinn, nicht der Wortlaut. Ein `<div onClick>` heißt dort eben ein `<div>` mit Klick-Behandlung im Skript.
