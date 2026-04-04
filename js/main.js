document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll-reveal animation ───────────────────────────────────
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

    // ── Top navbar active link on scroll ──────────────────────────
    const navHome        = document.getElementById('nav-home');
    const navCaseStudies = document.getElementById('nav-case-studies');
    const portfolioSection = document.getElementById('portfolio-section');
    const mainContent    = document.getElementById('main-content');

    if (mainContent) {
        mainContent.addEventListener('scroll', () => {
            const scrollY = mainContent.scrollTop;
            const portfolioOffset = portfolioSection ? portfolioSection.offsetTop - 120 : Infinity;
            const isPortfolio = scrollY >= portfolioOffset;

            [navHome, navCaseStudies].forEach(el => el && el.classList.remove('active'));
            if (isPortfolio && navCaseStudies) navCaseStudies.classList.add('active');
            else if (navHome) navHome.classList.add('active');
        });
    }

    // ── Navbar: Case Studies smooth scroll ────────────────────────
    if (navCaseStudies) {
        navCaseStudies.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('portfolio-section');
            if (target && mainContent) {
                mainContent.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
            }
        });
    }

    // ── Navbar: Home smooth scroll ────────────────────────────────
    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Download link ─────────────────────────────────────────────
    const navDownload = document.getElementById('nav-download');
    if (navDownload) {
        navDownload.addEventListener('click', (e) => {
            e.preventDefault();
            const resumeLink = document.querySelector('.download-resume-link');
            if (resumeLink) resumeLink.click();
            else alert('Resume download coming soon!');
        });
    }

    // ── Message button ────────────────────────────────────────────
    const msgBtn = document.getElementById('btn-message');
    if (msgBtn) {
        msgBtn.addEventListener('click', () => alert('Message feature coming soon!'));
    }

    // ── Save/Bookmark button toggle ───────────────────────────────
    const saveBtn = document.getElementById('btn-save');
    if (saveBtn) {
        let saved = false;
        saveBtn.addEventListener('click', () => {
            saved = !saved;
            saveBtn.style.background  = saved ? '#F0FDF4' : '';
            saveBtn.style.borderColor = saved ? '#22C55E' : '';
            saveBtn.style.color       = saved ? '#22C55E' : '';
        });
    }

});
