"""Zeichnet die zwei Fotos in den App-Fenstern der Startseite.

Keine echten Aufnahmen: Beide Bilder sind hier gemalt, Schritt für Schritt mit PIL, damit nichts aus einem
echten Betrieb auf die öffentliche Seite kommt. Ein Druckbogen mit Schmierstreifen am linken Rand (Fenster 01,
am ersten Schritt) und eine Pralinenschachtel, deren Klebelasche aufgegangen ist (Fenster 02, mit der Frage
hochgeladen). Aufruf: `python3 werkzeuge/fenster-fotos/zeichnen.py`, schreibt nach `public/fenster/`.
"""

import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ZIEL = Path(__file__).resolve().parents[2] / "public" / "fenster"
B, H = 480, 360  # Bildgröße
S = 2  # gemalt in doppelter Größe, dann verkleinert: weiche Kanten

SCHOKO = (84, 55, 41)
SCHOKO_DUNKEL = (62, 40, 30)
GOLD = (196, 164, 100)
CREME = (236, 226, 200)
PAPIER = (238, 234, 225)
KARTON_INNEN = (214, 207, 193)


def verlauf(groesse, oben, unten):
    """Senkrechter Farbverlauf."""
    w, h = groesse
    bild = Image.new("RGB", groesse)
    zeichner = ImageDraw.Draw(bild)
    for y in range(h):
        t = y / max(1, h - 1)
        farbe = tuple(round(oben[i] + (unten[i] - oben[i]) * t) for i in range(3))
        zeichner.line([(0, y), (w, y)], fill=farbe)
    return bild


def rauschen(bild, staerke):
    """Bildrauschen wie bei einer Handykamera: graues Rauschen, schwach eingemischt."""
    korn = Image.effect_noise(bild.size, 64).convert("RGB")
    return Image.blend(bild, ImageChops.overlay(bild, korn), staerke)


def vignette(bild, staerke):
    """Ränder etwas dunkler, die Mitte heller, wie bei einem kleinen Objektiv."""
    w, h = bild.size
    maske = Image.new("L", (w, h), 0)
    ImageDraw.Draw(maske).ellipse([-w * 0.15, -h * 0.2, w * 1.15, h * 1.2], fill=255)
    maske = maske.filter(ImageFilter.GaussianBlur(w * 0.18))
    dunkel = Image.blend(bild, Image.new("RGB", bild.size, (0, 0, 0)), staerke)
    return Image.composite(bild, dunkel, maske)


def perspektive(quelle, ecken, groesse):
    """Legt `quelle` (ein Rechteck) auf das Viereck `ecken` (oben links, oben rechts, unten rechts, unten links)."""
    w, h = quelle.size
    von = [(0, 0), (w, 0), (w, h), (0, h)]
    # Koeffizienten für Image.PERSPECTIVE: bilden Zielpunkte auf Quellpunkte ab.
    zeilen, rechts = [], []
    for (x, y), (u, v) in zip(ecken, von):
        zeilen.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); rechts.append(u)
        zeilen.append([0, 0, 0, x, y, 1, -v * x, -v * y]); rechts.append(v)
    koeff = loesen(zeilen, rechts)
    maske = Image.new("L", quelle.size, 255)
    bild = quelle.transform(groesse, Image.PERSPECTIVE, koeff, Image.BICUBIC)
    alpha = maske.transform(groesse, Image.PERSPECTIVE, koeff, Image.BICUBIC)
    bild.putalpha(alpha)
    return bild


def loesen(a, b):
    """Gauß-Elimination für das 8×8-System der Perspektive."""
    n = len(b)
    m = [zeile[:] + [b[i]] for i, zeile in enumerate(a)]
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(m[i][k]))
        m[k], m[p] = m[p], m[k]
        for i in range(k + 1, n):
            f = m[i][k] / m[k][k]
            for j in range(k, n + 1):
                m[i][j] -= f * m[k][j]
    x = [0.0] * n
    for i in reversed(range(n)):
        x[i] = (m[i][n] - sum(m[i][j] * x[j] for j in range(i + 1, n))) / m[i][i]
    return x


def schatten(groesse, ecken, versatz, weich, staerke):
    """Weicher Schatten unter einem Viereck."""
    maske = Image.new("L", groesse, 0)
    ImageDraw.Draw(maske).polygon([(x + versatz[0], y + versatz[1]) for x, y in ecken], fill=round(255 * staerke))
    return maske.filter(ImageFilter.GaussianBlur(weich))


