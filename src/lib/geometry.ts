import * as THREE from 'three';
import { createCube } from './cube';

const boundingRange = 50;

export const createInvisibleVolume = () => {

    // Creating a box of size 50x50x50
    const geometry = new THREE.BoxGeometry(boundingRange, boundingRange, boundingRange);

    // Leaving fireframe for easier debugging
    const material = new THREE.MeshBasicMaterial({ wireframe: true })

    const invisibleVolume = new THREE.Mesh(geometry, material);

    return invisibleVolume;
}

export const createCubes = (numberOfCubes: number) => {

    const cubes = [];

    for (var i = 0; i < numberOfCubes; i++) {

        const cube = createCube();

        // Subtracting 1 from the bounding range to ensure that the cube is not placed on the edge of the volume
        const range = boundingRange - 1;
        cube.position.x = Math.random() * range - range / 2;
        cube.position.y = Math.random() * range - range / 2;
        cube.position.z = Math.random() * range - range / 2;

        cubes.push(cube);
    }
    return cubes;
}

