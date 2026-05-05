---
title: Git 筆記
tags: [程式, Git, CLI]
created: 2026-05-05
---

# Git 筆記

> 從 IDE 內建到純 CLI 的 Git 入門記錄。內容偏向第一次接觸 Git 的工程師：怎麼開新 repo、怎麼接遠端、最常用的幾個指令、以及一個常被踩到的安全坑（在 URL 裡塞帳號密碼）。
>
> 分享者：[CLC](https://medium.com/@cowton0517)

## CLI 還是 GUI？

使用 Git 的方法有許多種，CLI（命令列）與 GUI（圖形介面）能達到相同功效：

- **GUI**：[Sourcetree](https://www.sourcetreeapp.com/)、[GitKraken](https://www.gitkraken.com/)、VS Code 內建的 Source Control 面板等，視覺化分支圖比較直觀，適合剛入門。
- **CLI**：在 macOS / Linux 的 Terminal 直接打 `git xxx`，速度快、可寫腳本、跨機環境一致。建議至少把 CLI 練到能應付日常工作。
- **IDE 內建**：Xcode、IntelliJ、Visual Studio 等大廠 IDE 都有自己的 Source Control 整合。

下文先談 IDE 內建（以 Xcode 為例），再進到純 CLI。

## 在 IDE 中初始化 repo（Xcode 範例）

在 Xcode：`Preferences` → `Accounts` 加入 GitHub 帳號 → 在 Source Control navigator 對專案右鍵 → **New Remote**，系統會問是否要在 GitHub 建立新 repo，並列出該 repo 的路徑。

幾個概念要弄清楚：

- Xcode 專案在初次建立時就已有幾個檔案（`Info.plist`、`ViewController.swift` 等）。當你建 repo 的同時，這些檔案會以**第一次的 commit** 上傳，這個 commit 就是所謂的 **initial commit**。
- Xcode 左上方工具列：第一個 tab 是 **Project navigator**（檔案樹），第二個是 **Source Control navigator**（Git 介面）。
- 在 Source Control navigator 中選**專案** → 右鍵 → **New Remote** → 選 GitHub 帳號 → 完成。

> [!note]
> IDE 介面可以掩蓋很多 Git 機制細節 —— 適合做事，不適合學原理。學原理還是要落地到 CLI。

## 常用 Git 指令

### `git init`

在當前資料夾建立 git repo。執行後在該資料夾會多出一個隱藏的 `.git/` 目錄：

```bash
$ git init
$ ls -a
.git    README.md   ...

$ cd .git && ls -a
config  HEAD  hooks  info  objects  refs  ...
```

`.git/config` 是這個 repo 的設定檔，用 `cat config` 看大致長這樣：

```ini
[core]
    ...
[remote "origin"]
    url = https://github.com/account/repo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
    ...
```

最重要的是 **`url`** —— 它告訴 Git「遠端」repo 在哪裡。

### `git remote set-url`

設定 / 修改遠端 URL，免得每次 push 都要打一長串：

```bash
$ git remote set-url origin git@github.com:account/repo.git
```

之後 `.git/config` 的 `[remote "origin"]` 段就會更新成這個 URL。

### `git status`

看當前工作目錄與暫存區的狀態 —— 哪些檔被改了、哪些已加入暫存、哪些還沒 commit。**最常用的指令之一，每幾個動作就跑一次確認狀態**。

```bash
$ git status
On branch main
Changes not staged for commit:
  modified:   README.md
Untracked files:
  newfile.txt
```

`-s` / `--short` 旗標可顯示縮寫格式：

```bash
$ git status --short
 M README.md
?? newfile.txt
```

### `git add`

把工作目錄的修改放進**暫存區**（staging area），準備 commit：

```bash
$ git add file.txt        # 加單一檔
$ git add .               # 加目前目錄下所有變更（含未追蹤）
$ git add -p              # 互動式，逐 hunk 選擇要加什麼
```

### `git commit`

把暫存區的內容固化為一個 commit：

```bash
$ git commit -m "Initial commit"
```

> [!tip] 寫 commit message 的訣竅
> **寫 why，不要只寫 what**。
> 「修了 button alignment」是 what；「修因為 RTL 語系下右上角 button overflow」才是 why。

### `git branch`

操作分支。

```bash
$ git branch                  # 列出本地分支，當前分支前有 *
$ git branch feature/login    # 建立新分支 feature/login（但不切過去）
$ git branch -d feature/old   # 刪除已 merge 的分支
$ git branch -D feature/old   # 強制刪除（沒 merge 也刪）
```

切換分支用 `git checkout <branch>` 或新版的 `git switch <branch>`。

### `git push`

把本地 commits 推到遠端：

```bash
$ git push -u origin main     # 第一次 push 加 -u 建立追蹤關係
$ git push                    # 之後就直接 push（用追蹤關係）
```

`-u` 等同 `--set-upstream`，建立後本地分支與遠端分支的對應就記在 `.git/config` 裡。

### `git pull`

把遠端最新內容拉下來，相當於 `git fetch + git merge`：

```bash
$ git pull
```

如果不希望產生 merge commit，可以加 `--rebase`：

```bash
$ git pull --rebase
```

### `git log`

看 commit 歷史。常用旗標：

```bash
$ git log                     # 完整資訊
$ git log --oneline           # 一行一個 commit
$ git log --oneline --graph   # 加上 ASCII 分支圖
$ git log --oneline -10       # 只看最近 10 筆
```

## ⚠️ 遠端 URL 不要塞帳密

過去常看到的寫法：

```bash
$ git push -u http://account:password@localhost:3000/repo.git main
```

意思是用 HTTP 協定、帳號密碼直接塞在 URL，把本地專案推到遠端 `main` 分支。這種寫法**強烈不建議**，原因：

- 密碼會出現在 shell history、process listing、git config 檔
- 可能被記到 server log、proxy log
- 帳密外洩的風險高很多

**比較安全的做法**：

1. **SSH 金鑰**：產生密鑰對（`ssh-keygen`），把公鑰貼到 GitHub / GitLab / Gitea 的 SSH keys 設定。URL 改成 `git@host:user/repo.git`，不需密碼。
2. **HTTPS + Personal Access Token (PAT)**：在 Git 平台產生一個有限權限的 token 取代密碼，用 git credential helper（如 macOS 的 keychain）記住。

雖然 SSH 設定比 HTTPS 麻煩一點（要產 key、貼公鑰），但**只要設一次**，之後 push/pull 完全不用打帳密，安全性又高。值得花這 5 分鐘。

## 延伸閱讀

- [Pro Git 中文版（書）](https://git-scm.com/book/zh-tw/v2)
- [GitHub Docs：Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [GitHub Docs：Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [Atlassian：Git tutorials](https://www.atlassian.com/git/tutorials)
