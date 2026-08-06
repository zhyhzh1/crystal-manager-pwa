# 部署说明

## 推荐方式：GitHub + Netlify

这个项目由静态 PWA 和一个 Netlify Function 组成。前端无需打包构建，但图片 AI 分析依赖服务端函数和腾讯云 TokenHub API Key，因此推荐部署到 Netlify，不能按纯静态站点处理。

### 1. 上传到 GitHub

1. 打开 GitHub
2. 创建一个新仓库，例如：

```text
crystal-five-elements-pwa
```

3. 把本项目文件上传到仓库根目录

仓库根目录应该直接看到：

```text
index.html
style.css
app.js
manifest.webmanifest
sw.js
icon.svg
assets/
data/
docs/
netlify/functions/analyze-crystal.mjs
```

不要把外层旧工程一起上传。

### 2. 连接 Netlify

1. 打开 Netlify
2. 选择 Add new site
3. 选择 Import an existing project
4. 连接 GitHub 仓库
5. Build command 留空
6. Publish directory 填：

```text
.
```

7. 点击 Deploy

### 3. 配置 API Key 和店主口令

1. 在腾讯云 TokenHub 创建并复制可调用 YT-VITA 的 API Key
2. 进入 Netlify 项目：Site configuration → Environment variables
3. 新增变量：

```text
Key: TOKENHUB_API_KEY
Value: 你的 TokenHub API Key

Key: AI_ACCESS_CODE
Value: 你自己设置的新店主口令
```

4. 免费方案可以选择 All scopes 和 Same value for all deploy contexts
5. 保存后重新部署站点，让函数读取最新环境变量

不要把 API Key 或真实店主口令写入前端文件、README、GitHub 仓库或聊天截图。浏览器只请求 `/.netlify/functions/analyze-crystal`，TokenHub 密钥仅由 Netlify Function 在服务器端读取；店主口令会通过 HTTPS 交给函数验证，并只在当前浏览器会话中暂存。

### 4. 验证 AI 接口

部署完成后，进入管理中心新增水晶，直接上传一张商品图片。正常情况下页面会显示候选名称、可信度、可见特征、传统搭配标签和不确定信息。

如果提示“网站尚未配置 TOKENHUB_API_KEY”或“网站尚未配置 AI_ACCESS_CODE”，检查变量名大小写并重新部署；如果提示等待时间过长，可以点击“重新尝试”。模型请求超过约 25 秒会自动终止，避免页面无限等待。

AI 建议只在店员点击“采用这份建议”后写入表单。采用后再修改会记录为人工修正，选择“不采用”会记录为拒绝；这些反馈只保存在当前设备，不会上传图片。接口同时按 IP 限制每分钟最多 10 次请求，正常分散使用不设每日上限。

部署完成后，Netlify 会生成一个 HTTPS 地址，例如：

```text
https://your-site-name.netlify.app
```

### 5. 在 iPhone 添加到主屏幕

1. 用 Safari 打开部署后的 HTTPS 地址
2. 点击底部分享按钮
3. 选择“添加到主屏幕”
4. 桌面会出现应用图标
5. 之后可以像打开 App 一样使用

## 注意事项

- 不要用 `file://` 地址测试 PWA 安装效果
- PWA 安装、离线缓存、添加到主屏幕都需要 HTTPS
- 当前数据保存在当前手机浏览器里，换手机不会自动同步
- 如果要多设备同步，需要接 Supabase 或其他云数据库
- 仍建议在腾讯云设置免费额度或预算保护，作为接口口令和 Netlify 限流之外的最终费用保险
