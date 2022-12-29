import * as THREE from 'three';

const cubeSpeed = 0.04;
const cubeRotationSpeed = 0.01;

export const createFace = (color: string) => {

    // Creating a colored plane of size 1x1 
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });
    const face = new THREE.Mesh(geometry, material);


    // Creating a normal line from (0, 0, 0) to (0, 0, 1) 
    const start = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(0, 0, 1);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);

    const lineMaterial = new THREE.LineBasicMaterial({ color: color });

    const line = new THREE.Line(lineGeometry, lineMaterial);

    // Creating a group to be able to merge the face and the line
    const group = new THREE.Group();
    group.add(face);
    group.add(line);

    return group;
}

export const createCube = () => {

    // Creating the cube faces
    const frontFace = createFace('red');
    const backFace = createFace('green');
    const leftFace = createFace('blue');
    const rightFace = createFace('yellow');
    const topFace = createFace('orange');
    const bottomFace = createFace('purple');

    // Positioning the cube faces
    // Adding or subtracting 0.5 to all coordinates to center cube at (0, 0, 0)
    frontFace.position.set(0, 0, 0.5);
    backFace.position.set(0, 0, -0.5);

    leftFace.position.set(-0.5, 0, 0);
    rightFace.position.set(0.5, 0, 0);

    topFace.position.set(0, 0.5, 0);
    bottomFace.position.set(0, -0.5, 0);


    // Rotating the cube faces
    frontFace.rotation.set(0, 0, 0);
    backFace.rotation.set(0, Math.PI, 0);

    leftFace.rotation.set(0, -Math.PI / 2, 0);
    rightFace.rotation.set(0, Math.PI / 2, 0);

    topFace.rotation.set(-Math.PI / 2, 0, 0);
    bottomFace.rotation.set(Math.PI / 2, 0, 0);


    // Creating a group and adding the cube faces to it
    const cube = new THREE.Group();
    cube.add(frontFace);
    cube.add(backFace);
    cube.add(leftFace);
    cube.add(rightFace);
    cube.add(topFace);
    cube.add(bottomFace);

    // Giving random direction to the cube (positive or negative)
    // Generating a random number between -1 and 1 and multiplying it by the cube speed
    cube.userData.direction = new THREE.Vector3(
        (Math.random() * 2 - 1) * cubeSpeed,
        (Math.random() * 2 - 1) * cubeSpeed,
        (Math.random() * 2 - 1) * cubeSpeed,
    );

    // Randomly rotating the cube
    cube.userData.rotation = new THREE.Vector3(
        (Math.random() * 2 - 1) * cubeRotationSpeed,
        (Math.random() * 2 - 1) * cubeRotationSpeed,
        (Math.random() * 2 - 1) * cubeRotationSpeed,
    );


    return cube;
}