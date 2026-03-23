const app = getApp();
const platform = require('../../utils/platform');

Page({
  data: {
    reading: null,
    todayDate: '',
    platform: 'unknown'
  },

  async onLoad(options) {
    // 获取传递的数据
    if (options.data) {
      try {
        const reading = JSON.parse(decodeURIComponent(options.data));
        this.setData({ reading });
      } catch (e) {
        console.error('解析数据失败:', e);
      }
    }

    // 格式化日期
    const d = new Date();
    this.setData({
      todayDate: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    });

    // 获取平台信息
    await this.initPlatform();
  },

  /**
   * 初始化平台信息
   */
  async initPlatform() {
    try {
      const deviceInfo = await platform.getDeviceInfo();
      this.setData({
        platform: deviceInfo.platformType
      });
      
      // 如果是 HarmonyOS，进行特定适配
      if (deviceInfo.platformType === platform.PLATFORM.HARMONY) {
        this.applyHarmonyAdaptations();
      }
    } catch (err) {
      console.error('Platform init failed:', err);
    }
  },

  /**
   * 应用 HarmonyOS 适配
   */
  applyHarmonyAdaptations() {
    console.log('Applying HarmonyOS adaptations to result page...');
    
    // HarmonyOS 对长按保存的处理可能不同
    // 可以在这里添加特定的提示或处理逻辑
  },

  /**
   * 返回首页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 保存图片到相册
   * 注意：HarmonyOS 和微信的保存逻辑可能不同
   */
  saveImage() {
    // 根据平台显示不同的提示
    if (this.data.platform === platform.PLATFORM.HARMONY) {
      wx.showToast({
        title: '请长按海报保存',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: '请长按海报保存',
        icon: 'none'
      });
    }
  }
});