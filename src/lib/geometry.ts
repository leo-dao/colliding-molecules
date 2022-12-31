import * as THREE from 'three';
import { createCube } from './cube';

const boundingRange = 50;
const directionSpeed = 0.05;
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

        const cube = createCube();

        // Generating random position for the cube
        // The range is 3 less than the bounding range to ensure the all normals are inside the volume
        const range = boundingRange - 3;
        cube.position.x = (Math.random() * range - range / 2);
        cube.position.y = (Math.random() * range - range / 2);
        cube.position.z = (Math.random() * range - range / 2);

        cube.userData.direction = generateDirection();
        cube.userData.rotation = generateRotation();

        cubes.push(cube);
    }
    return cubes;
}

export const mergeMolecules = (molecule1: THREE.Object3D, molecule2: THREE.Object3D, color: String) => {

    // Creating a new group to hold the merged molecules
    const molecule = new THREE.Group();

    // Adding the two molecules to the group
    molecule.add(molecule1);
    molecule.add(molecule2);

    // set the position of each molecule to be next to each other 
    // There is a distance of 3 between the center of two cubes 
    // 0.5 from cube A to line A, 1 from line A to line B, 0.5 from line B to cube B)

    // However this is only true when the each molecule only contains one cube

    molecule1.position.x = 0;
    molecule1.position.y = 0;
    molecule1.position.z = 0;

    molecule2.position.x = 0;
    molecule2.position.y = 0;
    molecule2.position.z = 3;

    // Generating new rotation and direction for the merged molecule
    molecule.userData.direction = generateDirection();
    molecule.userData.rotation = generateRotation();

    return molecule;

};
