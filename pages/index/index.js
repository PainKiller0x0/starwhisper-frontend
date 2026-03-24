const app = getApp();
const platform = require('../../utils/platform');

Page({
  data: {
    step: 'input', // 'input', 'breathing', 'flying', 'result'
    name: '',
    trouble: '',
    platform: 'unknown',
    deviceInfo: null,
    reading: null,
    todayDate: ''
  },

  async onLoad() {
    // 获取平台信息
    await this.initPlatform();
    
    // 设置日期
    const d = new Date();
    this.setData({
      todayDate: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    });
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
      trouble: '',
      reading: null
    });
  },

  /**
   * 保存到历史记录
   */
  saveToHistory(reading) {
    try {
      const d = new Date();
      const dateStr = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
      
      const historyItem = {
        quote: reading.quote,
        tags: reading.tags || [],
        advice: reading.advice || '',
        name: this.data.name,
        trouble: this.data.trouble,
        date: dateStr,
        createTime: d.toISOString()
      };
      
      // 获取现有历史记录
      let historyList = wx.getStorageSync('starwhisper_history') || [];
      
      // 添加新记录到开头
      historyList.unshift(historyItem);
      
      // 限制最多保存50条记录
      if (historyList.length > 50) {
        historyList = historyList.slice(0, 50);
      }
      
      // 保存到本地存储
      wx.setStorageSync('starwhisper_history', historyList);
      
      console.log('历史记录已保存');
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  },

  /**
   * 跳转到历史页面
   */
  goHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  /**
   * 显示深度解析提示
   */
  showAnalysisTip() {
    wx.showModal({
      title: '深度解析',
      content: '深度解析功能即将上线，敬请期待！\n\n如需体验，请添加助理微信获取专属星盘解析。',
      showCancel: false,
      confirmText: '我知道了'
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

    // 开始呼吸动画
    this.setData({ step: 'breathing' });

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
          // 呼吸动画持续2秒，然后开始飞行动画
          setTimeout(() => {
            // 切换到飞行阶段
            this.setData({ 
              step: 'flying',
              reading: res.data
            });
            
            // 保存历史记录
            this.saveToHistory(res.data);
            
            // 飞行动画持续1.2秒，然后显示结果
            setTimeout(() => {
              this.setData({ step: 'result' });
            }, 1200);
          }, 2000);
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
  },
});