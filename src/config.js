/**
 * Configuration - all adjustable parameters.
 */

export const CONFIG = {
  // Beam geometry
  beam: {
    width: 0.8,
    length: 1.5,
  },

  // Appearance - 加深颜色
  color: '#333333',
  opacity: 1.0,
  brightness: 0.8,    // 降低，避免被 bloom 冲淡

  // Bloom 后处理参数 - 降低强度
  bloom: {
    intensity: 1.5,           // 降低
    luminanceThreshold: 0.2,  // 提高阈值
    luminanceSmoothing: 0.5,
    radius: 0.5,
  },

  // Scene
  scene: {
    backgroundColor: '#f5f5f5',
    frustumSize: 2,
  },
};
