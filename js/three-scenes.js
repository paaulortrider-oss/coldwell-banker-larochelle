/**
 * three-scenes.js
 * ─────────────────────────────────────────────────────────────────
 * Module 3 : Scènes WebGL Three.js
 *  - Scène 0 : Fond particules global (canvas #webgl-canvas)
 *  - Scène 1 : Ville holographique La Rochelle (#canvas-ville)
 *  - Scène 2 : Globe international CB (#canvas-globe)
 * ─────────────────────────────────────────────────────────────────
 * Dépendances CDN (déjà chargées dans le HTML) :
 *   - Three.js r128
 *   - GSAP + ScrollTrigger
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

// ─── VÉRIFICATION WEBGL ──────────────────────────────────────────
function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        return false;
    }
}

// Si WebGL non disponible : fallback silencieux
if (!isWebGLAvailable()) {
    console.warn('[CB3D] WebGL non disponible — mode statique activé.');
} else {
    // Lancer toutes les scènes après le chargement complet
    window.addEventListener('load', () => {
        setTimeout(() => {
            initParticleBackground();
            initVilleScene();
            initGlobeScene();
        }, 2400); // Après le loader
    });
}


// ═══════════════════════════════════════════════════════════════════
//  SCÈNE 0 — FOND PARTICULES GLOBAL
//  Canvas fixe en arrière-plan (#webgl-canvas)
//  Particules dorées et cyan flottantes — effet cinématique
// ═══════════════════════════════════════════════════════════════════

function initParticleBackground() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Fond transparent

    // ── Scène + Caméra ───────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // ── Particules ───────────────────────────────────────────────
    const COUNT = window.innerWidth < 768 ? 400 : 1200; // Moins sur mobile

    // Géométrie : positions aléatoires dans une sphère
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);

    // Couleurs : 60% or, 30% cyan, 10% blanc
    const colOr   = new THREE.Color(0xc6a87c);
    const colCyan = new THREE.Color(0x00D4FF);
    const colWhite= new THREE.Color(0xffffff);

    for (let i = 0; i < COUNT; i++) {
        // Position en sphère disséminée
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 2 + Math.random() * 6;

        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Couleur
        let c;
        const rand = Math.random();
        if (rand < 0.6)       c = colOr;
        else if (rand < 0.9)  c = colCyan;
        else                  c = colWhite;

        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        sizes[i] = 0.5 + Math.random() * 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    // Shader particules : point lumineux avec halo doux
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime:       { value: 0 },
            uPixelRatio: { value: renderer.getPixelRatio() }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float uTime;
            uniform float uPixelRatio;

            void main() {
                vColor = color;
                vec3 pos = position;
                // Mouvement flottant sinusoïdal
                pos.y += sin(uTime * 0.3 + position.x * 0.5) * 0.08;
                pos.x += cos(uTime * 0.2 + position.z * 0.4) * 0.05;

                vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
                gl_Position  = projectionMatrix * mvPos;
                gl_PointSize = size * uPixelRatio * (200.0 / -mvPos.z);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;

            void main() {
                // Forme circulaire avec halo
                vec2 uv  = gl_PointCoord - 0.5;
                float d  = length(uv);
                float alpha = 1.0 - smoothstep(0.2, 0.5, d);
                if (alpha < 0.01) discard;
                gl_FragColor = vec4(vColor, alpha * 0.6);
            }
        `,
        transparent: true,
        depthWrite:  false,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // ── Parallaxe souris ─────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── Resize ───────────────────────────────────────────────────
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ── Boucle de rendu ──────────────────────────────────────────
    let clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        particleMaterial.uniforms.uTime.value = t;

        // Rotation lente + suivi souris
        particles.rotation.y = t * 0.02 + mouseX * 0.05;
        particles.rotation.x = mouseY * 0.03;

        renderer.render(scene, camera);
    }
    animate();
}


// ═══════════════════════════════════════════════════════════════════
//  SCÈNE 1 — VILLE HOLOGRAPHIQUE LA ROCHELLE
//  Canvas dédié : #canvas-ville
//  Charge holographic_city_model_3d.glb
//  Matériau wireframe cyan lumineux + rotation liée au scroll
// ═══════════════════════════════════════════════════════════════════

function initVilleScene() {
    const canvas = document.getElementById('canvas-ville');
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // ── Scène + Caméra ───────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        canvas.offsetWidth / canvas.offsetHeight,
        0.1,
        1000
    );
    camera.position.set(0, 8, 18);
    camera.lookAt(0, 0, 0);

    // ── Lumières ─────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x00D4FF, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00D4FF, 2, 30);
    pointLight1.position.set(5, 10, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xc6a87c, 1.5, 25);
    pointLight2.position.set(-8, 5, -5);
    scene.add(pointLight2);

    // ── Matériau holographique ────────────────────────────────────
    // Wireframe cyan lumineux avec shader custom
    const holoMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime:      { value: 0 },
            uCyanColor: { value: new THREE.Color(0x00D4FF) },
            uGoldColor: { value: new THREE.Color(0xc6a87c) },
            uScanY:     { value: 0.0 },   // Position de la ligne de scan
            uReveal:    { value: 0.0 }    // Progression de l'apparition (0→1)
        },
        vertexShader: `
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float uTime;

            void main() {
                vPosition = position;
                vNormal   = normal;
                vec3 pos  = position;
                // Légère vibration holographique
                pos.x += sin(uTime * 2.0 + position.y * 3.0) * 0.002;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3  uCyanColor;
            uniform vec3  uGoldColor;
            uniform float uScanY;
            uniform float uReveal;
            varying vec3  vPosition;
            varying vec3  vNormal;

            void main() {
                // Masque de révélation de bas en haut
                float reveal = smoothstep(uReveal - 0.15, uReveal, vPosition.y / 10.0 + 0.5);
                if (reveal < 0.01) discard;

                // Wireframe simulé via les arêtes
                float edge = abs(sin(vPosition.x * 8.0)) *
                             abs(sin(vPosition.z * 8.0));
                edge = smoothstep(0.85, 1.0, edge);

                // Scanline horizontale
                float scan = smoothstep(0.02, 0.0, abs(vPosition.y - uScanY * 10.0 - 5.0));

                // Couleur : cyan de base, or sur les arêtes
                vec3 col = mix(uCyanColor * 0.3, uCyanColor, edge);
                col = mix(col, uGoldColor, scan * 0.8);

                // Lueur depuis le bas
                float glow = 1.0 - smoothstep(0.0, 5.0, vPosition.y);
                col += uCyanColor * glow * 0.15;

                // Pulsation subtile
                float pulse = 0.85 + sin(uTime * 1.5) * 0.15;

                float alpha = (edge * 0.9 + 0.1 + scan * 0.5) * reveal * pulse;
                gl_FragColor = vec4(col, alpha);
            }
        `,
        transparent: true,
        depthWrite:  false,
        side:        THREE.DoubleSide,
        blending:    THREE.AdditiveBlending,
        wireframe:   false
    });

    // ── Fallback géométrique (en attendant le .glb) ──────────────
    // Représentation stylisée de La Rochelle si le .glb ne charge pas
    function buildFallbackCity() {
        const group = new THREE.Group();

        // Bâtiments principaux (boîtes de hauteur variable)
        const buildingData = [
            { x: 0,   z: 0,   w: 1.5, h: 4,   d: 1.5 },  // Tour Saint-Nicolas
            { x: 2,   z: 0,   w: 1,   h: 3.5, d: 1   },  // Tour de la Chaîne
            { x: -2,  z: 1,   w: 0.8, h: 5,   d: 0.8 },  // Cathédrale
            { x: 1,   z: 2,   w: 2,   h: 1.5, d: 3   },  // Port
            { x: -1,  z: -2,  w: 3,   h: 1,   d: 2   },  // Centre historique
            { x: 4,   z: 1,   w: 1,   h: 2,   d: 1   },
            { x: -4,  z: -1,  w: 1.2, h: 2.5, d: 1.2 },
            { x: 3,   z: -2,  w: 0.8, h: 1.8, d: 0.8 },
            { x: -3,  z: 2,   w: 1.5, h: 1.2, d: 1.5 },
            { x: 0,   z: 3,   w: 4,   h: 0.8, d: 2   },  // Quai
        ];

        buildingData.forEach(b => {
            const geo  = new THREE.BoxGeometry(b.w, b.h, b.d);
            const mesh = new THREE.Mesh(geo, holoMaterial.clone());
            mesh.position.set(b.x, b.h / 2 - 2, b.z);
            group.add(mesh);
        });

        // Grille de sol
        const gridGeo = new THREE.PlaneGeometry(20, 20, 20, 20);
        const gridMat = new THREE.MeshBasicMaterial({
            color: 0x00D4FF,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });
        const grid = new THREE.Mesh(gridGeo, gridMat);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -2;
        group.add(grid);

        return group;
    }

    // ── Chargement du .glb ────────────────────────────────────────
    let cityModel = null;

    try {
        // GLTFLoader via import dynamique (Three.js r128)
        const loader = new THREE.GLTFLoader
            ? new THREE.GLTFLoader()
            : null;

        if (loader) {
            loader.load(
                './assets/models/holographic_city_model_3d.glb',
                (gltf) => {
                    cityModel = gltf.scene;

                    // Appliquer le matériau holographique à tous les meshes
                    cityModel.traverse((child) => {
                        if (child.isMesh) {
                            child.material = holoMaterial.clone();
                        }
                    });

                    // Centrer et scaler le modèle
                    const box    = new THREE.Box3().setFromObject(cityModel);
                    const center = box.getCenter(new THREE.Vector3());
                    const size   = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale  = 12 / maxDim;

                    cityModel.scale.setScalar(scale);
                    cityModel.position.sub(center.multiplyScalar(scale));

                    scene.add(cityModel);
                },
                undefined,
                () => {
                    // Fallback si le .glb échoue
                    console.warn('[CB3D] holographic_city_model_3d.glb non trouvé — fallback géométrique');
                    const fallback = buildFallbackCity();
                    scene.add(fallback);
                    cityModel = fallback;
                }
            );
        } else {
            throw new Error('GLTFLoader non disponible');
        }
    } catch {
        const fallback = buildFallbackCity();
        scene.add(fallback);
        cityModel = fallback;
    }

    // ── Rotation liée au scroll ────────────────────────────────────
    let scrollProgress = 0;

    ScrollTrigger.create({
        trigger: '#section-ville',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
            scrollProgress = self.progress;
        }
    });

    // ── Animation scan au scroll (révélation) ────────────────────
    gsap.to(holoMaterial.uniforms.uReveal, {
        value: 1,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#section-ville',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });

    // ── Resize ───────────────────────────────────────────────────
    function resizeVille() {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', resizeVille);

    // ── Boucle de rendu ──────────────────────────────────────────
    const clock = new THREE.Clock();

    function animateVille() {
        requestAnimationFrame(animateVille);
        const t = clock.getElapsedTime();

        // Update uniforms
        if (cityModel) {
            cityModel.traverse(child => {
                if (child.isMesh && child.material.uniforms) {
                    child.material.uniforms.uTime.value  = t;
                    child.material.uniforms.uScanY.value = (t * 0.15) % 1.0;
                }
            });
            // Rotation selon scroll
            cityModel.rotation.y = scrollProgress * Math.PI * 0.6 - Math.PI * 0.1;
        }

        // Lumières animées
        pointLight1.position.x = Math.sin(t * 0.5) * 8;
        pointLight1.position.z = Math.cos(t * 0.3) * 8;

        renderer.render(scene, camera);
    }
    animateVille();
}


// ═══════════════════════════════════════════════════════════════════
//  SCÈNE 2 — GLOBE INTERNATIONAL CB
//  Canvas dédié : #canvas-globe
//  Charge glowing_globe_3d_model.glb
//  Nœuds CB animés + lignes de connexion cyan/or
// ═══════════════════════════════════════════════════════════════════

function initGlobeScene() {
    const canvas = document.getElementById('canvas-globe');
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // ── Scène + Caméra ───────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        canvas.offsetWidth / canvas.offsetHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5.5);
    camera.lookAt(0, 0, 0);

    // ── Matériau globe holographique ─────────────────────────────
    const globeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime:    { value: 0 },
            uCyan:    { value: new THREE.Color(0x00D4FF) },
            uGold:    { value: new THREE.Color(0xc6a87c) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float uTime;

            void main() {
                vNormal   = normal;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3  uCyan;
            uniform vec3  uGold;
            varying vec3  vNormal;
            varying vec3  vPosition;

            void main() {
                // Fresnel — lueur sur les bords
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float fresnel = 1.0 - dot(vNormal, viewDir);
                fresnel = pow(fresnel, 2.0);

                // Grille latitude/longitude
                float lat = abs(sin(vPosition.y * 6.0));
                float lon = abs(sin(atan(vPosition.z, vPosition.x) * 6.0));
                float grid = smoothstep(0.92, 1.0, max(lat, lon));

                // Pulsation
                float pulse = 0.7 + sin(uTime * 1.2) * 0.3;

                // Couleur finale
                vec3 col = mix(uCyan * 0.2, uCyan, fresnel);
                col = mix(col, uGold * 0.8, grid * 0.6);

                float alpha = (fresnel * 0.6 + grid * 0.5) * pulse;
                alpha = clamp(alpha, 0.0, 0.9);

                gl_FragColor = vec4(col, alpha);
            }
        `,
        transparent: true,
        depthWrite:  false,
        side:        THREE.FrontSide,
        blending:    THREE.AdditiveBlending
    });

    // ── Globe fallback (sphère si le .glb échoue) ────────────────
    function buildFallbackGlobe() {
        const group = new THREE.Group();

        // Sphère principale
        const sphereGeo = new THREE.SphereGeometry(2, 48, 48);
        const sphere    = new THREE.Mesh(sphereGeo, globeMaterial);
        group.add(sphere);

        // Anneau décoratif
        const ringGeo = new THREE.TorusGeometry(2.4, 0.015, 8, 80);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00D4FF,
            transparent: true,
            opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        return group;
    }

    // ── Nœuds CB (logos connexions internationales) ──────────────
    // Positions sur la sphère (lat/lon → xyz)
    const nodePositions = [
        { lat: 46.1,  lon: -1.1  },  // La Rochelle (centre)
        { lat: 40.7,  lon: -74.0 },  // New York
        { lat: 51.5,  lon: -0.12 },  // Londres
        { lat: 35.7,  lon: 139.7 },  // Tokyo
        { lat: 25.2,  lon: 55.3  },  // Dubaï
        { lat: -33.9, lon: 151.2 },  // Sydney
        { lat: 48.8,  lon: 2.35  },  // Paris
        { lat: 1.35,  lon: 103.8 },  // Singapour
    ];

    const R = 2.1; // Rayon légèrement > globe

    function latLonToXYZ(lat, lon, r) {
        const phi   = (90 - lat)  * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -r * Math.sin(phi) * Math.cos(theta),
             r * Math.cos(phi),
             r * Math.sin(phi) * Math.sin(theta)
        );
    }

    function buildNodes(group) {
        const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xc6a87c });

        const nodes = [];

        nodePositions.forEach((pos, i) => {
            const xyz  = latLonToXYZ(pos.lat, pos.lon, R);
            const node = new THREE.Mesh(nodeGeo, nodeMat.clone());
            node.position.copy(xyz);
            group.add(node);
            nodes.push(xyz);

            // Halo pulsant autour de chaque nœud
            const haloGeo = new THREE.SphereGeometry(0.12, 8, 8);
            const haloMat = new THREE.MeshBasicMaterial({
                color: i === 0 ? 0xc6a87c : 0x00D4FF, // Or pour La Rochelle
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending
            });
            const halo = new THREE.Mesh(haloGeo, haloMat);
            halo.position.copy(xyz);
            halo.userData.phase = Math.random() * Math.PI * 2;
            group.add(halo);
        });

        return nodes;
    }

    function buildConnections(group, nodes) {
        // Lignes de connexion courbes (quadratic bezier)
        nodes.forEach((from, i) => {
            if (i === 0) return; // Skip La Rochelle → itself
            const to = nodes[0]; // Tout connecté à La Rochelle

            // Point de contrôle au centre pour la courbe
            const mid    = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
            const height = 1.5 + Math.random() * 1.5;
            mid.normalize().multiplyScalar(R + height);

            // Courbe quadratique
            const curve  = new THREE.QuadraticBezierCurve3(from, mid, to);
            const points = curve.getPoints(40);
            const lineGeo= new THREE.BufferGeometry().setFromPoints(points);

            const lineMat = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? 0x00D4FF : 0xc6a87c,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending
            });

            const line = new THREE.Line(lineGeo, lineMat);
            group.add(line);
        });
    }

    // ── Chargement du .glb ────────────────────────────────────────
    let globeGroup = new THREE.Group();
    scene.add(globeGroup);

    try {
        const loader = new THREE.GLTFLoader
            ? new THREE.GLTFLoader()
            : null;

        if (loader) {
            loader.load(
                './assets/models/glowing_globe_3d_model.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.traverse(child => {
                        if (child.isMesh) child.material = globeMaterial.clone();
                    });

                    // Centrer le modèle
                    const box   = new THREE.Box3().setFromObject(model);
                    const center= box.getCenter(new THREE.Vector3());
                    const size  = box.getSize(new THREE.Vector3());
                    const scale = 4 / Math.max(size.x, size.y, size.z);
                    model.scale.setScalar(scale);
                    model.position.sub(center.multiplyScalar(scale));

                    globeGroup.add(model);

                    // Ajouter les nœuds et connexions
                    const nodes = buildNodes(globeGroup);
                    buildConnections(globeGroup, nodes);
                },
                undefined,
                () => {
                    // Fallback sphère
                    console.warn('[CB3D] glowing_globe_3d_model.glb non trouvé — fallback sphère');
                    const fallback = buildFallbackGlobe();
                    globeGroup.add(fallback);

                    const nodes = buildNodes(globeGroup);
                    buildConnections(globeGroup, nodes);
                }
            );
        } else {
            throw new Error('GLTFLoader non disponible');
        }
    } catch {
        const fallback = buildFallbackGlobe();
        globeGroup.add(fallback);
        const nodes = buildNodes(globeGroup);
        buildConnections(globeGroup, nodes);
    }

    // ── Rotation liée au scroll ────────────────────────────────────
    let globeScrollProgress = 0;

    ScrollTrigger.create({
        trigger: '#section-globe',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
            globeScrollProgress = self.progress;
        }
    });

    // ── Souris : inclinaison douce ────────────────────────────────
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    document.addEventListener('mousemove', (e) => {
        targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.4;
        targetRotY = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    });

    // ── Resize ───────────────────────────────────────────────────
    window.addEventListener('resize', () => {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // ── Boucle de rendu ──────────────────────────────────────────
    const clock = new THREE.Clock();

    function animateGlobe() {
        requestAnimationFrame(animateGlobe);
        const t = clock.getElapsedTime();

        // Lerp rotation souris
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        globeGroup.rotation.y = t * 0.08 + globeScrollProgress * Math.PI * 0.5 + currentRotY;
        globeGroup.rotation.x = currentRotX;

        // Update uniforms matériau
        globeGroup.traverse(child => {
            if (child.isMesh && child.material.uniforms) {
                child.material.uniforms.uTime.value = t;
            }
            // Pulsation des halos
            if (child.isMesh && child.userData.phase !== undefined) {
                const s = 1.0 + 0.3 * Math.sin(t * 2 + child.userData.phase);
                child.scale.setScalar(s);
                if (child.material.opacity !== undefined) {
                    child.material.opacity = 0.15 + 0.2 * Math.sin(t * 2 + child.userData.phase);
                }
            }
        });

        renderer.render(scene, camera);
    }
    animateGlobe();
}
