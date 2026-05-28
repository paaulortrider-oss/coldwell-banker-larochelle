/**
 * storyboard.js
 * ─────────────────────────────────────────────────────────────────
 * MISSION 2 : Master Storyboard Timeline
 *
 * Orchestrates 7 scroll-driven sequences in #view-home:
 *   SEQ 1 — Hero Video + Title
 *   SEQ 2 — Globe CB 3D (interactive)
 *   SEQ 3 — Transition Globe → Hologram La Rochelle
 *   SEQ 4 — Dive-in through hologram → Photo port reveal
 *   SEQ 5 — Scan laser: photo → holographic overlay
 *   SEQ 6 — Canvas scrubbing (303 frames: house isolation + dismemberment)
 *   SEQ 7 — Final: house photo with architectural cotes overlay
 *
 * DEPENDENCIES (loaded before this script):
 *   - Three.js r128
 *   - GSAP 3.12 + ScrollTrigger
 *   - Lenis
 *   - scene-globe.js   (initStoryGlobe)
 *   - scene-hologram.js (initStoryHologram)
 *   - shader-parallax.js (initParallaxImage)
 *   - canvas-scrubbing.js (initCanvasScrubbing)
 *   - cotes-overlay.js  (initCotesOverlay)
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

/**
 * initStoryboard()
 * Called once from animations.js after loader dismisses.
 * Sets up the full scroll-driven storyboard.
 */
function initStoryboard() {
    gsap.registerPlugin(ScrollTrigger);

    // ── Sequence height multipliers (vh units per section) ───────
    // Total scroll height = sum of these * 100vh
    const SEQ_HEIGHTS = {
        hero:       100,   // 1 screen
        globe:      200,   // 2 screens (rotation + interactive)
        transition: 150,   // 1.5 screens (globe fade → hologram appear)
        hologram:   200,   // 2 screens (hologram orbit + labels)
        divein:     150,   // 1.5 screens (camera dive + dissolve)
        portPhoto:  150,   // 1.5 screens (parallax photo reveal)
        scan:       100,   // 1 screen (laser sweep)
        scrubbing:  300,   // 3 screens (303 frame canvas)
        finalHouse: 150,   // 1.5 screens (house + cotes)
        iris:       100    // 1 screen (L'Humain — already exists)
    };

    // ── Phase 1: Ensure the DOM sections exist ───────────────────
    ensureStoryboardSections(SEQ_HEIGHTS);

    // ── Phase 2: Initialize each sequence module ─────────────────
    // Each module manages its own ScrollTrigger internally

    // SEQ 2: Globe
    if (typeof initStoryGlobe === 'function') {
        initStoryGlobe('#seq-globe');
    }

    // SEQ 3: Transition (handled via GSAP timeline below)
    initGlobeToHologramTransition();

    // SEQ 4: Hologram
    if (typeof initStoryHologram === 'function') {
        initStoryHologram('#seq-hologram');
    }

    // SEQ 5: Dive-in + port photo
    if (typeof initParallaxImage === 'function') {
        initParallaxImage('#seq-port-photo', {
            imageUrl: './assets/medias/freepik-port-larochelle.png',
            depthMode: 'auto', // Programmatic depth estimation
            parallaxStrength: 0.04,
            kenBurns: true
        });
    }

    // SEQ 6: Scan laser
    initScanLaserTransition();

    // SEQ 7: Canvas scrubbing (already loaded via canvas-scrubbing.js)
    if (typeof initCanvasScrubbing === 'function') {
        initCanvasScrubbing();
    }

    // SEQ 8: Final house with cotes
    if (typeof initCotesOverlay === 'function') {
        initCotesOverlay('#seq-final-house', {
            imageUrl: './assets/medias/maison-prestige-cotes.png'
        });
    }

    console.log('[Storyboard] All sequences initialized.');
}


// ═══════════════════════════════════════════════════════════════════
//  DOM SECTION BUILDER
//  Creates the scroll sections in #view-home if they don't exist
// ═══════════════════════════════════════════════════════════════════

