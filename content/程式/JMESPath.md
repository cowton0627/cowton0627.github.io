---
title: JMESPath 筆記
tags: [程式, CLI, JMESPath]
---

# JMESPath 筆記
> 分享者: [CLC](https://medium.com/@cowton0517)

## 一、緣起

在使用 CLI 時，我們常使用到 `| grep`，grep 是為了方便你在指令中查找列出來的**特定內容**。

比方說，我想要在一大群資料夾、檔案中，找到一個特定關鍵字的所有資料夾或檔案名稱，比方如下：

```
% pip3 list | grep soup
```
會得到

```
beautifulsoup4           4.12.2
soupsieve                2.4.1
```
使用 Python3 的套件管理工具 pip3 來查找大數據常用的`美人湯`（Beautiful Soup），你不用為每個字記得一清二楚，透過 `|`（pipe）+ `grep` 就可以很簡單搜出該關鍵字，這裡的關鍵字是 **soup**。

---

然而，透過前段我們了解到，pip3 是 Python3 的套件管理工具，而 pip3 是管理工具的`指令頭`，可以想見如果指令的結果相當複雜，比方說列表中的實體有多個屬性，例如學生的**年齡**、所在**班級**、**班導師**，這些存在資料庫的檔案**特性**理應有一個不重複的、唯一的標示碼（UUID），而檔案通常也是 **JSON** 格式。

那麼，我們要列出特定的資訊只使用 **| grep** 可說是相當不夠的，這時候可以透過查詢語言。

## 二、查詢語言

**JMESPath**，JavaScript Object Notation (JSON) Matching Expressions Path，一種查詢語言，用來篩選轉換 JSON 中的數據，方便你查找。

例如在 AWS，我們可以透過 AWS CLI 列出裝置憑證：
```
% aws iot list-certificates
```
此時會得到
```
{
    "certificates": [
        {
            "certificateArn": "arn:aws:iot:ap-southeast-2:accountID:cert/certificateID",
            "certificateId": "certificateID",
            "status": "ACTIVE",
            "creationDate": "2024-02-21T15:40:27.343000+08:00"
        },
```
但裝置憑證不若 CA 憑證，一定是**海量**的，所以一次列出大筆資料在 CLI 中呈現，眼睛也是過濾不來，加上這段指令會列出 certificateArn、certificateId、status、creationDate 這些項目，如果只是要找剛創建的憑證，那麼，也許我們就可以用 creationDate 去做篩選。

不過上面三個 Attribute，卻只有 status 的值是相當明確的，它只有 **INACTIVE**、**ACTIVE**、**PENDING_ACTIVATION** 這幾種狀態，所以我們透過**查詢語句**試著找到 PENDING_ACTIVATION 狀態的憑證。

PENDING_ACTIVATION 表示裝置憑證被簽署時一開始是 INACTIVE 的（未設定 ACTIVE），當它第一次連上 AWS 時，就會被設定為**準備啟用**的狀態，我們可以用下面指令來查找：
```
% aws iot list-certificates --query 'certificates[?status==`PENDING_ACTIVATION`]'

```
後面的 --query 表示在這個 list 中有要搜尋的項目，我們以 ?status=\`PENDING_ACTIVATION\` 表示要 query 的是 status，它的值是 PENDING_ACTIVATION，所以這段指令意思是我要去找到**狀態是等待啟用**的憑證。

最終結果如下：
```
[
    {
        "certificateArn": "arn:aws:iot:ap-southeast-2:AccountID:cert/certificateID",
        "certificateId": "certificateID",
        "status": "PENDING_ACTIVATION",
        "creationDate": "2024-02-21T15:40:27.343000+08:00"
    }
]
```
順利找到想要的憑證了！