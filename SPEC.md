# Light Beam Effect - Spec Document

## Overview
WebGL/Three.js light beam effect - like a flashlight shining down from a fixed point.
The beam **rotates** around the light source (apex) to follow the mouse cursor.

## Figma Reference
- Design: https://www.figma.com/design/oVasmPVZuoLyC6fBKoOxlX/ego?node-id=2778-111030
- Use for **width reference only** (~392px at base)
- Beam should **extend to bottom of viewport**

---

## Key Behaviors

### Mouse Tracking (Rotation)
- Light source (apex) is **fixed** at top-center
- Beam **rotates** around apex to follow mouse (like flashlight)
- Mouse left → beam rotates left, mouse right → beam rotates right

### Visual Effect
- **Top (apex)**: concentrated, darker, less blur
- **Bottom (base)**: scattered, softer, more blur/fade
- Triangle extends from top to **bottom of viewport**
- Edges should be soft/blurred, not hard lines

---

## TODO Checklist

### Phase 0: Project Setup ✓
- [x] package.json, npm install, index.html, vite

### Phase 1: Rotating Beam + Basic Blur (CURRENT)
- [ ] **1.1** Light source fixed at top-center of screen
- [ ] **1.2** Triangle extends to bottom of viewport
- [ ] **1.3** Beam rotates around apex following mouse (rotation, not translation)
- [ ] **1.4** Basic shader: top=concentrated, bottom=scattered/soft
- [ ] **1.5** Soft edges (simple blur gradient)
- [ ] **1.6** Verify: beam rotates like flashlight, extends full height

### Phase 2: Visual Polish (LATER)
- [ ] Smooth rotation interpolation (lerp)
- [ ] Fine-tune blur/scatter parameters
- [ ] Animation effects

---

## Technical Approach

### Geometry
```
Apex (fixed):  (0, topY)           <- light source, doesn't move
Base left:     rotate(angle) from apex
Base right:    rotate(angle) from apex
```

### Rotation Math
```javascript
// Mouse X (-1 to 1) → rotation angle
const maxAngle = 0.3; // radians, ~17 degrees
const angle = mouseX * maxAngle;

// Base points rotate around apex
const baseY = -1.0; // bottom of viewport
const halfWidth = 0.28; // half of beam width at base

// Rotated positions
baseLeft.x  = apex.x + Math.sin(angle) * (baseY - apex.y) - Math.cos(angle) * halfWidth;
baseRight.x = apex.x + Math.sin(angle) * (baseY - apex.y) + Math.cos(angle) * halfWidth;
```

### Shader (Simple)
```glsl
// Vertical gradient: top=opaque, bottom=transparent
float fade = vUv.y; // 1 at top, 0 at bottom

// Horizontal soft edges
float edgeFade = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 2.0);

float alpha = fade * edgeFade * uOpacity;
```

---

## Configuration (`src/config.js`)

| Parameter | Value | Description |
|-----------|-------|-------------|
| `beam.width` | 0.56 | Base width (ref Figma 392px) |
| `beam.topY` | 1.0 | Apex Y (top of viewport) |
| `beam.bottomY` | -1.0 | Base Y (bottom of viewport) |
| `color` | '#555555' | Beam color |
| `opacity` | 0.6 | Max opacity at apex |
| `mouse.maxAngle` | 0.3 | Max rotation in radians (~17°) |

---

## File Structure
```
src/
├── config.js      # All parameters
├── main.js        # Scene, mouse events, render loop
└── LightBeam.js   # Geometry + shader material
```
