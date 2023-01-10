import * as THREE from 'three';

// TESTING FUNCTION
const pause = (molecule1: THREE.Object3D) => {
    molecule1.userData.direction = new THREE.Vector3(0, 0, 0);
    molecule1.userData.rotation = new THREE.Vector3(0, 0, 0);
    return;
};

const rotateMolecule2 = (
    molecule2: THREE.Object3D,
    cube1: THREE.Object3D,
    cube2: THREE.Object3D,
    color: number) => {

    // Getting world rotation of cube 1 and cube 2
    const cube1Quaternion = cube1!.getWorldQuaternion(new THREE.Quaternion());
    const cube2Quaternion = cube2!.getWorldQuaternion(new THREE.Quaternion());

    // Find the quaternion required to rotate cube2 to be in the same orientation as cube1
    const quaternionDifference = cube2Quaternion.invert().multiply(cube1Quaternion);

    // Multiplying all molecule 2 (and therefore all cubes in it) by the quaternion difference
    molecule2.quaternion.multiply(quaternionDifference);

    // Rotating all cubes by PI on the x or y axis depending on the color of the normal
    if (color === 0xffa500 || color === 0xff00ff) {

        // At this point, cube in mol2 has the the same rotations as cube1 it collided with
        // We rotate by PI around the X axis to flip the cube upside down (orange and purple area at the top and bottom of cube)
        // This will make the normals be linear 
        molecule2.rotateX(Math.PI);
    }
    else {
        // Otherwise the cube needs to rotate around the Y axis to have the normals be linear
        molecule2.rotateY(Math.PI);
    }
}

const positionMolecule2 = (
    molecule2: THREE.Object3D,
    normal1: THREE.Line,
    normal2: THREE.Line) => {

    // Getting the origin of the normals
    let normal1Position = normal1.getWorldPosition(new THREE.Vector3());
    let normal2Position = normal2.getWorldPosition(new THREE.Vector3());

    // Getting the tip of the normals
    let normal1Tip = normal1Position.add(normal1.getWorldDirection(new THREE.Vector3()));
    let normal2Tip = normal2Position.add(normal2.getWorldDirection(new THREE.Vector3()));

    // Getting the difference in x,y,z values between the tip of the normals
    const translation = normal1Tip.clone().sub(normal2Tip);

    // Translating molecule2 so that the tip of the normals are in the same position
    molecule2.position.add(translation);
};

const checkNewNormals = (molecule1: THREE.Object3D, molecule2: THREE.Object3D) => {

    // Checking if any new normals have been connected (e.g. if 2 molecules of size 2 merge and all 4 cubes now connect)
    // This is to avoid merging inside a 2 cubes that are connected without directly merging

    // Iterating through all normal lines in molecule 2
    molecule2.children.forEach((cube: THREE.Object3D) => {

        cube.children.forEach((face: THREE.Object3D) => {
            const normal = face.children[1]

            // Getting the tip of the normal
            let normalPosition = normal.getWorldPosition(new THREE.Vector3());
            let normalTip = normalPosition.add(normal.getWorldDirection(new THREE.Vector3()));

            // Looping through all normals in molecule1
            molecule1.children.forEach((cube: THREE.Object3D) => {

                cube.children.forEach((face: THREE.Object3D) => {

                    const normal = face.children[1]

                    // Getting the tip of the normal
                    let normalPosition = normal.getWorldPosition(new THREE.Vector3());
                    let normalTip2 = normalPosition.add(normal.getWorldDirection(new THREE.Vector3()));

                    // Checking if the tip of the normal is within 0.1 of the tip of any other normal
                    if (normalTip.distanceTo(normalTip2) < 0.1) {

                        // Setting to true if it wasn't already
                        if (!normal.userData.connected) {
                            normal.userData.connected = true;
                        }
                    }
                })
            }
            )

        });
    });
};

const attachMolecules = (molecule1: THREE.Object3D, molecule2: THREE.Object3D) => {

    // Copying all cubes in array to iterate over them and remove them all
    const molecule2Children: THREE.Object3D[] = [];

    molecule2.children.forEach((cube: THREE.Object3D) => {
        molecule2Children.push(cube)
    });

    // Attaching all cubes to molecule1
    molecule2Children.forEach((cube: THREE.Object3D) => {
        molecule1.attach(cube);
    });

};

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
    };

    // Getting the cube that molecule2 is merging into
    const cube1 = normal1.parent!.parent;
    const cube2 = normal2.parent!.parent;

    // Getting color of the colliding normal/face
    // @ts-ignore
    const color = normal1.material.color.getHex();

    // Rotating the cubes into the correct orientation
    rotateMolecule2(molecule2, cube1!, cube2!, color);

    // Positioning the cubes so that the normals align
    positionMolecule2(molecule2, normal1, normal2);

    // Checking if any new normals have been connected and updating the connected property if so
    checkNewNormals(molecule1, molecule2);

    // Attaching all cubes in molecule2 to molecule1
    attachMolecules(molecule1, molecule2);


    return;
};