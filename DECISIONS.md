# DECISIONS

逐筆紀錄這個 repo 走到今天的關鍵選擇。每筆格式：
**日期 / 背景 / 選項考慮過 / 決定 / 理由 / 未解**

按時間倒序，最新在最上面。

---

## D-014 · 個資外洩掃描擋 deploy（規則寫「形狀」，字面字串走 local 檔）

- **日期**：2026-08-05
- **背景**：整理 `content/` 時發現 SEO 筆記夾帶了個人識別資訊，其中英文本名是用**數學粗體 Unicode**（U+1D400 區段）寫的——連續幾輪 `grep` 都掃不到，因為那些字元根本不是它們看起來的 ASCII 字母。同一篇還有疑似手機號碼的 wordpress 子網域、以及點名第三方公司當反例。另在 Gmail 教學文找到個人 email、GCP 專案 ID、含使用者名的絕對路徑（都是貼 CLI 輸出時連帶帶進去的）
- **選項考慮過**：
  - 不做，靠人工 review — 已證明無效，這次就是人工看了好幾輪才發現
  - 只在本機做 pre-commit hook — hook 不進 git，換機器就失效，也擋不住 GUI client 以外的路徑
  - weekly cron 開 issue（比照 D-010 的外部連結）— 發現時已經發佈了
  - **CI 擋 deploy**（選這個）
- **決定**：
  - `scripts/check-privacy.mjs` 掃 `content/**/*.md`，接進 `deploy.yml`、`npm run check`、`npm run check:privacy`
  - **發現就擋 build，main 不 deploy**
  - 七條內建規則全部是結構樣式：花體/全形 Unicode、email 文法、`/Users|/home/<帳號>` 路徑、RFC1918 + 100.64/10 CGNAT IP、台灣手機號碼、token 前綴、GCP 專案 ID
  - 字面字串（本名、雇主名、舊帳號）走 gitignored 的 `.privacy-patterns.local`，附 `.example` 範本
  - 刻意公開的字串（Medium handle、`git@github.com`、noreply email、佔位符）進腳本的 `ALLOW` 陣列，每筆附理由
- **理由**：
  - **擋 build 而不是開 issue**：個資一發佈就同時被 HackMD 鏡像（D-013）與搜尋引擎索引，**revert commit 兩邊都收不回來**。外部連結腐爛可以慢慢修，這個不行
  - **規則寫形狀不寫字串**：這個腳本本身在 public repo，把真名硬編進去等於掃描器自己就是洩漏源。這是設計上的硬約束，不是風格偏好
  - 結構規則才抓得到「看起來像字母但不是字母」這類洩漏，純字串搜尋抓不到——這正是本次的起因
- **驗證**：用 fixture 測 13 種洩漏樣態全部命中；同時確認 Medium handle、`git@github.com`、noreply email、`yourMail@gmail.com`、CGNAT 範圍外 IP、一般九位數字都正確放行。第一版的 ALLOW 比對用「整行位置」判斷，會誤殺 noreply email，是這個測試抓出來的
- **未解**：
  - `.privacy-patterns.local` 目前只有英文名與雇主網域，**中文本名尚未填**
  - 只掃 `content/`。README、DECISIONS、commit message 不在範圍內
  - HackMD 端已發佈的內容不會因為 repo 修好而回溯——真要撤下得另外去 HackMD 刪，並清掉 `.hackmd-sync/mapping.json` 對應條目

---

## D-013 · KnowledgeBase → HackMD 單向同步（API + hash-based skip）

- **日期**：2026-05-14
- **背景**：`content/` 是 Obsidian vault + Quartz source，已 deploy 到 GitHub Pages。想把同樣內容鏡到 HackMD 多一個閱讀通路（行動裝置易讀、有留言系統）；不希望兩邊各自維護
- **選項考慮過**：
  - 不做，只在 GitHub Pages
  - 方向：**GitHub → HackMD** vs HackMD → GitHub vs 雙向
  - 機制：**HackMD API + GitHub Actions** vs HackMD 內建 GitHub Sync（Book 形態）vs 本地手動 CLI
  - 部署位置：**個人 workspace** vs Team
- **決定**：
  - 單向 GitHub → HackMD（repo 永遠是 source of truth）
  - 自建 `scripts/sync-hackmd.mjs` 走 HackMD API v1
  - GitHub Actions 自動觸發（push to main, paths: `content/**/*.md`）
  - 部署到個人 workspace、`readPermission: guest`
  - mapping 用 `path → {id, hash}` 存 `.hackmd-sync/mapping.json`，CI 自動 commit 回 repo
  - Wikilink 轉成 Quartz public site 連結（spaces → `-`、Unicode 保留）