function ensureStoryboardSections(heights) {
    const container = document.getElementById('igloo-story');
    if (!container) return;

    const sections = [
        // hero already exists as #section-hero
        { id: 'seq-globe',       height: heights.globe,      label: 'Globe CB' },
        { id: 'seq-transition',  height: heights.transition,  label: 'Transition' },
        { id: 'seq-hologram',    height: heights.hologram,    label: 'Hologram La Rochelle' },
        { id: 'seq-divein',      height: heights.divein,      label: 'Dive-in' },
        { id: 'seq-port-photo',  height: heights.portPhoto,   label: 'Port Photo' },
        { id: 'seq-scan',        height: heights.scan,        label: 'Scan Laser' },
        // scrubbing already exists as #section-scrubbing
        { id: 'seq-final-house', height: heights.finalHouse,  label: 'Final House' },
        // iris already exists as #section-iris
    ];

    // Insert new sections after #section-hero, before existing sections
    const heroSection = document.getElementById('section-hero');
    const scrubbingSection = document.getElementById('section-scrubbing');
    const irisSection = document.getElementById('section-iris');

    // Remove old ville / globe sections (we're replacing them)
    ['section-ville', 'section-globe'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    // Build new sections
    const fragment = document.createDocumentFragment();

    sections.forEach(sec => {
        if (document.getElementById(sec.id)) return; // Already exists

        const section = document.createElement('section');
        section.id = sec.id;
        section.className = 'story-section-scroll';
        section.style.cssText = `
            position: relative;
            height: ${sec.height}vh;
            width: 100%;
            overflow: hidden;
        `;
        section.setAttribute('data-storyboard-label', sec.label);

        // Each section gets a sticky inner container for pinned content
        const inner = document.createElement('div');
        inner.className = 'seq-inner';
        inner.style.cssText = `
            position: sticky;
            top: 0;
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        `;
        section.appendChild(inner);
        fragment.appendChild(section);
    });

    // Insert after hero, before scrubbing
    if (scrubbingSection) {
        container.insertBefore(fragment, scrubbingSection);
    } else if (irisSection) {
        container.insertBefore(fragment, irisSection);
    } else {
        container.appendChild(fragment);
    }
}


// ═══════════════════════════════════════════════════════════════════
//  GLOBE → HOLOGRAM TRANSITION
//  Crossfade between the two 3D canvases via GSAP
// ═══════════════════════════════════════════════════════════════════

function initGlobeToHologramTransition() {
    const trigger = document.getElementById('seq-transition');
    if (!trigger) return;

    const inner = trigger.querySelector('.seq-inner');
    if (!inner) return;

    // Create a visual transition overlay
    inner.innerHTML = `
        <div id="transition-globe-out" style="position:absolute; inset:0; opacity:1; display:flex; align-items:center; justify-content:center;">
            <canvas id="canvas-globe-transition" style="width:100%; height:100%;"></canvas>
        </div>
        <div id="transition-holo-in" style="position:absolute; inset:0; opacity:0; display:flex; align-items:center; justify-content:center;">
            <canvas id="canvas-hologram-transition" style="width:100%; height:100%;"></canvas>
        </div>
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:10; pointer-events:none;">
            <div id="transition-text" style="text-align:center; opacity:0;">
                <div class="typo-tech-label" style="margin-bottom:1rem;">Connexion au nœud local</div>
                <h2 style="font-family:'Cinzel',serif; font-size:clamp(1.5rem,4vw,3rem); color:#fff;">
                    La Rochelle, <span style="color:#00D4FF;">cartographiée</span>
                </h2>
            </div>
        </div>
    `;

    // ScrollTrigger timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: false // sticky handles it
        }
    });

    tl.to('#transition-globe-out', {
        opacity: 0,
        scale: 0.6,
        duration: 0.4,
        ease: 'power2.in'
    })
    .to('#transition-text', {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out'
    }, 0.15)
    .to('#transition-text', {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
    }, 0.5)
    .to('#transition-holo-in', {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
    }, 0.4);

    // Set initial state
    gsap.set('#transition-holo-in', { scale: 1.4, opacity: 0 });
}


// ═══════════════════════════════════════════════════════════════════
//  SCAN LASER TRANSITION
//  Photo → holographic overlay via animated clip-path sweep
// ═══════════════════════════════════════════════════════════════════

function initScanLaserTransition() {
    const trigger = document.getElementById('seq-scan');
    if (!trigger) return;

    const inner = trigger.querySelector('.seq-inner');
    if (!inner) return;

    inner.innerHTML = `
        <div id="scan-photo-layer" style="position:absolute; inset:0;">
            <!-- Port photo is behind (from previous section) -->
        </div>
        <div id="scan-holo-layer" style="position:absolute; inset:0; clip-path:inset(100% 0 0 0); transition:none;">
            <!-- Holographic version revealed by scan -->
            <div style="position:absolute; inset:0; background:#000; opacity:0.85;"></div>
            <div id="scan-grid-overlay" style="position:absolute; inset:0; opacity:0.3;
                background: 
                    linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px);
                background-size: 40px 40px;">
            </div>
        </div>
        <div id="scan-laser-line" style="position:absolute; left:0; right:0; height:3px; top:0;
            background:linear-gradient(to right, transparent, #00D4FF, transparent);
            box-shadow: 0 0 30px #00D4FF, 0 0 60px rgba(0,212,255,0.5);
            z-index:20; opacity:0;">
        </div>
        <div style="position:absolute; top:2rem; left:50%; transform:translateX(-50%); z-index:10; pointer-events:none;">
            <div id="scan-hud-gps" class="typo-tech-label" style="opacity:0; text-align:center;">
                46°09'21.6"N · 1°09'13.0"W · SCAN EN COURS...
            </div>
        </div>
    `;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8
        }
    });

    // Laser line sweeps top to bottom
    tl.to('#scan-laser-line', { opacity: 1, duration: 0.05 })
      .to('#scan-laser-line', { top: '100%', duration: 0.8, ease: 'none' }, 0.05)
      .to('#scan-holo-layer', {
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.8,
          ease: 'none'
      }, 0.05)
      .to('#scan-hud-gps', { opacity: 0.7, duration: 0.2 }, 0.1)
      .to('#scan-laser-line', { opacity: 0, duration: 0.1 }, 0.85);
}


// ═══════════════════════════════════════════════════════════════════
//  CSS FOR STORYBOARD SECTIONS
//  Injected dynamically to avoid modifying external files
// ═══════════════════════════════════════════════════════════════════

(function injectStoryboardCSS() {
    const style = document.createElement('style');
    style.id = 'storyboard-css';
    style.textContent = `
        /* Storyboard scroll sections */
        .story-section-scroll {
            position: relative;
            width: 100%;
            z-index: 2;
        }
        .seq-inner {
            position: sticky;
            top: 0;
            height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        /* Sequence canvases */
        .seq-inner canvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
        }

        /* Transition effects */
        #transition-globe-out,
        #transition-holo-in {
            transition: none; /* GSAP controls everything */
        }
    `;
    document.head.appendChild(style);
})();


// Expose globally
window.initStoryboard = initStoryboard;
