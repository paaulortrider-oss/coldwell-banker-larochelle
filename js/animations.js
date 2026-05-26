/**
 * animations.js
 * ─────────────────────────────────────────────────────────────────
 * Module 2 : Animations GSAP + Scroll Lenis
 *  - Initialisation Lenis (smooth scroll)
 *  - Hero : fade-up Cinzel au chargement
 *  - Section scrubbing : video frame-by-frame liée au scroll
 *  - Sections ville / globe : apparition au scroll
 *  - Section Iris : parallaxe du fond
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

// ─── INITIALISATION GÉNÉRALE ─────────────────────────────────────
// Tout démarre après le loader (2s pour laisser la barre charger)
window.addEventListener('load', () => {
    setTimeout(() => {
        initLoader();
    }, 2200);
});

/**
 * initLoader()
 * Masque le loader et lance toute la chaîne d'init
 */
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.style.display = 'none';
            initLenis();
            initHeroAnimations();
            initScrubbingSection();
            initVilleSection();
            initGlobeSection();
            initIrisSection();
        }
    });
}


// ═══════════════════════════════════════════════════════════════════
//  LENIS — SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════════

function initLenis() {
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        // Sur mobile : désactiver le smooth pour les performances
        ...(window.innerWidth < 768 ? { smooth: false } : {})
    });

    // Boucle RAF — synchronise Lenis avec GSAP ScrollTrigger
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Exposer globalement pour showView()
    window.siteLenis = lenis;

    // Synchroniser ScrollTrigger avec Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
}


// ═══════════════════════════════════════════════════════════════════
//  SECTION 1 — HERO : ANIMATIONS D'ENTRÉE
// ═══════════════════════════════════════════════════════════════════

function initHeroAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Timeline d'entrée : label GPS → titre → CTA
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('#hero-label', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .to('#hero-title', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    }, '-=0.6')
    .to('#hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.5');

    // Initialiser les éléments hors-écran avant animation
    gsap.set('#hero-label', { opacity: 0, y: 30 });
    gsap.set('#hero-title', { opacity: 0, y: 50 });
    gsap.set('#hero-cta',   { opacity: 0, y: 20 });

    // Re-jouer si l'utilisateur revient sur home
    document.querySelector('[data-view="home"]')?.addEventListener('click', () => {
        setTimeout(() => {
            gsap.set('#hero-label', { opacity: 0, y: 30 });
            gsap.set('#hero-title', { opacity: 0, y: 50 });
            gsap.set('#hero-cta',   { opacity: 0, y: 20 });
            tl.restart();
        }, 100);
    });
}


// ═══════════════════════════════════════════════════════════════════
//  SECTION 2 — SCRUBBING VIDÉO
//  La vidéo avance frame par frame en fonction du scroll.
//  Les textes contextuels apparaissent à certains seuils.
// ═══════════════════════════════════════════════════════════════════

function initScrubbingSection() {
    const video = document.getElementById('video-demembrement');
    if (!video) return;

    // Sur mobile : désactiver le scrubbing pour les perfs
    if (window.innerWidth < 768) {
        video.autoplay = true;
        video.loop     = true;
        video.play().catch(() => {});
        return;
    }

    // Attendre que les métadonnées soient chargées
    function setupScrubbing() {
        if (!video.duration) return;

        // Lier la progression de la vidéo au scroll
        gsap.to(video, {
            currentTime: video.duration,
            ease: 'none',
            scrollTrigger: {
                trigger: '#section-scrubbing',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,         // Lag léger pour une sensation fluide
                pin: false,         // Le pin est géré en CSS (position:sticky)
                onUpdate: (self) => {
                    // Apparition des textes selon la progression
                    updateScrubTexts(self.progress);
                }
            }
        });
    }

    if (video.readyState >= 1) {
        setupScrubbing();
    } else {
        video.addEventListener('loadedmetadata', setupScrubbing);
    }
}

/**
 * updateScrubTexts(progress)
 * Affiche/masque les textes contextuels autour de la vidéo
 * selon la progression du scroll (0 → 1)
 */
