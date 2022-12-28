import * as THREE from 'three';
import { createScene } from './lib/scene';
import { createInvisibleVolume } from './lib/geometry';

const { scene, camera, renderer, controls } = createScene();

// Adding the invisible volume to the scene
const invisibleVolume = createInvisibleVolume();
scene.add(invisibleVolume);


// Rendering the scene
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();