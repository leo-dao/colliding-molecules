import * as THREE from 'three';
import { createScene } from './lib/scene';
import { createInvisibleVolume } from './lib/geometry';
import { createCubes } from './lib/geometry';
import { rotate, moveWithinVolume } from './lib/animation';
import { checkCollision } from './lib/collision';
import { checkEmpty, checkMerge } from './lib/insertAtoms';

const { scene, camera, renderer, controls } = createScene();

// Adding the invisible volume to the scene
const invisibleVolume = createInvisibleVolume();
scene.add(invisibleVolume);

// Adding the molecules (starting off as cubes) to the scene
const molecules = createCubes(2);
molecules.forEach(molecule => scene.add(molecule));


// OnClick to add new cubes
const onClick = (event: MouseEvent) => {

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Getting normalized mouse coordinates
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  // Getting the intersecting objects
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children) as THREE.Intersection[];

  // Checking if the click is on an empty space or on a cube and inserting in scene accordingly
  checkEmpty(intersects, molecules, scene);
  checkMerge(intersects, molecules, scene);
};

// Adding event listener for shift key to either add or remove the onClick event listener
// So that new cubes can only be insert when holding down shift
window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Shift') {
    window.addEventListener('click', onClick, false);
  }
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
  if (event.key === 'Shift') {
    window.removeEventListener('click', onClick, false);
  }
});

// Rendering the scene
const animate = () => {

  requestAnimationFrame(animate);

  // Rotating and moving molecules in the volume
  molecules.forEach(molecule => {
    rotate(molecule);
    moveWithinVolume(molecule, invisibleVolume);
  });

  // Checking if any molecules have collided with the right color and merging them accordingly
  checkCollision(molecules);

  controls.update();
  renderer.render(scene, camera);
}

animate();