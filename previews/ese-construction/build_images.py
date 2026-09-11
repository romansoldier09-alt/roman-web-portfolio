#!/usr/bin/env python3
"""Build web-optimized derivatives of the real ESE project photography.

Originals in the uploaded package are never modified. Everything is written
into site/assets/img (and site/assets/brand for logo files).
"""
import os
from PIL import Image, ImageOps

SRC = "/home/claude/ese/ESE-Claude-Website-Package"
OUT = "/home/claude/ese/site/assets/img"
BRAND_OUT = "/home/claude/ese/site/assets/brand"
os.makedirs(OUT, exist_ok=True)
os.makedirs(BRAND_OUT, exist_ok=True)

# name -> (source path, target aspect w/h or None to keep, widths)
P = "03_PROJECTS"
JOBS = {
    # ---- hero -------------------------------------------------------------
    "hero-eagle-living-open": (f"{P}/01_Eagle-Mountain-Rental/after_09_living-open.jpeg",
                               (3, 4), [720, 1080]),

    # ---- featured project cards ------------------------------------------
    "work-eagle-rental": (f"{P}/01_Eagle-Mountain-Rental/after_10_living-dining-angle.jpeg",
                          (4, 5), [640, 960]),
    "work-riverdale": (f"{P}/05_Riverdale-Main-Floor/after_01_main-area.jpeg",
                       (4, 5), [640, 960]),
    "work-jacob": (f"{P}/04_Jacob-Referral_Aug-2025/after_02_kitchen.jpeg",
                   (4, 5), [640, 960]),

    # ---- supporting work cards -------------------------------------------
    "work-lindon": (f"{P}/02_Lindon-Three-Bedroom/after_02_bedroom.jpeg",
                    (3, 2), [560, 840]),
    "work-basement": (f"{P}/03_Eagle-Mountain-Basement/during_03_cleanup-wide.jpeg",
                      (3, 2), [560, 840]),

    # ---- before / after pairs --------------------------------------------
    "ba-lindon-before": (f"{P}/02_Lindon-Three-Bedroom/before_02_large-bedroom-carpet.jpeg",
                         (3, 4), [520, 780]),
    "ba-lindon-after": (f"{P}/02_Lindon-Three-Bedroom/after_01_large-bedroom.jpeg",
                        (3, 4), [520, 780]),
    "ba-riverdale-before": (f"{P}/05_Riverdale-Main-Floor/before_02_side-room-demo.jpeg",
                            (3, 4), [520, 780]),
    "ba-riverdale-after": (f"{P}/05_Riverdale-Main-Floor/after_04_side-room.jpeg",
                           (3, 4), [520, 780]),

    # ---- process strip (real "during" photos) -----------------------------
    "step-1-subfloor": (f"{P}/02_Lindon-Three-Bedroom/during_05_subfloor-large-room.jpeg",
                        (1, 1), [400]),
    "step-2-underlayment": (f"{P}/02_Lindon-Three-Bedroom/during_02_underlayment.jpeg",
                            (1, 1), [400]),
    "step-3-installing": (f"{P}/01_Eagle-Mountain-Rental/during_01_installing-floor.jpeg",
                          (1, 1), [400]),
    "step-4-transition": (f"{P}/01_Eagle-Mountain-Rental/during_06_transition-closeup.jpeg",
                          (1, 1), [400]),
}


def build(name, src, aspect, widths):
    im = Image.open(os.path.join(SRC, src))
    im = ImageOps.exif_transpose(im).convert("RGB")
    if aspect:
        tw, th = aspect
        target = tw / th
        w, h = im.size
        cur = w / h
        if abs(cur - target) > 0.001:
            if cur > target:               # too wide -> crop sides
                nw = int(round(h * target))
                left = (w - nw) // 2
                im = im.crop((left, 0, left + nw, h))
            else:                          # too tall -> crop from the top
                nh = int(round(w / target))
                # keep the floor: bias the crop downward
                top = int((h - nh) * 0.62)
                im = im.crop((0, top, w, top + nh))
    for wpx in widths:
        if wpx >= im.size[0]:
            r = im.copy()
        else:
            r = im.resize((wpx, round(im.size[1] * wpx / im.size[0])), Image.LANCZOS)
        suf = "" if wpx == widths[0] else f"@{wpx}"
        base = os.path.join(OUT, f"{name}{suf}")
        r.save(base + ".jpg", "JPEG", quality=80, optimize=True, progressive=True)
        r.save(base + ".webp", "WEBP", quality=78, method=6)
        print(f"{name}{suf}  {r.size[0]}x{r.size[1]}")


for n, (s, a, w) in JOBS.items():
    build(n, s, a, w)

# ---- brand assets --------------------------------------------------------
logo = Image.open(os.path.join(SRC, "01_BRAND/ESE-logo-horizontal.png")).convert("RGBA")
lw = 720
logo_r = logo.resize((lw, round(logo.size[1] * lw / logo.size[0])), Image.LANCZOS)
logo_r.save(os.path.join(BRAND_OUT, "ese-logo-horizontal.png"), optimize=True)

# white knockout of the same mark, for the dark footer
alpha = logo_r.split()[3]
white = Image.new("RGBA", logo_r.size, (255, 255, 255, 0))
white.putalpha(alpha)
white.save(os.path.join(BRAND_OUT, "ese-logo-horizontal-white.png"), optimize=True)

icon = Image.open(os.path.join(SRC, "01_BRAND/ESE-icon.png")).convert("RGBA")
icon.resize((512, 512), Image.LANCZOS).save(os.path.join(BRAND_OUT, "ese-icon.png"), optimize=True)
icon.resize((180, 180), Image.LANCZOS).save(os.path.join(BRAND_OUT, "apple-touch-icon.png"), optimize=True)
ico = icon.resize((64, 64), Image.LANCZOS)
ico.save(os.path.join(BRAND_OUT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
print("brand assets written")
