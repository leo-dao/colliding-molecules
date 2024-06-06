import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { createScene } from './lib/scene';
import { createCubes, updateBoundingRange, createInvisibleVolume } from './lib/geometry';
import { rotate, moveWithinVolume, updateDirectionSpeed, updateRotationSpeed } from './lib/animation';
import { checkCollision } from './lib/collision';
import { checkEmpty, checkMerge } from './lib/insertAtoms';

const { scene, camera, renderer, controls } = createScene();
const gui = new GUI();
const molecules = createCubes(10);

export const guiControls = {
  'Number of Cubes': 10,
  'Bounding Range': 30,
  'Direction Multiplier': 100,
  'Rotation Multiplier': 100,
};

let invisibleVolume = createInvisibleVolume();
scene.add(invisibleVolume);

const setupGUI = () => {
  gui.width = 300;
  gui.add(guiControls, 'Number of Cubes', 1, 100).onChange(updateMolecules);
  gui.add(guiControls, 'Bounding Range', 10, 100).onChange(updateVolume);
  gui.add(guiControls, 'Direction Multiplier', 0, 200).onChange(() => updateDirectionSpeed(guiControls['Direction Multiplier'] * 0.01));
  gui.add(guiControls, 'Rotation Multiplier', 0, 200).onChange(() => updateRotationSpeed(guiControls['Rotation Multiplier'] * 0.01));
};

const updateMolecules = () => {
  molecules.forEach(molecule => scene.remove(molecule));
  const newMolecules = createCubes(guiControls['Number of Cubes']);
  newMolecules.forEach(molecule => scene.add(molecule));
  molecules.splice(0, molecules.length, ...newMolecules);
};

const updateVolume = () => {
  updateBoundingRange(guiControls['Bounding Range']);
  scene.remove(invisibleVolume);
  invisibleVolume = createInvisibleVolume();
  scene.add(invisibleVolume);
};

const onClick = (event: MouseEvent) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2((event.clientX / renderer.domElement.clientWidth) * 2 - 1, -(event.clientY / renderer.domElement.clientHeight) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children) as THREE.Intersection[];
  checkEmpty(intersects, molecules, scene);
  checkMerge(intersects, molecules, scene);
};

const toggleOnClickEvent = (enable: boolean) => {
  window[enable ? 'addEventListener' : 'removeEventListener']('click', onClick, false);
};

window.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Shift') toggleOnClickEvent(true);
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
  if (event.key === 'Shift') toggleOnClickEvent(false);
});

const animate = () => {
  requestAnimationFrame(animate);
  molecules.forEach(molecule => {
    rotate(molecule);
    moveWithinVolume(molecule, invisibleVolume);
  });
  checkCollision(molecules);
  controls.update();
  renderer.render(scene, camera);
};

setupGUI();
molecules.forEach(molecule => scene.add(molecule));
animate();