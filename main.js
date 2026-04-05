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
        // Deep, warm cocoa fog for seamless horizon blending
        this.scene.fog = new THREE.FogExp2(0xf5e6d0, 0.009);

        this.camera = new THREE.PerspectiveCamera(55, this.W / this.H, 0.1, 1200);
        this.camera.position.set(0, 8, 35);
        this.camera.lookAt(0, 0, 0);

        this.loader = new THREE.TextureLoader();

        this._buildLights();
        this._buildGround();
        this._buildRiver();
        this._buildParticles();
        this._buildBreakingBar();
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
        this.scene.add(new THREE.AmbientLight(0xfff8f0, 0.9));
        this.sun = new THREE.DirectionalLight(0xfff0d8, 4.2);
        this.sun.position.set(50, 90, 40);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(2048, 2048);
        this.sun.shadow.bias = -0.0005;
        this.scene.add(this.sun);

        const fill = new THREE.DirectionalLight(0xffe0b2, 1.6);
        fill.position.set(-40, 20, -30);
        this.scene.add(fill);

        this.rimLight = new THREE.PointLight(0xffc06a, 8, 220);
        this.rimLight.position.set(-35, 18, 12);
        this.scene.add(this.rimLight);
    }

    _buildGround() {
        const tex = this.loader.load('/assets/chocolate_mountain.png', (t) => { t.colorSpace = THREE.SRGBColorSpace; });
        // Use depthWrite:false and additive/transparent for seamless sky blending
        const bgMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false });
        const bgGeo = new THREE.PlaneGeometry(500, 350);
        this.bgPlane = new THREE.Mesh(bgGeo, bgMat);
        this.bgPlane.position.set(0, 40, -480);
        this.scene.add(this.bgPlane);

        const groundTex = this.loader.load('/assets/chocolate_mountain.png', (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(8, 8);
        });
        const geo = new THREE.PlaneGeometry(650, 1100, 4, 4);
        const mat = new THREE.MeshStandardMaterial({
            color:     0xbd855a,
            normalMap: groundTex,
            roughness: 0.85,
            metalness: 0.1,
        });
        this.ground = new THREE.Mesh(geo, mat);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.set(0, -15, -240);
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
    }

    _buildRiver() {
        const geo = new THREE.PlaneGeometry(45, 850, 160, 600);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime:      { value: 0 },
                uMouse:     { value: new THREE.Vector2(0, 0) },
                uLight:     { value: new THREE.Vector3(50, 90, 40) },
                uCamera:    { value: new THREE.Vector3(0, 8, 35) },
                uSunColor:  { value: new THREE.Color(0xfff0d8) },
                uChocDark:  { value: new THREE.Color(0x281005) },
                uChocMid:   { value: new THREE.Color(0x6b3318) },
                uChocLight: { value: new THREE.Color(0xc96a3a) },
                uSSS:       { value: new THREE.Color(0x851a08) },
            },
            vertexShader: /* glsl */`
                uniform float uTime;
                uniform vec2  uMouse;
                varying vec3  vWorldPos;
                varying vec3  vNormal;
                varying float vWaveHeight;
                varying float vDepthBlur;

                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
                float noise(vec2 p) {
                    vec2 i = floor(p); vec2 f = fract(p);
                    vec2 u = f*f*(3.0-2.0*f);
                    return mix(mix(hash(i),           hash(i+vec2(1,0)), u.x),
                               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
                }
                float fbm(vec2 p) {
                    float v = 0.0; float a = 0.5;
                    for (int i=0; i<3; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
                    return v;
                }

                void main() {
                    vec3 pos = position;
                    float flow = pos.y - uTime * 6.8;
                    float wave1 = sin(pos.x * 0.14 + flow * 0.1) * 1.3;
                    float wave2 = cos(pos.x * 0.35 - flow * 0.07 + 2.0) * 0.5;
                    float dtl   = fbm(vec2(pos.x * 0.3, flow * 0.18)) * 1.5;
                    float distM = distance(pos.xy, uMouse * vec2(25.0, 120.0) + vec2(0, pos.y));
                    float ripple = exp(-distM * 0.08) * 3.5;
                    float h = (wave1 + wave2 + dtl - ripple);
                    float edge = 1.0 - smoothstep(0.0, 1.4, abs(pos.x / 22.0));
                    pos.z = h * edge;
                    vWaveHeight = pos.z;
                    float eps = 0.6;
                    float hR = sin((pos.x+eps)*0.14 + flow*0.1)*1.3 + cos((pos.x+eps)*0.35 - flow*0.07+2.0)*0.5;
                    float hU = sin(pos.x*0.14 + (flow+eps)*0.1)*1.3 + cos(pos.x*0.35 - (flow+eps)*0.07+2.0)*0.5;
                    vNormal = normalize(vec3(-(hR - h)/eps, -(hU - h)/eps, 1.0));
                    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
                    vDepthBlur = clamp(distance(vWorldPos, uCamera) * 0.0035, 0.0, 1.0);
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
                uniform vec3  uSSS;
                varying vec3  vWorldPos;
                varying vec3  vNormal;
                varying float vWaveHeight;
                varying float vDepthBlur;

                void main() {
                    vec3 N = normalize(vNormal);
                    vec3 L = normalize(uLight - vWorldPos);
                    vec3 V = normalize(uCamera - vWorldPos);
                    vec3 H = normalize(L + V);
                    float hFac = clamp((vWaveHeight + 2.0) / 4.0, 0.0, 1.0);
                    vec3 base = mix(uChocDark, uChocMid, hFac);
                    base = mix(base, uChocLight, hFac * hFac * 0.6);
                    float sssFac = pow(max(0.0, 1.0 - hFac), 4.5);
                    base += uSSS * sssFac * 0.55;
                    float fr = pow(1.0 - max(dot(N, V), 0.0), 3.0);
                    vec3 skyRef = vec3(0.95, 0.8, 0.5) * fr * 1.0;
                    float spec = pow(max(dot(N, H), 0.0), 160.0);
                    vec3 specular = uSunColor * spec * 4.2; // Intensify gloss

                    vec3 color = base * 0.4 + base * max(0.0, dot(N, L)) + specular + skyRef;
                    float aberration = vDepthBlur * 0.18;
                    color.r = mix(color.r, 1.0, aberration * 0.25);
                    
                    // Slightly warm the shadows
                    color += vec3(0.08, 0.04, 0.02) * (1.0 - max(0.0, dot(N, L)));
                    
                    color = pow(color, vec3(0.82));
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        });
        this.river    = new THREE.Mesh(geo, mat);
        this.riverMat = mat;
        this.river.rotation.x = -Math.PI / 2;
        this.river.position.set(0, -9.8, -250);
        this.scene.add(this.river);
    }

    // Waterfall removed as requested

    _buildParticles() {
        const bokehGeo = new THREE.BufferGeometry();
        const bokehPos = new Float32Array(70 * 3);
        const bokehSiz = new Float32Array(70);
        for (let i=0; i<70; i++) {
            bokehPos[i*3]   = (Math.random()-0.5)*70;
            bokehPos[i*3+1] = Math.random()*30-5;
            bokehPos[i*3+2] = (Math.random()-0.5)*120 + 15;
            bokehSiz[i]     = 1.0 + Math.random() * 2.5;
        }
        bokehGeo.setAttribute('position', new THREE.BufferAttribute(bokehPos, 3));
        bokehGeo.setAttribute('size', new THREE.BufferAttribute(bokehSiz, 1));
        
        const bokehTex = this.loader.load('https://threejs.org/examples/textures/sprites/circle.png');
        this.bokeh = new THREE.Points(bokehGeo, new THREE.PointsMaterial({
            map: bokehTex, size: 2.2, transparent: true, opacity: 0.18,
            color: 0xffe0b2, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        this.scene.add(this.bokeh);

        const geoP = new THREE.BufferGeometry();
        const posP = new Float32Array(2000 * 3);
        for (let i=0; i<2000; i++) {
            posP[i*3]   = (Math.random()-0.5)*130;
            posP[i*3+1] = Math.random()*45-12;
            posP[i*3+2] = (Math.random()-0.5)*450;
        }
        geoP.setAttribute('position', new THREE.BufferAttribute(posP, 3));
        this.particles = new THREE.Points(geoP, new THREE.PointsMaterial({
            color: 0xc9993a, size: 0.08, transparent: true, opacity: 0.25, depthWrite: false
        }));
        this.scene.add(this.particles);
    }

    _buildBreakingBar() {
        const tex = this.loader.load('/assets/chocolate_bar.png');
        tex.colorSpace = THREE.SRGBColorSpace;
        
        // Two halves using UV trickery
        const geoL = new THREE.PlaneGeometry(8, 16);
        const posL = geoL.attributes.uv.array;
        for (let i=0; i<posL.length; i+=2) posL[i] *= 0.5; // Left half of texture
        const matL = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        this.barL = new THREE.Mesh(geoL, matL);
        
        const geoR = new THREE.PlaneGeometry(8, 16);
        const posR = geoR.attributes.uv.array;
        for (let i=0; i<posR.length; i+=2) { posR[i] = 0.5 + posR[i]*0.5; } // Right half of texture
        const matR = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
        this.barR = new THREE.Mesh(geoR, matR);

        this.barGroup = new THREE.Group();
        this.barGroup.add(this.barL, this.barR);
        this.barGroup.position.set(16, 4, -88);
        this.barGroup.rotation.y = -0.18;
        this.scene.add(this.barGroup);

        // Melted Drip Connector with high-fidelity texture
        const dripTex = this.loader.load('/assets/melted_chocolate_drip_texture.png');
        const dripGeo = new THREE.PlaneGeometry(1, 1);
        const dripMat = new THREE.ShaderMaterial({
            uniforms: { 
                uTex: { value: dripTex },
                uTime: { value: 0 }, 
                uProgress: { value: 0 } 
            },
            vertexShader: /* glsl */`
                uniform float uProgress;
                varying vec2 vUv;
                void main() { 
                    vUv = uv; 
                    vec3 pos = position;
                    // Taper the ends to meet the bar halves
                    float taper = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
                    pos.y *= mix(1.0, 0.5, uProgress) * taper;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); 
                }
            `,
            fragmentShader: /* glsl */`
                uniform sampler2D uTex;
                uniform float uTime;
                uniform float uProgress;
                varying vec2 vUv;
                void main() {
                    vec2 flowUv = vUv;
                    flowUv.y += uTime * 0.4;
                    vec4 tex = texture2D(uTex, flowUv);
                    float edge = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
                    if (tex.a < 0.1) discard;
                    gl_FragColor = vec4(tex.rgb * 0.8, tex.a * edge * (1.0 - uProgress * 0.5));
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        this.drip = new THREE.Mesh(dripGeo, dripMat);
        this.barGroup.add(this.drip);

        // Falling Drops with metaball feel
        this.drops = [];
        for (let i=0; i<4; i++) {
            const d = new THREE.Mesh(
                new THREE.SphereGeometry(0.24, 12, 12),
                new THREE.MeshStandardMaterial({ 
                    color: 0x3d1208, 
                    roughness: 0.05,
                    metalness: 0.1,
                    emissive: 0x220000,
                    emissiveIntensity: 0.2
                })
            );
            d.visible = false;
            this.barGroup.add(d);
            this.drops.push(d);
        }

        // Crumb burst
        const cGeo = new THREE.BufferGeometry();
        const cPos = new Float32Array(50 * 3);
        const cVel = new Float32Array(50 * 3);
        for (let i=0; i<50; i++) {
            cVel[i*3] = (Math.random()-0.5)*0.2;
            cVel[i*3+1] = (Math.random()-0.5)*0.2;
            cVel[i*3+2] = (Math.random()-0.5)*0.2;
        }
        cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
        this.crumbs = new THREE.Points(cGeo, new THREE.PointsMaterial({ color: 0x2d1208, size: 0.15 }));
        this.crumbs.userData = { vel: cVel };
        this.barGroup.add(this.crumbs);
        this.crumbs.visible = false;
    }

    _buildImagePlanes() {
        const circleVert = /* glsl */`
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `;
        const circleFrag = /* glsl */`
            uniform sampler2D uTex;
            varying vec2 vUv;
            void main() {
                vec4 tex = texture2D(uTex, vUv);
                float dist = distance(vUv, vec2(0.5));
                float alpha = smoothstep(0.5, 0.42, dist);
                if (alpha < 0.05) discard;
                
                // 3D Bubble lighting effect
                float shine = pow(1.0 - dist * 2.0, 2.0) * 0.4;
                gl_FragColor = vec4(tex.rgb + shine, tex.a * alpha);
            }
        `;

        const configs = [
            { file: '/assets/chocolate_bar.png', pos: [-22, 3,  -28], rot: [0.03, -0.35, 0.05], scale: 16 },
            { file: '/assets/cocoa_beans.png',   pos: [ 20, 2,  -55], rot: [0.0,   0.25, -0.05], scale: 13 },
            // Removed Maker at -88 (Replaced by BreakingBar)
            { file: '/assets/chocolate_bar.png', pos: [-19, 3, -125], rot: [0.0,   0.28,  0.02], scale: 14 },
            { file: '/assets/flavors.png',       pos: [ 22, 2, -170], rot: [0.0,  -0.22,  0.03], scale: 20 },
            { file: '/assets/cocoa_beans.png',   pos: [-20, 3, -220], rot: [0.03,  0.30, -0.05], scale: 15 },
            { file: '/assets/maker.png',         pos: [ 21, 4, -270], rot: [0.01, -0.25,  0.03], scale: 16 },
            { file: '/assets/flavors.png',       pos: [-22, 2, -320], rot: [0.0,   0.22,  0.02], scale: 15 },
        ];

        this.imagePlanes = [];
        this.shadows = [];
        configs.forEach((c, i) => {
            const tex = this.loader.load(c.file);
            tex.colorSpace = THREE.SRGBColorSpace;
            const mat = new THREE.ShaderMaterial({
                uniforms: { uTex: { value: tex } },
                vertexShader: circleVert, fragmentShader: circleFrag,
                transparent: true, depthWrite: false, side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(c.scale, c.scale), mat);
            mesh.position.set(...c.pos); mesh.rotation.set(...c.rot);
            mesh.userData = { basePos: [...c.pos], baseRot: [...c.rot], phase: i * 1.5 };
            this.scene.add(mesh);
            this.imagePlanes.push(mesh);

            const shdGeo = new THREE.PlaneGeometry(c.scale * 0.9, c.scale * 0.9);
            const shdMat = new THREE.MeshBasicMaterial({
                color: 0x000000, transparent: true, opacity: 0.28,
                alphaMap: this.loader.load('https://threejs.org/examples/textures/sprites/circle.png'),
            });
            const shd = new THREE.Mesh(shdGeo, shdMat);
            shd.rotation.x = -Math.PI / 2;
            shd.position.set(c.pos[0], -8.8, c.pos[2]);
            this.scene.add(shd);
            this.shadows.push(shd);
        });
    }

    _bindScroll() {
        const sections = [...document.querySelectorAll('.scroll-section')];
        const stations = ['THE ORIGIN', 'OUR STORY', 'THE CRAFT', 'THE FLAVOURS', 'THE ESSENCE', 'THE PROMISE', 'THE ARRIVAL', 'THE ARRIVAL'];
        const dots     = [...document.querySelectorAll('.dot')];
        const stLabel  = document.getElementById('station-label');

        ScrollTrigger.create({
            trigger: '#scroll-root',
            start:   'top top', end: 'bottom bottom', scrub: true,
            onUpdate: ({ progress: p }) => {
                this.scrollP = p;
                this.camera.position.z = 35 - p * 435;
                this.camera.position.y = 8  - p * 14 + Math.sin(p * Math.PI * 3.0) * 1.1;
                this.camera.rotation.x = -0.04 - p * 0.16;
                const idx = Math.min(Math.floor(p * 8), 7);
                dots.forEach((d, i) => d.classList.toggle('active', i === idx));
                if (stLabel) stLabel.textContent = stations[idx];
                
                sections.forEach((sec, i) => {
                    const h1 = sec.querySelector('h1, h2');
                    if (h1 && i === idx) {
                        gsap.to(h1, {
                            x: this.mouse.x * -25,
                            y: this.mouse.y * -15,
                            duration: 1.5,
                            ease: 'power2.out'
                        });
                    }
                });
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
        this.time += 0.010;

        if (this.riverMat) {
            this.riverMat.uniforms.uTime.value = this.time;
            this.riverMat.uniforms.uMouse.value.set(this.mouse.x, this.mouse.y);
            this.riverMat.uniforms.uCamera.value.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        }

        gsap.to(this.camera.rotation, {
            y: this.mouse.x * -0.05,
            x: -0.04 - this.scrollP * 0.16 + this.mouse.y * -0.03,
            z: Math.sin(this.time * 0.1) * 0.01,
            duration: 2.2
        });

        this.imagePlanes.forEach((plane, i) => {
            const { basePos, baseRot, phase } = plane.userData;
            const bob = Math.sin(this.time * 0.4 + phase) * 0.8;
            plane.position.y = basePos[1] + bob;
            plane.rotation.y = baseRot[1] + this.mouse.x * 0.12 + Math.sin(this.time * 0.25 + phase) * 0.05;
            plane.rotation.x = baseRot[0] + this.mouse.y * 0.08;
            
            if (this.shadows[i]) {
                const s = this.shadows[i];
                s.position.x = plane.position.x + this.mouse.x * 1.5;
                s.scale.setScalar(1.0 + bob * 0.18);
                s.material.opacity = 0.30 - bob * 0.1;
            }
        });

        // ── BAR BREAK LOGIC ──
        if (this.barL) {
            const isCraft = (this.scrollP > 0.2 && this.scrollP < 0.4);
            const isArrival = (this.scrollP > 0.85);

            let breakP = 0;
            if (isCraft) breakP = gsap.utils.clamp(0, 1, (this.scrollP - 0.22) * 8.0);
            if (isArrival) breakP = gsap.utils.clamp(0, 1, 1.0 - (this.scrollP - 0.88) * 8.0); // Re-unite

            this.barL.position.x = -4.0 - breakP * 4.5;
            this.barR.position.x =  4.0 + breakP * 4.5;
            this.barL.rotation.z = -breakP * 0.3;
            this.barR.rotation.z =  breakP * 0.3;
            
            // Final Reveal Spin
            if (isArrival) {
                this.barGroup.rotation.y = -0.18 + (this.scrollP - 0.88) * 2.0;
                this.barGroup.position.z = -88 + (this.scrollP - 0.88) * 120;
            }

            if (breakP > 0.01 && breakP < 0.95) {
                this.drip.visible = true;
                this.drip.scale.set(breakP * 8.5, 5.5, 1.0);
                this.drip.material.uniforms.uProgress.value = breakP;
                this.drip.material.uniforms.uTime.value = this.time;
            } else {
                this.drip.visible = false;
            }

            // Falling Drops
            this.drops.forEach((d, i) => {
                if (breakP > 0.25) {
                    d.visible = true;
                    const dropT = (this.time * 2.2 + i * 1.8) % 6.0;
                    d.position.y = 2.0 - dropT * 4.5;
                    d.position.x = (Math.random()-0.5) * breakP * 4.5;
                    d.scale.set(0.8, 1.2, 0.8); // Stretching
                    if (d.position.y < -12) d.visible = false;
                } else {
                    d.visible = false;
                }
            });

            // Crumb animation
            if (breakP > 0.1 && breakP < 0.3) {
                this.crumbs.visible = true;
                const cPos = this.crumbs.geometry.attributes.position.array;
                const cVel = this.crumbs.userData.vel;
                for (let i=0; i<50; i++) {
                    cPos[i*3] += cVel[i*3] * 1.5;
                    cPos[i*3+1] += cVel[i*3+1] * 1.5;
                    cPos[i*3+2] += cVel[i*3+2] * 1.5;
                }
                this.crumbs.geometry.attributes.position.needsUpdate = true;
            } else if (breakP < 0.05) {
                this.crumbs.visible = false;
                const cPos = this.crumbs.geometry.attributes.position.array;
                for (let i=0; i<cPos.length; i++) cPos[i] = 0;
                this.crumbs.geometry.attributes.position.needsUpdate = true;
            }
        }

        this.rimLight.intensity = 8 + Math.sin(this.time * 0.3) * 1.5;
        this.particles.rotation.y += 0.0001;
        if (this.bokeh) {
            this.bokeh.rotation.y -= 0.0002;
            this.bokeh.position.y = Math.sin(this.time * 0.15) * 3.0;
        }

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
