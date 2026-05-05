# sources/

原始資料來源 — HackMD / Medium / 其他平台匯出的 markdown。

## 用途

從外部平台 export 出來、**還沒整理過**的原稿。屬於工作流的最上游：

```
sources/  →  drafts/  →  content/
 (原料)     (重寫中)    (公開)
```

## Git 策略

**內容不進 git**（見專案根 `.gitignore`）。只有 `README.md` 和 `.gitkeep` 會被追蹤，用來保留資料夾結構與用途說明。

理由：
- HackMD 原稿可能含私人筆記、學員資訊、未編輯措辭
- 匯出常含 base64 內嵌圖或外部圖連，commit 進去會肥
- 是單向流程，搬到 `content/` 之後就不再回頭改原稿
- HackMD 本身就是備份來源，不需要 repo 再多一份
