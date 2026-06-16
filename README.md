# Workbook 後台管理系統

個人學習管理後台，整合前端成長計畫與練習題庫。

---

## 技術棧

- React 18 + Vite
- Tailwind CSS + MUI Icons
- Firebase Authentication（Google 登入）+ Firestore
- React Router DOM
- GitHub Pages 部署

---

## 快速啟動

```bash
npm install
npm run dev       # 開發模式
npm run build     # 打包
npm run deploy    # 部署到 GitHub Pages
```

---

## AI 提示詞手冊

> 請 AI 做事時直接複製以下提示詞，替換 `[]` 的內容即可。

### 新增課題卡片

```
幫我在前端習題的卡片總覽頁面新增一張課題卡片。
課題名稱：[名稱]
副標題：[副標題]
說明：[說明文字]
標籤：[tag1, tag2, ...]
路由路徑：/frontend-practice/[英文路徑]
內容：[描述這個課題頁面要顯示什麼]

請參考 CLAUDE.md 的「新增一張課題卡片的步驟」來實作。
```

---

### 新增練習題目

```
幫我在 src/data/questions.js 的 DATA 陣列新增題目。
月份：[1-6]
週次：[1-4]
星期：[1-5，1=週一]
類型：[觀念題 / 程式題 / 任務題]
題目：[題目內容，可用 HTML]
答案：[答案內容，可用 HTML]
```

---

### 修改成長計畫內容

```
幫我修改 src/pages/PlanPage.jsx 中第 [N] 個月的內容：
- 學習重點：[修改為...]
- 每週安排：[修改為...]
- 驗收標準：[修改為...]
```

---

### 新增其他領域的卡片（非前端）

```
幫我新增一個新領域的課題卡片，這個領域和前端習題是平行的。
領域名稱：[名稱]
路由：/[領域英文名稱]-practice
卡片總覽路徑：/[領域英文名稱]-practice
第一個課題：[課題名稱]，路徑：/[領域英文名稱]-practice/[課題英文名稱]

請參考 CLAUDE.md 的卡片系統規則，並在完成後同步更新 CLAUDE.md 和 README.md。
```

---

### 修改側邊欄進度顯示

```
幫我修改 src/components/AdminLayout.jsx 的 CourseSidebar，
當路由在 /[路徑前綴]/ 時，顯示 [課題名稱] 的進度。
進度追蹤方式：[說明 localStorage 鍵值格式或其他方式]
```

---

### 修改卡片進度計算

```
幫我修改 src/pages/OverviewPage.jsx 中 [課題id] 卡片的進度計算邏輯。
目前計算方式：[說明]
希望改成：[說明]
```

---

### 部署到 GitHub Pages

```
幫我確認 GitHub Pages 部署設定是否正確，然後執行 npm run deploy。
我的 repo 名稱是 [repo 名稱]，請確認 vite.config.js 的 base 設定是否對應。
```

---

### 更新文件

```
我剛才做了以下修改：[說明修改內容]
請同步更新 CLAUDE.md 和 README.md，反映最新的專案規則。
```

---

## 路由結構

```
/frontend-practice              卡片總覽
/frontend-practice/dive-plan    六個月前端成長計畫
```

## 側邊欄行為

- 在卡片總覽頁：顯示一般導航選單
- 進入課題內部：切換為「卡片進度總覽」，顯示各月份練習完成度

## 進度追蹤

練習題庫的完成狀態儲存在 `localStorage`，格式為 `done_m{月}w{週}d{星期}=1`。
