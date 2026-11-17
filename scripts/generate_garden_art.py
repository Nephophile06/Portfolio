"""
Masterpiece Botanical Jasmine & Komorebi Generator:
100% pure SVG code recreation of the user reference photograph (media_1794887873538_bda7f0a5.jpg).
- Star Jasmine (Jasminum officinale / polyanthum):
  * True star-like elongated twisting petals (5-6 lobes) with pure silk-white highlights and ivory-sage depth.
  * Recessed floral throat with subtle warm honey glow and central pistil.
  * Characteristic pinkish-cream spiraled tight buds clustered on slender pedicels.
  * Rich dark glossy olive-emerald pinnate foliage with split-surface illumination and delicate midribs.
  * Interwoven depth: leaves overlapping flowers, flowers overlapping stems, buds nodding outward.
  * Dual-stage realistic soft wall drop shadow (directional light from top-left).
  * Delicate fallen petals scattered across the sage-green plaster wall.
- Komorebi Atmosphere:
  * Soft leafy canopy silhouettes and warm dapples of sunlight filtering onto the sage plaster wall.
"""
import math
import random

def build_jasmine_svg():
    width = 780
    height = 1200

    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%" preserveAspectRatio="xMaxYMin meet">')
    
    # ── DEFS ─────────────────────────────────────────────────────────────
    svg.append('<defs>')
    
    # Wall Cast Shadows (Directional light from upper-left casting soft shadows onto sage plaster wall)
    svg.append('''
    <filter id="wallShadow" x="-30%" y="-30%" width="165%" height="165%">
        <feDropShadow dx="-15" dy="22" stdDeviation="13" flood-color="#243018" flood-opacity="0.38" />
        <feDropShadow dx="-4" dy="7" stdDeviation="4" flood-color="#141c0d" flood-opacity="0.22" />
    </filter>

    <filter id="petalWallShadow" x="-45%" y="-45%" width="190%" height="190%">
        <feDropShadow dx="-10" dy="16" stdDeviation="9" flood-color="#243018" flood-opacity="0.32" />
        <feDropShadow dx="-3" dy="4" stdDeviation="2.5" flood-color="#141c0d" flood-opacity="0.18" />
    </filter>
    ''')

    # Gradients for Star Jasmine Petals
    svg.append('''
    <!-- Top-facing Petal: Silky pure white with very subtle warm ivory luminous core -->
    <linearGradient id="petalTop" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="60%" stop-color="#fdfdfb"/>
        <stop offset="85%" stop-color="#f0f5ea"/>
        <stop offset="100%" stop-color="#d9e3d0"/>
    </linearGradient>

    <!-- Under/Recessed Petal: Ambient occlusion from overlapping petals -->
    <linearGradient id="petalUnder" x1="40%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stop-color="#f7f9f3"/>
        <stop offset="50%" stop-color="#e5ede0"/>
        <stop offset="85%" stop-color="#cdd8c3"/>
        <stop offset="100%" stop-color="#b4c2a7"/>
    </linearGradient>

    <!-- Petal Specular Highlight along curving spine -->
    <linearGradient id="petalSpine" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- Deep Jasmine Floral Throat (Recessed green cup with golden stamen glow) -->
    <radialGradient id="throatGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1d2812"/>
        <stop offset="40%" stop-color="#465b2d"/>
        <stop offset="70%" stop-color="#8ba567" stop-opacity="0.8"/>
        <stop offset="90%" stop-color="#dce6d2" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>

    <!-- Golden Anther Throat Accent -->
    <linearGradient id="antherGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="45%" stop-color="#eab308"/>
        <stop offset="100%" stop-color="#a16207"/>
    </linearGradient>

    <!-- Calyx & Pedicel Green -->
    <linearGradient id="calyxGreen" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#698345"/>
        <stop offset="50%" stop-color="#495d2f"/>
        <stop offset="100%" stop-color="#2a371a"/>
    </linearGradient>

    <!-- Jasmine Bud Gradient: characteristic pinkish-burgundy tip melting into ivory and green sepal -->
    <linearGradient id="budSpiraled" x1="40%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stop-color="#e2afb5"/>
        <stop offset="20%" stop-color="#fcf8f6"/>
        <stop offset="60%" stop-color="#edf3e6"/>
        <stop offset="85%" stop-color="#7d995c"/>
        <stop offset="100%" stop-color="#3d5029"/>
    </linearGradient>
    ''')

    # Gradients for Foliage (Deep rich contrasting dark olive greens)
    svg.append('''
    <!-- Lit Side of Leaf: glossy rich olive-emerald -->
    <linearGradient id="leafSun" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#67853f"/>
        <stop offset="40%" stop-color="#4f692d"/>
        <stop offset="80%" stop-color="#384c1e"/>
        <stop offset="100%" stop-color="#253412"/>
    </linearGradient>

    <!-- Shade Side of Leaf: deep velvety dark forest olive -->
    <linearGradient id="leafShadow" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#3e5223"/>
        <stop offset="40%" stop-color="#2c3b16"/>
        <stop offset="80%" stop-color="#1c260c"/>
        <stop offset="100%" stop-color="#101706"/>
    </linearGradient>

    <!-- Leaf Central Midrib -->
    <linearGradient id="leafMidrib" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9fc26c"/>
        <stop offset="50%" stop-color="#759746"/>
        <stop offset="100%" stop-color="#3e5323"/>
    </linearGradient>

    <!-- Leaf Specular Shine -->
    <linearGradient id="leafSheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- Vine Stem (Woody olive-brown) -->
    <linearGradient id="stemWood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#5a6744"/>
        <stop offset="40%" stop-color="#434e31"/>
        <stop offset="80%" stop-color="#2f3820"/>
        <stop offset="100%" stop-color="#1f2514"/>
    </linearGradient>
    ''')

    svg.append('</defs>')

    # ── BOTANICAL GROUP WITH DIRECTIONAL WALL DROP SHADOW ────────────────
    svg.append('<g id="jasmineBotanical" filter="url(#wallShadow)">')

    # Helper: True Botanical Leaf (pointed ovate with curved margin, split shading, midrib, lateral veins)
    def render_leaf(bx, by, length, angle_deg, curve=0):
        rad = math.radians(angle_deg)
        cos_a = math.cos(rad)
        sin_a = math.sin(rad)
        w = length * 0.35  # slightly more slender than before, authentic to jasmine leaflets

        tip_x = bx + length * cos_a - curve * sin_a
        tip_y = by + length * sin_a + curve * cos_a

        mid_x = (bx + tip_x) / 2
        mid_y = (by + tip_y) / 2
        norm_x = -sin_a
        norm_y = cos_a

        # Outer curve points
        c1_x = bx + (length * 0.30) * cos_a + w * norm_x
        c1_y = by + (length * 0.30) * sin_a + w * norm_y
        c2_x = bx + (length * 0.76) * cos_a + (w * 0.65) * norm_x
        c2_y = by + (length * 0.76) * sin_a + (w * 0.65) * norm_y

        c3_x = bx + (length * 0.30) * cos_a - w * norm_x
        c3_y = by + (length * 0.30) * sin_a - w * norm_y
        c4_x = bx + (length * 0.76) * cos_a - (w * 0.65) * norm_x
        c4_y = by + (length * 0.76) * sin_a - (w * 0.65) * norm_y

        lp = []
        lp.append('<g class="leaf">')
        # Lit Half
        lp.append(f'<path d="M {bx:.1f} {by:.1f} C {c1_x:.1f} {c1_y:.1f}, {c2_x:.1f} {c2_y:.1f}, {tip_x:.1f} {tip_y:.1f} Q {mid_x:.1f} {mid_y:.1f} {bx:.1f} {by:.1f} Z" fill="url(#leafSun)"/>')
        # Shade Half
        lp.append(f'<path d="M {bx:.1f} {by:.1f} C {c3_x:.1f} {c3_y:.1f}, {c4_x:.1f} {c4_y:.1f}, {tip_x:.1f} {tip_y:.1f} Q {mid_x:.1f} {mid_y:.1f} {bx:.1f} {by:.1f} Z" fill="url(#leafShadow)"/>')
        # Subtle Specular Sheen
        shx = bx + (length * 0.25) * cos_a + (w * 0.55) * norm_x
        shy = by + (length * 0.25) * sin_a + (w * 0.55) * norm_y
        lp.append(f'<path d="M {bx:.1f} {by:.1f} C {shx:.1f} {shy:.1f}, {c2_x:.1f} {c2_y:.1f}, {tip_x:.1f} {tip_y:.1f}" stroke="url(#leafSheen)" stroke-width="{length*0.13:.1f}" fill="none" stroke-linecap="round"/>')
        # Pale Midrib
        lp.append(f'<path d="M {bx:.1f} {by:.1f} Q {mid_x:.1f} {mid_y:.1f} {tip_x:.1f} {tip_y:.1f}" stroke="url(#leafMidrib)" stroke-width="1.1" fill="none" stroke-linecap="round"/>')
        # Delicate Secondary Veins
        for frac in [0.28, 0.50, 0.72]:
            vx = bx + frac * (tip_x - bx)
            vy = by + frac * (tip_y - by)
            v_len = w * (1.0 - frac * 0.45) * 0.62
            lvx = vx + v_len * norm_x + (length * 0.08) * cos_a
            lvy = vy + v_len * norm_y + (length * 0.08) * sin_a
            lp.append(f'<path d="M {vx:.1f} {vy:.1f} Q {(vx+lvx)/2:.1f} {(vy+lvy)/2:.1f} {lvx:.1f} {lvy:.1f}" stroke="#91b264" stroke-width="0.55" stroke-opacity="0.5" fill="none"/>')
            svx = vx - v_len * norm_x + (length * 0.08) * cos_a
            svy = vy - v_len * norm_y + (length * 0.08) * sin_a
            lp.append(f'<path d="M {vx:.1f} {vy:.1f} Q {(vx+svx)/2:.1f} {(vy+svy)/2:.1f} {svx:.1f} {svy:.1f}" stroke="#18220c" stroke-width="0.5" stroke-opacity="0.4" fill="none"/>')
        lp.append('</g>')
        return "\n".join(lp)

    # Helper: True Star Jasmine Petal (Elongated, slender waist, gentle graceful flare, soft taper)
    def render_star_petal(cx, cy, length, angle_deg, width_ratio=0.34, is_shaded=False, twist=0):
        rad = math.radians(angle_deg)
        cos_a = math.cos(rad)
        sin_a = math.sin(rad)
        norm_x = -sin_a
        norm_y = cos_a

        tip_x = cx + length * cos_a + twist * norm_x
        tip_y = cy + length * sin_a + twist * norm_y

        pw = length * width_ratio

        # Narrow base at corolla tube throat, expanding at 60%, gentle tip
        # Left side control points
        cp1_x = cx + (length * 0.22) * cos_a + (pw * 0.55) * norm_x
        cp1_y = cy + (length * 0.22) * sin_a + (pw * 0.55) * norm_y
        cp2_x = cx + (length * 0.68) * cos_a + pw * norm_x
        cp2_y = cy + (length * 0.68) * sin_a + pw * norm_y

        # Right side control points
        cp3_x = cx + (length * 0.68) * cos_a - pw * norm_x
        cp3_y = cy + (length * 0.68) * sin_a - pw * norm_y
        cp4_x = cx + (length * 0.22) * cos_a - (pw * 0.55) * norm_x
        cp4_y = cy + (length * 0.22) * sin_a - (pw * 0.55) * norm_y

        fill = "url(#petalUnder)" if is_shaded else "url(#petalTop)"
        stroke = "#dbe5d2" if is_shaded else "#edf3e7"

        p = []
        p.append(f'<path d="M {cx:.1f} {cy:.1f} C {cp1_x:.1f} {cp1_y:.1f}, {cp2_x:.1f} {cp2_y:.1f}, {tip_x:.1f} {tip_y:.1f} C {cp3_x:.1f} {cp3_y:.1f}, {cp4_x:.1f} {cp4_y:.1f}, {cx:.1f} {cy:.1f} Z" fill="{fill}" stroke="{stroke}" stroke-width="0.5"/>')
        # Soft curving ridge highlight
        mid_x = (cx + tip_x) / 2
        mid_y = (cy + tip_y) / 2
        p.append(f'<path d="M {cx:.1f} {cy:.1f} Q {mid_x:.1f} {mid_y:.1f} {tip_x:.1f} {tip_y:.1f}" stroke="url(#petalSpine)" stroke-width="1.3" fill="none" opacity="0.6"/>')
        return "\n".join(p)

    # Helper: Open Star Jasmine Flower (Facing Forward / Slight Tilt)
    def render_star_flower_front(cx, cy, scale=1.0, rot=0, pet_count=5):
        f = []
        f.append(f'<g class="jasmine-bloom" transform="translate({cx:.1f}, {cy:.1f}) rotate({rot:.1f}) scale({scale:.2f})">')
        # Soft green shadow base
        f.append(f'<circle cx="0" cy="0" r="14" fill="url(#throatGlow)" opacity="0.7"/>')

        step = 360.0 / pet_count
        angles = [i * step for i in range(pet_count)]
        for idx, ang in enumerate(angles):
            is_back = (idx % 2 == 1)
            p_len = 36 + (idx * 3 % 5) - 2
            p_rot = ang + (idx * 5 % 7) - 3
            twist = ((idx % 3) - 1) * 2.5
            f.append(render_star_petal(0, 0, p_len, p_rot, width_ratio=0.33, is_shaded=is_back, twist=twist))

        # Receptacle Throat (Central throat with depth and delicate golden stamen peek)
        f.append(f'<circle cx="0" cy="0" r="8" fill="url(#throatGlow)"/>')
        f.append(f'<circle cx="0" cy="0" r="3.8" fill="#1b2511"/>')
        # Two delicate golden anthers nestled inside the tube opening (authentic to real jasmine)
        f.append(f'<ellipse cx="-1.2" cy="-0.8" rx="1.3" ry="2.0" transform="rotate(-25 -1.2 -0.8)" fill="url(#antherGold)"/>')
        f.append(f'<ellipse cx="1.2" cy="0.8" rx="1.3" ry="2.0" transform="rotate(-25 1.2 0.8)" fill="url(#antherGold)"/>')
        f.append(f'<circle cx="0" cy="0" r="0.9" fill="#fef9c3"/>')
        f.append('</g>')
        return "\n".join(f)

    # Helper: Three-Quarter Tilted Star Jasmine
    def render_star_flower_tilted(cx, cy, scale=1.0, rot=0):
        f = []
        f.append(f'<g class="jasmine-tilted" transform="translate({cx:.1f}, {cy:.1f}) rotate({rot:.1f}) scale({scale:.2f})">')
        # Green pedicel & calyx star peeking behind
        f.append(f'<path d="M 0 0 C 3 8, 9 18, 12 25" stroke="url(#calyxGreen)" stroke-width="2.8" fill="none" stroke-linecap="round"/>')
        f.append(f'<ellipse cx="2" cy="8" rx="5" ry="8" fill="url(#calyxGreen)"/>')

        petals = [
            (270, 38, 0.33, False, 0),
            (335, 36, 0.32, False, -2),
            (45, 23, 0.30, True, 1),
            (135, 21, 0.30, True, -1),
            (210, 34, 0.32, False, 2),
        ]
        for ang, r, wr, shaded, tw in petals:
            f.append(render_star_petal(0, 0, r, ang, width_ratio=wr, is_shaded=shaded, twist=tw))

        f.append(f'<ellipse cx="0.8" cy="1.5" rx="5.5" ry="4" fill="url(#throatGlow)"/>')
        f.append(f'<ellipse cx="0.8" cy="1.5" rx="2.5" ry="1.8" fill="#1b2511"/>')
        f.append(f'<ellipse cx="0.5" cy="1.2" rx="1.2" ry="1.6" fill="url(#antherGold)"/>')
        f.append('</g>')
        return "\n".join(f)

    # Helper: Side Profile Star Jasmine (Exquisite flared floral tube & starry lobes)
    def render_star_flower_side(cx, cy, scale=1.0, rot=0):
        f = []
        f.append(f'<g class="jasmine-side" transform="translate({cx:.1f}, {cy:.1f}) rotate({rot:.1f}) scale({scale:.2f})">')
        # Long slender green floral tube (authentic Jasminum anatomy)
        f.append(f'<path d="M 0 32 C -2 22, -3 14, -4 4 C -5 -2, -6 -5, -7 -9" stroke="url(#calyxGreen)" stroke-width="3.2" fill="none" stroke-linecap="round"/>')
        # Calyx 5 slender linear sepals
        f.append(f'<path d="M -7 -9 L -13 -15 L -6 -11 L -5 -18 L -3 -11 L 1 -15 L -2 -8 Z" fill="url(#calyxGreen)"/>')
        # Slender corolla tube transitioning from green to ivory
        f.append(f'<path d="M -7 -9 C -10 -15, -15 -20, -22 -23 C -10 -22, 4 -20, 14 -21 C 5 -16, -2 -12, -3 -9 Z" fill="url(#petalUnder)"/>')
        # Flared starry petals spreading outward
        f.append(f'<path d="M -22 -23 C -34 -28, -44 -38, -40 -46 C -30 -42, -18 -33, -10 -26 Z" fill="url(#petalTop)" stroke="#edf4e7" stroke-width="0.5"/>')
        f.append(f'<path d="M -13 -25 C -11 -38, -6 -52, 4 -54 C 4 -41, -1 -31, -2 -24 Z" fill="url(#petalTop)" stroke="#edf4e7" stroke-width="0.5"/>')
        f.append(f'<path d="M 2 -22 C 14 -29, 27 -33, 34 -28 C 26 -21, 16 -19, 9 -21 Z" fill="url(#petalUnder)" stroke="#dbe5d2" stroke-width="0.5"/>')
        f.append(f'<circle cx="-4" cy="-24" r="1.5" fill="url(#antherGold)"/>')
        f.append('</g>')
        return "\n".join(f)

    # Helper: Jasmine Buds Cluster (Slender spiraled pinkish-cream buds)
    def render_bud_cluster(cx, cy, scale=1.0, rot=0):
        b = []
        b.append(f'<g class="jasmine-buds" transform="translate({cx:.1f}, {cy:.1f}) rotate({rot:.1f}) scale({scale:.2f})">')
        b.append(f'<path d="M 0 25 Q -4 12 -9 0" stroke="url(#stemWood)" stroke-width="1.8" fill="none"/>')
        b.append(f'<path d="M 0 25 Q 1 11 2 -6" stroke="url(#stemWood)" stroke-width="1.8" fill="none"/>')
        b.append(f'<path d="M 0 25 Q 6 14 13 2" stroke="url(#stemWood)" stroke-width="1.8" fill="none"/>')
        
        buds = [
            (-9, 0, -22, 22),
            (2, -6, 6, 25),
            (13, 2, 30, 20),
        ]
        for bx, by, bang, blen in buds:
            b_rad = math.radians(bang)
            cos_b = math.cos(b_rad)
            sin_b = math.sin(b_rad)
            tipx = bx + blen * sin_b
            tipy = by - blen * cos_b
            # Green calyx cup with tiny teeth
            b.append(f'<path d="M {bx-2.8} {by} Q {bx} {by-5} {bx+2.8} {by} L {bx} {by+5} Z" fill="url(#calyxGreen)"/>')
            # Pointed spiraled bud body (pinkish-ivory tip)
            b.append(f'<path d="M {bx-3.2} {by-2} Q {bx-3.8} {by-blen*0.55} {tipx} {tipy} Q {bx+3.8} {by-blen*0.55} {bx+3.2} {by-2} Z" fill="url(#budSpiraled)" stroke="#cdd9c2" stroke-width="0.5"/>')
            # Spiral seam lines
            b.append(f'<path d="M {bx-1.0} {by-2} Q {bx-1.8} {by-blen*0.62} {tipx} {tipy}" stroke="#98ad7f" stroke-width="0.5" fill="none"/>')
        b.append('</g>')
        return "\n".join(b)

    # ── 1. MAIN WOODY VINES (Organic sweeping Bézier curves) ─────────────
    stems = []
    # Primary Main Trunk: Sweeps from top-right down along the right side
    stems.append('''
    <!-- Main Vine Trunk -->
    <path d="M 790 -20 
             C 730 80, 640 170, 560 250 
             C 470 340, 420 440, 440 570 
             C 460 700, 530 840, 570 990 
             C 600 1100, 630 1190, 660 1240" 
          stroke="url(#stemWood)" stroke-width="6.5" fill="none" stroke-linecap="round"/>
    ''')

    # Graceful Upper Arch reaching inwards (matches top left branch of reference photo)
    stems.append('''
    <path d="M 690 90 
             C 590 75, 480 85, 390 130 
             C 300 175, 230 240, 190 330" 
          stroke="url(#stemWood)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    ''')

    # Mid Branch reaching inwards
    stems.append('''
    <path d="M 500 310 
             C 410 340, 340 410, 290 490 
             C 260 550, 250 630, 260 700" 
          stroke="url(#stemWood)" stroke-width="4.0" fill="none" stroke-linecap="round"/>
    ''')

    # Center-low drooping cluster branch
    stems.append('''
    <path d="M 450 540 
             C 400 600, 360 690, 370 780 
             C 380 850, 420 920, 460 990" 
          stroke="url(#stemWood)" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    ''')

    # Lower cascading vine
    stems.append('''
    <path d="M 530 850 
             C 470 920, 430 1010, 450 1100 
             C 460 1140, 490 1180, 530 1210" 
          stroke="url(#stemWood)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    ''')

    twigs = [
        "M 730 30 Q 650 20 590 40",
        "M 560 95 Q 490 80 420 105",
        "M 420 125 Q 350 110 290 135",
        "M 320 165 Q 260 175 220 215",
        "M 220 255 Q 180 295 140 350",
        "M 520 270 Q 440 270 380 310",
        "M 450 360 Q 380 400 330 460",
        "M 350 450 Q 290 480 250 540",
        "M 280 560 Q 250 610 230 670",
        "M 440 670 Q 380 710 340 770",
        "M 380 780 Q 330 830 310 890",
        "M 420 880 Q 370 930 350 1000",
        "M 490 970 Q 430 1020 400 1090",
        "M 460 1060 Q 420 1110 400 1160"
    ]
    for tw in twigs:
        stems.append(f'<path d="{tw}" stroke="url(#stemWood)" stroke-width="2.0" fill="none" stroke-linecap="round"/>')

    svg.append("\n".join(stems))

    # ── 2. RICH CONTRASTING DARK OLIVE LEAFLETS ───────────────────────────
    leaves = [
        # Upper inward arch (x: 120 - 750, y: 10 - 370)
        (750, 10, 50, -140, -4),
        (720, 45, 46, -165, 4),
        (670, 35, 48, -120, -3),
        (630, 50, 44, -150, 4),
        (580, 65, 46, -170, -3),
        (530, 80, 44, 160, 4),
        (470, 90, 48, -155, -4),
        (420, 110, 44, -175, 4),
        (370, 130, 50, 165, -4),
        (320, 155, 46, 150, 4),
        (270, 185, 44, 135, -4),
        (230, 225, 42, 120, 4),
        (190, 275, 40, 110, -3),
        (150, 325, 38, 125, 4),
        (120, 370, 35, 105, -3),

        # Outer right backing foliage
        (730, 150, 52, -40, 4),
        (750, 230, 50, -25, -4),
        (710, 300, 48, -50, 3),
        (740, 400, 52, -35, -4),
        (760, 510, 48, -20, 4),
        (720, 610, 50, -45, -3),
        (740, 730, 48, -30, 4),
        (710, 840, 46, -50, -4),
        (730, 950, 48, -35, 4),
        (750, 1070, 44, -25, -3),

        # Mid cascading foliage (x: 230 - 610, y: 210 - 640)
        (610, 210, 48, -135, 4),
        (560, 230, 50, -160, -4),
        (510, 260, 46, 170, 4),
        (460, 300, 48, 145, -4),
        (410, 340, 46, 130, 4),
        (360, 380, 44, 155, -4),
        (320, 430, 42, 140, 3),
        (280, 480, 40, 120, -3),
        (250, 540, 38, 110, 4),
        (230, 610, 36, 125, -3),

        # Center cluster leaves (y: 590 - 930)
        (530, 440, 48, -145, 4),
        (480, 480, 50, -170, -4),
        (440, 520, 46, 155, 4),
        (400, 570, 48, 135, -4),
        (360, 620, 44, 120, 4),
        (320, 680, 42, 145, -3),
        (290, 740, 40, 115, 3),
        (350, 770, 42, 130, -4),
        (320, 830, 38, 110, 3),
        (290, 890, 36, 95, -3),

        # Lower draping leaves (y: 880 - 1180)
        (560, 710, 48, -140, 4),
        (510, 760, 50, -165, -4),
        (470, 820, 46, 150, 4),
        (430, 880, 44, 135, -3),
        (390, 940, 42, 120, 4),
        (360, 1000, 40, 140, -4),
        (500, 950, 46, -145, 4),
        (460, 1010, 44, 160, -4),
        (420, 1070, 40, 125, 3),
        (460, 1110, 38, 145, -3),
        (430, 1150, 36, 115, 3),
    ]

    for lx, ly, llen, lang, lcurv in leaves:
        svg.append(render_leaf(lx, ly, llen, lang, lcurv))

    # ── 3. ABUNDANT STAR JASMINE BLOOMS & BUDS ────────────────────────────
    flowers = []

    # Cluster A: Upper Inward Arch (matches top-left branch of reference photo)
    flowers.append(render_bud_cluster(150, 350, scale=0.92, rot=28))
    flowers.append(render_star_flower_side(180, 300, scale=0.95, rot=-115))
    flowers.append(render_star_flower_tilted(220, 260, scale=1.02, rot=-55))
    flowers.append(render_star_flower_front(270, 210, scale=1.18, rot=42, pet_count=5))
    flowers.append(render_star_flower_tilted(320, 175, scale=1.08, rot=-28))
    flowers.append(render_star_flower_front(380, 145, scale=1.22, rot=16, pet_count=6))
    flowers.append(render_star_flower_side(430, 125, scale=0.98, rot=-78))
    flowers.append(render_star_flower_front(490, 105, scale=1.20, rot=-12, pet_count=5))
    flowers.append(render_star_flower_tilted(550, 85, scale=1.08, rot=32))
    flowers.append(render_star_flower_front(620, 68, scale=1.24, rot=8, pet_count=5))
    flowers.append(render_bud_cluster(680, 45, scale=0.95, rot=-32))

    # Cluster B: High Lush Canopy (x: 420 - 690, y: 150 - 370)
    flowers.append(render_star_flower_front(650, 160, scale=1.26, rot=-18, pet_count=5))
    flowers.append(render_star_flower_tilted(590, 195, scale=1.12, rot=38))
    flowers.append(render_star_flower_front(530, 225, scale=1.24, rot=52, pet_count=5))
    flowers.append(render_star_flower_side(470, 255, scale=0.98, rot=-62))
    flowers.append(render_star_flower_front(420, 295, scale=1.18, rot=-32, pet_count=6))
    flowers.append(render_star_flower_tilted(370, 335, scale=1.08, rot=22))
    flowers.append(render_bud_cluster(310, 375, scale=0.90, rot=-18))

    # Cluster C: Mid-Branch Spreading (x: 260 - 590, y: 370 - 630)
    flowers.append(render_star_flower_front(590, 320, scale=1.28, rot=10, pet_count=5))
    flowers.append(render_star_flower_front(530, 370, scale=1.22, rot=-22, pet_count=5))
    flowers.append(render_star_flower_tilted(480, 410, scale=1.12, rot=42))
    flowers.append(render_star_flower_side(430, 450, scale=0.98, rot=-72))
    flowers.append(render_star_flower_front(380, 480, scale=1.22, rot=28, pet_count=5))
    flowers.append(render_star_flower_tilted(330, 520, scale=1.08, rot=-42))
    flowers.append(render_star_flower_side(280, 570, scale=0.92, rot=-98))
    flowers.append(render_bud_cluster(250, 630, scale=0.88, rot=12))

    # Cluster D: Center Cascade (y: 590 - 850)
    flowers.append(render_star_flower_front(550, 520, scale=1.22, rot=32, pet_count=6))
    flowers.append(render_star_flower_front(500, 580, scale=1.24, rot=-12, pet_count=5))
    flowers.append(render_star_flower_tilted(450, 630, scale=1.10, rot=48))
    flowers.append(render_star_flower_side(400, 670, scale=0.98, rot=-58))
    flowers.append(render_star_flower_front(360, 720, scale=1.20, rot=18, pet_count=5))
    flowers.append(render_star_flower_tilted(320, 780, scale=1.02, rot=-38))
    flowers.append(render_bud_cluster(290, 830, scale=0.88, rot=-12))

    # Cluster E: Lower Drooping Vines (y: 810 - 1040)
    flowers.append(render_star_flower_front(540, 740, scale=1.20, rot=8, pet_count=5))
    flowers.append(render_star_flower_tilted(490, 800, scale=1.12, rot=-32))
    flowers.append(render_star_flower_front(440, 850, scale=1.22, rot=38, pet_count=5))
    flowers.append(render_star_flower_side(390, 900, scale=0.98, rot=-68))
    flowers.append(render_star_flower_front(350, 960, scale=1.15, rot=-18, pet_count=5))
    flowers.append(render_bud_cluster(320, 1010, scale=0.88, rot=22))

    # Cluster F: Lower Edge Clusters (y: 990 - 1170)
    flowers.append(render_star_flower_front(520, 940, scale=1.18, rot=-8, pet_count=5))
    flowers.append(render_star_flower_tilted(470, 1000, scale=1.08, rot=28))
    flowers.append(render_star_flower_front(430, 1060, scale=1.20, rot=62, pet_count=5))
    flowers.append(render_star_flower_side(390, 1110, scale=0.92, rot=-52))
    flowers.append(render_bud_cluster(360, 1150, scale=0.88, rot=-8))
    flowers.append(render_star_flower_front(480, 1130, scale=1.08, rot=-22, pet_count=5))

    svg.append("\n".join(flowers))
    svg.append('</g>')  # Close #jasmineBotanical group

    # ── 4. DETACHED FALLEN PETALS RESTING ON SAGE WALL ───────────────────
    # Beautiful, single detached star-jasmine petals resting on the wall with realistic contact shadows
    svg.append('<g id="restingPetals" filter="url(#petalWallShadow)">')
    scattered_petals = [
        (230, 420, 26, 38, 2.2),
        (170, 550, 27, -22, -2.8),
        (270, 680, 26, 72, 1.8),
        (190, 810, 25, -52, -2.2),
        (250, 930, 27, 28, 2.8),
        (160, 1040, 25, -32, -1.8),
        (220, 1120, 26, 62, 2.2),
    ]
    for px, py, prad, pang, ptwist in scattered_petals:
        svg.append(f'<g transform="translate({px}, {py})">')
        svg.append(render_star_petal(0, 0, prad, pang, width_ratio=0.34, is_shaded=False, twist=ptwist))
        svg.append('</g>')
    svg.append('</g>')

    svg.append('</svg>')
    return "".join(svg)


