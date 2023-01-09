import * as THREE from 'three'

const createFace = (color: number) => {

    // Creating a colored plane of size 1x1 
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // Creating a normal line from (0, 0, 0) to (0, 0, 1) 
    const start = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(0, 0, 1);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);

    const lineMaterial = new THREE.LineBasicMaterial({ color: color });

    const line = new THREE.Line(lineGeometry, lineMaterial);

    plane.geometry.computeBoundingBox();
    line.geometry.computeBoundingBox();

    // Creating a group to merge the plane and the line
    const group = new THREE.Group();
    group.attach(plane);
    group.attach(line);

    return group;
}

export const createCube = () => {

    // Colors: red, green, blue, yellow, orange, purple
    const frontFace = createFace(0xff0000);
    const backFace = createFace(0x00ff00);
    const leftFace = createFace(0x0000ff);
    const rightFace = createFace(0xffff00);
    const topFace = createFace(0xffa500);
    const bottomFace = createFace(0xff00ff);

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

    return cube;
}