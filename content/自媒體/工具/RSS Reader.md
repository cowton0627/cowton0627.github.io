---
title: 客製化訂閱內容 - RSS Reader
tags: [自媒體, RSS, 工具]
created: 2026-05-04
---

# RSS Reader

## RSS Feed

請見緣起。

### 緣起

要了解 RSS Feed，最快的方法還是先透過 RSS Reader。

RSS Reader 可以理解為一個「訂閱 XML 的閱讀器」。每當創作者更新內容時，閱讀器就會抓取最新內容，並在需要時通知你。

也就是說，透過 RSS Reader，你可以排除掉各種社群平台不必要的推播，只專注在自己真正想看的內容上。

如果想知道在 iOS 上如何自己寫一個 RSS Reader，可以參考這篇文章：

[Xcode - RSS 裡的 XML](https://cowton0517.medium.com/37-d-n-xcode-rss%E8%A3%A1%E7%9A%84xml-9498ce1fc2b)

---

### 使用 RSS Reader

以下以常見的 RSS Reader：**Feedly** 為例，直接用手機操作。

![Feedly 所有更新的訂閱內容](https://hackmd.io/_uploads/S1hNDZoZ1x.png)

> 上圖是所有更新的訂閱內容，下圖則是分類中所有訂閱的頻道。

![Feedly 分類中的訂閱頻道](https://hackmd.io/_uploads/BJBBv-ibke.png)

**Feedly** 是一個 RSS Reader。  
在 Feedly 中，已經加入的 RSS 內容會依照更新時間呈現。若訂閱內容有更新，就可以收到通知。

Feedly 也可以新增分類，並把不同 RSS Feed 放進不同分類中，方便日後整理與閱讀。

---

### 新增訂閱內容

首先，點到下方左邊數來第四順位的 Tab，搜尋內容，例如：`BBC News`。

![Feedly 搜尋 BBC News](https://hackmd.io/_uploads/ByKwYZs-yg.png)

接著會看到各種內容來源。選擇想要訂閱的來源，點選右邊的 **+**，就可以訂閱，並設定分組。

如果想讓同一個內容出現在不同分組中，也可以重複加入不同分類。

如此一來，使用 RSS Reader 的世界就變得相當美好了，不是嗎？

---

### 議題：搜尋不到的內容怎麼辦？

> 有一些內容無論怎麼搜尋都搜尋不到。
>
> 例如：
>
> - 某個特定的 YouTube 頻道
> - 某個特定的 Instagram 帳號
> - 某個特定的 Threads 帳號
>
> 這時候就可以使用 **RSS 產生器**。

RSS 產生器的原理，是定時去爬取指定帳號或網站是否有更新內容，再把更新結果包裝成 XML 檔。

因此，訂閱由 RSS 產生器產出的 XML，就等於訂閱該帳號或網站的更新。

---

### 使用 RSS.app 產生 RSS Feed

我們可以使用 [RSS.app](https://rss.app/) 來產生 RSS Feed。

![RSS.app 後台](https://hackmd.io/_uploads/HyWGy7s-ke.png)

> 在 RSS.app 中，可以建立多種來源的 RSS Feed。
>
> 例如：
>
> - Threads
> - Instagram
> - YouTube
> - 一般網站

---

### 建立新的 RSS Feed

首先，從左邊頁籤看到下方有一個 **+ New Feed**，把它點下去。

![RSS.app 新增 Feed](https://hackmd.io/_uploads/HyFeJQjWJl.png)

> 接著可以看到 RSS.app 支援許多不同平台的內容來源，往下拉還有更多選項。

![RSS.app 支援的平台](https://hackmd.io/_uploads/Skzg-Xs-Jg.png)

---

### 輸入來源並產生 Feed

接著，把想要追蹤的頻道或帳號網址丟進去，產生 RSS Feed。

![RSS.app 輸入來源網址](https://hackmd.io/_uploads/H1T-MmsZyx.png)

![RSS.app 產生 Feed](https://hackmd.io/_uploads/ryGSGXob1x.png)

> 製作好 RSS Feed 之後，按下 **Save To My Feeds**。

![RSS.app 儲存 Feed](https://hackmd.io/_uploads/rkJozXj-1x.png)

---

### 取得 RSS Feed URL

最後會得到 RSS Feed 的網址，也就是我們熟悉的 XML 檔。

![RSS.app 取得 RSS Feed URL](https://hackmd.io/_uploads/BkW2GQs-Jx.png)

> 複製這個網址後，就可以拿去餵給你的 RSS Reader，例如 Feedly。
>
> 接下來的操作就跟前面 Feedly 的訂閱流程一樣。

---

### 實際成果

完成後，就可以在 Feedly 中看到透過 RSS.app 建立的訂閱來源。

![Feedly 實際訂閱成果](https://hackmd.io/_uploads/BkHC7Qj-kg.png)

---

## 小結

RSS Reader 的核心價值，是讓你重新掌握資訊來源。

透過 RSS Reader，你可以：

- 自己決定要看哪些內容
- 避開社群平台演算法干擾
- 將 YouTube、Instagram、Threads、網站更新整合在同一個閱讀器
- 建立屬於自己的資訊流與知識管理入口

簡單來說：

> RSS 不是過時技術，而是一種「資訊主權」工具。

---
