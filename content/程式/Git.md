---
title: Git 筆記
tags: [程式, Git, CLI]
---

# Git 筆記
> 分享者: [CLC](https://medium.com/@cowton0517)

1. 使用`Git`的方法有許多種，能用 CLI 或 GUI 去達到相同的功效，GUI 像是 Sourcetree 比較直觀，而在 Mac 中使用 Terminal 會鍵入 git init 來開始使用`Git`。

2. 在各種 IDE 如 Xcode 中，於 Preference 加入`Github`帳號，若有新增 Remote，當你連上`Github`時，會在 Repository 看見 **initial commit**，代表這個 Repository 是初次建立。
此時需注意：

- Xcode 專案中，初次建立時就存在幾個檔案，如 **info**.plist、**ViewController**.swift 等，在建立 repo 的同時，這些檔案也會上傳到 repo，就是所謂 **initial commit**。
- Xcode 中，左上方工具列第一個 label 是 project navigator；第二個是 the source control navigator。
    - 在 the source control 中選擇**專案** => 右鍵新增 **Remote**，系統就會問你要在 Github 上創建 repo 嗎，同時也列出 repo 的路徑。


---
## 各種 git command
### git init
建立 git，此時 Terminal 切換到專案鍵入 `ls -a`，可以看見 .git 資料夾，切換到 .git 資料夾後鍵入 `ls -a`，可以看見 config 檔，cat config 會得到：

- [core]
- [remote "origin"]
    url = http://account:password@localhost:3000/repository.git
    fetch
- [branch "main"]

等資訊，其中最重要的是 url，當有了本地庫，重要的是將本地庫與遠程庫連在一起，這種寫法是使用 http 協定，以帳號、密碼去對遠程庫做操作。

我們可以鍵入`git push -u http://name%40company.com.tw:yes%123Z@localhost:3000/repository.git main`

這段指令的意思是，將本地專案推送到遠程庫中的 main 分支。


### git remote set-url
為了省去每次都要打一串 url 的麻煩，我們使用 git remote set-url origin 將 repository 的網址放入，在 .git 資料夾中，config 就會有剛才的 url，當然，你也可以使用 SSH 來推送到遠程庫，但比較麻煩，必須產生 key，以密鑰對的方式驗證。

### git push -u origin main
將來 push 到遠程就可以直接使用這個指令。

### git add .
加入不特定修改的檔案，即全加入。

### git commit -m "Initial commit"
建立本地庫後，commit 會放入 Initial commit，當你 git push -u origin main 成功後，就把遠程庫與本地庫連接起來了。

接下來，若有修改，我們一樣 git add .，再 git commit -m "My commit"，再 git push -u origin main，就完成當次推送。

### git status
### git branch