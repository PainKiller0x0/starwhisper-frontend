const app = getApp();
const platform = require('../../utils/platform');

Page({
  data: {
    step: 'input', // 'input', 'loading'
    name: '',
    trouble: '',
    platform: 'unknown',
    deviceInfo: null
  },

  async onLoad() {
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
        platform: deviceInfo.platformType,
        deviceInfo: deviceInfo
      });
      
      console.log('Current platform:', deviceInfo.platformType);
      
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
    console.log('Applying HarmonyOS adaptations...');
    
    // HarmonyOS 可能需要调整动画参数
    // 可以在这里设置特定的数据或样式
  },

  resetFlow() {
    this.setData({
      step: 'input',
      name: '',
      trouble: ''
    });
  },

  generateReading() {
    if (!this.data.name) {
      wx.showToast({ title: '请告诉我你的名字或昵称', icon: 'none' });
      return;
    }
    if (!this.data.trouble) {
      wx.showToast({ title: '请简单描述你当下的困扰', icon: 'none' });
      return;
    }

    this.setData({ step: 'loading' });

    // 根据平台选择不同的请求方式
    this.requestReading();
  },

  /**
   * 请求星语数据
   */
  requestReading() {
    wx.request({
      url: `${app.globalData.backendUrl}/api/generate-reading`,
      method: 'POST',
      data: {
        name: this.data.name,
        trouble: this.data.trouble
      },
      success: (res) => {
        if (res.data && res.data.quote) {
          // 添加延迟，让加载动画更优雅
          setTimeout(() => {
            // 跳转到结果页面
            const dataStr = encodeURIComponent(JSON.stringify(res.data));
            wx.navigateTo({
              url: `/pages/result/result?data=${dataStr}`,
              success: () => {
                // 跳转成功后重置状态
                setTimeout(() => {
                  this.setData({ step: 'input' });
                }, 300);
              }
            });
          }, 800);
        } else {
          wx.showToast({ title: res.data.error || '请求失败', icon: 'none' });
          this.setData({ step: 'input' });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '星空连接失败，请稍后再试', icon: 'none' });
        console.error(err);
        this.setData({ step: 'input' });
      }
    });
  }
});