/* ==========================================================================
   Creative Canvas Script (Split-Flap Engine, Duck Mascot, Draggable Desk Items)
   ========================================================================== */

(function () {
    'use strict';

    // ── 1. Split-Flap Words Animation ──
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

    // ── 2. Draggable Desk Elements (Pointer Event Physics) ──
    const isDesktop = window.matchMedia('(min-width: 901px)').matches;
    if (isDesktop) {
        let maxZ = 40;
        const draggables = document.querySelectorAll('.desk-item, .desk-doodle');

        draggables.forEach(el => {
            let dragging = false;
            let startX, startY;
            let currentX = 0, currentY = 0;

            el.addEventListener('pointerdown', (e) => {
                if (e.target.closest('a, button')) return;

                dragging = true;
                el.classList.add('is-dragging');
                el.style.zIndex = ++maxZ;

                startX = e.clientX;
                startY = e.clientY;

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

                // Keep natural rotation
                let rot = '0deg';
                if (el.classList.contains('note-main-quote')) rot = '-1.5deg';
                else if (el.classList.contains('note-polaroid-card')) rot = '3deg';
                else if (el.classList.contains('note-exp-card')) rot = '-3.5deg';
                else if (el.classList.contains('note-strengths-card')) rot = '2deg';

                el.style.transform = `translate(${currentX + dx}px, ${currentY + dy}px) rotate(${rot})`;
            });

            const stopDrag = (e) => {
                if (!dragging) return;
                dragging = false;
                el.classList.remove('is-dragging');
                try { el.releasePointerCapture(e.pointerId); } catch(err) {}
            };

            el.addEventListener('pointerup', stopDrag);
            el.addEventListener('pointercancel', stopDrag);
        });
    }

    // ── 3. Cute Minimal Mascot (Eye-Tracking & Chatting) ──
    const duckMascot = document.getElementById('duckMascot');
    const duckBubble = document.getElementById('duckBubble');
    const duckPupilLeft = document.getElementById('duckPupilLeft');
    const duckPupilRight = document.getElementById('duckPupilRight');

    const mascotGreetings = [
        "Hello! Welcome to my space ✨",
        "Feel free to drag the notes around! 🎨",
        "Designing experiences & writing code 💻",
        "Check out my case studies below! 🚀",
        "Have a wonderful day! 🌿"
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
            }, 3000);
        });

        // Eye tracking mouse
        window.addEventListener('pointermove', (e) => {
            if (!duckPupilLeft || !duckPupilRight) return;
            const rect = duckMascot.getBoundingClientRect();
            const mascotCenterX = rect.left + rect.width / 2;
            const mascotCenterY = rect.top + rect.height / 2;

            const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
            const dist = 2.5; // pupil travel radius
            const px = Math.cos(angle) * dist;
            const py = Math.sin(angle) * dist;

            duckPupilLeft.style.transform = `translate(${px}px, ${py}px)`;
            duckPupilRight.style.transform = `translate(${px}px, ${py}px)`;
        }, { passive: true });
    }

})();

