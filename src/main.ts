import * as THREE from 'three';
import { createScene } from './lib/scene';
import { createInvisibleVolume } from './lib/geometry';
import { createCubes } from './lib/geometry';
import { rotate, move } from './lib/animation';

const { scene, camera, renderer, controls } = createScene();

// Adding the invisible volume to the scene
const invisibleVolume = createInvisibleVolume();
scene.add(invisibleVolume);

// Adding the cubes to the scene
const cubes = createCubes(1);
cubes.forEach(cube => scene.add(cube));


// Rendering the scene
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  cubes.forEach(cube => {
    rotate(cube);
    move(cube, invisibleVolume);
  });
  renderer.render(scene, camera);
}
animate();