- **理由**：
  - 雙向衝突解決複雜，且文章主要在 Obsidian 寫、HackMD 只是鏡像
  - HackMD 內建 GitHub Sync 是 Book 形態、不支援我們的目錄結構，且部分功能付費
  - hash-based skip 比每次都 PATCH 省 API 配額（25 篇沒改 → 0 API calls）
  - 個人 workspace 而非 Team：HackMD API **不支援把 note 從個人移到 team**（`UpdateNoteOptions` 沒 `teamPath` 欄位），未來真要搬團隊得整批重建（新 ID、新 URL），現在不付這個成本
- **踩雷紀錄**（供未來再做時參考）：
  - 建立 note 的 endpoint 是 `POST /notes`，**不是** `POST /me/notes`。官方 Swagger 沒列、要看 `hackmdio/api-client` 的 Node client source 才確定：
    - `createNote`: `POST notes`
    - `updateNote`: `PATCH notes/{noteId}`
    - `createTeamNote`: `POST teams/{teamPath}/notes`
  - `parentFolderId` 可在 create / update 時設定，未來要在 HackMD 用資料夾分類只要改 script、不必動 mapping
- **未解**：
  - 檔案在 repo 刪掉、HackMD 端不自動 delete（mapping 保留 orphan）。要加 `--prune` 旗標得評估誤刪風險
  - 改檔名 = 新建 note + 舊 note 變孤兒；想保留歷史得手動改 mapping.json 的 key
  - Quartz callout `> [!note]`、image embed `![[...]]` 在 HackMD 端不 render（沒同步轉換邏輯）

---

## D-012 · git history 清除 Claude 協作署名（commit message trailer）

- **日期**：2026-05-13
- **背景**：全域 `~/.claude/CLAUDE.md` 已規定 commit message 不要加 `Co-Authored-By: Claude ...` 與 `🤖 Generated with [Claude Code]` 行，但早期 session 那條規則還沒加，留下 53 個 commits 有 `Co-Authored-By: Claude` trailer；另有 2 個從上游 jackyzha0/quartz merge 進來的 commits 帶 `🤖 Generated with [Claude Code]`
- **選項考慮過**：
  - 不管它 — 接受 Claude trailer 永遠留在 public history
  - 只在新 commit 不加、舊的不動 — 規則生效，但 `git log` 還是看得到歷史協作痕跡
  - `git filter-repo --message-callback` 改寫 commit message body、移除指定 trailer 行 — 徹底，但所有 SHA 再變一次（D-011 後第二次）
- **決定**：用 `git filter-repo --refs main --message-callback` 跑 Python regex 移除三種 pattern（`Co-Authored-By: Claude*` / `Co-authored-by: Claude*` / `🤖 Generated with [Claude Code]*`），collapse 結尾多餘空行；`git push --force-with-lease origin main`；連上游 2 個 `#2231` CJK tokenization commits 的 🤖 行也一起清掉（範圍包含整個 main reachable history）
- **理由**：
  - public repo 把 Claude 協作行留在 commit message 不符合個人偏好（D-011 同邏輯：歷史看得到的東西要乾淨）
  - 只動 commit message body，不動 author/committer（D-011 已處理那層）
  - 單人 repo + 無其他 clone，破壞性 force-push 範圍可控
- **作法**（供未來再做時參考）：

  ```bash
  # 1. 安全網
  git tag backup-before-claude-strip main

  # 2. Python callback (/tmp/strip_claude.py)
  #    pattern: ^(Co-Authored-By: Claude|Co-authored-by: Claude|🤖 Generated with \[Claude Code\])
  #    刪掉匹配行 + collapse 結尾連續空行

  # 3. filter-repo（previous-run 提示要餵 Y）
  yes Y | git filter-repo --refs main \
    --message-callback "$(cat /tmp/strip_claude.py)" --force

  # 4. push & 清 backup tag
  git push --force-with-lease origin main
  git tag -d backup-before-claude-strip
  ```

- **未解**：
  - 同 D-011：舊 commit objects 在 GitHub 端要等 GC，外部 fork / cache 抓過舊 SHA 仍可能找到舊內容
  - 上游 quartz `#2231` 兩個 commits 在我們 fork 上 SHA 已偏離 upstream，未來 `git pull upstream` 可能再帶回原版 SHA 造成歷史重複；可接受（D-011 已造成同樣狀況）

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
  - cron workflow 受 GitHub「repo 60 天無 activity 自動停用排程」政策影響（2026-07-14 首次觸發預警，已用 `gh workflow enable` 續命）。repo 長期不動時 weekly 檢查會默默停掉，處理方式見 README「連結完整性檢查」段

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
