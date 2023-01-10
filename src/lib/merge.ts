import * as THREE from 'three';


// TESTING FUNCTION
const pause = (molecule1: THREE.Object3D, molecule2: THREE.Object3D) => {

    molecule1.userData.direction = new THREE.Vector3(0, 0, 0);
    molecule2.userData.direction = new THREE.Vector3(0, 0, 0);
    molecule1.userData.rotation = new THREE.Vector3(0, 0, 0);
    molecule2.userData.rotation = new THREE.Vector3(0, 0, 0);
    return;
};

const rotateMolecules = (
    molecule1: THREE.Object3D,
    molecule2Children: THREE.Object3D[],
    cube1: THREE.Object3D,
    color: number) => {


    const scene = molecule1.parent;

    // Getting world rotation of cube 1 
    const cube1Quaternion = cube1!.getWorldQuaternion(new THREE.Quaternion());


    // Iterating through all cubes of molecule2
    molecule2Children.forEach((cube: THREE.Object3D) => {

        // Removing cube from molecule2 and making it a direct child of scene
        scene!.attach(cube);

        // Setting world quaternion (not local quaternion since cube is now child of scene)
        cube.setRotationFromQuaternion(cube1Quaternion);

        // Rotating all cubes by PI on the x or y axis depending on the color of the normal
        if (color === 0xffa500 || color === 0xff00ff) {

            // At this point, cube in mol2 has the the same rotations as cube1 it collided with
            // We rotate by PI around the X axis to flip the cube upside down (orange and purple area at the top and bottom of cube) and have the normals be linear 
            cube.rotateX(Math.PI);
        }
        else {
            // Otherwise the cube needs to rotate around the Y axis to have the normals be linear
            cube.rotateY(Math.PI);
        }

        // Attaching cubes to molecule 1 but with correct quaternion
        molecule1.attach(cube)
    });

}

const positionMolecules = (
    molecule1: THREE.Object3D,
    molecule2Children: THREE.Object3D[],
    normal1: THREE.Line,
    normal2: THREE.Line) => {

    const scene = molecule1.parent;

    // Getting the origin of the normals
    let normal1Position = normal1.getWorldPosition(new THREE.Vector3());
    let normal2Position = normal2.getWorldPosition(new THREE.Vector3());

    // Getting the tip of the normals
    let normal1Tip = normal1Position.add(normal1.getWorldDirection(new THREE.Vector3()));
    let normal2Tip = normal2Position.add(normal2.getWorldDirection(new THREE.Vector3()));


    // Getting the difference in x,y,z values between the tip of the normals
    const translation = normal1Tip.clone().sub(normal2Tip);

    // Positioning loop
    molecule2Children.forEach((cube: THREE.Object3D) => {

        // Getting world position of cube
        let cubePosition = cube.getWorldPosition(new THREE.Vector3());

        // Adding the translation vector to the cube position 
        cubePosition.add(translation);

        // Attaching cube to the scene
        scene!.attach(cube);

        // Setting its world position 
        cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);

        // Reattaching it to molecule 1
        molecule1.attach(cube);

    });

}

export const mergeMolecules = (
    molecule1: THREE.Object3D,
    molecule2: THREE.Object3D,
    normal1: THREE.Line,
    normal2: THREE.Line
) => {

    // Special case where a face/normal hits a face/normal that is already connected to another cube
    if (normal1.userData.connected || normal2.userData.connected) {
        // Not merging
        return;
    }

    // Setting connected to true to prevent error just above
    normal1.userData.connected = true;
    normal2.userData.connected = true;

    // The algorithm assumes that molecule1 is the bigger molecule
    // Switching the molecules if molecule 2 has more children than molecule 1 so that the smaller molecule is merged into the bigger molecule
    if (molecule2.children.length > molecule1.children.length) {

        // Switching 
        let temp = molecule1;
        molecule1 = molecule2;
        molecule2 = temp;

        let temp2 = normal1;
        normal1 = normal2;
        normal2 = temp2;
    }

    // Getting the cube that molecule2 is merging into
    let cube1 = normal1.parent!.parent;

    // Getting color of the colliding normal/face
    // @ts-ignore
    const color = normal1.material.color.getHex();

    // Copying molecule2 cubes array to save it
    const molecule2Children = molecule2.children.slice();

    // Rotating the cubes into the correct orientation
    rotateMolecules(molecule1, molecule2Children, cube1!, color);

    // Positioning the cubes so that the normals align
    positionMolecules(molecule1, molecule2Children, normal1, normal2);

    return;
};