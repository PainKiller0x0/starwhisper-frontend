const app = getApp();

Page({
  data: {
    reading: null,
    todayDate: ''
  },

  onLoad(options) {
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
  },

  // 返回首页
  goBack() {
    wx.navigateBack();
  },

  // 保存图片到相册
  saveImage() {
    wx.showToast({
      title: '请长按海报保存',
      icon: 'none'
    });
  }
});