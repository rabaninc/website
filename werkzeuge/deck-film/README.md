# Film des Pitch-Decks

`aufnehmen.mjs` filmt das Deck auf `/about` (`app/components/pitch/slide-stack.tsx`) in Chromium ohne Fenster: Ruhelagen und Zwischenstände einer Drehung als Kontaktbogen je Bildschirmgröße, dazu einen Bewegungsstreifen mit echtem Mausrad — so sieht man das Riesenrad, ohne selbst zu scrollen, auch auf dem Handy, wo die Texte das Deck treiben.
Aufnehmen: `node werkzeuge/deck-film/aufnehmen.mjs [Basis-URL] [Zielordner] [Name]` gegen den laufenden Dev-Server (`npm run dev`), Vorgabe `http://localhost:3000`, Bilder nach `werkzeuge/deck-film/bilder/` (in git ignoriert). Playwright kommt aus dem App-Repo unter `~/raban/app/frontend`, sonst `RABAN_APP_FRONTEND=…/frontend` setzen.
Größen: `FILM_GROESSEN=desktop,laptop,handy,handy-klein` (Vorgabe `desktop,handy`); Positionen in Folien: `FILM_T=0,3,3.5,4`.
