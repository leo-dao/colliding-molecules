import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initialising scene, camera, renderer, and orbit controls
export const createScene = () => {

    var scene = new THREE.Scene();

    // Creating camera
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    camera.position.y = 10;
    scene.add(camera);

    // Creating renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Adding orbit controls to move the camera around the scene
    const controls = new OrbitControls(camera, renderer.domElement);

    // Limiting camera movement
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 70;


    // Updating camera aspect ratio on window resize
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    return { scene, camera, renderer, controls };
}