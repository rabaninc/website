# Pitch-Folien

`zuschneiden.py` schneidet die Folien aus dem PDF des Pitch-Decks (A4 quer, die Folie ist das 16:9-Feld in der Seitenmitte) und legt sie als `public/pitch/folie-01.png` … in 2560 × 1440 ab. `/about` zeigt sie als Stapel.
Neu schneiden: `uv run --with pymupdf --with pillow python werkzeuge/pitch-folien/zuschneiden.py "<Pfad zum PDF>"`.
Die deutsche Fassung (gleiches Deck in Claude Design, auf Deutsch umgeschaltet, ebenso als PDF exportiert) mit dem Kürzel dahinter: `… zuschneiden.py "<Pfad zum deutschen PDF>" de` legt `public/pitch/de/folie-01.png` … ab; die deutsche Seite zeigt sie.
