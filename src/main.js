/**
 * Main - scene setup with post-processing bloom effect.
 */

import * as THREE from 'three';
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  KernelSize
} from 'postprocessing';
import { CONFIG } from './config.js';
import { LightBeam } from './LightBeam.js';

// ---- Scene ----
const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.scene.backgroundColor);

// ---- Orthographic Camera ----
const frustum = CONFIG.scene.frustumSize;
let aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(
  -frustum * aspect / 2,
   frustum * aspect / 2,
   frustum / 2,
  -frustum / 2,
  0.1, 100
);
camera.position.z = 1;

// ---- Renderer ----
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// ---- Light Beam ----
const beam = new LightBeam();
scene.add(beam.mesh);

// ---- Post-Processing: Bloom Effect ----
const composer = new EffectComposer(renderer);

// First pass: render the scene
composer.addPass(new RenderPass(scene, camera));

// Second pass: bloom effect
const bloomEffect = new BloomEffect({
  intensity: CONFIG.bloom.intensity,
  luminanceThreshold: CONFIG.bloom.luminanceThreshold,
  luminanceSmoothing: CONFIG.bloom.luminanceSmoothing,
  mipmapBlur: true,
  radius: CONFIG.bloom.radius,
  kernelSize: KernelSize.LARGE,
});

composer.addPass(new EffectPass(camera, bloomEffect));

// ---- Mouse State ----
let mouseX = 0;
let mouseY = -1;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
});

// ---- Resize ----
window.addEventListener('resize', () => {
  aspect = window.innerWidth / window.innerHeight;
  camera.left = -frustum * aspect / 2;
  camera.right = frustum * aspect / 2;
  camera.updateProjectionMatrix();

  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  composer.setSize(width, height);
});

// ---- Render Loop ----
function animate() {
  requestAnimationFrame(animate);
  beam.update(mouseX, mouseY);
  composer.render();  // 使用 composer 而不是 renderer
}

animate();

console.log('Light Beam with Bloom initialized');
console.log('Bloom config:', CONFIG.bloom);
