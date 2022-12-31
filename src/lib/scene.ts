import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initialising scene, camera, renderer, and orbit controls
export const createScene = () => {

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 70;
    camera.position.y = 20;
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Limiting camera movement
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 70;

    return { scene, camera, renderer, controls };
}