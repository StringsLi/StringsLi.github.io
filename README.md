# Strings

个人技术博客，记录机器学习、风控算法与阅读思考。网站由 Hexo 生成，使用仓库内的 `strings` 自定义主题。

## 本地使用

推荐 Node.js 20 LTS。

```bash
npm ci
npm run server
```

打开终端显示的本地地址即可预览。完整生成静态文件：

```bash
npm run clean
npm run build
```

生成结果位于 `public/`，该目录不会提交到 Git。

## 写文章

```bash
npx hexo new "文章标题"
```

文章保存在 `source/_posts/`。新文章的图片放在同名资源目录中，例如：

```text
source/_posts/文章标题.md
source/_posts/文章标题/cover.png
```

在文章中使用相对路径：`![](./文章标题/cover.png)`。

建议的文章头部：

```yaml
---
title: 文章标题
date: 2026-08-07 10:00:00
categories:
  - 机器学习
tags:
  - 算法
---
```

## Giscus 评论

主题已经接入 Giscus，但默认关闭，不会加载第三方脚本。

1. 在 GitHub 仓库 Settings 中启用 **Discussions**。
2. 打开 [giscus.app](https://giscus.app/zh-CN)，授权并选择本仓库。
3. 将生成的 `repo`、`repo-id` 与 `category-id` 填入 `themes/strings/_config.yml` 的 `giscus` 区块。
4. 将 `enabled` 改为 `true`，重新构建并发布。

这些配置为公开仓库映射参数；不要在此仓库保存 OAuth Client Secret、访问令牌或其他私密凭据。

## 发布到 GitHub Pages

推送到 `master` 后，`.github/workflows/deploy.yml` 会自动构建并发布网站。

首次使用时，请在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。随后在 Actions 页面等待 `Deploy Hexo site` 成功，网站将发布到 <https://stringsli.github.io/>。

## 目录说明

```text
source/                 文章、页面和图片
themes/strings/         自定义主题
_config.yml             Hexo 站点配置
.github/workflows/      自动发布工作流
```
