# 🌱 春麗知識庫（Chun-Li Knowledge Base）

持續成長的個人知識庫 — 自媒體、AI 工具、內容創作流程、個人知識管理（PKM）。

> 線上閱讀：<https://cowton0627.github.io/>

---

## 技術棧

```
Obsidian (寫作)  →  git push  →  GitHub Actions  →  GitHub Pages
                                       ↑
                                   Quartz 4 build
```

- **寫作端**：Obsidian（vault 即此 repo 的 `content/`）
- **建置**：[Quartz 4](https://quartz.jzhao.xyz/) 靜態網站產生器（**vendored fork**，見下節）
- **部署**：`.github/workflows/deploy.yml` → push to `main` 自動 build & deploy
- **託管**：GitHub Pages（user site，`cowton0627.github.io`）

---

## 本機開發

```bash
npm install
npx quartz build --serve   # http://localhost:8080，watch + hot reload
```

其他常用指令：

```bash
npx quartz build           # 一次性 build → public/
npm run check              # tsc + prettier check
npm run format             # prettier --write（已透過 .prettierignore 排除 quartz/）
npm run docs               # 在本機跑 Quartz 官方文件（_upstream-docs/）
```

---

## 資料夾結構

```
KnowledgeBase/
├── content/              ← 公開內容（Quartz 從這裡 build）
│   ├── _assets/          ← 文章用的圖片
│   ├── index.md          ← 首頁
│   └── 自媒體/           ← 唯一目前在用的頂層分類
│       ├── 工具/
│       ├── 器材/
│       └── 平台/
├── sources/              ← 原始資料（HackMD / Medium 匯出，本機用、不進 git）
├── drafts/               ← 未整理草稿（本機用、不進 git）
├── quartz/               ← Quartz 框架原始碼（vendored）
├── _upstream-docs/       ← Quartz 官方文件（純參考，不會被 build 進站）
├── quartz.config.ts      ← 站台設定（locale、配色、字型、plugins）
├── quartz.layout.ts      ← 頁面骨架（左右 sidebar、beforeBody）
└── .github/workflows/    ← GitHub Actions
```

工作流程：`sources/`（原料）→ `drafts/`（重寫中）→ `content/`（公開）。`sources/` 與 `drafts/` 各有自己的 README 說明。

---

## 標籤 / 分類規則（Tagging convention）

**核心原則：tags 為主，folders 為次。** 資料夾用來組織檔案層級（檔案系統的需求），tags 用來做主題交叉檢索（讀者的需求）。

### 兩層 tag

| 層級 | 用途 | 例子 |
|---|---|---|
| **領域 (Domain)** | 對應頂層資料夾的概念，每篇至少 1 個 | `自媒體`、`影視`、`部落格`、`開箱`、`程式`、`生活` |
| **主題 (Topic)** | 細粒度題材 | `AI`、`Podcast`、`RSS`、`音樂`、`器材`、`社群`、`工具`、`自動化` |

### 規則

- 領域 tag = 一級分類（與資料夾根對應）。即使檔案放在 `自媒體/工具/`，仍要標 `自媒體` —— 這樣 `/tags/自媒體` 頁能列出整個 domain 的全部文章
- **跨領域文章標多個領域**。例如「用 ffmpeg 處理 podcast」放 `自媒體/工具/` 或 `程式/` 都行，frontmatter 寫 `tags: [自媒體, 程式, Podcast, ffmpeg]`，會同時出現在兩個 domain 的 tag page
- 主題 tag 與領域 tag 不重複用同名概念。「工具 / 器材 / 平台」是 `自媒體/` 內部的子資料夾，當主題 tag 用就好，不當領域
- 命名：中文用原字、英文/技術名保留原大小寫（`AI`、`RSS`、`ffmpeg`），不放空格

### Frontmatter 範例

```yaml
---
title: 上架 Podcast
tags: [自媒體, Podcast, 平台]
---
```

### Tag 頁面

`Plugin.TagPage()` 在 build 時自動為每個 tag 生成 `/tags/<name>` 頁面，列出該 tag 下的所有文章。Tag index 在 `/tags/`。文章標題下方的 chip pills 點下去就跳到對應 tag page。

---

## 🔧 Fork base — 重要！

**本 repo 是 [jackyzha0/quartz](https://github.com/jackyzha0/quartz) 的 vendored fork，基於 `v4.5.2`。**

整個 Quartz 框架的原始碼（`quartz/` 目錄）直接 commit 在這個 repo 裡，沒有透過 npm 引入。Quartz 官方目前就是這個用法。

### 我們做了哪些客製

對 upstream `v4.5.2` 的實質改動 **只有兩個檔案**：

| 檔案 | 改了什麼 |
|---|---|
| `quartz/styles/custom.scss` | ~1,200 行的整體視覺主題：字型（Inter + zh-Hant CJK fallback）、Linear 風格 indigo 配色、響應式版型（mobile/tablet/desktop/wide）、TOC 雙模式（桌機右側、手機/平板上方卡片）、首頁 hero、scrollbars、selection、focus rings 等。 |
| `quartz/styles/variables.scss` | sidebar 寬度 `320px → 260px`，`topSpacing 6rem → 4rem`。 |

**站台層級設定**（不算 quartz core，但會影響行為）：

| 檔案 | 用途 |
|---|---|
| `quartz.config.ts` | 站台設定：`pageTitle`、`locale: zh-TW`、配色 token、字型、`baseUrl`、plugins 開關 |
| `quartz.layout.ts` | 頁面組裝：左 sidebar 內容、右 sidebar 內容、`beforeBody` 中的 TOC 雙置策略、`isHome` conditional renders |

`.prettierignore` 把 `quartz/` 排除在 `npm run format` 之外，避免格式化雜訊污染 fork diff。

> ⚠️ **不要把 `quartz/` 從 `.prettierignore` 拿掉。**
> 踩過：早期一次 `npm run format` 把整個 `quartz/` 加了分號，
> 造成 156 個檔對 upstream diff（純格式雜訊），未來 merge 一定崩。
> 已花一輪 reset 清掉，請保持現狀。

### 從 upstream 升級 Quartz

`upstream` remote 已加好（fetch-only）：

```bash
git remote -v
# upstream  https://github.com/jackyzha0/quartz.git (fetch)
```

升級流程：

```bash
# 1. 取得最新 upstream
git fetch upstream

# 2. 確認哪一版要升
git ls-remote --tags upstream | grep v4.

# 3. 開分支試 merge / rebase
git checkout -b upgrade/v4.X.Y
git merge upstream/v4.X.Y          # 或 git rebase upstream/v4.X.Y

# 4. 預期 conflict 高發區（按可能性排序）
#    - quartz/styles/custom.scss        ← 我們改最多的檔
#    - quartz/styles/variables.scss     ← 兩個變數值
#    - quartz.config.ts                 ← 看 upstream 有沒有改 plugin signature
#    - quartz.layout.ts                 ← 看 upstream 有沒有改 component API
#
#    quartz/ 其他檔通常 conflict-free（我們沒改），
#    直接 accept upstream 版本即可。

# 5. 解完 conflict 後，本機 build 檢查
npx quartz build
npx quartz build --serve

# 6. 看視覺有沒有崩 → merge 回 main
git checkout main
git merge upgrade/v4.X.Y
git push
```

### 升級時要 sanity-check 的視覺點

由於 `quartz/styles/custom.scss` 用了不少 `!important` 對抗 Quartz base 樣式，升級後務必檢查：

- [ ] 桌機（≥1200px）：3 欄版型、左 explorer、中 760px 文章、右 sidebar TOC
- [ ] 平板（800-1199px）：左 explorer、中文章、文章上方有 TOC 卡片
- [ ] 手機（<800px）：單欄、頂部 sidebar、TOC 卡片在文章上方
- [ ] 暗色模式切換 → 配色一致
- [ ] 文章內圖片有邊框、上限 640px
- [ ] 首頁 hero gradient 文字、目錄列表 hover 效果

若 Quartz 升級改動了 grid template 或 sidebar 結構，要對應更新 `custom.scss` 第 25 區（responsive overrides）的 selector。

---

## 部署

`main` 分支 push 即觸發 `.github/workflows/deploy.yml`：

```
checkout → npm install → npx quartz build → upload public/ as Pages artifact → deploy
```

通常 1-2 分鐘完成。失敗看 [Actions 頁面](https://github.com/cowton0627/cowton0627.github.io/actions)。

---

## License

- 內容（`content/` 下）— © 春麗，保留所有權利
- Quartz 框架程式碼（`quartz/`）— MIT，見 `LICENSE.txt`
