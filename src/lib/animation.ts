import * as THREE from 'three';

export const rotate = (molecule: THREE.Object3D) => {
    molecule.rotation.x += molecule.userData.rotation.x;
    molecule.rotation.y += molecule.userData.rotation.y;
    molecule.rotation.z += molecule.userData.rotation.z;
}

export const move = (molecule: THREE.Object3D, invisibleVolume: THREE.Mesh) => {

    // Moving the molecule in the direction it is currently moving
    molecule.position.add(molecule.userData.direction);

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

export const checkCollision = (molecules: THREE.Object3D[]) => {
    /* 
        for (var i = 0; i < molecules.length; i++) {
    
            for (var j = i + 1; j < molecules.length; j++) {
    
                const mol1 = molecules[i];
                const mol2 = molecules[j];
    
                // Getting the number of atoms in each molecule
                const mol1Size = mol1.children.length;
                const mol2Size = mol2.children.length;
    
                // Getting all faces and lines of the molecules 
                const mol1Faces = mol1.children.map((child: THREE.Object3D) => child.children[0] as THREE.Mesh);
                const mol1Lines = mol1.children.map((child: THREE.Object3D) => child.children[1] as THREE.Line);
    
                const mol2Faces = mol2.children.map((child: THREE.Object3D) => child.children[0] as THREE.Mesh);
                const mol2Lines = mol2.children.map((child: THREE.Object3D) => child.children[1] as THREE.Line);
    
                // Get bounding boxes of all faces and lines
    
                const mol1FacesBoxes = mol1Faces.map((face: THREE.Mesh) => new THREE.Box3().setFromObject(face));
                const mol1LinesBoxes = mol1Lines.map((line: THREE.Line) => new THREE.Box3().setFromObject(line));
    
                const mol2FacesBoxes = mol2Faces.map((face: THREE.Mesh) => new THREE.Box3().setFromObject(face));
                const mol2LinesBoxes = mol2Lines.map((line: THREE.Line) => new THREE.Box3().setFromObject(line));
    
                // Check if any of the boxes intersect
    
                for (var k = 0; k < mol1FacesBoxes.length; k++) {
                    for (var l = 0; l < mol2FacesBoxes.length; l++) {
                        if (mol1FacesBoxes[k].intersectsBox(mol2FacesBoxes[l])) {
                            // check if the corresponding faces material is the same color
                            // if it is, change the direction of the molecules
    
                            if (mol1Faces[k].material.color.equals(mol2Faces[l].material.color)) {
                                console.log(mol1Faces[k].material.color)
                                // stop the movement of the molecules
                                mol1.userData.direction.set(0, 0, 0);
                                mol2.userData.direction.set(0, 0, 0);
                                mol1.userData.rotation.set(0, 0, 0);
                                mol2.userData.rotation.set(0, 0, 0);
                            }
                        }
                    }
                }
            }
        } */
}