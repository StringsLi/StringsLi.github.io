# Strings Theme Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and configure a modern, responsive Hexo theme for Strings, with secure optional comments and GitHub Pages deployment.

**Architecture:** Create an isolated `themes/strings` theme using Hexo EJS templates, plain CSS and a small progressive-enhancement script. Keep content and source paths untouched; root Hexo configuration selects the new theme and centralizes site metadata, while the theme configuration controls UI and public integrations.

**Tech Stack:** Hexo 4, EJS, CSS custom properties, vanilla JavaScript, GitHub Actions, Giscus.

---

### Task 1: Audit the content contract and normalize root configuration

**Files:**
- Modify: `_config.yml`
- Create: `source/search/index.md`
- Create: `source/archives/index.md`

**Step 1:** Inspect current post front matter and existing page paths.

**Step 2:** Set valid UTF-8 Chinese site metadata, select `strings`, retain image assets, and remove legacy OAuth values and old deploy secrets.

**Step 3:** Add archive and search entry pages only if absent; do not edit existing posts.

**Step 4:** Run `npx hexo config` and verify the selected theme and URL.

### Task 2: Create the theme framework

**Files:**
- Create: `themes/strings/_config.yml`
- Create: `themes/strings/layout/layout.ejs`
- Create: `themes/strings/layout/index.ejs`
- Create: `themes/strings/layout/post.ejs`
- Create: `themes/strings/layout/page.ejs`
- Create: `themes/strings/layout/archive.ejs`
- Create: `themes/strings/layout/category.ejs`
- Create: `themes/strings/layout/tag.ejs`
- Create: `themes/strings/layout/_partial/*.ejs`

**Step 1:** Build a shared document shell with SEO metadata, navigation, theme switch, and asset loading.

**Step 2:** Implement article cards and the article page with reading time, taxonomy, table of contents, adjacent posts and an optional Giscus mount.

**Step 3:** Implement archive, category, tag, generic page, and search layouts using Hexo locals.

**Step 4:** Generate the site and verify all top-level navigation paths are emitted.

### Task 3: Implement the technical-editorial visual system

**Files:**
- Create: `themes/strings/source/css/style.css`
- Create: `themes/strings/source/js/main.js`

**Step 1:** Define color, type, rhythm and layout variables for light and dark themes.

**Step 2:** Implement desktop and mobile styling for the header, article cards, prose, code blocks, taxonomy and footer.

**Step 3:** Add lightweight interactions: explicit theme preference, mobile navigation, code-copy buttons, active table-of-contents links and progressive loading transitions.

**Step 4:** Serve the generated site locally and inspect the home page, article page and mobile width.

### Task 4: Add deployment, documentation and verification

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Modify: `.gitignore` (only if generated files require exclusion)

**Step 1:** Add an Actions workflow that builds the site with Node 20 and deploys to GitHub Pages on pushes to `master`.

**Step 2:** Write Chinese setup instructions: install, preview, publish, article creation, Giscus setup and Pages settings.

**Step 3:** Run `npm run clean` and `npm run build`; inspect generated HTML for legacy author content and secret values.

**Step 4:** Commit only theme, configuration, documentation and workflow files. Do not stage the pre-existing post changes.
