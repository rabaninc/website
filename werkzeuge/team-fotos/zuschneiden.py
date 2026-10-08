"""Bereitet die Profilbilder der Gründer für „Unser Team“ auf /about auf (von ihren LinkedIn-Profilen, 08.10.2026).

- `simon.jpg`: Simon Waiß.
- `johannes.jpg`: Johannes Koch.

Beide genau so, wie sie auf LinkedIn stehen: kein Zuschnitt, keine Retusche, auch nichts weichgezeichnet (Johannes,
08.10.2026: „I don't want any censoring on my photo … Just use the original photo“). Das Skript wandelt nur um.

Die Originale (800 × 800, PNG, so wie LinkedIn sie ausliefert) liegen nicht im Repo. Aufruf:
`python3 werkzeuge/team-fotos/zuschneiden.py [Ordner mit simon-linkedin.png und johannes-linkedin.png]`
(sonst `~/Downloads`), schreibt nach `public/team/`, ohne Metadaten. Braucht Pillow.
"""

import sys
from pathlib import Path

from PIL import Image

QUELLE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads"
ZIEL = Path(__file__).resolve().parents[2] / "public" / "team"

# Name: Original
FOTOS = {
    "simon.jpg": "simon-linkedin.png",
    "johannes.jpg": "johannes-linkedin.png",
}


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    for name, original in FOTOS.items():
        # LinkedIn liefert PNG ohne Farbprofil, also sRGB; der Alphakanal ist überall deckend.
        bild = Image.open(QUELLE / original).convert("RGB")
        # Ohne exif=…: Pillow schreibt keine Metadaten mit.
        bild.save(ZIEL / name, "JPEG", quality=86, optimize=True, progressive=True)
        print(name, bild.size)


if __name__ == "__main__":
    main()
