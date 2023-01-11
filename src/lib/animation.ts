import * as THREE from 'three';

export const rotate = (molecule: THREE.Object3D) => {

    molecule.rotation.x += molecule.userData.rotation.x;
    molecule.rotation.y += molecule.userData.rotation.y;
    molecule.rotation.z += molecule.userData.rotation.z;
}

const bounce = (molecule: THREE.Object3D, invisibleVolume: THREE.Mesh) => {

    // Getting the bounding boxes of the molecule and the invisible volume
    const moleculeBox = new THREE.Box3().setFromObject(molecule);
    const invisibleVolumeBox = new THREE.Box3().setFromObject(invisibleVolume);

    // Iterating through all axis
    for (let axis of ['x', 'y', 'z']) {

        // If the molecule is outside the invisible volume on the current axis
        // @ts-ignore
        if (moleculeBox.min[axis] <= invisibleVolumeBox.min[axis] || moleculeBox.max[axis] >= invisibleVolumeBox.max[axis]) {

            // Flip the direction of the molecule
            molecule.userData.direction[axis] *= -1;

            // Move the molecule back inside the invisible volume if it is outside
            // @ts-ignore
            if (moleculeBox.min[axis] <= invisibleVolumeBox.min[axis]) {
                // @ts-ignore
                molecule.position[axis] += invisibleVolumeBox.min[axis] - moleculeBox.min[axis];
            } else {
                // @ts-ignore
                molecule.position[axis] -= moleculeBox.max[axis] - invisibleVolumeBox.max[axis];
            }
        }
    }
}

export const moveWithinVolume = (molecule: THREE.Object3D, invisibleVolume: THREE.Mesh) => {

    // Moving the molecule in the direction it is currently moving
    molecule.position.add(molecule.userData.direction);

    // Bouncing if necessary
    bounce(molecule, invisibleVolume);
}