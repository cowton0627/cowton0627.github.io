---
title: 用 GWS + Claude Code 整理 Gmail：讓 AI 幫你找出該封存與該清理的信件
tags: [程式, GWS, GCP, Gmail, Claude-Code, AI]
created: 2026-04-28
---

# 用 GWS + Claude Code 整理 Gmail：讓 AI 幫你找出該封存與該清理的信件

> AI 不只能寫文章，還能幫你整理收件匣。透過 gws（Google Workspace CLI）+ GCP + Claude Code 的組合，把 Gmail 變成可以用 CLI 操作的資料來源，讓 AI 幫你分類哪些信件該保留、該封存、或該清理 — 整個流程帶 prompt-level 的安全限制。
>
> 分享者：[CLC](https://medium.com/@cowton0517)

## GCP

GCP，Google Cloud Platform，Google 雲端服務平台。

一般而言，我們收到的信件都需要自己一封封去讀取，我們的眼睛已經習慣過濾一些不需要的信件，比方說，看起來就像是廣告的信件，當 momo 所有信件都排在一起，除了發票你會留下，其他有許多商品促銷的信件你馬上會跳過。

這就好比在瀏覽論壇文章，或者電子佈告欄，又或者社群媒體，人眼已習慣這種略過作法，暫且將之稱為 `眼睛過濾`。

在這個年代，**過濾** 成了一個必要技能，因為我們在不知不覺中就被 **演算法** 給帶走，在你沒有意識到的時候，你的想法，其實一直不是你的想法。

但眼睛過濾這件事並不能幫我們解決無意義的信件不想留下這件事，所以，若要透過 AI 去讀取文件，再幫我們整理哪些文件重要、不重要，或者重複需要將之 **刪除**，在電子郵件端會用到 Terminal，我們必須透過 `gws`，Google Workspace，而 gws 必須跟 GCP 串接，才能達到整理信件的目的，接下來，讓我們一步步操作吧。

## 安裝 gws

首先，打開 Terminal，鍵入如下：

```bash
brew install googleworkspace-cli
```

當然，必須先確定你的 Mac 有安裝 Homebrew。若安裝完成，再鍵入：

```bash
gws --help
```

來確定 gws 是否安裝完成。此外，由於 gws 必須跟 GCP 交互，所以我們必須要有 Google Cloud 的 SDK，再鍵入：

```bash
brew install --cask google-cloud-sdk
```

成功後，再鍵入：

```bash
gcloud init
```

會給你一串網址要你登入 Google 帳號，所以將網址貼到瀏覽器，就會去到 GCP 設定 OAuth，來讓 gws 有相應權限，連上後會看到如下：

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*yrZsGV7tZP1nB4g31Ul4Mw.png)

在 Terminal 中，則是如下：

```
You are signed in as: [yourMail@gmail.com].

[]gen-lang-client-XXXXXXXXXX

Please enter numeric choice or text value (must exactly match list item):
```

會要你選擇 `專案名稱`，這是 Google 自建好給你的專案名稱，當然，你也可以選擇自建專案名稱 `[]Create a new project`，而在 Google Cloud 上面的專案不等同於你登入的帳號，目前只是用這個帳號登入建立專案，此刻登入相同帳號，將來 gws 仍然可以登入其他 gmail 帳號來整理不同的 Gmail 帳號下的 **mail**。

## GCP 建立專案、應用程式及 OAuth

回到 GCP，我們必須為這個專案建立應用程式。

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*vq-7iokcmAn7y4yCQWhVGQ.png)

`名稱自己取`，選擇 **同於** 登入帳號的 email，目標對象選擇 **外部**，聯絡資訊也可填 **相同** 的 email，再來建立 OAuth 用戶端。

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*hg-ygRtuD0Jr-Gqasw5Taw.png)

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*64j4nimKGsESPg8_jALjrQ.png)

應用程式選擇 **電腦版應用程式**，同樣 `名稱自己取`，或者用預設的。

當建立完成會出現如下：

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*3TPVsU7i__DRTdzOEjp-nw.png)

你可以下載 JSON 檔，來保存 `用戶端 ID`，以及 `用戶端密碼`，這個需要在操作 Terminal 時跳出提示時輸入。

