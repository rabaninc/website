# Bilder in Safaris Engine

`safari-bild.swift` macht ein Bild einer Seite im WebKit, das in macOS steckt — Safaris eigener Engine, nicht Chrome und kein heruntergeladener Nachbau. Johannes sieht die Seite in Safari; Schrift, Ränder und Farben dort prüfen, nicht nur in Chromium (Playwright, `werkzeuge/deck-film`).
Bauen (einmal, Swift aus den Command Line Tools): `swiftc -O werkzeuge/safari-bild/safari-bild.swift -o werkzeuge/safari-bild/safari-bild` (die fertige Datei ist in git ignoriert).
Aufruf: `werkzeuge/safari-bild/safari-bild <url> <breite> <höhe> <skript.js|-> <bild.png> [daten.json]` — Breite und Höhe in CSS-Pixeln, das Bild kommt in Retina-Auflösung (2x). Das Skript läuft nach dem Laden in der Seite (`await` erlaubt) und darf `{ height, data }` zurückgeben: `height` stellt das Fenster vor dem Bild um, `data` landet in `daten.json`.
Während der Aufnahme steht unten links auf dem Bildschirm ein fast durchsichtiges Fenster; sichtbar muss es sein, sonst hält WebKit die Animationen an.

`deck.js` stellt das Deck auf /about (Desktop) auf eine Position und gibt die Lage jeder Folie zurück, z. B. halb von Folie 8 zu 9 in Johannes' Fenstergröße:
`werkzeuge/safari-bild/safari-bild "https://raban.ai/about#t=7.5" 1512 857 werkzeuge/safari-bild/deck.js bild.png lage.json` — `&weiss=9` gibt Folie 9 ihren alten weißen Kasten zurück (zum Vergleich).

Grenze: das Werkzeug malt die Seite als Standbild neu. Was Safari nur beim Bewegen auf dem Bildschirm zeichnet, zeigt es nicht — die weiße Haarlinie an der roten letzten Folie (01.10.2026) erschien hier auch mit weißem Kasten nicht; so etwas lässt sich nur am Bildschirm selbst sehen.
