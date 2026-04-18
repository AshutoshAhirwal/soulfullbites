import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

class UniqueInspirationScene {
  constructor() {
    this.canvas = document.querySelector('#inspiration-canvas');
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

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, this.W / this.H, 0.1, 1000);
    this.camera.position.z = 30;

    this.objects = [];
    this.init();
  }

  init() {
    this.buildLights();
    this.buildFloatingCodex();
    this.bindEvents();
    this.loop();
  }

  buildLights() {
    this.scene.add(new THREE.AmbientLight(0xfff5e6, 1.5));
    
    const spot = new THREE.SpotLight(0xc9993a, 50);
    spot.position.set(20, 40, 30);
    spot.angle = 0.5;
    spot.penumbra = 0.5;
    this.scene.add(spot);

    const rim = new THREE.PointLight(0x8b5e3c, 10, 100);
    rim.position.set(-20, -10, -10);
    this.scene.add(rim);
  }

  buildFloatingCodex() {
    // Unique "Floating Pages" background
    const pageGeo = new THREE.PlaneGeometry(12, 16, 10, 10);
    const textureLoader = new THREE.TextureLoader();
    
    // We'll create a few abstract "Codex" pages flying around
    const textures = [
        '/assets/inspiration_cupcakes.png',
        '/assets/inspiration_star.png',
        '/assets/inspiration_heart.png'
    ];

    for (let i = 0; i < 8; i++) {
        const mat = new THREE.MeshPhysicalMaterial({
            map: textureLoader.load(textures[i % textures.length]),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.25,
            roughness: 0.1,
            metalness: 0.2,
            transmission: 0.5,
            thickness: 1,
        });

        const mesh = new THREE.Mesh(pageGeo, mat);
        
        // Scattered in a vertical tunnel
        mesh.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 40 - 20
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.01,
            rotY: (Math.random() - 0.5) * 0.01,
            phase: Math.random() * Math.PI * 2,
            yBase: mesh.position.y
        };

        this.scene.add(mesh);
        this.objects.push(mesh);
    }

    // Add some "liquid gold" spheres
    const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0xc9993a,
        metalness: 1,
        roughness: 0.1,
        envMapIntensity: 2
    });

    for(let i=0; i<15; i++) {
        const s = new THREE.Mesh(sphereGeo, sphereMat);
        s.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 150,
            (Math.random() - 0.5) * 30 - 10
        );
        s.scale.setScalar(0.2 + Math.random() * 0.8);
        s.userData = { phase: Math.random() * Math.PI * 2 };
        this.scene.add(s);
        this.objects.push(s);
    }
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

    ScrollTrigger.create({
        trigger: '#inspo-discovery-list',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
            this.scrollP = self.progress;
        }
    });

    const lenis = new Lenis({
        lerp: 0.05,
        smoothWheel: true
    });
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
  }

  loop() {
    this.time += 0.01;

    // Camera "Discovery" motion
    // Camera moves through the tunnel of floating pages
    this.camera.position.y = -this.scrollP * 100 + 20;
    this.camera.position.x += (this.mouse.x * 6 - this.camera.position.x) * 0.05;
    this.camera.position.z = 30 + Math.sin(this.time * 0.2) * 2;

    this.objects.forEach(obj => {
        if (obj.userData.rotX) {
            obj.rotation.x += obj.userData.rotX;
            obj.rotation.y += obj.userData.rotY;
            obj.position.x += Math.sin(this.time + obj.userData.phase) * 0.01;
        } else {
            // spheres
            obj.position.y += Math.cos(this.time + obj.userData.phase) * 0.02;
            obj.position.x += Math.sin(this.time + obj.userData.phase) * 0.02;
        }
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
  }
}

export function startInspirationExperience() {
    new UniqueInspirationScene();

    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }, 1200);
    }
}