def druckbogen():
    """Fenster 01: ein Bogen aus der Auslage, sechs Nutzen einer Pralinenschachtel, links schmiert die Farbe."""
    w, h = B * S, H * S
    grund = verlauf((w, h), (104, 110, 114), (68, 73, 77))
    grund = rauschen(grund, 0.18)

    bw, bh = 880, 640
    bogen = Image.new("RGB", (bw, bh), PAPIER)
    z = ImageDraw.Draw(bogen)
    for reihe in range(2):
        for spalte in range(3):
            x0, y0 = 70 + spalte * 270, 60 + reihe * 290
            z.rounded_rectangle([x0, y0, x0 + 240, y0 + 250], 14, fill=SCHOKO)
            z.rectangle([x0, y0 + 96, x0 + 240, y0 + 132], fill=GOLD)
            z.ellipse([x0 + 92, y0 + 160, x0 + 148, y0 + 216], fill=CREME)
            z.line([x0 - 12, y0 - 12, x0 + 252, y0 - 12], fill=(205, 200, 190), width=2)
    # Schmieren am linken Rand: Farbe, die über den Bogen gezogen ist.
    zufall = random.Random(7)
    schmier = Image.new("L", (bw, bh), 0)
    zs = ImageDraw.Draw(schmier)
    for _ in range(46):
        y = zufall.uniform(0, bh)
        lang = zufall.uniform(40, 190)
        dick = zufall.uniform(3, 16)
        zs.line([(zufall.uniform(-10, 30), y), (lang, y + zufall.uniform(-8, 8))], fill=zufall.randint(90, 210), width=round(dick))
    schmier = schmier.filter(ImageFilter.GaussianBlur(7))
    bogen = Image.composite(Image.new("RGB", (bw, bh), (46, 32, 26)), bogen, schmier)
    bogen = rauschen(bogen, 0.08)

    ecken = [(90, 70), (880, 40), (912, 680), (52, 700)]
    grund.paste((0, 0, 0), (0, 0), schatten((w, h), ecken, (10, 16), 18, 0.45))
    lage = perspektive(bogen, ecken, (w, h))
    grund.paste(lage, (0, 0), lage)
    bild = vignette(grund, 0.35)
    bild = bild.filter(ImageFilter.GaussianBlur(1.1)).resize((B, H), Image.LANCZOS)
    return rauschen(bild, 0.12)


def schachtel():
    """Fenster 02: eine Pralinenschachtel auf dem Tisch, an der vorderen Ecke ist die Klebelasche aufgegangen."""
    w, h = B * S, H * S
    grund = verlauf((w, h), (206, 202, 194), (164, 160, 152))
    grund = rauschen(grund, 0.16)

    p = lambda x, y: (x * S, y * S)  # noqa: E731 — Punkte in Bildmaßen
    # Zwei Fluchtpunkte: die vordere Ecke F zeigt zum Betrachter, links und rechts laufen die Seiten weg.
    links, vorn, rechts, hinten = p(64, 158), p(236, 214), p(424, 146), p(254, 100)
    links_u, vorn_u, rechts_u = p(64, 202), p(236, 262), p(424, 188)
    deckel = [links, vorn, rechts, hinten]
    seite_links = [links, vorn, vorn_u, links_u]
    seite_rechts = [vorn, rechts, rechts_u, vorn_u]
    grund.paste((0, 0, 0), (0, 0), schatten((w, h), [links_u, vorn_u, rechts_u, p(424, 150), p(64, 162)], (18, 20), 24, 0.5))

    z = ImageDraw.Draw(grund)
    z.polygon(seite_links, fill=SCHOKO_DUNKEL)
    z.polygon(seite_rechts, fill=(50, 33, 25))
    z.polygon(deckel, fill=SCHOKO)
    # Goldband quer über den Deckel und weiter die linke Seite hinunter, das Zeichen der Confiserie daneben.
    z.polygon([p(105, 171), p(126, 178), p(315, 117), p(295, 111)], fill=GOLD)
    z.polygon([p(105, 171), p(126, 178), p(126, 224), p(105, 216)], fill=(166, 136, 82))
    z.ellipse([p(304, 139), p(356, 161)], fill=CREME)
    # Die aufgegangene Lasche: die rechte Seite steht an der vorderen Ecke ab, dazwischen der rohe Karton.
    z.polygon([vorn, p(252, 208), p(252, 255), vorn_u], fill=KARTON_INNEN)
    z.polygon([p(252, 208), p(262, 204), p(262, 251), p(252, 255)], fill=(122, 98, 82))
    z.line([vorn, vorn_u], fill=(28, 19, 15), width=2 * S)

    # Licht von oben links auf dem Deckel.
    licht = Image.new("L", (w, h), 0)
    ImageDraw.Draw(licht).polygon(deckel, fill=70)
    licht = licht.filter(ImageFilter.GaussianBlur(70))
    grund = Image.composite(Image.new("RGB", (w, h), (255, 246, 230)), grund, licht)

    bild = vignette(grund, 0.3)
    bild = bild.filter(ImageFilter.GaussianBlur(1.0)).resize((B, H), Image.LANCZOS)
    return rauschen(bild, 0.12)


if __name__ == "__main__":
    ZIEL.mkdir(parents=True, exist_ok=True)
    druckbogen().save(ZIEL / "druckbogen.jpg", quality=84, optimize=True)
    schachtel().save(ZIEL / "schachtel.jpg", quality=84, optimize=True)
    print("gespeichert:", ZIEL / "druckbogen.jpg", ZIEL / "schachtel.jpg")