def build_komorebi_svg():
    width = 900
    height = 1200

    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%" preserveAspectRatio="xMinYMin meet">')
    svg.append('<defs>')
    svg.append('''
    <filter id="bokehCanopyBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="40" />
    </filter>

    <filter id="bokehMidBlur" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="22" />
    </filter>

    <filter id="bokehBranchBlur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="14" />
    </filter>

    <!-- Warm soft sunlight glares -->
    <radialGradient id="sunGlow1" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fffde6" stop-opacity="0.30"/>
        <stop offset="50%" stop-color="#f6fae0" stop-opacity="0.13"/>
        <stop offset="100%" stop-color="#c7caa9" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="sunGlow2" cx="35%" cy="75%" r="60%">
        <stop offset="0%" stop-color="#fafce8" stop-opacity="0.26"/>
        <stop offset="55%" stop-color="#edf3d4" stop-opacity="0.11"/>
        <stop offset="100%" stop-color="#c7caa9" stop-opacity="0"/>
    </radialGradient>
    ''')
    svg.append('</defs>')

    # 1. Warm Dappled Sunlight Glare Patches
    svg.append('<g id="sunlightGlares">')
    svg.append(f'<ellipse cx="320" cy="360" rx="380" ry="300" fill="url(#sunGlow1)"/>')
    svg.append(f'<ellipse cx="280" cy="840" rx="320" ry="260" fill="url(#sunGlow2)"/>')
    svg.append('</g>')

    # 2. Deep Out-Of-Focus Tree Silhouettes
    svg.append('<g id="canopySilhouettes" filter="url(#bokehCanopyBlur)" fill="#3f4c32" opacity="0.36">')
    deep_paths = [
        "M -60 -60 C 80 50, 220 40, 280 -20 C 340 -80, 180 -140, -40 -100 Z",
        "M -40 140 C 90 170, 260 210, 340 140 C 400 70, 310 -20, 140 40 Z",
        "M 90 290 C 260 320, 410 420, 470 340 C 530 250, 370 190, 210 220 Z",
        "M -50 480 C 70 510, 230 590, 310 530 C 390 470, 290 380, 110 410 Z",
        "M 50 710 C 210 740, 340 840, 420 770 C 490 700, 370 620, 180 640 Z",
        "M -40 920 C 100 960, 260 1040, 330 980 C 400 920, 290 830, 120 860 Z",
    ]
    for dp in deep_paths:
        svg.append(f'<path d="{dp}"/>')
    svg.append('</g>')

    # 3. Mid-Focus Leaf Sprays
    svg.append('<g id="midFoliageSilhouettes" filter="url(#bokehMidBlur)" fill="#2d3822" opacity="0.45">')
    med_paths = [
        "M 50 90 Q 140 80 190 125 Q 165 160 70 135 Z",
        "M 130 145 Q 225 125 285 180 Q 250 215 155 190 Z",
        "M 210 75 Q 305 55 365 100 Q 330 145 235 120 Z",
        "M 175 245 Q 280 235 340 290 Q 305 335 200 305 Z",
        "M 85 410 Q 190 400 250 455 Q 215 490 110 465 Z",
        "M 190 475 Q 295 440 365 510 Q 320 545 210 520 Z",
        "M 140 590 Q 245 565 315 635 Q 280 670 165 645 Z",
        "M 95 795 Q 200 770 270 840 Q 225 875 120 850 Z",
        "M 200 875 Q 305 850 375 920 Q 330 955 220 930 Z",
        "M 130 1025 Q 235 1000 305 1070 Q 270 1105 155 1080 Z",
    ]
    for mp in med_paths:
        svg.append(f'<path d="{mp}"/>')
    svg.append('</g>')

    # 4. Delicate Stem Silhouettes
    svg.append('<g id="stemSilhouettes" filter="url(#bokehBranchBlur)" stroke="#232d19" stroke-width="4.8" fill="none" opacity="0.40" stroke-linecap="round">')
    branches = [
        "M -30 50 Q 110 130 250 185",
        "M 140 140 Q 225 220 345 280",
        "M -20 370 Q 130 445 320 495",
        "M 190 470 Q 280 550 400 585",
        "M -30 750 Q 120 830 340 910",
        "M 160 860 Q 255 965 375 1045",
    ]
    for br in branches:
        svg.append(f'<path d="{br}"/>')
    svg.append('</g>')

    svg.append('</svg>')
    return "".join(svg)


if __name__ == '__main__':
    branch = build_jasmine_svg()
    komorebi = build_komorebi_svg()

    with open('assets/certifications-jasmine-branch.svg', 'w', encoding='utf-8') as f:
        f.write(branch)
    print("Generated Masterpiece assets/certifications-jasmine-branch.svg (%d bytes)" % len(branch))

    with open('assets/certifications-komorebi.svg', 'w', encoding='utf-8') as f:
        f.write(komorebi)
    print("Generated Masterpiece assets/certifications-komorebi.svg (%d bytes)" % len(komorebi))
