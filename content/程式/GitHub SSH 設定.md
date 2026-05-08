---
title: GitHub SSH 設定：從 HTTPS 認證失敗到自動化 push
tags: [程式, GitHub, SSH, Git]
created: 2026-05-08
---

# GitHub SSH 設定：從 HTTPS 認證失敗到自動化 push

> 第一次 `git push` 跳出 `Password authentication is not supported for Git operations.`，是很多人接觸 GitHub 後第一個卡關。原因是 GitHub 從 2021 年 8 月起停止支援帳號密碼推送，HTTPS 路徑要嘛走 Personal Access Token，要嘛改用 SSH 金鑰。SSH 一次設定終身受用，這篇紀錄完整流程。
>
> 分享者：[CLC](https://medium.com/@cowton0517)

## 為什麼要走 SSH

GitHub 從 2021/08/13 起停止 HTTPS 的密碼推送：

```
remote: Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/...'
```

剩下兩條路：

| 方式 | 優點 | 缺點 |
|------|------|------|
| **HTTPS + Personal Access Token (PAT)** | 設定快，跟密碼一樣輸入 | Token 有期限，到期要換；複雜密碼難記、難存 |
| **SSH 金鑰** | 一次設定終身用，命令列不用輸入任何密碼 | 第一次有點概念門檻 |

對長期使用者，**SSH 是正解**。而且如果你同時有公司、個人帳號（多 GitHub account），SSH 透過 `~/.ssh/config` 切換比 PAT 乾淨太多。

## Step 1 · 產生專屬 SSH key

不要直接覆寫預設的 `~/.ssh/id_ed25519` ── 那個可能你早期已經設給其他服務（GitLab、伺服器登入）。**指定獨立檔名**避免污染：

```bash
ssh-keygen -t ed25519 -C "你的 GitHub 信箱" -f ~/.ssh/id_ed25519_github
```

- `-t ed25519`：演算法。比舊的 RSA 短、快、安全。
- `-C "..."`：comment，貼到 GitHub 後一眼看出是哪台機器哪個帳號的 key。建議用「裝置-用途」的格式，例如 `mac-mini-personal` 或 `work-laptop-2026`。
- `-f ~/.ssh/id_ed25519_github`：金鑰檔案路徑。GitHub 專用就明確命名 `_github`，未來新增其他服務（GitLab、Bitbucket）各自獨立檔案。

過程中會問 passphrase（金鑰密碼）── 個人機器可空白省事，公司或共用機器**強烈建議設**，多一道防護。

跑完會在 `~/.ssh/` 多兩個檔：

```
~/.ssh/id_ed25519_github       ← 私鑰（絕對不能外流）
~/.ssh/id_ed25519_github.pub   ← 公鑰（可以給人）
```

## Step 2 · 把公鑰加到 GitHub

```bash
cat ~/.ssh/id_ed25519_github.pub
```

複製整段（從 `ssh-ed25519` 開頭到 email 結尾）。

到 GitHub：

1. 右上頭像 → **Settings**
2. 左側 **SSH and GPG keys**
3. **New SSH key**
4. **Title**：跟 `-C` 寫的 comment 對齊（例如 `mac-mini-personal`）
5. **Key type**：`Authentication Key`
6. **Key**：貼上剛複製的整段公鑰
7. **Add SSH key**

## Step 3 · 設定 `~/.ssh/config`

這一步最多人略過，但**沒設等於 SSH 不知道要拿哪把 key 去敲 GitHub**，會用預設 `~/.ssh/id_ed25519`，然後失敗。

打開（或建立）`~/.ssh/config`：

```ssh-config
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
  UseKeychain yes
  AddKeysToAgent yes
```

各行解讀：

| 設定 | 作用 |
|------|------|
| `Host github.com` | 之後遇到 `git@github.com` 就套這個 block |
| `IdentityFile` | 指定要用哪把 key |
| `IdentitiesOnly yes` | **只用** `IdentityFile` 指定的這把，不要試其他 key（避免「Too many authentication failures」） |
| `UseKeychain yes` | macOS 專用：把 passphrase 存到 Keychain，每次自動解鎖 |
| `AddKeysToAgent yes` | 開機後自動把 key 加進 ssh-agent |

存檔後設權限（一定要）：

```bash
chmod 600 ~/.ssh/config
```

### 多帳號（個人 + 公司）擴充

如果你同時有公司、個人 GitHub，繼續擴充 `~/.ssh/config`：

```ssh-config
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_personal
  IdentitiesOnly yes

Host github.com-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github_work
  IdentitiesOnly yes
```

之後 clone 時用 host alias 區分：

```bash
# 個人 repo
git clone git@github.com-personal:cowton0627/...
# 公司 repo
git clone git@github.com-work:my-company/...
```

## Step 4 · 把既有 repo 的 remote 從 HTTPS 換 SSH

如果是新 repo，clone 時直接用 SSH URL 就好：

```bash
git clone git@github.com:cowton0627/cowton0627.github.io.git
```

若 repo 已經 clone 過了（HTTPS）：

```bash
# 看現在的 remote
git remote -v
# origin  https://github.com/cowton0627/cowton0627.github.io.git (fetch)

# 換成 SSH
git remote set-url origin git@github.com:cowton0627/cowton0627.github.io.git

# 驗證
git remote -v
# origin  git@github.com:cowton0627/cowton0627.github.io.git (fetch)
```

GUI 客戶端（Sourcetree / GitHub Desktop / GitKraken）也要在「Repository Settings」→ Remote 改成 SSH URL。

## Step 5 · 驗證

```bash
ssh -T git@github.com
```

第一次會跳：

```
The authenticity of host 'github.com (...)' can't be established.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

打 `yes`。看到這行就成功：

```
Hi cowton0627! You've successfully authenticated, but GitHub does not provide shell access.
```

> [!tip] 這個訊息不是錯誤
> 「does not provide shell access」是 GitHub 故意的，SSH 認證 OK 就代表能 push 了。

## Step 6 · 之後的日常流程

設定完之後，所有 push / pull 都不需要再輸入帳密：

```bash
git add .
git commit -m "update content"
git push
```

如果你的 repo 接了 GitHub Actions（例如自動部署到 GitHub Pages / Cloudflare Pages），push 完工作流會自動跑：

```
checkout repo → install deps → build → deploy
```

整個流程零互動。

## 常見坑與排錯

### `Permission denied (publickey)`

九成是 `~/.ssh/config` 沒設，或 `IdentityFile` 路徑寫錯。檢查：

```bash
ssh -vT git@github.com
```

`-v` 會列出它試了哪些 key，看是不是用錯把。

### Sourcetree / GitHub Desktop push 失敗，命令列卻 OK

GUI 客戶端可能用內建的 SSH agent，不吃 `~/.ssh/config`。在 GUI 設定裡找「SSH Client」或「Use OpenSSH」選項切到系統 OpenSSH。

### 公司電腦原本有 key，個人不想覆蓋

**永遠用 `-f` 指定獨立檔名**（Step 1），加上 `IdentitiesOnly yes`（Step 3），兩把 key 各管各的。

### Passphrase 每次都要打

macOS：`UseKeychain yes` 已經會存 Keychain 了。第一次 `ssh -T` 時系統會問要不要存，按「永遠允許」。

Linux：用 `ssh-add ~/.ssh/id_ed25519_github` 加進 ssh-agent，配 `keychain` 套件可開機自動載入。

## 重點回顧

1. **HTTPS 密碼 push 已死**，2021 年起只能走 PAT 或 SSH。
2. **產生 key 用 `-f` 指定獨立檔名**，不要覆寫預設。
3. **`~/.ssh/config` 是必設**，沒設等於 SSH 不知道用哪把 key。
4. **`IdentitiesOnly yes`** 防多 key 互踩。
5. 既有 repo 用 `git remote set-url` 從 HTTPS 換到 SSH。
6. **`ssh -T git@github.com`** 看到 `Hi <你的帳號>!` 就成功。
