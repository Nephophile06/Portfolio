// Core behavior shared by all three static pages. No dependencies.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionEnabled = () => !motionPreference.matches && document.documentElement.dataset.motion !== 'off';

document.addEventListener('DOMContentLoaded', () => {
    // 1. One reveal observer for every page. Above-the-fold content never hides.
    // Read all bounds before writing styles; reveal once and then unobserve.
    const targets = [...document.querySelectorAll('.fade-in-scroll, .block-title, .lets-talk-heading, .project-card, .skill-category-block, .edu-item, .drone-card, .ms-cert-item')];
    if (motionEnabled() && 'IntersectionObserver' in window) {
        const viewport = window.innerHeight;
        const positions = targets.map(el => el.getBoundingClientRect().top);
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0, rootMargin: '0px 0px -16px 0px' });
        targets.forEach((el, index) => {
            if (positions[index] < viewport) { el.classList.add('visible'); return; }
            // A capped sibling stagger, not an ever-growing page-wide delay.
            const siblingIndex = [...el.parentElement.children].indexOf(el);
            el.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 2) * 55}ms`);
            el.classList.add('reveal-ready');
            observer.observe(el);
        });
        motionPreference.addEventListener('change', () => {
            if (!motionEnabled()) {
                observer.disconnect();
                targets.forEach(el => el.classList.add('visible'));
            }
        });
        // Keyboard navigation must not land on an invisible offscreen card.
        document.addEventListener('focusin', e => {
            e.target.closest('.reveal-ready')?.classList.add('visible');
        });
    }

    // 2. Calendly retains its popup and its existing new-tab fallback.
    const calendlyBtn = document.getElementById('calendly-btn');
    calendlyBtn?.addEventListener('click', e => {
        e.preventDefault();
        const url = calendlyBtn.dataset.url;
        if (typeof window.Calendly?.initPopupWidget === 'function') {
            window.Calendly.initPopupWidget({ url });
        } else {
            window.open(url, '_blank', 'noopener');
        }
    });

    // 3. Resume dropdown: hover, click, keyboard, outside click and Escape.
    const dropdown = document.getElementById('resumeDropdown');
    const dropdownBtn = document.getElementById('resumeDropdownBtn');
    if (dropdown && dropdownBtn) {
        dropdown.classList.add('dropdown-ready');
        const setOpen = open => {
            dropdown.classList.toggle('active', open);
            dropdownBtn.setAttribute('aria-expanded', String(open));
        };
        dropdownBtn.addEventListener('click', () => setOpen(!dropdown.classList.contains('active')));
        dropdown.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse' && finePointer.matches) setOpen(true);
        });
        dropdown.addEventListener('pointerleave', event => {
            if (event.pointerType === 'mouse' && finePointer.matches && !dropdown.contains(document.activeElement)) setOpen(false);
        });
        dropdown.addEventListener('keydown', e => {
            if (e.key === 'Escape') { setOpen(false); dropdownBtn.focus(); }
            if (e.key === 'ArrowDown' && e.target === dropdownBtn) {
                e.preventDefault(); setOpen(true); dropdown.querySelector('a').focus();
            }
        });
        dropdown.addEventListener('focusout', () => queueMicrotask(() => {
            if (!dropdown.contains(document.activeElement)) setOpen(false);
        }));
        document.addEventListener('click', e => { if (!dropdown.contains(e.target)) setOpen(false); });
    }

    // 4. Sketchify: retain the stacked carousel and bounded arrow navigation.
    const track = document.getElementById('sketchify-track');
    const leftBtn = document.getElementById('sketchify-left-btn');
    const rightBtn = document.getElementById('sketchify-right-btn');
    if (track && leftBtn && rightBtn) {
        let currentIndex = 0;
        const slides = [...track.querySelectorAll('.carousel-slide')];
        const update = () => {
            slides.forEach((slide, index) => {
                const position = index - currentIndex;
                const visible = position >= 0 && position <= 2;
                slide.style.zIndex = visible ? String(3 - position) : '0';
                slide.style.transform = `translateX(${visible ? position * 40 : 120}px) scale(${visible ? 1 - position * 0.05 : 0.85})`;
                slide.style.opacity = visible ? String(1 - position * 0.3) : '0';
                slide.style.pointerEvents = position === 0 ? 'auto' : 'none';
                slide.setAttribute('aria-hidden', String(position !== 0));
            });
            leftBtn.disabled = currentIndex === 0;
            rightBtn.disabled = currentIndex === slides.length - 1;
        };
        leftBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; update(); } });
        rightBtn.addEventListener('click', () => { if (currentIndex < slides.length - 1) { currentIndex++; update(); } });
        update();
    }

    // 5. Whatcha Got: null-guarded, with the original middle-card start.
    const slider = document.getElementById('wgSlider');
    const prevBtn = document.getElementById('wgPrev');
    const nextBtn = document.getElementById('wgNext');
    if (slider && prevBtn && nextBtn) {
        const cards = [...slider.querySelectorAll('.slider-card')];
        let currentIndex = Math.min(1, cards.length - 1);
        const update = () => {
            cards.forEach((card, index) => {
                card.classList.toggle('active', index === currentIndex);
                card.classList.toggle('left', index === currentIndex - 1);
                card.classList.toggle('right', index === currentIndex + 1);
                card.setAttribute('aria-hidden', String(index !== currentIndex));
            });
            prevBtn.disabled = currentIndex <= 0;
            nextBtn.disabled = currentIndex >= cards.length - 1;
        };
        prevBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; update(); } });
        nextBtn.addEventListener('click', () => { if (currentIndex < cards.length - 1) { currentIndex++; update(); } });
        update();
    }

    // 6. Preserve the live clock's original local-time behavior and cadence.
    const clock = document.getElementById('live-time');
    if (clock) {
        const updateClock = () => {
            const now = new Date();
            const h = now.getHours();
            clock.textContent = `${String(h % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
        };
        updateClock();
        setInterval(updateClock, 30000);
    }

    // 7. IUPC disclosures: desktop hover is preserved; tap/Enter/Space also work.
    document.querySelectorAll('.cert-row').forEach((row, index) => {
        row.classList.add('disclosure-ready');
        const control = row.querySelector('.row-visible');
        const panel = row.querySelector('.row-hidden');
        panel.id = `cert-panel-${index}`;
        control.setAttribute('role', 'button');
        control.tabIndex = 0;
        control.setAttribute('aria-controls', panel.id);
        const setOpen = open => {
            row.classList.toggle('is-open', open);
            control.setAttribute('aria-expanded', String(open));
            panel.inert = !open;
        };
        let pinned = false;
        control.addEventListener('click', () => { pinned = !pinned; setOpen(pinned); });
        control.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); control.click(); }
            if (e.key === 'Escape') { pinned = false; setOpen(false); }
        });
        row.addEventListener('pointerenter', event => {
            if (event.pointerType === 'mouse' && finePointer.matches) setOpen(true);
        });
        row.addEventListener('pointerleave', event => {
            if (event.pointerType === 'mouse' && finePointer.matches && !pinned && !row.contains(document.activeElement)) setOpen(false);
        });
        row.addEventListener('focusout', () => queueMicrotask(() => {
            if (!pinned && !row.contains(document.activeElement)) setOpen(false);
        }));
        setOpen(false);
    });

    // 8. Lightbox images are keyboard controls; modal Escape and focus trap.
    document.querySelectorAll('img[onclick]').forEach(img => {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); img.click(); }
        });
    });
    const modal = document.getElementById('certLightbox');
    modal?.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'Tab') { e.preventDefault(); modal.querySelector('button').focus(); }
    });

    // 9. Tilt: cached bounds, one RAF per pointer frame, transforms only.
    const tilt = document.querySelector('.tilt-card');
    if (tilt) {
        let bounds, frame = 0, x = 0, y = 0;
        const reset = () => {
            if (!bounds && !frame && !tilt.style.transform) return;
            cancelAnimationFrame(frame); frame = 0; bounds = null;
            tilt.classList.add('resetting'); tilt.style.transform = '';
        };
        tilt.addEventListener('pointerenter', event => {
            if (event.pointerType !== 'mouse' || !finePointer.matches || !motionEnabled()) return;
            bounds = tilt.getBoundingClientRect();
            tilt.classList.remove('resetting');
        }, { passive: true });
        tilt.addEventListener('pointermove', e => {
            if (e.pointerType !== 'mouse' || !motionEnabled() || !finePointer.matches) return;
            x = e.clientX; y = e.clientY;
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                // Scrolling/resize invalidates geometry; reacquire before writes.
                if (!bounds) bounds = tilt.getBoundingClientRect();
                tilt.classList.remove('resetting');
                const rx = Math.max(-8, Math.min(8, (y - bounds.top - bounds.height / 2) / bounds.height * -16));
                const ry = Math.max(-8, Math.min(8, (x - bounds.left - bounds.width / 2) / bounds.width * 16));
                tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
            });
        }, { passive: true });
        tilt.addEventListener('pointerleave', reset, { passive: true });
        window.addEventListener('scroll', reset, { passive: true });
        window.addEventListener('resize', reset, { passive: true });
        motionPreference.addEventListener('change', reset);
    }
});

