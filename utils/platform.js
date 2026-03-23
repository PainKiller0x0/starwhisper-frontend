/**
 * 平台检测工具
 * 用于判断当前运行平台，进行兼容性处理
 */

// 平台类型
const PLATFORM = {
  WECHAT: 'wechat',        // 微信（iOS/Android）
  HARMONY: 'harmony',      // HarmonyOS
  UNKNOWN: 'unknown'
};

/**
 * 获取设备平台信息
 * @returns {Promise<Object>} 平台信息
 */
function getDeviceInfo() {
  return new Promise((resolve) => {
    // 基础库 3.7.0+ 支持 wx.getDeviceInfo
    if (wx.getDeviceInfo) {
      wx.getDeviceInfo({
        success: (res) => {
          resolve({
            platform: res.platform,
            brand: res.brand,
            model: res.model,
            system: res.system,
            platformType: detectPlatformType(res)
          });
        },
        fail: () => {
          resolve({
            platform: 'unknown',
            platformType: PLATFORM.UNKNOWN
          });
        }
      });
    } else {
      // 低版本基础库，使用旧API
      const systemInfo = wx.getSystemInfoSync();
      resolve({
        platform: systemInfo.platform,
        brand: systemInfo.brand,
        model: systemInfo.model,
        system: systemInfo.system,
        platformType: detectPlatformType(systemInfo)
      });
    }
  });
}

/**
 * 检测平台类型
 * @param {Object} info 设备信息
 * @returns {string} 平台类型
 */
function detectPlatformType(info) {
  const platform = (info.platform || '').toLowerCase();
  const system = (info.system || '').toLowerCase();

  // HarmonyOS 检测
  if (
    platform.includes('harmony') ||
    system.includes('harmony') ||
    info.brand === 'HUAWEI' && system.includes('harmony')
  ) {
    return PLATFORM.HARMONY;
  }

  // 微信平台
  if (platform === 'ios' || platform === 'android') {
    return PLATFORM.WECHAT;
  }

  return PLATFORM.UNKNOWN;
}

/**
 * 检查是否为 HarmonyOS
 * @returns {Promise<boolean>}
 */
async function isHarmonyOS() {
  const info = await getDeviceInfo();
  return info.platformType === PLATFORM.HARMONY;
}

/**
 * 检查是否为微信平台
 * @returns {Promise<boolean>}
 */
async function isWechat() {
  const info = await getDeviceInfo();
  return info.platformType === PLATFORM.WECHAT;
}

/**
 * 获取适配后的样式
 * HarmonyOS 和微信在某些CSS属性上有差异
 * @param {Object} styles 原始样式
 * @returns {Promise<Object>} 适配后的样式
 */
async function getAdaptedStyles(styles) {
  const info = await getDeviceInfo();
  const adaptedStyles = { ...styles };

  if (info.platformType === PLATFORM.HARMONY) {
    // HarmonyOS 特定适配
    // 例如：某些动画可能需要调整
    if (adaptedStyles.animation) {
      // HarmonyOS 对某些动画支持可能不同
      adaptedStyles.animationDuration = '0.3s';
    }

    // 背景渐变兼容
    if (adaptedStyles.background && adaptedStyles.background.includes('gradient')) {
      // HarmonyOS 对某些渐变语法支持可能不同
      adaptedStyles.background = adaptedStyles.background;
    }
  }

  return adaptedStyles;
}

/**
 * 获取API兼容性配置
 * @returns {Promise<Object>} API配置
 */
async function getApiConfig() {
  const info = await getDeviceInfo();

  return {
    // 基础库版本
    supportNewApi: typeof wx.getDeviceInfo === 'function',
    // 平台信息
    platform: info.platformType,
    // HarmonyOS 特定配置
    harmonyConfig: info.platformType === PLATFORM.HARMONY ? {
      // HarmonyOS 可能对某些API有特殊处理
      useNewApi: true,
      animationOptimization: true
    } : null
  };
}

module.exports = {
  PLATFORM,
  getDeviceInfo,
  isHarmonyOS,
  isWechat,
  getAdaptedStyles,
  getApiConfig,
  detectPlatformType
};