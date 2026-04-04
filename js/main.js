document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll-reveal animation ──
    const faders = document.querySelectorAll('.fade-in-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    faders.forEach(el => observer.observe(el));

    // ── Message button ──
    const msgBtn = document.getElementById('btn-message');
    if (msgBtn) {
        msgBtn.addEventListener('click', () => alert('Message feature coming soon!'));
    }

    // ── Save/Bookmark button toggle ──
    const saveBtn = document.getElementById('btn-save');
    if (saveBtn) {
        let saved = false;
        saveBtn.addEventListener('click', () => {
            saved = !saved;
            saveBtn.style.background = saved ? '#F0FDF4' : '';
            saveBtn.style.borderColor = saved ? '#22C55E' : '';
            saveBtn.style.color = saved ? '#22C55E' : '';
        });
    }

});