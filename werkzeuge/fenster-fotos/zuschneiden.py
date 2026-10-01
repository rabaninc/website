"""Holt die zwei Fotos in den App-Fenstern der Startseite und schneidet sie zu.

Beide sind echte Aufnahmen aus freien Bildarchiven (kommerziell frei, ohne Namensnennung), nichts aus
einem Betrieb, mit dem Raban arbeitet:

- `druckbogen.jpg` (Fenster 01, am ersten Schritt): Bogenauslage einer Druckmaschine mit bedruckten
  Faltschachtel-Nutzen. Criiv India, Pexels, https://www.pexels.com/photo/9550363/ (Pexels-Lizenz).
  Die Schrift auf den Bogen ist weichgezeichnet, damit keine fremde Marke lesbar ist.
- `schachtel.jpg` (Fenster 02, mit der Frage hochgeladen): kleine Faltschachtel in der Hand, an einer
  Seite aufgegangen. Niko Caelis, Unsplash, https://unsplash.com/photos/O4apdFXXb_0 (Unsplash-Lizenz).

Aufruf: `python3 werkzeuge/fenster-fotos/zuschneiden.py`, schreibt nach `public/fenster/` (480 × 360, 4:3,
ohne Metadaten).
"""

import io
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ZIEL = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[2] / "public" / "fenster"
B, H = 480, 360  # Bildgröße, wie die App-Fenster sie brauchen

FOTOS = {
    "druckbogen.jpg": {
        "quelle": "https://images.pexels.com/photos/9550363/pexels-photo-9550363.jpeg?auto=compress&cs=tinysrgb&w=1600",
        # Ausschnitt im 1600 × 1200 großen Bild: die bedruckten Bogen größer, weniger Maschine oben und Altpapier unten.
        "ausschnitt": (160, 170, 1440, 1130),
        # Streifen mit den bedruckten Bogen, der weich wird (oben, unten), im selben Bild.
        "weich": (400, 660),
    },
    "schachtel.jpg": {
        "quelle": "https://images.unsplash.com/photo-1785835181295-7f3357174da5?w=1600&q=85&fm=jpg",
        "ausschnitt": (100, 95, 1540, 1175),
        "weich": None,
    },
}


def laden(url):
    anfrage = urllib.request.Request(url, headers={"User-Agent": "raban-website/werkzeuge"})
    with urllib.request.urlopen(anfrage) as antwort:
        return Image.open(io.BytesIO(antwort.read())).convert("RGB")


def weichzeichnen(bild, oben, unten):
    """Zeichnet den Streifen zwischen `oben` und `unten` leicht weich, mit weichem Übergang zum Rest."""
    maske = Image.new("L", bild.size, 0)
    ImageDraw.Draw(maske).rectangle([0, oben, bild.width, unten], fill=255)
    maske = maske.filter(ImageFilter.GaussianBlur(24))
    return Image.composite(bild.filter(ImageFilter.GaussianBlur(3.2)), bild, maske)


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    for name, foto in FOTOS.items():
        bild = laden(foto["quelle"])
        if foto["weich"]:
            bild = weichzeichnen(bild, *foto["weich"])
        bild = bild.crop(foto["ausschnitt"]).resize((B, H), Image.LANCZOS)
        bild.save(ZIEL / name, quality=84, optimize=True, progressive=True)
        print("gespeichert:", ZIEL / name)


if __name__ == "__main__":
    main()
