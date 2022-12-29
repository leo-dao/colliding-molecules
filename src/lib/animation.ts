import * as THREE from 'three';

export const rotate = (molecule: THREE.Object3D) => {
    molecule.rotation.x += molecule.userData.rotation.x;
    molecule.rotation.y += molecule.userData.rotation.y;
    molecule.rotation.z += molecule.userData.rotation.z;
}


export const move = (molecule: THREE.Object3D, invisibleVolume: THREE.Mesh) => {

    // Moving the molecule in the direction it is currently moving
    molecule.position.add(molecule.userData.direction);

    /* 
        for (var i = 0; i < molecule.children.length; i++) {
    
            const group = molecule.children[i];
    
    
            const face: THREE.Object3D = group.children[0];
            const line = group.children[1];
    
    
            // Possible ways of solving this:
    
            // Use a bounding box for plane and another for the line
            // Check collision for both with the invisible container
    
        } */
}

    // Each face+line has a uuid corresponding to its unique color
    // For collision check if the twoo uuids are the same