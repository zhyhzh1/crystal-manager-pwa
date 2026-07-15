# 部署说明

## 推荐方式：GitHub + Netlify

这个项目是纯前端 PWA，不需要后端构建，可以直接作为静态网站部署。

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

部署完成后，Netlify 会生成一个 HTTPS 地址，例如：

```text
https://your-site-name.netlify.app
```

### 3. 在 iPhone 添加到主屏幕

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

