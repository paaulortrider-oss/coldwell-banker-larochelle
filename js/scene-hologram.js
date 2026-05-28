'use strict';

function initSceneHologram() {
    const section = document.getElementById('section-ville');
    if (!section) return;

    const inner = section.querySelector('.holo-inner');
    if (!inner) return;

    const img = inner.querySelector('.holo-visual-img');
    const markers = section.querySelectorAll('.hud-marker');
    const gpsEl = document.getElementById('hud-gps');
    const titleEl = document.getElementById('ville-title');
    const scanLine = inner.querySelector('.holo-scan-line');

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    if (img) {
        gsap.ticker.add(() => {
            gsap.set(img, {
                x: mouseX * 12,
                y: mouseY * 8,
                rotateY: mouseX * 2,
                rotateX: -mouseY * 1.5
            });
        });

        gsap.fromTo(img,
            { scale: 1.15, opacity: 0, filter: 'brightness(2) blur(10px)' },
            {
                scale: 1, opacity: 1, filter: 'brightness(1) blur(0px)',
                duration: 1.8, ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 65%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        gsap.to(img, {
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    if (scanLine) {
        gsap.to(scanLine, {
            top: '100%',
            duration: 3,
            ease: 'none',
            repeat: -1,
            onRepeat: () => { gsap.set(scanLine, { top: '0%' }); }
        });
    }

    ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        once: true,
        onEnter: () => {
            if (gpsEl) gsap.to(gpsEl, { opacity: 1, duration: 1.2, ease: 'power2.out' });
            if (titleEl) gsap.to(titleEl, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });

            markers.forEach((m, i) => {
                gsap.to(m, { opacity: 1, duration: 0.6, delay: 0.3 + i * 0.15, ease: 'power2.out' });
            });

            const prices = [
                { id: 'marker-vp', target: 4800 },
                { id: 'marker-minimes', target: 5200 },
                { id: 'marker-fetilly', target: 5500 },
                { id: 'marker-ilere', target: 8500 }
            ];
            prices.forEach(({ id, target }) => {
                const el = document.getElementById(id);
                if (!el) return;
                const dataEl = el.querySelector('.hud-marker-data');
                if (!dataEl) return;
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target, duration: 1.5, delay: 0.5, ease: 'power2.out',
                    onUpdate: () => {
                        dataEl.textContent = Math.floor(obj.val).toLocaleString('fr-FR') + ' €/m²';
                    }
                });
            });
        }
    });
}

window.initSceneHologram = initSceneHologram;
