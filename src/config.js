/**
 * Light Beam Effect Configuration
 *
 * All adjustable parameters are centralized here for easy debugging and tuning.
 * Modify values here to change the visual effect without touching the code.
 */

export const LIGHT_BEAM_CONFIG = {
  // Geometry parameters
  geometry: {
    apexY: 0.9,           // Apex (top) Y coordinate
    baseY: -0.7,          // Base (bottom) Y coordinate
    baseWidth: 0.8,       // Width at the base
  },

  // Shader parameters
  shader: {
    color: '#404045',     // Beam color (dark gray)
    softness: 0.3,        // Edge softness (0-1, higher = more blur)
    opacity: 0.35,        // Overall opacity (0-1)
    verticalPower: 0.7,   // Vertical gradient curve exponent
    apexFade: 0.85,       // Apex fade position (0-1)
    baseFade: 0.15,       // Base fade position (0-1)
  },

  // Scene parameters
  scene: {
    backgroundColor: '#f5f5f5',
    cameraFrustumSize: 2,
  },

  // Future extensions (not implemented yet, structure prepared)
  animation: {
    enabled: false,
    pulseSpeed: 2.0,
    pulseAmount: 0.1,
  },

  mouse: {
    enabled: false,
    trackingStrength: 0.3,
  },
};