## 加入目標對象

接著是加入目標對象，如下：

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*keILflMrGZCb3Y-M7BRErQ.png)

由於是要操作同於這個帳號的 Gmail，＋ Add users 的地方就輸入這個帳號即可。

## 開啟 Gmail API

接著，我們還需到 [https://console.cloud.google.com/apis/library/gmail.googleapis.com](https://console.cloud.google.com/apis/library/gmail.googleapis.com)，啟用 Gmail 的 API。

再來回到 Terminal，鍵入 `gws auth setup`，同樣到瀏覽器貼上網址，一步步會出現如下：

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*kuiyTeNzj2DNQxb3Ix1OPQ.png)

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*33QEEvlwj-96wQ3oGXqu_A.png)

一直繼續後，回到 Terminal：

```
┌ gws auth setup ────────────────────────────────────────────────────────────┐
│ ✓ Step 1/5: gcloud CLI — found                                              │
│ ✓ Step 2/5: Authentication — cowton0517@gmail.com                           │
│ ✓ Step 3/5: GCP project — gen-lang-client-0328037602                        │
│ ▸ Step 4/5: Workspace APIs                                                  │
│ ○ Step 5/5: OAuth credentials                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌Select APIs to enable 0/22 selected──────────────────────────────────────────┐
│▸ ○ Google Drive       drive.googleapis.com                                  │
│  ○ Google Sheets      sheets.googleapis.com                                 │
│  ○ Gmail              gmail.googleapis.com                                  │
│  ○ Google Calendar    calendar-json.googleapis.com                          │
│  ○ Google Docs        docs.googleapis.com                                   │
│  ○ Google Slides      slides.googleapis.com                                 │
│  ○ Google Tasks       tasks.googleapis.com                                  │
│  ○ People (Contacts)  people.googleapis.com                                 │
│  ○ Google Chat        chat.googleapis.com                                   │
│  ○ Google Vault       vault.googleapis.com                                  │
│  ○ Groups Settings    groupssettings.googleapis.com                         │
│  ○ Reseller           reseller.googleapis.com                               │
│  ○ Licensing          licensing.googleapis.com                              │
│  ○ Apps Script        script.googleapis.com                                 │
│  ○ Admin SDK          admin.googleapis.com                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

選擇你要的 API，由於我們只要 Gmail 相關操作，所以選擇 `Gmail gmail.googleapis.com` 即可。

接下來，會繼續問你操作 Gmail 的權限：

```
Select OAuth scopes 8/16 selected

