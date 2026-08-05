---
title: JMESPath 筆記
tags: [程式, CLI, JMESPath]
created: 2026-05-05
---

# JMESPath 筆記

> 從 `| grep` 到 JMESPath。當 CLI 指令的輸出是結構化的 JSON 時，純粹用 grep 找字串會非常笨拙；JMESPath 是專為 JSON 設計的查詢語言，可以做欄位選取、條件過濾、資料轉換。AWS CLI、Azure CLI、kubectl 等都內建支援。
>
> 分享者：[CLC](https://medium.com/@cowton0517)

## 一、緣起

在使用 CLI 時，我們常使用到 `| grep`，grep 是為了方便在指令輸出的列表中查找**特定內容**。

比方說，我想要在一大群套件中找到一個特定關鍵字，可以這樣寫：

```bash
$ pip3 list | grep soup
beautifulsoup4           4.12.2
soupsieve                2.4.1
```

使用 Python3 的套件管理工具 `pip3` 來查找大數據常用的 **Beautiful Soup**，你不用為每個字記得一清二楚，透過 `|`（pipe）+ `grep` 就能輕鬆搜出 **soup** 這個關鍵字。

---

然而，當指令的結果**結構複雜**時 —— 例如列表中的每個實體有多個屬性（學生的年齡、班級、班導師⋯⋯），而這些屬性各有自己的欄位名稱與唯一識別碼（UUID），輸出通常會是 **JSON** 格式。

這時候只用 `| grep` 就嚴重不夠了 —— grep 是基於文字行的，它不懂 JSON 結構，無法做欄位過濾、條件判斷、嵌套查找。**這就是查詢語言登場的時刻。**

## 二、JMESPath：JSON 的查詢語言

**JMESPath**（JavaScript Object Notation Matching Expressions Path）—— 一種專為 JSON 設計的查詢語言，用來篩選與轉換 JSON 數據。

### 實例：在 AWS IoT 中找特定狀態的憑證

例如在 AWS，可以透過 AWS CLI 列出裝置憑證：

```bash
$ aws iot list-certificates
```

回傳結果像這樣：

```json
{
    "certificates": [
        {
            "certificateArn": "arn:aws:iot:ap-southeast-2:accountID:cert/certificateID",
            "certificateId": "certificateID",
            "status": "ACTIVE",
            "creationDate": "2024-02-21T15:40:27.343000+08:00"
        },
        ...
    ]
}
```

但裝置憑證跟 CA 憑證不同，**動輒上百上千筆**。一次列出所有憑證在 CLI 中眼睛根本過濾不來。

每筆憑證有 4 個欄位（`certificateArn`、`certificateId`、`status`、`creationDate`），其中 `status` 的值最明確，只有 3 種：

- `INACTIVE`
- `ACTIVE`
- `PENDING_ACTIVATION`

> [!info] PENDING_ACTIVATION
> 憑證被簽署時起初是 INACTIVE，當它**第一次連上 AWS** 時，會自動轉為「準備啟用」的狀態。

我們想找出狀態為 `PENDING_ACTIVATION` 的憑證。透過 `--query` 參數套用 JMESPath：

```bash
$ aws iot list-certificates --query 'certificates[?status==`PENDING_ACTIVATION`]'
```

拆解這條查詢：

- `certificates` —— 進入頂層的 `certificates` 陣列
- `[?status==\`PENDING_ACTIVATION\`]`—— 過濾條件：只留下`status`等於`PENDING_ACTIVATION` 的元素
- 反引號 `` ` `` 用來包裹 JMESPath 字面量字串（**不是** shell 的反引號）

執行結果：

```json
[
  {
    "certificateArn": "arn:aws:iot:ap-southeast-2:AccountID:cert/certificateID",
    "certificateId": "certificateID",
    "status": "PENDING_ACTIVATION",
    "creationDate": "2024-02-21T15:40:27.343000+08:00"
  }
]
```

順利找到想要的憑證。

## 三、常用語法速查

| 語法                    | 用途                     | 範例                          |
| ----------------------- | ------------------------ | ----------------------------- |
| `a.b.c`                 | 嵌套欄位存取             | `metadata.name`               |
| `[0]`                   | 陣列索引（從 0 起）      | `users[0]`                    |
| `[-1]`                  | 倒數第一個               | `users[-1]`                   |
| `[0:5]`                 | 切片                     | `users[0:5]`                  |
| `[*]`                   | 攤平整個陣列             | `users[*].email`              |
| `[?expr]`               | 條件過濾                 | `users[?age > \`18\`]`        |
| `[].{...}`              | 投影：重組欄位           | `users[].{n: name, e: email}` |
| `\|`                    | 管線（前段結果交給後段） | `users[?active] \| [0]`       |
| `length(@)`             | 計數                     | `length(users)`               |
| `sort_by(@, &k)`        | 依某欄位排序             | `sort_by(users, &age)`        |
| `keys(@)` / `values(@)` | 取所有 key / value       | `keys(metadata)`              |

> [!warning] Shell 的反引號陷阱
> 反引號 `` ` `` 在 JMESPath 裡用來包裹**字面量**（字串、數字）。在 shell 裡記得用**單引號** `'…'` 把整個 JMESPath 表達式包起來，避免反引號被 shell 當成 command substitution。

### 多個常見模式

```bash
# 只要 ACTIVE 狀態的憑證 ID
aws iot list-certificates \
  --query 'certificates[?status==`ACTIVE`].certificateId'

# 取最近 5 筆，按 creationDate 倒序
aws iot list-certificates \
  --query 'reverse(sort_by(certificates, &creationDate))[:5]'

# 重組成簡潔的表格欄位
aws iot list-certificates \
  --query 'certificates[].{ID: certificateId, Status: status, Date: creationDate}' \
  --output table
```

## 延伸閱讀

- [JMESPath 官方網站](https://jmespath.org/) —— 含互動式 [Tutorial](https://jmespath.org/tutorial.html) 與 [Specification](https://jmespath.org/specification.html)
- [AWS CLI：Filtering with `--query`](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html)
- [Azure CLI：JMESPath query examples](https://learn.microsoft.com/en-us/cli/azure/query-azure-cli)
- 類似的查詢語言：[`jq`](https://jqlang.github.io/jq/) —— JMESPath 之外另一個常見的 JSON 處理工具，獨立工具，語法不同但目的類似
