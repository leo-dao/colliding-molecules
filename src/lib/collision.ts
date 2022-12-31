import * as THREE from 'three';

// Storing bounding box and color of the faces and lines
interface BoundingBox {
    box: THREE.Box3,
    color: THREE.Color
}

const getBoundingBoxes = (molecule: THREE.Object3D) => {

    // Getting all the faces and lines belonging to the molecule
    const faces = molecule.children.map((child: THREE.Object3D) => child.children[0] as THREE.Mesh);
    const lines = molecule.children.map((child: THREE.Object3D) => child.children[1] as THREE.Line);

    // Getting the bounding boxes of all the faces and lines and their colors
    const facesBoxes = faces.map((face: THREE.Mesh) => {

        const BoundingBoxFaces: BoundingBox = {
            box: new THREE.Box3().setFromObject(face),
            // @ts-ignore, color does exist
            color: face.material.color
        }

        return BoundingBoxFaces;
    }
    );

    const linesBoxes = lines.map((line: THREE.Line) => {

        const BoundingBoxLines: BoundingBox = {
            box: new THREE.Box3().setFromObject(line),
            // @ts-ignore
            color: line.material.color
        }

        return BoundingBoxLines;
    }
    );

    // Returning as an object
    return { facesBoxes, linesBoxes };

}

export const checkCollision = (molecules: THREE.Object3D[]) => {

    // Iterating through all the molecules
    for (var i = 0; i < molecules.length; i++) {

        // Getting the current molecule
        const molecule1 = molecules[i];


        // Getting the bounding boxes of the faces and lines of the current molecule and their colors
        const { facesBoxes: molecule1FacesBoxes, linesBoxes: molecule1LinesBoxes } = getBoundingBoxes(molecule1);

        // Iterating through all the molecules again except the current molecule
        for (var j = i + 1; j < molecules.length; j++) {

            const molecule2 = molecules[j];

            const { facesBoxes: molecule2FacesBoxes, linesBoxes: molecule2LinesBoxes } = getBoundingBoxes(molecule2);

            // Checking if the bounding boxes of the faces and lines of the two molecules are intersecting
            molecule1FacesBoxes.forEach((faceBox1: BoundingBox) => {

                molecule2FacesBoxes.forEach((faceBox2: BoundingBox) => {
                    if (faceBox1.box.intersectsBox(faceBox2.box) && faceBox1.color.equals(faceBox2.color)) {
                        console.log(faceBox1.color);
                    }
                })

                molecule2LinesBoxes.forEach((lineBox2: BoundingBox) => {
                    if (faceBox1.box.intersectsBox(lineBox2.box) && faceBox1.color.equals(lineBox2.color)) {
                        console.log(faceBox1.color);
                    }
                })
            })

            molecule1LinesBoxes.forEach((lineBox1: BoundingBox) => {

                molecule2FacesBoxes.forEach((faceBox2: BoundingBox) => {
                    if (lineBox1.box.intersectsBox(faceBox2.box) && lineBox1.color.equals(faceBox2.color)) {
                        console.log(lineBox1.color);
                    }
                })

                molecule2LinesBoxes.forEach((lineBox2: BoundingBox) => {
                    if (lineBox1.box.intersectsBox(lineBox2.box) && lineBox1.color.equals(lineBox2.color)) {
                        console.log(lineBox1.color);
                    }
                })
            }
            )

        }
    }
};