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

### 尝试 1: 双层三角形叠加 (commit 6e84ee1, reverted)

**方法**：
- 内层窄深 + 外层宽浅，两个三角形叠加
- fragment shader 使用 `exp(-x²)` 高斯衰减

**结果**：❌ 失败
- 两层三角形的边缘仍然清晰可见
- 看起来像两个重叠的三角形，不是柔和的光束
- 没有真正的模糊效果

**教训**：
- 单纯叠加多层三角形无法实现真正的模糊
- 需要不同的技术方案

---

## 待探索的方案

### 方案 A: Post-processing Blur
使用 Three.js 后处理，对渲染结果应用高斯模糊
- 优点：真正的模糊效果
- 缺点：性能开销，可能影响其他元素

### 方案 B: 更大的三角形 + 更激进的 shader 衰减
- 三角形做得更大（超出可见区域）
- shader 中使用更极端的衰减曲线
- 让实际可见的部分是衰减后的中心区域

### 方案 C: 径向渐变 Mesh
- 不用三角形，改用圆形/椭圆形几何体
- 从中心向外径向渐变
- 可能更接近真实光散射效果

### 方案 D: 纹理贴图
- 预制一张柔和光束的纹理图
- 直接作为贴图使用
- 优点：效果可控
- 缺点：不够灵活

---

## TODO

- [ ] 研究并选择一个可行方案
- [ ] 实现选定方案
- [ ] 对比目标效果图调参
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
