/**
 * scene-hologram.js
 * ─────────────────────────────────────────────────────────────────
 * MISSION 2 — Sequence 4: Holographic City La Rochelle
 *
 * Loads holographic_city_model_3d.glb (47MB, 591K verts, 1M tris)
 * Applies custom shader reproducing the reference visual:
 *   - Semi-transparent cyan buildings with edge glow
 *   - Metallic projector base (TorusGeometry)
 *   - Horizontal scan lines sweeping
 *   - GPS coordinates overlay
 *   - POI labels (Tour Saint-Nicolas, Cathédrale, etc.)
 *   - Scroll-driven reveal (bottom-up materialization)
 *   - Scroll-driven orbital camera
 *
 * DEPENDENCIES: Three.js r128, GSAP ScrollTrigger
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

function initStoryHologram(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const inner = container.querySelector('.seq-inner') || container;

    // ── Canvas ───────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-story-hologram';
    canvas.style.cssText = 'position:absolute; inset:0; width:100%; height:100%;';
    inner.appendChild(canvas);

    // ── HUD Overlay ──────────────────────────────────────────────
    const hud = document.createElement('div');
    hud.style.cssText = 'position:absolute; inset:0; z-index:10; pointer-events:none;';
    hud.innerHTML = `
        <div id="holo-gps" style="position:absolute; top:5rem; left:50%; transform:translateX(-50%);
            font-family:'Rajdhani',monospace; font-size:clamp(0.7rem,2vw,1.1rem); font-weight:700;
            letter-spacing:0.3em; color:rgba(0,212,255,0.8); text-align:center; opacity:0;
            text-shadow:0 0 15px rgba(0,212,255,0.5);">
            46°09'21.6"N &nbsp; 1°09'13.0"W
        </div>

        <div id="holo-marker-sn" class="holo-poi" style="top:32%; left:38%; opacity:0;">
            <div class="holo-poi-dot"></div>
            <div class="holo-poi-label">Tour Saint-Nicolas</div>
        </div>
        <div id="holo-marker-chain" class="holo-poi" style="top:30%; left:28%; opacity:0;">
            <div class="holo-poi-dot"></div>
            <div class="holo-poi-label">Tour de la Chaîne</div>
        </div>
        <div id="holo-marker-cath" class="holo-poi" style="top:22%; right:25%; opacity:0;">
            <div class="holo-poi-dot"></div>
            <div class="holo-poi-label">Cathédrale</div>
            <div class="holo-poi-data">4 800 €/m²</div>
        </div>
        <div id="holo-marker-ile" class="holo-poi" style="top:15%; right:10%; opacity:0;">
            <div class="holo-poi-dot"></div>
            <div class="holo-poi-label">Île de Ré</div>
            <div class="holo-poi-data">8 500 €/m²</div>
        </div>
        <div id="holo-marker-poi" class="holo-poi" style="bottom:25%; left:50%; transform:translateX(-50%); opacity:0;">
            <div class="holo-poi-dot" style="background:#c6a87c; box-shadow:0 0 12px #c6a87c;"></div>
            <div class="holo-poi-label" style="color:#c6a87c;">POI · Bien ciblé</div>
        </div>

        <div style="position:absolute; bottom:3rem; left:50%; transform:translateX(-50%); text-align:center; z-index:10; opacity:0;" id="holo-title-block">
            <div class="typo-tech-label" style="margin-bottom:0.5rem;">Marché Local</div>
            <h2 style="font-family:'Cinzel',serif; font-size:clamp(1.5rem,4vw,2.5rem); color:#fff;">
                La Rochelle · <span style="color:#00D4FF;">Analyse Territoriale</span>
            </h2>
        </div>

        <div id="holo-scanline" style="position:absolute; left:0; right:0; height:2px;
            background:linear-gradient(to right, transparent, #00D4FF, transparent);
            opacity:0.4; pointer-events:none; z-index:5;
            animation: holoScanDown 3.5s ease-in-out infinite;">
        </div>
    `;
    inner.appendChild(hud);

    // ── Inject POI + scan CSS ────────────────────────────────────
    if (!document.getElementById('hologram-poi-css')) {
        const style = document.createElement('style');
        style.id = 'hologram-poi-css';
        style.textContent = `
            .holo-poi {
                position: absolute;
                z-index: 10;
                pointer-events: none;
            }
            .holo-poi-dot {
                width: 6px; height: 6px;
                background: #00D4FF;
                border-radius: 50%;
                box-shadow: 0 0 10px #00D4FF;
                margin-bottom: 4px;
            }
            .holo-poi-label {
                font-family: 'Rajdhani', sans-serif;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: #00D4FF;
            }
            .holo-poi-data {
                font-family: 'Rajdhani', sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: #00D4FF;
                text-shadow: 0 0 10px rgba(0,212,255,0.4);
            }
            @keyframes holoScanDown {
                0%   { top: 0%;   opacity: 0.5; }
                100% { top: 100%; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // ── Three.js Setup ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(inner.offsetWidth, inner.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, inner.offsetWidth / inner.offsetHeight, 0.1, 500);
    camera.position.set(0, 6, 14);
    camera.lookAt(0, 0, 0);

    // ── Holographic City Shader ──────────────────────────────────
    const holoCityMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime:      { value: 0 },
            uBaseColor: { value: null },
            uCyan:      { value: new THREE.Color(0x00D4FF) },
            uGold:      { value: new THREE.Color(0xc6a87c) },
            uReveal:    { value: 0 },    // 0→1 bottom-up materialization
            uScanY:     { value: 0 }
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            varying vec3 vWorldPos;
            uniform float uTime;

            void main() {
                vPosition = position;
                vNormal   = normalize(normalMatrix * normal);
                vUv       = uv;
                vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

                // Subtle holographic vibration
                vec3 pos = position;
                pos.x += sin(uTime * 2.5 + position.y * 4.0) * 0.001;
                pos.z += cos(uTime * 2.0 + position.y * 3.0) * 0.001;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform sampler2D uBaseColor;
            uniform vec3 uCyan;
            uniform vec3 uGold;
            uniform float uReveal;
            uniform float uScanY;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            varying vec3 vWorldPos;

            void main() {
                // Reveal mask: bottom-up materialization
                float normalizedY = (vWorldPos.y + 0.5) / 1.5; // Normalize to 0-1 range
                float revealMask = smoothstep(uReveal - 0.2, uReveal, normalizedY);
                if (revealMask < 0.01) discard;

                // Base texture sampling
                vec4 baseTex = texture2D(uBaseColor, vUv);
                float brightness = dot(baseTex.rgb, vec3(0.299, 0.587, 0.114));

                // Edge detection via normal angle (simulated wireframe)
                float edgeFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0)));
                edgeFactor = pow(edgeFactor, 0.8);

                // Fresnel rim
                vec3 viewDir = normalize(cameraPosition - vWorldPos);
                float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
                fresnel = pow(fresnel, 2.0);

                // Horizontal scan line
                float scanDist = abs(vWorldPos.y - uScanY);
                float scanLine = smoothstep(0.05, 0.0, scanDist);

                // Grid pattern on ground plane (y near 0)
                float groundGrid = 0.0;
                if (vWorldPos.y < 0.02) {
                    float gx = abs(sin(vWorldPos.x * 20.0));
                    float gz = abs(sin(vWorldPos.z * 20.0));
                    groundGrid = smoothstep(0.95, 1.0, max(gx, gz)) * 0.3;
                }

                // Build color
                vec3 col = uCyan * 0.08;               // Dark base
                col += uCyan * edgeFactor * 0.5;        // Edge glow
                col += uCyan * fresnel * 0.4;           // Rim glow
                col += uCyan * brightness * 0.3;        // Texture-driven brightness
                col += uGold * scanLine * 0.7;          // Gold scan highlight
                col += uCyan * groundGrid;              // Ground grid

                // Buildings that are bright in texture get extra opacity
                float structureAlpha = brightness * 0.4 + edgeFactor * 0.4;

                // Pulsation
                float pulse = 0.8 + 0.2 * sin(uTime * 1.2);

                float alpha = (structureAlpha + fresnel * 0.3 + scanLine * 0.4 + groundGrid + 0.05) * pulse * revealMask;
                alpha = clamp(alpha, 0.0, 0.9);

                // Reveal edge glow (golden frontier)
                float revealEdge = smoothstep(0.0, 0.05, abs(normalizedY - uReveal));
                revealEdge = 1.0 - revealEdge;
                col += uGold * revealEdge * 0.8;
                alpha += revealEdge * 0.3;

                gl_FragColor = vec4(col, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    // ── Projector base (metallic disc) ───────────────────────────
    const baseGroup = new THREE.Group();

    // Outer ring
    const outerRing = new THREE.Mesh(
        new THREE.TorusGeometry(5.5, 0.08, 16, 100),
        new THREE.MeshStandardMaterial({
            color: 0x444444, metalness: 0.95, roughness: 0.15,
            emissive: 0x00D4FF, emissiveIntensity: 0.05
        })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = -1.5;
    baseGroup.add(outerRing);

    // Inner ring
    const innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(4.0, 0.04, 16, 80),
        new THREE.MeshStandardMaterial({
            color: 0x333333, metalness: 0.9, roughness: 0.2,
            emissive: 0x00D4FF, emissiveIntensity: 0.08
        })
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = -1.49;
    baseGroup.add(innerRing);

    // Base disc (subtle glow)
    const basePlate = new THREE.Mesh(
        new THREE.CircleGeometry(5.4, 80),
        new THREE.MeshBasicMaterial({
            color: 0x00D4FF, transparent: true, opacity: 0.02,
            blending: THREE.AdditiveBlending
        })
    );
    basePlate.rotation.x = -Math.PI / 2;
    basePlate.position.y = -1.5;
    baseGroup.add(basePlate);

    scene.add(baseGroup);

    // ── Lights ───────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x00D4FF, 0.15));
    const topLight = new THREE.PointLight(0x00D4FF, 2.5, 30);
    topLight.position.set(0, 12, 0);
    scene.add(topLight);
    const sideLight = new THREE.PointLight(0xc6a87c, 1.5, 20);
    sideLight.position.set(-8, 4, -4);
    scene.add(sideLight);
    const rimLight = new THREE.PointLight(0x00D4FF, 1.5, 25);
    rimLight.position.set(5, 2, 8);
    scene.add(rimLight);

    // ── GLB Loading ──────────────────────────────────────────────
    let cityModel = null;

    function applyHoloMaterial(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                const origMat = child.material;
                const mat = holoCityMaterial.clone();
                if (origMat.map) {
                    mat.uniforms.uBaseColor.value = origMat.map;
                }
                child.material = mat;
            }
        });
    }

    function onGLBLoaded(gltf) {
        cityModel = gltf.scene;
        applyHoloMaterial(cityModel);

        // Center and scale
        const box = new THREE.Box3().setFromObject(cityModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scale = 10 / Math.max(size.x, size.z); // Scale based on horizontal extent
        cityModel.scale.setScalar(scale);
        cityModel.position.sub(center.multiplyScalar(scale));
        cityModel.position.y = -1.2; // Sit on the base

        scene.add(cityModel);
        console.log('[Hologram] GLB loaded (591K verts, 1M tris)');
    }

    function buildFallbackCity() {
        const group = new THREE.Group();
        const data = [
            { x: 0, z: 0, w: 1.5, h: 3.5, d: 1.5 },
            { x: 2, z: 0, w: 1, h: 3, d: 1 },
            { x: -2, z: 1, w: 0.8, h: 4.5, d: 0.8 },
            { x: 1, z: 2, w: 2, h: 1.2, d: 3 },
            { x: -1, z: -2, w: 3, h: 0.8, d: 2 },
            { x: 4, z: 1, w: 1, h: 1.8, d: 1 },
            { x: -4, z: -1, w: 1.2, h: 2.2, d: 1.2 },
            { x: 3, z: -2, w: 0.8, h: 1.5, d: 0.8 },
            { x: -3, z: 2, w: 1.5, h: 1, d: 1.5 },
            { x: 0, z: 3, w: 4, h: 0.6, d: 2 },
        ];
        data.forEach(b => {
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(b.w, b.h, b.d),
                holoCityMaterial.clone()
            );
            mesh.position.set(b.x, b.h / 2 - 1.5, b.z);
            group.add(mesh);
        });
        scene.add(group);
        cityModel = group;
    }

    // Attempt load
    if (THREE.GLTFLoader) {
        new THREE.GLTFLoader().load(
            './assets/models/holographic_city_model_3d.glb',
            onGLBLoaded,
            undefined,
            () => { console.warn('[Hologram] GLB failed, using fallback'); buildFallbackCity(); }
        );
    } else {
        // Dynamically load GLTFLoader
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
        s.onload = () => {
            new THREE.GLTFLoader().load(
                './assets/models/holographic_city_model_3d.glb',
                onGLBLoaded,
                undefined,
                () => buildFallbackCity()
            );
        };
        s.onerror = () => buildFallbackCity();
        document.head.appendChild(s);
    }

    // ── Scroll-driven reveal + rotation ──────────────────────────
    let scrollProgress = 0;

    // Reveal animation: uniform uReveal 0 → 1
    gsap.to(holoCityMaterial.uniforms.uReveal, {
        value: 1.2, // Overshoot slightly for full reveal
        ease: 'power2.out',
        scrollTrigger: {
            trigger: containerSelector,
            start: 'top 70%',
            end: 'center center',
            scrub: 1
        }
    });

    ScrollTrigger.create({
        trigger: containerSelector,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => { scrollProgress = self.progress; }
    });

    // HUD labels cascade
    const pois = ['holo-gps', 'holo-marker-sn', 'holo-marker-chain', 'holo-marker-cath', 'holo-marker-ile', 'holo-marker-poi', 'holo-title-block'];
    ScrollTrigger.create({
        trigger: containerSelector,
        start: 'top 50%',
        once: true,
        onEnter: () => {
            pois.forEach((id, i) => {
                gsap.to('#' + id, { opacity: 1, duration: 0.6, delay: i * 0.15, ease: 'power2.out' });
            });
        }
    });

    // ── Resize ───────────────────────────────────────────────────
    window.addEventListener('resize', () => {
        const w = inner.offsetWidth;
        const h = inner.offsetHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // ── Render loop ──────────────────────────────────────────────
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Update all holoCityMaterial instances
        if (cityModel) {
            cityModel.traverse(child => {
                if (child.isMesh && child.material.uniforms) {
                    child.material.uniforms.uTime.value = t;
                    child.material.uniforms.uScanY.value = ((t * 0.2) % 2.0) - 0.5;
                }
            });

            // Orbital rotation driven by scroll
            cityModel.rotation.y = scrollProgress * Math.PI * 0.6 - Math.PI * 0.15;
        }

        // Animate lights
        rimLight.position.x = Math.sin(t * 0.3) * 8;
        rimLight.position.z = Math.cos(t * 0.25) * 8;

        renderer.render(scene, camera);
    }
    animate();
}

window.initStoryHologram = initStoryHologram;
