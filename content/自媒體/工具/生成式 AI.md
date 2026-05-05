---
title: 生成式 AI 概論
tags: [自媒體, AI, 工具]
---

# 生成式 AI

## 重新申請一個 Google 帳號

未免與自己本來的帳號相衝突，或社群操作時，影響到本來的帳號，建議申請一個新的 Google 帳號，每當使用新服務時，就利用此帳號登入。

## 對話機器人

### 緣起

1. 大型語言模型 (**LLM**)是利用機器學習、深度學習的數學原理，訓練出來的模型。
2. 我們希望輸入問題，得到答案，而模型的作用為輸入泛用、類似問題，能得到泛用解答。
3. 現有對話機器人 (如 **ChatGPT**)，都是使用一個介面，無論網頁介面、手機 APP 介面來做應答，而 LLM 是這個介面的基礎建設。
4. 對話機器人的白話解釋，就是一個**文字接龍**的工具。

---

### 使用

1. 由於 LLM 訓練時有使用各種技術，詞嵌入 (Word Embedding)、注意力機制 (Attention Mechanism)⋯⋯等，所以對特殊詞語會特別敏銳，如：「**逐步分析**」做為發語詞，就會獲得看似仔細閱讀前後文的結果。
2. prompt (提詞、指令)，如同 Google 搜尋引擎，有好的提詞，就像是問對關鍵字一樣，會得到更好的結果。
3. [**提詞大全**](https://www.explainthis.io/zh-hant/chatgpt)
4. [HuggingChat](https://huggingface.co/chat/)
5. [ChatGPT](https://chatgpt.com/)

---

### 額外補充

1. 如果你想要生成的內容包括了商業機密，不希望資料 (**文字**) 連網打到伺服器，在這個疑慮的前提下，可以考慮**自架**對話機器人。
2. [自架參考文章](https://cowton0517.medium.com/%E4%BD%BF%E7%94%A8-ollama-%E8%AE%93%E4%BD%A0%E5%9C%A8%E6%9C%AC%E6%A9%9F%E8%B7%91%E5%A4%A7%E5%9E%8B%E8%AA%9E%E8%A8%80%E6%A8%A1%E5%9E%8B-%E4%BD%BF%E7%94%A8-open-webui-%E8%AE%93%E5%AE%83%E6%9B%B4%E5%83%8F%E7%B6%B2%E9%A0%81%E7%89%88%E7%9A%84-chatgpt-6f08b1459745)

## 繪圖機器人

### 緣起

1. 對話機器人是 text to text (文字轉文字)的機器學習模型的應用，而**繪圖機器人**則是 text to image (文生圖)，或 image to image (圖生圖)的應用。
2. 在這個前提下，有一個相當有名的模型叫做 stable diffusion，就連著名的 Midjourney 繪圖機器人的基底也是 stable diffusion。
3. 生圖模型的原理可理解為，對像素分類並作矩陣運算，接著處理，這是 CNN (卷積神經網路)在做的事。
4. 我們在圖像加上遮罩，接著還原，重複這個過程，即是重繪生成。

### 使用

1. [Stable Diffusion 3.5 Large (8B)](https://stabilityai-stable-diffusion-3-5-large.hf.space/)
2. [Stable Diffusion 2.1 Demo](https://huggingface.co/spaces/stabilityai/stable-diffusion)
3. [Stable Diffusion Online](https://stablediffusionweb.com/)

### 注意事項

1. 由於生圖指令並不如一般所想的「請幫我畫出晚宴上的蛋糕」這般容易。

![Screenshot 2024-10-30 at 5.01.55 PM (2)](https://hackmd.io/_uploads/Byr0LukZJl.png)

>[!warning]
>因為 ChatGPT 是經過多工串接到 DALLE (繪圖機器人)，所以其實是將使用者與之的對話轉換成適合餵給繪圖機器人的 prompt 後，再由繪圖機器人生出圖片，但**前一個過程**我們看不到。


2. 所以一般在餵給繪圖機器人前，可使用對話機器人將你的白話文轉化為適合餵給繪圖機器人的 prompt 再餵。
![image](https://hackmd.io/_uploads/SJAn_uJ-Jx.png)


從 ChatGPT 得到的 prompt，餵給其他以 stable diffusion 為基底的繪圖機器人，得到如下：
![Screenshot 2024-10-30 at 5.17.04 PM](https://hackmd.io/_uploads/rkjGqdkW1x.png)

### 額外補充

1. 如果你想要生成的內容包括了商業機密，不希望資料 (**文字**、**圖片**) 連網打到伺服器，在這個疑慮的前提下，可以考慮**自架**繪圖機器人。
2. [自架參考文章](https://cowton0517.medium.com/%E4%BD%BF%E7%94%A8-comfyui-%E4%BE%86%E7%94%9F%E6%88%90%E5%9C%96%E7%89%87-%E5%86%8D%E5%B0%87%E5%85%B6%E5%B0%8E%E5%85%A5-open-webui-%E4%B8%AD-%E8%AE%93%E4%BD%BF%E7%94%A8%E6%9B%B4%E5%8A%A0%E7%9B%B4%E8%A7%80-fafe5e1f0bb2)

## 簡報機器人

### 緣起

1. 任何人都有機會再用到**簡報**，簡報並非離開學校以後便可拋棄的技能。
2. **企劃案**，無論是申請補助或是在重要場合，例如演講、創作者大會、行前會，都是有準備必要的，其重要目的在於「溝通」。如何說服電視台、業主、單位買下 / 提供資金給你，除了在企劃案中述說理念之外，還需具備的是**團隊執行能力**，這即是你的 credit。
3. 回想課程主題[將一句話描述地清晰可見](https://wordpress.com/post/clc914806616.wordpress.com/6)，如果要跟人述說你想拍什麼，描述就顯得相當重要，除非你想要自己走出去隨手就拍，但是隨手拍攝、一個人作業時常會變得勞累，或是變得不那麼有趣、不容易吸睛，所以學會**述說故事**是相當重要的一件事。
4. 簡報即是將欲述說的故事切分成**起**、**承**、**轉**、**合**四個段落。

---

### 使用

1. [Gamma AI](https://gamma.app/)
2. 點選新建 AI
   ![image](https://hackmd.io/_uploads/rJKNio-Zkl.png)
3. 接著有三個選項，如果你已經擬出簡報的起承轉合，那簡報工具就只是幫你把**擬好的段落**產出簡報，這時選最左邊的「貼上文字」即可；如果你想要簡報工具直接幫你產出段落 (**起承轉合**)，那麼，選則中間的「產生」即可。
   ![image](https://hackmd.io/_uploads/SkDUsjZWkx.png)

4. 最終產出的結果可透過網址分享出來，或者直接匯出檔案。
   ![image](https://hackmd.io/_uploads/ryU5GaZbyl.png)

![image](https://hackmd.io/_uploads/SJeJXTbWke.png)

![image](https://hackmd.io/_uploads/Sk_-Qa--1g.png)

5. 簡單操作流程可參考[影片](https://www.youtube.com/shorts/8omzDx2rGOY)
