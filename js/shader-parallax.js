/**
 * shader-parallax.js
 * ─────────────────────────────────────────────────────────────────
 * MISSION 2 — Animated JPEG with depth-based parallax
 *
 * Takes a static JPEG and makes it immersive:
 *   1. Loads the image onto a fullscreen quad
 *   2. Generates a programmatic depth map (luminance-based)
 *   3. Applies subtle parallax displacement driven by scroll + mouse
 *   4. Optional Ken Burns (slow zoom + pan via GSAP)
 *   5. Subtle water/foliage animation via noise
 *
 * CONSTRAINT: "No static JPEG" — every image MUST be animated.
 *
 * DEPENDENCIES: Three.js r128, GSAP ScrollTrigger
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

/**
 * initParallaxImage(containerSelector, options)
 * @param {string} containerSelector - CSS selector for the section
 * @param {object} options
 *   - imageUrl: path to the JPEG/PNG
 *   - depthMode: 'auto' (luminance-based) or 'map' (external depth map URL)
 *   - depthMapUrl: URL of grayscale depth map (if depthMode === 'map')
 *   - parallaxStrength: float (default 0.04)
 *   - kenBurns: boolean (default true)
 *   - waterEffect: boolean (default true, subtle water ripple on lower half)
 */
function initParallaxImage(containerSelector, options = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const inner = container.querySelector('.seq-inner') || container;

    const {
        imageUrl        = '',
        depthMode       = 'auto',
        depthMapUrl     = null,
        parallaxStrength = 0.04,
        kenBurns        = true,
        waterEffect     = true
    } = options;

    if (!imageUrl) {
        console.warn('[Parallax] No imageUrl provided');
        return;
    }

    // ── Canvas ───────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute; inset:0; width:100%; height:100%;';
    inner.appendChild(canvas);

    // ── Three.js Setup ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setSize(inner.offsetWidth, inner.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // ── Parallax Shader ──────────────────────────────────────────
    const parallaxMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uImage:          { value: null },
            uDepthMap:       { value: null },
            uTime:           { value: 0 },
            uMouse:          { value: new THREE.Vector2(0.5, 0.5) },
            uScrollOffset:   { value: 0 },
            uParallaxStr:    { value: parallaxStrength },
            uKenBurnsZoom:   { value: 1.0 },
            uKenBurnsPan:    { value: new THREE.Vector2(0.0, 0.0) },
            uWaterEnabled:   { value: waterEffect ? 1.0 : 0.0 },
            uResolution:     { value: new THREE.Vector2(inner.offsetWidth, inner.offsetHeight) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D uImage;
            uniform sampler2D uDepthMap;
            uniform float uTime;
            uniform vec2  uMouse;
            uniform float uScrollOffset;
            uniform float uParallaxStr;
            uniform float uKenBurnsZoom;
            uniform vec2  uKenBurnsPan;
            uniform float uWaterEnabled;
            uniform vec2  uResolution;
            varying vec2  vUv;

            // Simple noise function for water effect
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }
            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            void main() {
                // Apply Ken Burns zoom + pan
                vec2 uv = (vUv - 0.5) / uKenBurnsZoom + 0.5 + uKenBurnsPan;

                // Sample depth (auto-generated or from map)
                float depth = texture2D(uDepthMap, uv).r;

                // Parallax displacement based on depth + mouse/scroll
                vec2 mouseOffset = (uMouse - 0.5) * uParallaxStr * depth;
                float scrollDisp = uScrollOffset * uParallaxStr * 0.5 * depth;

                vec2 displaced = uv + mouseOffset + vec2(0.0, scrollDisp);

                // Water ripple effect on lower portion
                if (uWaterEnabled > 0.5 && vUv.y < 0.45) {
                    float waterDepth = smoothstep(0.45, 0.2, vUv.y);
                    float ripple = noise(vUv * 15.0 + uTime * 0.3) * 0.003 * waterDepth;
                    float wave = sin(vUv.x * 30.0 + uTime * 0.8) * 0.001 * waterDepth;
                    displaced += vec2(ripple, wave);
                }

                // Sample final color
                vec4 col = texture2D(uImage, displaced);

                // Subtle vignette
                vec2 vig = vUv * (1.0 - vUv);
                float vigFactor = pow(vig.x * vig.y * 15.0, 0.3);
                col.rgb *= vigFactor;

                // Gentle color grade (warm highlights)
                col.rgb = pow(col.rgb, vec3(0.95, 0.97, 1.02));

                gl_FragColor = col;
            }
        `,
        transparent: false
    });

    // Fullscreen quad
    const quad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        parallaxMaterial
    );
    scene.add(quad);

    // ── Load image + generate depth map ──────────────────────────
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(imageUrl, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        parallaxMaterial.uniforms.uImage.value = texture;

        if (depthMode === 'map' && depthMapUrl) {
            // Load external depth map
            textureLoader.load(depthMapUrl, (depthTex) => {
                parallaxMaterial.uniforms.uDepthMap.value = depthTex;
            });
        } else {
            // Generate depth map from luminance
            generateAutoDepthMap(texture);
        }
    });

    /**
     * generateAutoDepthMap(texture)
     * Creates a grayscale depth estimation from the source image:
     *   - Sky (bright, upper area) → far (dark in depth map)
     *   - Ground/buildings (lower, darker) → near (bright in depth map)
     *   - Blurred to smooth transitions
     */
    function generateAutoDepthMap(srcTexture) {
        const img = srcTexture.image;
        const w = Math.min(img.width, 512);  // Downsample for performance
        const h = Math.min(img.height, 512);

        const offCanvas = document.createElement('canvas');
        offCanvas.width  = w;
        offCanvas.height = h;
        const ctx = offCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const depthData = new Uint8ClampedArray(w * h * 4);

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;

                // Luminance
                const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

                // Vertical gradient: top = far (0), bottom = near (255)
                const verticalDepth = (y / h) * 180;

                // Invert luminance: bright sky = far, dark ground = near
                const lumDepth = (1.0 - lum / 255) * 120;

                // Combine
                let depth = Math.min(255, verticalDepth + lumDepth * 0.5);

                depthData[i]     = depth;
                depthData[i + 1] = depth;
                depthData[i + 2] = depth;
                depthData[i + 3] = 255;
            }
        }

        // Simple box blur (2 passes for smooth result)
        const blurRadius = 8;
        boxBlur(depthData, w, h, blurRadius);
        boxBlur(depthData, w, h, blurRadius);

        const depthImageData = new ImageData(depthData, w, h);
        ctx.putImageData(depthImageData, 0, 0);

        const depthTexture = new THREE.CanvasTexture(offCanvas);
        depthTexture.minFilter = THREE.LinearFilter;
        depthTexture.magFilter = THREE.LinearFilter;
        parallaxMaterial.uniforms.uDepthMap.value = depthTexture;
    }

    /**
     * boxBlur — simple in-place box blur on RGBA data
     */
    function boxBlur(data, w, h, radius) {
        const temp = new Uint8ClampedArray(data.length);

        // Horizontal pass
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let sum = 0, count = 0;
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = Math.max(0, Math.min(w - 1, x + dx));
                    sum += data[(y * w + nx) * 4];
                    count++;
                }
                const val = sum / count;
                const i = (y * w + x) * 4;
                temp[i] = temp[i + 1] = temp[i + 2] = val;
                temp[i + 3] = 255;
            }
        }

        // Vertical pass
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                let sum = 0, count = 0;
                for (let dy = -radius; dy <= radius; dy++) {
                    const ny = Math.max(0, Math.min(h - 1, y + dy));
                    sum += temp[(ny * w + x) * 4];
                    count++;
                }
                const val = sum / count;
                const i = (y * w + x) * 4;
                data[i] = data[i + 1] = data[i + 2] = val;
                data[i + 3] = 255;
            }
        }
    }

    // ── Ken Burns animation ──────────────────────────────────────
    if (kenBurns) {
        // Slow zoom from 1.0 → 1.08 + gentle pan
        gsap.to(parallaxMaterial.uniforms.uKenBurnsZoom, {
            value: 1.08,
            ease: 'none',
            scrollTrigger: {
                trigger: containerSelector,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
        gsap.to(parallaxMaterial.uniforms.uKenBurnsPan.value, {
            x: 0.015,
            y: -0.01,
            ease: 'none',
            scrollTrigger: {
                trigger: containerSelector,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // ── Scroll binding ───────────────────────────────────────────
    ScrollTrigger.create({
        trigger: containerSelector,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
            parallaxMaterial.uniforms.uScrollOffset.value = self.progress * 2 - 1;
        }
    });

    // ── Mouse tracking ───────────────────────────────────────────
    document.addEventListener('mousemove', (e) => {
        parallaxMaterial.uniforms.uMouse.value.set(
            e.clientX / window.innerWidth,
            1.0 - e.clientY / window.innerHeight
        );
    });

    // ── Resize ───────────────────────────────────────────────────
    window.addEventListener('resize', () => {
        const w = inner.offsetWidth;
        const h = inner.offsetHeight;
        renderer.setSize(w, h);
        parallaxMaterial.uniforms.uResolution.value.set(w, h);
    });

    // ── Render loop ──────────────────────────────────────────────
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        parallaxMaterial.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    }
    animate();
}

window.initParallaxImage = initParallaxImage;
