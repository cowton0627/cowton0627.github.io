---
title: Cloudflare Pages 設定 Branch Preview：踩坑與正解
tags: [程式, Cloudflare, 部署, GitHub, Quartz]
created: 2026-05-07
---

# Cloudflare Pages 設定 Branch Preview：踩坑與正解

> 把個人知識庫從 GitHub Pages 加上「每個 branch 一個 preview URL」的能力，需要 Cloudflare Pages。聽起來 5 分鐘工，實際前後失敗 3 次，原因不在 code，而在 CF 的 UI 設計。這篇紀錄踩坑與正解。
>
> 分享者：[CLC](https://medium.com/@cowton0517)

## 為什麼想搞這個

我把這個知識庫（Obsidian + Quartz 4）部署在 GitHub Pages。GitHub Pages 免費好用，但有個硬限制：**一個 repo 只能有一個 deployment**。每次想試新主題、新 layout、新內容組織方式，要嘛在 `main` 直接改（壞了會炸線上），要嘛本地 build 起來看（沒辦法在手機 / 平板 / 別台電腦看）。

我想要的是：**每個 branch push 上去，自動產生一個 preview URL**。改主題能在 production-like 環境裡看效果，`main` 不動、線上不受影響。

業界標準是 Cloudflare Pages、Vercel、Netlify。三者做同一件事。我選了 CF Pages，以為 5 分鐘搞定，結果前後失敗 3 次才弄對。

## 陷阱：Workers 跟 Pages 在 2024 後合併入口

CF 在 2024 把 Workers 跟 Pages 兩個產品的入口合併成 **Workers & Pages**。從外觀看是一個產品兩種模式，實際上：

- **Workers**：跑 JavaScript code 的 serverless platform。需要 `wrangler.jsonc` 設定檔、`wrangler deploy` 命令。
- **Pages**：純靜態網站託管。給它 build output 資料夾，它就 serve。零設定檔。

合併之後問題來了：**dashboard 那顆 Create 按鈕預設帶你進 Workers Assets 流程**。Pages 的入口被藏了。

我建了 3 次專案，前兩次都建成 Workers。看 build log 一臉問號 — 這個 npm 跑不起來、那個 wrangler 找不到 directory、明明只是 serve 靜態檔案，為什麼系統一直在問我 `compatibility_date`？

## 怎麼知道你進錯了

兩個 100% 鐵證：

### 證據 1：deployment URL 結尾

| 結尾 | 產品類型 | 對 SSG 的需求 |
|------|---------|--------------|
| `<name>.workers.dev` | Workers | ❌ 錯了 |
| `<name>.pages.dev` | Pages | ✅ 對了 |

> [!warning] 唯一可信的判斷依據
> 不要看 dashboard 標題寫 "Workers & Pages" 就以為什麼都行 — 看實際 deploy 出來的網址結尾。

### 證據 2：build log 出現這幾個關鍵字

如果 build log 跑這幾行，你建的是 Workers：

```
npx wrangler deploy
wrangler.jsonc
compatibility_date
assets.directory
```

Pages 的 build log 不會出現任何 `wrangler` 字樣。

## 正解：強制進入 Pages

### Step 1 · 砍掉錯的專案

如果你已經建了 `*.workers.dev` 的失敗專案，先刪。

`CF dashboard → Workers & Pages → 該專案 → Settings → 拉到底 → Delete project` → 輸入專案名稱確認。

### Step 2 · 用深連結繞過合併入口

直接貼這條 URL：

```
https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages
```

這條 URL 強制走 Pages flow，繞過合併入口的 Workers 預設。

> [!tip] 第一個畫面驗證
> 進去之後**第一個畫面必須是「Connect to Git」**。如果你看到「Choose a template」、「Hello World Worker」、「Static Assets」 — 你又走錯了，回到上一步重來。

### Step 3 · Connect to Git

1. 授權 GitHub（第一次用會跳）
2. 選 repo
3. **Set up builds and deployments** 頁面填：

| 欄位 | 值（以 Quartz 4 為例） |
|------|---------------------|
| Project name | `knowledgebase`（這個會變成 `<name>.pages.dev`） |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `npx quartz build` |
| Build output directory | `public` |

### Step 4 · 加 Environment variable

展開 **Environment variables**，加一筆：

| Name | Value |
|------|-------|
| `NODE_VERSION` | `22` |

CF build 預設 Node 版本可能跟你本地不同。指定 `NODE_VERSION` 確保兩邊一致。Quartz 4 要求 Node 22+，沒指定的話 CF 用舊版 Node 會 build 失敗。

### Step 5 · Save and Deploy

按下去 CF 會立刻 build production branch 一次，~2-3 分鐘。完成後你的網址會是：

```
https://<project-name>.pages.dev
```

看到 `.pages.dev` 結尾就成功了。

## Branch Preview 的觸發機制（最容易卡的點）

CF Pages 預設行為：**production branch deploy 到主域名，所有非 production branch 自動 deploy 到 preview URL**，格式：

```
https://<branch-name>.<project-name>.pages.dev
```

branch 名稱中的 `/` 會被換成 `-`，例如 `theme/modern-minimalist` → `theme-modern-minimalist`。

### 但是 — webhook 只認「未來事件」

這是我踩第三次坑的地方。CF Pages 跟 GitHub repo 是透過 **webhook** 連接：GitHub 收到 push → 呼叫 CF endpoint → CF 排 preview build。

問題：**webhook 只對「連接之後」的 push 生效**。如果你的 branch 在連接 CF 之前就 push 上 GitHub 了，CF 完全不知道它存在。Deployments 列表只會看到 production，preview 那筆永遠不出現。

### 解法：補一個空 commit 觸發 webhook

```bash
git switch <你的 branch>
git commit --allow-empty -m "trigger CF preview build"
git push
```

這個 push 會觸發 webhook，CF 收到後排 preview build。~2 分鐘後 dashboard 會出現第二筆 deployment，URL 是 `https://<branch>.<project>.pages.dev`。

順便驗證 CF 的 preview 設定有沒有開：

**Settings → Builds & deployments → Branch deployments → Preview branch deployments** 應該是 **All non-production branches**（不是 None / Custom）。

## 驗收

你最後應該有兩個 URL：

```
Production: https://<project>.pages.dev
Preview:    https://<branch>.<project>.pages.dev
```

兩個 tab 開起來對比，就是 branch preview 的核心價值。改主題、改 layout、改 navigation，main 完全不動、線上 production 也不動。

## 什麼時候不需要這套

老實說 — 對個人單人專案，CF Pages 不一定值得這 30 分鐘。

| 場景 | 用什麼夠 |
|------|---------|
| 自己改、自己看 | 本機 `quartz build --serve` |
| 自己改、想在手機 / 平板看 | `ngrok http 8080` |
| 一次性丟連結給朋友 review | `ngrok` |
| 多人協作、每個 PR 要視覺 review | **CF Pages** |
| 想抓「本機 OK、production 壞」的 bug | **CF Pages** |

CF Pages 真正發揮價值是有第三人 review、或想在 production-like 環境驗 bug。如果是單人花園，本機其實夠。

但如果你決定要弄，希望這篇能讓你少走兩個 wrong turn。

## 重點回顧

1. **看 URL 結尾**：`.pages.dev` 才對，`.workers.dev` 錯。
2. **用深連結繞合併入口**：`/workers-and-pages/create/pages`。
3. **第一個畫面看「Connect to Git」**：不是 template、不是 Hello Worker。
4. **設定 `NODE_VERSION`**：避免 CF 用舊 Node。
5. **既存 branch 要補空 commit**：webhook 不會回頭觸發歷史 push。
