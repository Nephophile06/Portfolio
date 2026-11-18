// Fine paper & satin tooth for the Projects Atelier wall.
// 100% pure code - zero external image assets.
(function () {
    const canvas = document.getElementById('projectsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fast, deterministic PRNG (mulberry32) for a stable, reproducible tooth.
    function mulberry32(seed) {
        return function () {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    let toothTilePattern = null;
    function getToothPattern() {
        if (toothTilePattern) return toothTilePattern;
        const nw = 256;
        const nh = 256;
        const nCanvas = document.createElement('canvas');
        nCanvas.width = nw;
        nCanvas.height = nh;
        const nCtx = nCanvas.getContext('2d');
        const imgData = nCtx.createImageData(nw, nh);
        const data = imgData.data;

        const rng = mulberry32(57193);
        const raw = new Float32Array(nw * nh);
        for (let i = 0; i < raw.length; i++) {
            raw[i] = rng();
        }

        // Three frequencies blended softly: a fine paper tooth, a whisper of
        // silk crinkle, and a faint wide unevenness. Alpha stays very low so the
        // wall keeps its airy, sunlit feel while still reading as a real surface.
        for (let y = 0; y < nh; y++) {
            for (let x = 0; x < nw; x++) {
                const idx = y * nw + x;
                const fine = raw[idx];
                const mid = raw[((y * 0.45 | 0) % nh) * nw + ((x * 0.45 | 0) % nw)];
                const wide = raw[((y * 0.18 | 0) % nh) * nw + ((x * 0.18 | 0) % nw)];
                const comb = fine * 0.55 + mid * 0.30 + wide * 0.15;
                const val = (comb - 0.5) * 1.15 + 0.5;

                const p = idx * 4;
                if (val > 0.5) {
                    // Sun-warmed silk highlight
                    const a = Math.floor((val - 0.5) * 2 * 9);
                    data[p] = 255;
                    data[p + 1] = 250;
                    data[p + 2] = 244;
                    data[p + 3] = a;
                } else {
                    // Pale rose-taupe shadow pore
                    const a = Math.floor((0.5 - val) * 2 * 8);
                    data[p] = 176;
                    data[p + 1] = 141;
                    data[p + 2] = 128;
                    data[p + 3] = a;
                }
            }
        }
        nCtx.putImageData(imgData, 0, 0);
        toothTilePattern = ctx.createPattern(nCanvas, 'repeat');
        return toothTilePattern;
    }

    function render() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const w = Math.ceil(window.innerWidth * dpr);
        const h = Math.ceil(window.innerHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            toothTilePattern = null;
        }

        const pat = getToothPattern();
        if (pat) {
            ctx.fillStyle = pat;
            ctx.fillRect(0, 0, w, h);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }

    window.addEventListener('resize', () => {
        clearTimeout(window.__bgTimer);
        window.__bgTimer = setTimeout(render, 150);
    });
})();
