# Linkvorschau

`zeichnen.mjs` zeichnet das Bild, das iMessage, WhatsApp, Slack und LinkedIn unter einem Link auf raban.ai zeigen (`og:image`, 1200 × 630): Salbei, das Zeichen mit „Raban", darunter der Leitsatz des Heros, je Sprache ein PNG nach `public/vorschau/` (`de.png`, `en.png`).
Titel und Beschreibung der Vorschau stehen in `app/layout.tsx` (`PREVIEW`).
Neu zeichnen: `node werkzeuge/vorschau/zeichnen.mjs` (Playwright aus dem App-Repo unter `~/raban/app/frontend`, sonst `RABAN_APP_FRONTEND=…/frontend` setzen; lädt Inter von Google Fonts).
Schon verschickte Nachrichten behalten ihre alte Vorschau; WhatsApp und LinkedIn merken sich eine Vorschau einige Tage, `?v=2` am Link umgeht das.
