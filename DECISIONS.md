# DECISIONS

逐筆紀錄這個 repo 走到今天的關鍵選擇。每筆格式：
**日期 / 背景 / 選項考慮過 / 決定 / 理由 / 未解**

按時間倒序，最新在最上面。

---

## D-011 · git history 統一作者為 GitHub noreply email（隱私清理）

- **日期**：2026-05-11
- **背景**：原本本機 `git config user.email` 是公司身分 `[redacted]`，77 個 commits 的 author + committer 全部用該 email。此 repo 是 public GitHub Pages 站，公司 email 隨 `git log` 完全公開
- **選項考慮過**：
  - 不管它 — 接受公司 email 永遠暴露
  - 加 `.mailmap` 蓋顯示 — cosmetic only，GitHub UI 不看 `.mailmap`，commit object 仍可被挖
  - `git filter-repo` 改寫 + force push — 徹底但破壞性，所有 SHA 變、若有其他 clone 會破
- **決定**：用 `git filter-repo --mailmap` 改寫所有 77 個 commits 的 author/committer 為 `cowton0627 <83654992+cowton0627@users.noreply.github.com>`（GitHub 新版 noreply email，含 numeric ID）；`git push --force-with-lease` 到 main；順手刪掉 GitHub 上廢棄的 `theme/modern-minimalist` branch；本機 `git config --global user.email` 也改成新版 noreply
- **理由**：
  - public repo 不應暴露公司 email
  - 新版 noreply 含不可變 ID，將來改 GitHub username 也照樣 attribute
  - 沒有 GPG signing → 不會被 strip 簽章
  - 已確認沒有其他 clone，副作用範圍可控
- **mailmap 規則**（供未來再做時參考）：

  ```
  cowton0627 <83654992+cowton0627@users.noreply.github.com> <[redacted]>
  ```

- **未解**：
  - GitHub 端原舊 commit objects 在沒有 ref 指向後會被 GC，時間不固定（幾天到幾週）；若有外部 fork / 第三方 cache 抓過舊 SHA，理論上仍能找到。對個人 repo 不必要聯絡 GitHub support 強制清
  - 日後在新 repo 沒 `git config --local` 覆蓋的話會繼承 global 的 noreply；但借電腦 / 不同帳號 commit 仍可能用到其他身分 → 新 repo 第一個 commit 前先 `git config user.email` 確認

---

## D-010 · 連結檢查雙 CI 分工（wikilink 擋 build + 外部連結 weekly cron）

- **日期**：2026-05-10
- **背景**：原本 `deploy.yml` 已有 `scripts/check-wikilinks.mjs` 在每 push 跑、擋掉壞的 `[[wikilink]]`；但**外部 URL**（`https://…`）完全沒被檢查，文章引用的網站關站 / 改網址 / 404 沒人發現
- **選項考慮過**：
  - 在 `deploy.yml` 加 lychee step、每 push 跑外部連結 — 簡單，但每 push 都打外部站，可能被 429，build 變慢
  - 排程 weekly cron + lychee cache + 失敗自動開 issue — 與 commit 解耦、輕量
  - 不做，靠手動偶爾檢查 — 容易遺忘
- **決定**：新增 `.github/workflows/link-check.yml`，週一 03:00 UTC 跑 lychee + `workflow_dispatch` 手動觸發；失敗用 `peter-evans/create-issue-from-file@v5` 開 issue（label `link-check`）；wikilink 仍維持每 push 由 `deploy.yml` 跑、擋 build
- **理由**：
  - **wikilink 是內部資料完整性** — 壞了讓站內導航失效，必須擋 build
  - **外部連結會自然腐爛** — 跟 commit 無關，每 push 跑反而打外站；weekly + cache 是平衡點
  - lychee `--accept` 放行 `403/429/503/999`（擋 bot 或 HF Space idle sleep），**故意保留 401** 為真壞訊號（被刪除的 HF Space 會以 401 出現）。曾踩過誤把 401 加進 accept、放過已被 stabilityai 下架的 SD 2.1 demo，這個教訓另寫進 memory
- **未解**：
  - `peter-evans/create-issue-from-file` 沒自動 dedupe，連續多週仍有壞連結會累積 issue。若太吵可換 `JasonEtco/create-an-issue` + `update_existing: true`

---

## D-009 · 文章路徑保留純中文（不切英文 slug）

