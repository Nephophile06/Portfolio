/* Notebook enhancements — deferred, dependency-free, removable.
   data-companion="off" hides the doodle; data-motion="off" disables motion.
   Drawing paths are decorative. All portfolio copy stays in the HTML. */
(() => {
    const NS = 'http://www.w3.org/2000/svg';
    // One tiny pencil stroke, repeated only on existing section headings.
    document.querySelectorAll('.block-title, .lets-talk-heading').forEach(heading => {
        const svg = document.createElementNS(NS, 'svg');
        svg.classList.add('pencil-line');
        svg.setAttribute('viewBox', '0 0 160 8');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M1 5 Q39 1 79 4 T158 3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '1.3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('pathLength', '100');
        svg.append(path);
        heading.append(svg);
    });

    // Desktop gutter only: it never overlaps the 1080px content container.
    const desktop = matchMedia('(min-width: 1240px) and (hover: hover) and (pointer: fine)');
    if (document.documentElement.dataset.companion === 'off' || !desktop.matches) return;
    try { if (localStorage.getItem('portfolio-companion-hidden') === '1') return; } catch { /* Storage may be unavailable. */ }

    const companion = document.createElement('aside');
    companion.className = 'doodle-companion';
    companion.setAttribute('aria-label', 'Sketch companion');
    companion.innerHTML = `<div class="doodle-bubble" role="status" hidden></div>
        <button class="doodle-hide" type="button" aria-label="Hide sketch companion">×</button>
        <button class="doodle-button" type="button" aria-label="Say hello to the sketch companion">
        <svg viewBox="0 0 58 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 58q17 3 34 0" stroke="#c3cfdb"/>
            <path d="M19 49l-2 8-5 1m23-9 3 8 5 1M12 34l-6 7 4 3"/>
            <path d="M15 20q13-2 26 1l1 29q-14 2-28-1Z" fill="#fff"/>
            <path d="M20 20v-5m-3-1 6 1M15 44l27 1"/>
            <g class="doodle-face"><g class="doodle-eyes"><circle cx="23" cy="30" r="1.7" fill="currentColor"/><circle cx="34" cy="30" r="1.7" fill="currentColor"/></g><path d="M25 36q3 3 6 0"/></g>
            <g class="doodle-arm"><path d="M42 35q6 4 8-4"/><path d="m48 31 3-17 4 1-3 17-3 4Z" fill="#e8eff6"/><path d="m51 14 1-3 3 4m-7 15 4 1"/></g>
            <path d="M12 19h4m-4 0v4m30-4h3v4m-33 25v4h4m26 0h3v-4" stroke="#486783"/>
        </svg></button>`;
    document.body.append(companion);
    const bubble = companion.querySelector('.doodle-bubble');
    const face = companion.querySelector('.doodle-face');
    let dismissed = false, frame = 0, bubbleTimer, waveTimer, pointerX = 0, pointerY = 0;
    let viewportWidth = innerWidth, viewportHeight = innerHeight;
    const active = () => !dismissed && desktop.matches && !document.hidden;
    const wave = () => {
        if (!active() || !motionEnabled() || companion.classList.contains('is-waving')) return;
        companion.classList.add('is-waving');
        waveTimer = setTimeout(() => companion.classList.remove('is-waving'), 700);
    };
    const reset = () => {
        cancelAnimationFrame(frame); frame = 0;
        clearTimeout(waveTimer);
        companion.classList.remove('is-waving', 'is-curious');
        face.style.transform = '';
    };
    companion.querySelector('.doodle-button').addEventListener('click', () => {
        bubble.textContent = 'Hello there!';
        bubble.hidden = false;
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 3500);
        wave();
    });
    companion.querySelector('.doodle-hide').addEventListener('click', () => {
        dismissed = true;
        companion.hidden = true;
        reset();
        clearTimeout(bubbleTimer);
        try { localStorage.setItem('portfolio-companion-hidden', '1'); } catch { /* Still hidden for this visit. */ }
    });
    document.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse' || !active() || !motionEnabled()) return;
        pointerX = event.clientX; pointerY = event.clientY;
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            // Viewport-relative math avoids repeated DOM layout measurements.
            const x = Math.max(-2, Math.min(2, (pointerX - viewportWidth + 62) / 150));
            const y = Math.max(-2, Math.min(2, (pointerY - viewportHeight + 68) / 150));
            face.style.transform = `translate(${x}px, ${y}px)`;
        });
    }, { passive: true });
    document.addEventListener('pointerover', event => {
        if (event.pointerType === 'mouse' && active() && motionEnabled() && event.target.closest('a')) wave();
    }, { passive: true });
    window.addEventListener('resize', () => { viewportWidth = innerWidth; viewportHeight = innerHeight; reset(); }, { passive: true });
    document.addEventListener('visibilitychange', reset);
    desktop.addEventListener('change', reset);
    motionPreference.addEventListener('change', reset);
    try {
        if (!sessionStorage.getItem('portfolio-companion-greeted')) {
            wave(); sessionStorage.setItem('portfolio-companion-greeted', '1');
        }
    } catch { wave(); }
})();
