/**
 * Configuration - all adjustable parameters.
 */

export const CONFIG = {
  // Beam geometry
  beam: {
    width: 0.7,       // base width (wider, 矮胖)
    length: 0.9,      // beam length from apex (shorter)
  },

  // Appearance
  color: '#555555',
  opacity: 0.6,

  // Scene
  scene: {
    backgroundColor: '#f5f5f5',
    frustumSize: 2,
  },

  // Mouse rotation - 360 degrees
  mouse: {
    // No max angle limit - full 360 rotation
  },
};
