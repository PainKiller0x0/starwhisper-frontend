# 星言小程序

## 项目简介

星言是一款疗愈星空小程序，通过AI生成个性化的星空疗愈文案，为用户提供心灵慰藉。

## 功能特性

- 🌟 **个性化星语**：根据用户名字和困扰，生成专属的疗愈文案
- 🎨 **精美海报**：生成可保存的星空疗愈海报
- 📱 **小程序体验**：支持微信小程序，随时随地使用
- 🤖 **AI驱动**：使用智谱AI GLM-4-Flash模型生成文案

## 技术栈

- **前端框架**：微信小程序原生开发
- **后端服务**：Node.js + Express
- **AI模型**：智谱AI GLM-4-Flash-250414（免费模型）
- **部署服务器**：阿里云ECS

## 项目结构

```
miniprogram/
├── app.js                    # 小程序入口文件
├── app.json                  # 小程序配置文件
├── app.wxss                  # 全局样式
├── project.config.json       # 项目配置
├── sitemap.json              # 站点地图
├── pages/
│   ├── index/               # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── result/              # 结果页
│       ├── result.js
│       ├── result.json
│       ├── result.wxml
│       └── result.wxss
└── utils/                   # 工具函数
```

## API接口

### 生成星语

**接口地址**：`POST /api/generate-reading`

**请求参数**：
```json
{
  "name": "用户名字",
  "trouble": "当前困扰"
}
```

**响应数据**：
```json
{
  "quote": "AI生成的疗愈文案",
  "tags": ["标签1", "标签2"],
  "advice": "引导性建议"
}
```

**后端地址**：`http://8.134.192.197:3005`

## 本地开发

### 1. 克隆项目
```bash
git clone https://gitee.com/painkiller0x0/starwhisper-frontend.git
```

### 2. 使用微信开发者工具打开
1. 打开微信开发者工具
2. 选择「导入项目」
3. 选择 `miniprogram` 目录
4. 填入你的小程序AppID（或使用测试号）

### 3. 配置后端地址
在 `app.js` 中修改 `backendUrl`：
```javascript
globalData: {
  backendUrl: 'http://8.134.192.197:3005'
}
```

### 4. 运行项目
点击「编译」按钮即可预览

## 部署说明

### 后端部署
后端已部署在阿里云服务器：
- **服务器IP**：8.134.192.197
- **端口**：3005
- **PM2应用名**：starwhisper-api

### 前端部署
1. 在微信开发者工具中打开项目
2. 点击「上传」按钮
3. 填写版本号和项目备注
4. 在微信公众平台提交审核

## 注意事项

1. **网络配置**：小程序需要在微信公众平台配置服务器域名白名单
   - 登录微信公众平台
   - 进入「开发」→「开发管理」→「开发设置」
   - 在「服务器域名」中添加：`http://8.134.192.197:3005`

2. **HTTPS要求**：生产环境建议使用HTTPS，需要配置SSL证书

3. **AI模型**：当前使用免费模型`glm-4-flash-250414`，无需付费

## 更新日志

### v1.0.0 (2026-03-23)
- ✨ 初始版本发布
- ✨ 支持个性化星语生成
- ✨ 支持海报生成和保存
- ✨ 对接智谱AI免费模型

## 联系方式

如有问题，请通过以下方式联系：
- Gitee：https://gitee.com/painkiller0x0
- GitHub：https://github.com/PainKiller0x0

## 许可证

MIT License