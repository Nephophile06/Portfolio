/* ==========================================================================
   Creative Canvas Script
   - 60FPS Generative Motion Graphics Canvas Engine (Fluid Ribbons, Click Ripples)
   - Interactive Bezier Vector Curve Tool (Live UI/UX Vector Computation)
   - Airport Split-Flap Dynamic Letter Cycling
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

    // ── 2. 60FPS Generative Motion Graphics Canvas (Fluid Wave Ribbons) ──
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

        function resize() {
            const rect = motionCanvas.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            motionCanvas.width = width * dpr;
            motionCanvas.height = height * dpr;
            ctx.scale(dpr, dpr);
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
            if (e.target.closest('a, button, input, .split-flap-tile')) return;
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

        // 3 Multi-layered flowing vector ribbons — cloud whites and sky blues
        // (no ribbon near the base of the sky, so no flat “horizon” line)
        const ribbons = [
            { baseY: 0.28, amp: 26, freq: 0.0035, speed: 0.016, color: 'rgba(255, 255, 255, 0.55)', width: 2.2 },
            { baseY: 0.48, amp: 34, freq: 0.0028, speed: 0.012, color: 'rgba(126, 170, 208, 0.30)', width: 2.0 },
            { baseY: 0.70, amp: 28, freq: 0.0032, speed: 0.018, color: 'rgba(168, 205, 232, 0.35)', width: 1.8 }
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
                ctx.strokeStyle = `rgba(74, 124, 166, ${Math.max(0, (rp.strength / 22) * 0.3)})`;
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

    // ── 3. Draggable Desk Elements (Pointer Physics & Velocity Tilt) ──
    const isDesktop = window.matchMedia('(min-width: 901px)').matches;
    if (isDesktop) {
        let maxZ = 40;
        const draggables = document.querySelectorAll('.desk-item');

        // Natural resting rotation for each draggable note / sticker
        const baseRotation = (el) => {
            if (el.dataset.rot !== undefined) return Number(el.dataset.rot) || 0;
            if (el.classList.contains('note-main-quote')) return -1.5;
            if (el.classList.contains('note-polaroid-card')) return 3;
            if (el.classList.contains('note-exp-card')) return -3.5;
            if (el.classList.contains('note-strengths-card')) return 2;
            if (el.classList.contains('note-about-brief')) return 1.4;
            return 0;
        };

        draggables.forEach(el => {
            let dragging = false;
            let startX, startY;
            let currentX = 0, currentY = 0;
            let lastMoveX = 0;
            let velocityX = 0;

            el.addEventListener('pointerdown', (e) => {
                if (e.target.closest('a, button, input')) return;

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
                const dynamicRot = baseRotation(el) + Math.max(-12, Math.min(12, velocityX));
                el.style.transform = `translate(${currentX + dx}px, ${currentY + dy}px) rotate(${dynamicRot}deg) scale(1.03)`;
            });

            const stopDrag = (e) => {
                if (!dragging) return;
                dragging = false;
                el.classList.remove('is-dragging');

                // Smooth spring settle
                const style = window.getComputedStyle(el);
                const matrix = new DOMMatrixReadOnly(style.transform);
                el.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px) rotate(${baseRotation(el)}deg) scale(1)`;

                try { el.releasePointerCapture(e.pointerId); } catch(err) {}
            };

            el.addEventListener('pointerup', stopDrag);
            el.addEventListener('pointercancel', stopDrag);
        });
    }

    // ── 4. Hand-drawn Bunny Mascot (little hellos & a curious face) ──
    const duckMascot = document.getElementById('duckMascot');
    const duckBubble = document.getElementById('duckBubble');
    const duckLive = document.getElementById('duckLive');

    const mascotGreetings = [
        "hi!",
        "are you enjoying the scroll?",
        "did you look at that project?",
        "psst — the notes are draggable.",
        "just checking in. you're doing great.",
        "that case study is my favourite.",
        "take your time. i'm not going anywhere.",
        "you've got lovely taste.",
        "tiny break? stretch your shoulders.",
        "want to see my brush strokes?"
    ];
    const mascotReactions = [
        "ooh, did you look at that?",
        "nice move!",
        "i saw that.",
        "careful — it's paper."
    ];

    if (duckMascot && duckBubble) {
        let bubbleTimer;
        let bubbleOpen = false;
        let lastReaction = 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const say = (msg, ms = 3600) => {
            duckBubble.textContent = msg;
            duckBubble.classList.add('is-visible');
            if (duckLive) duckLive.textContent = msg;
            duckMascot.classList.add('is-chatty');
            clearTimeout(bubbleTimer);
            setTimeout(() => duckMascot.classList.remove('is-chatty'), 420);
            bubbleOpen = true;
            bubbleTimer = setTimeout(() => {
                duckBubble.classList.remove('is-visible');
                bubbleOpen = false;
            }, ms);
        };

        const randomFrom = (list) => list[Math.floor(Math.random() * list.length)];
        const greet = () => say(randomFrom(mascotGreetings));

        duckMascot.addEventListener('click', (e) => {
            e.preventDefault();
            greet();
        });
        duckMascot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                greet();
            }
        });

        // Small reactions when a note or sticker is picked up (throttled)
        document.querySelectorAll('.desk-item').forEach(el => {
            el.addEventListener('pointerdown', () => {
                const now = Date.now();
                if (now - lastReaction < 42000) return;
                lastReaction = now;
                setTimeout(() => {
                    if (!document.hidden) say(randomFrom(mascotReactions), 3000);
                }, 650);
            }, { passive: true });
        });

        // Occasional gentle hellos while the page is open
        const autoHello = () => {
            if (document.hidden || bubbleOpen) return;
            say(randomFrom(mascotGreetings), 4200);
        };
        // First greeting is always a simple "hi!"
        setTimeout(() => {
            if (!document.hidden && !bubbleOpen) say("hi!", 4200);
        }, 5200);
        setInterval(autoHello, 34000);

        // The face follows the cursor a little
        if (!reduced) {
            window.addEventListener('pointermove', (e) => {
                const rect = duckMascot.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) / window.innerWidth;
                const dy = (e.clientY - (rect.top + rect.height * 0.45)) / window.innerHeight;
                const x = Math.max(-2.6, Math.min(2.6, dx * 12));
                const y = Math.max(-2, Math.min(2, dy * 8));
                duckMascot.style.setProperty('--look-x', `${x.toFixed(1)}px`);
                duckMascot.style.setProperty('--look-y', `${y.toFixed(1)}px`);
            }, { passive: true });
            window.addEventListener('blur', () => {
                duckMascot.style.setProperty('--look-x', '0px');
                duckMascot.style.setProperty('--look-y', '0px');
            });
        }
    }

})();
