/**
 * Light Beam Component
 *
 * Creates a triangle mesh with custom shader material for soft edge blur effect.
 * The effect simulates light shining down from a point source.
 */

import * as THREE from 'three';
import { LIGHT_BEAM_CONFIG } from './config.js';

// ============ Shader Source ============

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uSoftness;
  uniform float uOpacity;
  uniform float uVerticalPower;
  uniform float uApexFade;
  uniform float uBaseFade;

  varying vec2 vUv;

  void main() {
    // === 1. Vertical gradient (from apex to base) ===
    // vUv.y: 1.0 at apex, 0.0 at base
    float distFromApex = 1.0 - vUv.y;
    float verticalGradient = 1.0 - pow(distFromApex, uVerticalPower);

    // === 2. Horizontal soft edges ===
    // Distance from center axis (0 at center, 1 at edges)
    float centerDist = abs(vUv.x - 0.5) * 2.0;

    // Expected beam width at this height (0 at apex, 1 at base)
    float beamWidth = max(1.0 - vUv.y, 0.001);

    // How close to edge (0 = center, 1 = edge)
    float edgeFactor = centerDist / beamWidth;

    // Soft edge falloff using smoothstep
    float softEdge = 1.0 - smoothstep(1.0 - uSoftness, 1.0 + uSoftness * 0.5, edgeFactor);

    // === 3. Combine gradients ===
    float alpha = verticalGradient * softEdge * uOpacity;

    // === 4. Additional fades ===
    // Fade at bottom edge (avoid hard cutoff)
    alpha *= smoothstep(0.0, uBaseFade, vUv.y);

    // Fade near apex (avoid hard point)
    alpha *= smoothstep(1.0, uApexFade, vUv.y);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ============ Factory Function ============

/**
 * Creates a light beam mesh with configurable parameters
 * @param {Object} overrides - Optional overrides for config values
 * @returns {THREE.Mesh} The light beam mesh
 */
export function createLightBeam(overrides = {}) {
  const { geometry: geoConfig, shader: shaderConfig } = LIGHT_BEAM_CONFIG;

  // Merge overrides
  const geo = { ...geoConfig, ...overrides.geometry };
  const shader = { ...shaderConfig, ...overrides.shader };

  // ============ Triangle Geometry ============
  const geometry = new THREE.BufferGeometry();

  // Triangle vertices: apex at top center, base at bottom
  const vertices = new Float32Array([
    0.0, geo.apexY, 0.0,                    // Apex (top center)
    -geo.baseWidth / 2, geo.baseY, 0.0,     // Bottom left
    geo.baseWidth / 2, geo.baseY, 0.0       // Bottom right
  ]);

  // UV coordinates for shader calculations
  // Apex: (0.5, 1.0), Bottom-left: (0, 0), Bottom-right: (1, 0)
  const uvs = new Float32Array([
    0.5, 1.0,   // Apex
    0.0, 0.0,   // Bottom left
    1.0, 0.0    // Bottom right
  ]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  // ============ Shader Material ============
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(shader.color) },
      uSoftness: { value: shader.softness },
      uOpacity: { value: shader.opacity },
      uVerticalPower: { value: shader.verticalPower },
      uApexFade: { value: shader.apexFade },
      uBaseFade: { value: shader.baseFade },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  return new THREE.Mesh(geometry, material);
}
