---
title: A004 Suno AI
---

# Suno AI

## 創造屬於自己的音樂

### 基礎知識

1. Suno AI 雖然可以直接使用對歌曲的**描述**創造相關的音樂或歌曲，但這樣並不夠客製化。BTW，Instrumental 這個 Switch 是用來切換僅樂器聲與否，這即是說，如果你不要歌曲，要消去人聲可以把它選起來。

![image](https://hackmd.io/_uploads/SJP1TRGzyg.png)

2. 在 Suno AI 中，我們可以看到模型的版本，越新的自然可理解為越強的模型，雖然 v3.5 可以長到四分鐘，但我們也可以用 v3 的兩分鐘再去加長。

![image](https://hackmd.io/_uploads/BJiu6Affke.png)

3. 進到 Custom，我們可以看到幾個區塊，第一個是 Lyrics (歌詞)，接著是 Style of Music (音樂風格)，再來是 Persona (人物模板)，最後一個是 Title (歌曲名)。

4. Persona 是一個進階使用者 (需要付費)的功能，可以創造專屬的歌手。

![image](https://hackmd.io/_uploads/rkUIkJXMJl.png)

5. 我們先了解音樂風格的作用，再進到 Lyrics 的標籤 (tag)，進到 [music style 官方文件](https://www.suno.wiki/faq/style-and-lyrics/styles-and-genres/)後，我們可以看到裡面各種音樂風格，而文件也說了不可能涵蓋所有世界上的音樂類型。

![image](https://hackmd.io/_uploads/H1o_lJ7Myg.png)

:::success
在這邊可以看到三種 music style 的項目，Style 是**風格**，Genre 是**類型**，Type 則是**類別**。

一般來說，Genre 用於嚴格定義的分類，而 Type 則比較大眾化的分類，約定俗成。
:::

:::info
從 Style 裡面，我們可以看到各種形容詞，例如 Danceable、Dark 等等，如果對音樂風格沒有概念，可以將 Style 鍵入 Youtube 搜尋欄位，當然沒有概念更難驗證是不是找到的歌曲就是屬於 Danceable 的 Groovy，還可以到 [sonoteller](https://sonoteller.ai/) 這個網站上將搜尋到的連結貼上。
:::

![image](https://hackmd.io/_uploads/S1LhPJ7zyl.png)

:::warning
凡事沒能盡善盡美，sonoteller 容易達到 daily limit，所以我們可以找替代方案，例如 [SubmitHub](https://www.submithub.com/)。
:::

:::info
在 SubmitHub 裡，一樣可以貼上連結去分析音樂，從下方圖片來看，裡面就包含了多種類型，Dance Pop 機率最高，如果還是不確定，就從下方點選看看是不是你要的音樂，描述不來，我們總能用聽的吧？
:::

![image](https://hackmd.io/_uploads/S1TIqyXMkg.png)

![image](https://hackmd.io/_uploads/BJ7op17fyl.png)

再來是 Genre 跟 Type，Genre 裡面有 Electric、Jazz/Soul 這就相當好懂，而 Type 裡面就有 Composer (合成器) 等。

---

### Meta Tags

1. 接著要講到 Lyrics 內使用的 Tag，如果想要將歌曲客製化成自己喜歡的樣子，我們可以先參照下面的 Tag。

:::info
[Start]
[Instrumental Intro]
[Verse - Taiwanese]
**你的歌詞**
[Verse 2 - Taiwanese]
**你的歌詞**
[Verse 3 - Taiwanese]
**你的歌詞**
[Guitar Solo]
[Chorus - Taiwanese]
**你的歌詞**
[Instrumental Bridge]
[Verse 4 - Taiwanese]
**你的歌詞**
[Instrumental Outro]
[End]
:::

### 版權問題？

1. 下方節錄至維基百科。

> 法律問題
> 在 2024 年 6 月，由美國錄音工業協會主導的訴訟對 Suno 和 Udio 提出，指控其大規模侵犯版權音樂錄音。該訴訟試圖禁止這些公司在版權音樂上進行訓練，並要求對已經發生的侵權行為索賠最高 150,000 美元的賠償。[9][10]

2. 由於模型的訓練並不會公開，所以錄音工會的主張是裡面一定有版權物，不然不可能有大數據，過去 AI Model 不夠強可能有幾點，一是算力不夠強，二是數據不夠多，現在備齊了，可以說是社會氛圍與軟硬體兼備，那麼就是技術成果的展現了。

3. 但由於法律本來就跟不上技術發展，所以必須要等看將來如何修正。

4. 在這個大前提下，訓練模型的大公司才會是標的，使用模型的使用者則不需要擔心這點，可以盡情產出拿去使用，目前就當作全民公測中。

### 各種 Meta Tags 介紹

1. [Verse] vs. [Chorus]，Verse 是主歌，是一首的主要調性，在進到歌曲澎拜之前的起與承。

2. 情感描述 - 在 Suno AI 中，教學文章告訴我們使用 [Sad Verse]、[Happy Chorus] 來去描述主歌與副歌，如果希望主歌是有哀傷的調性使用 Sad，比方說周杰倫的《黑色毛衣》就是 Sad，如果是《告白氣球》則是 Happy。

3. 音樂流派 - 在 Suno AI 中，直接使用 [Rapped Verse] 可以造出 Rap 歌曲風格，[Powerpop Chorus] 可以造出一種搖滾風格。

4. [Pre-chorus] 是在進到 [Chorus] 的連接，等進到 [Chorus] 時會更感覺澎湃，以周杰倫的《龍族戰士》而言，歌詞在『對敵人謙卑，抱歉，我不會，而遠方龍戰於野；咆哮聲不自覺，橫越過了幾條街」，這一段就是 Pre-chorus。

5. 而我們可以用各種形容詞標籤來將歌詞拆分出來，例如 [Shout] 表示這段歌詞要咆哮，[Melancholy] 來表示這段歌詞是憂鬱的等等，這種標籤的使用法叫做 [Bridge]。

> 參照 [Suno AI Docs](https://www.suno.wiki/faq/metatags/pre-chorus-and-bridge/)

6. 歌曲結構標籤，[Intro] 代表開場；[Hook] 是一首歌代表性印記，比方說你的歌名叫做《風鈴》，在 [chrous] 的最後一句可能是 「風鈴不再隨風搖曳」，這句就是 [Hook]；[Break] 是停頓之處；[Interlude] 表示間奏；[Outro] 就是歌曲的結尾，可以是留下懸念又重複一次，這時候我們會用 [Outro]、[Refrain]、[Big Finish] 來安排，舉例來說，王力宏的《你不在》最後三句 「像空氣般不存在的存在，在沒有痕跡的愛 你不在，當我需要你的愛 你不在」就是如此；[End] 表示你要如何結束這首歌，跟剪輯的 Fade 一樣用法，[Fade Out]、[Fade to End]。

7. 接著是 instrumental tags，即是用來調整樂器的 meta tags，可以參照 [Suno AI Docs](https://www.suno.wiki/faq/metatags/instrumental-tags/)，

:::info
在樂器標籤這裡很有趣，不僅僅是透過描述來調整樂器，還能讓樂器有節奏感，尤其如下：

**[Percussion Break]**
. .! .. .!
!! ... ! ! !
:::

:::success
這個點跟驚嘆號，是擊打的節奏，很有趣吧？
:::

:::info
還可以參照如下：

[Break] 停頓處
[Instrumental Interlude] 樂器間奏
[Melodic Bass] 有旋律的貝斯
[Percussion Break] 擊打的停頓
[Fingerstyle Guitar Solo] 吉他的指技
:::

8. 剩下的可以參照 [Suno AI Docs](https://www.suno.wiki/faq/metatags/voice-tags/)，裡面講到我們可以直接提示換掉預設的人聲，例如使用 [Female Narrator]、[Diva Solo] 等。

:::warning
為什麼需要換掉？這是因為 Suno AI 告訴我們 Hip-Hop 人聲常見都市男性；鄉村音樂帶有西方口音；流行樂跟 Jazz 通常會出現女性聲音。
:::

最後，如果想知道更多 Suno AI 的技巧，可以參照 [Suno Wiki](https://www.suno.wiki/)。

---

### 實際範例

1. 透過一小段話作為發想，讓校園狗狗的描述變成一首 Rap 歌曲。

:::info
[Start]
[Instrumental Intro]
（節奏感強烈的 Beat，帶點輕快的鼓點和電子音效，引領出自由而快樂的氛圍。）

[Verse - Taiwanese]
Yo yo yo，來聽我說
大學裡的狗狗不是普通的狗
牠們每天過得超級爽快
大學生都把牠們當作心頭愛
餵牠吃零食、陪牠散步
每個人看到牠都露出微笑滿足
牠們走在校園，像是國王般霸氣
同學們都搶著來，和牠打打氣

[Verse2 - Taiwanese]
牠們不用擔心，有大學生做後盾
每次經過教室，牠們就像有粉絲群
有人幫牠撐傘、有人幫牠抓癢
生活過得簡直像是夢中天堂
Yo，大學狗，生活沒煩惱
牠們有愛心大學生，當牠們的靠山
這裡是牠們的快樂樂園
每天都被呵護，享受這種特權

[Verse3 - Taiwanese]
在草地上躺平，曬著太陽光
旁邊的大學生給牠滿滿的能量
牠們像天使般被照顧，無微不至
這裡的生活真是沒得挑剔
喔，當大學狗真的好幸福
吃好、睡好，無憂無慮過每一步
同學們的愛心不只給人
牠們的愛也分給這些毛茸朋友

[Guitar Solo]
（加入電吉他 Riff，帶出律動感，像是狗狗奔跑自由的瞬間。）

[Chorus - Taiwanese]
大學狗，每天爽爽過
被大學生寵愛，不用擔心餓
牠們都是天使狗，受愛心呵護
校園裡，每天都是幸福的漫步

[Instrumental Bridge]

[Verse4 - Taiwanese]
牠們在大學像個超級巨星
大家爭相來拍照，牠的生活最chill
Yo，這種生活誰不羨慕？
被呵護得像是大學裡的寶物
Yo yo yo，大學狗不簡單
天使學生們，每天愛心不斷
這裡是牠們的天堂，不用擔心
這種日子，牠們過得超安心

（節奏減慢，加強 Bass 和鼓點，增添沉浸感。）

[Instrumental Outro]
（輕柔的鋼琴和吉他結束，帶來溫馨的餘韻。）

[End]

:::

2. 大家可以參照這樣的方式去安排自己的 Meta Tags，最後的最後是 [音樂參照](https://suno.com/song/32023c94-abde-46b2-9cb6-5760ddfa52c5)。
