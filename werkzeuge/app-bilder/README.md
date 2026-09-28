# Bilder der App

`aufnehmen.mjs` fotografiert die echte Raban-Oberfläche (Vite im Testmodus gegen die Attrappe aus `rabaninc/app`) in vier Zuständen und legt sie als PNG (1280 × 800, das Sprachbild 1280 × 520, doppelte Pixeldichte) nach `public/app/`.
Alle Inhalte sind erfunden und stehen in `daten.mjs` (Musterfirma GmbH); das Skript reicht sie per `page.route` an die App, im App-Repo wird nichts geändert.
Neu aufnehmen: `node werkzeuge/app-bilder/aufnehmen.mjs` (erwartet das App-Repo unter `~/raban/app`, sonst `RABAN_APP_FRONTEND=…/frontend` setzen; nur einzelne Bilder: `NUR=formular,sprache-faden`).
Das Skript startet Attrappe und Vite auf den Ports 8876 und 4283 und beendet beide danach wieder.
