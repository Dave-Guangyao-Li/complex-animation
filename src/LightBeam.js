/**
 * LightBeam - rotating light beam with soft edges.
 *
 * Apex fixed at CENTER of screen, beam rotates 360° following mouse.
 * Outputs HDR values to work with Bloom post-processing.
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

// Fragment shader 输出 HDR 值，配合 Bloom 后处理
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uBrightness;

  varying vec2 vUv;

  void main() {
    // 垂直渐变: 顶点亮，底部淡
    float verticalFade = pow(vUv.y, 0.4);

    // 水平边缘: 中心亮，边缘淡
    float centerDist = abs(vUv.x - 0.5) * 2.0;
    float edgeFade = 1.0 - pow(centerDist, 1.2);

    // 底部淡出
    float baseFade = smoothstep(0.0, 0.2, vUv.y);

    float alpha = verticalFade * edgeFade * baseFade * uOpacity;

    // 输出 HDR 值 (brightness > 1.0)，让 Bloom 生效
    gl_FragColor = vec4(uColor * uBrightness, alpha);
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
        uBrightness: { value: CONFIG.brightness },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,  // 重要：禁用 tone mapping 保留 HDR 值
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.update(0, -1);  // 初始指向下方
  }

  update(mouseX, mouseY) {
    const { width, length } = CONFIG.beam;

    const apexX = 0;
    const apexY = 0;

    const angle = Math.atan2(mouseY, mouseX);
    const halfWidth = width / 2;

    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const perpX = -dirY;
    const perpY = dirX;

    const baseCenterX = apexX + dirX * length;
    const baseCenterY = apexY + dirY * length;

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
