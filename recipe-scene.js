import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

class RecipeScene {
    constructor() {
        this.canvas = document.querySelector('#recipe-canvas');
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
        this.camera = new THREE.PerspectiveCamera(35, this.W / this.H, 0.1, 1000);
        this.camera.position.z = 20;

        this.ingredients = [];
        this.init();
    }

    init() {
        this.buildLights();
        this.buildIngredients();
        this.bindEvents();
        this.animate();
    }

    buildLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambient);

        const spot = new THREE.SpotLight(0xc9993a, 20);
        spot.position.set(10, 20, 10);
        this.scene.add(spot);
    }

    buildIngredients() {
        // Create 3D representations of ingredients (simplified as high-end meshes)
        // This will be dynamic based on data-ingredients attr on canvas if needed
        const count = 12;
        const geometries = [
            new THREE.IcosahedronGeometry(0.8, 1), // "Cocoa Bean"
            new THREE.BoxGeometry(0.5, 0.1, 0.5), // "Salt Flake"
            new THREE.TorusGeometry(0.4, 0.1, 8, 20) // "Honey Swirl"
        ];

        const material = new THREE.MeshPhysicalMaterial({
            color: 0x8b5e3c,
            metalness: 0.2,
            roughness: 0.1,
            clearcoat: 1,
            transparent: true,
            opacity: 0.8
        });

        for (let i = 0; i < count; i++) {
            const geo = geometries[i % geometries.length];
            const mesh = new THREE.Mesh(geo, material.clone());
            
            // Random gold versions
            if (Math.random() > 0.7) {
                mesh.material.color.set(0xc9993a);
                mesh.material.metalness = 1;
            }

            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 30, // Taller for scroll
                (Math.random() - 0.5) * 10
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            
            mesh.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.01,
                floatSpeed: 0.005 + Math.random() * 0.01,
                phase: Math.random() * Math.PI * 2
            };

            this.scene.add(mesh);
            this.ingredients.push(mesh);
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

        // Scroll mapping
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => {
                this.camera.position.y = -self.progress * 15;
            }
        });

        const lenis = new Lenis();
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
    }

    animate() {
        this.time += 0.01;

        this.ingredients.forEach(item => {
            item.rotation.x += item.userData.rotSpeed;
            item.rotation.y += item.userData.rotSpeed;
            item.position.x += Math.sin(this.time + item.userData.phase) * 0.005;
        });

        this.camera.position.x += (this.mouse.x * 4 - this.camera.position.x) * 0.05;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

export function startRecipeExperience() {
    new RecipeScene();
}
