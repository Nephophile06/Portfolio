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

    // ── Sketchify Carousel ──
    const carouselTrack = document.getElementById('sketchify-track');
    const leftBtn = document.getElementById('sketchify-left-btn');
    const rightBtn = document.getElementById('sketchify-right-btn');

    if (carouselTrack && leftBtn && rightBtn) {
        let currentIndex = 0;
        const slides = carouselTrack.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;

        function updateCarousel() {
            slides.forEach((slide, index) => {
                const position = index - currentIndex;

                if (position === 0) {
                    // Current slide - front and center
                    slide.style.zIndex = '3';
                    slide.style.transform = 'translateX(0) scale(1)';
                    slide.style.opacity = '1';
                } else if (position === 1) {
                    // Next slide - slightly offset
                    slide.style.zIndex = '2';
                    slide.style.transform = 'translateX(40px) scale(0.95)';
                    slide.style.opacity = '0.7';
                } else if (position === 2) {
                    // Third slide - more offset
                    slide.style.zIndex = '1';
                    slide.style.transform = 'translateX(80px) scale(0.9)';
                    slide.style.opacity = '0.4';
                } else {
                    // Hidden slides
                    slide.style.zIndex = '0';
                    slide.style.transform = 'translateX(120px) scale(0.85)';
                    slide.style.opacity = '0';
                    slide.style.pointerEvents = 'none';
                }
            });

            // Disable left button at first slide
            leftBtn.disabled = currentIndex === 0;
            // Disable right button at last slide
            rightBtn.disabled = currentIndex === totalSlides - 1;
        }

        // Left button click
        leftBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Right button click
        rightBtn.addEventListener('click', () => {
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Initialize carousel
        updateCarousel();
    }

});

// ── Lightbox Functions (Global scope) ──
function openLightbox(element) {
    const lightbox = document.getElementById("certLightbox");
    if (!lightbox) return;

    lightbox.style.display = "block";
    document.getElementById("fullCertImage").src = element.src;
    document.getElementById("caption").innerHTML = element.alt;
}

function closeLightbox() {
    const lightbox = document.getElementById("certLightbox");
    if (!lightbox) return;

    lightbox.style.display = "none";
}

// Screen-er jekono jaygay click korlei modal bondho hobe
window.onclick = function (event) {
    const lightbox = document.getElementById("certLightbox");

    // Jodi lightbox open thake ebong user click kore
    if (event.target === lightbox || event.target.id === "fullCertImage" || event.target.className === "cert-modal") {
        closeLightbox();
    }
};

// Alt approach: Jure listener add kora
document.getElementById("certLightbox").addEventListener("click", function () {
    closeLightbox();
});