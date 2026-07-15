# 晶石五行测算 PWA

一个面向水晶店店主 / 店员的手机端 PWA 工具，用于录入顾客出生信息，生成五行喜用神参考、水晶搭配建议，并管理顾客记录与水晶商品数据。

## 项目定位

这个应用不是普通商城，也不是面向顾客自助下单的页面，而是给店内工作人员使用的辅助工具：

- 店员录入顾客出生信息和关注方向
- 系统生成五行能量分析、喜用神参考和水晶搭配方案
- 保存顾客记录，方便后续查看和重新测算
- 管理店内水晶数据，支持新增、编辑、上下架和删除
- 新增水晶时提供本地规则版“AI 智能分类”辅助填写

## 主要功能

- 五行喜用神测算
- 出生日期滑动选择
- 五行能量百分比展示
- 喜用神参考排序
- 水晶推荐与手串搭配方案
- 顾客信息管理
- 水晶商品管理
- 水晶智能分类辅助
- 管理中心密码入口
- 手机端 PWA 体验，可添加到主屏幕

## 技术栈

- HTML
- CSS
- JavaScript
- PWA Manifest
- Service Worker
- LocalStorage 本地数据存储
- lunar-javascript 八字基础换算逻辑

## 项目结构

```text
.
├── index.html
├── style.css
├── app.js
├── manifest.webmanifest
├── sw.js
├── icon.svg
├── assets/
│   └── lunar.js
├── data/
│   ├── crystals.initial.json
│   ├── crystals.batch2.json
│   ├── crystals.batch3.json
│   └── crystals.batch4.json
└── docs/
    ├── DEPLOY.md
    └── supabase-crystals.sql
```

## 本地预览

推荐用本地服务器打开，避免浏览器限制 PWA 缓存功能。

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 部署

可以部署到 Netlify、Vercel、GitHub Pages 等静态网站平台。

如果用于手机添加到主屏幕，建议使用 HTTPS 地址，例如 Netlify 或 Vercel 自动生成的网址。

详细步骤见：

```text
docs/DEPLOY.md
```

## 数据说明

当前版本主要使用浏览器 LocalStorage 保存顾客记录和水晶管理数据，适合单设备使用和作品集演示。

如果后续需要多设备同步、多人使用、云端备份，可以接入 Supabase。项目内已提供一份基础商品表 SQL：

```text
docs/supabase-crystals.sql
```

## 免责声明

本工具生成的五行分析和水晶搭配内容仅作传统文化与水晶搭配参考，不作为人生决策依据。

