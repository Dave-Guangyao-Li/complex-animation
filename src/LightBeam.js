/**
 * LightBeam - 双层柔和光束
 *
 * 内层：窄、集中的核心光束
 * 外层：宽、透明的散射光晕
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

// 使用 exp() 实现更柔和的高斯式衰减
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uEdgeSoftness;
  uniform float uVerticalPower;

  varying vec2 vUv;

  void main() {
    // 垂直渐变: 顶点(y=1)最亮，向底部(y=0)渐淡
    float verticalFade = pow(vUv.y, uVerticalPower);

    // 水平边缘: 使用 exp() 高斯式衰减，更柔和
    float centerDist = abs(vUv.x - 0.5) * 2.0;
    float edgeFade = exp(-centerDist * centerDist * uEdgeSoftness);

    // 底部淡出
    float baseFade = smoothstep(0.0, 0.25, vUv.y);

    // 顶点也稍微淡一点，避免太尖锐
    float apexFade = smoothstep(1.0, 0.92, vUv.y);

    float alpha = verticalFade * edgeFade * baseFade * apexFade * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

/**
 * 创建单层光束 mesh
 */
function createBeamMesh(beamConfig) {
  const positions = new Float32Array(9);
  const uvs = new Float32Array([
    0.5, 1.0,  // apex
    0.0, 0.0,  // base left
    1.0, 0.0,  // base right
  ]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(CONFIG.color) },
      uOpacity: { value: beamConfig.opacity },
      uEdgeSoftness: { value: beamConfig.edgeSoftness },
      uVerticalPower: { value: beamConfig.verticalPower },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  return { mesh: new THREE.Mesh(geometry, material), positions, config: beamConfig };
}

/**
 * 更新光束顶点位置
 */
function updateBeamPositions(beamData, mouseX, mouseY) {
  const { positions, config } = beamData;
  const { width, length } = config;

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

  // Apex
  positions[0] = apexX;
  positions[1] = apexY;
  positions[2] = 0;

  // Base left
  positions[3] = baseCenterX - perpX * halfWidth;
  positions[4] = baseCenterY - perpY * halfWidth;
  positions[5] = 0;

  // Base right
  positions[6] = baseCenterX + perpX * halfWidth;
  positions[7] = baseCenterY + perpY * halfWidth;
  positions[8] = 0;

  beamData.mesh.geometry.attributes.position.needsUpdate = true;
}

export class LightBeam {
  constructor() {
    // 创建双层
    this.outer = createBeamMesh(CONFIG.outerGlow);
    this.inner = createBeamMesh(CONFIG.innerBeam);

    // Group: 外层先添加（在后面），内层后添加（在前面）
    this.group = new THREE.Group();
    this.group.add(this.outer.mesh);
    this.group.add(this.inner.mesh);

    // 初始位置
    this.update(0, -1);
  }

  update(mouseX, mouseY) {
    updateBeamPositions(this.outer, mouseX, mouseY);
    updateBeamPositions(this.inner, mouseX, mouseY);
  }
}
