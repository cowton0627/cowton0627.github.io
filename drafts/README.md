# drafts/

本機草稿 — 從 `sources/` 整理過，但還沒準備好放到 `content/` 公開的筆記。

## 用途

工作流中的「處理中」階段：

```
sources/  →  drafts/  →  content/
 (原料)     (重寫中)    (公開)
```

## Git 策略

**內容不進 git**（見專案根 `.gitignore`）。只有 `README.md` 和 `.gitkeep` 會被追蹤。

理由：
- repo 是公開的（GitHub Pages 來源），未完成的草稿不該被外人看到
- 草稿來來去去，commit 歷史會充滿無意義的 WIP

## 與 Quartz 的 `RemoveDrafts` 機制不衝突

Quartz 有 `Plugin.RemoveDrafts()` 已啟用 —— 那個是檢查 **`content/` 內檔案的 frontmatter `draft: true`**，用於「已經寫成 article 但暫不發佈」的場景。

此資料夾在更早期：「**還不確定要不要寫成 article**」，連 frontmatter 都還沒寫的階段。兩個機制並存。
