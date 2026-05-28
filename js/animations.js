'use strict';

window.addEventListener('load', () => {
    initLuxuryLoader();
});

function initLuxuryLoader() {
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderStatus = document.getElementById('loader-status');

    document.body.style.overflow = 'hidden';

    if (typeof preloadScrubFrames === 'function') {
        preloadScrubFrames((loaded, total) => {
            const pct = Math.round((loaded / total) * 100);
            if (loaderPercent) loaderPercent.textContent = pct + '%';
            if (loaderBar) {
                loaderBar.style.animation = 'none';
                loaderBar.style.width = pct + '%';
            }
            if (loaderStatus) {
                if (pct < 25) loaderStatus.textContent = 'Chargement des données...';
                else if (pct < 50) loaderStatus.textContent = 'Compilation des visuels...';
                else if (pct < 80) loaderStatus.textContent = 'Initialisation du réseau...';
                else loaderStatus.textContent = 'Préparation de l\'expérience...';
            }
        }).then(() => {
            setTimeout(dismissLoader, 400);
        });
    } else {
        setTimeout(dismissLoader, 2500);
    }
}

function dismissLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    gsap.to(loader, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.style.display = 'none';
            document.body.style.overflow = '';

            initLenis();
            initHeroAnimations();

            if (typeof initStoryboard === 'function') {
                initStoryboard();
            }

            initIrisSection();
        }
    });
}

function initLenis() {
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        ...(window.innerWidth < 768 ? { smooth: false } : {})
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.siteLenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
}

function initHeroAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set('#hero-label', { opacity: 0, y: 30 });
    gsap.set('#hero-title', { opacity: 0, y: 50 });
    gsap.set('#hero-cta',   { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('#hero-label', {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out'
    })
    .to('#hero-title', {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out'
    }, '-=0.6')
    .to('#hero-cta', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out'
    }, '-=0.5');

    document.querySelector('[data-view="home"]')?.addEventListener('click', () => {
        setTimeout(() => {
            gsap.set('#hero-label', { opacity: 0, y: 30 });
            gsap.set('#hero-title', { opacity: 0, y: 50 });
            gsap.set('#hero-cta',   { opacity: 0, y: 20 });
            tl.restart();
        }, 100);
    });
}

function updateScrubTexts(progress) {
    toggleScrubText('scrub-left-1',  progress > 0.10 && progress < 0.45);
    toggleScrubText('scrub-right-1', progress > 0.20 && progress < 0.55);
    toggleScrubText('scrub-left-2',  progress > 0.48 && progress < 0.82);
    toggleScrubText('scrub-right-2', progress > 0.60);
}

function toggleScrubText(id, visible) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('visible', visible);
}

function initIrisSection() {
    const section = document.getElementById('section-iris');
    if (!section) return;

    gsap.to('.iris-bg', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.from('.iris-content', {
        opacity: 0, y: 60, duration: 1.4, ease: 'power3.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none none'
        }
    });
}

const _originalShowView = window.showView;
if (typeof _originalShowView === 'function') {
    window.showView = function(viewId) {
        gsap.to('body', {
            opacity: 0.3, duration: 0.25, ease: 'power2.in',
            onComplete: () => {
                _originalShowView(viewId);
                gsap.to('body', { opacity: 1, duration: 0.5, ease: 'power2.out' });
            }
        });
    };
}
