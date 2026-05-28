'use strict';

function initSceneGlobe() {
    const section = document.getElementById('section-globe');
    if (!section) return;

    const inner = section.querySelector('.globe-inner');
    if (!inner) return;

    const img = inner.querySelector('.globe-visual-img');
    const statsEls = section.querySelectorAll('.globe-stat');
    const titleBlock = section.querySelector('.globe-title-block');

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    if (img) {
        gsap.ticker.add(() => {
            gsap.set(img, {
                x: mouseX * 15,
                y: mouseY * 10,
                rotateY: mouseX * 3,
                rotateX: -mouseY * 2
            });
        });

        gsap.fromTo(img,
            { scale: 0.85, opacity: 0 },
            {
                scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        gsap.to(img, {
            scale: 1.06,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    const glow = inner.querySelector('.globe-glow');
    if (glow) {
        gsap.to(glow, {
            opacity: 0.6,
            scale: 1.1,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }

    ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        once: true,
        onEnter: () => {
            if (titleBlock) {
                gsap.to(titleBlock, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
            }

            const counters = [
                { el: section.querySelector('#globe-num-offices'), target: 3000 },
                { el: section.querySelector('#globe-num-countries'), target: 49 },
                { el: section.querySelector('#globe-num-years'), target: 118 }
            ];

            counters.forEach((c, i) => {
                if (!c.el) return;
                const parent = c.el.closest('.globe-stat');
                if (parent) {
                    gsap.to(parent, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: 'power2.out' });
                }
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: c.target,
                    duration: 2,
                    delay: i * 0.15 + 0.3,
                    ease: 'power2.out',
                    onUpdate: () => {
                        c.el.textContent = Math.floor(obj.val).toLocaleString('fr-FR');
                    }
                });
            });
        }
    });
}

window.initSceneGlobe = initSceneGlobe;
