const app = getApp();

Page({
  data: {
    step: 'input', // 'input', 'loading'
    name: '',
    trouble: ''
  },

  onLoad() {
    // 页面加载
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

    wx.request({
      url: `${app.globalData.backendUrl}/api/generate-reading`,
      method: 'POST',
      data: {
        name: this.data.name,
        trouble: this.data.trouble
      },
      success: (res) => {
        if (res.data && res.data.quote) {
          // 跳转到结果页面
          const dataStr = encodeURIComponent(JSON.stringify(res.data));
          wx.navigateTo({
            url: `/pages/result/result?data=${dataStr}`
          });
          this.setData({ step: 'input' });
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
