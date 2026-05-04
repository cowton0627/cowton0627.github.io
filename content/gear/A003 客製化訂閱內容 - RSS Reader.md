---
title: A003 客製化訂閱內容 - RSS Reader

---

# RSS Reader
## RSS Feed
### 緣起
要了解 RSS Feed 最快的方法還是先透過 RSS Reader，RSS Reader 可以理解為一個訂閱 XML 的閱讀器，每當創作者更新內容時，閱讀器會即時通知。

這即是說透過這個閱讀器，你可以排除掉各種社群的不必要的推播，只專注在想看的內容上面。

如果想知道在 iOS 上，如何自己寫一個 RSS Reader，參考 [Xcode - RSS 裡的 XML](https://cowton0517.medium.com/37-d-n-xcode-rss%E8%A3%A1%E7%9A%84xml-9498ce1fc2b) 這篇文章。

---

### 使用
1. 以常見的 Feedly 舉例，直接用手機做操作。

![image](https://hackmd.io/_uploads/S1hNDZoZ1x.png)

:::info
前一張圖是所有更新的訂閱內容，下一張是分類中所有訂閱的頻道。
:::

![image](https://hackmd.io/_uploads/BJBBv-ibke.png)

:::success
**Feedly** 即是一個 RSS Reader，在 **Feedly** 中，已經加入各種內容的 RSS 會呈現上圖的結果，若是內容有更新，將會收到通知。

並且可以新增分類，在分類中，加入你想要訂閱的內容。
:::

2. 首先，點到下方左邊數來第四順位的 Tab，搜尋內容，例如 BBC News。

![image](https://hackmd.io/_uploads/ByKwYZs-yg.png)


接著，我們看到各種內容，選擇想要的點選右邊的 **+** 就可以訂閱，並且設定分組了，如果想要同一個內容在不同分組出現，也是 OK 的。

如此一來，使用 RSS Reader 世界就變得相當美好了，不是嗎？

---

### 議題

:::warning
然而，有一些內容無論你怎麼搜尋都是搜尋不到的，比方說某個特定的 Youtube 頻道，或是某個特定的 IG、Threads 的帳號，這時候應該怎麼做呢？

我們就會使用 **RSS 產生器**，這個產生器的原理即是定時去爬使用者有沒有更新內容，然後附加回 XML 檔，所以訂閱由它產生的 XML，即是訂閱使用者了。
:::

---

### 接著使用
1. 我們可以使用 [RSS.app](https://rss.app/) 來產生 RSS Feed。

![image](https://hackmd.io/_uploads/HyWGy7s-ke.png)

:::success
同樣地，在這個網站上已經有許多 RSS Feed，這是我分別從各個帳號 (頻道) 去產出的 RSS Feed，有來自 Threads、Instagram、Youtube 的內容。
:::

2. 首先，從左邊頁籤看到下方有一個 **+ New Feed**，把它點下去。

![image](https://hackmd.io/_uploads/HyFeJQjWJl.png)

:::info
接著，我們可以看到玲瓏滿目的它支援的內容，往下拉還有。
:::

![image](https://hackmd.io/_uploads/Skzg-Xs-Jg.png)

:::info
然後就可以去將各種頻道的內容丟進去產生 RSS Feed，如下。
:::

![image](https://hackmd.io/_uploads/H1T-MmsZyx.png)

![image](https://hackmd.io/_uploads/ryGSGXob1x.png)

:::info
製作好 RSS Feed，按下 Save To My Feeds。
:::

![image](https://hackmd.io/_uploads/rkJozXj-1x.png)

:::success
最後就會得到 RSS Feed 的網址，當然，也是我們熟悉的 XML 檔。
:::

![image](https://hackmd.io/_uploads/BkW2GQs-Jx.png)

:::success
Copy 這個網址就可以拿去餵到你的 RSS Reader，如剛才的 Feedly，剩下的操作跟開頭的教學一樣。
:::

---

### 實際成果

![image](https://hackmd.io/_uploads/BkHC7Qj-kg.png)

---
