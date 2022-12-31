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

    // Checking if the molecule is outside the invisible volume 
    // If it is, change the direction of corresponding axis
    if (moleculeBox.min.x <= invisibleVolumeBox.min.x || moleculeBox.max.x >= invisibleVolumeBox.max.x) {
        molecule.userData.direction.x *= -1;
    }

    if (moleculeBox.min.y <= invisibleVolumeBox.min.y || moleculeBox.max.y >= invisibleVolumeBox.max.y) {
        molecule.userData.direction.y *= -1;
    }

    if (moleculeBox.min.z <= invisibleVolumeBox.min.z || moleculeBox.max.z >= invisibleVolumeBox.max.z) {
        molecule.userData.direction.z *= -1;
    }
}

export const move = (molecule: THREE.Object3D, invisibleVolume: THREE.Mesh) => {

    // Moving the molecule in the direction it is currently moving
    molecule.position.add(molecule.userData.direction);

    bounce(molecule, invisibleVolume);

}