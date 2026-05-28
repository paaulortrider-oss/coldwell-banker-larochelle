'use strict';

function initStoryboard() {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof initSceneHologram === 'function') initSceneHologram();
    if (typeof initSceneGlobe === 'function') initSceneGlobe();
    if (typeof initCanvasScrubbing === 'function') initCanvasScrubbing();
    if (typeof initCotesOverlay === 'function') initCotesOverlay('#section-final', {
        imageUrl: './assets/medias/maison-avec-cotte.png'
    });

    initScanSection();
    initPlongeeSection();
}

function initScanSection() {
    const section = document.getElementById('section-scan');
    if (!section) return;

    const img = section.querySelector('.scan-visual-img');
    const sweep = section.querySelector('.scan-sweep');
    const grid = section.querySelector('.scan-grid-overlay');
    const titleBlock = section.querySelector('.scan-title-block');
    const statusText = section.querySelector('.scan-status-text');

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    if (img) {
        gsap.ticker.add(() => {
            gsap.set(img, {
                x: mouseX * 10,
                y: mouseY * 6,
                rotateY: mouseX * 1.5,
                rotateX: -mouseY * 1
            });
        });

        gsap.fromTo(img,
            { scale: 1.1, opacity: 0, filter: 'brightness(1.5) blur(8px) drop-shadow(0 0 30px rgba(0,212,255,0.25))' },
            {
                scale: 1, opacity: 1, filter: 'brightness(1) blur(0px) drop-shadow(0 0 30px rgba(0,212,255,0.25))',
                duration: 1.5, ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 65%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

    if (sweep) {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 60%',
            once: true,
            onEnter: () => {
                gsap.set(sweep, { opacity: 0.6 });
                gsap.to(sweep, {
                    top: '100%',
                    duration: 2.5,
                    ease: 'none',
                    repeat: -1,
                    onRepeat: () => { gsap.set(sweep, { top: '0%' }); }
                });
            }
        });
    }

    if (grid) {
        gsap.to(grid, {
            opacity: 1, duration: 1.5, delay: 0.3,
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        once: true,
        onEnter: () => {
            if (titleBlock) gsap.to(titleBlock, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
            if (statusText) gsap.to(statusText, { opacity: 1, duration: 1.2, delay: 0.5, ease: 'power2.out' });
        }
    });
}

function initPlongeeSection() {
    const section = document.getElementById('section-plongee');
    if (!section) return;

    const img = section.querySelector('.plongee-visual-img');
    const content = section.querySelector('.plongee-content');

    if (img) {
        gsap.fromTo(img,
            { opacity: 0, scale: 1.3 },
            {
                opacity: 1, scale: 1.15, duration: 2, ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        gsap.to(img, {
            scale: 1.0,
            filter: 'brightness(0.5) contrast(1.1)',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    if (content) {
        gsap.fromTo(content,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 45%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }
}

window.initStoryboard = initStoryboard;
