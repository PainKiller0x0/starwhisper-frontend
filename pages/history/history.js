const app = getApp();

Page({
  data: {
    historyList: [],
    isEmpty: false
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadHistory();
  },

  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      const historyList = wx.getStorageSync('starwhisper_history') || [];
      
      // 按时间倒序排列
      historyList.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
      
      this.setData({
        historyList: historyList,
        isEmpty: historyList.length === 0
      });
    } catch (e) {
      console.error('加载历史记录失败:', e);
      this.setData({
        historyList: [],
        isEmpty: true
      });
    }
  },

  /**
   * 查看详情
   */
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.historyList[index];
    
    if (item) {
      // 跳转到结果页面，传递数据
      const dataStr = encodeURIComponent(JSON.stringify({
        quote: item.quote,
        tags: item.tags,
        advice: item.advice
      }));
      
      wx.navigateTo({
        url: `/pages/result/result?data=${dataStr}&from=history`
      });
    }
  },

  /**
   * 删除单条记录
   */
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条星语记录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            const historyList = [...this.data.historyList];
            historyList.splice(index, 1);
            
            wx.setStorageSync('starwhisper_history', historyList);
            
            this.setData({
              historyList: historyList,
              isEmpty: historyList.length === 0
            });
            
            wx.showToast({
              title: '已删除',
              icon: 'success'
            });
          } catch (e) {
            console.error('删除记录失败:', e);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 清空所有记录
   */
  clearAll() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有星语记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.setStorageSync('starwhisper_history', []);
            
            this.setData({
              historyList: [],
              isEmpty: true
            });
            
            wx.showToast({
              title: '已清空',
              icon: 'success'
            });
          } catch (e) {
            console.error('清空记录失败:', e);
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 返回首页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 去测试
   */
  goTest() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});