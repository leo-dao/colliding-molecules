import * as THREE from 'three';
import { createCube } from './cube';

let boundingRange = 30;
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

    // Same as direction but for rotation
    const rotation = new THREE.Vector3(
        (Math.random() * 2 - 1) * rotationSpeed,
        (Math.random() * 2 - 1) * rotationSpeed,
        (Math.random() * 2 - 1) * rotationSpeed,
    );
    return rotation;
}


export const createInvisibleVolume = () => {

    const geometry = new THREE.BoxGeometry(boundingRange, boundingRange, boundingRange);

    // Leaving fireframe to visualize the volume
    const material = new THREE.MeshBasicMaterial({ wireframe: true })

    const invisibleVolume = new THREE.Mesh(geometry, material);

    invisibleVolume.name = 'invisibleVolume';

    return invisibleVolume;
}

export const createCubes = (numberOfCubes: number) => {

    // Initializing empty array to hold parent containers of cubes
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

export function updateBoundingRange(newRange: number) {
    boundingRange = newRange;
}