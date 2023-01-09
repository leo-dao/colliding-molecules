import * as THREE from 'three';


// TESTING FUNCTION
const pause = (molecule1: THREE.Object3D, molecule2: THREE.Object3D) => {

    molecule1.userData.direction = new THREE.Vector3(0, 0, 0);
    molecule2.userData.direction = new THREE.Vector3(0, 0, 0);
    molecule1.userData.rotation = new THREE.Vector3(0, 0, 0);
    molecule2.userData.rotation = new THREE.Vector3(0, 0, 0);
    return;
}

export const mergeMolecules = (
    molecule1: THREE.Object3D,
    molecule2: THREE.Object3D,
    normal1: THREE.Line,
    normal2: THREE.Line,
    scene: THREE.Scene
) => {


    // Special case where a face/normal hits a face/normal that is already connected to another cube
    if (normal1.userData.connected || normal2.userData.connected) {
        return;
    }

    // Getting the cubes from the parent group
    let cube1 = normal1.parent!.parent;
    let cube2 = normal2.parent!.parent;

    // Setting connected to true to prevent that error
    normal1.userData.connected = true;
    normal2.userData.connected = true;

    // Molecule 2 is merging into molecule 1
    if (molecule2.children.length > molecule1.children.length) {

        // Switching the molecules if molecule 2 has more children than molecule 1 so that the smaller molecule is merged into the bigger molecule
        const temp = molecule1;
        molecule1 = molecule2;
        molecule2 = temp;

        // Switching the cubes as 
        const temp2 = cube1;
        cube1 = cube2;
        cube2 = temp2;
    }


    // Getting color of the normal
    // @ts-ignore
    const color = normal1.material.color.getHex();
    console.log(color.toString(16));

    // Getting world rotation of cube 1 
    const cube1Quaternion = cube1!.getWorldQuaternion(new THREE.Quaternion());

    // Copying molecule2 cubes array
    const molecule2Children = molecule2.children.slice();


    molecule2Children.forEach((cube: THREE.Object3D) => {

        // Setting world quaternion of children of molecule 2 to match that of cube1
        scene.attach(cube);

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

        molecule2.attach(cube)
    });

    //pause(molecule1, molecule2);

    molecule2Children.forEach((cube: THREE.Object3D) => {

        molecule1.attach(cube);

    });

    return

    // Getting the origin of the normals
    let normal1Position = normal1.getWorldPosition(new THREE.Vector3());
    let normal2Position = normal2.getWorldPosition(new THREE.Vector3());

    // Getting the tip of the normals
    let normal1Tip = normal1Position.add(normal1.getWorldDirection(new THREE.Vector3()));
    let normal2Tip = normal2Position.add(normal2.getWorldDirection(new THREE.Vector3()));


    // Getting the difference between the normals and adding it to the position of molecule 2
    const diff = normal1Tip.clone().sub(normal2Tip);
    //console.log('Normal 1:', normal1Tip, 'Normal 2:', normal2Tip, "Difference", diff);

    //pause(molecule1, molecule2);

    // Adding the cubes of molecule 2 to molecule 1
    molecule2.children.forEach((cube: THREE.Object3D) => {


        // Getting world position of cube
        let cubePosition = cube.getWorldPosition(new THREE.Vector3());

        // Add diff to that position so it 
        cubePosition.add(diff);

        // Removing the cube from molecule 2 and adding it to the scene to set its world position
        //molecule2.remove(cube);

        //scene.attach(cube);

        // Setting world position since it is direct child of scene
        //cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);

        // molecule1.attach(cube);


    });



    /*     normal1Position = normal1.getWorldPosition(new THREE.Vector3());
        normal2Position = normal2.getWorldPosition(new THREE.Vector3());
    
        // Getting the tip of the normals
        normal1Tip = normal1Position.add(normal1.getWorldDirection(new THREE.Vector3()));
        normal2Tip = normal2Position.add(normal2.getWorldDirection(new THREE.Vector3()));
    
        console.log('Normal 1 after', normal1Tip, normal2Tip) */


    return;
};

/*     const transformations = {
        0xff0000: {
            rotation: [molecule2.position.x + Math.PI, molecule2!.position.y, molecule2!.position.z],
            position: [molecule2!.position.x, molecule2!.position.y, molecule2!.position.z + 3]
        },
        0xffa500: {
            rotation: [molecule2!.position.x + Math.PI, molecule2!.position.y, molecule2!.position.z],
            position: [molecule2!.position.x, molecule2!.position.y + 3, molecule2!.position.z]
        },
        0x00ff00: {
            rotation: [molecule2!.position.x, molecule2!.position.y + Math.PI, molecule2!.position.z],
            position: [molecule2!.position.x, molecule2!.position.y, molecule2!.position.z - 3]
        },
        0x0000ff: {
            rotation: [molecule2!.position.x, molecule2!.position.y + Math.PI, molecule2!.position.z],
            position: [molecule2!.position.x - 3, molecule2!.position.y, molecule2!.position.z]
        },
        0xffff00: {
            rotation: [molecule2!.position.x, molecule2!.position.y, molecule2!.position.z + Math.PI],
            position: [molecule2!.position.x + 3, molecule2!.position.y, molecule2!.position.z]
        },
        0xff00ff: {
            rotation: [molecule2!.position.x, molecule2!.position.y, molecule2!.position.z + Math.PI],
            position: [molecule2!.position.x, molecule2!.position.y - 3, molecule2!.position.z]
        }
    } */

    //molecule2.rotation.set(...transformations[color].rotation);
    //molecule2.position.set(...transformations[color].position);


/*         // Get the color of the normal
        // @ts-ignore
        const color = normal1.material.color.getHex();
        console.log(color.toString(16));
        // Set the rotation and position of the cube based on the color of the normal
        // @ts-ignore
        cube2?.rotation.set(...transformations[color].rotation);
        // @ts-ignore
        cube2?.position.set(...transformations[color].position); */