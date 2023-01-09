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

    // Flipping the direction of the molecule if it hits the invisible volume
    if (moleculeBox.min.x <= invisibleVolumeBox.min.x || moleculeBox.max.x >= invisibleVolumeBox.max.x) {
        molecule.userData.direction.x *= -1;

        // Moving the molecule back inside the invisible volume if it hits the edge
        // This handles the case where parts of a newly merged molecule outside the invisible volume
        if (moleculeBox.min.x <= invisibleVolumeBox.min.x) {
            molecule.position.x += invisibleVolumeBox.min.x - moleculeBox.min.x;
        } else {
            molecule.position.x -= moleculeBox.max.x - invisibleVolumeBox.max.x;
        }
    }

    if (moleculeBox.min.y <= invisibleVolumeBox.min.y || moleculeBox.max.y >= invisibleVolumeBox.max.y) {
        molecule.userData.direction.y *= -1;
        if (moleculeBox.min.y <= invisibleVolumeBox.min.y) {
            molecule.position.y += invisibleVolumeBox.min.y - moleculeBox.min.y;
        }
        else {
            molecule.position.y -= moleculeBox.max.y - invisibleVolumeBox.max.y;
        }
    }

    if (moleculeBox.min.z <= invisibleVolumeBox.min.z || moleculeBox.max.z >= invisibleVolumeBox.max.z) {
        molecule.userData.direction.z *= -1;
        if (moleculeBox.min.z <= invisibleVolumeBox.min.z) {
            molecule.position.z += invisibleVolumeBox.min.z - moleculeBox.min.z;
        }
        else {
            molecule.position.z -= moleculeBox.max.z - invisibleVolumeBox.max.z;
        }
    }
}

export const moveWithinVolume = (molecule: THREE.Object3D, invisibleVolume: THREE.Mesh) => {

    // Moving the molecule in the direction it is currently moving
    molecule.position.add(molecule.userData.direction);

    // Bouncing if necessary
    bounce(molecule, invisibleVolume);
}