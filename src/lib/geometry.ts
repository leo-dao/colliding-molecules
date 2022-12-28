import * as THREE from 'three';

const boundingRange = 50;

export const createInvisibleVolume = () => {

    // Creating a box of size 50x50x50
    const geometry = new THREE.BoxGeometry(boundingRange, boundingRange, boundingRange);

    // Leaving fireframe for easier debugging
    const material = new THREE.MeshBasicMaterial({ wireframe: true })

    const invisibleVolume = new THREE.Mesh(geometry, material);

    return invisibleVolume;
}