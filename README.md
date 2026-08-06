# 晶石五行测算 PWA

一个面向水晶店店主 / 店员的手机端 PWA 工具，用于录入顾客出生信息，生成五行喜用神参考、水晶搭配建议，并管理顾客记录与水晶商品数据。

## 项目定位

这个应用不是普通商城，也不是面向顾客自助下单的页面，而是给店内工作人员使用的辅助工具：

- 店员录入顾客出生信息和关注方向
- 系统生成五行能量分析、喜用神参考和水晶搭配方案
- 保存顾客记录，方便后续查看和重新测算
- 管理店内水晶数据，支持新增、编辑、上下架和删除
- 新增水晶时可上传商品图片，由腾讯云 TokenHub YT-VITA 多模态模型生成分类建议
- 展示候选名称、可见依据、可信度与不确定信息，并允许店员人工修改
- 模型不可用时保留本地名称规则作为降级方案

## 主要功能

- 五行喜用神测算
- 出生日期滑动选择
- 五行能量百分比展示
- 喜用神参考排序
- 水晶推荐与手串搭配方案
- 顾客信息管理
- 水晶商品管理
- 水晶图片自动分析与结构化分类建议
- AI 可信度、判断依据、不确定信息和 Token 用量展示
- AI 建议需人工采用，并在本机记录采用、修改或拒绝反馈
- 可选补充问题与本地规则降级
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
- Netlify Functions 服务端代理
- 腾讯云 TokenHub YT-VITA 多模态模型

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
├── netlify/
│   └── functions/
│       └── analyze-crystal.mjs
└── docs/
    ├── DEPLOY.md
    └── supabase-crystals.sql
```

## 本地预览

推荐用本地服务器打开，避免浏览器限制 PWA 缓存功能。静态页面可以正常预览，但真实 AI 分析依赖 Netlify Function 和 `TOKENHUB_API_KEY`，直接运行静态服务器时该功能不可用。

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 部署

推荐部署到 Netlify。项目的页面是静态 PWA，但真实 AI 分析通过 Netlify Function 调用腾讯云 TokenHub，因此不能只把文件部署到不支持该函数的纯静态托管平台。

在 Netlify 中配置以下环境变量后再部署：

```text
TOKENHUB_API_KEY=你的腾讯云 TokenHub API Key
AI_ACCESS_CODE=你的店主口令
```

API Key 和店主口令只能保存在 Netlify 环境变量中，不要写入 `app.js`、提交到 GitHub 或发送给访问者。

如果用于手机添加到主屏幕，请使用 Netlify 自动生成的 HTTPS 地址。

详细步骤见：

```text
docs/DEPLOY.md
```

## 数据说明

当前版本主要使用浏览器 LocalStorage 保存顾客记录和水晶管理数据，适合单设备使用和作品集演示。

AI 请求由 `netlify/functions/analyze-crystal.mjs` 转发。服务端会验证店主口令，按 IP 限制每分钟最多 10 次请求，并限制图片大小、模型等待时间和结构化输出字段。AI 结果仍属于候选建议，不能用于判断水晶真伪、天然性、产地或价值。

采用、修改和拒绝反馈只保存在当前浏览器的 LocalStorage 中，用于作品集展示与后续人工评估；当前版本不会自动上传反馈或训练模型。

如果后续需要多设备同步、多人使用、云端备份，可以接入 Supabase。项目内已提供一份基础商品表 SQL：

```text
docs/supabase-crystals.sql
```

## 免责声明

本工具生成的五行分析和水晶搭配内容仅作传统文化与水晶搭配参考，不作为人生决策依据。
