const platform = require('./utils/platform');

App({
  onLaunch() {
    console.log('StarWhisper Miniprogram launched.');
    
    // 初始化平台检测
    this.initPlatform();
  },

  /**
   * 初始化平台信息
   */
  async initPlatform() {
    try {
      const deviceInfo = await platform.getDeviceInfo();
      const apiConfig = await platform.getApiConfig();
      
      this.globalData.deviceInfo = deviceInfo;
      this.globalData.apiConfig = apiConfig;
      this.globalData.platform = deviceInfo.platformType;
      
      console.log('Platform detected:', deviceInfo.platformType);
      console.log('Device info:', deviceInfo);
      
      // 如果是 HarmonyOS，进行特定初始化
      if (deviceInfo.platformType === platform.PLATFORM.HARMONY) {
        this.initHarmonyOptimizations();
      }
    } catch (err) {
      console.error('Platform detection failed:', err);
      this.globalData.platform = platform.PLATFORM.UNKNOWN;
    }
  },

  /**
   * HarmonyOS 特定优化
   */
  initHarmonyOptimizations() {
    console.log('Initializing HarmonyOS optimizations...');
    
    // HarmonyOS 可能需要特定的配置
    this.globalData.harmonyOptimized = true;
    
    // 可以在这里添加 HarmonyOS 特定的初始化逻辑
    // 例如：调整动画参数、优化渲染策略等
  },

  /**
   * 检查是否支持新API
   */
  checkApiSupport(apiName) {
    if (this.globalData.apiConfig) {
      return this.globalData.apiConfig.supportNewApi;
    }
    return typeof wx[apiName] === 'function';
  },

  globalData: {
    userInfo: null,
    backendUrl: 'http://8.134.192.197:3005',
    platform: null,
    deviceInfo: null,
    apiConfig: null,
    harmonyOptimized: false
  }
});