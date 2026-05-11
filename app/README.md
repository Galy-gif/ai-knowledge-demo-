# AI Knowledge Demo

移动端 AI 知识管理产品 Demo，覆盖知识库、问一问、任务轻应用、笔记和个人中心。

一句话介绍：把资料、网页、笔记和团队知识库接入 AI，让用户可以随时提问、整理、沉淀并生成轻应用。

## 本地启动

```bash
npm install
npm run dev
```

## 部署到 Vercel

1. 连接 GitHub 仓库。
2. Root Directory 选择 `app`。
3. Framework Preset 选择 `Vite`。
4. Build Command 填 `npm run build`。
5. Output Directory 填 `dist`。
6. 点击 `Deploy`。

`vercel.json` 已配置 SPA rewrites，刷新二级路由不会 404。

## 构建

```bash
npm install
npm run build
```
