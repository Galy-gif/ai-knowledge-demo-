# AI Knowledge Demo

一个移动端 AI 知识管理产品 Demo，包含知识库、问一问、任务轻应用、笔记和个人中心等核心流程。

一句话介绍：把资料、网页、笔记和团队知识库接入 AI，让用户可以随时提问、整理、沉淀并生成轻应用。

## 本地启动

```bash
cd app
npm install
npm run dev
```

启动后打开 Vite 输出的本地地址，通常是 `http://127.0.0.1:5173/`。

## 部署到 Vercel

1. 把项目推到 GitHub。
2. 打开 Vercel，点击 `Add New...` -> `Project`。
3. 选择这个 GitHub 仓库并点击 `Import`。
4. `Root Directory` 选择 `app`。
5. Framework Preset 选择 `Vite`。
6. Build Command 填 `npm run build`。
7. Output Directory 填 `dist`。
8. 点击 `Deploy`。

`app/vercel.json` 已配置 SPA 路由重写，刷新 `/ask`、`/notes/edit`、`/pwa/run/app1` 等页面不会 404。

## 构建

```bash
cd app
npm install
npm run build
```

`npm run build` 会先执行 TypeScript 检查，再执行 `vite build`。
