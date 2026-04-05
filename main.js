import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// ─── LENIS ────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ─── SCENE ────────────────────────────────────────────
class ChocolateScene {
    constructor() {
        this.canvas  = document.querySelector('#main-canvas');
        this.W       = window.innerWidth;
        this.H       = window.innerHeight;
        this.mouse   = { x: 0, y: 0 };
        this.time    = 0;
        this.scrollP = 0;

        this.renderer = new THREE.WebGLRenderer({
            canvas:    this.canvas,
            antialias: true,
            alpha:     false,
        });
        this.renderer.setSize(this.W, this.H);
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

        // Physically-based rendering for realism
        this.renderer.toneMapping             = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure     = 1.1;
        this.renderer.shadowMap.enabled       = true;
        this.renderer.shadowMap.type          = THREE.PCFSoftShadowMap;

        this.scene  = new THREE.Scene();
        // Warm sky color — NOT a sphere — just a color gradient via background
        this.scene.background = new THREE.Color(0xf5e6d0);
        // Subtle depth fog matching the sky
        this.scene.fog = new THREE.FogExp2(0xede0c8, 0.007);

        this.camera = new THREE.PerspectiveCamera(55, this.W / this.H, 0.1, 1200);
        this.camera.position.set(0, 8, 35);
        this.camera.lookAt(0, 0, 0);

        this.loader = new THREE.TextureLoader();

        this._buildLights();
        this._buildGround();
        this._buildRiver();
        this._buildWaterfall();
        this._buildParticles();
        this._buildImagePlanes();
        this._bindScroll();
        this._bindMouse();
        this._bindResize();
        this._loop();
    }

    _tex(path, cb) {
        const t = this.loader.load(path, cb);
        return t;
    }

    _buildLights() {
        // Soft, warm ambient — not overpowering
        this.scene.add(new THREE.AmbientLight(0xfff8f0, 0.8));

        // Main sun — warm directional with shadows
        this.sun = new THREE.DirectionalLight(0xfff0d8, 3.5);
        this.sun.position.set(40, 80, 30);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(2048, 2048);
        this.sun.shadow.camera.near = 1;
        this.sun.shadow.camera.far  = 400;
        this.sun.shadow.camera.left  = -100;
        this.sun.shadow.camera.right =  100;
        this.sun.shadow.camera.top   =  100;
        this.sun.shadow.camera.bottom = -100;
        this.sun.shadow.bias = -0.001;
        this.scene.add(this.sun);

        // Soft fill from opposite side — bounce light off cream ground
        const fill = new THREE.DirectionalLight(0xffe0b2, 1.2);
        fill.position.set(-30, 20, -20);
        this.scene.add(fill);

        // Warm golden rim highlight
        this.rimLight = new THREE.PointLight(0xffc06a, 6, 150);
        this.rimLight.position.set(-25, 15, 5);
        this.scene.add(this.rimLight);
    }

