---
title: 生成式 AI - Suno AI
tags: [自媒體, AI, 音樂, 工具]
created: 2026-05-04
---

# Suno AI

## 創造屬於自己的音樂

### 基礎知識

Suno AI 可以直接透過「歌曲描述」產生音樂或歌曲，不過如果只使用描述，通常不夠客製化。

如果想要更精準地控制歌曲內容、段落、風格與人聲，就需要使用 **Custom** 模式。

---
#### Instrumental

**Instrumental** 這個 Switch 是用來切換是否只產生樂器聲。

也就是說，如果你不需要歌曲人聲，只想產生純音樂，就可以把 Instrumental 打開。

![image](https://hackmd.io/_uploads/SJP1TRGzyg.png)

---

### 模型版本

在 Suno AI 中，可以看到模型版本。

一般來說，越新的模型可以理解為能力越強。例如 v3.5 可以產生較長的歌曲，約可長到四分鐘。

不過實際使用時，也可以先用 v3 產生約兩分鐘的版本，再透過延長功能繼續加長。

![image](https://hackmd.io/_uploads/BJiu6Affke.png)

---

### Custom 模式

進到 **Custom** 之後，可以看到幾個主要區塊：

1. **Lyrics**：歌詞
2. **Style of Music**：音樂風格
3. **Persona**：人物模板
4. **Title**：歌曲名稱

其中，**Persona** 是進階使用者功能，需要付費使用，可以用來創造專屬歌手或固定的人聲角色。

![image](https://hackmd.io/_uploads/rkUIkJXMJl.png)

---

## 音樂風格：Style、Genre、Type

在進入 Lyrics 的標籤設定之前，可以先了解音樂風格的作用。

進到 [music style 官方文件](https://www.suno.wiki/faq/style-and-lyrics/styles-and-genres/) 後，可以看到裡面列出了各種音樂風格。不過官方文件也有說明，不可能涵蓋世界上所有音樂類型。

![image](https://hackmd.io/_uploads/H1o_lJ7Myg.png)

> 在 music style 裡面，可以看到三種常見項目：
>
> - **Style**：風格
> - **Genre**：類型
> - **Type**：類別
>
> 一般來說，**Genre** 用於比較嚴格定義的音樂分類，而 **Type** 則比較像大眾化、約定俗成的分類。

---

### Style 的使用方式

從 Style 裡面，可以看到各種形容詞，例如：

- Danceable
- Dark
- Groovy

如果對音樂風格沒有概念，可以先將 Style 關鍵字丟到 YouTube 搜尋。

不過，若本來就不熟悉音樂類型，也很難驗證搜尋到的歌曲是否真的屬於該風格。

這時可以搭配音樂分析工具，例如 [Sonoteller](https://sonoteller.ai/)，把搜尋到的音樂連結貼上去分析。

![image](https://hackmd.io/_uploads/S1LhPJ7zyl.png)

> Sonoteller 容易達到 daily limit，所以也可以使用替代方案，例如 [SubmitHub](https://www.submithub.com/)。

---

### 使用 SubmitHub 分析音樂

在 SubmitHub 裡，也可以貼上音樂連結進行分析。

從下方圖片可以看到，它會分析出多種音樂類型，其中 **Dance Pop** 的機率最高。

如果還是不確定是不是自己要的音樂，就可以從下方推薦項目點進去聽。

描述不出來的風格，至少可以先用聽的方式確認。

![image](https://hackmd.io/_uploads/S1TIqyXMkg.png)

![image](https://hackmd.io/_uploads/BJ7op17fyl.png)

---

### Genre 與 Type

再來是 **Genre** 和 **Type**。

Genre 裡面的分類，例如：

- Electric
- Jazz / Soul

這些相對好理解。

Type 裡面則會出現像 **Composer** 這類比較偏功能或類別式的項目。

---

## Meta Tags

接著要介紹 Lyrics 內使用的 Tag。

如果想要將歌曲客製化成自己喜歡的樣子，可以先參照下面這種結構：

```
[Start]
[Instrumental Intro]

[Verse - Taiwanese]
你的歌詞

[Verse 2 - Taiwanese]
你的歌詞

[Verse 3 - Taiwanese]
你的歌詞

[Guitar Solo]

[Chorus - Taiwanese]
你的歌詞

[Instrumental Bridge]

[Verse 4 - Taiwanese]
你的歌詞

[Instrumental Outro]

[End]
```

### 版權問題？

下方內容節錄自維基百科：

> 法律問題  
> 在 2024 年 6 月，由美國錄音工業協會主導的訴訟對 Suno 和 Udio 提出，指控其大規模侵犯版權音樂錄音。該訴訟試圖禁止這些公司在版權音樂上進行訓練，並要求對已經發生的侵權行為索賠最高 150,000 美元的賠償。[9][10]

這裡的核心爭議在於：**模型訓練資料是否使用了受版權保護的音樂錄音**。

由於模型的訓練資料通常不會完整公開，因此錄音工會的主張是：如果模型沒有使用大量音樂資料，就不太可能生成這麼多不同風格的音樂。

過去 AI Model 不夠強，可能有幾個原因：

1. 算力不夠強
2. 數據不夠多
3. 模型技術尚未成熟

如今算力、數據與模型技術逐漸成熟，再加上社會對生成式 AI 的接受度提高，AI 音樂生成才開始變成一種明顯的技術成果。

不過，法律本來就常常跟不上技術發展，因此相關爭議仍需要等待後續訴訟結果與法規修正。

在這個大前提下，主要被追究的對象通常會是**訓練模型的大公司**。一般使用者如果只是使用模型產出音樂，目前不需要過度擔心；不過如果要商業使用，仍建議避免刻意模仿特定歌手、特定歌曲，並保留生成紀錄與平台授權條款。

---

### 各種 Meta Tags 介紹

#### Verse vs. Chorus

`[Verse]` 是主歌，通常是一首歌主要敘事與情緒鋪陳的段落。

在進到歌曲最澎湃的副歌之前，Verse 負責建立歌曲的背景、情緒與故事。

`[Chorus]` 是副歌，通常是一首歌最容易被記住、情緒最集中的段落。

簡單來說：

- `[Verse]`：主歌，負責鋪陳
- `[Chorus]`：副歌，負責高潮與記憶點

---

#### 情感描述

在 Suno AI 中，可以使用情感標籤描述主歌與副歌，例如：

```text
[Sad Verse]
[Happy Chorus]
```

如果希望主歌帶有哀傷的調性，可以使用 `[Sad Verse]`。

例如：

- 周杰倫《黑色毛衣》可以理解為偏 Sad 的情緒方向
- 周杰倫《告白氣球》則比較接近 Happy 的情緒方向

---

#### 音樂流派

在 Suno AI 中，也可以直接使用音樂流派標籤來影響段落風格，例如：

```text
[Rapped Verse]
[Powerpop Chorus]
```

- `[Rapped Verse]`：讓主歌偏向 Rap 歌曲風格
- `[Powerpop Chorus]`：讓副歌偏向 Power Pop / 流行搖滾風格

---

#### Pre-chorus

`[Pre-chorus]` 是進到 `[Chorus]` 之前的連接段落。

它的作用是讓情緒逐漸堆疊，等真正進到副歌時，會更有澎湃感。

以周杰倫《龍戰騎士》為例，歌詞中：

> 對敵人謙卑，抱歉，我不會  
> 而遠方龍戰於野  
> 咆哮聲不自覺，橫越過了幾條街

這一段就可以理解為 Pre-chorus 的功能。

---

#### Bridge 與形容詞標籤

我們也可以用各種形容詞標籤來拆分歌詞段落，例如：

```text
[Shout]
[Melancholy]
```

- `[Shout]`：表示這段歌詞要更像咆哮、喊出來
- `[Melancholy]`：表示這段歌詞帶有憂鬱情緒

這類標籤可以搭配 `[Bridge]` 使用，讓歌曲在中段產生轉折或情緒變化。

> 參照：[Suno AI Docs - Pre-chorus and Bridge](https://www.suno.wiki/faq/metatags/pre-chorus-and-bridge/)

---

#### 歌曲結構標籤

常見歌曲結構標籤如下：

```text
[Intro]
[Hook]
[Break]
[Interlude]
[Outro]
[End]
```

| 標籤 | 說明 |
| --- | --- |
| `[Intro]` | 開場 |
| `[Hook]` | 歌曲中最有記憶點的句子或段落 |
| `[Break]` | 停頓、節奏中斷或轉換 |
| `[Interlude]` | 間奏 |
| `[Outro]` | 結尾段落 |
| `[End]` | 指定歌曲結束 |

`[Hook]` 是一首歌的代表性印記。

比方說，你的歌名叫做《風鈴》，在 `[Chorus]` 的最後一句可能是：

> 風鈴不再隨風搖曳

這句就可以視為 `[Hook]`。

`[Outro]` 則是歌曲的結尾，可以是留下懸念，也可以重複一次主題。

如果要安排結尾，可以使用：

```text
[Outro]
[Refrain]
[Big Finish]
```

舉例來說，王力宏《你不在》最後三句：

> 像空氣般不存在的存在  
> 在沒有痕跡的愛，你不在  
> 當我需要你的愛，你不在

這種重複主題、逐漸收束情緒的段落，就可以理解為 Outro 的功能。

`[End]` 則表示你希望歌曲如何結束。它有點像剪輯裡的 Fade 用法，可以搭配：

```text
[Fade Out]
[Fade to End]
```

---

#### Instrumental Tags

接著是 Instrumental Tags，也就是用來調整樂器的 Meta Tags。

可以參照：[Suno AI Docs - Instrumental Tags](https://www.suno.wiki/faq/metatags/instrumental-tags/)

在樂器標籤裡面，有些不只是透過描述來調整樂器，還可以讓樂器產生節奏感。

例如：

```text
[Percussion Break]
. .! .. .!
!! ... ! ! !
```

> 這裡的點 `.` 和驚嘆號 `!`，可以理解為擊打節奏的提示。

還可以參照下面這些常用 Instrumental Tags：

```text
[Break]
[Instrumental Interlude]
[Melodic Bass]
[Percussion Break]
[Fingerstyle Guitar Solo]
```

| 標籤 | 說明 |
| --- | --- |
| `[Break]` | 停頓處 |
| `[Instrumental Interlude]` | 樂器間奏 |
| `[Melodic Bass]` | 有旋律的貝斯 |
| `[Percussion Break]` | 擊打的停頓 |
| `[Fingerstyle Guitar Solo]` | 吉他的指技 |

---

#### Voice Tags

剩下的可以參照：[Suno AI Docs - Voice Tags](https://www.suno.wiki/faq/metatags/voice-tags/)

Voice Tags 可以直接提示模型換掉預設的人聲，例如：

```text
[Female Narrator]
[Diva Solo]
```

> 為什麼需要換掉預設人聲？
>
> 因為 Suno AI 可能會根據音樂類型套用常見預設：
>
> - Hip-Hop：常見都市男性聲音
> - Country：可能帶有西方口音
> - Pop / Jazz：通常比較容易出現女性聲音
>
> 如果不指定，人聲可能會受到模型預設風格影響。

最後，如果想知道更多 Suno AI 的技巧，可以參照 [Suno Wiki](https://www.suno.wiki/)。

---

### 實際範例

透過一小段話作為發想，讓「校園狗狗」的描述變成一首 Rap 歌曲。

```text
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
```

大家可以參照這樣的方式安排自己的 Meta Tags。

最後附上：[音樂參照](https://suno.com/song/32023c94-abde-46b2-9cb6-5760ddfa52c5)

---