function updateScrubTexts(progress) {
    // Gauche 1 : apparaît à 15%, disparaît à 40%
    toggleScrubText('scrub-left-1',  progress > 0.10 && progress < 0.45);
    // Droite 1 : apparaît à 25%, disparaît à 55%
    toggleScrubText('scrub-right-1', progress > 0.20 && progress < 0.55);
    // Gauche 2 : apparaît à 50%, disparaît à 80%
    toggleScrubText('scrub-left-2',  progress > 0.48 && progress < 0.82);
    // Droite 2 : apparaît à 60%, reste jusqu'à la fin
    toggleScrubText('scrub-right-2', progress > 0.60);
}

function toggleScrubText(id, visible) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('visible', visible);
}


// ═══════════════════════════════════════════════════════════════════
//  SECTION 3 — VILLE HOLOGRAPHIQUE
//  Déclenchement des HUD markers et du titre au scroll
// ═══════════════════════════════════════════════════════════════════

function initVilleSection() {
    const section = document.getElementById('section-ville');
    if (!section) return;

    // GPS apparaît en entrant dans la section
    gsap.to('#hud-gps', {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Titre de la section
    gsap.from('#ville-title', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        }
    });

    // Marqueurs HUD — apparition en cascade
    const markers = ['marker-vp', 'marker-minimes', 'marker-fetilly', 'marker-ilere'];
    markers.forEach((id, i) => {
        gsap.to('#' + id, {
            opacity: 1,
            duration: 0.6,
            delay: i * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Animation des prix/m² (counter-up)
    ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        once: true,
        onEnter: () => animatePriceCounters()
    });
}

/**
 * animatePriceCounters()
 * Anime les valeurs de prix dans les marqueurs HUD
 */
function animatePriceCounters() {
    const prices = [
        { id: 'marker-vp',      target: 4800 },
        { id: 'marker-minimes', target: 5200 },
        { id: 'marker-fetilly', target: 5500 },
        { id: 'marker-ilere',   target: 8500 }
    ];

    prices.forEach(({ id, target }) => {
        const marker = document.getElementById(id);
        if (!marker) return;
        const dataEl = marker.querySelector('.hud-marker-data');
        if (!dataEl) return;

        let obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
                dataEl.textContent = Math.floor(obj.val).toLocaleString('fr-FR') + ' €/m²';
            }
        });
    });
}


// ═══════════════════════════════════════════════════════════════════
//  SECTION 4 — GLOBE INTERNATIONAL
//  Apparition des statistiques au scroll
// ═══════════════════════════════════════════════════════════════════

function initGlobeSection() {
    const section = document.getElementById('section-globe');
    if (!section) return;

    // Stats réseau — apparition avec counter-up
    const stats = [
        { id: 'globe-stat-1', target: 3000, suffix: '' },
        { id: 'globe-stat-2', target: 49,   suffix: '' },
        { id: 'globe-stat-3', target: 118,  suffix: '' }
    ];

    ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        once: true,
        onEnter: () => {
            stats.forEach(({ id, target }, i) => {
                const el = document.getElementById(id);
                if (!el) return;
                const numEl = el.querySelector('.globe-stat-number');
                if (!numEl) return;

                gsap.fromTo(el,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: 'power2.out' }
                );

                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    delay: i * 0.15,
                    ease: 'power2.out',
                    onUpdate: () => {
                        numEl.textContent = Math.floor(obj.val).toLocaleString('fr-FR');
                    }
                });
            });
        }
    });
}


// ═══════════════════════════════════════════════════════════════════
//  SECTION 5 — IRIS CB (L'HUMAIN)
//  Parallaxe du fond + apparition du contenu
// ═══════════════════════════════════════════════════════════════════

function initIrisSection() {
    const section = document.getElementById('section-iris');
    if (!section) return;

    // Parallaxe du fond villa flouté
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

    // Contenu : fade-up au déclenchement
    gsap.from('.iris-content', {
        opacity: 0,
        y: 60,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none none'
        }
    });
}


// ═══════════════════════════════════════════════════════════════════
//  TRANSITIONS ENTRE VUES
//  Fondu cinématique quand on navigue entre les pages
// ═══════════════════════════════════════════════════════════════════

// Surcharger showView pour y ajouter la transition
const _originalShowView = window.showView;
if (typeof _originalShowView === 'function') {
    window.showView = function(viewId) {
        // Fondu sortant
        gsap.to('body', {
            opacity: 0.3,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
                _originalShowView(viewId);
                // Fondu entrant
                gsap.to('body', {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    };
}
