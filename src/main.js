/**
 * Main - scene setup, mouse tracking, render loop.
 */

import * as THREE from 'three';
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
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// ---- Light Beam ----
const beam = new LightBeam();
scene.add(beam.mesh);

// ---- Mouse State ----
let mouseX = 0;
let mouseY = -1; // Start pointing down

window.addEventListener('mousemove', (e) => {
  // Normalize to -1 to 1, with Y flipped (screen Y is inverted)
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
});

// ---- Resize ----
window.addEventListener('resize', () => {
  aspect = window.innerWidth / window.innerHeight;
  camera.left   = -frustum * aspect / 2;
  camera.right  =  frustum * aspect / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- Render Loop ----
function animate() {
  requestAnimationFrame(animate);
  beam.update(mouseX, mouseY);
  renderer.render(scene, camera);
}

animate();