    _buildGround() {
        // Photo-realistic ground using the mountain image as a large backdrop card
        const tex = this.loader.load('/assets/chocolate_mountain.png', (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
        });
        // Large background plane — positioned far back, no displacement spikes
        const bgMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
        const bgGeo = new THREE.PlaneGeometry(400, 300);
        this.bgPlane = new THREE.Mesh(bgGeo, bgMat);
        this.bgPlane.position.set(0, 30, -450);
        this.scene.add(this.bgPlane);

        // Smooth ground plane — uses a subtle normal map trick with the texture
        const groundTex = this.loader.load('/assets/chocolate_mountain.png', (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(6, 6);
        });
        const geo = new THREE.PlaneGeometry(500, 900, 4, 4);
        const mat = new THREE.MeshStandardMaterial({
            color:     0xc9936a,
            normalMap: groundTex,
            roughness: 0.95,
            metalness: 0.0,
        });
        this.ground = new THREE.Mesh(geo, mat);
        this.ground.rotation.x   = -Math.PI / 2;
        this.ground.position.set(0, -14, -200);
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    _buildRiver() {
        // HIGH RESOLUTION river geometry for smooth waves
        const geo = new THREE.PlaneGeometry(38, 700, 80, 400);

        // ── Custom GLSL shader: procedural liquid chocolate ──
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime:      { value: 0 },
                uLight:     { value: new THREE.Vector3(40, 80, 30) },
                uCamera:    { value: new THREE.Vector3(0, 8, 35) },
                uSunColor:  { value: new THREE.Color(0xfff0d8) },
                uChocDark:  { value: new THREE.Color(0x3d2012) },
                uChocMid:   { value: new THREE.Color(0x7b3f1e) },
                uChocLight: { value: new THREE.Color(0xb86030) },
            },
            vertexShader: /* glsl */`
                uniform float uTime;
                varying vec3 vWorldPos;
                varying vec3 vNormal;
                varying float vWaveHeight;

                // Classic 2D noise helper
                vec2 hash2(vec2 p) {
                    p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
                    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
                }
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    vec2 u = f*f*(3.0-2.0*f);
                    return mix(mix(dot(hash2(i+vec2(0,0)),f-vec2(0,0)),
                                  dot(hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),
                               mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)),
                                  dot(hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
                }

                void main() {
                    vec3 pos = position;

                    // Time-based downward flow coordinate
                    float flowY = pos.y - uTime * 6.0;

                    // Wide primary viscous ripples — slower, thick chocolate
                    float wave1 = sin(pos.x * 0.18 + flowY * 0.12) * 0.9;
                    float wave2 = sin(pos.x * 0.35 - flowY * 0.09 + 1.3) * 0.5;

                    // Narrower surface turbulence
                    float wave3 = sin(pos.x * 0.7  + flowY * 0.22) * 0.25;
                    float wave4 = cos(pos.x * 0.5  + flowY * 0.3  + 0.8) * 0.18;

                    // Fine noise ripples for realism
                    float nz = noise(vec2(pos.x * 0.4, flowY * 0.15)) * 0.35;

                    // Edge effect — river banks are flatter
                    float edgeMask = 1.0 - smoothstep(0.0, 1.0, abs(pos.x / 19.0));

                    float h = (wave1 + wave2 + wave3 + wave4 + nz) * edgeMask;
                    pos.z = h;
                    vWaveHeight = h;

                    // Compute per-vertex normal from finite differences
                    float eps = 0.4;
                    float flowY2 = (pos.y + eps) - uTime * 6.0;
                    float hNext = (sin((pos.x) * 0.18 + flowY2 * 0.12) * 0.9
                                 + sin((pos.x) * 0.35 - flowY2 * 0.09 + 1.3) * 0.5) * edgeMask;
                    float dHdY = (hNext - h) / eps;

                    float hRight = (sin((pos.x+eps)*0.18 + flowY*0.12)*0.9
                                  + sin((pos.x+eps)*0.35 - flowY*0.09+1.3)*0.5) * edgeMask;
                    float dHdX = (hRight - h) / eps;

                    vNormal   = normalize(vec3(-dHdX, -dHdY, 1.0));
                    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: /* glsl */`
                uniform vec3  uLight;
                uniform vec3  uCamera;
                uniform vec3  uSunColor;
                uniform vec3  uChocDark;
                uniform vec3  uChocMid;
                uniform vec3  uChocLight;

                varying vec3  vWorldPos;
                varying vec3  vNormal;
                varying float vWaveHeight;

                void main() {
                    vec3 N = normalize(vNormal);
                    vec3 L = normalize(uLight - vWorldPos);
                    vec3 V = normalize(uCamera - vWorldPos);
                    vec3 H = normalize(L + V);

                    // --- Chocolate base color (depth-based) ---
                    float depth = clamp((vWaveHeight + 1.2) / 2.4, 0.0, 1.0);
                    vec3 chocColor = mix(uChocDark, uChocMid, depth);
                    chocColor = mix(chocColor, uChocLight, depth * depth * 0.4);

                    // --- Diffuse ---
                    float diff = max(dot(N, L), 0.0);
                    vec3  diffuse = chocColor * (0.5 + diff * 0.5);

                    // --- Specular (glossy liquid surface) ---
                    float spec = pow(max(dot(N, H), 0.0), 180.0);
                    vec3  specular = uSunColor * spec * 2.2;

                    // --- Fresnel rim glow (warm caramel on edges) ---
                    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 4.0);
                    vec3  rim = vec3(0.85, 0.52, 0.18) * fresnel * 0.7;

                    // --- Ambient ---
                    vec3 ambient = chocColor * 0.35;

                    vec3 color = ambient + diffuse + specular + rim;

                    // Slight gamma correction for cinematic look
                    color = pow(color, vec3(0.9));

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.FrontSide,
        });

        this.river    = new THREE.Mesh(geo, mat);
        this.riverMat = mat;
        this.river.rotation.x = -Math.PI / 2;
        this.river.position.set(0, -9, -220);
        this.scene.add(this.river);
    }

    _buildWaterfall() {
        // Procedural GLSL falling-chocolate shader — no photo repetition
        const geo = new THREE.PlaneGeometry(12, 90, 20, 120);

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime:      { value: 0 },
                uChocDark:  { value: new THREE.Color(0x2a1208) },
                uChocMid:   { value: new THREE.Color(0x6b3318) },
                uHighlight: { value: new THREE.Color(0xfff0d8) },
            },
            transparent: true,
            vertexShader: /* glsl */`
                uniform float uTime;
                varying vec2  vUv;
                varying float vHeight;

                // Value noise
                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
                float vnoise(vec2 p) {
                    vec2 i = floor(p); vec2 f = fract(p);
                    vec2 u = f*f*(3.0-2.0*f);
                    return mix(mix(hash(i),           hash(i+vec2(1,0)), u.x),
                               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
                }

                void main() {
                    vUv = uv;
                    vec3 pos = position;

                    // Flowing downward coordinate
                    float flow = uv.y - uTime * 1.8;

                    // Thin vertical streaks — like falling chocolate threads
                    float streak = sin(uv.x * 18.0 + vnoise(vec2(uv.x * 6.0, flow * 2.0)) * 3.0) * 0.4;

                    // Width taper — wider at top, narrower at base
                    float taper = 1.0 - uv.y * 0.4;

                    pos.z = streak * taper * 0.8;
                    vHeight = streak;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: /* glsl */`
                uniform vec3  uChocDark;
                uniform vec3  uChocMid;
                uniform vec3  uHighlight;
                uniform float uTime;

                varying vec2  vUv;
                varying float vHeight;

                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

                void main() {
                    // Chocolate color from dark core to mid
                    float t = clamp(vHeight * 0.5 + 0.5, 0.0, 1.0);
                    vec3 choc = mix(uChocDark, uChocMid, t);

                    // Vertical streak highlights — thin white gloss lines
                    float flow = vUv.y - uTime * 1.8;
                    float gloss = pow(max(0.0, sin(vUv.x * 18.0 + flow * 5.0)), 20.0);
                    choc += uHighlight * gloss * 0.6;

                    // Edge transparency — falls naturally at sides
                    float edgeFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(0.0, 0.12, 1.0 - vUv.x);
                    // Top & bottom fade
                    float endFade  = smoothstep(0.0, 0.08, vUv.y) * smoothstep(0.0, 0.05, 1.0 - vUv.y);

                    gl_FragColor = vec4(choc, edgeFade * endFade * 0.92);
                }
            `,
            side: THREE.DoubleSide,
        });

        this.waterfall    = new THREE.Mesh(geo, mat);
        this.waterfallMat = mat;
        this.waterfall.position.set(0, 20, -148);
        this.scene.add(this.waterfall);
    }

    _buildParticles() {
        // Fine cocoa mist — very small, sparse, natural
        const geo   = new THREE.BufferGeometry();
        const count = 1500;
        const pos   = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = Math.random() * 30 - 5;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 350;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            color:       0xc9993a,
            size:        0.12,
            transparent: true,
            opacity:     0.35,
            depthWrite:  false,
        });

        this.particles = new THREE.Points(geo, mat);
        this.scene.add(this.particles);
    }

    _buildImagePlanes() {
        // White-key shader: discards near-white/cream pixels so images float without a card border
        const whiteKeyVert = /* glsl */`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const whiteKeyFrag = /* glsl */`
            uniform sampler2D uTex;
            uniform float     uThresh;   // white-key threshold
            uniform float     uSoftness; // edge softness
            varying vec2 vUv;

            void main() {
                vec4  col  = texture2D(uTex, vUv);
                // Luminance of the pixel
                float lum  = dot(col.rgb, vec3(0.299, 0.587, 0.114));
                // How "colourful" is the pixel (distance from grey axis)
                float sat  = length(col.rgb - vec3(lum));
                // Key out: high luminance AND low saturation = background
                float bg   = smoothstep(uThresh - uSoftness, uThresh + uSoftness, lum)
                           * smoothstep(0.0, 0.08, 1.0 - sat * 4.0);
                float alpha = 1.0 - bg;
                if (alpha < 0.05) discard;
                gl_FragColor = vec4(col.rgb, alpha);
            }
        `;

        const configs = [
            { file: '/assets/chocolate_bar.png',
              pos: [-20, 3,  -28], rot: [0.03, -0.28, 0.03], scale: 15, thresh: 0.88 },
            { file: '/assets/cocoa_beans.png',
              pos: [ 18, 2,  -55], rot: [0.0,   0.20, -0.02], scale: 13, thresh: 0.85 },
            // Our Story
            { file: '/assets/maker.png',
              pos: [ 16, 4,  -88], rot: [0.02, -0.14, 0.02], scale: 16, thresh: 0.92 },
            // Craft
            { file: '/assets/chocolate_bar.png',
              pos: [-17, 3, -125], rot: [0.0,   0.22,  0.0],  scale: 13, thresh: 0.88 },
            // Flavors
            { file: '/assets/flavors.png',
              pos: [ 20, 2, -165], rot: [0.0,  -0.18,  0.01], scale: 17, thresh: 0.87 },
            // Ingredients
            { file: '/assets/cocoa_beans.png',
              pos: [-18, 3, -210], rot: [0.03,  0.25, -0.02], scale: 14, thresh: 0.85 },
            // Promise
            { file: '/assets/maker.png',
              pos: [ 18, 4, -260], rot: [0.01, -0.20,  0.02], scale: 15, thresh: 0.92 },
            // CTA
            { file: '/assets/flavors.png',
              pos: [-20, 2, -310], rot: [0.0,   0.18,  0.0],  scale: 14, thresh: 0.87 },
        ];

        this.imagePlanes = [];
        configs.forEach((c, i) => {
            const tex = this.loader.load(c.file);
            tex.colorSpace = THREE.SRGBColorSpace;

            const mat = new THREE.ShaderMaterial({
                uniforms: {
                    uTex:      { value: tex },
                    uThresh:   { value: c.thresh },
                    uSoftness: { value: 0.06 },
                },
                vertexShader:   whiteKeyVert,
                fragmentShader: whiteKeyFrag,
                transparent:    true,
                depthWrite:     false,
                side:           THREE.DoubleSide,
            });

            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(c.scale, c.scale), mat
            );
            mesh.position.set(...c.pos);
            mesh.rotation.set(...c.rot);
            mesh.userData = { basePos: [...c.pos], baseRot: [...c.rot], phase: i * 1.3 };
            this.scene.add(mesh);
            this.imagePlanes.push(mesh);
        });
    }

    _bindScroll() {
        const sections = [...document.querySelectorAll('.scroll-section')];
        const stations = ['THE ORIGIN', 'OUR STORY', 'THE CRAFT', 'THE FLAVOURS', 'THE ESSENCE', 'THE PROMISE', 'THE ARRIVAL', 'THE ARRIVAL'];
        const dots     = [...document.querySelectorAll('.dot')];
        const stLabel  = document.getElementById('station-label');

        ScrollTrigger.create({
            trigger: '#scroll-root',
            start:   'top top',
            end:     'bottom bottom',
            scrub:   true,
            onUpdate: ({ progress: p }) => {
                this.scrollP = p;

                // Camera travels full scene: Z from +35 (hero) to -380 (final CTA)
                this.camera.position.z  = 35  - p * 415;
                this.camera.position.y  = 8   - p * 16 + Math.sin(p * Math.PI * 2) * 1.5;
                this.camera.rotation.x  = -0.04 - p * 0.14;

                const idx = Math.min(Math.floor(p * 8), 7);
                dots.forEach((d, i) => d.classList.toggle('active', i === idx));
                if (stLabel) stLabel.textContent = stations[Math.min(idx, stations.length - 1)];
            },
        });

        sections.forEach((sec) => {
            const wrap = sec.querySelector('.label-wrap');
            if (!wrap) return;
            ScrollTrigger.create({
                trigger:     sec,
                start:       'top 68%',
                end:         'bottom 32%',
                onEnter:     () => wrap.classList.add('visible'),
                onLeave:     () => wrap.classList.remove('visible'),
                onEnterBack: () => wrap.classList.add('visible'),
                onLeaveBack: () => wrap.classList.remove('visible'),
            });
        });
    }

    _bindMouse() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
            this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });
    }

    _bindResize() {
        window.addEventListener('resize', () => {
            this.W = window.innerWidth;
            this.H = window.innerHeight;
            this.camera.aspect = this.W / this.H;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.W, this.H);
        });
    }

    _loop() {
        this.time += 0.012;

        // Drive the procedural river shader
        if (this.riverMat) {
            this.riverMat.uniforms.uTime.value = this.time;
            this.riverMat.uniforms.uCamera.value.set(
                this.camera.position.x,
                this.camera.position.y,
                this.camera.position.z,
            );
        }

        // Drive procedural waterfall shader
        if (this.waterfallMat) {
            this.waterfallMat.uniforms.uTime.value = this.time;
        }

        // Very subtle, natural mouse parallax
        gsap.to(this.camera.rotation, {
            y: this.mouse.x * -0.03,
            duration: 2.5,
            overwrite: 'auto',
        });

        // Image planes float gently — natural bobbing
        this.imagePlanes.forEach((plane) => {
            const { basePos, baseRot, phase } = plane.userData;
            plane.position.y = basePos[1] + Math.sin(this.time * 0.5 + phase) * 0.6;
            plane.rotation.y = baseRot[1] + this.mouse.x * 0.04 + Math.sin(this.time * 0.3 + phase) * 0.015;
            plane.rotation.x = baseRot[0] + this.mouse.y * 0.025;
        });

        // Rim light pulses very slightly — like sunlight through leaves
        this.rimLight.intensity = 6 + Math.sin(this.time * 0.4) * 0.5;

        // Fine cocoa mist drifts
        this.particles.rotation.y += 0.0002;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this._loop());
    }
}

// ─── LOADER ───────────────────────────────────────────
window.addEventListener('load', () => {
    const brand  = document.querySelector('.loader-brand');
    const bar    = document.querySelector('.loader-progress');
    const loader = document.getElementById('loader');

    setTimeout(() => brand?.classList.add('show'), 200);

    let w = 0;
    const iv = setInterval(() => {
        w = Math.min(w + 3, 100);
        if (bar) bar.style.width = w + '%';
        if (w >= 100) {
            clearInterval(iv);
            setTimeout(() => {
                if (loader) loader.style.opacity = '0';
                setTimeout(() => {
                    if (loader) loader.style.display = 'none';
                    new ChocolateScene();
                }, 1200);
            }, 400);
        }
    }, 35);
});

// ─── FORM ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('waitlist-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        if (btn) {
            btn.textContent = '✓ You\'re on the list!';
            btn.style.background = 'linear-gradient(135deg, #6aaf6a, #3a8a3a)';
        }
    });
});
