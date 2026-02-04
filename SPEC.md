# Light Beam Effect - Spec Document

## Overview
WebGL/Three.js implementation of a triangular light beam effect with soft blur edges for login page animation.

---

## TODO Checklist (Spec-Driven)

### Phase 0: Project Setup
- [x] **0.1** Create `package.json` with three.js and vite dependencies
- [x] **0.2** Run `npm install` - node_modules exists
- [x] **0.3** Create `index.html` with basic structure
- [x] **0.4** Verify `npm run dev` starts successfully

### Phase 1: Basic Scene
- [x] **1.1** Create `src/main.js` with Three.js scene
- [x] **1.2** Add OrthographicCamera (no perspective distortion)
- [x] **1.3** Add resize event handler

### Phase 2: Triangle Geometry
- [x] **2.1** Create `src/config.js` - centralized configuration
- [x] **2.2** Create `src/LightBeam.js` with BufferGeometry
- [x] **2.3** Set up UV coordinates for shader calculations

### Phase 3: Shader Implementation
- [x] **3.1** Create ShaderMaterial framework
- [x] **3.2** Implement vertical gradient (apex to base)
- [x] **3.3** Implement horizontal soft edge effect
- [x] **3.4** Add apex and base fade-out

### Phase 4: Visual Tuning
- [ ] **4.1** Adjust uniforms to match Figma design
- [ ] **4.2** Test on different viewport sizes
- [ ] **4.3** Document final configuration values

### Phase 5: Future Extensions (Not Implemented)
- [ ] **5.1** Mouse tracking - beam follows cursor
- [ ] **5.2** Expand animation - beam opens/closes
- [ ] **5.3** Multiple beams support

---

## Technical Stack
- **Three.js** - WebGL rendering
- **Vite** - Build tool and dev server
- **Custom GLSL Shaders** - Soft edge blur effect

---

## File Structure
```
complex-animation/
├── SPEC.md                   # This spec document
├── package.json              # Dependencies
├── index.html                # Entry HTML
└── src/
    ├── config.js             # Configuration center
    ├── main.js               # Scene setup, render loop
    └── LightBeam.js          # Light beam component + shaders
```

---

## Configuration Reference (`src/config.js`)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `geometry.apexY` | 0.9 | Apex (top) Y coordinate |
| `geometry.baseY` | -0.7 | Base (bottom) Y coordinate |
| `geometry.baseWidth` | 0.8 | Width at base |
| `shader.color` | '#404045' | Beam color (dark gray) |
| `shader.softness` | 0.3 | Edge blur amount (0-1) |
| `shader.opacity` | 0.35 | Overall opacity (0-1) |
| `shader.verticalPower` | 0.7 | Vertical gradient curve |
| `shader.apexFade` | 0.85 | Apex fade position |
| `shader.baseFade` | 0.15 | Base fade position |

---

## Shader Algorithm

### Fragment Shader Core Logic
```glsl
// 1. Vertical gradient - fade from apex to base
float verticalGradient = 1.0 - pow(1.0 - vUv.y, uVerticalPower);

// 2. Horizontal soft edges - distance from center axis
float centerDist = abs(vUv.x - 0.5) * 2.0;
float beamWidth = max(1.0 - vUv.y, 0.001);
float edgeFactor = centerDist / beamWidth;
float softEdge = 1.0 - smoothstep(1.0 - uSoftness, 1.0, edgeFactor);

// 3. Combine for final alpha
float alpha = verticalGradient * softEdge * uOpacity;
```

---

## Verification Checkpoints

| Phase | What to Verify | How to Verify | If Failed |
|-------|----------------|---------------|-----------|
| 0 | Project runs | `npm run dev` no errors | Check node version, dependencies |
| 1 | Scene renders | Browser shows gray background | Check renderer.domElement mount |
| 2 | Triangle visible | See solid triangle | Check geometry vertices, camera position |
| 3.2 | Vertical gradient | Brighter at top, fades down | Check vUv.y, shader uniforms |
| 3.3 | Soft edges | Blurred edges, not hard | Adjust uSoftness, check smoothstep |
| 4 | Visual match | Compare with Figma | Tune config parameters |

---

## Debugging Tips

Output debug colors in fragment shader:
```glsl
// Debug UV coordinates
gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);

// Debug vertical gradient
gl_FragColor = vec4(vec3(verticalGradient), 1.0);

// Debug soft edge
gl_FragColor = vec4(vec3(softEdge), 1.0);
```

---

## Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Figma Reference
Design: https://www.figma.com/design/oVasmPVZuoLyC6fBKoOxlX/ego?node-id=2778-111030
