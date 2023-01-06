import * as THREE from 'three';
import { createCube } from './cube';

const boundingRange = 30;
const directionSpeed = 0.08;
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
}

export const mergeMolecules = (
    molecule1: THREE.Object3D,
    molecule2: THREE.Object3D,
    normal1: THREE.Line,
    normal2: THREE.Line) => {


    //  Initializing the rotation values
    let xRotation = 0;
    let yRotation = 0;
    let zRotation = 0;


    // Stop the cubes from moving (testing)
    /* molecule1.userData.direction = new THREE.Vector3(0, 0, 0);
    molecule2.userData.direction = new THREE.Vector3(0, 0, 0);
    molecule1.userData.rotation = new THREE.Vector3(0, 0, 0);
    molecule2.userData.rotation = new THREE.Vector3(0, 0, 0); */


    // Rotation values for each color
    const red = [Math.PI, 0, 0]
    const orange = [Math.PI, 0, 0]
    const green = [0, Math.PI, 0]
    const blue = [0, Math.PI, 0]
    const yellow = [0, 0, Math.PI]
    const purple = [0, 0, Math.PI]

    // Get the color of the normal
    // @ts-ignore
    const color = normal1.material.color.getHex();

    // Rotate the molecule by the correct values
    switch (color) {
        case 0xff0000:
            xRotation = red[0];
            yRotation = red[1];
            zRotation = red[2];
            break;
        case 0xffa500:
            xRotation = orange[0];
            yRotation = orange[1];
            zRotation = orange[2];
            break;
        case 0x00ff00:
            xRotation = green[0];
            yRotation = green[1];
            zRotation = green[2];
            break;
        case 0x0000ff:
            xRotation = blue[0];
            yRotation = blue[1];
            zRotation = blue[2];
            break;
        case 0xffff00:
            xRotation = yellow[0];
            yRotation = yellow[1];
            zRotation = yellow[2];
            break;
        case 0xff00ff:
            xRotation = purple[0];
            yRotation = purple[1];
            zRotation = purple[2];
            break;
    }

    // Adding all the cubes of molecule 2 to molecule 1
    molecule2.children.forEach((cube) => {

        // Adding the cube to the parent group of molecule 1
        molecule1.add(cube);


        // Rotating the cube by the rotation necessary to align normal 1 and normal 2
        cube.rotation.set(cube.rotation.x + xRotation, cube.rotation.y + yRotation, cube.rotation.z + zRotation);


        /* // TEST: Just to see the rotation
        cube.position.set(cube.position.x + 1, cube.position.y + 1, cube.position.z + 1); */

    }
    );

    // TODO: 
    // If any part of the molecule is outside the volume, move it back inside


};
