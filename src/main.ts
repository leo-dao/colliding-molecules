import * as THREE from 'three';
import { createScene } from './lib/scene';
import { createInvisibleVolume } from './lib/geometry';
import { createCubes } from './lib/geometry';
import { rotate, moveWithinVolume } from './lib/animation';
import { checkCollision } from './lib/collision';

const { scene, camera, renderer, controls } = createScene();

// Adding the invisible volume to the scene
const invisibleVolume = createInvisibleVolume();
scene.add(invisibleVolume);

// Adding the cubes to the scene
const molecules = createCubes(3);
molecules.forEach(molecule => scene.add(molecule));


// Rendering the scene
const animate = () => {
  requestAnimationFrame(animate);

  molecules.forEach(molecule => {
    rotate(molecule);
    moveWithinVolume(molecule, invisibleVolume);
  });

  checkCollision(molecules);

  controls.update();
  renderer.render(scene, camera);
}

animate();