▸ [x] ✨ Recommended (Core Consumer Scopes) Selects Drive, Gmail, Calendar, Docs, Sheets, Slides, and Tasks
[ ] 🔒 Read Only Selects only readonly scopes for enabled APIs
[ ] ⚠️ Full Access (All Scopes) Selects ALL scopes, including restricted write scopes
[ ] gmail.compose                              ⛔ RESTRICTED Manage drafts and send emails
[ ] gmail.insert                               ⛔ RESTRICTED Add emails into your Gmail mailbox
[ ] gmail.metadata                             ⛔ RESTRICTED View your email message metadata such as labels and headers, but not the email body
[ ] gmail.modify                               ⛔ RESTRICTED Read, compose, and send emails from your Gmail account
[x] gmail.readonly                             ⛔ RESTRICTED View your email messages and settings
[ ] gmail.settings.basic                       ⛔ RESTRICTED See, edit, create, or change your email settings and filters in Gmail
[ ] gmail.settings.sharing                     ⛔ RESTRICTED Manage your sensitive mail settings, including who can manage your mail
[x] gmail.addons.current.message.metadata      ⚠️ SENSITIVE View your email message metadata when the add-on is running
[x] gmail.addons.current.message.readonly      ⚠️ SENSITIVE View your email messages when the add-on is running
[x] gmail.send                                 ⚠️ SENSITIVE Send email on your behalf
[x] gmail.addons.current.action.compose                     Manage drafts and send emails when you interact with the add-on
[x] gmail.addons.current.message.action                     View your email messages when you interact with the add-on
[x] gmail.labels                                            See and edit your email labels
```

由於可能接下來不是你操作的，比方說丟給 **claude code**，我們權限就開小一點，可以先開 `[x] gmail.readonly`、`[x] gmail.labels`，其他都不選。

好！接下來可以稍微測試一下 gws 操作 gmail 的功能了！

## 測試 gws

我們可以使用 `gws gmail --help` 來看看指令怎麼下，不然就直接鍵入如下：

```bash
gws gmail users messages list --params '{"userId":"me","maxResults":10}'
```

這代表說，我要查詢的是當前登入的帳號的 mail list，會得到如下：

```json
{
  "messages": [
    {
      "id": "19dcd65929aabae0",
      "threadId": "19dcd65929aabae0"
    },
    ...
```

但這個只有信件的 `id` 跟 `threadId`，並不能判斷什麼，不過接下來是要交給 **Claude Code**，就不繼續研究 gws 的指令了。

## Claude Code

我們直接在 Terminal 登入 Claude Code，並且下達如下的指令：

```
請整理 yourMail@gmail.com 的 Gmail 收件匣。
只處理 INBOX，不要處理全部郵件。

請用 gws 抓取最多 5000 封（視你的信件多寡而定） INBOX 信件：

gws gmail users messages list --params '{"userId":"me","labelIds":["INBOX"],"maxResults":500}' --page-all --page-limit 10

接著批次取得每封 metadata：
From、Subject、Date、labelIds、snippet、sizeEstimate。

請輸出：
/Users/chunlicheng/Desktop/inbox_cleanup_review.csv

分類成：
1. keep
2. review_needed
3. likely_archive
4. likely_trash

限制：
- 不要刪除任何信件
- 不要呼叫 trash/delete/modify
- 收據、發票、訂單、付款、登入、安全、驗證、銀行、政府、學校、醫療、保險一律 review_needed
- 不確定就 review_needed
```

將結果建立一個 csv 輸出到桌面，打開 csv 看到這樣的結果：

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*nX6AwBDJoOty4cL59j9tbw.png)

![一共處理了 5001 項，包含日期、寄件者、主旨、原標籤、新分類、理由、建議動作](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*BxPD_v5hZ_rZm6MIdJ7BgQ.png)

一共處理了 5001 項，包含日期、寄件者、主旨、原標籤、新分類、理由、建議動作。

閱讀 csv 檔後大致上是說，這些像是 `廣告信`、`促銷信` 的可以準備刪除，主要是 `原標籤歸到新分類` 這個動作，實際上看了看若差不多，就可以開始進行這些 mail 的處置。

## 加入 gws 權限

我們若要進一步動作，需要加入 gws 的權限，回到 Terminal 鍵入 `gws auth login -s gmail`，選 `gmail.modify`。

下一步，將上了標籤的信件移到垃圾桶，我們回到 Claude Code 輸入下面的指令：

```
請處理 Gmail 信件，但必須完全安全：
條件：
- label:cleanup-trash-candidate
- older_than:30d

操作：
- 使用 gws 將信件移到 Trash（不是永久刪除）

限制：
- 每 100 封回報一次進度
- 若出現任何錯誤 > 1%，立即停止
- 不可使用永久刪除 API
- 不可處理不符合條件的信件
```

繼續讓 Claude Code 跑，直到處理完，打開 Gmail，可以看到這樣的結果：

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*UXzKztSy0MNFIC3NKaLlGQ.png)

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*F4j4AjLqFOYEhVP7HUO29w.png)

當這些信件不是那麼重要，就已經被上了 `cleanup-trash-candidate` 標籤，也方便你做刪除。

在 Claude Code 最終結果如下：

![](/static/_assets/用%20GWS%20%2B%20Claude%20Code%20整理%20Gmail/1*8xXEsVYZ9VnSFZbnQwbfBQ.png)

---

過去，我們是用眼睛在過濾資訊；現在，我們開始用系統在過濾資訊。

gws 讓 Gmail 變成可以用 CLI 操作的資料來源，Claude Code 則讓這些資料可以被理解與分類。

而你要做的，其實只是最後一步：**決定留下什麼**。
