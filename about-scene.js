import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

class AboutScene {
  constructor() {
    this.canvas = document.querySelector('#about-canvas');
    if (!this.canvas) return;

    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    this.scrollP = 0;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.W, this.H);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.scene = new THREE.Scene();
    // No background, we want the page colors to show through or use alpha

    this.camera = new THREE.PerspectiveCamera(45, this.W / this.H, 0.1, 1000);
    this.camera.position.z = 20;

    this.loader = new THREE.TextureLoader();
    
    this.objects = [];
    this.init();
  }

  async init() {
    this.buildLights();
    await this.buildFloatingElements();
    this.bindEvents();
    this.loop();
  }

  buildLights() {
    const ambient = new THREE.AmbientLight(0xfff5e6, 1.2);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(10, 15, 10);
    sun.castShadow = true;
    this.scene.add(sun);

    const goldLight = new THREE.PointLight(0xc9993a, 15, 100);
    goldLight.position.set(-15, 10, 5);
    this.scene.add(goldLight);
  }

  async buildFloatingElements() {
    const textures = [
      '/assets/cocoa_beans.png',
      '/assets/chocolate_bar.png',
      '/assets/flavors.png'
    ];

    const count = 15;
    for (let i = 0; i < count; i++) {
        const tex = this.loader.load(textures[i % textures.length]);
        const material = new THREE.MeshPhysicalMaterial({
            map: tex,
            transparent: true,
            side: THREE.DoubleSide,
            roughness: 0.1,
            metalness: 0.4,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            emissive: 0x4a2c1a,
            emissiveIntensity: 0.05
        });

        let geo;
        if (i % textures.length === 1) { // chocolate bar
            geo = new THREE.BoxGeometry(2, 3.5, 0.3);
        } else if (i % textures.length === 0) { // bean
            geo = new THREE.SphereGeometry(1.2, 32, 32);
            geo.scale(1, 0.6, 0.6); // Make it bean-shaped
        } else {
            geo = new THREE.IcosahedronGeometry(i % 2 === 0 ? 0.8 : 1.2, 0);
        }

        const mesh = new THREE.Mesh(geo, material);
        
        mesh.position.set(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 60, // Wider vertical range for scroll
            (Math.random() - 0.5) * 15 - 5
        );
        
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        mesh.userData = {
            speed: 0.002 + Math.random() * 0.005,
            rotationSpeed: 0.003 + Math.random() * 0.008,
            phase: Math.random() * Math.PI * 2
        };

        this.scene.add(mesh);
        this.objects.push(mesh);
    }

    // Add some golden dust/particles
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        pPos[i*3] = (Math.random() - 0.5) * 60;
        pPos[i*3+1] = (Math.random() - 0.5) * 50;
        pPos[i*3+2] = (Math.random() - 0.5) * 40;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0xc9993a,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) - 0.5;
        this.mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });

    window.addEventListener('resize', () => {
        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.camera.aspect = this.W / this.H;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.W, this.H);
    });

    // Scroll trigger for camera movement
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
            this.scrollP = self.progress;
        }
    });

    const lenis = new Lenis();
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
  }

  loop() {
    this.time += 0.01;

    // Move objects
    this.objects.forEach(obj => {
        obj.position.y += Math.sin(this.time + obj.userData.phase) * 0.01;
        obj.rotation.x += obj.userData.rotationSpeed;
        obj.rotation.y += obj.userData.rotationSpeed * 1.1;
        
        // React to mouse
        obj.position.x += (this.mouse.x * 2 - obj.position.x * 0.05) * 0.02;
    });

    // Camera follow scroll
    this.camera.position.y = -this.scrollP * 20;

    this.particles.rotation.y += 0.001;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
  }
}

export function startAboutExperience() {
    new AboutScene();
}
