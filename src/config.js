/**
 * Configuration - 双层光束配置
 */

export const CONFIG = {
  // 内层光束 (核心 - 窄、深)
  innerBeam: {
    width: 0.45,
    length: 1.6,
    opacity: 0.32,
    edgeSoftness: 3.0,      // 用于 exp() 衰减
    verticalPower: 0.35,
  },

  // 外层光晕 (散射 - 宽、浅)
  outerGlow: {
    width: 1.0,
    length: 2.0,
    opacity: 0.1,
    edgeSoftness: 2.0,      // 更柔和
    verticalPower: 0.25,
  },

  // 通用
  color: '#555555',

  // Scene
  scene: {
    backgroundColor: '#f5f5f5',
    frustumSize: 2,
  },
};