// Global names retained for the existing inline lightbox handlers.
let lightboxTrigger = null;
let lightboxInert = [];
function openLightbox(element) {
    const modal = document.getElementById('certLightbox');
    const image = document.getElementById('fullCertImage');
    if (!modal || !image) return;
    lightboxTrigger = element;
    image.src = element.currentSrc || element.src;
    image.alt = element.alt;
    image.width = element.naturalWidth || Number(element.getAttribute('width')) || 1600;
    image.height = element.naturalHeight || Number(element.getAttribute('height')) || 1000;
    document.getElementById('caption').textContent = element.alt;
    lightboxInert = [...document.body.children].filter(el => el !== modal && !el.inert && el.tagName !== 'SCRIPT');
    lightboxInert.forEach(el => { el.inert = true; });
    modal.style.display = 'block';
    modal.querySelector('button').focus({ preventScroll: true });
}
function closeLightbox(event) {
    const modal = document.getElementById('certLightbox');
    if (!modal || (event && event.target === document.getElementById('fullCertImage'))) return;
    modal.style.display = 'none';
    lightboxInert.forEach(el => { el.inert = false; });
    lightboxInert = [];
    lightboxTrigger?.focus({ preventScroll: true });
}
function closeLightboxOnClick() { closeLightbox(); }
