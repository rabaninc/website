"""Schneidet Johannes' Fotos aus Heilbronn für /about zu (AI Start, eigene Aufnahmen mit dem iPhone).

- `treppenhaus.jpg`: das Treppenhaus unter dem Glasdach (IMG_2129, 27.08.2026).
- `bruecke.jpg`: die Bögen der Fußgängerbrücke vor der goldenen Gewitterwolke (IMG_2136, 28.08.2026), unten so
  beschnitten, dass die zwei Menschen am Geländer nicht im Bild sind.
- `finaltag.jpg`: Bürobauten und Schornsteine im Abendlicht am Tag des Finales (IMG_2193, 02.09.2026).

Die Originale (HEIC) liegen nicht im Repo. Sie tragen Ort (GPS) und Zeit; die Zuschnitte werden ohne jede
Metadaten gespeichert. Aufruf: `python3 werkzeuge/auszeichnung-fotos/zuschneiden.py [Ordner mit den HEIC]`
(sonst `~/Downloads`), schreibt nach `public/auszeichnung/`. Braucht `sips` (macOS) und Pillow.
"""

import io
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

QUELLE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads"
ZIEL = Path(__file__).resolve().parents[2] / "public" / "auszeichnung"

# Name: (Original, Ausschnitt als Anteile des aufrecht gedrehten Bildes (links, oben, rechts, unten), Größe)
FOTOS = {
    "treppenhaus.jpg": ("IMG_2129", (0.0, 0.0, 1.0, 1.0), (1200, 1600)),
    # Die Köpfe der beiden am Geländer beginnen bei 92 % der Höhe.
    "bruecke.jpg": ("IMG_2136", (0.0, 0.0, 1.0, 0.9), (1200, 1440)),
    "finaltag.jpg": ("IMG_2193", (0.0, 0.0, 1.0, 1.0), (1600, 1200)),
}


def laden(name):
    """Das Original, über sips als JPEG, aufrecht gedreht und aus dem Farbraum des iPhones (Display P3) nach sRGB
    umgerechnet: gespeichert wird ohne Farbprofil, und ohne Profil liest der Browser sRGB."""
    with tempfile.TemporaryDirectory() as tmp:
        jpg = Path(tmp) / f"{name}.jpg"
        subprocess.run(["sips", "-s", "format", "jpeg", str(QUELLE / f"{name}.HEIC"), "--out", str(jpg)],
                       check=True, capture_output=True)
        bild = Image.open(jpg)
        bild.load()
    profil = bild.info.get("icc_profile")
    bild = ImageOps.exif_transpose(bild).convert("RGB")
    if profil:
        bild = ImageCms.profileToProfile(bild, ImageCms.ImageCmsProfile(io.BytesIO(profil)),
                                         ImageCms.createProfile("sRGB"), renderingIntent=0)
    return bild


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    for name, (original, (l, o, r, u), groesse) in FOTOS.items():
        bild = laden(original)
        b, h = bild.size
        ausschnitt = bild.crop((round(l * b), round(o * h), round(r * b), round(u * h)))
        ausschnitt = ImageOps.fit(ausschnitt, groesse, Image.LANCZOS)
        # Ohne exif=…: Pillow schreibt keine Metadaten mit.
        ausschnitt.save(ZIEL / name, "JPEG", quality=84, optimize=True, progressive=True)
        print(name, ausschnitt.size)


if __name__ == "__main__":
    main()
