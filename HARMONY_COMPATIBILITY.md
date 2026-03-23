# HarmonyOS 兼容性处理

## 概述

微信小程序基础库从 3.7.0 起正式支持 HarmonyOS 平台。本项目已进行兼容性处理，确保在 HarmonyOS 上也能获得最佳体验。

## 基础库版本

- **最低版本**：3.7.0
- **当前版本**：3.7.0（已在 `project.config.json` 中配置）

## 平台检测

### 使用 wx.getDeviceInfo()

```javascript
// 获取设备信息
wx.getDeviceInfo({
  success: (res) => {
    console.log('Platform:', res.platform);
    console.log('Brand:', res.brand);
    console.log('System:', res.system);
  }
});
```

### 平台判断逻辑

```javascript
// 检测是否为 HarmonyOS
function isHarmonyOS(info) {
  const platform = (info.platform || '').toLowerCase();
  const system = (info.system || '').toLowerCase();
  
  return (
    platform.includes('harmony') ||
    system.includes('harmony') ||
    (info.brand === 'HUAWEI' && system.includes('harmony'))
  );
}
```

## 兼容性处理

### 1. 平台检测工具 (`utils/platform.js`)

```javascript
const platform = require('./utils/platform');

// 获取平台信息
const deviceInfo = await platform.getDeviceInfo();

// 检查是否为 HarmonyOS
const isHarmony = await platform.isHarmonyOS();

// 获取适配后的样式
const adaptedStyles = await platform.getAdaptedStyles(styles);
```

### 2. 页面适配

每个页面都添加了平台检测：

```javascript
Page({
  data: {
    platform: 'unknown'
  },

  async onLoad() {
    // 初始化平台信息
    await this.initPlatform();
  },

  async initPlatform() {
    const deviceInfo = await platform.getDeviceInfo();
    this.setData({ platform: deviceInfo.platformType });
    
    if (deviceInfo.platformType === platform.PLATFORM.HARMONY) {
      this.applyHarmonyAdaptations();
    }
  },

  applyHarmonyAdaptations() {
    // HarmonyOS 特定适配逻辑
  }
});
```

### 3. API 兼容性

```javascript
// 检查 API 支持
if (wx.getDeviceInfo) {
  // 使用新 API
} else {
  // 回退到旧 API
  const systemInfo = wx.getSystemInfoSync();
}
```

## HarmonyOS 特定优化

### 动画优化

HarmonyOS 对某些动画的支持可能不同：

```javascript
// 调整动画参数
if (platform === 'harmony') {
  // 使用更简单的动画
  animationDuration: '0.3s';
}
```

### 渲染优化

```javascript
// HarmonyOS 渲染优化
if (harmonyOptimized) {
  // 减少复杂的 CSS 渐变
  // 优化重绘性能
}
```

## 已适配的功能

- ✅ 平台检测
- ✅ 设备信息获取
- ✅ 页面跳转
- ✅ 网络请求
- ✅ Toast 提示
- ✅ 动画效果
- ✅ 背景渐变

## 测试建议

### 1. HarmonyOS 设备测试

在 HarmonyOS 设备上测试以下功能：
- 页面加载和显示
- 输入框交互
- 按钮点击
- 网络请求
- 页面跳转
- 动画效果

### 2. 微信开发者工具测试

使用微信开发者工具的模拟器测试：
1. 选择「自定义编译」
2. 设置基础库版本为 3.7.0+
3. 测试各功能是否正常

## 注意事项

1. **基础库版本**：必须使用 3.7.0 或更高版本
2. **API 兼容**：某些新 API 在低版本微信中不可用，需要做降级处理
3. **样式兼容**：HarmonyOS 对某些 CSS 属性的支持可能不同
4. **性能优化**：HarmonyOS 设备性能可能不同，需要优化动画和渲染

## 相关链接

- [微信小程序 HarmonyOS 支持指南](https://developers.weixin.qq.com/community/develop/doc/00008e041106f0259bb33530164409)
- [wx.getDeviceInfo API 文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getDeviceInfo.html)
- [基础库版本兼容性](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)

## 更新日志

### v1.0.0 (2026-03-23)
- ✨ 添加 HarmonyOS 平台检测
- ✨ 创建平台工具类 (`utils/platform.js`)
- ✨ 各页面添加平台适配逻辑
- ✨ 升级基础库版本到 3.7.0