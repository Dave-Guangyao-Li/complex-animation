/**
 * LightBeam - rotating light beam with soft edges.
 *
 * Apex fixed at CENTER of screen, beam rotates 360° following mouse.
 */

import * as THREE from 'three';
import { CONFIG } from './config.js';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    // Vertical: apex (y=1) is opaque, base (y=0) fades out
    float verticalFade = pow(vUv.y, 0.5);

    // Horizontal: center is opaque, edges fade
    float centerDist = abs(vUv.x - 0.5) * 2.0;
    float edgeFade = 1.0 - pow(centerDist, 1.5);

    float alpha = verticalFade * edgeFade * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export class LightBeam {
  constructor() {
    this.positions = new Float32Array(9);
    this.uvs = new Float32Array([
      0.5, 1.0,  // apex
      0.0, 0.0,  // base left
      1.0, 0.0,  // base right
    ]);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(this.uvs, 2));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(CONFIG.color) },
        uOpacity: { value: CONFIG.opacity },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.update(0, 0);
  }

  /**
   * Update beam rotation based on mouse position.
   * @param {number} mouseX - normalized mouse X (-1 to 1)
   * @param {number} mouseY - normalized mouse Y (-1 to 1)
   */
  update(mouseX, mouseY) {
    const { width, length } = CONFIG.beam;

    // Apex at center of screen
    const apexX = 0;
    const apexY = 0;

    // Calculate angle from center to mouse position (360° rotation)
    const angle = Math.atan2(mouseY, mouseX);

    const halfWidth = width / 2;

    // Direction from apex toward mouse
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    // Perpendicular for base width
    const perpX = -dirY;
    const perpY = dirX;

    // Base center is at apex + direction * length
    const baseCenterX = apexX + dirX * length;
    const baseCenterY = apexY + dirY * length;

    // Base left and right
    const leftX = baseCenterX - perpX * halfWidth;
    const leftY = baseCenterY - perpY * halfWidth;
    const rightX = baseCenterX + perpX * halfWidth;
    const rightY = baseCenterY + perpY * halfWidth;

    // Apex
    this.positions[0] = apexX;
    this.positions[1] = apexY;
    this.positions[2] = 0;

    // Base left
    this.positions[3] = leftX;
    this.positions[4] = leftY;
    this.positions[5] = 0;

    // Base right
    this.positions[6] = rightX;
    this.positions[7] = rightY;
    this.positions[8] = 0;

    this.geometry.attributes.position.needsUpdate = true;
  }
}
