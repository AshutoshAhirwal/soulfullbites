import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

function createSoftCircleTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.65)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

class ChocolateScene {
  constructor() {
    this.canvas = document.querySelector('#main-canvas');
    if (!this.canvas) return;

    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    this.scrollP = 0;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(this.W, this.H);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5e6d0);
    this.scene.fog = new THREE.FogExp2(0xf5e6d0, 0.009);

    this.camera = new THREE.PerspectiveCamera(55, this.W / this.H, 0.1, 1200);
    this.camera.position.set(0, 8, 35);
    this.camera.lookAt(0, 0, 0);

    this.loader = new THREE.TextureLoader();
    this.softCircleTexture = createSoftCircleTexture();

    this.buildLights();
    this.buildGround();
    this.buildParticles();
    this.buildBreakingBar();
    this.buildImagePlanes();
    this.bindScroll();
    this.bindMouse();
    this.bindResize();
    this.loop();
  }

  buildLights() {
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

  buildGround() {
    const bgTexture = this.loader.load('/assets/chocolate_mountain.png', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture, transparent: true, opacity: 0.85, depthWrite: false });
    const bgGeometry = new THREE.PlaneGeometry(500, 350);
    this.bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
    this.bgPlane.position.set(0, 40, -480);
    this.scene.add(this.bgPlane);

    const groundTexture = this.loader.load('/assets/chocolate_mountain.png', (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);
    });
    const geometry = new THREE.PlaneGeometry(650, 1100, 4, 4);
    const material = new THREE.MeshStandardMaterial({
      color: 0xbd855a,
      normalMap: groundTexture,
      roughness: 0.85,
      metalness: 0.1,
    });
    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.set(0, -8.8, -240);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  buildParticles() {
    const bokehGeo = new THREE.BufferGeometry();
    const bokehPos = new Float32Array(70 * 3);
    const bokehSize = new Float32Array(70);
    for (let index = 0; index < 70; index += 1) {
      bokehPos[index * 3] = (Math.random() - 0.5) * 70;
      bokehPos[index * 3 + 1] = Math.random() * 30 - 5;
      bokehPos[index * 3 + 2] = (Math.random() - 0.5) * 120 + 15;
      bokehSize[index] = 1 + Math.random() * 2.5;
    }
    bokehGeo.setAttribute('position', new THREE.BufferAttribute(bokehPos, 3));
    bokehGeo.setAttribute('size', new THREE.BufferAttribute(bokehSize, 1));

    this.bokeh = new THREE.Points(bokehGeo, new THREE.PointsMaterial({
      map: this.softCircleTexture,
      size: 2.2,
      transparent: true,
      opacity: 0.18,
      color: 0xffe0b2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    this.scene.add(this.bokeh);

    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(2000 * 3);
    for (let index = 0; index < 2000; index += 1) {
      particlePos[index * 3] = (Math.random() - 0.5) * 130;
      particlePos[index * 3 + 1] = Math.random() * 45 - 12;
      particlePos[index * 3 + 2] = (Math.random() - 0.5) * 450;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    this.particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
      color: 0xc9993a,
      size: 0.08,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    }));
    this.scene.add(this.particles);
  }

  buildBreakingBar() {
    const texture = this.loader.load('/assets/chocolate_bar.png');
    texture.colorSpace = THREE.SRGBColorSpace;

    const leftGeometry = new THREE.PlaneGeometry(8, 16);
    for (let index = 0; index < leftGeometry.attributes.uv.array.length; index += 2) {
      leftGeometry.attributes.uv.array[index] *= 0.5;
    }
    this.barL = new THREE.Mesh(leftGeometry, new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }));

    const rightGeometry = new THREE.PlaneGeometry(8, 16);
    for (let index = 0; index < rightGeometry.attributes.uv.array.length; index += 2) {
      rightGeometry.attributes.uv.array[index] = 0.5 + rightGeometry.attributes.uv.array[index] * 0.5;
    }
    this.barR = new THREE.Mesh(rightGeometry, new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }));

    this.barGroup = new THREE.Group();
    this.barGroup.add(this.barL, this.barR);
    this.barGroup.position.set(16, 4, -88);
    this.barGroup.rotation.y = -0.18;
    this.scene.add(this.barGroup);

    const dripTexture = this.loader.load('/assets/melting_chocolate_drip_1775406441172.png');
    this.drip = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: dripTexture },
        uTime: { value: 0 },
        uProgress: { value: 0 },
      },
      vertexShader: `
        uniform float uProgress;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float taper = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
          pos.y *= mix(1.0, 0.5, uProgress) * taper;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
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
      side: THREE.DoubleSide,
    }));
    this.barGroup.add(this.drip);

    this.drops = [];
    for (let index = 0; index < 4; index += 1) {
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0x3d1208,
          roughness: 0.05,
          metalness: 0.1,
          emissive: 0x220000,
          emissiveIntensity: 0.2,
        }),
      );
      drop.visible = false;
      this.barGroup.add(drop);
      this.drops.push(drop);
    }

    const crumbGeometry = new THREE.BufferGeometry();
    const crumbPos = new Float32Array(50 * 3);
    const crumbVel = new Float32Array(50 * 3);
    for (let index = 0; index < 50; index += 1) {
      crumbVel[index * 3] = (Math.random() - 0.5) * 0.2;
      crumbVel[index * 3 + 1] = (Math.random() - 0.5) * 0.2;
      crumbVel[index * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    crumbGeometry.setAttribute('position', new THREE.BufferAttribute(crumbPos, 3));
    this.crumbs = new THREE.Points(crumbGeometry, new THREE.PointsMaterial({ color: 0x2d1208, size: 0.15 }));
    this.crumbs.userData = { vel: crumbVel };
    this.crumbs.visible = false;
    this.barGroup.add(this.crumbs);
  }

  buildImagePlanes() {
    const circleVert = `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `;
    const circleFrag = `
      uniform sampler2D uTex;
      varying vec2 vUv;
      void main() {
        vec4 tex = texture2D(uTex, vUv);
        float dist = distance(vUv, vec2(0.5));
        float alpha = smoothstep(0.5, 0.42, dist);
        if (alpha < 0.05) discard;
        float shine = pow(1.0 - dist * 2.0, 2.0) * 0.4;
        gl_FragColor = vec4(tex.rgb + shine, tex.a * alpha);
      }
    `;

    const configs = [
      { file: '/assets/chocolate_bar.png', pos: [-22, 3, -28], rot: [0.03, -0.35, 0.05], scale: 16 },
      { file: '/assets/cocoa_beans.png', pos: [20, 2, -55], rot: [0.0, 0.25, -0.05], scale: 13 },
      { file: '/assets/chocolate_bar.png', pos: [-19, 3, -125], rot: [0.0, 0.28, 0.02], scale: 14 },
      { file: '/assets/flavors.png', pos: [22, 2, -170], rot: [0.0, -0.22, 0.03], scale: 20 },
      { file: '/assets/cocoa_beans.png', pos: [-20, 3, -220], rot: [0.03, 0.30, -0.05], scale: 15 },
      { file: '/assets/maker.png', pos: [21, 4, -270], rot: [0.01, -0.25, 0.03], scale: 16 },
      { file: '/assets/flavors.png', pos: [-22, 2, -320], rot: [0.0, 0.22, 0.02], scale: 15 },
    ];

    this.imagePlanes = [];
    this.shadows = [];

    configs.forEach((config, index) => {
      const texture = this.loader.load(config.file);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.ShaderMaterial({
        uniforms: { uTex: { value: texture } },
        vertexShader: circleVert,
        fragmentShader: circleFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(config.scale, config.scale), material);
      mesh.position.set(...config.pos);
      mesh.rotation.set(...config.rot);
      mesh.userData = { basePos: [...config.pos], baseRot: [...config.rot], phase: index * 1.5 };
      this.scene.add(mesh);
      this.imagePlanes.push(mesh);

      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(config.scale * 0.9, config.scale * 0.9),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.28,
          alphaMap: this.softCircleTexture,
        }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(config.pos[0], -8.8, config.pos[2]);
      this.scene.add(shadow);
      this.shadows.push(shadow);
    });
  }

  bindScroll() {
    const sections = [...document.querySelectorAll('.scroll-section')];
    const stations = ['THE ORIGIN', 'OUR STORY', 'THE CRAFT', 'THE FLAVOURS', 'THE ESSENCE', 'THE PROMISE', 'THE ARRIVAL', 'THE ARRIVAL'];
    const dots = [...document.querySelectorAll('.dot')];
    const stationLabel = document.getElementById('station-label');

    ScrollTrigger.create({
      trigger: '#scroll-root',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: ({ progress }) => {
        this.scrollP = progress;
        this.camera.position.z = 35 - progress * 435;
        this.camera.position.y = 8 - progress * 14 + Math.sin(progress * Math.PI * 3) * 1.1;
        this.camera.rotation.x = -0.04 - progress * 0.16;
        const index = Math.min(Math.floor(progress * 8), 7);
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
        if (stationLabel) {
          stationLabel.textContent = stations[index];
        }

        sections.forEach((section, sectionIndex) => {
          const heading = section.querySelector('h1, h2');
          if (heading && sectionIndex === index) {
            gsap.to(heading, {
              x: this.mouse.x * -25,
              y: this.mouse.y * -15,
              duration: 1.5,
              ease: 'power2.out',
            });
          }
        });
      },
    });

    sections.forEach((section) => {
      const wrap = section.querySelector('.label-wrap');
      if (!wrap) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 68%',
        end: 'bottom 32%',
        onEnter: () => wrap.classList.add('visible'),
        onLeave: () => wrap.classList.remove('visible'),
        onEnterBack: () => wrap.classList.add('visible'),
        onLeaveBack: () => wrap.classList.remove('visible'),
      });
    });
  }

  bindMouse() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  bindResize() {
    window.addEventListener('resize', () => {
      this.W = window.innerWidth;
      this.H = window.innerHeight;
      this.camera.aspect = this.W / this.H;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.W, this.H);
    });
  }

  loop() {
    this.time += 0.01;

    gsap.to(this.camera.rotation, {
      y: this.mouse.x * -0.05,
      x: -0.04 - this.scrollP * 0.16 + this.mouse.y * -0.03,
      z: Math.sin(this.time * 0.1) * 0.01,
      duration: 2.2,
    });

    this.imagePlanes.forEach((plane, index) => {
      const { basePos, baseRot, phase } = plane.userData;
      const bob = Math.sin(this.time * 0.4 + phase) * 0.8;
      plane.position.y = basePos[1] + bob;
      plane.rotation.y = baseRot[1] + this.mouse.x * 0.12 + Math.sin(this.time * 0.25 + phase) * 0.05;
      plane.rotation.x = baseRot[0] + this.mouse.y * 0.08;

      const shadow = this.shadows[index];
      if (shadow) {
        shadow.position.x = plane.position.x + this.mouse.x * 1.5;
        shadow.scale.setScalar(1 + bob * 0.18);
        shadow.material.opacity = 0.3 - bob * 0.1;
      }
    });

    if (this.barL) {
      const isCraft = this.scrollP > 0.2 && this.scrollP < 0.4;
      const isArrival = this.scrollP > 0.85;

      let breakProgress = 0;
      if (isCraft) breakProgress = gsap.utils.clamp(0, 1, (this.scrollP - 0.22) * 8);
      if (isArrival) breakProgress = gsap.utils.clamp(0, 1, 1 - (this.scrollP - 0.88) * 8);

      this.barL.position.x = -4 - breakProgress * 4.5;
      this.barR.position.x = 4 + breakProgress * 4.5;
      this.barL.rotation.z = -breakProgress * 0.3;
      this.barR.rotation.z = breakProgress * 0.3;

      if (isArrival) {
        this.barGroup.rotation.y = -0.18 + (this.scrollP - 0.88) * 2;
        this.barGroup.position.z = -88 + (this.scrollP - 0.88) * 120;
      }

      if (breakProgress > 0.01 && breakProgress < 0.95) {
        this.drip.visible = true;
        this.drip.scale.set(breakProgress * 8.5, 5.5, 1);
        this.drip.material.uniforms.uProgress.value = breakProgress;
        this.drip.material.uniforms.uTime.value = this.time;
      } else {
        this.drip.visible = false;
      }

      this.drops.forEach((drop, index) => {
        if (breakProgress > 0.25) {
          drop.visible = true;
          const dropT = (this.time * 2.2 + index * 1.8) % 6;
          drop.position.y = 2 - dropT * 4.5;
          drop.position.x = (Math.random() - 0.5) * breakProgress * 4.5;
          drop.scale.set(0.8, 1.2, 0.8);
          if (drop.position.y < -12) drop.visible = false;
        } else {
          drop.visible = false;
        }
      });

      if (breakProgress > 0.1 && breakProgress < 0.3) {
        this.crumbs.visible = true;
        const positions = this.crumbs.geometry.attributes.position.array;
        const velocities = this.crumbs.userData.vel;
        for (let index = 0; index < 50; index += 1) {
          positions[index * 3] += velocities[index * 3] * 1.5;
          positions[index * 3 + 1] += velocities[index * 3 + 1] * 1.5;
          positions[index * 3 + 2] += velocities[index * 3 + 2] * 1.5;
        }
        this.crumbs.geometry.attributes.position.needsUpdate = true;
      } else if (breakProgress < 0.05) {
        this.crumbs.visible = false;
        const positions = this.crumbs.geometry.attributes.position.array;
        positions.fill(0);
        this.crumbs.geometry.attributes.position.needsUpdate = true;
      }
    }

    this.rimLight.intensity = 8 + Math.sin(this.time * 0.3) * 1.5;
    this.particles.rotation.y += 0.0001;
    if (this.bokeh) {
      this.bokeh.rotation.y -= 0.0002;
      this.bokeh.position.y = Math.sin(this.time * 0.15) * 3;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
  }
}

export function startHomeExperience() {
  const brand = document.querySelector('.loader-brand');
  const bar = document.querySelector('.loader-progress');
  const loader = document.getElementById('loader');

  setTimeout(() => brand?.classList.add('show'), 200);

  let width = 0;
  const interval = setInterval(() => {
    width = Math.min(width + 3, 100);
    if (bar) {
      bar.style.width = `${width}%`;
    }

    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
        }

        setTimeout(() => {
          if (loader) {
            loader.style.display = 'none';
          }

          try {
            new ChocolateScene();
          } catch (error) {
            console.error('Home scene failed to initialize', error);
            const canvas = document.getElementById('main-canvas');
            if (canvas) {
              canvas.style.display = 'none';
            }
          }
        }, 1200);
      }, 400);
    }
  }, 35);
}
