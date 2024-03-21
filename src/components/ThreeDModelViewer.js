import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls

function ThreeDModelViewer() {
    const containerRef = useRef(null);

    useEffect(() => {
        // Create a new scene
        const scene = new THREE.Scene();

        // Create a new camera
        // Create a new camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(-30, 20, 1); // Adjust camera position to be above the scene
        camera.lookAt(0, 0, 0); // Look at the center of the scene

        // Create a new renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff, 1);
        containerRef.current.appendChild(renderer.domElement);

        // Create a new OrbitControls instance
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true; // Enable zoom in/out
        controls.update(); // Update controls

        // Create a new OBJ loader
        const objLoader = new OBJLoader();

        // Create a new MTL loader
        const mtlLoader = new MTLLoader();
        mtlLoader.load(
            '/assets/odm_textured_model_geo.obj.mtl', // Path to your .mtl file
            (materials) => {
                objLoader.setMaterials(materials);
                objLoader.load(
                    '/assets/odm_textured_model_geo.obj', // Path to your .obj file
                    (object) => {
                        // Add the loaded model to the scene
                        scene.add(object);
                    },
                    // called when loading is in progresses
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                    },
                    // called when loading has errors
                    (error) => {
                        console.error('An error happened', error);
                    }
                );
            },
            // called when loading has errors
            (error) => {
                console.error('An error happened', error);
            }
        );

        // Create a new ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Create a new directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Function to handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Render function
        const render = () => {
            renderer.render(scene, camera);
        };

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update(); // Update controls in animation loop
            render();
        };

        animate();

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} />;
}

export default ThreeDModelViewer;
