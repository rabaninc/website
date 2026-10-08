"""Bereitet die Profilbilder der Gründer für „Unser Team“ auf /about auf (von ihren LinkedIn-Profilen, 08.10.2026).

- `simon.jpg`: Simon Waiß vor grauem Grund.
- `johannes.jpg`: Johannes Koch in der Heidelberger Altstadt; die zwei Passanten rechts hinter seiner Schulter werden
  weichgezeichnet, bis sie nicht mehr zu erkennen sind (fremde Menschen kommen auf der Seite nicht ins Bild).

Die Originale (800 × 800, PNG, so wie LinkedIn sie ausliefert) liegen nicht im Repo. Aufruf:
`python3 werkzeuge/team-fotos/zuschneiden.py [Ordner mit simon-linkedin.png und johannes-linkedin.png]`
(sonst `~/Downloads`), schreibt nach `public/team/`, ohne Metadaten. Braucht Pillow.
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

QUELLE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads"
ZIEL = Path(__file__).resolve().parents[2] / "public" / "team"
GROESSE = (800, 800)

# Name: (Original, Weichzeichnen: (Feld als Rechteck, Umriss des Gründers, der scharf bleibt) in Pixeln des 800er-Bildes)
FOTOS = {
    "simon.jpg": ("simon-linkedin.png", None),
    # Die beiden Passanten stehen zwischen seinem Hals und dem Torbogen, über dem Rucksackgurt. Das Feld läuft mit
    # breitem weichem Rand aus, damit es wie Unschärfe des Hintergrunds wirkt und keine Kante zeigt; sein Umriss
    # (Locken, Hals, Pulli, Gurt) bleibt scharf.
    "johannes.jpg": (
        "johannes-linkedin.png",
        (
            (430, 330, 640, 560),
            [(0, 0), (535, 0), (535, 330), (505, 372), (470, 386), (452, 392), (447, 420), (448, 455), (470, 467),
             (540, 493), (640, 533), (640, 800), (0, 800)],
        ),
    ),
}


def weichzeichnen(bild, wo):
    """Zeichnet das Feld stark weich, ausgenommen den Umriss des Gründers."""
    if not wo:
        return bild
    feld, umriss = wo
    maske = Image.new("L", bild.size, 0)
    ImageDraw.Draw(maske).rectangle(feld, fill=255)
    maske = maske.filter(ImageFilter.GaussianBlur(18))
    schutz = Image.new("L", bild.size, 255)
    ImageDraw.Draw(schutz).polygon(umriss, fill=0)
    schutz = schutz.filter(ImageFilter.GaussianBlur(1.5))
    maske = ImageChops.multiply(maske, schutz)
    return Image.composite(bild.filter(ImageFilter.GaussianBlur(12)), bild, maske)


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    for name, (original, flaechen) in FOTOS.items():
        # LinkedIn liefert PNG ohne Farbprofil, also sRGB; der Alphakanal ist überall deckend.
        bild = Image.open(QUELLE / original).convert("RGB").resize(GROESSE, Image.LANCZOS)
        bild = weichzeichnen(bild, flaechen)
        # Ohne exif=…: Pillow schreibt keine Metadaten mit.
        bild.save(ZIEL / name, "JPEG", quality=86, optimize=True, progressive=True)
        print(name, bild.size)


if __name__ == "__main__":
    main()
