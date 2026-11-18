// Procedural Watercolor Plaster & Sponge Texture for Certifications Garden
// 100% Pure Code - Zero External Image Assets
(function () {
    const canvas = document.getElementById('gardenCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fast, deterministic PRNG (mulberry32) for reproducible, stable wash patterns
    function mulberry32(seed) {
        return function () {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    // Generate seamless sponge plaster stipple tile once
    let spongeTilePattern = null;
    function getSpongePattern() {
        if (spongeTilePattern) return spongeTilePattern;
        const nw = 360;
        const nh = 360;
        const nCanvas = document.createElement('canvas');
        nCanvas.width = nw;
        nCanvas.height = nh;
        const nCtx = nCanvas.getContext('2d');
        const imgData = nCtx.createImageData(nw, nh);
        const data = imgData.data;

        const noiseRng = mulberry32(49201);
        const rawNoise = new Float32Array(nw * nh);
        for (let i = 0; i < rawNoise.length; i++) {
            rawNoise[i] = noiseRng();
        }

        // Multi-frequency sponge stipple
        for (let y = 0; y < nh; y++) {
            for (let x = 0; x < nw; x++) {
                const idx = y * nw + x;
                const nFine = rawNoise[idx];
                // Sponge clump modulation
                const sx = Math.floor((x * 0.35) % nw);
                const sy = Math.floor((y * 0.35) % nh);
                const nMid = rawNoise[sy * nw + sx];

                // Soft velvety sponge tooth
                const comb = nFine * 0.65 + nMid * 0.35;
                const contrasted = (comb - 0.5) * 1.35 + 0.5;

                const pIdx = idx * 4;
                if (contrasted > 0.5) {
                    // Soft chalky mint highlight speckle (gentle tooth)
                    const a = Math.floor((contrasted - 0.5) * 2 * 32);
                    data[pIdx] = 244;
                    data[pIdx + 1] = 252;
                    data[pIdx + 2] = 238;
                    data[pIdx + 3] = a;
                } else {
                    // Soft moss shadow pore
                    const a = Math.floor((0.5 - contrasted) * 2 * 24);
                    data[pIdx] = 68;
                    data[pIdx + 1] = 94;
                    data[pIdx + 2] = 56;
                    data[pIdx + 3] = a;
                }
            }
        }
        nCtx.putImageData(imgData, 0, 0);
        spongeTilePattern = ctx.createPattern(nCanvas, 'repeat');
        return spongeTilePattern;
    }

    function render() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const w = Math.ceil(window.innerWidth * dpr);
        const h = Math.ceil(window.innerHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            spongeTilePattern = null; // Recreate pattern with new context
        }

        const rng = mulberry32(884102);

        // 1. Base watercolor gradient (lighter pastel sage wash)
        const grad = ctx.createLinearGradient(w * 0.05, h * 0.95, w * 0.9, h * 0.05);
        grad.addColorStop(0.0, '#789c6a');
        grad.addColorStop(0.24, '#8eb07f');
        grad.addColorStop(0.54, '#b2d1a2');
        grad.addColorStop(0.80, '#e5f3df');
        grad.addColorStop(1.0, '#c8e0bd');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // 2. Broad luminous watercolor sweeps (cloudy flow across center and upper-right)
        const broadSweeps = [
          { x: 0.44, y: 0.45, rx: 0.45, ry: 0.34, rot: -0.32, color: 'rgba(240, 250, 235, 0.50)' },
          { x: 0.70, y: 0.26, rx: 0.50, ry: 0.36, rot: -0.25, color: 'rgba(235, 248, 230, 0.45)' },
          { x: 0.24, y: 0.58, rx: 0.34, ry: 0.26, rot: -0.38, color: 'rgba(242, 252, 238, 0.40)' },
        ];
        broadSweeps.forEach(s => {
          ctx.save();
          ctx.translate(s.x * w, s.y * h);
          ctx.rotate(s.rot);
          ctx.scale(s.rx * w, s.ry * h);
          const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
          radGrad.addColorStop(0, s.color);
          radGrad.addColorStop(0.55, s.color.replace(/[\d\.]+\)$/, '0.20)'));
          radGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 3. Soft organic cloudy dabs (watercolor sponge wash)
        const numDabs = 52;
        for (let i = 0; i < numDabs; i++) {
          const u = rng();
          const v = rng();
          
          const isHighlight = rng() < 0.65;
          const px = (u * 0.88 + 0.06) * w;
          const py = (v * 0.88 + 0.06) * h;
          
          const rx = (0.12 + rng() * 0.28) * w;
          const ry = (0.10 + rng() * 0.24) * h;
          const rot = rng() * Math.PI;

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(rot);
          ctx.scale(rx, ry);

          const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
          if (isHighlight) {
            const alpha = 0.14 + rng() * 0.30;
            radGrad.addColorStop(0, 'rgba(244, 252, 240, ' + alpha.toFixed(3) + ')');
            radGrad.addColorStop(0.5, 'rgba(232, 246, 226, ' + (alpha * 0.5).toFixed(3) + ')');
            radGrad.addColorStop(1, 'rgba(220, 240, 212, 0)');
          } else {
            const alpha = 0.08 + rng() * 0.18;
            radGrad.addColorStop(0, 'rgba(110, 138, 96, ' + alpha.toFixed(3) + ')');
            radGrad.addColorStop(0.55, 'rgba(125, 154, 110, ' + (alpha * 0.45).toFixed(3) + ')');
            radGrad.addColorStop(1, 'rgba(140, 170, 125, 0)');
          }

          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 4. Softened vignettes for gentle, airy framing
        const vignettes = [
          { x: 0, y: 0, r: 0.55 * w, color: 'rgba(92, 118, 80, 0.45)' },
          { x: w * 0.45, y: h, r: 0.62 * h, color: 'rgba(88, 114, 76, 0.50)' },
          { x: 0, y: h * 0.85, r: 0.5 * w, color: 'rgba(96, 124, 84, 0.40)' },
          { x: w, y: h * 0.75, r: 0.5 * w, color: 'rgba(105, 135, 92, 0.35)' },
          { x: w, y: 0, r: 0.45 * w, color: 'rgba(100, 130, 88, 0.28)' },
        ];
        vignettes.forEach(vig => {
          const vg = ctx.createRadialGradient(vig.x, vig.y, 0, vig.x, vig.y, vig.r);
          vg.addColorStop(0, vig.color);
          vg.addColorStop(0.65, vig.color.replace(/[\d\.]+\)$/, '0.15)'));
          vg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = vg;
          ctx.beginPath();
          ctx.arc(vig.x, vig.y, vig.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // 4. Ultra-fine sponge stipple plaster grain
        const pat = getSpongePattern();
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
