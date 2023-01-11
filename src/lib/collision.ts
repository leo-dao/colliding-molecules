import * as THREE from 'three';
import { mergeMolecules } from './merge';

// Storing bounding box and color of the faces and lines
interface BoundingBox {
    box: THREE.Box3,
    line: THREE.Line,
    color: THREE.Color
}

export const getBoundingBoxes = (molecule: THREE.Object3D) => {

    // Getting all cubes in the molecule
    const cubes = molecule.children.filter(child => child.type === 'Group') as THREE.Group[];

    const faces: THREE.Mesh[] = [];
    const lines: THREE.Line[] = [];

    // Getting all faces and lines in the cubes
    cubes.forEach(cube => {
        cube.children.forEach(child => {
            faces.push(child.children[0] as THREE.Mesh)
            lines.push(child.children[1] as THREE.Line)
        })
    });

    // Getting the bounding boxes of all the faces and lines and their colors
    const faceBoxes = faces.map((face: THREE.Mesh) => {

        const BoundingBoxFaces: BoundingBox = {
            box: new THREE.Box3().setFromObject(face),
            line: lines[faces.indexOf(face)],
            // @ts-ignore, color does exist
            color: face.material.color

        }

        return BoundingBoxFaces;
    });

    const lineBoxes = lines.map((line: THREE.Line) => {

        const BoundingBoxLines: BoundingBox = {
            box: new THREE.Box3().setFromObject(line),
            line: line,
            // @ts-ignore
            color: line.material.color
        }

        return BoundingBoxLines;

    });

    // Returning as an object
    return { faceBoxes, lineBoxes };

}

const checkBoundingBoxes = (molecule1: THREE.Object3D, molecule2: THREE.Object3D) => {

    // Getting the bounding boxes of all faces and lines of the two molecules
    const b1 = getBoundingBoxes(molecule1);
    const b2 = getBoundingBoxes(molecule2);

    // Variable to check if the molecules have already merged to avoid multiple merges
    let merged = false;

    b1.faceBoxes.forEach((faceBox1: BoundingBox) => {

        // Checking if face boxes of molecule 1 are intersecting with face boxes of molecule 2 of same color
        b2.faceBoxes.forEach((faceBox2: BoundingBox) => {
            if (faceBox1.box.intersectsBox(faceBox2.box) && faceBox1.color.equals(faceBox2.color)) {

                // Merging if the molecules have not already merged
                if (!merged) {
                    merged = true;
                    return mergeMolecules(molecule1, molecule2, faceBox1.line, faceBox2.line);
                }
            }

        })

        //checking if face boxes of molecule 1 are intersecting with line boxes of molecule 2
        b2.lineBoxes.forEach((lineBox2: BoundingBox) => {
            if (faceBox1.box.intersectsBox(lineBox2.box) && faceBox1.color.equals(lineBox2.color)) {

                if (!merged) {
                    merged = true;
                    return mergeMolecules(molecule1, molecule2, faceBox1.line, lineBox2.line);
                }
            }
        })
    })

    // Same as above but for line boxes
    b1.lineBoxes.forEach((lineBox1: BoundingBox) => {

        b2.faceBoxes.forEach((faceBox2: BoundingBox) => {
            if (lineBox1.box.intersectsBox(faceBox2.box) && lineBox1.color.equals(faceBox2.color)) {

                if (!merged) {
                    merged = true;
                    return mergeMolecules(molecule1, molecule2, lineBox1.line, faceBox2.line);
                }
            }
        });

        b2.lineBoxes.forEach((lineBox2: BoundingBox) => {
            if (lineBox1.box.intersectsBox(lineBox2.box) && lineBox1.color.equals(lineBox2.color)) {

                if (!merged) {
                    merged = true;
                    return mergeMolecules(molecule1, molecule2, lineBox1.line, lineBox2.line);
                }

            }
        })
    })
}

export const checkCollision = (molecules: THREE.Object3D[]) => {

    // Iterating over all molecules and if they are not the same molecule, check bounding boxes for collision
    molecules.forEach((m1) => {

        molecules.forEach((m2) => {

            if (m1 !== m2) {
                return checkBoundingBoxes(m1, m2);
            }

        })
    })


};