- **日期**：2026-05-08
- **背景**：`content/` 用中文資料夾名（`自媒體/工具/...`）會 build 出 `/自媒體/工具/Suno%20AI/` 這種 percent-encoded URL。早期 audit 把這列為「該修」項目
- **選項考慮過**：
  - 純中文路徑（現況）— URL 出現 `%20` 跟 percent-encoded 中文，部分舊版 LINE / Slack 預覽會截斷
  - 全切英文 slug（`/self-media/tools/suno-ai/`）+ 用 frontmatter `title:` 顯示中文 — 跨平台最 robust，但寫作時資料夾名變陌生
  - 用 frontmatter `permalink:` 個別覆寫成 ASCII slug — 折衷，但每篇都要記得設
- **決定**：維持純中文路徑
- **理由**：
  - 讀者是中文使用者，URL 中文比 ASCII 拼音更直觀
  - Obsidian vault 也是這個結構，寫作時心智模型一致
  - 現代瀏覽器、Twitter / Threads / Bluesky 已正確處理 UTF-8 percent-encoded URL
  - `%20` 出現的少數場景（含空白檔名）可改用 dash 命名解決
- **未解**：若未來發現 LINE / FB 預覽圖大量壞掉，或 SEO 受影響，再回頭檢討（可能改用 `permalink:` 局部處理而非全站切換）

---

## D-008 · Branch preview 採用 Cloudflare Pages，production 仍留 GitHub Pages

- **日期**：2026-05-08
- **背景**：想要每個 branch push 上 GitHub 後自動產生 preview URL，方便對比改主題、改 layout 的視覺效果。GitHub Pages 一個 repo 只能一份 deployment，無法 per-branch 預覽
- **選項考慮過**：
  - 不做，純本機 `quartz build --serve` — 沒辦法在手機/平板看，也不能丟連結給別人
  - `ngrok http 8080` — 一次性 review OK，但電腦關了就斷
  - Vercel — 設定最順但又一個帳號
  - Netlify — 同 Vercel
  - Cloudflare Pages — 已有 CF 帳號、免費、無 vendor lock-in
- **決定**：CF Pages 接 branch preview，production 仍留 GitHub Pages（雙 deploy 互不影響）
- **理由**：已有 CF 帳號；雙 deploy 各管各的，CF 出事不影響線上；如未來想搬，static `public/` 任何家都能 host
- **未解**：
  - CF dashboard 在 2024 後合併 Workers & Pages 入口，建立 Pages 專案非常容易誤入 Workers 流程（前後踩過 3 次）。深連結 `https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/pages` 可繞開
  - 既存 branch 在連接 CF 之前 push 過的話，webhook 不會回頭觸發；要補 `git commit --allow-empty` 才會排 preview build
  - 詳細踩坑與正解 → [[Cloudflare Pages 設定 Branch Preview]]

---

## D-007 · 否決 Modern Minimalist 主題，維持 Sunset Boulevard 全站統一

- **日期**：2026-05-07
- **背景**：theme-factory 提供 10 套主題，曾在 `theme/modern-minimalist` branch 試套全站灰白的 Modern Minimalist
- **選項考慮過**：
  - 全站換 MM
  - 內頁 MM、首頁保留 Claude 暖色（暖/冷對比）
  - 全站 MM、首頁改 Sunset 當點綴
  - 維持 Sunset Boulevard
- **決定**：維持 Sunset Boulevard 全站統一，theme branch 廢棄
- **理由**：MM 對個人花園太冷；Sunset 編輯氣質配 Source Serif 4 標題的暖色暈染剛好。經實際 build + 對比後本人不喜歡 MM
- **未解**：暫無

---

## D-006 · 首頁配色改回與內頁一致（撤回 Claude 暖色 override）

- **日期**：2026-05-06
- **背景**：早期實驗讓首頁套 Anthropic Claude 配色 token（暖米 + 珊瑚），內頁維持 Sunset Boulevard，目的是讓「首頁」這個品牌入口跟內頁有區隔
- **選項考慮過**：
  - 維持兩套配色（首頁 Claude / 內頁 Sunset）
  - 全站統一 Sunset
- **決定**：撤回。全站只用 Sunset Boulevard
- **理由**：本人說「希望使用者體驗相同, 主要還是在顏色的改變」 → UX 一致時連顏色也統一，視覺斷裂感不值得換來那點品牌差異
- **未解**：暫無

