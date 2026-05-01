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

function closeLightbox(event) {
    const lightbox = document.getElementById("certLightbox");
    if (!lightbox) return;
    if (!event || event.target !== document.getElementById("fullCertImage")) {
        lightbox.style.display = "none";
    }
}

function closeLightboxOnClick() {
    closeLightbox();
}

const tiltCard = document.querySelector('.tilt-card');

if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
        tiltCard.classList.remove('resetting');

        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        tiltCard.style.boxShadow = `${-rotateY}px ${rotateX}px 40px rgba(0, 0, 0, 0.15)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
        tiltCard.classList.add('resetting');
        tiltCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        tiltCard.style.boxShadow = `0 10px 30px rgba(0, 0, 0, 0.1)`;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll("#wgSlider .slider-card");
    const prevBtn = document.getElementById("wgPrev");
    const nextBtn = document.getElementById("wgNext");
    let currentIndex = 1; // শুরুতেই মাঝখানের ছবি (preview.png) একটিভ থাকবে

    function updateSlider() {
        cards.forEach((card, index) => {
            card.classList.remove("left", "active", "right");

            if (index === currentIndex) {
                card.classList.add("active");
            } else if (index === currentIndex - 1) {
                card.classList.add("left");
            } else if (index === currentIndex + 1) {
                card.classList.add("right");
            }
        });

        // অ্যারো বাটনের একটিভ/ইনঅ্যাক্টিভ স্টেট আপডেট
        prevBtn.disabled = (currentIndex === 0);
        nextBtn.disabled = (currentIndex === cards.length - 1);
    }

    nextBtn.addEventListener("click", () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // ইনিশিয়াল কল
    updateSlider();
});