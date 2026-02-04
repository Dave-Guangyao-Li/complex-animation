# Light Beam Effect - Spec Document

## Overview
WebGL/Three.js light beam effect - like a flashlight shining down from a fixed point.
The beam **rotates** around the light source (apex) to follow the mouse cursor.

## Target Effect
参考 Figma 设计，目标效果特征：
- 光从顶点（光源）向下散射
- **极度柔和的边缘** — 像高斯模糊，完全没有硬边
- **顶点集中** — 光源点很小
- **向下渐淡** — 越往下越淡、越散
- **自然消失** — 底部没有截断感

## Figma Reference
- Design: https://www.figma.com/design/oVasmPVZuoLyC6fBKoOxlX/ego?node-id=2778-111030

---

## Current Status

### ✅ 已实现
- [x] 光源在画面中心，360度旋转跟随鼠标
- [x] 基础三角形几何体 + shader
- [x] 简单的垂直渐变和边缘渐变

### ❌ 待解决
- [ ] 边缘不够柔和（目前仍有明显三角形轮廓）
- [ ] 需要类似高斯模糊的散射效果
- [ ] 底部截断感明显

---

## 失败尝试记录

### 尝试 1: 双层三角形叠加 (reverted)

**方法**：
- 内层窄深 + 外层宽浅，两个三角形叠加
- fragment shader 使用 `exp(-x²)` 高斯衰减

**结果**：❌ 失败
- 两层三角形的边缘仍然清晰可见
- 看起来像两个重叠的三角形，不是柔和的光束
- 没有真正的模糊效果

**教训**：单纯叠加多层三角形无法实现真正的模糊

---

### 尝试 2: Post-Processing Bloom (pmndrs/postprocessing) (reverted)

**方法**：
- 使用 pmndrs/postprocessing 库的 BloomEffect
- shader 输出 HDR 值（brightness > 1.0）配合 Bloom

**尝试参数**：
- intensity: 1.5 - 4.0
- luminanceThreshold: 0 - 0.2
- radius: 0.5 - 1.0
- brightness (shader): 0.8 - 2.0

**结果**：❌ 失败
- 要么完全看不见（太淡）
- 要么只显示一条细线
- 要么三角形形状消失

**教训**：Bloom 对硬边半透明几何体效果不佳，需要发光源而非半透明形状

---

### 尝试 3: ConeGeometry + Additive Blending (reverted)

**方法**：
- 使用 THREE.ConeGeometry 替代手动三角形
- Additive Blending 模式产生光晕
- 自定义 shader 实现径向 + 垂直渐变

**参考资源**：
- threex.volumetricspotlight
- three-good-godrays
- Volumetric Light Scattering (Medium)

**结果**：❌ 失败
- Additive Blending 在浅色背景上几乎不可见（白+颜色≈白）
- 改用普通透明后，锥体边缘仍然硬
- ConeGeometry 的 UV 映射不适合 2D 光束效果
- 效果还不如原来的三角形方案

**教训**：
- Additive Blending 需要深色背景才有效果
- 3D ConeGeometry 不适合模拟 2D 光束
- 需要研究真正成功的实现案例

---

## 当前状态

回退到基础三角形实现。核心问题仍未解决：**如何让硬边三角形变成柔和散射的光束**。

需要分析成功案例的实现思路。

---

## TODO

- [x] 研究并选择一个可行方案
- [x] 尝试 ConeGeometry + Additive Blending (失败)
- [ ] 分析成功案例的实现思路
- [ ] 找到真正可行的柔和边缘方案
- [ ] 确保鼠标跟随仍然工作

---

## File Structure
```
src/
├── config.js      # All parameters
├── main.js        # Scene, mouse events, render loop
└── LightBeam.js   # Geometry + shader material
```

---

## Running
```bash
npm run dev     # Start dev server (http://localhost:5174/)
npm run build   # Production build
```
