/**
 * Light Beam Effect - Main Entry
 *
 * Initializes Three.js scene with orthographic camera for 2D-like rendering.
 */

import * as THREE from 'three';
import { LIGHT_BEAM_CONFIG } from './config.js';
import { createLightBeam } from './LightBeam.js';

const { scene: sceneConfig } = LIGHT_BEAM_CONFIG;

// ============ Scene Setup ============
const scene = new THREE.Scene();
scene.background = new THREE.Color(sceneConfig.backgroundColor);

// ============ Orthographic Camera ============
// Using orthographic camera for 2D-like appearance (no perspective distortion)
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = sceneConfig.cameraFrustumSize;

const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2,  // left
  frustumSize * aspect / 2,   // right
  frustumSize / 2,            // top
  -frustumSize / 2,           // bottom
  0.1,                        // near
  100                         // far
);
camera.position.z = 1;

// ============ Renderer ============
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// ============ Light Beam ============
const lightBeam = createLightBeam();
scene.add(lightBeam);

// ============ Resize Handler ============
window.addEventListener('resize', () => {
  const newAspect = window.innerWidth / window.innerHeight;

  camera.left = -frustumSize * newAspect / 2;
  camera.right = frustumSize * newAspect / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ Render Loop ============
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Log for debugging
console.log('Light Beam Effect initialized');
console.log('Config:', LIGHT_BEAM_CONFIG);
