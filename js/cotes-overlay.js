/**
 * cotes-overlay.js
 * ─────────────────────────────────────────────────────────────────
 * MISSION 2 — Sequence 7: Final House with Architectural Cotes
 *
 * Displays the prestige villa photo with animated measurement
 * lines (cotes/dimensions) overlaid via SVG.
 * The photo uses the parallax shader (same as port photo).
 * Lines, labels and annotations appear with staggered GSAP reveals.
 *
 * Reference: magnific__la-premire-image-de-rfrence-est-limage-modifier-le__44086.png
 * (Hôtel particulier with pool, architectural dimension overlays)
 *
 * DEPENDENCIES: GSAP ScrollTrigger
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

function initCotesOverlay(containerSelector, options = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const inner = container.querySelector('.seq-inner') || container;

    const {
        imageUrl = './assets/medias/maison-prestige-cotes.png'
    } = options;

    // ── Build the UI ─────────────────────────────────────────────
    inner.innerHTML = `
        <!-- Background: parallax photo (initialized separately or as CSS bg) -->
        <div id="cotes-photo-bg" style="position:absolute; inset:0; overflow:hidden;">
            <img id="cotes-photo-img" src="${imageUrl}" alt="Villa Prestige"
                style="width:100%; height:100%; object-fit:cover; transform:scale(1.05);
                filter:brightness(0.85) contrast(1.05);" />
        </div>

        <!-- SVG Overlay: dimension lines and annotations -->
        <svg id="cotes-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"
            style="position:absolute; inset:0; width:100%; height:100%; z-index:5; pointer-events:none;">

            <!-- Vertical dimension: building height -->
            <g class="cote-group" data-cote="height" opacity="0">
                <line x1="280" y1="120" x2="280" y2="780" stroke="#1a1a1a" stroke-width="1" stroke-dasharray="4,4" />
                <line x1="260" y1="120" x2="300" y2="120" stroke="#1a1a1a" stroke-width="1.5" />
                <line x1="260" y1="780" x2="300" y2="780" stroke="#1a1a1a" stroke-width="1.5" />
                <rect x="250" y="420" width="60" height="24" fill="rgba(255,255,255,0.9)" rx="2" />
                <text x="280" y="437" text-anchor="middle" font-family="Rajdhani,sans-serif"
                    font-size="13" font-weight="700" fill="#1a1a1a" letter-spacing="1">12.8m</text>
            </g>

            <!-- Horizontal dimension: facade width -->
            <g class="cote-group" data-cote="width" opacity="0">
                <line x1="480" y1="95" x2="1380" y2="95" stroke="#1a1a1a" stroke-width="1" stroke-dasharray="4,4" />
                <line x1="480" y1="75" x2="480" y2="115" stroke="#1a1a1a" stroke-width="1.5" />
                <line x1="1380" y1="75" x2="1380" y2="115" stroke="#1a1a1a" stroke-width="1.5" />
                <rect x="890" y="80" width="70" height="24" fill="rgba(255,255,255,0.9)" rx="2" />
                <text x="925" y="97" text-anchor="middle" font-family="Rajdhani,sans-serif"
                    font-size="13" font-weight="700" fill="#1a1a1a" letter-spacing="1">24.5m</text>
            </g>

            <!-- Pool dimension -->
            <g class="cote-group" data-cote="pool" opacity="0">
                <line x1="520" y1="870" x2="920" y2="870" stroke="rgba(0,212,255,0.7)" stroke-width="1" stroke-dasharray="3,3" />
                <line x1="520" y1="855" x2="520" y2="885" stroke="rgba(0,212,255,0.7)" stroke-width="1" />
                <line x1="920" y1="855" x2="920" y2="885" stroke="rgba(0,212,255,0.7)" stroke-width="1" />
                <rect x="690" y="858" width="50" height="20" fill="rgba(0,0,0,0.7)" rx="2" />
                <text x="715" y="873" text-anchor="middle" font-family="Rajdhani,sans-serif"
                    font-size="11" font-weight="600" fill="#00D4FF" letter-spacing="1">10m</text>
            </g>

            <!-- Floor heights (horizontal marks) -->
            <g class="cote-group" data-cote="floors" opacity="0">
                <!-- RDC -->
                <line x1="1400" y1="600" x2="1550" y2="600" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" stroke-dasharray="2,4" />
                <text x="1560" y="605" font-family="Rajdhani,sans-serif" font-size="10"
                    fill="rgba(0,0,0,0.5)" letter-spacing="1">RDC · 3.2m</text>
                <!-- R+1 -->
                <line x1="1400" y1="380" x2="1550" y2="380" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" stroke-dasharray="2,4" />
                <text x="1560" y="385" font-family="Rajdhani,sans-serif" font-size="10"
                    fill="rgba(0,0,0,0.5)" letter-spacing="1">R+1 · 3.0m</text>
                <!-- R+2 -->
                <line x1="1400" y1="220" x2="1550" y2="220" stroke="rgba(0,0,0,0.4)" stroke-width="0.5" stroke-dasharray="2,4" />
                <text x="1560" y="225" font-family="Rajdhani,sans-serif" font-size="10"
                    fill="rgba(0,0,0,0.5)" letter-spacing="1">R+2 · 2.8m</text>
            </g>

            <!-- Garden/terrain annotation -->
            <g class="cote-group" data-cote="terrain" opacity="0">
                <rect x="60" y="880" width="180" height="50" fill="rgba(0,0,0,0.65)" rx="3" />
                <text x="150" y="902" text-anchor="middle" font-family="Rajdhani,sans-serif"
                    font-size="10" font-weight="700" fill="#00D4FF" letter-spacing="2">TERRAIN</text>
                <text x="150" y="922" text-anchor="middle" font-family="Cinzel,serif"
                    font-size="16" font-weight="700" fill="#c6a87c">850 m²</text>
            </g>

            <!-- Surface habitable annotation -->
            <g class="cote-group" data-cote="surface" opacity="0">
                <rect x="1680" y="880" width="180" height="50" fill="rgba(0,0,0,0.65)" rx="3" />
                <text x="1770" y="902" text-anchor="middle" font-family="Rajdhani,sans-serif"
                    font-size="10" font-weight="700" fill="#00D4FF" letter-spacing="2">HABITABLE</text>
                <text x="1770" y="922" text-anchor="middle" font-family="Cinzel,serif"
                    font-size="16" font-weight="700" fill="#c6a87c">420 m²</text>
            </g>
        </svg>

        <!-- HUD Estimation teaser -->
        <div id="cotes-hud-estimation" style="position:absolute; bottom:3rem; left:50%; transform:translateX(-50%);
            z-index:10; text-align:center; opacity:0;">
            <div class="typo-tech-label" style="margin-bottom:0.5rem;">Valeur estimée du marché</div>
            <div id="cotes-price-display" style="font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.5rem);
                font-weight:700; color:#c6a87c; text-shadow:0 0 20px rgba(198,168,124,0.3);">
                2 450 000 €
            </div>
            <div style="margin-top:1.5rem;">
                <button class="btn-prestige" onclick="openTunnel()" style="pointer-events:auto;">
                    Estimer mon bien
                </button>
            </div>
        </div>
    `;

    // ── Ken Burns on photo ───────────────────────────────────────
    gsap.to('#cotes-photo-img', {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
            trigger: containerSelector,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // ── Staggered cote reveal ────────────────────────────────────
    const coteGroups = document.querySelectorAll('.cote-group');
    const coteOrder = ['height', 'width', 'floors', 'pool', 'terrain', 'surface'];

    ScrollTrigger.create({
        trigger: containerSelector,
        start: 'top 50%',
        once: true,
        onEnter: () => {
            coteOrder.forEach((name, i) => {
                const g = document.querySelector(`.cote-group[data-cote="${name}"]`);
                if (!g) return;

                gsap.to(g, {
                    opacity: 1,
                    duration: 0.8,
                    delay: i * 0.25,
                    ease: 'power2.out'
                });

                // Animate dimension lines drawing (stroke-dashoffset trick)
                const lines = g.querySelectorAll('line');
                lines.forEach(line => {
                    const len = line.getTotalLength ? line.getTotalLength() : 200;
                    line.style.strokeDasharray = len;
                    line.style.strokeDashoffset = len;
                    gsap.to(line, {
                        strokeDashoffset: 0,
                        duration: 1.2,
                        delay: i * 0.25 + 0.1,
                        ease: 'power2.inOut'
                    });
                });
            });

            // Price estimation reveal
            gsap.to('#cotes-hud-estimation', {
                opacity: 1,
                duration: 1,
                delay: coteOrder.length * 0.25 + 0.5,
                ease: 'power2.out'
            });
        }
    });
}

window.initCotesOverlay = initCotesOverlay;
