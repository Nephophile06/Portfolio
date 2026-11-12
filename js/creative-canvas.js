/* ==========================================================================
   Creative Canvas Script
   - 60FPS Generative Motion Graphics Canvas Engine (Waves, Particles, Ripples)
   - Interactive Bezier Vector Curve Tool (Live UI/UX Vector Computation)
   - Airport Split-Flap Dynamic Letter Cycling
   - Design Tokens Theme Palette Switcher
   - Draggable Desk Cards with Spring Inertia & 3D Tilt Parallax
   - Minimal Mascot with Eye-Tracking & Interactions
   ========================================================================== */

(function () {
    'use strict';

    // ── 1. Airport Split-Flap Words Animation ──
    const words = [
        "H I ,  I ' M  A N I K A",
        "U I / U X  D E S I G N ",
        "F R O N T E N D  D E V ",
        "D A T A  A N N O T A T E",
        "B U I L D I N G  I D E A"
    ];
    let wordIndex = 0;
    const flapBoard = document.getElementById('splitFlapBoard');

    function initFlapTiles(word) {
        if (!flapBoard) return;
        flapBoard.innerHTML = '';
        const chars = word.padEnd(16, ' ').slice(0, 16).split('');
        chars.forEach(char => {
            const tile = document.createElement('div');
            tile.className = 'split-flap-tile';
            tile.textContent = char;
            flapBoard.appendChild(tile);
        });
    }

    function flipToNextWord() {
        if (!flapBoard) return;
        wordIndex = (wordIndex + 1) % words.length;
        const target = words[wordIndex].padEnd(16, ' ').slice(0, 16);
        const tiles = flapBoard.querySelectorAll('.split-flap-tile');

        target.split('').forEach((char, i) => {
            if (tiles[i] && tiles[i].textContent !== char) {
                setTimeout(() => {
                    tiles[i].classList.add('flipping');
                    setTimeout(() => {
                        tiles[i].textContent = char;
                    }, 160);
                    setTimeout(() => {
                        tiles[i].classList.remove('flipping');
                    }, 320);
                }, i * 45);
            }
        });
    }

    if (flapBoard) {
        initFlapTiles(words[0]);
        setInterval(flipToNextWord, 3400);
    }

    // ── 2. 60FPS Generative Motion Graphics Canvas (Fluid Waves & Particles) ──
    const motionCanvas = document.getElementById('motionCanvas');
    if (motionCanvas) {
        const ctx = motionCanvas.getContext('2d');
        let width = 0, height = 0, dpr = 1;
        let animationFrameId;
        let isVisible = true;
        let time = 0;

        // Mouse interaction state
        const mouse = {
            x: -9999,
            y: -9999,
            vx: 0,
            vy: 0,
            lastX: 0,
            lastY: 0,
            isDown: false
        };

        // Shockwave ripples on click
        const ripples = [];

        // Particles for interactive constellation field
        const PARTICLE_COUNT = 32;
        const particles = [];

        function resize() {
            const rect = motionCanvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            motionCanvas.width = width * dpr;
            motionCanvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            if (particles.length === 0) {
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    particles.push({
                        x: Math.random() * width,
                        y: Math.random() * height,
                        vx: (Math.random() - 0.5) * 0.6,
                        vy: (Math.random() - 0.5) * 0.6,
                        radius: Math.random() * 2 + 1.2,
                        baseAlpha: Math.random() * 0.35 + 0.15
                    });
                }
            }
        }

        window.addEventListener('resize', resize, { passive: true });
        resize();

        // Mouse listeners
        const deskContainer = document.getElementById('hero-desk') || window;
        deskContainer.addEventListener('pointermove', (e) => {
            const rect = motionCanvas.getBoundingClientRect();
            const curX = e.clientX - rect.left;
            const curY = e.clientY - rect.top;
            mouse.vx = curX - mouse.lastX;
            mouse.vy = curY - mouse.lastY;
            mouse.x = curX;
            mouse.y = curY;
            mouse.lastX = curX;
            mouse.lastY = curY;
        }, { passive: true });

        deskContainer.addEventListener('pointerleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        }, { passive: true });

        // Trigger dynamic ripple on click
        deskContainer.addEventListener('pointerdown', (e) => {
            // Only trigger if clicking canvas or background, not interactive links/inputs
            if (e.target.closest('a, button, input, .split-flap-tile, .bezier-handle')) return;
            const rect = motionCanvas.getBoundingClientRect();
            ripples.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 0,
                maxRadius: Math.min(width, height) * 0.65,
                strength: 22,
                age: 0
            });
            if (ripples.length > 5) ripples.shift();
        });

        // 4 Multi-layered flowing vector ribbons
        const ribbons = [
            { baseY: 0.28, amp: 26, freq: 0.0035, speed: 0.016, color: 'rgba(235, 160, 95, 0.28)', width: 2.2 },
            { baseY: 0.48, amp: 34, freq: 0.0028, speed: 0.012, color: 'rgba(165, 140, 220, 0.24)', width: 2.0 },
            { baseY: 0.70, amp: 28, freq: 0.0032, speed: 0.018, color: 'rgba(115, 195, 140, 0.22)', width: 1.8 },
            { baseY: 0.88, amp: 20, freq: 0.0040, speed: 0.014, color: 'rgba(140, 125, 110, 0.16)', width: 1.5 }
        ];

        function render() {
            if (!isVisible) return;
            time += 1;
            ctx.clearRect(0, 0, width, height);

            // 1. Update and draw ripples
            for (let r = ripples.length - 1; r >= 0; r--) {
                const rp = ripples[r];
                rp.age += 1;
                rp.radius += 4.5;
                rp.strength *= 0.96;

                // Subtle ripple ring
                ctx.beginPath();
                ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(180, 160, 140, ${Math.max(0, (rp.strength / 22) * 0.25)})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                if (rp.radius >= rp.maxRadius || rp.strength < 0.2) {
                    ripples.splice(r, 1);
                }
            }

            // 2. Draw flowing generative ribbons
            ribbons.forEach((ribbon, idx) => {
                ctx.beginPath();
                ctx.strokeStyle = ribbon.color;
                ctx.lineWidth = ribbon.width;
                ctx.lineCap = 'round';

                const baseLine = height * ribbon.baseY;
                const points = 36;
                const step = width / points;

                for (let i = 0; i <= points; i++) {
                    const x = i * step;
                    // Natural sinusoidal oscillation
                    let y = baseLine + Math.sin(x * ribbon.freq + time * ribbon.speed + idx) * ribbon.amp
                                     + Math.cos(x * ribbon.freq * 0.6 - time * ribbon.speed * 0.7) * (ribbon.amp * 0.4);

                    // Magnetic mouse displacement
                    const dx = x - mouse.x;
                    const dy = y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const mouseRadius = 200;
                    if (dist < mouseRadius) {
                        const force = (1 - dist / mouseRadius);
                        // Pull towards or push with soft spring tension
                        y += (mouse.y - y) * force * 0.35;
                    }

                    // Shockwave ripple displacement
                    ripples.forEach(rp => {
                        const rx = x - rp.x;
                        const ry = y - rp.y;
                        const rDist = Math.sqrt(rx * rx + ry * ry);
                        const waveDist = Math.abs(rDist - rp.radius);
                        if (waveDist < 60) {
                            const waveFactor = Math.sin((waveDist / 60) * Math.PI) * (1 - waveDist / 60);
                            y += Math.sin(rDist * 0.08) * rp.strength * waveFactor;
                        }
                    });

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        // Smooth bezier interpolator
                        ctx.lineTo(x, y);
                    }

                    // Draw subtle vector nodes near cursor
                    if (dist < 140 && i % 3 === 0) {
                        ctx.fillStyle = ribbon.color;
                        ctx.fillRect(x - 2, y - 2, 4, 4);
                    }
                }
                ctx.stroke();
            });

            // 3. Update & render particle constellation
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce borders
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse avoidance
                const pdx = p.x - mouse.x;
                const pdy = p.y - mouse.y;
                const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
                if (pDist < 100) {
                    const angle = Math.atan2(pdy, pdx);
                    p.x += Math.cos(angle) * 2;
                    p.y += Math.sin(angle) * 2;
                }

                // Particle circle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(130, 115, 100, ${p.baseAlpha})`;
                ctx.fill();

                // Connect nearby particles with delicate faint lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const cdx = p.x - p2.x;
                    const cdy = p.y - p2.y;
                    const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
                    if (cDist < 85) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(140, 125, 110, ${(1 - cDist / 85) * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        }

        // Pause animation when hero leaves viewport
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(render);
            }
        }, { threshold: 0.1 });
        observer.observe(motionCanvas);
    }

    // ── 3. Interactive Bezier Vector Tool Engine (UI/UX + Frontend Precision) ──
    const bezierSvg = document.getElementById('bezierSvg');
    const handleC1 = document.getElementById('handleC1');
    const handleC2 = document.getElementById('handleC2');
    const bezierCurvePath = document.getElementById('bezierCurvePath');
    const tangentLine1 = document.getElementById('tangentLine1');
    const tangentLine2 = document.getElementById('tangentLine2');
    const bezierCodeDisplay = document.getElementById('bezierCodeDisplay');

    if (bezierSvg && handleC1 && handleC2 && bezierCurvePath) {
        // SVG Coordinate Space: 210 x 95
        const P0 = { x: 20, y: 65 };
        const P3 = { x: 190, y: 35 };
        let C1 = { x: 65, y: 20 };
        let C2 = { x: 145, y: 75 };

        function updateCurve() {
            // Clamp coordinates inside SVG viewbox
            C1.x = Math.max(10, Math.min(200, C1.x));
            C1.y = Math.max(8, Math.min(88, C1.y));
            C2.x = Math.max(10, Math.min(200, C2.x));
            C2.y = Math.max(8, Math.min(88, C2.y));

            handleC1.setAttribute('transform', `translate(${C1.x}, ${C1.y})`);
            handleC2.setAttribute('transform', `translate(${C2.x}, ${C2.y})`);

            tangentLine1.setAttribute('x2', C1.x);
            tangentLine1.setAttribute('y2', C1.y);
            tangentLine2.setAttribute('x2', C2.x);
            tangentLine2.setAttribute('y2', C2.y);

            const d = `M ${P0.x} ${P0.y} C ${Math.round(C1.x)} ${Math.round(C1.y)}, ${Math.round(C2.x)} ${Math.round(C2.y)}, ${P3.x} ${P3.y}`;
            bezierCurvePath.setAttribute('d', d);

            if (bezierCodeDisplay) {
                bezierCodeDisplay.textContent = `d="M 20 65 C ${Math.round(C1.x)} ${Math.round(C1.y)}, ${Math.round(C2.x)} ${Math.round(C2.y)}, 190 35"`;
            }
        }

        function setupHandleDrag(handleEl, targetPoint) {
            let isDragging = false;

            handleEl.addEventListener('pointerdown', (e) => {
                isDragging = true;
                handleEl.setPointerCapture(e.pointerId);
                e.stopPropagation();
                e.preventDefault();
            });

            handleEl.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const rect = bezierSvg.getBoundingClientRect();
                const scaleX = 210 / rect.width;
                const scaleY = 95 / rect.height;

                targetPoint.x = (e.clientX - rect.left) * scaleX;
                targetPoint.y = (e.clientY - rect.top) * scaleY;
                updateCurve();
                e.stopPropagation();
            });

            const stopDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                try { handleEl.releasePointerCapture(e.pointerId); } catch(err) {}
            };

            handleEl.addEventListener('pointerup', stopDrag);
            handleEl.addEventListener('pointercancel', stopDrag);
        }

        setupHandleDrag(handleC1, C1);
        setupHandleDrag(handleC2, C2);
        updateCurve();
    }

    // ── 4. Design Tokens Theme Palette Switcher ──
    const paletteChips = document.querySelectorAll('.palette-chip');
    paletteChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const theme = chip.getAttribute('data-theme');
            paletteChips.forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');

            document.body.classList.remove('theme-vanilla', 'theme-sage', 'theme-lilac', 'theme-sky');
            if (theme && theme !== 'vanilla') {
                document.body.classList.add(`theme-${theme}`);
            }
        });
    });

    // ── 5. Draggable Desk Elements (Pointer Physics & Velocity Tilt) ──
    const isDesktop = window.matchMedia('(min-width: 901px)').matches;
    if (isDesktop) {
        let maxZ = 40;
        const draggables = document.querySelectorAll('.desk-item');

        draggables.forEach(el => {
            let dragging = false;
            let startX, startY;
            let currentX = 0, currentY = 0;
            let lastMoveX = 0;
            let velocityX = 0;

            el.addEventListener('pointerdown', (e) => {
                if (e.target.closest('a, button, input, .bezier-handle, .bezier-svg')) return;

                dragging = true;
                el.classList.add('is-dragging');
                el.style.zIndex = ++maxZ;

                startX = e.clientX;
                startY = e.clientY;
                lastMoveX = e.clientX;

                const style = window.getComputedStyle(el);
                const matrix = new DOMMatrixReadOnly(style.transform);
                currentX = matrix.m41;
                currentY = matrix.m42;

                el.setPointerCapture(e.pointerId);
                e.preventDefault();
            });

            el.addEventListener('pointermove', (e) => {
                if (!dragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // Calculate horizontal drag velocity for dynamic tilt
                velocityX = (e.clientX - lastMoveX) * 0.35;
                lastMoveX = e.clientX;

                // Natural card resting rotation
                let baseRot = 0;
                if (el.classList.contains('note-main-quote')) baseRot = -1.5;
                else if (el.classList.contains('note-polaroid-card')) baseRot = 3;
                else if (el.classList.contains('note-exp-card')) baseRot = -3.5;
                else if (el.classList.contains('note-strengths-card')) baseRot = 2;
                else if (el.classList.contains('note-bezier-tool')) baseRot = 2;

                const dynamicRot = baseRot + Math.max(-12, Math.min(12, velocityX));
                el.style.transform = `translate(${currentX + dx}px, ${currentY + dy}px) rotate(${dynamicRot}deg) scale(1.03)`;
            });

            const stopDrag = (e) => {
                if (!dragging) return;
                dragging = false;
                el.classList.remove('is-dragging');

                let baseRot = '0deg';
                if (el.classList.contains('note-main-quote')) baseRot = '-1.5deg';
                else if (el.classList.contains('note-polaroid-card')) baseRot = '3deg';
                else if (el.classList.contains('note-exp-card')) baseRot = '-3.5deg';
                else if (el.classList.contains('note-strengths-card')) baseRot = '2deg';
                else if (el.classList.contains('note-bezier-tool')) baseRot = '2deg';

                // Smooth spring settle
                const style = window.getComputedStyle(el);
                const matrix = new DOMMatrixReadOnly(style.transform);
                el.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px) rotate(${baseRot}) scale(1)`;

                try { el.releasePointerCapture(e.pointerId); } catch(err) {}
            };

            el.addEventListener('pointerup', stopDrag);
            el.addEventListener('pointercancel', stopDrag);
        });
    }

    // ── 6. Cute Bunny Plushie Mascot (Squish Physics & Speech Bubble) ──
    const duckMascot = document.getElementById('duckMascot');
    const duckBubble = document.getElementById('duckBubble');

    const mascotGreetings = [
        "Squeeze me! I'm Anika's plushie 🧸✨",
        "Soft vibes & clean interfaces ☕",
        "Handcrafted with code & love 💻",
        "Try dragging the notes or bezier handles! 🎨",
        "Switch palettes from the top right! 🌿",
        "Explore my UI/UX & dev case studies below! 🚀",
        "Need a designer? Let's connect! 💌"
    ];

    if (duckMascot && duckBubble) {
        let bubbleTimer;
        duckMascot.addEventListener('click', () => {
            const randomMsg = mascotGreetings[Math.floor(Math.random() * mascotGreetings.length)];
            duckBubble.textContent = randomMsg;
            duckBubble.classList.add('is-visible');
            clearTimeout(bubbleTimer);
            bubbleTimer = setTimeout(() => {
                duckBubble.classList.remove('is-visible');
            }, 3200);
        });

        // Subtle 3D reactive tilt toward cursor
        window.addEventListener('pointermove', (e) => {
            const rect = duckMascot.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / window.innerWidth;
            const dy = (e.clientY - cy) / window.innerHeight;
            const rotY = Math.max(-8, Math.min(8, dx * 12));
            const rotX = Math.max(-5, Math.min(5, -dy * 8));
            duckMascot.style.transform = `perspective(800px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg)`;
        }, { passive: true });
    }

})();
