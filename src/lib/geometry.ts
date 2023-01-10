import * as THREE from 'three';
import { createCube } from './cube';

const boundingRange = 10;
const directionSpeed = 0.1;
const rotationSpeed = 0.01;

const generateDirection = () => {

    // Giving random direction to the molecule (positive or negative)
    // Generating a random number between -1 and 1 and multiplying it by directionSpeed
    const direction = new THREE.Vector3(
        (Math.random() * 2 - 1) * directionSpeed,
        (Math.random() * 2 - 1) * directionSpeed,
        (Math.random() * 2 - 1) * directionSpeed,
    );
    return direction;
};

const generateRotation = () => {

    const rotation = new THREE.Vector3(
        (Math.random() * 2 - 1) * rotationSpeed,
        (Math.random() * 2 - 1) * rotationSpeed,
        (Math.random() * 2 - 1) * rotationSpeed,
    );
    return rotation;
}


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

        // Creating parent group that will hold the original cube and the merged cubes
        const parent = new THREE.Group();

        const cube = createCube();

        // Adding the cube to the parent group
        parent.add(cube);

        // Generating random position for the cube
        // The range is 3 less than the bounding range to ensure the all normals are inside the volume
        const range = boundingRange - 3;
        parent.position.x = (Math.random() * range - range / 2);
        parent.position.y = (Math.random() * range - range / 2);
        parent.position.z = (Math.random() * range - range / 2);

        parent.userData.direction = generateDirection();
        parent.userData.rotation = generateRotation();

        cubes.push(parent);
    }
    return cubes;
};
