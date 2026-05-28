/**
 * scene-globe.js
 * ─────────────────────────────────────────────────────────────────
 * MISSION 2 — Sequence 2: Globe CB Interactive
 *
 * Loads glowing_globe_3d_model.glb (30MB, 1M triangles, 3 textures)
 * Applies custom holographic shader to reproduce the reference visual:
 *   - Cyan wireframe globe with visible continents
 *   - Glowing node points at CB office locations
 *   - Curved connection lines (La Rochelle hub)
 *   - Metallic circular base/socle
 *   - Dark sci-fi environment with floating data
 *
 * The GLB's original PBR textures (basecolor, roughness/metallic, normal)
 * are used as DATA INPUT for the custom shader — the final look is entirely
 * controlled by our holographic material.
 *
 * DEPENDENCIES: Three.js r128, GSAP ScrollTrigger
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

function initStoryGlobe(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const inner = container.querySelector('.seq-inner') || container;

    // ── Create canvas ────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-story-globe';
    canvas.style.cssText = 'position:absolute; inset:0; width:100%; height:100%;';
    inner.appendChild(canvas);

    // ── HUD Overlay (HTML labels) ────────────────────────────────
    const hud = document.createElement('div');
    hud.style.cssText = 'position:absolute; inset:0; z-index:10; pointer-events:none;';
    hud.innerHTML = `
        <div style="position:absolute; top:3rem; left:50%; transform:translateX(-50%); text-align:center;">
            <div class="typo-tech-label" style="margin-bottom:0.5rem; opacity:0;" id="globe-hud-label">Réseau Coldwell Banker</div>
            <h2 style="font-family:'Cinzel',serif; font-size:clamp(1rem,3vw,2rem); color:#fff; opacity:0;" id="globe-hud-title">
                Votre bien, <span style="color:#c6a87c;">visible partout</span>
            </h2>
        </div>
        <div id="globe-stat-offices" class="globe-hud-stat" style="position:absolute; top:25%; left:6%; opacity:0;">
            <div style="font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:700; color:#00D4FF; text-shadow:0 0 20px rgba(0,212,255,0.4);">3 000</div>
            <div class="typo-tech-label">Agences mondiales</div>
        </div>
        <div id="globe-stat-countries" class="globe-hud-stat" style="position:absolute; top:25%; right:6%; text-align:right; opacity:0;">
            <div style="font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:700; color:#00D4FF; text-shadow:0 0 20px rgba(0,212,255,0.4);">49</div>
            <div class="typo-tech-label">Pays</div>
        </div>
        <div id="globe-stat-years" class="globe-hud-stat" style="position:absolute; bottom:15%; left:50%; transform:translateX(-50%); text-align:center; opacity:0;">
            <div style="font-family:'Cinzel',serif; font-size:clamp(1.5rem,4vw,2.5rem); font-weight:700; color:#c6a87c; text-shadow:0 0 15px rgba(198,168,124,0.4);">118</div>
            <div class="typo-prestige-label">ans d'excellence · depuis 1906</div>
        </div>
        <div id="globe-node-synch" style="position:absolute; bottom:3rem; left:2rem; opacity:0;">
            <div class="typo-tech-label" style="font-size:9px; color:rgba(0,212,255,0.5);">NODE SYNCH STATUS: OPTIMAL</div>
        </div>
    `;
    inner.appendChild(hud);

    // ── Three.js Setup ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(inner.offsetWidth, inner.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, inner.offsetWidth / inner.offsetHeight, 0.1, 500);
    camera.position.set(0, 0.8, 4);
    camera.lookAt(0, 0, 0);

    // ── Holographic Globe Shader ─────────────────────────────────
    // Uses the GLB's base color texture as continent mask
    const holoGlobeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime:        { value: 0 },
            uBaseColor:   { value: null }, // Will be set after GLB load
            uCyan:        { value: new THREE.Color(0x00D4FF) },
            uGold:        { value: new THREE.Color(0xc6a87c) },
            uScrollProg:  { value: 0 }
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            uniform float uTime;

            void main() {
                vPosition = position;
                vNormal   = normalize(normalMatrix * normal);
                vUv       = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform sampler2D uBaseColor;
            uniform vec3 uCyan;
            uniform vec3 uGold;
            uniform float uScrollProg;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec2 vUv;

            void main() {
                // Sample base color (continent map)
                vec4 baseTex = texture2D(uBaseColor, vUv);
                float continent = baseTex.r; // Brightness as mask

                // Fresnel rim glow
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
                fresnel = pow(fresnel, 2.5);

                // Latitude/longitude grid lines
                float lat = abs(sin(vUv.y * 3.14159 * 12.0));
                float lon = abs(sin(vUv.x * 3.14159 * 24.0));
                float grid = smoothstep(0.92, 1.0, max(lat, lon));

                // Pulsation
                float pulse = 0.75 + 0.25 * sin(uTime * 1.5);

                // Continent areas get brighter cyan
                float landGlow = smoothstep(0.3, 0.7, continent) * 0.6;

                // Compose color
                vec3 col = uCyan * 0.15;           // Dark base
                col += uCyan * fresnel * 0.7;       // Rim glow
                col += uCyan * grid * 0.4;           // Grid lines
                col += uCyan * landGlow;             // Continent highlight
                col += uGold * grid * continent * 0.3; // Gold accent on land grid

                // Alpha
                float alpha = (fresnel * 0.5 + grid * 0.3 + landGlow * 0.4 + 0.08) * pulse;
                alpha = clamp(alpha, 0.0, 0.95);

                gl_FragColor = vec4(col, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending
    });

    // ── Circular metallic socle ──────────────────────────────────
    const socleGroup = new THREE.Group();

    // Main ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 80);
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x00D4FF,
        emissiveIntensity: 0.1
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.2;
    socleGroup.add(ring);

    // Inner glow disc
    const discGeo = new THREE.CircleGeometry(1.55, 64);
    const discMat = new THREE.MeshBasicMaterial({
        color: 0x00D4FF,
        transparent: true,
        opacity: 0.04,
        blending: THREE.AdditiveBlending
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -1.19;
    socleGroup.add(disc);

    scene.add(socleGroup);

    // ── Lights ───────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x00D4FF, 0.2));
    const keyLight = new THREE.PointLight(0x00D4FF, 2, 20);
    keyLight.position.set(3, 5, 3);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xc6a87c, 1, 15);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // ── CB Node Points (office locations) ────────────────────────
    const nodePositions = [
        { lat: 46.1, lon: -1.1, label: 'La Rochelle', isHome: true },
        { lat: 40.7, lon: -74.0, label: 'New York' },
        { lat: 51.5, lon: -0.12, label: 'London' },
        { lat: 35.7, lon: 139.7, label: 'Tokyo' },
        { lat: 25.2, lon: 55.3, label: 'Dubai' },
        { lat: -33.9, lon: 151.2, label: 'Sydney' },
        { lat: 48.8, lon: 2.35, label: 'Paris' },
        { lat: 1.35, lon: 103.8, label: 'Singapore' },
    ];

    const R_NODES = 1.45; // Slightly above globe surface

    function latLonToXYZ(lat, lon, r) {
        const phi   = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -r * Math.sin(phi) * Math.cos(theta),
             r * Math.cos(phi),
             r * Math.sin(phi) * Math.sin(theta)
        );
    }

    const nodesGroup = new THREE.Group();
    const nodeXYZs = [];

    nodePositions.forEach((pos, i) => {
        const xyz = latLonToXYZ(pos.lat, pos.lon, R_NODES);
        nodeXYZs.push(xyz);

        // Node dot
        const dotGeo = new THREE.SphereGeometry(0.04, 8, 8);
        const dotMat = new THREE.MeshBasicMaterial({
            color: pos.isHome ? 0xc6a87c : 0x00D4FF
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(xyz);
        nodesGroup.add(dot);

        // Halo pulse
        const haloGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const haloMat = new THREE.MeshBasicMaterial({
            color: pos.isHome ? 0xc6a87c : 0x00D4FF,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(xyz);
        halo.userData.phase = i * 0.8;
        nodesGroup.add(halo);
    });

    // Connection curves (all connect to La Rochelle = index 0)
    nodeXYZs.forEach((from, i) => {
        if (i === 0) return;
        const to = nodeXYZs[0];
        const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(R_NODES + 0.8 + Math.random() * 0.6);

        const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
        const points = curve.getPoints(40);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
            color: i % 2 === 0 ? 0x00D4FF : 0xc6a87c,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        nodesGroup.add(new THREE.Line(lineGeo, lineMat));
    });

    // ── GLB Loading ──────────────────────────────────────────────
    let globeModel = null;

    function loadGlobe() {
        // Three.js r128: GLTFLoader must be loaded separately
        // Since we use CDN, attempt dynamic load
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
        script.onload = () => {
            const loader = new THREE.GLTFLoader();
            loader.load(
                './assets/models/glowing_globe_3d_model.glb',
                (gltf) => {
                    globeModel = gltf.scene;

                    // Extract base color texture and apply to our shader
                    globeModel.traverse((child) => {
                        if (child.isMesh) {
                            const origMat = child.material;
                            if (origMat.map) {
                                holoGlobeMaterial.uniforms.uBaseColor.value = origMat.map;
                            }
                            child.material = holoGlobeMaterial;
                        }
                    });

                    // Scale and center
                    const box = new THREE.Box3().setFromObject(globeModel);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const scale = 2.8 / Math.max(size.x, size.y, size.z);
                    globeModel.scale.setScalar(scale);
                    globeModel.position.sub(center.multiplyScalar(scale));

                    scene.add(globeModel);
                    scene.add(nodesGroup);

                    console.log('[Globe] GLB loaded successfully (518K verts, 1M tris)');
                },
                undefined,
                (err) => {
                    console.warn('[Globe] GLB load failed, using fallback sphere:', err);
                    buildFallback();
                }
            );
        };
        script.onerror = () => buildFallback();
        document.head.appendChild(script);
    }

    function buildFallback() {
        const sphereGeo = new THREE.SphereGeometry(1.3, 64, 64);
        globeModel = new THREE.Mesh(sphereGeo, holoGlobeMaterial);
        scene.add(globeModel);
        scene.add(nodesGroup);
    }

    // If GLTFLoader already loaded (from a previous script), use it directly
    if (THREE.GLTFLoader) {
        const loader = new THREE.GLTFLoader();
        loader.load(
            './assets/models/glowing_globe_3d_model.glb',
            (gltf) => {
                globeModel = gltf.scene;
                globeModel.traverse((child) => {
                    if (child.isMesh) {
                        if (child.material.map) {
                            holoGlobeMaterial.uniforms.uBaseColor.value = child.material.map;
                        }
                        child.material = holoGlobeMaterial;
                    }
                });
                const box = new THREE.Box3().setFromObject(globeModel);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const scale = 2.8 / Math.max(size.x, size.y, size.z);
                globeModel.scale.setScalar(scale);
                globeModel.position.sub(center.multiplyScalar(scale));
                scene.add(globeModel);
                scene.add(nodesGroup);
            },
            undefined,
            () => buildFallback()
        );
    } else {
        loadGlobe();
    }

    // ── Scroll binding ───────────────────────────────────────────
    let scrollProgress = 0;

    ScrollTrigger.create({
        trigger: containerSelector,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
            scrollProgress = self.progress;
            holoGlobeMaterial.uniforms.uScrollProg.value = scrollProgress;
        }
    });

    // HUD animations
    ScrollTrigger.create({
        trigger: containerSelector,
        start: 'top 60%',
        once: true,
        onEnter: () => {
            gsap.to('#globe-hud-label', { opacity: 0.7, duration: 0.8, ease: 'power2.out' });
            gsap.to('#globe-hud-title', { opacity: 1, duration: 1, delay: 0.2, ease: 'power2.out' });
            gsap.to('#globe-node-synch', { opacity: 0.5, duration: 0.6, delay: 0.5 });

            // Counter animations
            const stats = [
                { id: '#globe-stat-offices', target: 3000 },
                { id: '#globe-stat-countries', target: 49 },
                { id: '#globe-stat-years', target: 118 }
            ];
            stats.forEach((s, i) => {
                gsap.to(s.id, { opacity: 1, duration: 0.8, delay: i * 0.2, ease: 'power2.out' });
                const numEl = document.querySelector(s.id + ' div:first-child');
                if (numEl) {
                    let obj = { val: 0 };
                    gsap.to(obj, {
                        val: s.target,
                        duration: 2,
                        delay: i * 0.15,
                        ease: 'power2.out',
                        onUpdate: () => {
                            numEl.textContent = Math.floor(obj.val).toLocaleString('fr-FR');
                        }
                    });
                }
            });
        }
    });

    // ── Mouse parallax ───────────────────────────────────────────
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    document.addEventListener('mousemove', (e) => {
        targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.3;
        targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.5;
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

        holoGlobeMaterial.uniforms.uTime.value = t;

        // Smooth mouse follow
        currentRotX += (targetRotX - currentRotX) * 0.04;
        currentRotY += (targetRotY - currentRotY) * 0.04;

        if (globeModel) {
            globeModel.rotation.y = t * 0.06 + scrollProgress * Math.PI * 0.5 + currentRotY;
            globeModel.rotation.x = currentRotX;
        }

        // Sync nodes rotation with globe
        nodesGroup.rotation.y = t * 0.06 + scrollProgress * Math.PI * 0.5 + currentRotY;
        nodesGroup.rotation.x = currentRotX;

        // Pulse halos
        nodesGroup.traverse((child) => {
            if (child.userData.phase !== undefined) {
                const s = 1.0 + 0.35 * Math.sin(t * 2.5 + child.userData.phase);
                child.scale.setScalar(s);
                if (child.material && child.material.opacity !== undefined) {
                    child.material.opacity = 0.12 + 0.18 * Math.sin(t * 2.5 + child.userData.phase);
                }
            }
        });

        // Animate lights
        keyLight.position.x = Math.sin(t * 0.4) * 5;
        keyLight.position.z = Math.cos(t * 0.3) * 5;

        renderer.render(scene, camera);
    }
    animate();
}

window.initStoryGlobe = initStoryGlobe;
