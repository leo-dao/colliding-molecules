import * as THREE from 'three';
import { createCubes } from './geometry';
import { mergeMolecules } from './merge';

export const checkEmpty = (intersects: THREE.Intersection[], molecules: THREE.Group[], scene: THREE.Scene) => {

    // If you click outside volume (0 objects) or inside but not touching any other molecules (1)
    if (intersects.length <= 1) {
        // Creating a molecule and adding to molecules array/scene
        const cube = createCubes(1)[0];
        molecules.push(cube);
        scene.add(cube);
    }

};

export const checkMerge = (intersects: THREE.Intersection[], molecules: THREE.Group[], scene: THREE.Scene) => {

    // If you click on a molecule
    if (intersects.length > 1) {

        // Creating molecule that will be merged
        const molecule2 = createCubes(1)[0];

        // Getting the cube that was clicked (iterates through all meshes that intersect with raycaster)
        // If a cube is already all connected, it will check other cubes that intersect with raycaster until it finds one that isn't
        intersects.forEach(intersect => {

            // Ignoring invisible volume
            if (intersect.object.name !== 'invisibleVolume') {

                // Getting the first normal that intersect with raycaster
                const face1 = intersect.object.parent;
                const normal1 = face1!.children[1];

                // If that normal is not connected to any other normal
                if (!normal1.userData.connected) {

                    // Yields undefined error despite molecule2.children[0] being undefined
                    const faces2 = molecule2.children[0].children;

                    faces2.forEach((face: THREE.Object3D) => {

                        // Getting the normal with matching color from new cube
                        const normal2 = face.children[1] as THREE.Line;
                        // @ts-ignore
                        // Merging if colors match
                        if (normal1.material.color.equals(normal2.material.color)) {

                            // Adding to molecules array and scene
                            molecules.push(molecule2);
                            scene.add(molecule2);

                            // @ts-ignore
                            // Merging the cubes
                            mergeMolecules(normal1.parent.parent.parent, molecule2, normal1, normal2);
                        }

                    })
                }

            }
        })

    }

};