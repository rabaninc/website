# Schneidet die Folien des Pitch-Decks aus dem PDF und legt sie als PNG nach
# public/pitch/. Jede PDF-Seite ist A4 quer; die eigentliche Folie ist ein
# 16:9-Feld in ihrer Mitte (842 × 473,5 pt ab 60,75 pt von oben), darüber und
# darunter liegt ein leerer weißer Streifen. Gemessen an der roten Fläche der
# letzten Folie, die genau dieses Feld füllt.
import sys
from pathlib import Path

import pymupdf
from PIL import Image

OBEN, UNTEN = 60.75, 534.25
BREITE_PX = 2560

pdf = pymupdf.open(sys.argv[1])
ziel = Path(__file__).resolve().parents[2] / "public" / "pitch"
ziel.mkdir(parents=True, exist_ok=True)
for i, seite in enumerate(pdf):
    feld = pymupdf.Rect(0, OBEN, seite.rect.width, UNTEN)
    zoom = BREITE_PX / seite.rect.width
    pix = seite.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=feld)
    bild = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    # Die erste und die letzte Pixelzeile mischen die Folie mit dem weißen
    # Streifen (Kantenglättung); sie fallen weg, damit keine helle Linie bleibt.
    bild = bild.crop((0, 1, bild.width, bild.height - 1))
    datei = ziel / f"folie-{i + 1:02d}.png"
    bild.save(datei, optimize=True)
    print(datei.name, bild.width, "×", bild.height)
