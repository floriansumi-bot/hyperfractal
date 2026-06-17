"""Generate HyperFractal PWA icons + social card from the mandala art."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BG = (7, 5, 18)
TEXT = (237, 233, 255)
MUTED = (169, 159, 208)
CYAN = (0, 240, 255)
MAG = (255, 0, 230)
VIO = (155, 92, 255)
GRN = (59, 255, 143)

mandala = Image.open(os.path.join(HERE, "mandala.png")).convert("RGBA")


def font(size, bold=True):
    names = (["arialbd.ttf", "segoeuib.ttf"] if bold else ["arial.ttf", "segoeui.ttf"])
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()


def circle_crop(img, size):
    img = img.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size, size], fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def glow_disc(size, color, alpha=120):
    g = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(g).ellipse([size * 0.08, size * 0.08, size * 0.92, size * 0.92],
                              fill=color + (alpha,))
    return g.filter(ImageFilter.GaussianBlur(size * 0.10))


def make_icon(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(size * 0.22)
    d.rounded_rectangle([0, 0, size, size], radius=r, fill=BG)
    img = Image.alpha_composite(img, glow_disc(size, VIO, 110))
    m = circle_crop(mandala, int(size * 0.84))
    off = (size - m.width) // 2
    img.paste(m, (off, off), m)
    return img


def make_og():
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), BG)
    # glow blobs
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([-160, 120, 520, 720], fill=CYAN + (40,))
    gd.ellipse([-40, -160, 540, 420], fill=VIO + (50,))
    gd.ellipse([760, 260, 1360, 820], fill=MAG + (38,))
    img = Image.alpha_composite(img, glow.filter(ImageFilter.GaussianBlur(120)))

    # mandala on the left with glow
    img = Image.alpha_composite(img, _placed(glow_disc(430, VIO, 120), 40, 100))
    m = circle_crop(mandala, 360)
    img.paste(m, (75, 135), m)

    d = ImageDraw.Draw(img)
    x = 500
    d.text((x, 150), "HyperFractal", font=font(56), fill=TEXT)
    d.text((x, 248), "Fractals that", font=font(72), fill=TEXT)
    d.text((x, 330), "dance to the music.", font=font(72), fill=CYAN)
    d.text((x, 446), "Real-time, audio-reactive WebGL", font=font(28, bold=False), fill=MUTED)
    d.text((x, 484), "for raves, parties & projection mapping.", font=font(28, bold=False), fill=MUTED)
    d.text((x, 556), "a portfolio project by Florian Sumi", font=font(23, bold=False), fill=(111, 102, 153))
    img.convert("RGB").save(os.path.join(HERE, "og-image.png"), "PNG")


def _placed(layer, x, y):
    base = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
    base.paste(layer, (x, y), layer)
    return base


make_icon(192).convert("RGB").save(os.path.join(HERE, "icon-192.png"), "PNG")
make_icon(512).convert("RGB").save(os.path.join(HERE, "icon-512.png"), "PNG")
make_og()
print("Wrote icon-192.png, icon-512.png, og-image.png")