---

## D-005 · 採用 wikilink validator + GUI-friendly pre-commit hook

- **日期**：2026-05-06
- **背景**：寫文常常打錯 wikilink target，build 才發現；希望本機 commit 前就擋
- **選項考慮過**：
  - 純 CLI hook（`#!/bin/sh` + `node scripts/check-wikilinks.mjs`）— 簡單，但 Sourcetree / GitHub Desktop / GitKraken 等 GUI 客戶端不繼承 shell PATH，會找不到 `node`
  - 加 PATH 修補的 hook（CLI + GUI 都吃）
- **決定**：後者，PATH 補 `/opt/homebrew/bin:/usr/local/bin:$HOME/.volta/bin`
- **理由**：本人會交替用 CLI 與 GUI；統一一個 hook 比較好維護
- **未解**：nvm 用戶要自己再加一行 nvm path（README 已注明）

---

## D-004 · Deploy 策略：所有 branch 都跑 build，只有 main push 觸發 deploy

- **日期**：2026-05-06
- **背景**：GitHub Actions workflow 設計，希望 PR / feature branch 也能 sanity-check
- **選項考慮過**：
  - 只在 push to main 跑 workflow（最省 CI 時間）
  - 所有 push / PR 跑 build，只有 main 跑 deploy
- **決定**：後者
- **理由**：GitHub Pages 一個 repo 只能一份 deployment，無法 per-branch 預覽（→ D-008 後來補上 CF Pages 解決）。但讓所有 branch 都 build 至少能在合併到 main 之前擋下壞 markdown / broken wikilink / build error
- **未解**：暫無

---

## D-003 · `Plugin.CreatedModifiedDate` priority 設為 `["git", "frontmatter", "filesystem"]`

- **日期**：2026-05-05
- **背景**：文章 meta 行要顯示「原始發佈日 + 最後更新日」，前者來自 frontmatter `created:`，後者要自動跟 git 最後 commit 時間
- **選項考慮過**：
  - Quartz 預設 `["frontmatter", "git", "filesystem"]`
  - 自訂 `["git", "frontmatter", "filesystem"]`
- **決定**：把 git 排在 frontmatter 之前
- **理由**：Quartz 的 frontmatter transformer 內部有一行 `data.modified ||= created`：當你只設 `created:` 沒設 `modified:` 時，它會把 `modified` 自動填成 `created`。如果 frontmatter 在 priority 裡先跑，這個自動填值會 short-circuit 後續 git pass，「最後更新日」永遠卡在發佈日不會動。git 排前面 → git 先把 `modified` 填好，frontmatter 那 pass 就不會覆蓋。`created` 仍然從 frontmatter 取（git 不負責填 `created`）
- **未解**：暫無

---

## D-002 · `quartz/` 永久排除在 prettier --write 之外

- **日期**：2026-05-05
- **背景**：設定 `npm run format` 時要決定 prettier 範圍
- **選項考慮過**：
  - 全站 prettier（含 `quartz/`）
  - prettier 只跑專案層（`content/`、`scripts/`、`*.ts`），`quartz/` 透過 `.prettierignore` 排除
- **決定**：後者
- **理由**：早期一次 `npm run format` 把整個 `quartz/` 加分號，造成 156 個檔對 upstream diff（純格式雜訊），未來 merge upstream 一定崩。已花一輪 reset 清掉
- **未解**：保持現狀。不要把 `quartz/` 從 `.prettierignore` 拿掉

---

## D-001 · 採用 vendored fork 而非 npm 安裝 Quartz

- **日期**：2026-05-05
- **背景**：開始建知識庫，要選 SSG。Quartz 4 是首選，官方提供兩種使用方式
- **選項考慮過**：
  - npm install quartz — 升級簡單，但無法深度客製 SCSS / component
  - vendored fork — repo 變大，但 quartz 內部都可改
- **決定**：vendored fork（基於 `v4.5.2`）
- **理由**：預期會大量改 `quartz/styles/custom.scss`（事後驗證確實改了 ~1200 行）；且 Quartz 官方目前就是建議這個用法
- **未解**：升級流程繁瑣（`git fetch upstream` + merge + 解 conflict），靠 README 的「從 upstream 升級 Quartz」流程處理
