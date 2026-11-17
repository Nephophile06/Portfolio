/* ==========================================================================
   Creative Canvas Script
   - 60FPS Generative Motion Graphics Canvas Engine (Fluid Ribbons, Click Ripples)
   - Interactive Bezier Vector Curve Tool (Live UI/UX Vector Computation)
   - Draggable Desk Cards with Spring Inertia & 3D Tilt Parallax
   - Minimal Mascot with Eye-Tracking & Interactions
   ========================================================================== */

(function () {
    'use strict';

    // ── 1. 60FPS Generative Motion Graphics Canvas (Fluid Wave Ribbons) ──
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
            if (e.target.closest('a, button, input')) return;
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

    // ── 2. Paper planes: original paths, clipped to the upper hero sky ──
    const heroFlight = (() => {
        const hero = document.getElementById('hero-desk');
        const plane = document.getElementById('stickerPlane');
        if (!hero || !plane || !window.ResizeObserver) return null;

        const scene = document.createElement('div');
        scene.className = 'hero-flight-scene';
        scene.setAttribute('aria-hidden', 'true');
        scene.innerHTML = `<svg class="hero-flight-routes" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <defs>
                <mask id="heroFlightRevealMain" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                    <path class="flight-reveal" fill="none" stroke="white" stroke-width="8"/>
                </mask>
                <mask id="heroFlightRevealSide" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                    <path class="flight-reveal" fill="none" stroke="white" stroke-width="8"/>
                </mask>
            </defs>
            <path class="flight-guide"/>
            <path class="flight-guide flight-guide--side"/>
            <path class="flight-path" mask="url(#heroFlightRevealMain)"/>
            <path class="flight-path flight-path--side" mask="url(#heroFlightRevealSide)"/>
        </svg>`;
        hero.appendChild(scene);

        const carriers = [0, 1].map(index => {
            const carrier = document.createElement('div');
            carrier.className = `hero-flight-plane${index ? ' hero-flight-plane--side' : ''}`;
            scene.appendChild(carrier);
            return carrier;
        });
        const planeArt = plane.querySelector('svg');
        planeArt.setAttribute('viewBox', '35 4 60 62');
        carriers[1].appendChild(planeArt.cloneNode(true));
        carriers[0].appendChild(plane);
        plane.dataset.rot = '0';
        hero.classList.add('has-plane-flight');

        const paths = [...scene.querySelectorAll('.flight-path')];
        const guides = [...scene.querySelectorAll('.flight-guide')];
        const reveals = [...scene.querySelectorAll('.flight-reveal')];
        const artwork = carriers.map(el => el.querySelector('svg'));
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const desktop = window.matchMedia('(min-width: 901px)');
        const phases = [0.12, 0.08];
        const durations = [24000, 29000];
        let lengths = [0, 0];
        let frame = 0, previousTime = 0, releaseTimer = 0;
        let inView = false, hovering = false, settling = false;
        const activeDrags = new Set();

        const isStill = () => reduced.matches || document.documentElement.dataset.motion === 'off';
        const canFly = () => inView && !document.hidden && !isStill() && !hovering && !activeDrags.size && !settling;
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

        function paint() {
            const still = isStill();
            paths.forEach((path, index) => {
                const length = lengths[index];
                if (!length) return;
                const progress = still ? [0.16, 0.24][index] : phases[index];
                const distance = length * progress;
                const point = path.getPointAtLength(distance);
                const ahead = path.getPointAtLength(Math.min(length, distance + 3));
                const behind = path.getPointAtLength(Math.max(0, distance - 3));
                const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI + 45;
                const opacity = still ? 0.76 : Math.min(1, progress / 0.025, (1 - progress) / 0.04);
                carriers[index].style.transform = `translate(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px)`;
                carriers[index].style.opacity = opacity.toFixed(3);
                artwork[index].style.rotate = `${angle.toFixed(2)}deg`;
                // Reveal the dotted line just behind the tail, never ahead of the nose.
                reveals[index].style.strokeDasharray = `${still ? length : Math.max(0, distance - 25)} ${length + 50}`;
                path.style.opacity = (still ? 0.38 : Math.min(1, (1 - progress) / 0.07)).toFixed(3);
            });
        }

        function tick(now) {
            frame = 0;
            if (!canFly()) return;
            const delta = previousTime ? Math.min(now - previousTime, 64) : 0;
            previousTime = now;
            phases.forEach((phase, index) => { phases[index] = (phase + delta / durations[index]) % 1; });
            paint();
            frame = requestAnimationFrame(tick);
        }

        function sync() {
            cancelAnimationFrame(frame);
            frame = 0;
            previousTime = 0;
            scene.dataset.flightState = isStill() ? 'still' : canFly() ? 'flying' : 'paused';
            paint();
            if (canFly()) frame = requestAnimationFrame(tick);
        }

        function layout() {
            const w = scene.clientWidth;
            const h = scene.clientHeight;
            if (!w || !h) return;
            let routes;
            if (desktop.matches) {
                const origin = hero.getBoundingClientRect();
                const box = id => {
                    const r = document.getElementById(id).getBoundingClientRect();
                    return { left: r.left - origin.left, right: r.right - origin.left, top: r.top - origin.top, bottom: r.bottom - origin.top, width: r.width };
                };
                const quote = box('noteMainQuote');
                const photo = box('notePolaroidCard');
                const about = box('noteAboutBrief');
                const exp = box('noteExpCard');
                const crest = Math.max(35, quote.top - 32);
                const turnX = photo.left + 20;
                const bendY = Math.min(h * 0.7, photo.bottom + 25);
                const sweepX = clamp(about.right + 26, w * 0.52, w * 0.74);
                const leftX = Math.max(36, exp.left - 38);
                routes = [
                    `M ${w * 0.17} -45 C ${w * 0.21} 35, ${quote.left - 10} ${crest - 35}, ${quote.left + quote.width * 0.35} ${crest}
                     C ${quote.right + 42} ${crest - 8}, ${turnX + 18} ${photo.top + 65}, ${turnX} ${bendY}
                     C ${turnX - 8} ${bendY + 66}, ${sweepX - 30} ${bendY + 72}, ${sweepX + 65} ${bendY + 112}
                     C ${w * 0.76} ${h * 0.82}, ${w * 0.82} ${h * 0.85}, ${w * 0.81} ${h + 55}`,
                    `M -45 ${h * 0.4} C ${leftX * 0.45} ${h * 0.46}, ${leftX * 0.95} ${h * 0.34}, ${leftX} ${h * 0.49}
                     C ${leftX + 24} ${h * 0.65}, ${leftX - 8} ${h * 0.68}, ${leftX + 95} ${h * 0.74}
                     C ${leftX + 215} ${h * 0.82}, ${leftX + 122} ${h * 0.92}, ${leftX + 58} ${h + 55}`
                ];
            } else {
                // A compact edge route for stacked notes, not a scaled desktop path.
                routes = [
                    `M ${w * 0.2} -35 C ${w * 0.36} 52, ${w - 32} 18, ${w - 19} ${h * 0.24}
                     C ${w - 4} ${h * 0.39}, ${w - 48} ${h * 0.5}, ${w - 23} ${h * 0.65}
                     C ${w - 4} ${h * 0.79}, ${w - 30} ${h * 0.88}, ${w - 45} ${h + 38}`,
                    `M -35 ${h * 0.33} C 60 ${h * 0.39}, 12 ${h * 0.48}, 17 ${h * 0.6}
                     C 23 ${h * 0.76}, 62 ${h * 0.81}, 36 ${h * 0.9} C 25 ${h * 0.95}, 7 ${h}, -20 ${h + 38}`
                ];
            }
            scene.querySelector('svg').setAttribute('viewBox', `0 0 ${w} ${h}`);
            routes.forEach((d, index) => {
                [paths[index], guides[index], reveals[index]].forEach(el => el.setAttribute('d', d));
                lengths[index] = paths[index].getTotalLength();
            });
            paint();
        }

        plane.addEventListener('pointerenter', () => { hovering = desktop.matches; sync(); });
        plane.addEventListener('pointerleave', () => { hovering = false; sync(); });
        reduced.addEventListener('change', sync);
        desktop.addEventListener('change', () => { hovering = false; layout(); sync(); });
        document.addEventListener('visibilitychange', sync);
        window.addEventListener('blur', () => { hovering = false; sync(); });
        new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
        new ResizeObserver(layout).observe(scene);
        new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0 }).observe(scene);
        document.fonts.ready.then(layout);
        layout();
        sync();

        return {
            grab(el) {
                activeDrags.add(el);
                if (el === plane) { clearTimeout(releaseTimer); settling = false; }
                sync();
            },
            release(el) {
                activeDrags.delete(el);
                if (el === plane) {
                    settling = true;
                    // The draggable child returns gently while its flight carrier stays still.
                    requestAnimationFrame(() => { plane.style.transform = 'translate(0, 0) rotate(0deg)'; });
                    releaseTimer = setTimeout(() => { settling = false; sync(); }, 320);
                }
                sync();
            }
        };
    })();

    // ── 3. Draggable Desk Elements (Pointer Physics & Velocity Tilt) ──
    // Bind once, but check the live breakpoint so resizing does not strand a plane.
    {
        const dragMedia = window.matchMedia('(min-width: 901px)');
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
            let activePointerId = null;
            let startX, startY;
            let currentX = 0, currentY = 0;
            let lastMoveX = 0;
            let velocityX = 0;

            el.addEventListener('pointerdown', (e) => {
                if (!dragMedia.matches || dragging || e.button !== 0 || e.target.closest('a, button, input')) return;

                dragging = true;
                activePointerId = e.pointerId;
                heroFlight?.grab(el);
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
                if (!dragging || e.pointerId !== activePointerId) return;
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
                if (!dragging || (e?.pointerId !== undefined && e.pointerId !== activePointerId)) return;
                dragging = false;
                const pointerId = activePointerId;
                activePointerId = null;
                el.classList.remove('is-dragging');

                // Smooth spring settle
                const style = window.getComputedStyle(el);
                const matrix = new DOMMatrixReadOnly(style.transform);
                el.style.transform = `translate(${matrix.m41}px, ${matrix.m42}px) rotate(${baseRotation(el)}deg) scale(1)`;

                try { el.releasePointerCapture(pointerId); } catch(err) {}
                heroFlight?.release(el);
            };

            el.addEventListener('pointerup', stopDrag);
            el.addEventListener('pointercancel', stopDrag);
            el.addEventListener('lostpointercapture', stopDrag);
            window.addEventListener('blur', stopDrag);
            document.addEventListener('visibilitychange', () => { if (document.hidden) stopDrag(); });
            dragMedia.addEventListener('change', () => { if (!dragMedia.matches) stopDrag(); });
        });
    }

    // ── 4. Hand-drawn Profile Mascot (little hellos & a curious face) ──
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
