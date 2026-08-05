---
title: 手機用 obsidian-git 同步筆記：token 踩坑全紀錄
tags: [程式, Obsidian, Git, PKM, iOS, Android]
created: 2026-08-05
---

# 手機用 obsidian-git 同步筆記

> Obsidian 官方的 Sync 要訂閱。如果你的 vault 本來就放在 git repo 裡，
> 手機端可以用 `obsidian-git` 外掛接同一個 repo，達到一樣的效果。
> 但這條路有兩個雷，兩個都會讓你卡到懷疑人生——因為錯誤訊息完全不指向真正的原因。

---

## 雷一：token 一定要用 classic，不能用 fine-grained

這是最大的坑。

`obsidian-git` 在手機上不能呼叫系統的 git，它用的是**純 JavaScript 的 git 實作**（isomorphic-git）。而這個實作**跟 GitHub 的 fine-grained token 不對盤**。

症狀分兩種，都很有誤導性：

| 你拿到的 token                              | 症狀                            |
| ------------------------------------------- | ------------------------------- |
| fine-grained（開頭 `github_pat_`）          | 直接 **HTTP 403**               |
| 以為是 classic、結果還是 `github_pat_` 開頭 | **credential failed → aborted** |

第二種特別容易發生：GitHub 的 token 設定頁有兩個分頁，很容易點錯回 fine-grained 那邊。

### 解法：確認開頭是 `ghp_`

1. 直接開 <https://github.com/settings/tokens>
2. 確認頁面標題是 **Personal access tokens (classic)**
3. `Generate new token (classic)` → scope **只勾 `repo`** → Generate
4. 用複製鈕**整串複製**
5. **務必確認開頭是 `ghp_`**——如果還是 `github_pat_`，就是又點到 fine-grained 分頁了

### 先在電腦上驗 token 再貼進手機

手機上輸入錯了很難查，先在電腦驗證：

```bash
printf "token: "; read -rs TOK; echo; \
printf "帳號: "; curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: token $TOK" https://api.github.com/user; \
printf "repo:  "; curl -s -o /dev/null -w "%{http_code}\n" \
  -H "Authorization: token $TOK" https://api.github.com/repos/<你的帳號>/<你的repo>; \
unset TOK
```

| 回應       | 意思                                               |
| ---------- | -------------------------------------------------- |
| 200 / 200  | token 正常                                         |
| 401        | token 無效（過期、貼錯、或被撤銷）                 |
| 403 或 404 | 權限不足——多半是拿到 fine-grained，或忘了勾 `repo` |

> [!caution] 不要讓 token 變成明文
> 上面用 `read -rs` 是刻意的：隱藏輸入、不留 shell 歷史。如果指令斷行或 `read` 沒接好，token 會直接印在畫面上和歷史裡。
> **一旦外露就立刻去 settings/tokens 撤銷重產**，新的存進密碼管理器。

---

## 雷二：author name / email 沒填，整條同步靜默中斷

這個更陰險，因為它**看起來像 token 壞掉**。

手機版沒有系統 git 可以 fallback 到 `git config --global`，所以外掛設定裡的 **Author name / Author email 兩欄如果空著，commit-and-sync 整個流程會中斷——連 pull 都不會跑**。

實際症狀：

- 手機上的筆記**凍結在某一天**，之後電腦上寫的東西完全沒下來
- 打開筆記才跳出 `git author name and email are not set. Please set both fields in the settings.`
- 而 token 其實是好的

你會先去懷疑 token、懷疑網路、懷疑 repo 權限，因為「同步停了」的第一直覺不會是「commit 身分沒設」。

### 解法

外掛設定 → **Commit author** 區塊，兩欄都填：

- **Author name**：你的 GitHub username
- **Author email**：建議用 GitHub 的 noreply 格式 `<ID>+<username>@users.noreply.github.com`（contribution 歸戶是看 email，用 noreply 可以不外流真實信箱）

填完後手動跑一次 `Git: Pull` 把落後的進度補回來，再跑 `Git: Commit-and-sync` 驗證雙向都通。

---

## iOS 設定要點

1. App Store 裝 Obsidian → **新建一個空 vault**
2. **`Store in iCloud` 關掉**——讓 iCloud 和 git 同時管同一份檔案，衝突起來會很難收拾
3. 裝 `obsidian-git` 外掛 → 填 repo URL 與上面兩組設定 → clone

---

## 一個正常但會嚇到人的現象

手動執行 commit-and-sync，回報 **`no changes to commit`**——**這不是錯誤**。

通常是背景的 auto commit-and-sync 已經搶先把變更送出去了。看到這句話代表一切正常，不用再按第二次。

---

## 相關

- [[GitHub SSH 設定]] —— 電腦端的認證用 SSH 更省事
- [[Git]]
