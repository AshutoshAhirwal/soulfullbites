import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

class FAQScene {
    constructor() {
        this.canvas = document.querySelector('#faq-canvas');
        if (!this.canvas) return;

        this.W = window.innerWidth;
        this.H = window.innerHeight;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.W, this.H);
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, this.W / this.H, 0.1, 1000);
        this.camera.position.z = 30;

        this.blocks = [];
        this.init();
    }

    init() {
        this.buildLights();
        this.buildAbstractBlocks();
        this.bindEvents();
        this.animate();
    }

    buildLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
        const p1 = new THREE.PointLight(0xc9993a, 10, 100);
        p1.position.set(10, 20, 10);
        this.scene.add(p1);
    }

    buildAbstractBlocks() {
        // Floating blocks representing 'Knowledge Pillars'
        const geo = new THREE.BoxGeometry(2, 6, 2);
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0x8b5e3c,
            metalness: 0.1,
            roughness: 0.2,
            transmission: 0.5,
            thickness: 2,
            transparent: true,
            opacity: 0.3
        });

        for (let i = 0; i < 10; i++) {
            const pillar = new THREE.Mesh(geo, mat.clone());
            pillar.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 20 - 10
            );
            pillar.rotation.set(Math.random(), Math.random(), 0);
            pillar.userData = {
                rotX: (Math.random() - 0.5) * 0.005,
                rotY: (Math.random() - 0.5) * 0.005,
                phase: Math.random() * Math.PI * 2
            };
            this.scene.add(pillar);
            this.blocks.push(pillar);
        }
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / this.W) - 0.5;
            this.mouse.y = (e.clientY / this.H) - 0.5;
        });

        window.addEventListener('resize', () => {
            this.W = window.innerWidth;
            this.H = window.innerHeight;
            this.camera.aspect = this.W / this.H;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.W, this.H);
        });

        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                this.camera.position.y = -self.progress * 40;
            }
        });

        const lenis = new Lenis();
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
    }

    animate() {
        this.time += 0.01;
        this.blocks.forEach(b => {
            b.rotation.x += b.userData.rotX;
            b.rotation.y += b.userData.rotY;
            b.position.y += Math.sin(this.time + b.userData.phase) * 0.01;
        });

        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.05;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

export function startFAQExperience() {
    new FAQScene();

    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }, 800);
    }
}
